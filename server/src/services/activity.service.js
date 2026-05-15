import { Activity } from '../models/Activity.js';
import { emitToProject } from './socket.service.js';

export const createActivity = async ({
  actor,
  action,
  entityType,
  entity,
  project,
  task,
  metadata = {}
}) => {
  const activity = await Activity.create({
    actor,
    action,
    entityType,
    entity,
    project,
    task,
    metadata
  });

  await activity.populate('actor', 'name email avatar role');
  emitToProject(project, 'activity:new', activity);

  return activity;
};
