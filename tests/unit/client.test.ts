/**
 * Client tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';

describe('SuperOpsClient', () => {
  const validConfig = {
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
  };

  describe('constructor', () => {
    it('should create client with valid config', () => {
      const client = new SuperOpsClient(validConfig);
      expect(client).toBeInstanceOf(SuperOpsClient);
    });

    it('should throw if API token is missing', () => {
      expect(() => new SuperOpsClient({
        apiToken: '',
        customerSubDomain: 'test',
      })).toThrow('SuperOps API token');
    });

    it('should throw if customer subdomain is missing', () => {
      expect(() => new SuperOpsClient({
        apiToken: 'token',
        customerSubDomain: '',
      })).toThrow('customer subdomain');
    });
  });

  describe('resources', () => {
    it('should have all resources initialized', () => {
      const client = new SuperOpsClient(validConfig);

      expect(client.assets).toBeDefined();
      expect(client.tickets).toBeDefined();
      expect(client.clients).toBeDefined();
      expect(client.sites).toBeDefined();
      expect(client.alerts).toBeDefined();
      expect(client.contracts).toBeDefined();
      expect(client.technicians).toBeDefined();
      expect(client.knowledgeBase).toBeDefined();
      expect(client.runbooks).toBeDefined();
      expect(client.patches).toBeDefined();
      expect(client.remoteSessions).toBeDefined();
      expect(client.reports).toBeDefined();
    });
  });

  describe('getConfig', () => {
    it('should return resolved config', () => {
      const client = new SuperOpsClient({
        ...validConfig,
        region: 'eu',
        vertical: 'it',
      });

      const config = client.getConfig();
      expect(config.apiToken).toBe('test-token');
      expect(config.customerSubDomain).toBe('test-company');
      expect(config.endpoint).toBe('https://euapi.superops.ai/it');
    });
  });

  describe('getRateLimitStatus', () => {
    it('should return rate limiter status', () => {
      const client = new SuperOpsClient(validConfig);
      const status = client.getRateLimitStatus();

      expect(status).toHaveProperty('enabled');
      expect(status).toHaveProperty('currentCount');
      expect(status).toHaveProperty('maxRequests');
      expect(status).toHaveProperty('remaining');
    });
  });

  describe('getGraphQLClient', () => {
    it('should return GraphQL client instance', () => {
      const client = new SuperOpsClient(validConfig);
      const graphqlClient = client.getGraphQLClient();

      expect(graphqlClient).toBeDefined();
      expect(graphqlClient.getRateLimiter).toBeDefined();
    });
  });
});
