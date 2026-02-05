/**
 * Contract types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Contract status
 */
export type ContractStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'CANCELLED';

/**
 * Contract billing cycle
 */
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY' | 'ONE_TIME';

/**
 * Contract entity
 */
export interface Contract extends BaseResource {
  name: string;
  status: ContractStatus;
  clientId: string;
  startDate: string;
  endDate?: string;
  billingCycle: BillingCycle;
  value?: number;
  currency?: string;
  description?: string;
  autoRenew: boolean;
  renewalNotificationDays?: number;
  client?: {
    id: string;
    name: string;
  };
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating a contract
 */
export interface ContractCreateInput {
  name: string;
  status?: ContractStatus;
  startDate: string | Date;
  endDate?: string | Date;
  billingCycle: BillingCycle;
  value?: number;
  currency?: string;
  description?: string;
  autoRenew?: boolean;
  renewalNotificationDays?: number;
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a contract
 */
export interface ContractUpdateInput {
  name?: string;
  status?: ContractStatus;
  startDate?: string | Date;
  endDate?: string | Date;
  billingCycle?: BillingCycle;
  value?: number;
  currency?: string;
  description?: string;
  autoRenew?: boolean;
  renewalNotificationDays?: number;
  customFields?: Record<string, unknown>;
}

/**
 * Input for renewing a contract
 */
export interface ContractRenewalInput {
  newEndDate: string | Date;
  newValue?: number;
  notes?: string;
}

/**
 * Contract filter options
 */
export interface ContractFilter {
  status?: ContractStatus | ContractStatus[];
  clientId?: string;
  billingCycle?: BillingCycle | BillingCycle[];
  searchQuery?: string;
  expiringBefore?: string | Date;
  expiringAfter?: string | Date;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
}

/**
 * Contract order by fields
 */
export type ContractOrderField = 'NAME' | 'STATUS' | 'START_DATE' | 'END_DATE' | 'CREATED_AT' | 'VALUE';

/**
 * Contract order by configuration
 */
export interface ContractOrderBy {
  field: ContractOrderField;
  direction: OrderDirection;
}
