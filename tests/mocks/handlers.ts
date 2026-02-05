/**
 * MSW GraphQL handlers for SuperOps API mocking
 */

import { graphql, HttpResponse } from 'msw';

// Create a GraphQL link for SuperOps API
const superopsApi = graphql.link('https://api.superops.ai/msp');

/**
 * Sample asset data
 */
const sampleAsset = {
  id: 'asset-123',
  name: 'Test Workstation',
  type: 'WORKSTATION',
  status: 'ACTIVE',
  serialNumber: 'SN123456',
  manufacturer: 'Dell',
  model: 'OptiPlex 7080',
  operatingSystem: 'Windows 11 Pro',
  ipAddress: '192.168.1.100',
  macAddress: '00:11:22:33:44:55',
  lastSeenAt: '2026-02-04T10:00:00.000Z',
  installedAt: '2025-06-15T00:00:00.000Z',
  warrantyExpiresAt: '2028-06-15T00:00:00.000Z',
  notes: 'Primary workstation',
  clientId: 'client-456',
  siteId: 'site-789',
  createdAt: '2025-06-15T09:00:00.000Z',
  updatedAt: '2026-02-04T10:00:00.000Z',
  client: {
    id: 'client-456',
    name: 'Acme Corp',
  },
  site: {
    id: 'site-789',
    name: 'Main Office',
  },
};

const sampleAsset2 = {
  id: 'asset-456',
  name: 'Test Server',
  type: 'SERVER',
  status: 'ACTIVE',
  serialNumber: 'SN789012',
  manufacturer: 'HP',
  model: 'ProLiant DL380',
  operatingSystem: 'Windows Server 2022',
  ipAddress: '192.168.1.10',
  macAddress: 'AA:BB:CC:DD:EE:FF',
  lastSeenAt: '2026-02-04T10:00:00.000Z',
  clientId: 'client-456',
  createdAt: '2025-01-10T09:00:00.000Z',
  updatedAt: '2026-02-04T10:00:00.000Z',
  client: {
    id: 'client-456',
    name: 'Acme Corp',
  },
  site: null,
};

/**
 * Sample ticket data
 */
const sampleTicket = {
  id: 'ticket-001',
  subject: 'Computer not starting',
  description: 'User reports computer will not boot',
  status: 'OPEN',
  priority: 'HIGH',
  type: 'INCIDENT',
  source: 'EMAIL',
  dueDate: '2026-02-05T17:00:00.000Z',
  resolvedAt: null,
  closedAt: null,
  firstResponseAt: null,
  clientId: 'client-456',
  siteId: 'site-789',
  assetId: 'asset-123',
  technicianId: 'tech-001',
  queueId: 'queue-001',
  createdAt: '2026-02-04T09:00:00.000Z',
  updatedAt: '2026-02-04T09:00:00.000Z',
  client: {
    id: 'client-456',
    name: 'Acme Corp',
  },
  site: {
    id: 'site-789',
    name: 'Main Office',
  },
  asset: {
    id: 'asset-123',
    name: 'Test Workstation',
  },
  technician: {
    id: 'tech-001',
    name: 'John Smith',
    email: 'john.smith@msp.com',
  },
  queue: {
    id: 'queue-001',
    name: 'Tier 1 Support',
  },
  tags: ['hardware', 'urgent'],
  notes: [],
  timeEntries: [],
};

/**
 * Sample client data
 */
const sampleClient = {
  id: 'client-456',
  name: 'Acme Corp',
  status: 'ACTIVE',
  type: 'CUSTOMER',
  displayName: 'Acme Corporation',
  website: 'https://acme.example.com',
  industry: 'Manufacturing',
  notes: 'Important customer',
  taxId: '12-3456789',
  defaultTechnicianId: 'tech-001',
  createdAt: '2024-01-15T10:00:00.000Z',
  updatedAt: '2026-01-20T14:00:00.000Z',
  primaryContact: {
    email: 'contact@acme.example.com',
    phone: '555-123-4567',
    mobile: '555-987-6543',
    fax: null,
  },
  billingContact: {
    email: 'billing@acme.example.com',
    phone: '555-123-4568',
    mobile: null,
    fax: null,
  },
  address: {
    street1: '123 Main St',
    street2: 'Suite 100',
    city: 'Anytown',
    state: 'CA',
    postalCode: '12345',
    country: 'USA',
  },
  billingAddress: {
    street1: '123 Main St',
    street2: 'Suite 100',
    city: 'Anytown',
    state: 'CA',
    postalCode: '12345',
    country: 'USA',
  },
  defaultTechnician: {
    id: 'tech-001',
    name: 'John Smith',
  },
  tags: ['enterprise', 'priority'],
};

