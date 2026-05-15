import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  avatar: z.string().trim().url('Avatar must be a valid URL').or(z.literal('')).optional()
});
