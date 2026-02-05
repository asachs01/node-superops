/**
 * Asset types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Asset status
 */
export type AssetStatus = 'ACTIVE' | 'INACTIVE' | 'RETIRED' | 'MAINTENANCE';

/**
 * Asset type
 */
export type AssetType =
  | 'WORKSTATION'
  | 'SERVER'
  | 'LAPTOP'
  | 'NETWORK_DEVICE'
  | 'PRINTER'
  | 'MOBILE'
  | 'VIRTUAL_MACHINE'
  | 'OTHER';

/**
 * Asset entity
 */
export interface Asset extends BaseResource {
  name: string;
  type: AssetType;
  status: AssetStatus;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  operatingSystem?: string;
  ipAddress?: string;
  macAddress?: string;
  lastSeenAt?: string;
  installedAt?: string;
  warrantyExpiresAt?: string;
  notes?: string;
  clientId?: string;
  siteId?: string;
  client?: {
    id: string;
    name: string;
  };
  site?: {
    id: string;
    name: string;
  };
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating an asset
 */
export interface AssetCreateInput {
  name: string;
  type: AssetType;
  status?: AssetStatus;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  operatingSystem?: string;
  ipAddress?: string;
  macAddress?: string;
  installedAt?: string | Date;
  warrantyExpiresAt?: string | Date;
  notes?: string;
  clientId: string;
  siteId?: string;
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating an asset
 */
export interface AssetUpdateInput {
  name?: string;
  type?: AssetType;
  status?: AssetStatus;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  operatingSystem?: string;
  ipAddress?: string;
  macAddress?: string;
  installedAt?: string | Date;
  warrantyExpiresAt?: string | Date;
  notes?: string;
  clientId?: string;
  siteId?: string;
  customFields?: Record<string, unknown>;
}

/**
 * Asset filter options
 */
export interface AssetFilter {
  status?: AssetStatus | AssetStatus[];
  type?: AssetType | AssetType[];
  clientId?: string;
  siteId?: string;
  name?: string;
  searchQuery?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
  lastSeenAfter?: string | Date;
  lastSeenBefore?: string | Date;
}

/**
 * Asset order by fields
 */
export type AssetOrderField = 'NAME' | 'TYPE' | 'STATUS' | 'CREATED_AT' | 'UPDATED_AT' | 'LAST_SEEN_AT';

/**
 * Asset order by configuration
 */
export interface AssetOrderBy {
  field: AssetOrderField;
  direction: OrderDirection;
}
