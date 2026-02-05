/**
 * Assets resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Asset,
  AssetCreateInput,
  AssetUpdateInput,
  AssetFilter,
  AssetOrderBy,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for assets
 */
const ASSET_FRAGMENT = gql`
  fragment AssetFields on Asset {
    id
    name
    type
    status
    serialNumber
    manufacturer
    model
    operatingSystem
    ipAddress
    macAddress
    lastSeenAt
    installedAt
    warrantyExpiresAt
    notes
    clientId
    siteId
    createdAt
    updatedAt
    client {
      id
      name
    }
    site {
      id
      name
    }
  }
`;

/**
 * Assets resource class
 */
export class AssetsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single asset by ID
   */
  async get(id: string): Promise<Asset> {
    const query = gql`
      ${ASSET_FRAGMENT}
      query GetAsset($id: ID!) {
        getAsset(id: $id) {
          ...AssetFields
        }
      }
    `;

    const result = await this.client.query<{ getAsset: Asset }>(query, { id });
    return result.getAsset;
  }

  /**
   * List assets with pagination and filtering
   */
  async list(
    params?: ListParams<AssetFilter, AssetOrderBy>
  ): Promise<Connection<Asset>> {
    const query = gql`
      ${ASSET_FRAGMENT}
      query GetAssetList(
        $first: Int
        $after: String
        $filter: AssetFilterInput
        $orderBy: AssetOrderInput
      ) {
        getAssetList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...AssetFields
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

    const result = await this.client.query<{ getAssetList: Connection<Asset> }>(query, variables);
    return result.getAssetList;
  }

  /**
   * List all assets with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<AssetFilter, AssetOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Asset> {
    return this.createListIterator<Asset, AssetFilter, AssetOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * List assets by client ID
   */
  async listByClient(
    clientId: string,
    params?: Omit<ListParams<AssetFilter, AssetOrderBy>, 'filter'>
  ): Promise<Connection<Asset>> {
    const query = gql`
      ${ASSET_FRAGMENT}
      query GetAssetsByClient(
        $clientId: ID!
        $first: Int
        $after: String
        $orderBy: AssetOrderInput
      ) {
        getAssetsByClient(clientId: $clientId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...AssetFields
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

    const result = await this.client.query<{ getAssetsByClient: Connection<Asset> }>(
      query,
      variables
    );
    return result.getAssetsByClient;
  }

  /**
   * List all assets by client with automatic pagination
   */
  listByClientAll(
    clientId: string,
    params?: Omit<ListParams<AssetFilter, AssetOrderBy>, 'first' | 'after' | 'filter'>
  ): AsyncIterableWithHelpers<Asset> {
    return this.createListIterator<Asset, AssetFilter, AssetOrderBy>(
      (p) => this.listByClient(clientId, { first: p.first, after: p.after, orderBy: p.orderBy }),
      params
    );
  }

  /**
   * List assets by site ID
   */
  async listBySite(
    siteId: string,
    params?: Omit<ListParams<AssetFilter, AssetOrderBy>, 'filter'>
  ): Promise<Connection<Asset>> {
    const query = gql`
      ${ASSET_FRAGMENT}
      query GetAssetsBySite(
        $siteId: ID!
        $first: Int
        $after: String
        $orderBy: AssetOrderInput
      ) {
        getAssetsBySite(siteId: $siteId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...AssetFields
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
      siteId,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getAssetsBySite: Connection<Asset> }>(
      query,
      variables
    );
    return result.getAssetsBySite;
  }

  /**
   * Create a new asset
   */
  async create(input: AssetCreateInput): Promise<Asset> {
    const mutation = gql`
      ${ASSET_FRAGMENT}
      mutation CreateAsset($input: AssetInput!) {
        createAsset(input: $input) {
          ...AssetFields
        }
      }
    `;

    const result = await this.client.mutate<{ createAsset: Asset }>(mutation, { input });
    return result.createAsset;
  }

  /**
   * Update an existing asset
   */
  async update(id: string, input: AssetUpdateInput): Promise<Asset> {
    const mutation = gql`
      ${ASSET_FRAGMENT}
      mutation UpdateAsset($id: ID!, $input: AssetInput!) {
        updateAsset(id: $id, input: $input) {
          ...AssetFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateAsset: Asset }>(mutation, { id, input });
    return result.updateAsset;
  }

  /**
   * Delete an asset
   */
  async delete(id: string): Promise<boolean> {
    const mutation = gql`
      mutation DeleteAsset($id: ID!) {
        deleteAsset(id: $id)
      }
    `;

    const result = await this.client.mutate<{ deleteAsset: boolean }>(mutation, { id });
    return result.deleteAsset;
  }
}
