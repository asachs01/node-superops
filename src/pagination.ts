/**
 * Cursor-based pagination utilities for SuperOps GraphQL API
 */

import type { AsyncIterableWithHelpers, Connection, PageInfo } from './types/index.js';

/**
 * Default page size for pagination
 */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Maximum page size allowed
 */
export const MAX_PAGE_SIZE = 100;

/**
 * Function type for fetching a single page of results
 */
export type PageFetcher<T> = (params: {
  first: number;
  after?: string;
}) => Promise<Connection<T>>;

/**
 * Options for paginated iteration
 */
export interface PaginationOptions {
  /** Page size (default: 50, max: 100) */
  pageSize?: number;
  /** Maximum number of items to return (undefined for all) */
  maxItems?: number;
}

/**
 * Create an async iterable that automatically paginates through all results
 * using cursor-based pagination. Yields individual items, not pages.
 */
export function createCursorPaginatedIterator<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): AsyncIterableWithHelpers<T> {
  const pageSize = Math.min(options.pageSize || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const maxItems = options.maxItems;

  let currentItems: T[] = [];
  let currentIndex = 0;
  let totalReturned = 0;
  let hasMore = true;
  let endCursor: string | undefined;
  let pageInfo: PageInfo | undefined;

  const iterator: AsyncIterator<T> = {
    async next(): Promise<IteratorResult<T>> {
      // Check if we've hit the max items limit
      if (maxItems !== undefined && totalReturned >= maxItems) {
        return { done: true, value: undefined };
      }

      // If we've exhausted current items, fetch the next page
      while (currentIndex >= currentItems.length && hasMore) {
        const connection = await fetcher({
          first: pageSize,
          after: endCursor,
        });

        currentItems = connection.edges.map((edge) => edge.node);
        pageInfo = connection.pageInfo;
        currentIndex = 0;

        // Update cursor and hasMore for next iteration
        endCursor = pageInfo.endCursor;
        hasMore = pageInfo.hasNextPage;

        // If the response is empty, we're done
        if (currentItems.length === 0) {
          return { done: true, value: undefined };
        }
      }

      // If we've exhausted all items
      if (currentIndex >= currentItems.length) {
        return { done: true, value: undefined };
      }

      // Return the next item
      const item = currentItems[currentIndex++];
      totalReturned++;

      return { done: false, value: item };
    },
  };

  const iterable: AsyncIterableWithHelpers<T> = {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return iterator;
    },

    async toArray(): Promise<T[]> {
      const results: T[] = [];
      for await (const item of this) {
        results.push(item);
      }
      return results;
    },
  };

  return iterable;
}

/**
 * Create a page iterator that yields entire connection pages
 */
export function createPageIterator<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): AsyncIterableWithHelpers<Connection<T>> {
  const pageSize = Math.min(options.pageSize || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  let hasMore = true;
  let endCursor: string | undefined;

  const iterator: AsyncIterator<Connection<T>> = {
    async next(): Promise<IteratorResult<Connection<T>>> {
      if (!hasMore) {
        return { done: true, value: undefined };
      }

      const connection = await fetcher({
        first: pageSize,
        after: endCursor,
      });

      // Update for next iteration
      endCursor = connection.pageInfo.endCursor;
      hasMore = connection.pageInfo.hasNextPage;

      // If the response is empty and we've already fetched at least one page, we're done
      if (connection.edges.length === 0) {
        return { done: true, value: undefined };
      }

      return { done: false, value: connection };
    },
  };

  const iterable: AsyncIterableWithHelpers<Connection<T>> = {
    [Symbol.asyncIterator](): AsyncIterator<Connection<T>> {
      return iterator;
    },

    async toArray(): Promise<Connection<T>[]> {
      const results: Connection<T>[] = [];
      for await (const page of this) {
        results.push(page);
      }
      return results;
    },
  };

  return iterable;
}

/**
 * Collect all items from a paginated iterator into an array
 */
export async function collectAll<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): Promise<T[]> {
  return createCursorPaginatedIterator(fetcher, options).toArray();
}

/**
 * Get the first N items from a paginated source
 */
export async function take<T>(
  fetcher: PageFetcher<T>,
  count: number,
  options: PaginationOptions = {}
): Promise<T[]> {
  return createCursorPaginatedIterator(fetcher, {
    ...options,
    maxItems: count,
  }).toArray();
}
