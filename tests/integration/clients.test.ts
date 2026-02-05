/**
 * Clients integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';

describe('Clients Resource', () => {
  const superopsClient = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single client by ID', async () => {
      const clientRecord = await superopsClient.clients.get('client-456');

      expect(clientRecord.id).toBe('client-456');
      expect(clientRecord.name).toBe('Acme Corp');
      expect(clientRecord.status).toBe('ACTIVE');
      expect(clientRecord.type).toBe('CUSTOMER');
      expect(clientRecord.website).toBe('https://acme.example.com');
    });
  });

  describe('list', () => {
    it('should list clients with pagination info', async () => {
      const result = await superopsClient.clients.list();

      expect(result.edges).toBeDefined();
      expect(result.edges.length).toBeGreaterThan(0);
      expect(result.pageInfo).toBeDefined();
    });
  });

  describe('search', () => {
    it('should search for clients by query', async () => {
      const result = await superopsClient.clients.search('Acme');

      expect(result.edges.length).toBeGreaterThan(0);
      expect(result.edges[0].node.name).toContain('Acme');
    });

    it('should return empty results for non-matching query', async () => {
      const result = await superopsClient.clients.search('NonExistentCompany123');

      expect(result.edges.length).toBe(0);
    });
  });

  describe('listAll', () => {
    it('should support toArray()', async () => {
      const clients = await superopsClient.clients.listAll().toArray();

      expect(clients.length).toBeGreaterThan(0);
    });
  });
});
