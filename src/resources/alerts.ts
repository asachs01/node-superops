/**
 * Alerts resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Alert,
  AlertCreateInput,
  AlertFilter,
  AlertOrderBy,
  AlertSeverity,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for alerts
 */
const ALERT_FRAGMENT = gql`
  fragment AlertFields on Alert {
    id
    title
    message
    status
    severity
    category
    source
    acknowledgedAt
    resolvedAt
    dismissedAt
    assetId
    clientId
    siteId
    ticketId
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
    site {
      id
      name
    }
    ticket {
      id
      subject
    }
    acknowledgedBy {
      id
      name
    }
    resolvedBy {
      id
      name
    }
  }
`;

/**
 * Alerts resource class
 */
export class AlertsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * List alerts with pagination and filtering
   */
  async list(
    params?: ListParams<AlertFilter, AlertOrderBy>
  ): Promise<Connection<Alert>> {
    const query = gql`
      ${ALERT_FRAGMENT}
      query GetAlertList(
        $first: Int
        $after: String
        $filter: AlertFilterInput
        $orderBy: AlertOrderInput
      ) {
        getAlertList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...AlertFields
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

    const result = await this.client.query<{ getAlertList: Connection<Alert> }>(query, variables);
    return result.getAlertList;
  }

  /**
   * List all alerts with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<AlertFilter, AlertOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Alert> {
    return this.createListIterator<Alert, AlertFilter, AlertOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * List alerts for a specific asset
   */
  async listByAsset(
    assetId: string,
    params?: Omit<ListParams<AlertFilter, AlertOrderBy>, 'filter'>
  ): Promise<Connection<Alert>> {
    const query = gql`
      ${ALERT_FRAGMENT}
      query GetAlertsForAsset(
        $assetId: ID!
        $first: Int
        $after: String
        $orderBy: AlertOrderInput
      ) {
        getAlertsForAsset(assetId: $assetId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...AlertFields
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

    const result = await this.client.query<{ getAlertsForAsset: Connection<Alert> }>(
      query,
      variables
    );
    return result.getAlertsForAsset;
  }

  /**
   * List alerts for a specific client
   */
  async listByClient(
    clientId: string,
    params?: Omit<ListParams<AlertFilter, AlertOrderBy>, 'filter'>
  ): Promise<Connection<Alert>> {
    const query = gql`
      ${ALERT_FRAGMENT}
      query GetAlertsByClient(
        $clientId: ID!
        $first: Int
        $after: String
        $orderBy: AlertOrderInput
      ) {
        getAlertsByClient(clientId: $clientId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...AlertFields
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

    const result = await this.client.query<{ getAlertsByClient: Connection<Alert> }>(
      query,
      variables
    );
    return result.getAlertsByClient;
  }

  /**
   * List alerts by severity
   */
  async listBySeverity(
    severity: AlertSeverity,
    params?: Omit<ListParams<AlertFilter, AlertOrderBy>, 'filter'>
  ): Promise<Connection<Alert>> {
    const query = gql`
      ${ALERT_FRAGMENT}
      query GetAlertsBySeverity(
        $severity: AlertSeverity!
        $first: Int
        $after: String
        $orderBy: AlertOrderInput
      ) {
        getAlertsBySeverity(severity: $severity, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...AlertFields
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
      severity,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getAlertsBySeverity: Connection<Alert> }>(
      query,
      variables
    );
    return result.getAlertsBySeverity;
  }

  /**
   * Create a new alert
   */
  async create(input: AlertCreateInput): Promise<Alert> {
    const mutation = gql`
      ${ALERT_FRAGMENT}
      mutation CreateAlert($input: AlertInput!) {
        createAlert(input: $input) {
          ...AlertFields
        }
      }
    `;

    const result = await this.client.mutate<{ createAlert: Alert }>(mutation, { input });
    return result.createAlert;
  }

  /**
   * Acknowledge an alert
   */
  async acknowledge(id: string): Promise<Alert> {
    const mutation = gql`
      ${ALERT_FRAGMENT}
      mutation AcknowledgeAlert($id: ID!) {
        acknowledgeAlert(id: $id) {
          ...AlertFields
        }
      }
    `;

    const result = await this.client.mutate<{ acknowledgeAlert: Alert }>(mutation, { id });
    return result.acknowledgeAlert;
  }

  /**
   * Resolve an alert
   */
  async resolve(id: string): Promise<Alert> {
    const mutation = gql`
      ${ALERT_FRAGMENT}
      mutation ResolveAlert($id: ID!) {
        resolveAlert(id: $id) {
          ...AlertFields
        }
      }
    `;

    const result = await this.client.mutate<{ resolveAlert: Alert }>(mutation, { id });
    return result.resolveAlert;
  }

  /**
   * Dismiss an alert
   */
  async dismiss(id: string): Promise<Alert> {
    const mutation = gql`
      ${ALERT_FRAGMENT}
      mutation DismissAlert($id: ID!) {
        dismissAlert(id: $id) {
          ...AlertFields
        }
      }
    `;

    const result = await this.client.mutate<{ dismissAlert: Alert }>(mutation, { id });
    return result.dismissAlert;
  }
}
