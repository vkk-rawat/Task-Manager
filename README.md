
# Team Task Manager

A full-stack collaborative task management application where teams can create projects, assign tasks, manage members, and track progress.

Built as a simplified version of Trello/Asana with authentication, role-based access control, dashboards, and task tracking.

---

## 🚀 Live Demo
https://task-manager-production-15bd.up.railway.app/

---

# 📌 Features

## 🔐 Authentication
- User Signup
- User Login
- JWT-based Authentication
- Password hashing using bcrypt

---

## 👥 Project Management
- Create Projects
- Add/Remove Members
- Project-based collaboration
- Admin and Member roles

---

## ✅ Task Management
- Create Tasks
- Assign tasks to team members
- Set:
  - Title
  - Description
  - Due Date
  - Priority
- Update task status:
  - To Do
  - In Progress
  - Done

---

## 📊 Dashboard
- Total tasks count
- Tasks grouped by status
- Tasks per user
- Overdue tasks tracking

---

## 🛡️ Role-Based Access Control

### Admin
- Manage projects
- Add/remove users
- Create/update/delete tasks
- Assign tasks

### Member
- View assigned projects
- View assigned tasks
- Update task status only

---

# 🏗️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

## Backend
- Node.js
- Express.js

## Database
- MongoDB + Mongoose

## Authentication
- JWT (JSON Web Tokens)
- bcryptjs

## Deployment
- Railway

---

# 📁 Folder Structure

```bash
team-task-manager/
│
├── client/                 # Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── config/
│   └── package.json
│
├── README.md
└── package.json
