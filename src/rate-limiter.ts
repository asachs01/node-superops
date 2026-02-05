/**
 * Rate limiting implementation for SuperOps API
 * SuperOps allows 800 requests per 1-minute sliding window
 */

import type { RateLimitConfig } from './types/index.js';

/**
 * Timestamp of a request for rate limiting tracking
 */
interface RequestTimestamp {
  timestamp: number;
}

/**
 * Rate limiter class that tracks requests and enforces limits
 */
export class RateLimiter {
  private readonly config: RateLimitConfig;
  private readonly requests: RequestTimestamp[] = [];

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if rate limiting is enabled
   */
  get enabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get the current number of requests in the window
   */
  get currentCount(): number {
    this.pruneOldRequests();
    return this.requests.length;
  }

  /**
   * Get the remaining requests in the window
   */
  get remaining(): number {
    return Math.max(0, this.config.maxRequests - this.currentCount);
  }

  /**
   * Check if we're at the throttle threshold
   */
  get isThrottling(): boolean {
    if (!this.config.enabled) {
      return false;
    }
    const ratio = this.currentCount / this.config.maxRequests;
    return ratio >= this.config.throttleThreshold;
  }

  /**
   * Check if we've exceeded the rate limit
   */
  get isLimited(): boolean {
    if (!this.config.enabled) {
      return false;
    }
    return this.currentCount >= this.config.maxRequests;
  }

  /**
   * Remove requests outside the current window
   */
  private pruneOldRequests(): void {
    const cutoff = Date.now() - this.config.windowMs;
    while (this.requests.length > 0 && this.requests[0].timestamp < cutoff) {
      this.requests.shift();
    }
  }

  /**
   * Record a new request
   */
  recordRequest(): void {
    if (!this.config.enabled) {
      return;
    }
    this.pruneOldRequests();
    this.requests.push({ timestamp: Date.now() });
  }

  /**
   * Calculate the delay needed before making another request
   * Returns 0 if no delay is needed
   */
  getDelayMs(): number {
    if (!this.config.enabled) {
      return 0;
    }

    this.pruneOldRequests();

    // If we're under the throttle threshold, no delay needed
    if (!this.isThrottling) {
      return 0;
    }

    // If we're at the limit, wait for the oldest request to expire
    if (this.isLimited && this.requests.length > 0) {
      const oldestRequest = this.requests[0];
      const expireTime = oldestRequest.timestamp + this.config.windowMs;
      const waitTime = expireTime - Date.now();
      return Math.max(0, waitTime);
    }

    // If we're throttling but not limited, add a small delay
    // This spreads out requests to avoid hitting the limit
    const usedRatio = this.currentCount / this.config.maxRequests;
    const throttleRatio =
      (usedRatio - this.config.throttleThreshold) / (1 - this.config.throttleThreshold);

    // Scale the delay based on how close we are to the limit
    // Maximum delay is the retry delay
    return Math.floor(throttleRatio * this.config.retryAfterMs);
  }

  /**
   * Wait for the required delay before continuing
   */
  async waitIfNeeded(): Promise<void> {
    const delay = this.getDelayMs();
    if (delay > 0) {
      await this.sleep(delay);
    }
  }

  /**
   * Reset the rate limiter (for testing or reconnection)
   */
  reset(): void {
    this.requests.length = 0;
  }

  /**
   * Sleep for the specified number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get rate limiter status for debugging/monitoring
   */
  getStatus(): {
    enabled: boolean;
    currentCount: number;
    maxRequests: number;
    remaining: number;
    windowMs: number;
    isThrottling: boolean;
    isLimited: boolean;
    delayMs: number;
  } {
    return {
      enabled: this.enabled,
      currentCount: this.currentCount,
      maxRequests: this.config.maxRequests,
      remaining: this.remaining,
      windowMs: this.config.windowMs,
      isThrottling: this.isThrottling,
      isLimited: this.isLimited,
      delayMs: this.getDelayMs(),
    };
  }
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs?: number;
  /** Optional callback to determine if an error should be retried */
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Retry with exponential backoff for rate-limited requests
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if this error should be retried
      if (config.shouldRetry && !config.shouldRetry(lastError)) {
        throw lastError;
      }

      // Don't retry if this is the last attempt
      if (attempt === config.maxRetries) {
        throw lastError;
      }

      // Calculate exponential backoff delay
      const delay = Math.min(
        config.baseDelayMs * Math.pow(2, attempt),
        config.maxDelayMs || 60000
      );

      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * delay * 0.1;
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}
