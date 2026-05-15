import { z } from 'zod';
import { TASK_PRIORITIES, TASK_STATUSES } from '../utils/constants.js';
import { emptyToUndefined, objectId, optionalDate, paginationQuery, requiredDate } from './common.js';

const attachmentSchema = z.object({
  name: z.string().trim().min(1).max(160),
  url: z.string().trim().url('Attachment must be a valid URL'),
  mimeType: z.string().trim().optional().default(''),
  size: z.coerce.number().nonnegative().optional().default(0)
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(2, 'Task title is required').max(160),
  description: z.string().trim().max(3000).optional().default(''),
  assignedTo: objectId,
  project: objectId,
  status: z.enum(TASK_STATUSES).optional().default('Todo'),
  priority: z.enum(TASK_PRIORITIES).default('Medium'),
  dueDate: requiredDate,
  attachments: z.array(attachmentSchema).optional().default([])
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(2).max(160).optional(),
    description: z.string().trim().max(3000).optional(),
    assignedTo: objectId.optional(),
    project: objectId.optional(),
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
    dueDate: optionalDate,
    attachments: z.array(attachmentSchema).optional()
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

export const taskQuerySchema = z.object({
  q: z.string().trim().optional(),
  status: z.preprocess(emptyToUndefined, z.enum(TASK_STATUSES).optional()),
  priority: z.preprocess(emptyToUndefined, z.enum(TASK_PRIORITIES).optional()),
  project: z.preprocess(emptyToUndefined, objectId.optional()),
  assignedTo: z.preprocess(emptyToUndefined, objectId.optional()),
  sort: z
    .enum(['dueDate', '-dueDate', 'createdAt', '-createdAt', 'priority', '-priority', 'status'])
    .default('dueDate'),
  ...paginationQuery
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, 'Comment cannot be empty').max(1200)
});
