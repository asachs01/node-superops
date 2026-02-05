/**
 * Assets integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';
import { SuperOpsNotFoundError } from '../../src/errors.js';

describe('Assets Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single asset by ID', async () => {
      const asset = await client.assets.get('asset-123');

      expect(asset.id).toBe('asset-123');
      expect(asset.name).toBe('Test Workstation');
      expect(asset.type).toBe('WORKSTATION');
      expect(asset.status).toBe('ACTIVE');
      expect(asset.client?.name).toBe('Acme Corp');
    });

    it('should throw NotFoundError for non-existent asset', async () => {
      await expect(client.assets.get('not-found')).rejects.toThrow(SuperOpsNotFoundError);
    });
  });

  describe('list', () => {
    it('should list assets with pagination info', async () => {
      const result = await client.assets.list();

      expect(result.edges).toBeDefined();
      expect(result.edges.length).toBeGreaterThan(0);
      expect(result.pageInfo).toBeDefined();
      expect(result.pageInfo.hasNextPage).toBeDefined();
    });

    it('should accept pagination parameters', async () => {
      const result = await client.assets.list({ first: 10 });

      expect(result.edges).toBeDefined();
    });
  });

  describe('listAll', () => {
    it('should iterate through all assets', async () => {
      const assets: Array<{ id: string; name: string }> = [];

      for await (const asset of client.assets.listAll()) {
        assets.push(asset);
      }

      expect(assets.length).toBe(2); // Based on mock data (2 pages)
      expect(assets[0].name).toBe('Test Workstation');
      expect(assets[1].name).toBe('Test Server');
    });

    it('should support toArray()', async () => {
      const assets = await client.assets.listAll().toArray();

      expect(assets.length).toBe(2);
    });
  });

  describe('create', () => {
    it('should create a new asset', async () => {
      const asset = await client.assets.create({
        name: 'New Asset',
        type: 'LAPTOP',
        clientId: 'client-456',
      });

      expect(asset.id).toBe('asset-new');
      expect(asset.name).toBe('New Asset');
    });
  });

  describe('update', () => {
    it('should update an existing asset', async () => {
      const asset = await client.assets.update('asset-123', {
        name: 'Updated Name',
      });

      expect(asset.name).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should delete an asset', async () => {
      const result = await client.assets.delete('asset-123');

      expect(result).toBe(true);
    });
  });
});
