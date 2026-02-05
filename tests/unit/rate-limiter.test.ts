/**
 * Rate limiter tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RateLimiter, retryWithBackoff } from '../../src/rate-limiter.js';
import type { RateLimitConfig } from '../../src/types/index.js';

describe('RateLimiter', () => {
  const defaultConfig: RateLimitConfig = {
    enabled: true,
    maxRequests: 10,
    windowMs: 1000,
    throttleThreshold: 0.8,
    retryAfterMs: 100,
    maxRetries: 3,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('enabled', () => {
    it('should return enabled status', () => {
      const limiter = new RateLimiter(defaultConfig);
      expect(limiter.enabled).toBe(true);

      const disabledLimiter = new RateLimiter({ ...defaultConfig, enabled: false });
      expect(disabledLimiter.enabled).toBe(false);
    });
  });

  describe('currentCount', () => {
    it('should start at 0', () => {
      const limiter = new RateLimiter(defaultConfig);
      expect(limiter.currentCount).toBe(0);
    });

    it('should increment when recording requests', () => {
      const limiter = new RateLimiter(defaultConfig);
      limiter.recordRequest();
      expect(limiter.currentCount).toBe(1);
      limiter.recordRequest();
      expect(limiter.currentCount).toBe(2);
    });

    it('should not count when disabled', () => {
      const limiter = new RateLimiter({ ...defaultConfig, enabled: false });
      limiter.recordRequest();
      expect(limiter.currentCount).toBe(0);
    });
  });

  describe('remaining', () => {
    it('should return max requests initially', () => {
      const limiter = new RateLimiter(defaultConfig);
      expect(limiter.remaining).toBe(10);
    });

    it('should decrease as requests are made', () => {
      const limiter = new RateLimiter(defaultConfig);
      limiter.recordRequest();
      limiter.recordRequest();
      limiter.recordRequest();
      expect(limiter.remaining).toBe(7);
    });
  });

  describe('isThrottling', () => {
    it('should be false when under threshold', () => {
      const limiter = new RateLimiter(defaultConfig);
      // 7 requests = 70% (under 80% threshold)
      for (let i = 0; i < 7; i++) {
        limiter.recordRequest();
      }
      expect(limiter.isThrottling).toBe(false);
    });

    it('should be true when at or over threshold', () => {
      const limiter = new RateLimiter(defaultConfig);
      // 8 requests = 80% (at threshold)
      for (let i = 0; i < 8; i++) {
        limiter.recordRequest();
      }
      expect(limiter.isThrottling).toBe(true);
    });

    it('should be false when disabled', () => {
      const limiter = new RateLimiter({ ...defaultConfig, enabled: false });
      for (let i = 0; i < 10; i++) {
        limiter.recordRequest();
      }
      expect(limiter.isThrottling).toBe(false);
    });
  });

  describe('isLimited', () => {
    it('should be false when under limit', () => {
      const limiter = new RateLimiter(defaultConfig);
      for (let i = 0; i < 9; i++) {
        limiter.recordRequest();
      }
      expect(limiter.isLimited).toBe(false);
    });

    it('should be true when at limit', () => {
      const limiter = new RateLimiter(defaultConfig);
      for (let i = 0; i < 10; i++) {
        limiter.recordRequest();
      }
      expect(limiter.isLimited).toBe(true);
    });
  });

  describe('pruning old requests', () => {
    it('should remove requests outside the window', () => {
      const limiter = new RateLimiter(defaultConfig);

      // Make some requests
      limiter.recordRequest();
      limiter.recordRequest();
      expect(limiter.currentCount).toBe(2);

      // Advance time past the window
      vi.advanceTimersByTime(1500);

      // Count should reset
      expect(limiter.currentCount).toBe(0);
    });
  });

  describe('getDelayMs', () => {
    it('should return 0 when disabled', () => {
      const limiter = new RateLimiter({ ...defaultConfig, enabled: false });
      for (let i = 0; i < 10; i++) {
        limiter.recordRequest();
      }
      expect(limiter.getDelayMs()).toBe(0);
    });

    it('should return 0 when under throttle threshold', () => {
      const limiter = new RateLimiter(defaultConfig);
      limiter.recordRequest();
      expect(limiter.getDelayMs()).toBe(0);
    });

    it('should return non-zero when throttling', () => {
      const limiter = new RateLimiter(defaultConfig);
      for (let i = 0; i < 9; i++) {
        limiter.recordRequest();
      }
      expect(limiter.getDelayMs()).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should clear all tracked requests', () => {
      const limiter = new RateLimiter(defaultConfig);
      for (let i = 0; i < 5; i++) {
        limiter.recordRequest();
      }
      expect(limiter.currentCount).toBe(5);

      limiter.reset();
      expect(limiter.currentCount).toBe(0);
    });
  });

  describe('getStatus', () => {
    it('should return complete status', () => {
      const limiter = new RateLimiter(defaultConfig);
      limiter.recordRequest();

      const status = limiter.getStatus();
      expect(status.enabled).toBe(true);
      expect(status.currentCount).toBe(1);
      expect(status.maxRequests).toBe(10);
      expect(status.remaining).toBe(9);
      expect(status.windowMs).toBe(1000);
      expect(status.isThrottling).toBe(false);
      expect(status.isLimited).toBe(false);
      expect(typeof status.delayMs).toBe('number');
    });
  });
});

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return result on success', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const resultPromise = retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 100,
    });

    const result = await resultPromise;
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    const resultPromise = retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 100,
    });

    // Advance through the first retry delay
    await vi.advanceTimersByTimeAsync(200);

    const result = await resultPromise;
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should throw after max retries', async () => {
    vi.useRealTimers(); // Use real timers for this test to avoid unhandled rejection

    const error = new Error('persistent failure');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      retryWithBackoff(fn, {
        maxRetries: 1,
        baseDelayMs: 10,
        maxDelayMs: 20,
      })
    ).rejects.toThrow('persistent failure');

    expect(fn).toHaveBeenCalledTimes(2); // Initial + 1 retry
  });

  it('should not retry when shouldRetry returns false', async () => {
    const error = new Error('non-retryable');
    const fn = vi.fn().mockRejectedValue(error);

    const resultPromise = retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 100,
      shouldRetry: () => false,
    });

    await expect(resultPromise).rejects.toThrow('non-retryable');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
