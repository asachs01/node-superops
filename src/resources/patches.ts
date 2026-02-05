/**
 * Patches resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Patch,
  PatchDeployment,
  PatchDeploymentInput,
  PatchComplianceReport,
  PatchFilter,
  PatchOrderBy,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for patches
 */
const PATCH_FRAGMENT = gql`
  fragment PatchFields on Patch {
    id
    name
    title
    kbArticleId
    description
    status
    severity
    category
    releaseDate
    vendor
    productName
    classification
    rebootRequired
    supersededBy
    fileSize
    assetId
    clientId
    installedAt
    createdAt
    updatedAt
    asset {
      id
      name
    }
    client {
      id
      name
    }
  }
`;

const DEPLOYMENT_FRAGMENT = gql`
  fragment DeploymentFields on PatchDeployment {
    id
    name
    scheduledAt
    patchIds
    assetIds
    status
    maintenanceWindowStart
    maintenanceWindowEnd
    rebootPolicy
    createdAt
    updatedAt
    createdBy {
      id
      name
    }
  }
`;

/**
 * Patches resource class
 */
export class PatchesResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * List patches with pagination and filtering
   */
  async list(
    params?: ListParams<PatchFilter, PatchOrderBy>
  ): Promise<Connection<Patch>> {
    const query = gql`
      ${PATCH_FRAGMENT}
      query GetPatchList(
        $first: Int
        $after: String
        $filter: PatchFilterInput
        $orderBy: PatchOrderInput
      ) {
        getPatchList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...PatchFields
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

    const result = await this.client.query<{ getPatchList: Connection<Patch> }>(query, variables);
    return result.getPatchList;
  }

  /**
   * List all patches with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<PatchFilter, PatchOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Patch> {
    return this.createListIterator<Patch, PatchFilter, PatchOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * List patches for a specific asset
   */
  async listByAsset(
    assetId: string,
    params?: Omit<ListParams<PatchFilter, PatchOrderBy>, 'filter'>
  ): Promise<Connection<Patch>> {
    const query = gql`
      ${PATCH_FRAGMENT}
      query GetPatchesByAsset(
        $assetId: ID!
        $first: Int
        $after: String
        $orderBy: PatchOrderInput
      ) {
        getPatchesByAsset(assetId: $assetId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...PatchFields
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
      assetId,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getPatchesByAsset: Connection<Patch> }>(
      query,
      variables
    );
    return result.getPatchesByAsset;
  }

  /**
   * Get patch compliance report
   */
  async getComplianceReport(params?: {
    clientId?: string;
    siteId?: string;
    assetId?: string;
  }): Promise<PatchComplianceReport> {
    const query = gql`
      query GetPatchComplianceReport($clientId: ID, $siteId: ID, $assetId: ID) {
        getPatchComplianceReport(clientId: $clientId, siteId: $siteId, assetId: $assetId) {
          generatedAt
          scope
          scopeId
          stats {
            totalPatches
            installedPatches
            pendingPatches
            failedPatches
            compliancePercentage
            criticalPending
            importantPending
          }
          byAsset {
            assetId
            assetName
            stats {
              totalPatches
              installedPatches
              pendingPatches
              failedPatches
              compliancePercentage
              criticalPending
              importantPending
            }
          }
          byClient {
            clientId
            clientName
            stats {
              totalPatches
              installedPatches
              pendingPatches
              failedPatches
              compliancePercentage
              criticalPending
              importantPending
            }
          }
        }
      }
    `;

    const result = await this.client.query<{ getPatchComplianceReport: PatchComplianceReport }>(
      query,
      params
    );
    return result.getPatchComplianceReport;
  }

  /**
   * Approve a patch
   */
  async approve(id: string): Promise<Patch> {
    const mutation = gql`
      ${PATCH_FRAGMENT}
      mutation ApprovePatch($id: ID!) {
        approvePatch(id: $id) {
          ...PatchFields
        }
      }
    `;

    const result = await this.client.mutate<{ approvePatch: Patch }>(mutation, { id });
    return result.approvePatch;
  }

  /**
   * Schedule a patch deployment
   */
  async scheduleDeployment(input: PatchDeploymentInput): Promise<PatchDeployment> {
    const mutation = gql`
      ${DEPLOYMENT_FRAGMENT}
      mutation SchedulePatchDeployment($input: PatchDeploymentInput!) {
        schedulePatchDeployment(input: $input) {
          ...DeploymentFields
        }
      }
    `;

    const result = await this.client.mutate<{ schedulePatchDeployment: PatchDeployment }>(
      mutation,
      { input }
    );
    return result.schedulePatchDeployment;
  }
}
