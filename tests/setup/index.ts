/**
 * Test setup for node-superops
 * Configures MSW for mocking GraphQL requests
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server.js';

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});
