/**
 * Error classes tests
 */

import { describe, it, expect } from 'vitest';
import {
  SuperOpsError,
  SuperOpsAuthenticationError,
  SuperOpsNotFoundError,
  SuperOpsValidationError,
  SuperOpsRateLimitError,
  SuperOpsServerError,
  SuperOpsNetworkError,
  SuperOpsTimeoutError,
  createErrorFromGraphQL,
} from '../../src/errors.js';

describe('Error Classes', () => {
  describe('SuperOpsError', () => {
    it('should create error with message and code', () => {
      const error = new SuperOpsError('Test error', 'TEST_CODE');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('SuperOpsError');
    });

    it('should include response and graphqlErrors', () => {
      const graphqlErrors = [{ message: 'GraphQL error' }];
      const response = { data: null };
      const error = new SuperOpsError('Test', 'CODE', response, graphqlErrors);

      expect(error.response).toBe(response);
      expect(error.graphqlErrors).toBe(graphqlErrors);
    });

    it('should format toString correctly', () => {
      const error = new SuperOpsError('Test error', 'TEST_CODE');
      expect(error.toString()).toContain('SuperOpsError: Test error (TEST_CODE)');
    });

    it('should include graphql errors in toString', () => {
      const error = new SuperOpsError('Test', 'CODE', null, [{ message: 'GQL Error' }]);
      const str = error.toString();
      expect(str).toContain('GQL Error');
    });
  });

  describe('SuperOpsAuthenticationError', () => {
    it('should have correct defaults', () => {
      const error = new SuperOpsAuthenticationError();
      expect(error.name).toBe('SuperOpsAuthenticationError');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.message).toContain('Authentication failed');
    });

    it('should accept custom message', () => {
      const error = new SuperOpsAuthenticationError('Custom auth error');
      expect(error.message).toBe('Custom auth error');
    });
  });

  describe('SuperOpsNotFoundError', () => {
    it('should have correct defaults', () => {
      const error = new SuperOpsNotFoundError();
      expect(error.name).toBe('SuperOpsNotFoundError');
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('Resource not found.');
    });
  });

  describe('SuperOpsValidationError', () => {
    it('should have correct defaults', () => {
      const error = new SuperOpsValidationError();
      expect(error.name).toBe('SuperOpsValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.validationErrors).toEqual([]);
    });

    it('should include validation errors', () => {
      const validationErrors = [
        { field: 'name', message: 'Name is required' },
        { field: 'email', message: 'Invalid email format' },
      ];
      const error = new SuperOpsValidationError('Validation failed', validationErrors);

      expect(error.validationErrors).toEqual(validationErrors);
    });

    it('should format error messages', () => {
      const error = new SuperOpsValidationError('Validation failed', [
        { field: 'name', message: 'Name is required' },
      ]);

      const messages = error.getErrorMessages();
      expect(messages).toContain('name: Name is required');
    });

    it('should include validation errors in toString', () => {
      const error = new SuperOpsValidationError('Validation failed', [
        { field: 'name', message: 'Name is required' },
      ]);

      const str = error.toString();
      expect(str).toContain('Validation errors:');
      expect(str).toContain('name: Name is required');
    });
  });

  describe('SuperOpsRateLimitError', () => {
    it('should have correct defaults', () => {
      const error = new SuperOpsRateLimitError();
      expect(error.name).toBe('SuperOpsRateLimitError');
      expect(error.code).toBe('RATE_LIMITED');
    });

    it('should include retryAfter', () => {
      const error = new SuperOpsRateLimitError('Rate limited', 5000);
      expect(error.retryAfter).toBe(5000);
    });
  });

  describe('SuperOpsServerError', () => {
    it('should have correct defaults', () => {
      const error = new SuperOpsServerError();
      expect(error.name).toBe('SuperOpsServerError');
      expect(error.code).toBe('SERVER_ERROR');
    });
  });

  describe('SuperOpsNetworkError', () => {
    it('should have correct defaults', () => {
      const error = new SuperOpsNetworkError();
      expect(error.name).toBe('SuperOpsNetworkError');
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('should include cause', () => {
      const cause = new Error('Connection refused');
      const error = new SuperOpsNetworkError('Network error', cause);
      expect(error.cause).toBe(cause);
    });
  });

  describe('SuperOpsTimeoutError', () => {
    it('should include timeout value', () => {
      const error = new SuperOpsTimeoutError('Timeout', 30000);
      expect(error.name).toBe('SuperOpsTimeoutError');
      expect(error.code).toBe('TIMEOUT');
      expect(error.timeout).toBe(30000);
    });
  });

  describe('createErrorFromGraphQL', () => {
    it('should create AuthenticationError for UNAUTHENTICATED code', () => {
      const error = createErrorFromGraphQL([
        { message: 'Invalid token', extensions: { code: 'UNAUTHENTICATED', message: '' } },
      ]);
      expect(error).toBeInstanceOf(SuperOpsAuthenticationError);
    });

    it('should create NotFoundError for NOT_FOUND code', () => {
      const error = createErrorFromGraphQL([
        { message: 'Not found', extensions: { code: 'NOT_FOUND', message: '' } },
      ]);
      expect(error).toBeInstanceOf(SuperOpsNotFoundError);
    });

    it('should create ValidationError for BAD_USER_INPUT code', () => {
      const error = createErrorFromGraphQL([
        {
          message: 'Invalid input',
          path: ['input', 'name'],
          extensions: { code: 'BAD_USER_INPUT', message: '' },
        },
      ]);
      expect(error).toBeInstanceOf(SuperOpsValidationError);
    });

    it('should create RateLimitError for RATE_LIMITED code', () => {
      const error = createErrorFromGraphQL([
        { message: 'Rate limited', extensions: { code: 'RATE_LIMITED', message: '' } },
      ]);
      expect(error).toBeInstanceOf(SuperOpsRateLimitError);
    });

    it('should create ServerError for INTERNAL_SERVER_ERROR code', () => {
      const error = createErrorFromGraphQL([
        { message: 'Server error', extensions: { code: 'INTERNAL_SERVER_ERROR', message: '' } },
      ]);
      expect(error).toBeInstanceOf(SuperOpsServerError);
    });

    it('should create generic error for unknown codes', () => {
      const error = createErrorFromGraphQL([
        { message: 'Unknown error', extensions: { code: 'CUSTOM_ERROR', message: '' } },
      ]);
      expect(error).toBeInstanceOf(SuperOpsError);
      expect(error.code).toBe('CUSTOM_ERROR');
    });

    it('should handle empty errors array', () => {
      const error = createErrorFromGraphQL([]);
      expect(error).toBeInstanceOf(SuperOpsError);
      expect(error.code).toBe('UNKNOWN');
    });
  });
});
