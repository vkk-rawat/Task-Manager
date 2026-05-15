import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { createActivity } from '../services/activity.service.js';
import { createNotification } from '../services/notification.service.js';
import { ApiError } from '../utils/ApiError.js';
import { getProjectAccessFilter, sameId } from '../utils/access.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTeam = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin') {
    const users = await User.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: { users }
    });
  }

  const projects = await Project.find(getProjectAccessFilter(req.user)).select('owner members');
  const ids = new Set([req.user._id.toString()]);

  projects.forEach((project) => {
    ids.add(project.owner.toString());
    project.members.forEach((member) => ids.add(member.toString()));
  });

  const users = await User.find({ _id: { $in: [...ids] } }).sort({ name: 1 });

  return res.json({
    success: true,
    data: { users }
  });
});

export const addMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.body;
  const [project, user] = await Promise.all([
    Project.findById(projectId),
    User.findById(userId).select('_id name email')
  ]);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!project.members.some((member) => sameId(member, user._id))) {
    project.members.push(user._id);
    await project.save();
  }

  await createActivity({
    actor: req.user._id,
    action: 'added a project member',
    entityType: 'team',
    entity: project._id,
    project: project._id,
    metadata: { projectTitle: project.title, memberName: user.name }
  });

  await createNotification({
    recipient: user._id,
    actor: req.user._id,
    type: 'project',
    title: 'Added to project',
    message: `${req.user.name} added you to ${project.title}`,
    link: `/projects/${project._id}`
  });

  await project.populate('members', 'name email role avatar');

  res.json({
    success: true,
    message: 'Member added to project',
    data: { project }
  });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.body;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (sameId(project.owner, userId)) {
    throw new ApiError(400, 'Project owner cannot be removed from their project');
  }

  project.members = project.members.filter((member) => !sameId(member, userId));
  await project.save();

  await createActivity({
    actor: req.user._id,
    action: 'removed a project member',
    entityType: 'team',
    entity: project._id,
    project: project._id,
    metadata: { projectTitle: project.title, memberId: userId }
  });

  await createNotification({
    recipient: userId,
    actor: req.user._id,
    type: 'project',
    title: 'Removed from project',
    message: `${req.user.name} removed you from ${project.title}`,
    link: '/projects'
  });

  await project.populate('members', 'name email role avatar');

  res.json({
    success: true,
    message: 'Member removed from project',
    data: { project }
  });
});
