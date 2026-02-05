/**
 * Technician types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Technician status
 */
export type TechnicianStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

/**
 * Technician role
 */
export type TechnicianRole = 'ADMIN' | 'TECHNICIAN' | 'DISPATCHER' | 'READ_ONLY';

/**
 * Availability slot
 */
export interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  reason?: string;
}

/**
 * Technician entity
 */
export interface Technician extends BaseResource {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  status: TechnicianStatus;
  role: TechnicianRole;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  timezone?: string;
  avatarUrl?: string;
  skills?: string[];
  queues?: Array<{
    id: string;
    name: string;
  }>;
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a technician
 */
export interface TechnicianUpdateInput {
  firstName?: string;
  lastName?: string;
  status?: TechnicianStatus;
  phone?: string;
  mobile?: string;
  title?: string;
  department?: string;
  timezone?: string;
  skills?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Technician filter options
 */
export interface TechnicianFilter {
  status?: TechnicianStatus | TechnicianStatus[];
  role?: TechnicianRole | TechnicianRole[];
  searchQuery?: string;
  queueId?: string;
  skills?: string[];
}

/**
 * Technician order by fields
 */
export type TechnicianOrderField = 'NAME' | 'EMAIL' | 'STATUS' | 'CREATED_AT';

/**
 * Technician order by configuration
 */
export interface TechnicianOrderBy {
  field: TechnicianOrderField;
  direction: OrderDirection;
}
