/**
 * Tickets resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Ticket,
  TicketCreateInput,
  TicketUpdateInput,
  TicketFilter,
  TicketOrderBy,
  TicketStatus,
  TimeEntryInput,
  TicketNote,
  TicketTimeEntry,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for tickets
 */
const TICKET_FRAGMENT = gql`
  fragment TicketFields on Ticket {
    id
    subject
    description
    status
    priority
    type
    source
    dueDate
    resolvedAt
    closedAt
    firstResponseAt
    clientId
    siteId
    assetId
    technicianId
    queueId
    createdAt
    updatedAt
    client {
      id
      name
    }
    site {
      id
      name
    }
    asset {
      id
      name
    }
    technician {
      id
      name
      email
    }
    queue {
      id
      name
    }
    tags
  }
`;

/**
 * Tickets resource class
 */
export class TicketsResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single ticket by ID
   */
  async get(id: string): Promise<Ticket> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicket($id: ID!) {
        getTicket(id: $id) {
          ...TicketFields
          notes {
            id
            content
            isPublic
            createdAt
            createdBy {
              id
              name
            }
          }
          timeEntries {
            id
            startTime
            endTime
            durationMinutes
            description
            billable
            technicianId
            technician {
              id
              name
            }
          }
        }
      }
    `;

    const result = await this.client.query<{ getTicket: Ticket }>(query, { id });
    return result.getTicket;
  }

  /**
   * List tickets with pagination and filtering
   */
  async list(
    params?: ListParams<TicketFilter, TicketOrderBy>
  ): Promise<Connection<Ticket>> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicketList(
        $first: Int
        $after: String
        $filter: TicketFilterInput
        $orderBy: TicketOrderInput
      ) {
        getTicketList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...TicketFields
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;

    const variables = {
      first: params?.first ?? 50,
      after: params?.after,
      filter: prepareFilter(params?.filter),
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getTicketList: Connection<Ticket> }>(query, variables);
    return result.getTicketList;
  }

  /**
   * List all tickets with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<TicketFilter, TicketOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Ticket> {
    return this.createListIterator<Ticket, TicketFilter, TicketOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * List tickets by client ID
   */
  async listByClient(
    clientId: string,
    params?: Omit<ListParams<TicketFilter, TicketOrderBy>, 'filter'>
  ): Promise<Connection<Ticket>> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicketsByClient(
        $clientId: ID!
        $first: Int
        $after: String
        $orderBy: TicketOrderInput
      ) {
        getTicketsByClient(clientId: $clientId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...TicketFields
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;

    const variables = {
      clientId,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getTicketsByClient: Connection<Ticket> }>(
      query,
      variables
    );
    return result.getTicketsByClient;
  }

  /**
   * List tickets by status
   */
  async listByStatus(
    status: TicketStatus,
    params?: Omit<ListParams<TicketFilter, TicketOrderBy>, 'filter'>
  ): Promise<Connection<Ticket>> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicketsByStatus(
        $status: TicketStatus!
        $first: Int
        $after: String
        $orderBy: TicketOrderInput
      ) {
        getTicketsByStatus(status: $status, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...TicketFields
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;

    const variables = {
      status,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getTicketsByStatus: Connection<Ticket> }>(
      query,
      variables
    );
    return result.getTicketsByStatus;
  }

  /**
   * List tickets by technician ID
   */
  async listByTechnician(
    technicianId: string,
    params?: Omit<ListParams<TicketFilter, TicketOrderBy>, 'filter'>
  ): Promise<Connection<Ticket>> {
    const query = gql`
      ${TICKET_FRAGMENT}
      query GetTicketsByTechnician(
        $techId: ID!
        $first: Int
        $after: String
        $orderBy: TicketOrderInput
      ) {
        getTicketsByTechnician(techId: $techId, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              ...TicketFields
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          totalCount
        }
      }
    `;

    const variables = {
      techId: technicianId,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ getTicketsByTechnician: Connection<Ticket> }>(
      query,
      variables
    );
    return result.getTicketsByTechnician;
  }

  /**
   * Create a new ticket
   */
  async create(input: TicketCreateInput): Promise<Ticket> {
    const mutation = gql`
      ${TICKET_FRAGMENT}
      mutation CreateTicket($input: TicketInput!) {
        createTicket(input: $input) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.mutate<{ createTicket: Ticket }>(mutation, { input });
    return result.createTicket;
  }

  /**
   * Update an existing ticket
   */
  async update(id: string, input: TicketUpdateInput): Promise<Ticket> {
    const mutation = gql`
      ${TICKET_FRAGMENT}
      mutation UpdateTicket($id: ID!, $input: TicketInput!) {
        updateTicket(id: $id, input: $input) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateTicket: Ticket }>(mutation, { id, input });
    return result.updateTicket;
  }

  /**
   * Add a note to a ticket
   */
  async addNote(ticketId: string, note: string, isPublic: boolean = false): Promise<TicketNote> {
    const mutation = gql`
      mutation AddTicketNote($ticketId: ID!, $note: String!, $isPublic: Boolean) {
        addTicketNote(ticketId: $ticketId, note: $note, isPublic: $isPublic) {
          id
          content
          isPublic
          createdAt
          createdBy {
            id
            name
          }
        }
      }
    `;

    const result = await this.client.mutate<{ addTicketNote: TicketNote }>(mutation, {
      ticketId,
      note,
      isPublic,
    });
    return result.addTicketNote;
  }

  /**
   * Add a time entry to a ticket
   */
  async addTimeEntry(ticketId: string, input: TimeEntryInput): Promise<TicketTimeEntry> {
    const mutation = gql`
      mutation AddTicketTimeEntry($ticketId: ID!, $input: TimeEntryInput!) {
        addTicketTimeEntry(ticketId: $ticketId, input: $input) {
          id
          startTime
          endTime
          durationMinutes
          description
          billable
          technicianId
          technician {
            id
            name
          }
        }
      }
    `;

    const result = await this.client.mutate<{ addTicketTimeEntry: TicketTimeEntry }>(mutation, {
      ticketId,
      input,
    });
    return result.addTicketTimeEntry;
  }

  /**
   * Change ticket status
   */
  async changeStatus(id: string, status: TicketStatus): Promise<Ticket> {
    const mutation = gql`
      ${TICKET_FRAGMENT}
      mutation ChangeTicketStatus($id: ID!, $status: TicketStatus!) {
        changeTicketStatus(id: $id, status: $status) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.mutate<{ changeTicketStatus: Ticket }>(mutation, {
      id,
      status,
    });
    return result.changeTicketStatus;
  }

  /**
   * Assign ticket to a technician
   */
  async assign(id: string, technicianId: string): Promise<Ticket> {
    const mutation = gql`
      ${TICKET_FRAGMENT}
      mutation AssignTicket($id: ID!, $technicianId: ID!) {
        assignTicket(id: $id, technicianId: $technicianId) {
          ...TicketFields
        }
      }
    `;

    const result = await this.client.mutate<{ assignTicket: Ticket }>(mutation, {
      id,
      technicianId,
    });
    return result.assignTicket;
  }
}
