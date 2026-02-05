/**
 * Remote Sessions resource for SuperOps API
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type { RemoteSession, SessionType } from '../types/index.js';

/**
 * GraphQL fragments for remote sessions
 */
const REMOTE_SESSION_FRAGMENT = gql`
  fragment RemoteSessionFields on RemoteSession {
    id
    assetId
    type
    status
    connectionUrl
    startedAt
    terminatedAt
    expiresAt
    createdAt
    updatedAt
    initiatedBy {
      id
      name
    }
    asset {
      id
      name
      clientId
    }
  }
`;

/**
 * Remote Sessions resource class
 */
export class RemoteSessionsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a remote session by ID
   */
  async get(id: string): Promise<RemoteSession> {
    const query = gql`
      ${REMOTE_SESSION_FRAGMENT}
      query GetRemoteSession($id: ID!) {
        getRemoteSession(id: $id) {
          ...RemoteSessionFields
        }
      }
    `;

    const result = await this.client.query<{ getRemoteSession: RemoteSession }>(query, { id });
    return result.getRemoteSession;
  }

  /**
   * Initiate a new remote session
   */
  async initiate(assetId: string, type: SessionType): Promise<RemoteSession> {
    const mutation = gql`
      ${REMOTE_SESSION_FRAGMENT}
      mutation InitiateRemoteSession($assetId: ID!, $type: SessionType!) {
        initiateRemoteSession(assetId: $assetId, type: $type) {
          ...RemoteSessionFields
        }
      }
    `;

    const result = await this.client.mutate<{ initiateRemoteSession: RemoteSession }>(mutation, {
      assetId,
      type,
    });
    return result.initiateRemoteSession;
  }

  /**
   * Terminate a remote session
   */
  async terminate(id: string): Promise<RemoteSession> {
    const mutation = gql`
      ${REMOTE_SESSION_FRAGMENT}
      mutation TerminateRemoteSession($id: ID!) {
        terminateRemoteSession(id: $id) {
          ...RemoteSessionFields
        }
      }
    `;

    const result = await this.client.mutate<{ terminateRemoteSession: RemoteSession }>(mutation, {
      id,
    });
    return result.terminateRemoteSession;
  }
}
