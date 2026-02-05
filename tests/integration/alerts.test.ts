/**
 * Alerts integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';

describe('Alerts Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('list', () => {
    it('should list alerts with pagination info', async () => {
      const result = await client.alerts.list();

      expect(result.edges).toBeDefined();
      expect(result.edges.length).toBeGreaterThan(0);
      expect(result.pageInfo).toBeDefined();
    });

    it('should accept filter parameters', async () => {
      const result = await client.alerts.list({
        filter: {
          status: 'OPEN',
          severity: 'CRITICAL',
        },
      });

      expect(result.edges).toBeDefined();
    });
  });

  describe('acknowledge', () => {
    it('should acknowledge an alert', async () => {
      const alert = await client.alerts.acknowledge('alert-001');

      expect(alert.id).toBe('alert-001');
      expect(alert.status).toBe('ACKNOWLEDGED');
      expect(alert.acknowledgedAt).toBeDefined();
      expect(alert.acknowledgedBy).toBeDefined();
    });
  });

  describe('resolve', () => {
    it('should resolve an alert', async () => {
      const alert = await client.alerts.resolve('alert-001');

      expect(alert.id).toBe('alert-001');
      expect(alert.status).toBe('RESOLVED');
      expect(alert.resolvedAt).toBeDefined();
      expect(alert.resolvedBy).toBeDefined();
    });
  });
});
