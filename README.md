# Task App Server

This is the backend server for the Task App, handling user authentication and task management.

## Features

- Apple Sign In authentication
- Task CRUD operations
- PostgreSQL database integration
- JWT-based authentication

## API Endpoints

### Authentication
- POST `/api/auth/apple` - Apple Sign In
- GET `/api/auth/me` - Get current user

### Tasks
- GET `/api/tasks` - Get all tasks
- POST `/api/tasks` - Create a new task
- PATCH `/api/tasks/:id` - Update a task
- DELETE `/api/tasks/:id` - Delete a task

## Environment Variables

Create a `.env` file with the following variables:
```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Railway.app. The database and server will be automatically provisioned when deployed. 