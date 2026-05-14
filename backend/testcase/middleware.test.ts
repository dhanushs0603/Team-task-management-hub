import { Request, Response, NextFunction } from 'express';
import { validateDeleteHeader } from '../src/middleware/auth_middleware';

describe('Auth Middleware - validateDeleteHeader', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn().mockReturnValue(undefined);
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockReq = { headers: {} };
    mockRes = {
      status: statusMock,
    };
    mockNext = jest.fn();
  });

  describe('Positive Cases', () => {
    test('should call next() when correct secret header is provided', () => {
      mockReq.headers = { 'x-delete-secret': 'ADMIN_DELETE' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(statusMock).not.toHaveBeenCalled();
    });

    test('should call next() with exact matching secret', () => {
      mockReq.headers = { 'x-delete-secret': 'ADMIN_DELETE' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('Negative Cases', () => {
    test('should return 403 when secret header is missing', () => {
      mockReq.headers = {};
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized delete operation',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 403 when wrong secret is provided', () => {
      mockReq.headers = { 'x-delete-secret': 'WRONG_SECRET' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 403 when secret is empty string', () => {
      mockReq.headers = { 'x-delete-secret': '' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should return 403 when secret has different case', () => {
      mockReq.headers = { 'x-delete-secret': 'admin_delete' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should return 403 when secret has extra spaces', () => {
      mockReq.headers = { 'x-delete-secret': ' ADMIN_DELETE ' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should return 403 when secret is null', () => {
      mockReq.headers = { 'x-delete-secret': undefined };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });
  });

  describe('Boundary Cases', () => {
    test('should return 403 when secret is partially correct', () => {
      mockReq.headers = { 'x-delete-secret': 'ADMIN_DELETE_EXTRA' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should handle undefined header gracefully', () => {
      mockReq.headers = { 'x-delete-secret': undefined };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should be case-sensitive for secret comparison', () => {
      mockReq.headers = { 'x-delete-secret': 'Admin_Delete' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should handle multiple headers with same key', () => {
      // In HTTP, multiple values for the same header are typically joined with comma
      mockReq.headers = { 'x-delete-secret': 'ADMIN_DELETE,ANOTHER' };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });

    test('should handle very long secret string', () => {
      mockReq.headers = { 'x-delete-secret': 'ADMIN_DELETE' + 'A'.repeat(1000) };
      validateDeleteHeader(mockReq as Request, mockRes as Response, mockNext);
      expect(statusMock).toHaveBeenCalledWith(403);
    });
  });
});
