# node-superops

Comprehensive, fully-typed Node.js/TypeScript library for the SuperOps.ai GraphQL API.

## Features

- **Complete API coverage** - All SuperOps.ai queries and mutations
- **Strong TypeScript types** - Full type definitions for all resources
- **GraphQL abstraction** - Method-based access without writing raw GraphQL
- **Automatic pagination** - Async iterators for cursor-based pagination
- **Rate limit handling** - Built-in request throttling (800 req/min)
- **Multi-region support** - US and EU endpoints for MSP and IT verticals
- **Zero live API testing** - Full test suite with mocked GraphQL responses

## Installation

```bash
npm install node-superops
```

## Quick Start

```typescript
import { SuperOpsClient } from 'node-superops';

const client = new SuperOpsClient({
  apiToken: process.env.SUPEROPS_API_TOKEN!,
  customerSubDomain: process.env.SUPEROPS_SUBDOMAIN!,
  region: 'us',      // 'us' | 'eu'
  vertical: 'msp',   // 'msp' | 'it'
});

// Get an asset
const asset = await client.assets.get('asset-123');

// List tickets with filters
const tickets = await client.tickets.list({
  first: 50,
  filter: {
    status: ['OPEN'],
    priority: 'HIGH',
  },
});

// Auto-paginate through all clients
for await (const clientRecord of client.clients.listAll()) {
  console.log(clientRecord.name);
}
```

## Configuration

```typescript
const client = new SuperOpsClient({
  // Required
  apiToken: 'your-api-token',
  customerSubDomain: 'your-company',

  // Optional - Region/Vertical (defaults to US MSP)
  region: 'us',           // 'us' | 'eu'
  vertical: 'msp',        // 'msp' | 'it'

  // OR explicit endpoint
  endpoint: 'https://api.superops.ai/msp',

  // Optional settings
  timeout: 30000,         // Request timeout in ms (default: 30000)
  dates: 'date',          // 'date' (Date objects) | 'string' (ISO strings)

  // Rate limiting configuration
  rateLimiter: {
    enabled: true,        // Enable rate limiting (default: true)
    maxRequests: 800,     // Max requests per window (default: 800)
    windowMs: 60000,      // Window duration in ms (default: 60000)
    throttleThreshold: 0.8, // Throttle at 80% (default: 0.8)
    retryAfterMs: 5000,   // Retry delay (default: 5000)
    maxRetries: 3,        // Max retries (default: 3)
  },
});
```

## Regional Endpoints

| Region | Vertical | Endpoint |
|--------|----------|----------|
| `us` | `msp` | `https://api.superops.ai/msp` |
| `us` | `it` | `https://api.superops.ai/it` |
| `eu` | `msp` | `https://euapi.superops.ai/msp` |
| `eu` | `it` | `https://euapi.superops.ai/it` |

## Resources

### Assets

```typescript
// Get single asset
const asset = await client.assets.get('asset-123');

// List assets with filtering
const result = await client.assets.list({
  first: 50,
  filter: {
    status: 'ACTIVE',
    type: 'WORKSTATION',
    clientId: 'client-456',
  },
  orderBy: {
    field: 'NAME',
    direction: 'ASC',
  },
});

// Auto-paginate all assets
for await (const asset of client.assets.listAll()) {
  console.log(asset.name);
}

// List by client
const clientAssets = await client.assets.listByClient('client-456');

// List by site
const siteAssets = await client.assets.listBySite('site-789');

// Create asset
const newAsset = await client.assets.create({
  name: 'New Workstation',
  type: 'WORKSTATION',
  clientId: 'client-456',
});

// Update asset
const updatedAsset = await client.assets.update('asset-123', {
  name: 'Updated Name',
  status: 'MAINTENANCE',
});

// Delete asset
await client.assets.delete('asset-123');
```

### Tickets

