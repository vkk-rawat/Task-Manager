import { Comment } from '../models/Comment.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { createActivity } from '../services/activity.service.js';
import { createNotification } from '../services/notification.service.js';
import { refreshOverdueTasks } from '../services/task.service.js';
import { ApiError } from '../utils/ApiError.js';
import { canAccessProject, getProjectAccessFilter, sameId } from '../utils/access.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const populateProject = (query) =>
  query.populate('owner', 'name email role avatar').populate('members', 'name email role avatar');

const populateProjectDoc = (project) =>
  project.populate([
    { path: 'owner', select: 'name email role avatar' },
    { path: 'members', select: 'name email role avatar' }
  ]);

const ensureUsersExist = async (memberIds = []) => {
  const uniqueIds = [...new Set(memberIds.map(String))];

  if (uniqueIds.length === 0) {
    return [];
  }

  const users = await User.find({ _id: { $in: uniqueIds } }).select('_id name email');

  if (users.length !== uniqueIds.length) {
    throw new ApiError(400, 'One or more project members do not exist');
  }

  return uniqueIds;
};

export const createProject = asyncHandler(async (req, res) => {
  const members = await ensureUsersExist(req.body.members);

  const project = await Project.create({
    ...req.body,
    owner: req.user._id,
    members
  });

  await createActivity({
    actor: req.user._id,
    action: 'created a project',
    entityType: 'project',
    entity: project._id,
    project: project._id,
    metadata: { title: project.title }
  });

  await Promise.all(
    members
      .filter((memberId) => !sameId(memberId, req.user._id))
      .map((memberId) =>
        createNotification({
          recipient: memberId,
          actor: req.user._id,
          type: 'project',
          title: 'Added to project',
          message: `You were added to ${project.title}`,
          link: `/projects/${project._id}`
        })
      )
  );

  await populateProjectDoc(project);

  res.status(201).json({
    success: true,
    message: 'Project created',
    data: { project }
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  await refreshOverdueTasks();

  const { q, priority, page, limit } = req.query;
  const filter = {
    ...getProjectAccessFilter(req.user)
  };

  if (priority) {
    filter.priority = priority;
  }

  if (q) {
    filter.$and = [
      ...(filter.$and || []),
      {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }
    ];
  }

  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    populateProject(Project.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)),
    Project.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1
      }
    }
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  await refreshOverdueTasks({ project: req.params.id });

  const project = await populateProject(Project.findById(req.params.id));

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (!canAccessProject(project, req.user)) {
    throw new ApiError(403, 'You do not have access to this project');
  }

  const taskSummary = await Task.aggregate([
    { $match: { project: project._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json({
    success: true,
    data: {
      project,
      taskSummary: taskSummary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    }
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (req.body.members) {
    req.body.members = await ensureUsersExist(req.body.members);
  }

  Object.assign(project, req.body);
  await project.save();

  await createActivity({
    actor: req.user._id,
    action: 'updated a project',
    entityType: 'project',
    entity: project._id,
    project: project._id,
    metadata: { title: project.title }
  });

  await populateProjectDoc(project);

  res.json({
    success: true,
    message: 'Project updated',
    data: { project }
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const taskIds = await Task.find({ project: project._id }).distinct('_id');
  await Promise.all([
    Comment.deleteMany({ task: { $in: taskIds } }),
    Task.deleteMany({ project: project._id }),
    Project.deleteOne({ _id: project._id })
  ]);

  await createActivity({
    actor: req.user._id,
    action: 'deleted a project',
    entityType: 'project',
    entity: project._id,
    project: project._id,
    metadata: { title: project.title }
  });

  res.json({
    success: true,
    message: 'Project deleted'
  });
});
