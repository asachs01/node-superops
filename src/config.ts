/**
 * Configuration utilities for SuperOps client
 */

import type {
  SuperOpsClientConfig,
  SuperOpsRegion,
  SuperOpsVertical,
  RateLimitConfig,
  DateHandling,
} from './types/index.js';
import { ENDPOINT_URLS, DEFAULT_RATE_LIMIT_CONFIG } from './types/index.js';

/**
 * Default client configuration values
 */
export const DEFAULT_CONFIG = {
  region: 'us' as SuperOpsRegion,
  vertical: 'msp' as SuperOpsVertical,
  timeout: 30000,
  dates: 'date' as DateHandling,
};

/**
 * Validated and normalized client configuration
 */
export interface ResolvedConfig {
  apiToken: string;
  customerSubDomain: string;
  endpoint: string;
  timeout: number;
  rateLimiter: RateLimitConfig;
  dates: DateHandling;
}

/**
 * Validate that the API token is provided
 */
export function validateApiToken(apiToken: string | undefined): void {
  if (!apiToken) {
    throw new Error('SuperOps API token is required');
  }

  if (typeof apiToken !== 'string') {
    throw new Error('SuperOps API token must be a string');
  }

  if (apiToken.trim().length === 0) {
    throw new Error('SuperOps API token cannot be empty');
  }
}

/**
 * Validate the customer subdomain
 */
export function validateCustomerSubDomain(subdomain: string | undefined): void {
  if (!subdomain) {
    throw new Error('SuperOps customer subdomain is required');
  }

  if (typeof subdomain !== 'string') {
    throw new Error('SuperOps customer subdomain must be a string');
  }

  if (subdomain.trim().length === 0) {
    throw new Error('SuperOps customer subdomain cannot be empty');
  }
}

/**
 * Resolve the GraphQL endpoint from configuration
 */
export function resolveEndpoint(config: SuperOpsClientConfig): string {
  // Explicit endpoint takes precedence
  if (config.endpoint) {
    // Remove trailing slash
    return config.endpoint.replace(/\/+$/, '');
  }

  // Use region and vertical to determine endpoint
  const region = config.region || DEFAULT_CONFIG.region;
  const vertical = config.vertical || DEFAULT_CONFIG.vertical;

  const regionEndpoints = ENDPOINT_URLS[region];
  if (!regionEndpoints) {
    throw new Error(
      `Invalid region "${region}". Valid regions are: ${Object.keys(ENDPOINT_URLS).join(', ')}`
    );
  }

  const endpoint = regionEndpoints[vertical];
  if (!endpoint) {
    throw new Error(
      `Invalid vertical "${vertical}". Valid verticals are: ${Object.keys(regionEndpoints).join(', ')}`
    );
  }

  return endpoint;
}

/**
 * Merge rate limit configuration with defaults
 */
export function resolveRateLimitConfig(config?: Partial<RateLimitConfig>): RateLimitConfig {
  return {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    ...config,
  };
}

/**
 * Validate and resolve the full client configuration
 */
export function resolveConfig(config: SuperOpsClientConfig): ResolvedConfig {
  // Validate required fields
  validateApiToken(config.apiToken);
  validateCustomerSubDomain(config.customerSubDomain);

  // Resolve endpoint
  const endpoint = resolveEndpoint(config);

  // Resolve rate limiter config
  const rateLimiter = resolveRateLimitConfig(config.rateLimiter);

  return {
    apiToken: config.apiToken,
    customerSubDomain: config.customerSubDomain,
    endpoint,
    timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
    rateLimiter,
    dates: config.dates ?? DEFAULT_CONFIG.dates,
  };
}

/**
 * Get standard headers for SuperOps GraphQL API requests
 */
export function getHeaders(apiToken: string, customerSubDomain: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiToken}`,
    CustomerSubDomain: customerSubDomain,
    'Content-Type': 'application/json',
  };
}