/**
 * Sample alert data
 */
const sampleAlert = {
  id: 'alert-001',
  title: 'High CPU Usage',
  message: 'CPU usage exceeded 90% for 5 minutes',
  status: 'OPEN',
  severity: 'WARNING',
  category: 'PERFORMANCE',
  source: 'RMM Agent',
  acknowledgedAt: null,
  resolvedAt: null,
  dismissedAt: null,
  assetId: 'asset-123',
  clientId: 'client-456',
  siteId: 'site-789',
  ticketId: null,
  createdAt: '2026-02-04T08:30:00.000Z',
  updatedAt: '2026-02-04T08:30:00.000Z',
  asset: {
    id: 'asset-123',
    name: 'Test Workstation',
  },
  client: {
    id: 'client-456',
    name: 'Acme Corp',
  },
  site: {
    id: 'site-789',
    name: 'Main Office',
  },
  ticket: null,
  acknowledgedBy: null,
  resolvedBy: null,
};

/**
 * Error responses
 */
const notFoundError = {
  errors: [
    {
      message: 'Resource not found',
      extensions: {
        code: 'NOT_FOUND',
      },
    },
  ],
};

const authenticationError = {
  errors: [
    {
      message: 'Invalid API token',
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    },
  ],
};

const validationError = {
  errors: [
    {
      message: 'Name is required',
      path: ['input', 'name'],
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    },
  ],
};

/**
 * Helper to check authentication
 */
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  const subdomainHeader = request.headers.get('CustomerSubDomain');

  return (
    authHeader !== null &&
    authHeader.startsWith('Bearer ') &&
    authHeader !== 'Bearer invalid-token' &&
    subdomainHeader !== null &&
    subdomainHeader.length > 0
  );
}

/**
 * MSW handlers for SuperOps GraphQL API
 */
