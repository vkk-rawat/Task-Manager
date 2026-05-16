import { Comment } from '../models/Comment.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { createActivity } from '../services/activity.service.js';
import { createNotification } from '../services/notification.service.js';
import { emitToProject } from '../services/socket.service.js';
import { normalizeTaskDoc, populateTask, refreshOverdueTasks } from '../services/task.service.js';
import { ApiError } from '../utils/ApiError.js';
import { projectContainsUser, sameId } from '../utils/access.js';
import { getTaskStatusFilterValues, normalizeTaskStatus } from '../utils/constants.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const populateTaskDoc = (task) =>
  task.populate([
    { path: 'assignedTo', select: 'name email role avatar' },
    { path: 'assignedBy', select: 'name email role avatar' },
    { path: 'project', select: 'title priority deadline members owner' },
    {
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: { path: 'user', select: 'name email role avatar' }
    }
  ]);

const ensureProjectAndAssignee = async (projectId, assignedToId) => {
  const [project, assignee] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedToId).select('_id name email')
  ]);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (!assignee) {
    throw new ApiError(404, 'Assigned user not found');
  }

  if (!projectContainsUser(project, assignee._id)) {
    throw new ApiError(400, 'Assigned user must belong to the selected project');
  }

  return { project, assignee };
};

const canReadTask = (task, user) => {
  if (user.role === 'admin') {
    return true;
  }

  return sameId(task.assignedTo, user._id) || projectContainsUser(task.project, user._id);
};

const canUpdateTaskStatus = (task, user) => {
  return user.role === 'admin' || sameId(task.assignedTo, user._id);
};

export const createTask = asyncHandler(async (req, res) => {
  const { project } = await ensureProjectAndAssignee(req.body.project, req.body.assignedTo);

  const task = await Task.create({
    ...req.body,
    assignedBy: req.user._id,
    attachments: req.body.attachments.map((attachment) => ({
      ...attachment,
      uploadedBy: req.user._id
    }))
  });

  await createActivity({
    actor: req.user._id,
    action: 'created a task',
    entityType: 'task',
    entity: task._id,
    project: project._id,
    task: task._id,
    metadata: { title: task.title }
  });

  await createNotification({
    recipient: task.assignedTo,
    actor: req.user._id,
    type: 'assignment',
    title: 'New task assigned',
    message: `${req.user.name} assigned you "${task.title}"`,
    link: `/tasks?task=${task._id}`
  });

  await populateTaskDoc(task);
  emitToProject(project._id, 'task:created', task);

  res.status(201).json({
    success: true,
    message: 'Task created',
    data: { task }
  });
});

export const getTasks = asyncHandler(async (req, res) => {
  await refreshOverdueTasks();

  const { q, status, priority, project, assignedTo, sort, page, limit } = req.query;
  const filter = {};

  if (req.user.role === 'member') {
    filter.assignedTo = req.user._id;
  } else if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  if (project) {
    filter.project = project;
  }

  if (status) {
    filter.status = { $in: getTaskStatusFilterValues(status) };
  }

  if (priority) {
    filter.priority = priority;
  }

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    populateTask(Task.find(filter).sort(sort).skip(skip).limit(limit)),
    Task.countDocuments(filter)
  ]);

  tasks.forEach((task) => normalizeTaskDoc(task));

  res.json({
    success: true,
    data: {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    }
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  await refreshOverdueTasks({ _id: req.params.id });

  const task = await populateTask(Task.findById(req.params.id));

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canReadTask(task, req.user)) {
    throw new ApiError(403, 'You do not have access to this task');
  }

  normalizeTaskDoc(task);

  res.json({
    success: true,
    data: { task }
  });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project', 'title members owner');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (req.user.role === 'member') {
    const fields = Object.keys(req.body);

    if (fields.some((field) => field !== 'status')) {
      throw new ApiError(403, 'Members can only update task status');
    }

    if (!canUpdateTaskStatus(task, req.user)) {
      throw new ApiError(403, 'You can only update your own task status');
    }
  } else {
    const nextProjectId = req.body.project || task.project._id;
    const nextAssigneeId = req.body.assignedTo || task.assignedTo;

    if (req.body.project || req.body.assignedTo) {
      await ensureProjectAndAssignee(nextProjectId, nextAssigneeId);
    }

    if (req.body.attachments) {
      req.body.attachments = req.body.attachments.map((attachment) => ({
        ...attachment,
        uploadedBy: req.user._id
      }));
    }
  }

  if (req.body.status) {
    req.body.status = normalizeTaskStatus(req.body.status);
  }

  const previousStatus = task.status;
  const previousAssignee = task.assignedTo;

  Object.assign(task, req.body);
  await task.save();

  await createActivity({
    actor: req.user._id,
    action: previousStatus !== task.status ? `moved a task to ${task.status}` : 'updated a task',
    entityType: 'task',
    entity: task._id,
    project: task.project._id || task.project,
    task: task._id,
    metadata: { title: task.title, previousStatus, status: task.status }
  });

  if (!sameId(previousAssignee, task.assignedTo)) {
    await createNotification({
      recipient: task.assignedTo,
      actor: req.user._id,
      type: 'assignment',
      title: 'Task reassigned',
      message: `${req.user.name} assigned you "${task.title}"`,
      link: `/tasks?task=${task._id}`
    });
  }

  normalizeTaskDoc(task);
  await populateTaskDoc(task);
  emitToProject(task.project._id, 'task:updated', task);

  res.json({
    success: true,
    message: 'Task updated',
    data: { task }
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  await Promise.all([Comment.deleteMany({ task: task._id }), Task.deleteOne({ _id: task._id })]);

  await createActivity({
    actor: req.user._id,
    action: 'deleted a task',
    entityType: 'task',
    entity: task._id,
    project: task.project,
    task: task._id,
    metadata: { title: task.title }
  });

  emitToProject(task.project, 'task:deleted', { _id: task._id });

  res.json({
    success: true,
    message: 'Task deleted'
  });
});

export const addTaskComment = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate('project', 'title members owner');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (!canReadTask(task, req.user)) {
    throw new ApiError(403, 'You do not have access to this task');
  }

  const comment = await Comment.create({
    task: task._id,
    user: req.user._id,
    content: req.body.content
  });

  task.comments.push(comment._id);
  await task.save();

  await createActivity({
    actor: req.user._id,
    action: 'commented on a task',
    entityType: 'comment',
    entity: comment._id,
    project: task.project._id,
    task: task._id,
    metadata: { title: task.title }
  });

  await createNotification({
    recipient: task.assignedTo,
    actor: req.user._id,
    type: 'comment',
    title: 'New task comment',
    message: `${req.user.name} commented on "${task.title}"`,
    link: `/tasks?task=${task._id}`
  });

  await comment.populate('user', 'name email role avatar');
  emitToProject(task.project._id, 'comment:created', { taskId: task._id, comment });

  res.status(201).json({
    success: true,
    message: 'Comment added',
    data: { comment }
  });
});
