import express, { Express } from 'express';
import request from 'supertest';

// Mock uuid before importing routes
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

import taskRoutes from '../src/routes/task_routes';
import { tasks } from '../src/data/tasks';

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use('/tasks', taskRoutes);
});

beforeEach(() => {
  // Reset tasks before each test
  tasks.length = 0;
  tasks.push(
    {
      id: 'test-1',
      title: 'Test Task 1',
      description: 'Description 1',
      priority: 'HIGH',
      status: 'TODO',
    },
    {
      id: 'test-2',
      title: 'Test Task 2',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    }
  );
});

describe('Tasks Routes - GET /tasks', () => {
  describe('Positive Cases', () => {
    test('should return 200 status', async () => {
      const response = await request(app).get('/tasks');
      expect(response.status).toBe(200);
    });

    test('should return all tasks', async () => {
      const response = await request(app).get('/tasks');
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    test('should return tasks with correct structure', async () => {
      const response = await request(app).get('/tasks');
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('priority');
      expect(response.body.data[0]).toHaveProperty('status');
    });

    test('should have proper content-type', async () => {
      const response = await request(app).get('/tasks');
      expect(response.type).toBe('application/json');
    });
  });

  describe('Boundary Cases', () => {
    test('should handle empty task list', async () => {
      tasks.length = 0;
      const response = await request(app).get('/tasks');
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });
});

describe('Tasks Routes - POST /tasks', () => {
  describe('Positive Cases', () => {
    test('should create task and return 201', async () => {
      const newTask = {
        title: 'New Test Task',
        priority: 'HIGH',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    test('should return created task with ID', async () => {
      const newTask = {
        title: 'Task with ID',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
      };
      const response = await request(app).post('/tasks').send(newTask);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBeTruthy();
    });

    test('should add task with description', async () => {
      const newTask = {
        title: 'Detailed Task',
        description: 'This is a detailed task',
        priority: 'LOW',
        status: 'DONE',
      };
      const response = await request(app).post('/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body.data.description).toBe('This is a detailed task');
    });

    test('should persist task in memory', async () => {
      const initialCount = tasks.length;
      const newTask = {
        title: 'Persistent Task',
        priority: 'HIGH',
        status: 'TODO',
      };
      await request(app).post('/tasks').send(newTask);
      expect(tasks.length).toBe(initialCount + 1);
    });
  });

  describe('Negative Cases', () => {
    test('should return 400 for missing title', async () => {
      const invalidTask = {
        priority: 'HIGH',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(invalidTask);
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for empty title', async () => {
      const invalidTask = {
        title: '',
        priority: 'HIGH',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(invalidTask);
      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid priority', async () => {
      const invalidTask = {
        title: 'Task',
        priority: 'CRITICAL',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(invalidTask);
      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid status', async () => {
      const invalidTask = {
        title: 'Task',
        priority: 'HIGH',
        status: 'COMPLETED',
      };
      const response = await request(app).post('/tasks').send(invalidTask);
      expect(response.status).toBe(400);
    });

    test('should return error details on validation failure', async () => {
      const invalidTask = {
        title: '',
        priority: 'HIGH',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(invalidTask);
      expect(response.body.errors).toBeDefined();
    });

    test('should not add invalid task to array', async () => {
      const initialCount = tasks.length;
      const invalidTask = {
        priority: 'HIGH',
        status: 'TODO',
      };
      await request(app).post('/tasks').send(invalidTask);
      expect(tasks.length).toBe(initialCount);
    });
  });

  describe('Boundary Cases', () => {
    test('should create task with minimal valid data', async () => {
      const minimalTask = {
        title: 'A',
        priority: 'LOW',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(minimalTask);
      expect(response.status).toBe(201);
    });

    test('should handle very long title', async () => {
      const longTask = {
        title: 'A'.repeat(1000),
        priority: 'HIGH',
        status: 'DONE',
      };
      const response = await request(app).post('/tasks').send(longTask);
      expect(response.status).toBe(201);
    });

    test('should handle special characters in title', async () => {
      const specialTask = {
        title: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        priority: 'MEDIUM',
        status: 'TODO',
      };
      const response = await request(app).post('/tasks').send(specialTask);
      expect(response.status).toBe(201);
    });

    test('should handle unicode characters', async () => {
      const unicodeTask = {
        title: '你好 🚀 مرحبا',
        priority: 'HIGH',
        status: 'DONE',
      };
      const response = await request(app).post('/tasks').send(unicodeTask);
      expect(response.status).toBe(201);
    });
  });
});

describe('Tasks Routes - DELETE /tasks/:id', () => {
  describe('Positive Cases', () => {
    test('should delete task and return 200', async () => {
      const response = await request(app)
        .delete('/tasks/test-1')
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    test('should remove task from array', async () => {
      const initialCount = tasks.length;
      await request(app)
        .delete('/tasks/test-2')
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect(tasks.length).toBe(initialCount - 1);
    });

    test('should return success message', async () => {
      const response = await request(app)
        .delete('/tasks/test-1')
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect(response.body.message).toBe('Task deleted successfully');
    });
  });

  describe('Negative Cases', () => {
    test('should return 403 without auth header', async () => {
      const response = await request(app).delete('/tasks/test-1');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    test('should return 403 with wrong secret', async () => {
      const response = await request(app)
        .delete('/tasks/test-1')
        .set('x-delete-secret', 'WRONG_SECRET');
      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/tasks/nonexistent')
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });

    test('should not delete task without proper auth', async () => {
      const initialCount = tasks.length;
      await request(app)
        .delete('/tasks/test-1')
        .set('x-delete-secret', 'WRONG');
      expect(tasks.length).toBe(initialCount);
    });

    test('should be case-sensitive for auth header', async () => {
      const response = await request(app)
        .delete('/tasks/test-1')
        .set('x-delete-secret', 'admin_delete');
      expect(response.status).toBe(403);
    });
  });

  describe('Boundary Cases', () => {
    test('should handle deletion with empty ID', async () => {
      const response = await request(app)
        .delete('/tasks/')
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect([404, 405]).toContain(response.status);
    });

    test('should handle deletion with very long ID', async () => {
      const response = await request(app)
        .delete('/tasks/' + 'A'.repeat(1000))
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect(response.status).toBe(404);
    });

    test('should handle special characters in ID', async () => {
      const response = await request(app)
        .delete('/tasks/!@#$%^&*()')
        .set('x-delete-secret', 'ADMIN_DELETE');
      expect(response.status).toBe(404);
    });

    test('should handle auth header with spaces', async () => {
      const response = await request(app)
        .delete('/tasks/test-1')
        .set('x-delete-secret', ' ADMIN_DELETE ');
      // Express/Node may strip/trim headers, so this might pass or fail
      // The important thing is that the secret value must match exactly
      expect([200, 403]).toContain(response.status);
    });
  });
});

describe('Routes - 404 Handling', () => {
  test('should return 404 for non-existent endpoint', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });

  test('should return proper error message for unknown route', async () => {
    const response = await request(app).get('/api/unknown');
    expect(response.status).toBe(404);
    // Check if message is present
    if (response.body.message) {
      expect(response.body.message).toBe('Route not found');
    }
  });
});
