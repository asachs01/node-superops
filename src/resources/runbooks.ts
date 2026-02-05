/**
 * Runbooks resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Runbook,
  RunbookExecution,
  RunbookFilter,
  RunbookOrderBy,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for runbooks
 */
const RUNBOOK_FRAGMENT = gql`
  fragment RunbookFields on Runbook {
    id
    name
    description
    status
    category
    tags
    estimatedDurationMinutes
    lastExecutedAt
    executionCount
    createdAt
    updatedAt
    createdBy {
      id
      name
    }
    steps {
      id
      name
      description
      order
      type
      continueOnError
    }
  }
`;

const EXECUTION_FRAGMENT = gql`
  fragment ExecutionFields on RunbookExecution {
    id
    runbookId
    status
    startedAt
    completedAt
    targetIds
    createdAt
    updatedAt
    initiatedBy {
      id
      name
    }
    results {
      targetId
      targetName
      status
      startedAt
      completedAt
      output
      error
    }
    progress {
      total
      completed
      failed
    }
  }
`;

/**
 * Runbooks resource class
 */
export class RunbooksResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single runbook by ID
   */
  async get(id: string): Promise<Runbook> {
    const query = gql`
      ${RUNBOOK_FRAGMENT}
      query GetRunbook($id: ID!) {
        getRunbook(id: $id) {
          ...RunbookFields
        }
      }
    `;

    const result = await this.client.query<{ getRunbook: Runbook }>(query, { id });
    return result.getRunbook;
  }

  /**
   * List runbooks with pagination and filtering
   */
  async list(
    params?: ListParams<RunbookFilter, RunbookOrderBy>
  ): Promise<Connection<Runbook>> {
    const query = gql`
      ${RUNBOOK_FRAGMENT}
      query GetRunbookList(
        $first: Int
        $after: String
        $filter: RunbookFilterInput
        $orderBy: RunbookOrderInput
      ) {
        getRunbookList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...RunbookFields
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;

    const variables = {
      first: params?.first ?? 50,
      after: params?.after,
      filter: prepareFilter(params?.filter),
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getRunbookList: Connection<Runbook> }>(
      query,
      variables
    );
    return result.getRunbookList;
  }

  /**
   * List all runbooks with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<RunbookFilter, RunbookOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Runbook> {
    return this.createListIterator<Runbook, RunbookFilter, RunbookOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * Execute a runbook on specified targets
   */
  async execute(id: string, targetIds: string[]): Promise<RunbookExecution> {
    const mutation = gql`
      ${EXECUTION_FRAGMENT}
      mutation ExecuteRunbook($id: ID!, $targetIds: [ID!]!) {
        executeRunbook(id: $id, targetIds: $targetIds) {
          ...ExecutionFields
        }
      }
    `;

    const result = await this.client.mutate<{ executeRunbook: RunbookExecution }>(mutation, {
      id,
      targetIds,
    });
    return result.executeRunbook;
  }

  /**
   * Get runbook execution status
   */
  async getExecutionStatus(executionId: string): Promise<RunbookExecution> {
    const query = gql`
      ${EXECUTION_FRAGMENT}
      query GetRunbookExecutionStatus($executionId: ID!) {
        getRunbookExecutionStatus(executionId: $executionId) {
          ...ExecutionFields
        }
      }
    `;

    const result = await this.client.query<{ getRunbookExecutionStatus: RunbookExecution }>(
      query,
      { executionId }
    );
    return result.getRunbookExecutionStatus;
  }
}
