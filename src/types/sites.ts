/**
 * Site types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';
import type { Address, ContactInfo } from './clients.js';

/**
 * Site status
 */
export type SiteStatus = 'ACTIVE' | 'INACTIVE';

/**
 * Site entity
 */
export interface Site extends BaseResource {
  name: string;
  status: SiteStatus;
  clientId: string;
  address?: Address;
  primaryContact?: ContactInfo;
  notes?: string;
  timezone?: string;
  client?: {
    id: string;
    name: string;
  };
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating a site
 */
export interface SiteCreateInput {
  name: string;
  status?: SiteStatus;
  address?: Address;
  primaryContact?: ContactInfo;
  notes?: string;
  timezone?: string;
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a site
 */
export interface SiteUpdateInput {
  name?: string;
  status?: SiteStatus;
  address?: Address;
  primaryContact?: ContactInfo;
  notes?: string;
  timezone?: string;
  customFields?: Record<string, unknown>;
}

/**
 * Site filter options
 */
export interface SiteFilter {
  status?: SiteStatus | SiteStatus[];
  clientId?: string;
  searchQuery?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
}

/**
 * Site order by fields
 */
export type SiteOrderField = 'NAME' | 'STATUS' | 'CREATED_AT' | 'UPDATED_AT';

/**
 * Site order by configuration
 */
export interface SiteOrderBy {
  field: SiteOrderField;
  direction: OrderDirection;
}
