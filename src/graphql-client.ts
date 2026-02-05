/**
 * GraphQL client wrapper for SuperOps API
 */

import { GraphQLClient as GqlClient, gql } from 'graphql-request';
import type { ResolvedConfig } from './config.js';
import { getHeaders } from './config.js';
import { RateLimiter, retryWithBackoff } from './rate-limiter.js';
import {
  SuperOpsError,
  SuperOpsRateLimitError,
  SuperOpsServerError,
  SuperOpsNetworkError,
  SuperOpsTimeoutError,
  createErrorFromGraphQL,
  type GraphQLError,
} from './errors.js';

// Re-export gql for convenience
export { gql };

/**
 * GraphQL request variables
 */
export type Variables = Record<string, unknown>;

/**
 * GraphQL response with potential errors
 */
export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
}

/**
 * SuperOps GraphQL client that handles authentication, rate limiting, and error handling
 */
export class GraphQLClient {
  private readonly client: GqlClient;
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;

  constructor(config: ResolvedConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(config.rateLimiter);

    const headers = getHeaders(config.apiToken, config.customerSubDomain);

    this.client = new GqlClient(config.endpoint, {
      headers,
      // Note: graphql-request handles timeouts via fetch options
      fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(config.timeout) }),
    });
  }

  /**
   * Get the rate limiter instance
   */
  getRateLimiter(): RateLimiter {
    return this.rateLimiter;
  }

  /**
   * Execute a GraphQL query
   */
  async query<T = unknown>(query: string, variables?: Variables): Promise<T> {
    return this.execute<T>(query, variables);
  }

  /**
   * Execute a GraphQL mutation
   */
  async mutate<T = unknown>(mutation: string, variables?: Variables): Promise<T> {
    return this.execute<T>(mutation, variables);
  }

  /**
   * Execute a GraphQL operation with rate limiting and error handling
   */
  private async execute<T = unknown>(document: string, variables?: Variables): Promise<T> {
    // Wait if rate limited
    await this.rateLimiter.waitIfNeeded();

    const executeRequest = async (): Promise<T> => {
      try {
        // Record the request
        this.rateLimiter.recordRequest();

        // Execute the request
        const result = await this.client.request<T>(document, variables);

        return result;
      } catch (error) {
        // Handle various error types
        throw this.handleError(error);
      }
    };

    // Retry with backoff for rate limits and server errors
    return retryWithBackoff(executeRequest, {
      maxRetries: this.config.rateLimiter.maxRetries,
      baseDelayMs: this.config.rateLimiter.retryAfterMs,
      maxDelayMs: 60000,
      shouldRetry: (error) => {
        // Retry rate limit errors and server errors
        return error instanceof SuperOpsRateLimitError || error instanceof SuperOpsServerError;
      },
    });
  }

  /**
   * Execute a raw request and return the full response including errors
   */
  async rawRequest<T = unknown>(
    document: string,
    variables?: Variables
  ): Promise<GraphQLResponse<T>> {
    await this.rateLimiter.waitIfNeeded();
    this.rateLimiter.recordRequest();

    try {
      const data = await this.client.request<T>(document, variables);
      return { data };
    } catch (error) {
      // Extract GraphQL errors if available
      const gqlError = error as { response?: { errors?: GraphQLError[] } };
      if (gqlError.response?.errors) {
        return { errors: gqlError.response.errors };
      }
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from the GraphQL client
   */
  private handleError(error: unknown): SuperOpsError {
    // Handle graphql-request errors which contain response
    const gqlError = error as {
      response?: { errors?: GraphQLError[]; status?: number };
      message?: string;
      code?: string;
    };

    // Check for GraphQL errors in response
    if (gqlError.response?.errors && gqlError.response.errors.length > 0) {
      return createErrorFromGraphQL(gqlError.response.errors, gqlError.response);
    }

    // Check for network errors
    if (gqlError.code === 'ECONNREFUSED' || gqlError.code === 'ENOTFOUND') {
      return new SuperOpsNetworkError(
        `Network error: ${gqlError.message || 'Connection failed'}`,
        error instanceof Error ? error : undefined
      );
    }

    // Check for timeout
    if (gqlError.code === 'ETIMEDOUT' || gqlError.code === 'TIMEOUT') {
      return new SuperOpsTimeoutError(
        `Request timed out after ${this.config.timeout}ms`,
        this.config.timeout
      );
    }

    // Check for HTTP status in response
    if (gqlError.response?.status) {
      const status = gqlError.response.status;
      if (status === 429) {
        return new SuperOpsRateLimitError('Rate limit exceeded', undefined, gqlError.response);
      }
      if (status >= 500) {
        return new SuperOpsServerError(
          `Server error (HTTP ${status})`,
          gqlError.response
        );
      }
    }

    // Generic error
    return new SuperOpsError(
      gqlError.message || 'Unknown error occurred',
      'UNKNOWN',
      error
    );
  }
}
