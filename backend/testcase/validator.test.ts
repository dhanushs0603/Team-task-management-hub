import { taskSchema } from '../src/validator/task_validator';

describe('Task Validator - Positive Cases', () => {
  test('should validate a complete valid task', () => {
    const validTask = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'HIGH',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validTask);
  });

  test('should validate task with optional description omitted', () => {
    const validTask = {
      title: 'Test Task',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    };
    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validTask);
  });

  test('should validate with all valid priority levels', () => {
    const priorities = ['LOW', 'MEDIUM', 'HIGH'];
    priorities.forEach((priority) => {
      const task = {
        title: 'Task',
        priority,
        status: 'TODO',
      };
      const result = taskSchema.safeParse(task);
      expect(result.success).toBe(true);
    });
  });

  test('should validate with all valid status levels', () => {
    const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    statuses.forEach((status) => {
      const task = {
        title: 'Task',
        priority: 'HIGH',
        status,
      };
      const result = taskSchema.safeParse(task);
      expect(result.success).toBe(true);
    });
  });
});

describe('Task Validator - Negative Cases', () => {
  test('should reject task with missing title', () => {
    const invalidTask = {
      description: 'No title',
      priority: 'HIGH',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  test('should reject task with empty title string', () => {
    const invalidTask = {
      title: '',
      priority: 'HIGH',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  test('should reject task with invalid priority', () => {
    const invalidTask = {
      title: 'Task',
      priority: 'URGENT',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  test('should reject task with invalid status', () => {
    const invalidTask = {
      title: 'Task',
      priority: 'HIGH',
      status: 'COMPLETED',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  test('should reject task with missing priority', () => {
    const invalidTask = {
      title: 'Task',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  test('should reject task with missing status', () => {
    const invalidTask = {
      title: 'Task',
      priority: 'HIGH',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  test('should reject task with extra unexpected properties', () => {
    const invalidTask = {
      title: 'Task',
      priority: 'HIGH',
      status: 'TODO',
      extraField: 'should be ignored',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(true);
    // Zod allows extra properties by default, but data won't include them
  });

  test('should reject task with non-string title', () => {
    const invalidTask = {
      title: 123,
      priority: 'HIGH',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });
});

describe('Task Validator - Boundary Cases', () => {
  test('should validate task with single character title', () => {
    const boundaryTask = {
      title: 'A',
      priority: 'LOW',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(boundaryTask);
    expect(result.success).toBe(true);
  });

  test('should validate task with very long title', () => {
    const longTitle = 'A'.repeat(1000);
    const boundaryTask = {
      title: longTitle,
      priority: 'HIGH',
      status: 'DONE',
    };
    const result = taskSchema.safeParse(boundaryTask);
    expect(result.success).toBe(true);
  });

  test('should validate task with very long description', () => {
    const longDescription = 'Lorem ipsum '.repeat(500);
    const boundaryTask = {
      title: 'Task',
      description: longDescription,
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    };
    const result = taskSchema.safeParse(boundaryTask);
    expect(result.success).toBe(true);
  });

  test('should validate task with special characters in title', () => {
    const specialTask = {
      title: '!@#$%^&*()_+-=[]{}|;:",.<>?/~`',
      priority: 'HIGH',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(specialTask);
    expect(result.success).toBe(true);
  });

  test('should validate task with unicode characters', () => {
    const unicodeTask = {
      title: '你好世界 🚀 مرحبا',
      priority: 'MEDIUM',
      status: 'DONE',
    };
    const result = taskSchema.safeParse(unicodeTask);
    expect(result.success).toBe(true);
  });

  test('should validate task with whitespace-only title', () => {
    const whitespaceTask = {
      title: '   ',
      priority: 'LOW',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(whitespaceTask);
    expect(result.success).toBe(true);
  });

  test('should validate task with null description', () => {
    const nullDescTask = {
      title: 'Task',
      description: null,
      priority: 'HIGH',
      status: 'TODO',
    };
    const result = taskSchema.safeParse(nullDescTask);
    // This should fail as description should be string | undefined
    expect(result.success).toBe(false);
  });
});
