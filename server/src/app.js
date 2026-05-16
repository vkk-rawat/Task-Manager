import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { corsOrigins, env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import teamRoutes from "./routes/team.routes.js";
import userRoutes from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        corsOrigins.includes(origin) ||
        env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Team Task Manager API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api", notFound);

// Serve static files from client dist (Docker build or local development)
const publicPath = path.resolve(__dirname, "../public");
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const staticPath = fs.existsSync(publicPath) ? publicPath : clientDistPath;

if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: "Team Task Manager API. Start the Vite client for the frontend.",
    });
  });
}

app.use(errorHandler);
