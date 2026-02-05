/**
 * Clients resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Client,
  ClientCreateInput,
  ClientUpdateInput,
  ClientFilter,
  ClientOrderBy,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for clients
 */
const CLIENT_FRAGMENT = gql`
  fragment ClientFields on Client {
    id
    name
    status
    type
    displayName
    website
    industry
    notes
    taxId
    defaultTechnicianId
    createdAt
    updatedAt
    primaryContact {
      email
      phone
      mobile
      fax
    }
    billingContact {
      email
      phone
      mobile
      fax
    }
    address {
      street1
      street2
      city
      state
      postalCode
      country
    }
    billingAddress {
      street1
      street2
      city
      state
      postalCode
      country
    }
    defaultTechnician {
      id
      name
    }
    tags
  }
`;

/**
 * Clients resource class
 */
export class ClientsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single client by ID
   */
  async get(id: string): Promise<Client> {
    const query = gql`
      ${CLIENT_FRAGMENT}
      query GetClient($id: ID!) {
        getClient(id: $id) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.query<{ getClient: Client }>(query, { id });
    return result.getClient;
  }

  /**
   * List clients with pagination and filtering
   */
  async list(
    params?: ListParams<ClientFilter, ClientOrderBy>
  ): Promise<Connection<Client>> {
    const query = gql`
      ${CLIENT_FRAGMENT}
      query GetClientList(
        $first: Int
        $after: String
        $filter: ClientFilterInput
        $orderBy: ClientOrderInput
      ) {
        getClientList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...ClientFields
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

    const result = await this.client.query<{ getClientList: Connection<Client> }>(query, variables);
    return result.getClientList;
  }

  /**
   * List all clients with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<ClientFilter, ClientOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Client> {
    return this.createListIterator<Client, ClientFilter, ClientOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * Search clients by query string
   */
  async search(
    query: string,
    params?: Omit<ListParams<ClientFilter, ClientOrderBy>, 'filter'>
  ): Promise<Connection<Client>> {
    const gqlQuery = gql`
      ${CLIENT_FRAGMENT}
      query SearchClients(
        $query: String!
        $first: Int
        $after: String
        $orderBy: ClientOrderInput
      ) {
        searchClients(query: $query, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...ClientFields
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
      query,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ searchClients: Connection<Client> }>(
      gqlQuery,
      variables
    );
    return result.searchClients;
  }

  /**
   * Create a new client
   */
  async create(input: ClientCreateInput): Promise<Client> {
    const mutation = gql`
      ${CLIENT_FRAGMENT}
      mutation CreateClient($input: ClientInput!) {
        createClient(input: $input) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.mutate<{ createClient: Client }>(mutation, { input });
    return result.createClient;
  }

  /**
   * Update an existing client
   */
  async update(id: string, input: ClientUpdateInput): Promise<Client> {
    const mutation = gql`
      ${CLIENT_FRAGMENT}
      mutation UpdateClient($id: ID!, $input: ClientInput!) {
        updateClient(id: $id, input: $input) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateClient: Client }>(mutation, { id, input });
    return result.updateClient;
  }

  /**
   * Archive a client
   */
  async archive(id: string): Promise<Client> {
    const mutation = gql`
      ${CLIENT_FRAGMENT}
      mutation ArchiveClient($id: ID!) {
        archiveClient(id: $id) {
          ...ClientFields
        }
      }
    `;

    const result = await this.client.mutate<{ archiveClient: Client }>(mutation, { id });
    return result.archiveClient;
  }
}
