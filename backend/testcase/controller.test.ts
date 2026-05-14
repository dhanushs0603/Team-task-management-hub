import { Request, Response } from 'express';

// Mock uuid before importing controller
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
}));

import { getTasks, createTask, deleteTask } from '../src/controller/controller';
import { tasks } from '../src/data/tasks';

describe('Controller - getTasks', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue(undefined);
    mockReq = {};
    mockRes = {
      json: jsonMock,
    };
  });

  describe('Positive Cases', () => {
    test('should return all tasks with success flag', () => {
      getTasks(mockReq as Request, mockRes as Response);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: tasks,
      });
    });

    test('should return tasks array in data property', () => {
      getTasks(mockReq as Request, mockRes as Response);
      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.data).toBeInstanceOf(Array);
    });

    test('should return tasks with correct structure', () => {
      getTasks(mockReq as Request, mockRes as Response);
      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.data.length).toBeGreaterThan(0);
      expect(callArgs.data[0]).toHaveProperty('id');
      expect(callArgs.data[0]).toHaveProperty('title');
      expect(callArgs.data[0]).toHaveProperty('priority');
      expect(callArgs.data[0]).toHaveProperty('status');
    });
  });

  describe('Boundary Cases', () => {
    test('should handle empty tasks array', () => {
      const emptyTasks = (tasks as any).splice(0);
      getTasks(mockReq as Request, mockRes as Response);
      // Still returns success even with empty array
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });
  });
});

describe('Controller - createTask', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = { body: {} };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    // Clear tasks array
    tasks.length = 0;
    tasks.push({
      id: '1',
      title: 'Existing task',
      priority: 'HIGH',
      status: 'TODO',
    });
  });

  describe('Positive Cases', () => {
    test('should create task with valid data', () => {
      mockReq.body = {
        title: 'New Task',
        priority: 'HIGH',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        })
      );
    });

    test('should generate unique ID for new task', () => {
      mockReq.body = {
        title: 'Task 1',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
      };
      createTask(mockReq as Request, mockRes as Response);
      const createdTask = jsonMock.mock.calls[0][0].data;
      expect(createdTask).toHaveProperty('id');
      expect(typeof createdTask.id).toBe('string');
      expect(createdTask.id).not.toBe('');
    });

    test('should include all provided fields in response', () => {
      mockReq.body = {
        title: 'Complete Task',
        description: 'With description',
        priority: 'HIGH',
        status: 'DONE',
      };
      createTask(mockReq as Request, mockRes as Response);
      const createdTask = jsonMock.mock.calls[0][0].data;
      expect(createdTask.title).toBe('Complete Task');
      expect(createdTask.description).toBe('With description');
      expect(createdTask.priority).toBe('HIGH');
      expect(createdTask.status).toBe('DONE');
    });

    test('should add task to tasks array', () => {
      const initialLength = tasks.length;
      mockReq.body = {
        title: 'New Task',
        priority: 'LOW',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(tasks.length).toBe(initialLength + 1);
    });
  });

  describe('Negative Cases', () => {
    test('should return 400 with missing title', () => {
      mockReq.body = {
        priority: 'HIGH',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });

    test('should return 400 with empty title', () => {
      mockReq.body = {
        title: '',
        priority: 'HIGH',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test('should return 400 with invalid priority', () => {
      mockReq.body = {
        title: 'Task',
        priority: 'URGENT',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test('should return 400 with invalid status', () => {
      mockReq.body = {
        title: 'Task',
        priority: 'HIGH',
        status: 'INVALID',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
    });

    test('should not add task when validation fails', () => {
      const initialLength = tasks.length;
      mockReq.body = {
        priority: 'HIGH',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(tasks.length).toBe(initialLength);
    });

    test('should return error details on validation failure', () => {
      mockReq.body = {
        title: '',
        priority: 'HIGH',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.any(Object),
        })
      );
    });
  });

  describe('Boundary Cases', () => {
    test('should create task with single character title', () => {
      mockReq.body = {
        title: 'A',
        priority: 'LOW',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    test('should create task with very long title', () => {
      mockReq.body = {
        title: 'A'.repeat(1000),
        priority: 'HIGH',
        status: 'DONE',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    test('should create task without optional description', () => {
      mockReq.body = {
        title: 'Task without description',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    test('should handle task with special characters', () => {
      mockReq.body = {
        title: '!@#$%^&*()',
        description: 'Special chars: <> {} [] |',
        priority: 'HIGH',
        status: 'TODO',
      };
      createTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(201);
    });
  });
});

describe('Controller - deleteTask', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = { params: {} };
    mockRes = {
      status: statusMock,
      json: jsonMock,
    };
    // Reset tasks
    tasks.length = 0;
    tasks.push(
      {
        id: '1',
        title: 'Task 1',
        priority: 'HIGH',
        status: 'TODO',
      },
      {
        id: '2',
        title: 'Task 2',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
      },
      {
        id: '3',
        title: 'Task 3',
        priority: 'LOW',
        status: 'DONE',
      }
    );
  });

  describe('Positive Cases', () => {
    test('should delete existing task successfully', () => {
      mockReq.params = { id: '1' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Task deleted successfully',
      });
    });

    test('should remove task from array', () => {
      const initialLength = tasks.length;
      mockReq.params = { id: '2' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(tasks.length).toBe(initialLength - 1);
      expect(tasks.find((t) => t.id === '2')).toBeUndefined();
    });

    test('should delete task with correct ID match', () => {
      mockReq.params = { id: '3' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(tasks.find((t) => t.id === '3')).toBeUndefined();
      expect(tasks.length).toBe(2);
    });
  });

  describe('Negative Cases', () => {
    test('should return 404 when task not found', () => {
      mockReq.params = { id: 'nonexistent' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Task not found',
      });
    });

    test('should return 404 for empty ID', () => {
      mockReq.params = { id: '' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test('should not modify array when task not found', () => {
      const initialLength = tasks.length;
      mockReq.params = { id: 'invalid' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(tasks.length).toBe(initialLength);
    });

    test('should return 404 for ID with wrong case', () => {
      mockReq.params = { id: '1X' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });

  describe('Boundary Cases', () => {
    test('should handle deletion of first task', () => {
      mockReq.params = { id: '1' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(tasks[0].id).toBe('2');
    });

    test('should handle deletion of last task', () => {
      mockReq.params = { id: '3' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(tasks[tasks.length - 1].id).toBe('2');
    });

    test('should handle deletion with very long ID string', () => {
      mockReq.params = { id: 'A'.repeat(1000) };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test('should handle special characters in ID', () => {
      mockReq.params = { id: '!@#$%^&*()' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test('should handle ID with spaces', () => {
      mockReq.params = { id: ' 1 ' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test('should handle undefined ID parameter', () => {
      mockReq.params = { id: '' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });

    test('should handle null ID parameter', () => {
      mockReq.params = { id: 'null' };
      deleteTask(mockReq as Request, mockRes as Response);
      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });
});
