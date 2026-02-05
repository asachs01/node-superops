/**
 * Remote session types for SuperOps API
 */

import type { BaseResource } from './common.js';

/**
 * Session type
 */
export type SessionType = 'REMOTE_DESKTOP' | 'COMMAND_LINE' | 'FILE_TRANSFER' | 'SCREEN_SHARE';

/**
 * Session status
 */
export type SessionStatus = 'PENDING' | 'ACTIVE' | 'TERMINATED' | 'FAILED' | 'EXPIRED';

/**
 * Remote session entity
 */
export interface RemoteSession extends BaseResource {
  assetId: string;
  type: SessionType;
  status: SessionStatus;
  connectionUrl?: string;
  startedAt?: string;
  terminatedAt?: string;
  expiresAt?: string;
  initiatedBy?: {
    id: string;
    name: string;
  };
  asset?: {
    id: string;
    name: string;
    clientId?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Input for initiating a remote session
 */
export interface RemoteSessionInitiateInput {
  assetId: string;
  type: SessionType;
  expiresInMinutes?: number;
  metadata?: Record<string, unknown>;
}
