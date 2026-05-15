import { Project } from '../models/Project.js';

export const toId = (value) => value?._id?.toString?.() || value?.toString?.();

export const sameId = (left, right) => toId(left) === toId(right);

export const projectContainsUser = (project, userId) => {
  if (!project) {
    return false;
  }

  return sameId(project.owner, userId) || project.members?.some((member) => sameId(member, userId));
};

export const canAccessProject = (project, user) => {
  return user.role === 'admin' || projectContainsUser(project, user._id);
};

export const getProjectAccessFilter = (user) => {
  if (user.role === 'admin') {
    return {};
  }

  return {
    $or: [{ owner: user._id }, { members: user._id }]
  };
};

export const getAccessibleProjectIds = async (user) => {
  if (user.role === 'admin') {
    return null;
  }

  const projects = await Project.find(getProjectAccessFilter(user)).select('_id').lean();
  return projects.map((project) => project._id);
};
