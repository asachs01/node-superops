/**
 * Base resource class for SuperOps API resources
 * Provides common patterns for GraphQL queries and mutations
 */

import type { GraphQLClient } from '../graphql-client.js';
import type {
  AsyncIterableWithHelpers,
  Connection,
  ListParams,
  DateHandling,
} from '../types/index.js';
import { createCursorPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';

/**
 * Options for the base resource
 */
export interface BaseResourceOptions {
  /** GraphQL client instance */
  client: GraphQLClient;
  /** Date handling mode */
  dateHandling: DateHandling;
}

/**
 * Convert a Date or string to ISO string for GraphQL
 */
export function toISOString(value: string | Date | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

/**
 * Convert an ISO string to Date object if dateHandling is 'date'
 */
export function fromISOString(value: string | undefined, dateHandling: DateHandling): string | Date | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (dateHandling === 'date') {
    return new Date(value);
  }
  return value;
}

/**
 * Convert filter values for GraphQL variables
 */
export function prepareFilter<T>(
  filter: T | undefined
): Record<string, unknown> | undefined {
  if (!filter) {
    return undefined;
  }

  const result: Record<string, unknown> = {};
  const filterObj = filter as Record<string, unknown>;

  for (const [key, value] of Object.entries(filterObj)) {
    if (value === undefined) {
      continue;
    }

    // Convert dates to ISO strings
    if (value instanceof Date) {
      result[key] = value.toISOString();
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Base class for SuperOps API resources
 */
export abstract class BaseResource {
  protected readonly client: GraphQLClient;
  protected readonly dateHandling: DateHandling;

  constructor(options: BaseResourceOptions) {
    this.client = options.client;
    this.dateHandling = options.dateHandling;
  }

  /**
   * Create a paginated iterator for list operations
   */
  protected createListIterator<T, TFilter, TOrderBy>(
    queryFn: (params: ListParams<TFilter, TOrderBy>) => Promise<Connection<T>>,
    params?: Omit<ListParams<TFilter, TOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<T> {
    return createCursorPaginatedIterator<T>(
      async ({ first, after }) => {
        return queryFn({
          first,
          after,
          filter: params?.filter,
          orderBy: params?.orderBy,
        });
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}