```typescript
// Get single ticket
const ticket = await client.tickets.get('ticket-001');

// List tickets with filtering
const result = await client.tickets.list({
  first: 50,
  filter: {
    status: ['OPEN', 'IN_PROGRESS'],
    priority: 'HIGH',
    clientId: 'client-456',
  },
});

// List by status
const openTickets = await client.tickets.listByStatus('OPEN');

// List by technician
const techTickets = await client.tickets.listByTechnician('tech-001');

// Create ticket
const newTicket = await client.tickets.create({
  subject: 'Server not responding',
  description: 'Production server is unresponsive',
  clientId: 'client-456',
  priority: 'CRITICAL',
});

// Update ticket
await client.tickets.update('ticket-001', {
  priority: 'HIGH',
});

// Change status
await client.tickets.changeStatus('ticket-001', 'IN_PROGRESS');

// Assign ticket
await client.tickets.assign('ticket-001', 'tech-002');

// Add note
await client.tickets.addNote('ticket-001', 'Investigating the issue', false);

// Add time entry
await client.tickets.addTimeEntry('ticket-001', {
  startTime: new Date(),
  durationMinutes: 30,
  description: 'Initial investigation',
  billable: true,
});
```

### Clients

```typescript
// Get single client
const clientRecord = await client.clients.get('client-456');

// List clients
const result = await client.clients.list({
  filter: {
    status: 'ACTIVE',
    type: 'CUSTOMER',
  },
});

// Search clients
const searchResults = await client.clients.search('Acme');

// Create client
const newClient = await client.clients.create({
  name: 'New Company',
  type: 'CUSTOMER',
  primaryContact: {
    email: 'contact@company.com',
    phone: '555-1234',
  },
});

// Update client
await client.clients.update('client-456', {
  website: 'https://company.com',
});

// Archive client
await client.clients.archive('client-456');
```

### Sites

```typescript
// Get site
const site = await client.sites.get('site-789');

// List sites by client
const sites = await client.sites.listByClient('client-456');

// Create site
const newSite = await client.sites.create('client-456', {
  name: 'Branch Office',
  address: {
    street1: '456 Oak Ave',
    city: 'Othertown',
    state: 'CA',
    postalCode: '54321',
  },
});

// Update site
await client.sites.update('site-789', {
  name: 'Updated Branch Name',
});

// Delete site
await client.sites.delete('site-789');
```

### Alerts

```typescript
// List alerts
const alerts = await client.alerts.list({
  filter: {
    status: 'OPEN',
    severity: 'CRITICAL',
  },
});

// List by asset
const assetAlerts = await client.alerts.listByAsset('asset-123');

// List by client
const clientAlerts = await client.alerts.listByClient('client-456');

// List by severity
const criticalAlerts = await client.alerts.listBySeverity('CRITICAL');

// Create alert
const newAlert = await client.alerts.create({
  title: 'Disk Space Low',
  message: 'Drive C: is at 95% capacity',
  severity: 'WARNING',
  assetId: 'asset-123',
});

// Acknowledge alert
await client.alerts.acknowledge('alert-001');

// Resolve alert
await client.alerts.resolve('alert-001');

// Dismiss alert
await client.alerts.dismiss('alert-001');
```

### Knowledge Base

```typescript
// Get article
const article = await client.knowledgeBase.getArticle('article-123');

// Get collection
const collection = await client.knowledgeBase.getCollection('collection-456');

// Search knowledge base
const results = await client.knowledgeBase.search('password reset');

// Create collection
const newCollection = await client.knowledgeBase.createCollection({
  name: 'How-To Guides',
  description: 'Step-by-step guides',
});

// Create article
const newArticle = await client.knowledgeBase.createArticle({
  title: 'How to Reset Passwords',
  content: '# Steps\n1. Go to settings...',
  collectionId: 'collection-456',
  tags: ['passwords', 'self-service'],
});

// Update article
await client.knowledgeBase.updateArticle('article-123', {
  content: '# Updated Steps...',
});

// Publish article
await client.knowledgeBase.publishArticle('article-123');
```

