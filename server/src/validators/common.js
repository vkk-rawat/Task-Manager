import { z } from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB id');

export const emptyToUndefined = (value) => (value === '' ? undefined : value);

export const optionalDate = z.preprocess(
  emptyToUndefined,
  z.coerce.date({ invalid_type_error: 'Invalid date' }).optional()
);

export const requiredDate = z.coerce.date({ invalid_type_error: 'Invalid date' });

export const paginationQuery = {
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50)
};
