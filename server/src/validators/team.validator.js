import { z } from 'zod';
import { objectId } from './common.js';

export const memberChangeSchema = z.object({
  projectId: objectId,
  userId: objectId
});
