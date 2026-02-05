/**
 * Reports resource for SuperOps API
 */

import { BaseResource, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  DateRange,
  TicketMetrics,
  AssetSummary,
  TechnicianPerformance,
  ClientHealthScoresResponse,
  ReportFilterParams,
} from '../types/index.js';

/**
 * Reports resource class
 */
export class ReportsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get ticket metrics for a date range
   */
  async ticketMetrics(dateRange: DateRange, params?: ReportFilterParams): Promise<TicketMetrics> {
    const query = gql`
      query GetTicketMetrics($dateRange: DateRangeInput!, $clientId: ID, $technicianId: ID) {
        getTicketMetrics(dateRange: $dateRange, clientId: $clientId, technicianId: $technicianId) {
          period {
            startDate
            endDate
          }
          totalTickets
          openTickets
          resolvedTickets
          closedTickets
          averageResolutionTimeHours
          averageFirstResponseTimeHours
          ticketsByPriority {
            low
            medium
            high
            critical
          }
          ticketsByStatus
          ticketsBySource
          ticketsByType
          ticketTrend {
            date
            created
            resolved
          }
        }
      }
    `;

    const variables = {
      dateRange: {
        startDate:
          dateRange.startDate instanceof Date
            ? dateRange.startDate.toISOString()
            : dateRange.startDate,
        endDate:
          dateRange.endDate instanceof Date ? dateRange.endDate.toISOString() : dateRange.endDate,
      },
      clientId: params?.clientId,
      technicianId: params?.technicianId,
    };

    const result = await this.client.query<{ getTicketMetrics: TicketMetrics }>(query, variables);
    return result.getTicketMetrics;
  }

  /**
   * Get asset summary
   */
  async assetSummary(params?: ReportFilterParams): Promise<AssetSummary> {
    const query = gql`
      query GetAssetSummary($clientId: ID, $siteId: ID) {
        getAssetSummary(clientId: $clientId, siteId: $siteId) {
          totalAssets
          activeAssets
          inactiveAssets
          assetsByType
          assetsByStatus
          assetsByClient {
            clientId
            clientName
            count
          }
          assetsByOperatingSystem
          recentlyAdded
          needingAttention
        }
      }
    `;

    const result = await this.client.query<{ getAssetSummary: AssetSummary }>(query, params as Record<string, unknown>);
    return result.getAssetSummary;
  }

  /**
   * Get technician performance metrics
   */
  async technicianPerformance(dateRange: DateRange): Promise<TechnicianPerformance> {
    const query = gql`
      query GetTechnicianPerformance($dateRange: DateRangeInput!) {
        getTechnicianPerformance(dateRange: $dateRange) {
          period {
            startDate
            endDate
          }
          technicians {
            technicianId
            technicianName
            ticketsAssigned
            ticketsResolved
            averageResolutionTimeHours
            averageFirstResponseTimeHours
            totalTimeLoggedHours
            customerSatisfactionScore
            ticketsByPriority {
              low
              medium
              high
              critical
            }
          }
        }
      }
    `;

    const variables = {
      dateRange: {
        startDate:
          dateRange.startDate instanceof Date
            ? dateRange.startDate.toISOString()
            : dateRange.startDate,
        endDate:
          dateRange.endDate instanceof Date ? dateRange.endDate.toISOString() : dateRange.endDate,
      },
    };

    const result = await this.client.query<{ getTechnicianPerformance: TechnicianPerformance }>(
      query,
      variables
    );
    return result.getTechnicianPerformance;
  }

  /**
   * Get client health scores
   */
  async clientHealthScores(params?: ReportFilterParams): Promise<ClientHealthScoresResponse> {
    const query = gql`
      query GetClientHealthScores($clientId: ID) {
        getClientHealthScores(clientId: $clientId) {
          scores {
            clientId
            clientName
            overallScore
            components {
              assetHealth
              ticketVolume
              patchCompliance
              alertFrequency
              contractStatus
            }
            riskLevel
            recommendations
            lastUpdatedAt
          }
          averageScore
          atRiskCount
          healthyCount
        }
      }
    `;

    const result = await this.client.query<{ getClientHealthScores: ClientHealthScoresResponse }>(
      query,
      params as Record<string, unknown>
    );
    return result.getClientHealthScores;
  }
}
