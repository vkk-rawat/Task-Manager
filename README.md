# Team Task Manager

A production-ready collaborative project management SaaS built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT authentication, and role-based access control.

## Features

- JWT signup, login, and protected sessions
- Admin and member role-based access across backend APIs and frontend routes
- Project CRUD with members, priorities, deadlines, search, and filters
- Task CRUD with assignees, status workflow, priorities, due dates, comments, and attachments by URL
- Auto-overdue task detection
- Drag-and-drop Kanban board
- Dashboard analytics with Recharts
- Activity logs, notifications, and Socket.IO updates
- Team member add/remove workflows
- Responsive SaaS UI with sidebar navigation, dark mode, loading states, and toasts
- Railway-ready deployment configuration

## Screenshots

Add screenshots here after deployment:

- Landing page
- Dashboard analytics
- Kanban board
- Project details
- Team management

## Project Architecture

```txt
team-task-manager/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable UI, layout, project, task components
│   │   ├── contexts/       # Auth, theme, Socket.IO state
│   │   ├── hooks/
│   │   ├── pages/          # Landing, auth, dashboard, projects, tasks, team, profile
│   │   ├── services/       # Axios API client
│   │   └── utils/
│   └── vite.config.js
├── server/                 # Express + MongoDB backend
│   ├── src/
│   │   ├── config/         # Env and MongoDB connection
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, errors, rate limiting
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # REST API routes
│   │   ├── services/       # Activity, notifications, sockets, tasks
│   │   ├── utils/
│   │   └── validators/     # Zod request validation
│   └── src/server.js
├── railway.json
└── package.json
```

## Installation

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Set `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Commands

```bash
npm run dev       # run server and client together
npm run build     # build the Vite frontend
npm start         # start the production Express server
npm run lint      # lint frontend source
```

If a parent `node_modules/.bin/node` shim shadows the real Node executable on Windows, run the frontend directly:

```powershell
cd client
node ..\node_modules\vite\bin\vite.js build
node ..\node_modules\vite\bin\vite.js --host 0.0.0.0
```

## Backend Setup

The backend uses Express with Helmet, CORS, rate limiting, Zod validation, centralized error handling, Mongoose models, and Socket.IO.

Key files:

- `server/src/app.js`
- `server/src/server.js`
- `server/src/config/env.js`
- `server/src/config/db.js`

## Database Models

- `User`: name, email, password, role, avatar, timestamps
- `Project`: title, description, deadline, priority, owner, members
- `Task`: title, description, assignedTo, assignedBy, project, status, priority, dueDate, comments, attachments
- `Comment`: task, user, content
- `Activity`: actor, action, entity, project/task metadata
- `Notification`: recipient, actor, type, title, message, link, read state

## Authentication System

Auth routes:

```txt
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

Passwords are hashed with bcrypt. Authenticated APIs require a `Bearer <token>` header.

## Middleware

- `protect`: verifies JWT and loads `req.user`
- `authorize`: enforces admin/member permissions
- `validate`: validates request bodies and queries with Zod
- `apiLimiter` and `authLimiter`: rate limiting
- `errorHandler`: consistent API error responses

## REST APIs

Projects:

```txt
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Tasks:

```txt
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
POST   /api/tasks/:id/comments
```

Team:

```txt
GET    /api/team
POST   /api/team/add-member
DELETE /api/team/remove-member
```

Dashboard and user:

```txt
GET   /api/dashboard
PUT   /api/users/me
GET   /api/notifications
PATCH /api/notifications/read-all
PATCH /api/notifications/:id/read
```

## Frontend Setup

The frontend uses React Router DOM, Axios, React Hook Form, Zod, Context API, Tailwind CSS, Recharts, Socket.IO Client, and Sonner toasts.

Pages:

- Landing
- Login
- Signup
- Dashboard
- Projects
- Project details
- Tasks
- Team
- Profile
- 404

## State Management

Context API handles:

- `AuthContext`: user session, token, login/signup/logout
- `ThemeContext`: light/dark mode
- `SocketContext`: authenticated Socket.IO connection

## Dashboard UI

The dashboard includes:

- Total projects
- Total, completed, pending, and overdue tasks
- Completion rate
- Weekly productivity chart
- Status and priority breakdowns
- Project progress bars
- Recent activity feed

## Deployment

Railway is configured through `railway.json`.

1. Push the repository to GitHub.
2. Create a Railway project from the repo.
3. Add environment variables:

```env
NODE_ENV=production
MONGO_URI=<MongoDB Atlas or Railway Mongo URI>
JWT_SECRET=<long random production secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://<your-railway-domain>
```

4. Railway runs:

```bash
npm install && npm run build
npm start
```

In production, Express serves the built Vite app from `client/dist`.

## Security Notes

- Use a strong `JWT_SECRET` in production.
- Restrict `FRONTEND_URL` to trusted origins.
- Use MongoDB Atlas network rules and database users with least privilege.
- Never commit `.env` files.
