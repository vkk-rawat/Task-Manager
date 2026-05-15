import http from 'node:http';
import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './services/socket.service.js';
import { refreshOverdueTasks } from './services/task.service.js';

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  const overdueInterval = setInterval(() => {
    refreshOverdueTasks().catch((error) => {
      console.error(`Overdue task refresh failed: ${error.message}`);
    });
  }, 10 * 60 * 1000);
  overdueInterval.unref();

  process.on('unhandledRejection', (error) => {
    console.error(`Unhandled rejection: ${error.message}`);
    server.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => process.exit(0));
  });
};

startServer();
