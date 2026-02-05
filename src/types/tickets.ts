/**
 * Ticket types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Ticket status
 */
export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_ON_CLIENT'
  | 'WAITING_ON_VENDOR'
  | 'SCHEDULED'
  | 'RESOLVED'
  | 'CLOSED';

/**
 * Ticket priority
 */
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Ticket type
 */
export type TicketType = 'INCIDENT' | 'SERVICE_REQUEST' | 'PROBLEM' | 'CHANGE' | 'TASK';

/**
 * Ticket source
 */
export type TicketSource = 'EMAIL' | 'PORTAL' | 'PHONE' | 'CHAT' | 'AGENT' | 'API' | 'ALERT';

/**
 * Ticket note
 */
export interface TicketNote {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

/**
 * Ticket time entry
 */
export interface TicketTimeEntry {
  id: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  description?: string;
  billable: boolean;
  technicianId: string;
  technician?: {
    id: string;
    name: string;
  };
}

/**
 * Ticket entity
 */
export interface Ticket extends BaseResource {
  subject: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  source: TicketSource;
  dueDate?: string;
  resolvedAt?: string;
  closedAt?: string;
  firstResponseAt?: string;
  clientId?: string;
  siteId?: string;
  assetId?: string;
  technicianId?: string;
  queueId?: string;
  client?: {
    id: string;
    name: string;
  };
  site?: {
    id: string;
    name: string;
  };
  asset?: {
    id: string;
    name: string;
  };
  technician?: {
    id: string;
    name: string;
    email?: string;
  };
  queue?: {
    id: string;
    name: string;
  };
  notes?: TicketNote[];
  timeEntries?: TicketTimeEntry[];
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating a ticket
 */
export interface TicketCreateInput {
  subject: string;
  description?: string;
  priority: TicketPriority;
  type?: TicketType;
  source?: TicketSource;
  dueDate?: string | Date;
  clientId: string;
  siteId?: string;
  assetId?: string;
  technicianId?: string;
  queueId?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating a ticket
 */
export interface TicketUpdateInput {
  subject?: string;
  description?: string;
  priority?: TicketPriority;
  type?: TicketType;
  dueDate?: string | Date;
  clientId?: string;
  siteId?: string;
  assetId?: string;
  technicianId?: string;
  queueId?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for adding a time entry to a ticket
 */
export interface TimeEntryInput {
  startTime: string | Date;
  endTime?: string | Date;
  durationMinutes?: number;
  description?: string;
  billable?: boolean;
  technicianId?: string;
}

/**
 * Ticket filter options
 */
export interface TicketFilter {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  type?: TicketType | TicketType[];
  source?: TicketSource | TicketSource[];
  clientId?: string;
  siteId?: string;
  technicianId?: string;
  queueId?: string;
  searchQuery?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
  dueBefore?: string | Date;
  dueAfter?: string | Date;
  tags?: string[];
}

/**
 * Ticket order by fields
 */
export type TicketOrderField =
  | 'SUBJECT'
  | 'STATUS'
  | 'PRIORITY'
  | 'CREATED_AT'
  | 'UPDATED_AT'
  | 'DUE_DATE';

/**
 * Ticket order by configuration
 */
export interface TicketOrderBy {
  field: TicketOrderField;
  direction: OrderDirection;
}
