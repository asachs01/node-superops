/**
 * Reporting types for SuperOps API
 */

/**
 * Date range for reports
 */
export interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
}

/**
 * Ticket metrics
 */
export interface TicketMetrics {
  period: DateRange;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  averageResolutionTimeHours: number;
  averageFirstResponseTimeHours: number;
  ticketsByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  ticketsByStatus: Record<string, number>;
  ticketsBySource: Record<string, number>;
  ticketsByType: Record<string, number>;
  ticketTrend: Array<{
    date: string;
    created: number;
    resolved: number;
  }>;
}

/**
 * Asset summary
 */
export interface AssetSummary {
  totalAssets: number;
  activeAssets: number;
  inactiveAssets: number;
  assetsByType: Record<string, number>;
  assetsByStatus: Record<string, number>;
  assetsByClient: Array<{
    clientId: string;
    clientName: string;
    count: number;
  }>;
  assetsByOperatingSystem: Record<string, number>;
  recentlyAdded: number;
  needingAttention: number;
}

/**
 * Technician performance metrics
 */
export interface TechnicianPerformance {
  period: DateRange;
  technicians: Array<{
    technicianId: string;
    technicianName: string;
    ticketsAssigned: number;
    ticketsResolved: number;
    averageResolutionTimeHours: number;
    averageFirstResponseTimeHours: number;
    totalTimeLoggedHours: number;
    customerSatisfactionScore?: number;
    ticketsByPriority: {
      low: number;
      medium: number;
      high: number;
      critical: number;
    };
  }>;
}

/**
 * Client health score
 */
export interface ClientHealthScore {
  clientId: string;
  clientName: string;
  overallScore: number;
  components: {
    assetHealth: number;
    ticketVolume: number;
    patchCompliance: number;
    alertFrequency: number;
    contractStatus: number;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
  lastUpdatedAt: string;
}

/**
 * Client health scores response
 */
export interface ClientHealthScoresResponse {
  scores: ClientHealthScore[];
  averageScore: number;
  atRiskCount: number;
  healthyCount: number;
}

/**
 * Report filter params
 */
export interface ReportFilterParams {
  clientId?: string;
  siteId?: string;
  technicianId?: string;
}
