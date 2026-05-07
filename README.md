# Ethara Project Hub

A polished full-stack project management platform built for assessment submissions that need strong frontend quality, complete backend coverage, secure authentication, responsive design, and a real MongoDB database workflow.

## Project Overview

Ethara Project Hub is a MERN-style task and project management system inspired by tools like Trello, Asana, and Notion. It supports secure JWT authentication, role-based access for admins and users, analytics dashboards, project and task CRUD, comments, validation, loading states, and mobile-ready UI.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, React Hook Form, Zod, Recharts, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Zod
- Deployment targets:
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas

## Features

- Authentication:
  - Register, login, logout
  - JWT auth with protected routes
  - Password hashing with bcrypt
  - Role-based access
  - Public signup creates `user` accounts only
  - Show/hide password
  - Remember me
  - Forgot password token generation
  - Session persistence
- Admin capabilities:
  - Create, update, delete projects
  - Assign users and tasks
  - Manage user roles
  - View analytics dashboard with charts
- User capabilities:
  - View assigned tasks
  - Update task status
  - Edit own profile
  - View personal dashboard and notifications
- Project module:
  - Create, edit, delete
  - Add members
  - Deadline and priority
  - Search and filter
- Task module:
  - Create, assign, update, delete
  - Status changes
  - Priority and due dates
  - Comments
- UI quality:
  - Responsive sidebar and navbar
  - Mobile menu
  - Loading spinner and skeleton loaders
  - Empty states
  - Toast notifications
  - Confirmation modals
  - Light/dark mode

## Folder Structure

```text
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── scripts/
├── utils/
└── validators/

frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── utils/
```

## API Endpoints

### Auth APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Project APIs

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/projects/analytics`

### Task APIs

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`

### Dashboard APIs

- `GET /api/dashboard/admin`
- `GET /api/dashboard/user`

## Setup Steps

### 1. Clone and install

```bash
npm install
npm install --workspace backend
npm install --workspace frontend
```

### 2. Configure environment variables

Create these files:

- `backend/.env`
- `frontend/.env`

Use the included examples:

```env
# backend/.env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ethara_project_hub
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. Optional seed data

```bash
npm run seed --workspace backend
```

Seed credentials:

- Admin: `admin@ethara.ai` / `Admin123`
- User: `aarav@ethara.ai` / `User1234`

Note:

- Public registration creates only `user` accounts.
- Create admin accounts through seed data, database setup, or an existing admin workflow.

### 4. Run the app

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Database Design

### Users collection

- `name`
- `email`
- `password`
- `role`
- `avatar`
- `title`

### Projects collection

- `title`
- `description`
- `members`
- `owner`
- `deadline`
- `priority`
- `status`

### Tasks collection

- `title`
- `description`
- `assignedTo`
- `createdBy`
- `priority`
- `status`
- `dueDate`
- `projectId`
- `comments`

## Security Features

- JWT verification middleware
- Password hashing with bcrypt
- Protected APIs
- Role authorization
- Helmet and CORS setup
- Environment variables
- Validation and proper status codes

## Viva Preparation Topics

- JWT flow:
  - User logs in
  - Backend verifies credentials
  - JWT is returned and stored
  - Protected routes send token in Authorization header
- Authentication:
  - Passwords are hashed before saving
  - Backend compares hashed password during login
- Middleware:
  - `protect` verifies JWT
  - `authorize` checks role permissions
- MVC architecture:
  - Routes call controllers
  - Controllers interact with models
  - Middleware handles auth and validation
- MongoDB relations:
  - `ObjectId` references connect users, projects, and tasks
- React state management:
  - Auth state is managed with context
  - Screen data is handled with reusable fetch hooks
- API flow:
  - Forms validate on frontend
  - Axios sends requests
  - Backend validates again and returns structured responses

## Deployment Guide

### Frontend on Vercel

- Import the `frontend` folder project into Vercel
- Add `VITE_API_URL`
- Set build command to `npm run build`
- Set output directory to `dist`

### Backend on Render

- Create a new Web Service for the `backend` folder
- Add environment variables from `backend/.env`
- Set start command to `npm run start`

### Database on MongoDB Atlas

- Create a cluster
- Create a database user
- Whitelist your IP or allow access for deployment
- Copy Atlas connection string into `MONGODB_URI`

## Screenshots and Live Links

Add these before submission:

- Login page screenshot
- Admin dashboard screenshot
- User dashboard screenshot
- Projects page screenshot
- Tasks page screenshot
- Live frontend URL
- Live backend URL

## Important Submission Notes

- Do not use hardcoded data in the final deployed version
- Demonstrate both admin and user flows in screenshots/video
- Keep the UI spacing clean and mobile responsive
- Be ready to explain role-based routing, middleware, and MongoDB references during viva

## Final Submission Checklist

- Run `npm run seed --workspace backend` and verify seeded data is visible
- Capture screenshots using both admin and user logins
- Test dashboards, projects, tasks, profile update, comments, and logout before deployment
- Deploy frontend and backend, then re-test the same flows on live URLs
- Paste real screenshots and live links into this README
- Hard refresh the browser after final frontend changes so old cached assets do not appear in screenshots
