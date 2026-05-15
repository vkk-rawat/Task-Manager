import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { corsOrigins, env } from '../config/env.js';
import { User } from '../models/User.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin) || env.NODE_ENV !== 'production') {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication token is required'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('_id role name email');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      socket.join(`user:${user._id}`);
      return next();
    } catch (error) {
      return next(error);
    }
  });

  io.on('connection', (socket) => {
    socket.on('project:join', (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('project:leave', (projectId) => {
      socket.leave(`project:${projectId}`);
    });
  });

  return io;
};

export const getIO = () => io;

export const emitToProject = (projectId, event, payload) => {
  if (io && projectId) {
    io.to(`project:${projectId}`).emit(event, payload);
  }
};

export const emitToUser = (userId, event, payload) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};
