/**
 * Sites resource for SuperOps API
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Site,
  SiteCreateInput,
  SiteUpdateInput,
  SiteFilter,
  SiteOrderBy,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for sites
 */
const SITE_FRAGMENT = gql`
  fragment SiteFields on Site {
    id
    name
    status
    clientId
    timezone
    notes
    createdAt
    updatedAt
    address {
      street1
      street2
      city
      state
      postalCode
      country
    }
    primaryContact {
      email
      phone
      mobile
      fax
    }
    client {
      id
      name
    }
  }
`;

/**
 * Sites resource class
 */
export class SitesResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single site by ID
   */
  async get(id: string): Promise<Site> {
    const query = gql`
      ${SITE_FRAGMENT}
      query GetSite($id: ID!) {
        getSite(id: $id) {
          ...SiteFields
        }
      }
    `;

    const result = await this.client.query<{ getSite: Site }>(query, { id });
    return result.getSite;
  }

  /**
   * List sites by client ID
   */
  async listByClient(
    clientId: string,
    params?: Omit<ListParams<SiteFilter, SiteOrderBy>, 'filter'>
  ): Promise<Connection<Site>> {
    const query = gql`
      ${SITE_FRAGMENT}
      query GetSitesByClient(
        $clientId: ID!
        $first: Int
        $after: String
        $orderBy: SiteOrderInput
      ) {
        getSitesByClient(clientId: $clientId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...SiteFields
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

    const result = await this.client.query<{ getSitesByClient: Connection<Site> }>(
      query,
      variables
    );
    return result.getSitesByClient;
  }

  /**
   * List all sites by client with automatic pagination
   */
  listByClientAll(
    clientId: string,
    params?: Omit<ListParams<SiteFilter, SiteOrderBy>, 'first' | 'after' | 'filter'>
  ): AsyncIterableWithHelpers<Site> {
    return this.createListIterator<Site, SiteFilter, SiteOrderBy>(
      (p) => this.listByClient(clientId, { first: p.first, after: p.after, orderBy: p.orderBy }),
      params
    );
  }

  /**
   * Create a new site for a client
   */
  async create(clientId: string, input: SiteCreateInput): Promise<Site> {
    const mutation = gql`
      ${SITE_FRAGMENT}
      mutation CreateClientSite($clientId: ID!, $input: SiteInput!) {
        createClientSite(clientId: $clientId, input: $input) {
          ...SiteFields
        }
      }
    `;

    const result = await this.client.mutate<{ createClientSite: Site }>(mutation, {
      clientId,
      input,
    });
    return result.createClientSite;
  }

  /**
   * Update an existing site
   */
  async update(id: string, input: SiteUpdateInput): Promise<Site> {
    const mutation = gql`
      ${SITE_FRAGMENT}
      mutation UpdateSite($id: ID!, $input: SiteInput!) {
        updateSite(id: $id, input: $input) {
          ...SiteFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateSite: Site }>(mutation, { id, input });
    return result.updateSite;
  }

  /**
   * Delete a site
   */
  async delete(id: string): Promise<boolean> {
    const mutation = gql`
      mutation DeleteSite($id: ID!) {
        deleteSite(id: $id)
      }
    `;

    const result = await this.client.mutate<{ deleteSite: boolean }>(mutation, { id });
    return result.deleteSite;
  }
}