export const handlers = [
  // Assets - Get single
  superopsApi.query('GetAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id } = variables as { id: string };
    if (id === 'asset-123') {
      return HttpResponse.json({ data: { getAsset: sampleAsset } });
    }
    if (id === 'not-found') {
      return HttpResponse.json(notFoundError);
    }
    return HttpResponse.json(notFoundError);
  }),

  // Assets - List
  superopsApi.query('GetAssetList', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { first: _first, after } = variables as { first?: number; after?: string };

    // Simulate pagination
    if (after === 'cursor-page1') {
      return HttpResponse.json({
        data: {
          getAssetList: {
            edges: [{ node: sampleAsset2, cursor: 'cursor-page2' }],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
              startCursor: 'cursor-page2',
              endCursor: 'cursor-page2',
            },
            totalCount: 2,
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        getAssetList: {
          edges: [{ node: sampleAsset, cursor: 'cursor-page1' }],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
            startCursor: 'cursor-page1',
            endCursor: 'cursor-page1',
          },
          totalCount: 2,
        },
      },
    });
  }),

  // Assets - Create
  superopsApi.mutation('CreateAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { name?: string } };
    if (!input.name) {
      return HttpResponse.json(validationError);
    }

    return HttpResponse.json({
      data: {
        createAsset: {
          ...sampleAsset,
          id: 'asset-new',
          ...input,
        },
      },
    });
  }),

  // Assets - Update
  superopsApi.mutation('UpdateAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id, input } = variables as { id: string; input: Record<string, unknown> };
    if (id === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        updateAsset: {
          ...sampleAsset,
          ...input,
        },
      },
    });
  }),

  // Assets - Delete
  superopsApi.mutation('DeleteAsset', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id } = variables as { id: string };
    if (id === 'not-found') {
      return HttpResponse.json(notFoundError);
    }

    return HttpResponse.json({
      data: {
        deleteAsset: true,
      },
    });
  }),

  // Tickets - Get single
  superopsApi.query('GetTicket', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id } = variables as { id: string };
    if (id === 'ticket-001') {
      return HttpResponse.json({ data: { getTicket: sampleTicket } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Tickets - List
  superopsApi.query('GetTicketList', ({ request }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    return HttpResponse.json({
      data: {
        getTicketList: {
          edges: [{ node: sampleTicket, cursor: 'cursor-1' }],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor-1',
            endCursor: 'cursor-1',
          },
          totalCount: 1,
        },
      },
    });
  }),

  // Tickets - Create
  superopsApi.mutation('CreateTicket', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { input } = variables as { input: { subject?: string } };
    if (!input.subject) {
      return HttpResponse.json(validationError);
    }

    return HttpResponse.json({
      data: {
        createTicket: {
          ...sampleTicket,
          id: 'ticket-new',
          ...input,
        },
      },
    });
  }),

  // Tickets - Change Status
  superopsApi.mutation('ChangeTicketStatus', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id, status } = variables as { id: string; status: string };
    return HttpResponse.json({
      data: {
        changeTicketStatus: {
          ...sampleTicket,
          id,
          status,
        },
      },
    });
  }),

  // Tickets - Add Note
  superopsApi.mutation('AddTicketNote', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { ticketId: _ticketId, note, isPublic } = variables as {
      ticketId: string;
      note: string;
      isPublic?: boolean;
    };

    return HttpResponse.json({
      data: {
        addTicketNote: {
          id: 'note-new',
          content: note,
          isPublic: isPublic ?? false,
          createdAt: '2026-02-04T12:00:00.000Z',
          createdBy: {
            id: 'tech-001',
            name: 'John Smith',
          },
        },
      },
    });
  }),

  // Clients - Get single
  superopsApi.query('GetClient', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id } = variables as { id: string };
    if (id === 'client-456') {
      return HttpResponse.json({ data: { getClient: sampleClient } });
    }
    return HttpResponse.json(notFoundError);
  }),

  // Clients - List
  superopsApi.query('GetClientList', ({ request }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    return HttpResponse.json({
      data: {
        getClientList: {
          edges: [{ node: sampleClient, cursor: 'cursor-1' }],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor-1',
            endCursor: 'cursor-1',
          },
          totalCount: 1,
        },
      },
    });
  }),

  // Clients - Search
  superopsApi.query('SearchClients', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { query } = variables as { query: string };
    if (query.toLowerCase().includes('acme')) {
      return HttpResponse.json({
        data: {
          searchClients: {
            edges: [{ node: sampleClient, cursor: 'cursor-1' }],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: 'cursor-1',
              endCursor: 'cursor-1',
            },
            totalCount: 1,
          },
        },
      });
    }

    return HttpResponse.json({
      data: {
        searchClients: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
          totalCount: 0,
        },
      },
    });
  }),

  // Alerts - List
  superopsApi.query('GetAlertList', ({ request }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    return HttpResponse.json({
      data: {
        getAlertList: {
          edges: [{ node: sampleAlert, cursor: 'cursor-1' }],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor-1',
            endCursor: 'cursor-1',
          },
          totalCount: 1,
        },
      },
    });
  }),

  // Alerts - Acknowledge
  superopsApi.mutation('AcknowledgeAlert', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id } = variables as { id: string };
    return HttpResponse.json({
      data: {
        acknowledgeAlert: {
          ...sampleAlert,
          id,
          status: 'ACKNOWLEDGED',
          acknowledgedAt: '2026-02-04T12:00:00.000Z',
          acknowledgedBy: {
            id: 'tech-001',
            name: 'John Smith',
          },
        },
      },
    });
  }),

  // Alerts - Resolve
  superopsApi.mutation('ResolveAlert', ({ request, variables }) => {
    if (!checkAuth(request)) {
      return HttpResponse.json(authenticationError);
    }

    const { id } = variables as { id: string };
    return HttpResponse.json({
      data: {
        resolveAlert: {
          ...sampleAlert,
          id,
          status: 'RESOLVED',
          resolvedAt: '2026-02-04T12:00:00.000Z',
          resolvedBy: {
            id: 'tech-001',
            name: 'John Smith',
          },
        },
      },
    });
  }),

  // Rate limit simulation
  superopsApi.query('RateLimited', () => {
    return HttpResponse.json({
      errors: [
        {
          message: 'Rate limit exceeded',
          extensions: {
            code: 'RATE_LIMITED',
          },
        },
      ],
    });
  }),

  // Server error simulation
  superopsApi.query('ServerError', () => {
    return HttpResponse.json({
      errors: [
        {
          message: 'Internal server error',
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        },
      ],
    });
  }),
];
