import { Activity } from '../models/Activity.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { TASK_PRIORITIES, TASK_STATUS_OPTIONS, normalizeTaskStatus } from '../utils/constants.js';
import {
  getAccessibleProjectIds,
  getProjectAccessFilter
} from '../utils/access.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { refreshOverdueTasks } from '../services/task.service.js';

const normalizeCounts = (items, keys) => {
  const map = Object.fromEntries(keys.map((key) => [key, 0]));
  items.forEach((item) => {
    const status = normalizeTaskStatus(item._id);
    if (status in map) {
      map[status] += item.count;
    }
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

export const getDashboard = asyncHandler(async (req, res) => {
  await refreshOverdueTasks();

  const projectFilter = getProjectAccessFilter(req.user);
  const accessibleProjectIds = await getAccessibleProjectIds(req.user);
  const taskFilter =
    req.user.role === 'admin'
      ? {}
      : {
          assignedTo: req.user._id,
          project: { $in: accessibleProjectIds }
        };
  const activityFilter =
    req.user.role === 'admin' ? {} : { project: { $in: accessibleProjectIds } };

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    statusCounts,
    priorityCounts,
    weeklyCompleted,
    recentActivity,
    projects
  ] = await Promise.all([
    Project.countDocuments(projectFilter),
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: { $in: ['Done', 'Completed'] } }),
    Task.countDocuments({ ...taskFilter, status: 'Overdue' }),
    Task.aggregate([{ $match: taskFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.aggregate([{ $match: taskFilter }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Task.aggregate([
      {
        $match: {
          ...taskFilter,
          status: { $in: ['Done', 'Completed'] },
          updatedAt: { $gte: startOfWeek }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Activity.find(activityFilter)
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('actor', 'name email role avatar'),
    Project.find(projectFilter).sort({ createdAt: -1 }).limit(6).select('title priority deadline')
  ]);

  const projectIds = projects.map((project) => project._id);
  const projectTaskCounts = await Task.aggregate([
    {
      $match: {
        ...(req.user.role === 'member' ? { assignedTo: req.user._id } : {}),
        project: { $in: projectIds }
      }
    },
    {
      $group: {
        _id: { project: '$project', status: '$status' },
        count: { $sum: 1 }
      }
    }
  ]);

  const projectProgress = projects.map((project) => {
    const rows = projectTaskCounts.filter((item) => item._id.project.toString() === project._id.toString());
    const total = rows.reduce((sum, item) => sum + item.count, 0);
    const completed = rows.reduce((sum, item) => {
      const status = normalizeTaskStatus(item._id.status);
      return status === 'Done' ? sum + item.count : sum;
    }, 0);

    return {
      _id: project._id,
      title: project.title,
      priority: project.priority,
      deadline: project.deadline,
      total,
      completed,
      progress: total ? Math.round((completed / total) * 100) : 0
    };
  });

  const weeklyMap = new Map(weeklyCompleted.map((item) => [item._id, item.count]));
  const weeklyProductivity = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      completed: weeklyMap.get(key) || 0
    };
  });

  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  res.json({
    success: true,
    data: {
      summary: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        completionRate
      },
      charts: {
        statusBreakdown: normalizeCounts(statusCounts, [...TASK_STATUS_OPTIONS, 'Overdue']),
        priorityBreakdown: normalizeCounts(priorityCounts, TASK_PRIORITIES),
        weeklyProductivity
      },
      projectProgress,
      recentActivity
    }
  });
});
