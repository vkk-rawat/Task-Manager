import { z } from 'zod';
import { PROJECT_PRIORITIES } from '../utils/constants.js';
import { objectId, optionalDate, paginationQuery, requiredDate } from './common.js';

export const createProjectSchema = z.object({
  title: z.string().trim().min(2, 'Project title is required').max(120),
  description: z.string().trim().max(2000).optional().default(''),
  deadline: requiredDate,
  priority: z.enum(PROJECT_PRIORITIES).default('Medium'),
  members: z.array(objectId).optional().default([])
});

export const updateProjectSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    description: z.string().trim().max(2000).optional(),
    deadline: optionalDate,
    priority: z.enum(PROJECT_PRIORITIES).optional(),
    members: z.array(objectId).optional()
  })
  .refine((data) => Object.keys(data).length > 0, 'At least one field is required');

export const projectQuerySchema = z.object({
  q: z.string().trim().optional(),
  priority: z.enum(PROJECT_PRIORITIES).optional(),
  ...paginationQuery
});
