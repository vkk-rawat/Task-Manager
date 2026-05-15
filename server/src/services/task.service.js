import { Task } from '../models/Task.js';

export const refreshOverdueTasks = async (extraFilter = {}) => {
  const now = new Date();

  return Task.updateMany(
    {
      ...extraFilter,
      status: { $nin: ['Completed', 'Overdue'] },
      dueDate: { $lt: now }
    },
    { $set: { status: 'Overdue' } }
  );
};

export const populateTask = (query) =>
  query
    .populate('assignedTo', 'name email role avatar')
    .populate('assignedBy', 'name email role avatar')
    .populate('project', 'title priority deadline members owner')
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'user',
        select: 'name email role avatar'
      }
    });
