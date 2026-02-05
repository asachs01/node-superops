/**
 * Configuration tests
 */

import { describe, it, expect } from 'vitest';
import {
  resolveConfig,
  resolveEndpoint,
  validateApiToken,
  validateCustomerSubDomain,
  getHeaders,
} from '../../src/config.js';

describe('Configuration', () => {
  describe('validateApiToken', () => {
    it('should throw if API token is undefined', () => {
      expect(() => validateApiToken(undefined)).toThrow('SuperOps API token is required');
    });

    it('should throw if API token is empty', () => {
      expect(() => validateApiToken('')).toThrow('SuperOps API token is required');
    });

    it('should throw if API token is whitespace only', () => {
      expect(() => validateApiToken('   ')).toThrow('SuperOps API token cannot be empty');
    });

    it('should pass for valid API token', () => {
      expect(() => validateApiToken('valid-token-123')).not.toThrow();
    });
  });

  describe('validateCustomerSubDomain', () => {
    it('should throw if subdomain is undefined', () => {
      expect(() => validateCustomerSubDomain(undefined)).toThrow(
        'SuperOps customer subdomain is required'
      );
    });

    it('should throw if subdomain is empty', () => {
      expect(() => validateCustomerSubDomain('')).toThrow(
        'SuperOps customer subdomain is required'
      );
    });

    it('should pass for valid subdomain', () => {
      expect(() => validateCustomerSubDomain('my-company')).not.toThrow();
    });
  });

  describe('resolveEndpoint', () => {
    it('should use explicit endpoint when provided', () => {
      const endpoint = resolveEndpoint({
        apiToken: 'test',
        customerSubDomain: 'test',
        endpoint: 'https://custom.api.example.com/',
      });
      expect(endpoint).toBe('https://custom.api.example.com');
    });

    it('should resolve US MSP endpoint by default', () => {
      const endpoint = resolveEndpoint({
        apiToken: 'test',
        customerSubDomain: 'test',
      });
      expect(endpoint).toBe('https://api.superops.ai/msp');
    });

    it('should resolve EU MSP endpoint', () => {
      const endpoint = resolveEndpoint({
        apiToken: 'test',
        customerSubDomain: 'test',
        region: 'eu',
        vertical: 'msp',
      });
      expect(endpoint).toBe('https://euapi.superops.ai/msp');
    });

    it('should resolve US IT endpoint', () => {
      const endpoint = resolveEndpoint({
        apiToken: 'test',
        customerSubDomain: 'test',
        region: 'us',
        vertical: 'it',
      });
      expect(endpoint).toBe('https://api.superops.ai/it');
    });

    it('should resolve EU IT endpoint', () => {
      const endpoint = resolveEndpoint({
        apiToken: 'test',
        customerSubDomain: 'test',
        region: 'eu',
        vertical: 'it',
      });
      expect(endpoint).toBe('https://euapi.superops.ai/it');
    });

    it('should throw for invalid region', () => {
      expect(() =>
        resolveEndpoint({
          apiToken: 'test',
          customerSubDomain: 'test',
          region: 'invalid' as any,
        })
      ).toThrow('Invalid region');
    });
  });

  describe('resolveConfig', () => {
    it('should resolve full config with defaults', () => {
      const config = resolveConfig({
        apiToken: 'test-token',
        customerSubDomain: 'my-company',
      });

      expect(config.apiToken).toBe('test-token');
      expect(config.customerSubDomain).toBe('my-company');
      expect(config.endpoint).toBe('https://api.superops.ai/msp');
      expect(config.timeout).toBe(30000);
      expect(config.dates).toBe('date');
      expect(config.rateLimiter.enabled).toBe(true);
      expect(config.rateLimiter.maxRequests).toBe(800);
      expect(config.rateLimiter.windowMs).toBe(60000);
    });

    it('should override defaults with provided values', () => {
      const config = resolveConfig({
        apiToken: 'test-token',
        customerSubDomain: 'my-company',
        region: 'eu',
        vertical: 'it',
        timeout: 60000,
        dates: 'string',
        rateLimiter: {
          maxRequests: 500,
        },
      });

      expect(config.endpoint).toBe('https://euapi.superops.ai/it');
      expect(config.timeout).toBe(60000);
      expect(config.dates).toBe('string');
      expect(config.rateLimiter.maxRequests).toBe(500);
      expect(config.rateLimiter.windowMs).toBe(60000); // default maintained
    });
  });

  describe('getHeaders', () => {
    it('should return correct headers', () => {
      const headers = getHeaders('my-token', 'my-subdomain');

      expect(headers['Authorization']).toBe('Bearer my-token');
      expect(headers['CustomerSubDomain']).toBe('my-subdomain');
      expect(headers['Content-Type']).toBe('application/json');
    });
  });
});
