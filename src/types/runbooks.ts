/**
 * Runbook types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Runbook status
 */
export type RunbookStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

/**
 * Execution status
 */
export type ExecutionStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

/**
 * Target execution result
 */
export interface TargetExecutionResult {
  targetId: string;
  targetName?: string;
  status: ExecutionStatus;
  startedAt?: string;
  completedAt?: string;
  output?: string;
  error?: string;
}

/**
 * Runbook execution
 */
export interface RunbookExecution extends BaseResource {
  runbookId: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt?: string;
  initiatedBy?: {
    id: string;
    name: string;
  };
  targetIds: string[];
  results?: TargetExecutionResult[];
  progress?: {
    total: number;
    completed: number;
    failed: number;
  };
}

/**
 * Runbook step
 */
export interface RunbookStep {
  id: string;
  name: string;
  description?: string;
  order: number;
  type: string;
  config?: Record<string, unknown>;
  continueOnError?: boolean;
}

/**
 * Runbook entity
 */
export interface Runbook extends BaseResource {
  name: string;
  description?: string;
  status: RunbookStatus;
  category?: string;
  tags?: string[];
  steps?: RunbookStep[];
  estimatedDurationMinutes?: number;
  lastExecutedAt?: string;
  executionCount?: number;
  createdBy?: {
    id: string;
    name: string;
  };
  customFields?: Record<string, unknown>;
}

/**
 * Runbook filter options
 */
export interface RunbookFilter {
  status?: RunbookStatus | RunbookStatus[];
  category?: string;
  tags?: string[];
  searchQuery?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
}

/**
 * Runbook order by fields
 */
export type RunbookOrderField = 'NAME' | 'STATUS' | 'CREATED_AT' | 'UPDATED_AT' | 'LAST_EXECUTED_AT';

/**
 * Runbook order by configuration
 */
export interface RunbookOrderBy {
  field: RunbookOrderField;
  direction: OrderDirection;
}
