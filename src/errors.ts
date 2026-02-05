/**
 * Custom error classes for SuperOps API errors
 */

import type { GraphQLErrorExtension } from './types/index.js';

/**
 * GraphQL error structure
 */
export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: GraphQLErrorExtension;
}

/**
 * Base error class for all SuperOps errors
 */
export class SuperOpsError extends Error {
  /** Error code */
  public readonly code: string;
  /** Raw response */
  public readonly response: unknown;
  /** GraphQL errors from the response */
  public readonly graphqlErrors?: GraphQLError[];

  constructor(
    message: string,
    code: string,
    response?: unknown,
    graphqlErrors?: GraphQLError[]
  ) {
    super(message);
    this.name = 'SuperOpsError';
    this.code = code;
    this.response = response;
    this.graphqlErrors = graphqlErrors;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create a string representation of the error
   */
  toString(): string {
    const parts = [`${this.name}: ${this.message} (${this.code})`];
    if (this.graphqlErrors && this.graphqlErrors.length > 0) {
      parts.push(`GraphQL errors: ${this.graphqlErrors.map((e) => e.message).join(', ')}`);
    }
    return parts.join('\n');
  }
}

/**
 * Error thrown when authentication fails
 */
export class SuperOpsAuthenticationError extends SuperOpsError {
  constructor(
    message: string = 'Authentication failed. Check your API token and customer subdomain.',
    response?: unknown,
    graphqlErrors?: GraphQLError[]
  ) {
    super(message, 'AUTHENTICATION_ERROR', response, graphqlErrors);
    this.name = 'SuperOpsAuthenticationError';
  }
}

/**
 * Error thrown when a resource is not found
 */
export class SuperOpsNotFoundError extends SuperOpsError {
  constructor(
    message: string = 'Resource not found.',
    response?: unknown,
    graphqlErrors?: GraphQLError[]
  ) {
    super(message, 'NOT_FOUND', response, graphqlErrors);
    this.name = 'SuperOpsNotFoundError';
  }
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
}

/**
 * Error thrown when request validation fails
 */
export class SuperOpsValidationError extends SuperOpsError {
  /** Parsed validation errors */
  public readonly validationErrors: ValidationErrorDetail[];

  constructor(
    message: string = 'Validation failed.',
    validationErrors: ValidationErrorDetail[] = [],
    response?: unknown,
    graphqlErrors?: GraphQLError[]
  ) {
    super(message, 'VALIDATION_ERROR', response, graphqlErrors);
    this.name = 'SuperOpsValidationError';
    this.validationErrors = validationErrors;
  }

  /**
   * Get a formatted list of validation error messages
   */
  getErrorMessages(): string[] {
    return this.validationErrors.map((error) => `${error.field}: ${error.message}`);
  }

  /**
   * Create a string representation including all validation errors
   */
  toString(): string {
    const base = super.toString();
    const errorMessages = this.getErrorMessages();
    if (errorMessages.length > 0) {
      return `${base}\nValidation errors:\n${errorMessages.map((e) => `  - ${e}`).join('\n')}`;
    }
    return base;
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class SuperOpsRateLimitError extends SuperOpsError {
  /** Suggested retry delay in milliseconds */
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded.',
    retryAfter?: number,
    response?: unknown,
    graphqlErrors?: GraphQLError[]
  ) {
    super(message, 'RATE_LIMITED', response, graphqlErrors);
    this.name = 'SuperOpsRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when the server returns an error
 */
export class SuperOpsServerError extends SuperOpsError {
  constructor(
    message: string = 'Server error occurred.',
    response?: unknown,
    graphqlErrors?: GraphQLError[]
  ) {
    super(message, 'SERVER_ERROR', response, graphqlErrors);
    this.name = 'SuperOpsServerError';
  }
}

/**
 * Error thrown for network-level errors
 */
export class SuperOpsNetworkError extends SuperOpsError {
  /** The original error that caused this network error */
  public readonly cause?: Error;

  constructor(message: string = 'Network error occurred.', cause?: Error) {
    super(message, 'NETWORK_ERROR');
    this.name = 'SuperOpsNetworkError';
    this.cause = cause;
  }
}

/**
 * Error thrown when request times out
 */
export class SuperOpsTimeoutError extends SuperOpsError {
  /** Timeout duration in milliseconds */
  public readonly timeout: number;

  constructor(message: string = 'Request timed out.', timeout: number) {
    super(message, 'TIMEOUT');
    this.name = 'SuperOpsTimeoutError';
    this.timeout = timeout;
  }
}

/**
 * Create an appropriate error instance based on GraphQL error code
 */
export function createErrorFromGraphQL(
  errors: GraphQLError[],
  response?: unknown
): SuperOpsError {
  if (!errors || errors.length === 0) {
    return new SuperOpsError('Unknown error', 'UNKNOWN', response);
  }

  const primaryError = errors[0];
  const code = primaryError.extensions?.code || 'UNKNOWN';
  const message = primaryError.message;

  switch (code) {
    case 'UNAUTHENTICATED':
    case 'UNAUTHORIZED':
    case 'FORBIDDEN':
      return new SuperOpsAuthenticationError(message, response, errors);

    case 'NOT_FOUND':
      return new SuperOpsNotFoundError(message, response, errors);

    case 'BAD_USER_INPUT':
    case 'VALIDATION_ERROR': {
      // Try to parse validation errors from extensions
      const validationErrors: ValidationErrorDetail[] = [];
      for (const error of errors) {
        if (error.path && error.path.length > 0) {
          validationErrors.push({
            field: error.path.join('.'),
            message: error.message,
          });
        }
      }
      return new SuperOpsValidationError(message, validationErrors, response, errors);
    }

    case 'RATE_LIMITED':
      return new SuperOpsRateLimitError(message, undefined, response, errors);

    case 'INTERNAL_SERVER_ERROR':
    case 'GRAPHQL_PARSE_FAILED':
    case 'GRAPHQL_VALIDATION_FAILED':
      return new SuperOpsServerError(message, response, errors);

    default:
      return new SuperOpsError(message, code, response, errors);
  }
}
