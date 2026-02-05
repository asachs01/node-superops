/**
 * Patch management types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';
import type { ExecutionStatus } from './runbooks.js';

/**
 * Patch status
 */
export type PatchStatus = 'AVAILABLE' | 'APPROVED' | 'DECLINED' | 'INSTALLED' | 'FAILED' | 'PENDING_REBOOT';

/**
 * Patch severity
 */
export type PatchSeverity = 'CRITICAL' | 'IMPORTANT' | 'MODERATE' | 'LOW' | 'UNSPECIFIED';

/**
 * Patch category
 */
export type PatchCategory =
  | 'SECURITY_UPDATE'
  | 'CRITICAL_UPDATE'
  | 'FEATURE_PACK'
  | 'SERVICE_PACK'
  | 'UPDATE_ROLLUP'
  | 'UPDATE'
  | 'DRIVER'
  | 'OTHER';

/**
 * Patch entity
 */
export interface Patch extends BaseResource {
  name: string;
  title: string;
  kbArticleId?: string;
  description?: string;
  status: PatchStatus;
  severity: PatchSeverity;
  category: PatchCategory;
  releaseDate?: string;
  vendor?: string;
  productName?: string;
  classification?: string;
  rebootRequired: boolean;
  supersededBy?: string;
  fileSize?: number;
  assetId?: string;
  clientId?: string;
  installedAt?: string;
  asset?: {
    id: string;
    name: string;
  };
  client?: {
    id: string;
    name: string;
  };
}

/**
 * Patch deployment schedule
 */
export interface PatchDeployment extends BaseResource {
  name: string;
  scheduledAt: string;
  patchIds: string[];
  assetIds: string[];
  status: ExecutionStatus;
  maintenanceWindowStart?: string;
  maintenanceWindowEnd?: string;
  rebootPolicy?: 'IMMEDIATE' | 'SCHEDULED' | 'NO_REBOOT';
  createdBy?: {
    id: string;
    name: string;
  };
}


/**
 * Patch compliance statistics
 */
export interface PatchComplianceStats {
  totalPatches: number;
  installedPatches: number;
  pendingPatches: number;
  failedPatches: number;
  compliancePercentage: number;
  criticalPending: number;
  importantPending: number;
}

/**
 * Patch compliance report
 */
export interface PatchComplianceReport {
  generatedAt: string;
  scope: 'CLIENT' | 'SITE' | 'ASSET' | 'ALL';
  scopeId?: string;
  stats: PatchComplianceStats;
  byAsset?: Array<{
    assetId: string;
    assetName: string;
    stats: PatchComplianceStats;
  }>;
  byClient?: Array<{
    clientId: string;
    clientName: string;
    stats: PatchComplianceStats;
  }>;
}

/**
 * Input for scheduling patch deployment
 */
export interface PatchDeploymentInput {
  name: string;
  scheduledAt: string | Date;
  patchIds: string[];
  assetIds: string[];
  maintenanceWindowStart?: string | Date;
  maintenanceWindowEnd?: string | Date;
  rebootPolicy?: 'IMMEDIATE' | 'SCHEDULED' | 'NO_REBOOT';
}

/**
 * Patch filter options
 */
export interface PatchFilter {
  status?: PatchStatus | PatchStatus[];
  severity?: PatchSeverity | PatchSeverity[];
  category?: PatchCategory | PatchCategory[];
  assetId?: string;
  clientId?: string;
  vendor?: string;
  rebootRequired?: boolean;
  releasedAfter?: string | Date;
  releasedBefore?: string | Date;
}

/**
 * Patch order by fields
 */
export type PatchOrderField = 'NAME' | 'SEVERITY' | 'STATUS' | 'RELEASE_DATE' | 'CREATED_AT';

/**
 * Patch order by configuration
 */
export interface PatchOrderBy {
  field: PatchOrderField;
  direction: OrderDirection;
}
