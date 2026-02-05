/**
 * Tickets integration tests
 */

import { describe, it, expect } from 'vitest';
import { SuperOpsClient } from '../../src/client.js';

describe('Tickets Resource', () => {
  const client = new SuperOpsClient({
    apiToken: 'test-token',
    customerSubDomain: 'test-company',
    region: 'us',
    vertical: 'msp',
  });

  describe('get', () => {
    it('should get a single ticket by ID', async () => {
      const ticket = await client.tickets.get('ticket-001');

      expect(ticket.id).toBe('ticket-001');
      expect(ticket.subject).toBe('Computer not starting');
      expect(ticket.status).toBe('OPEN');
      expect(ticket.priority).toBe('HIGH');
      expect(ticket.type).toBe('INCIDENT');
    });
  });

  describe('list', () => {
    it('should list tickets with pagination info', async () => {
      const result = await client.tickets.list();

      expect(result.edges).toBeDefined();
      expect(result.edges.length).toBeGreaterThan(0);
      expect(result.pageInfo).toBeDefined();
    });

    it('should accept filter parameters', async () => {
      const result = await client.tickets.list({
        filter: {
          status: 'OPEN',
          priority: 'HIGH',
        },
      });

      expect(result.edges).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a new ticket', async () => {
      const ticket = await client.tickets.create({
        subject: 'New Issue',
        priority: 'MEDIUM',
        clientId: 'client-456',
      });

      expect(ticket.id).toBe('ticket-new');
      expect(ticket.subject).toBe('New Issue');
    });
  });

  describe('changeStatus', () => {
    it('should change ticket status', async () => {
      const ticket = await client.tickets.changeStatus('ticket-001', 'IN_PROGRESS');

      expect(ticket.status).toBe('IN_PROGRESS');
    });
  });

  describe('addNote', () => {
    it('should add a note to a ticket', async () => {
      const note = await client.tickets.addNote('ticket-001', 'This is a test note', false);

      expect(note.id).toBeDefined();
      expect(note.content).toBe('This is a test note');
      expect(note.isPublic).toBe(false);
    });

    it('should add a public note', async () => {
      const note = await client.tickets.addNote('ticket-001', 'Public note', true);

      expect(note.isPublic).toBe(true);
    });
  });
});
