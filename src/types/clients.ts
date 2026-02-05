/**
 * Client types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Client status
 */
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'ARCHIVED';

/**
 * Client type
 */
export type ClientType = 'CUSTOMER' | 'PROSPECT' | 'VENDOR' | 'INTERNAL';

/**
 * Contact information
 */
export interface ContactInfo {
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
}

/**
 * Address information
 */
export interface Address {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/**
 * Client entity
 */
export interface Client extends BaseResource {
  name: string;
  status: ClientStatus;
  type: ClientType;
  displayName?: string;
  website?: string;
  industry?: string;
  notes?: string;
  primaryContact?: ContactInfo;
  billingContact?: ContactInfo;
  address?: Address;
  billingAddress?: Address;
  taxId?: string;
  defaultTechnicianId?: string;
  defaultTechnician?: {
    id: string;
    name: string;
  };
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating a client
 */
export interface ClientCreateInput {
  name: string;
  status?: ClientStatus;
  type?: ClientType;
  displayName?: string;
  website?: string;
  industry?: string;
  notes?: string;
  primaryContact?: ContactInfo;
  billingContact?: ContactInfo;
  address?: Address;
  billingAddress?: Address;
  taxId?: string;
  defaultTechnicianId?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a client
 */
export interface ClientUpdateInput {
  name?: string;
  status?: ClientStatus;
  type?: ClientType;
  displayName?: string;
  website?: string;
  industry?: string;
  notes?: string;
  primaryContact?: ContactInfo;
  billingContact?: ContactInfo;
  address?: Address;
  billingAddress?: Address;
  taxId?: string;
  defaultTechnicianId?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Client filter options
 */
export interface ClientFilter {
  status?: ClientStatus | ClientStatus[];
  type?: ClientType | ClientType[];
  searchQuery?: string;
  name?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
  tags?: string[];
}

/**
 * Client order by fields
 */
export type ClientOrderField = 'NAME' | 'STATUS' | 'TYPE' | 'CREATED_AT' | 'UPDATED_AT';

/**
 * Client order by configuration
 */
export interface ClientOrderBy {
  field: ClientOrderField;
  direction: OrderDirection;
}
