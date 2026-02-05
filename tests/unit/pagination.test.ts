/**
 * Pagination tests
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createCursorPaginatedIterator,
  createPageIterator,
  collectAll,
  take,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../../src/pagination.js';
import type { Connection } from '../../src/types/index.js';

describe('Pagination', () => {
  // Helper to create mock connection response
  function createMockConnection<T>(
    items: T[],
    hasNextPage: boolean,
    endCursor?: string
  ): Connection<T> {
    return {
      edges: items.map((item, index) => ({
        node: item,
        cursor: `cursor-${index}`,
      })),
      pageInfo: {
        hasNextPage,
        hasPreviousPage: false,
        startCursor: items.length > 0 ? 'cursor-0' : undefined,
        endCursor: items.length > 0 ? endCursor || `cursor-${items.length - 1}` : undefined,
      },
      totalCount: items.length,
    };
  }

  describe('createCursorPaginatedIterator', () => {
    it('should iterate through items from a single page', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        createMockConnection(['item1', 'item2', 'item3'], false)
      );

      const iterator = createCursorPaginatedIterator(fetcher);
      const items: string[] = [];

      for await (const item of iterator) {
        items.push(item);
      }

      expect(items).toEqual(['item1', 'item2', 'item3']);
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('should iterate through multiple pages', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce(createMockConnection(['item1', 'item2'], true, 'cursor-page1'))
        .mockResolvedValueOnce(createMockConnection(['item3', 'item4'], false));

      const iterator = createCursorPaginatedIterator(fetcher);
      const items: string[] = [];

      for await (const item of iterator) {
        items.push(item);
      }

      expect(items).toEqual(['item1', 'item2', 'item3', 'item4']);
      expect(fetcher).toHaveBeenCalledTimes(2);
      expect(fetcher).toHaveBeenNthCalledWith(1, { first: DEFAULT_PAGE_SIZE, after: undefined });
      expect(fetcher).toHaveBeenNthCalledWith(2, { first: DEFAULT_PAGE_SIZE, after: 'cursor-page1' });
    });

    it('should handle empty results', async () => {
      const fetcher = vi.fn().mockResolvedValue(createMockConnection([], false));

      const iterator = createCursorPaginatedIterator(fetcher);
      const items: string[] = [];

      for await (const item of iterator) {
        items.push(item);
      }

      expect(items).toEqual([]);
    });

    it('should respect maxItems option', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce(createMockConnection(['item1', 'item2', 'item3'], true, 'cursor-1'));

      const iterator = createCursorPaginatedIterator(fetcher, { maxItems: 2 });
      const items: string[] = [];

      for await (const item of iterator) {
        items.push(item);
      }

      expect(items).toEqual(['item1', 'item2']);
    });

    it('should respect custom pageSize', async () => {
      const fetcher = vi.fn().mockResolvedValue(createMockConnection(['item1'], false));

      const iterator = createCursorPaginatedIterator(fetcher, { pageSize: 10 });
      const items: string[] = [];

      for await (const item of iterator) {
        items.push(item);
      }

      expect(fetcher).toHaveBeenCalledWith({ first: 10, after: undefined });
    });

    it('should cap pageSize at MAX_PAGE_SIZE', async () => {
      const fetcher = vi.fn().mockResolvedValue(createMockConnection(['item1'], false));

      const iterator = createCursorPaginatedIterator(fetcher, { pageSize: 500 });
      const items: string[] = [];

      for await (const item of iterator) {
        items.push(item);
      }

      expect(fetcher).toHaveBeenCalledWith({ first: MAX_PAGE_SIZE, after: undefined });
    });

    it('should have toArray helper', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        createMockConnection(['item1', 'item2'], false)
      );

      const iterator = createCursorPaginatedIterator(fetcher);
      const items = await iterator.toArray();

      expect(items).toEqual(['item1', 'item2']);
    });
  });

  describe('createPageIterator', () => {
    it('should yield entire pages', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce(createMockConnection(['item1', 'item2'], true, 'cursor-1'))
        .mockResolvedValueOnce(createMockConnection(['item3', 'item4'], false));

      const iterator = createPageIterator(fetcher);
      const pages: Connection<string>[] = [];

      for await (const page of iterator) {
        pages.push(page);
      }

      expect(pages).toHaveLength(2);
      expect(pages[0].edges.map(e => e.node)).toEqual(['item1', 'item2']);
      expect(pages[1].edges.map(e => e.node)).toEqual(['item3', 'item4']);
    });

    it('should handle empty results', async () => {
      const fetcher = vi.fn().mockResolvedValue(createMockConnection([], false));

      const iterator = createPageIterator(fetcher);
      const pages: Connection<string>[] = [];

      for await (const page of iterator) {
        pages.push(page);
      }

      expect(pages).toEqual([]);
    });
  });

  describe('collectAll', () => {
    it('should collect all items into an array', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce(createMockConnection(['item1', 'item2'], true, 'cursor-1'))
        .mockResolvedValueOnce(createMockConnection(['item3'], false));

      const items = await collectAll(fetcher);
      expect(items).toEqual(['item1', 'item2', 'item3']);
    });
  });

  describe('take', () => {
    it('should get first N items', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce(createMockConnection(['item1', 'item2', 'item3'], true, 'cursor-1'));

      const items = await take(fetcher, 2);
      expect(items).toEqual(['item1', 'item2']);
    });
  });

  describe('constants', () => {
    it('should have correct DEFAULT_PAGE_SIZE', () => {
      expect(DEFAULT_PAGE_SIZE).toBe(50);
    });

    it('should have correct MAX_PAGE_SIZE', () => {
      expect(MAX_PAGE_SIZE).toBe(100);
    });
  });
});