### Runbooks

```typescript
// Get runbook
const runbook = await client.runbooks.get('runbook-123');

// List runbooks
const runbooks = await client.runbooks.list({
  filter: {
    status: 'ACTIVE',
    category: 'Maintenance',
  },
});

// Execute runbook
const execution = await client.runbooks.execute('runbook-123', [
  'asset-001',
  'asset-002',
]);

// Check execution status
const status = await client.runbooks.getExecutionStatus(execution.id);
console.log(status.progress.completed, status.progress.failed);
```

### Patches

```typescript
// List patches
const patches = await client.patches.list({
  filter: {
    severity: 'CRITICAL',
    status: 'AVAILABLE',
  },
});

// List by asset
const assetPatches = await client.patches.listByAsset('asset-123');

// Get compliance report
const report = await client.patches.getComplianceReport({
  clientId: 'client-456',
});

// Approve patch
await client.patches.approve('patch-001');

// Schedule deployment
const deployment = await client.patches.scheduleDeployment({
  name: 'February Security Updates',
  scheduledAt: new Date('2026-02-10T02:00:00Z'),
  patchIds: ['patch-001', 'patch-002'],
  assetIds: ['asset-001', 'asset-002'],
  rebootPolicy: 'SCHEDULED',
});
```

### Remote Sessions

```typescript
// Initiate remote session
const session = await client.remoteSessions.initiate('asset-123', 'REMOTE_DESKTOP');

// Get session info
const sessionInfo = await client.remoteSessions.get(session.id);
console.log(sessionInfo.connectionUrl);

// Terminate session
await client.remoteSessions.terminate(session.id);
```

### Reports

```typescript
// Get ticket metrics
const ticketMetrics = await client.reports.ticketMetrics({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
});

// Get asset summary
const assetSummary = await client.reports.assetSummary({
  clientId: 'client-456',
});

// Get technician performance
const performance = await client.reports.technicianPerformance({
  startDate: new Date('2026-01-01'),
  endDate: new Date('2026-01-31'),
});

// Get client health scores
const healthScores = await client.reports.clientHealthScores();
```

## Pagination

SuperOps.ai uses cursor-based pagination. The library provides async iterators for automatic pagination:

```typescript
// Auto-paginate all results
for await (const asset of client.assets.listAll()) {
  console.log(asset.name);
}

// Collect all into an array
const allAssets = await client.assets.listAll().toArray();

// With filters
for await (const ticket of client.tickets.listAll({
  filter: { status: 'OPEN' },
  orderBy: { field: 'CREATED_AT', direction: 'DESC' },
})) {
  console.log(ticket.subject);
}
```

## Error Handling

The library provides typed error classes:

```typescript
import {
  SuperOpsError,
  SuperOpsAuthenticationError,
  SuperOpsNotFoundError,
  SuperOpsValidationError,
  SuperOpsRateLimitError,
  SuperOpsServerError,
} from 'node-superops';

try {
  await client.assets.get('non-existent');
} catch (error) {
  if (error instanceof SuperOpsNotFoundError) {
    console.log('Asset not found');
  } else if (error instanceof SuperOpsAuthenticationError) {
    console.log('Check your API token');
  } else if (error instanceof SuperOpsValidationError) {
    console.log('Validation errors:', error.validationErrors);
  } else if (error instanceof SuperOpsRateLimitError) {
    console.log('Rate limited, retry after:', error.retryAfter);
  }
}
```

## Rate Limiting

The library automatically handles SuperOps.ai's 800 requests per minute limit:

- Tracks requests in a rolling window
- Throttles when approaching the limit
- Automatically retries on rate limit errors
- Configurable thresholds and delays

```typescript
// Check rate limit status
const status = client.getRateLimitStatus();
console.log(`Remaining: ${status.remaining}/${status.maxRequests}`);
console.log(`Throttling: ${status.isThrottling}`);
```

## License

Apache-2.0

## Author

Aaron Sachs / WYRE Technology
