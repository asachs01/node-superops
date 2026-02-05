/**
 * Common types shared across all SuperOps resources
 */

/**
 * SuperOps region identifiers
 */
export type SuperOpsRegion = 'us' | 'eu';

/**
 * SuperOps vertical identifiers (MSP or IT)
 */
export type SuperOpsVertical = 'msp' | 'it';

/**
 * Regional and vertical base URLs for the SuperOps API
 */
export const ENDPOINT_URLS: Record<SuperOpsRegion, Record<SuperOpsVertical, string>> = {
  us: {
    msp: 'https://api.superops.ai/msp',
    it: 'https://api.superops.ai/it',
  },
  eu: {
    msp: 'https://euapi.superops.ai/msp',
    it: 'https://euapi.superops.ai/it',
  },
};

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Enable rate limiting (default: true) */
  enabled: boolean;
  /** Maximum requests per window (default: 800) */
  maxRequests: number;
  /** Window duration in milliseconds (default: 60000 - 1 minute) */
  windowMs: number;
  /** Threshold to start throttling (0-1, default: 0.8) */
  throttleThreshold: number;
  /** Delay before retrying after rate limit (default: 5000ms) */
  retryAfterMs: number;
  /** Maximum retry attempts (default: 3) */
  maxRetries: number;
}

/**
 * Default rate limiting configuration for SuperOps (800 req/min)
 */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxRequests: 800,
  windowMs: 60000, // 1 minute
  throttleThreshold: 0.8,
  retryAfterMs: 5000,
  maxRetries: 3,
};

/**
 * Date handling mode
 */
export type DateHandling = 'date' | 'string';

/**
 * Client configuration options
 */
export interface SuperOpsClientConfig {
  /** SuperOps API token */
  apiToken: string;
  /** Customer subdomain identifier */
  customerSubDomain: string;
  /** Region for the API (us or eu) */
  region?: SuperOpsRegion;
  /** Vertical type (msp or it) */
  vertical?: SuperOpsVertical;
  /** Explicit endpoint URL (overrides region/vertical) */
  endpoint?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Rate limiting configuration */
  rateLimiter?: Partial<RateLimitConfig>;
  /** Date handling mode (default: 'date') */
  dates?: DateHandling;
}

/**
 * Cursor-based pagination parameters
 */
export interface CursorPaginationParams {
  /** Number of items to fetch (max varies by resource) */
  first?: number;
  /** Cursor to fetch items after */
  after?: string;
  /** Number of items to fetch from end */
  last?: number;
  /** Cursor to fetch items before */
  before?: string;
}

/**
 * GraphQL connection page info
 */
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

/**
 * GraphQL connection edge
 */
export interface Edge<T> {
  node: T;
  cursor: string;
}

/**
 * GraphQL connection result
 */
export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount?: number;
}

/**
 * Generic list parameters with filtering and ordering
 */
export interface ListParams<TFilter = Record<string, unknown>, TOrderBy = Record<string, unknown>> {
  /** Number of items to fetch */
  first?: number;
  /** Cursor to fetch items after */
  after?: string;
  /** Filter criteria */
  filter?: TFilter;
  /** Order by configuration */
  orderBy?: TOrderBy;
}

/**
 * Order direction
 */
export type OrderDirection = 'ASC' | 'DESC';

/**
 * Base resource type with common fields
 */
export interface BaseResource {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Async iterable with utility methods for pagination
 */
export interface AsyncIterableWithHelpers<T> extends AsyncIterable<T> {
  /** Collect all items into an array */
  toArray(): Promise<T[]>;
}

/**
 * GraphQL error extension from SuperOps
 */
export interface GraphQLErrorExtension {
  code: string;
  statusCode?: number;
  message: string;
}
