/**
 * node-superops
 * Comprehensive, fully-typed Node.js/TypeScript library for the SuperOps.ai GraphQL API
 *
 * @packageDocumentation
 */

// Main client
export { SuperOpsClient } from './client.js';

// Configuration
export { resolveConfig, getHeaders, resolveEndpoint } from './config.js';
export type { ResolvedConfig } from './config.js';

// GraphQL client
export { GraphQLClient, gql } from './graphql-client.js';
export type { Variables, GraphQLResponse } from './graphql-client.js';

// Rate limiting
export { RateLimiter, retryWithBackoff } from './rate-limiter.js';
export type { RetryConfig } from './rate-limiter.js';

// Pagination
export {
  createCursorPaginatedIterator,
  createPageIterator,
  collectAll,
  take,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from './pagination.js';
export type { PageFetcher, PaginationOptions } from './pagination.js';

// Error classes
export {
  SuperOpsError,
  SuperOpsAuthenticationError,
  SuperOpsNotFoundError,
  SuperOpsValidationError,
  SuperOpsRateLimitError,
  SuperOpsServerError,
  SuperOpsNetworkError,
  SuperOpsTimeoutError,
  createErrorFromGraphQL,
} from './errors.js';
export type { GraphQLError, ValidationErrorDetail } from './errors.js';

// Resources
export {
  BaseResource,
  AssetsResource,
  TicketsResource,
  ClientsResource,
  SitesResource,
  AlertsResource,
  ContractsResource,
  TechniciansResource,
  KnowledgeBaseResource,
  RunbooksResource,
  PatchesResource,
  RemoteSessionsResource,
  ReportsResource,
} from './resources/index.js';
export type { BaseResourceOptions } from './resources/base.js';

// All types
export * from './types/index.js';
