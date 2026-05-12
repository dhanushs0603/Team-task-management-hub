# Backend Service

This folder contains the backend service for the Team Task Management Hub.
It is built with Express, TypeScript, Bun (for development), and Zod for request validation.

## Features

- REST API for managing tasks
- Input validation using Zod
- In-memory task storage for demo purposes
- Simple delete authorization via custom header
- Error handling middleware

## Requirements

- Node.js or Bun installed
- Dependencies installed via npm

## Install

```bash
cd backend
npm install
```

## Run locally

### Development

```bash
cd backend
npm run dev
```

This starts the backend on port `5000` with Bun hot reloading.

### Production build

```bash
cd backend
npm run build
npm run start
```

## API Endpoints

### GET /tasks

Retrieve all tasks.

Response example:

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Setup project",
      "description": "Initialize repository and install dependencies",
      "priority": "HIGH",
      "status": "DONE"
    }
  ]
}
```

### POST /tasks

Create a new task.

Request body schema:

- `title` (string, required)
- `description` (string, optional)
- `priority` (`LOW`, `MEDIUM`, `HIGH`)
- `status` (`TODO`, `IN_PROGRESS`, `DONE`)

Example request:

```json
{
  "title": "New task",
  "description": "Description of the task",
  "priority": "MEDIUM",
  "status": "TODO"
}
```

### DELETE /tasks/:id

Delete a task by ID.

Requires the header:

- `x-delete-secret: ADMIN_DELETE`

If the header is missing or incorrect, the request returns `403 Unauthorized`.

## Project Structure

- `index.ts` - application entrypoint
- `src/routes/task_routes.ts` - task route definitions
- `src/controller/controller.ts` - request handlers
- `src/validator/task_validator.ts` - task validation schema
- `src/middleware/auth_middleware.ts` - delete authorization middleware
- `src/middleware/error_middleware.ts` - error handling middleware
- `src/data/tasks.ts` - in-memory task store
- `src/models/task_model.ts` - task type definitions

## Notes

- Tasks are stored in-memory and reset when the server restarts.
- This backend is intended as a simple demo/api prototype.
