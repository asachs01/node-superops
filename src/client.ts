/**
 * SuperOps API Client
 * Main entry point for interacting with the SuperOps GraphQL API
 */

import type { SuperOpsClientConfig } from './types/index.js';
import { resolveConfig, type ResolvedConfig } from './config.js';
import { GraphQLClient } from './graphql-client.js';
import { RateLimiter } from './rate-limiter.js';
import {
  AssetsResource,
  TicketsResource,
  ClientsResource,
  SitesResource,
  AlertsResource,
  ContractsResource,
  TechniciansResource,
  KnowledgeBaseResource,
  RunbooksResource,
  PatchesResource,
  RemoteSessionsResource,
  ReportsResource,
} from './resources/index.js';

/**
 * SuperOps API Client
 *
 * Provides access to all SuperOps API resources with automatic pagination,
 * rate limiting, and GraphQL handling.
 *
 * @example
 * ```typescript
 * import { SuperOpsClient } from 'node-superops';
 *
 * const client = new SuperOpsClient({
 *   apiToken: 'your-api-token',
 *   customerSubDomain: 'your-company',
 *   region: 'us',
 *   vertical: 'msp',
 * });
 *
 * // Get an asset
 * const asset = await client.assets.get('asset-123');
 *
 * // List tickets with filters
 * const tickets = await client.tickets.list({
 *   first: 50,
 *   filter: {
 *     status: ['OPEN'],
 *     priority: 'HIGH',
 *   },
 * });
 *
 * // Auto-paginate through all clients
 * for await (const clientRecord of client.clients.listAll()) {
 *   console.log(clientRecord.name);
 * }
 * ```
 */
export class SuperOpsClient {
  private readonly config: ResolvedConfig;
  private readonly graphql: GraphQLClient;

  // Resources
  public readonly assets: AssetsResource;
  public readonly tickets: TicketsResource;
  public readonly clients: ClientsResource;
  public readonly sites: SitesResource;
  public readonly alerts: AlertsResource;
  public readonly contracts: ContractsResource;
  public readonly technicians: TechniciansResource;
  public readonly knowledgeBase: KnowledgeBaseResource;
  public readonly runbooks: RunbooksResource;
  public readonly patches: PatchesResource;
  public readonly remoteSessions: RemoteSessionsResource;
  public readonly reports: ReportsResource;

  /**
   * Create a new SuperOps API client
   *
   * @param config - Client configuration options
   * @throws {Error} If the API token or customer subdomain is missing
   */
  constructor(config: SuperOpsClientConfig) {
    this.config = resolveConfig(config);
    this.graphql = new GraphQLClient(this.config);

    const resourceOptions = {
      client: this.graphql,
      dateHandling: this.config.dates,
    };

    // Initialize all resources
    this.assets = new AssetsResource(resourceOptions);
    this.tickets = new TicketsResource(resourceOptions);
    this.clients = new ClientsResource(resourceOptions);
    this.sites = new SitesResource(resourceOptions);
    this.alerts = new AlertsResource(resourceOptions);
    this.contracts = new ContractsResource(resourceOptions);
    this.technicians = new TechniciansResource(resourceOptions);
    this.knowledgeBase = new KnowledgeBaseResource(resourceOptions);
    this.runbooks = new RunbooksResource(resourceOptions);
    this.patches = new PatchesResource(resourceOptions);
    this.remoteSessions = new RemoteSessionsResource(resourceOptions);
    this.reports = new ReportsResource(resourceOptions);
  }

  /**
   * Get the resolved configuration
   * Useful for debugging and testing
   */
  getConfig(): Readonly<ResolvedConfig> {
    return { ...this.config };
  }

  /**
   * Get the rate limiter status
   * Useful for monitoring rate limit usage
   *
   * @example
   * ```typescript
   * const status = client.getRateLimitStatus();
   * console.log(`Remaining requests: ${status.remaining}`);
   * ```
   */
  getRateLimitStatus(): ReturnType<RateLimiter['getStatus']> {
    return this.graphql.getRateLimiter().getStatus();
  }

  /**
   * Get the GraphQL client instance
   * For advanced use cases that need direct GraphQL access
   */
  getGraphQLClient(): GraphQLClient {
    return this.graphql;
  }
}
