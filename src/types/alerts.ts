/**
 * Alert types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Alert status
 */
export type AlertStatus = 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

/**
 * Alert severity
 */
export type AlertSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

/**
 * Alert category
 */
export type AlertCategory =
  | 'SYSTEM'
  | 'NETWORK'
  | 'SECURITY'
  | 'PERFORMANCE'
  | 'STORAGE'
  | 'APPLICATION'
  | 'CUSTOM';

/**
 * Alert entity
 */
export interface Alert extends BaseResource {
  title: string;
  message?: string;
  status: AlertStatus;
  severity: AlertSeverity;
  category: AlertCategory;
  source?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  dismissedAt?: string;
  assetId?: string;
  clientId?: string;
  siteId?: string;
  ticketId?: string;
  asset?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
  site?: {
    id: string;
    name: string;
  };
  ticket?: {
    id: string;
    subject: string;
  };
  acknowledgedBy?: {
    id: string;
    name: string;
  };
  resolvedBy?: {
    id: string;
    name: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Input for creating an alert
 */
export interface AlertCreateInput {
  title: string;
  message?: string;
  severity: AlertSeverity;
  category?: AlertCategory;
  source?: string;
  assetId?: string;
  clientId?: string;
  siteId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Alert filter options
 */
export interface AlertFilter {
  status?: AlertStatus | AlertStatus[];
  severity?: AlertSeverity | AlertSeverity[];
  category?: AlertCategory | AlertCategory[];
  assetId?: string;
  clientId?: string;
  siteId?: string;
  searchQuery?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
}

/**
 * Alert order by fields
 */
export type AlertOrderField = 'TITLE' | 'STATUS' | 'SEVERITY' | 'CREATED_AT' | 'UPDATED_AT';

/**
 * Alert order by configuration
 */
export interface AlertOrderBy {
  field: AlertOrderField;
  direction: OrderDirection;
}
