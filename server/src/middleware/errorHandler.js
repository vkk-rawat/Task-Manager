import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

const normalizeError = (error) => {
  if (error.name === 'CastError') {
    return new ApiError(400, `Invalid ${error.path}: ${error.value}`);
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    return new ApiError(409, `${field} already exists`);
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
    return new ApiError(400, 'Validation failed', errors);
  }

  if (error.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid authentication token');
  }

  if (error.name === 'TokenExpiredError') {
    return new ApiError(401, 'Authentication token has expired');
  }

  return error;
};

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  const normalized = normalizeError(error);
  const statusCode = normalized.statusCode || 500;

  if (env.NODE_ENV !== 'test') {
    console.error(normalized);
  }

  res.status(statusCode).json({
    success: false,
    message: normalized.message || 'Internal server error',
    errors: normalized.errors || [],
    stack: env.NODE_ENV === 'production' ? undefined : normalized.stack
  });
};
