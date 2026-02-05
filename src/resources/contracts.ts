/**
 * Contracts resource for SuperOps API
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Contract,
  ContractCreateInput,
  ContractUpdateInput,
  ContractRenewalInput,
  ContractFilter,
  ContractOrderBy,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for contracts
 */
const CONTRACT_FRAGMENT = gql`
  fragment ContractFields on Contract {
    id
    name
    status
    clientId
    startDate
    endDate
    billingCycle
    value
    currency
    description
    autoRenew
    renewalNotificationDays
    createdAt
    updatedAt
    client {
      id
      name
    }
  }
`;

/**
 * Contracts resource class
 */
export class ContractsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single contract by ID
   */
  async get(id: string): Promise<Contract> {
    const query = gql`
      ${CONTRACT_FRAGMENT}
      query GetContract($id: ID!) {
        getContract(id: $id) {
          ...ContractFields
        }
      }
    `;

    const result = await this.client.query<{ getContract: Contract }>(query, { id });
    return result.getContract;
  }

  /**
   * List contracts by client ID
   */
  async listByClient(
    clientId: string,
    params?: Omit<ListParams<ContractFilter, ContractOrderBy>, 'filter'>
  ): Promise<Connection<Contract>> {
    const query = gql`
      ${CONTRACT_FRAGMENT}
      query GetContractsByClient(
        $clientId: ID!
        $first: Int
        $after: String
        $orderBy: ContractOrderInput
      ) {
        getContractsByClient(clientId: $clientId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...ContractFields
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
      clientId,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getContractsByClient: Connection<Contract> }>(
      query,
      variables
    );
    return result.getContractsByClient;
  }

  /**
   * List all contracts by client with automatic pagination
   */
  listByClientAll(
    clientId: string,
    params?: Omit<ListParams<ContractFilter, ContractOrderBy>, 'first' | 'after' | 'filter'>
  ): AsyncIterableWithHelpers<Contract> {
    return this.createListIterator<Contract, ContractFilter, ContractOrderBy>(
      (p) => this.listByClient(clientId, { first: p.first, after: p.after, orderBy: p.orderBy }),
      params
    );
  }

  /**
   * Create a new contract for a client
   */
  async create(clientId: string, input: ContractCreateInput): Promise<Contract> {
    const mutation = gql`
      ${CONTRACT_FRAGMENT}
      mutation CreateClientContract($clientId: ID!, $input: ContractInput!) {
        createClientContract(clientId: $clientId, input: $input) {
          ...ContractFields
        }
      }
    `;

    const result = await this.client.mutate<{ createClientContract: Contract }>(mutation, {
      clientId,
      input,
    });
    return result.createClientContract;
  }

  /**
   * Update an existing contract
   */
  async update(id: string, input: ContractUpdateInput): Promise<Contract> {
    const mutation = gql`
      ${CONTRACT_FRAGMENT}
      mutation UpdateContract($id: ID!, $input: ContractInput!) {
        updateContract(id: $id, input: $input) {
          ...ContractFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateContract: Contract }>(mutation, { id, input });
    return result.updateContract;
  }

  /**
   * Renew a contract
   */
  async renew(id: string, input: ContractRenewalInput): Promise<Contract> {
    const mutation = gql`
      ${CONTRACT_FRAGMENT}
      mutation RenewContract($id: ID!, $input: RenewalInput!) {
        renewContract(id: $id, input: $input) {
          ...ContractFields
        }
      }
    `;

    const result = await this.client.mutate<{ renewContract: Contract }>(mutation, { id, input });
    return result.renewContract;
  }
}
