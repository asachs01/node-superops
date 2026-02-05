/**
 * Technicians resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  Technician,
  TechnicianUpdateInput,
  TechnicianFilter,
  TechnicianOrderBy,
  AvailabilitySlot,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for technicians
 */
const TECHNICIAN_FRAGMENT = gql`
  fragment TechnicianFields on Technician {
    id
    email
    firstName
    lastName
    name
    status
    role
    phone
    mobile
    title
    department
    timezone
    avatarUrl
    skills
    createdAt
    updatedAt
    queues {
      id
      name
    }
  }
`;

/**
 * Technicians resource class
 */
export class TechniciansResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single technician by ID
   */
  async get(id: string): Promise<Technician> {
    const query = gql`
      ${TECHNICIAN_FRAGMENT}
      query GetTechnician($id: ID!) {
        getTechnician(id: $id) {
          ...TechnicianFields
        }
      }
    `;

    const result = await this.client.query<{ getTechnician: Technician }>(query, { id });
    return result.getTechnician;
  }

  /**
   * List technicians with pagination and filtering
   */
  async list(
    params?: ListParams<TechnicianFilter, TechnicianOrderBy>
  ): Promise<Connection<Technician>> {
    const query = gql`
      ${TECHNICIAN_FRAGMENT}
      query GetTechnicianList(
        $first: Int
        $after: String
        $filter: TechnicianFilterInput
        $orderBy: TechnicianOrderInput
      ) {
        getTechnicianList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...TechnicianFields
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

    const result = await this.client.query<{ getTechnicianList: Connection<Technician> }>(
      query,
      variables
    );
    return result.getTechnicianList;
  }

  /**
   * List all technicians with automatic pagination
   */
  listAll(
    params?: Omit<ListParams<TechnicianFilter, TechnicianOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<Technician> {
    return this.createListIterator<Technician, TechnicianFilter, TechnicianOrderBy>(
      (p) => this.list(p),
      params
    );
  }

  /**
   * Get technician availability for a specific date
   */
  async getAvailability(id: string, date: string | Date): Promise<AvailabilitySlot[]> {
    const query = gql`
      query GetTechnicianAvailability($id: ID!, $date: Date!) {
        getTechnicianAvailability(id: $id, date: $date) {
          date
          startTime
          endTime
          available
          reason
        }
      }
    `;

    const dateString = date instanceof Date ? date.toISOString().split('T')[0] : date;

    const result = await this.client.query<{ getTechnicianAvailability: AvailabilitySlot[] }>(
      query,
      { id, date: dateString }
    );
    return result.getTechnicianAvailability;
  }

  /**
   * Update a technician
   */
  async update(id: string, input: TechnicianUpdateInput): Promise<Technician> {
    const mutation = gql`
      ${TECHNICIAN_FRAGMENT}
      mutation UpdateTechnician($id: ID!, $input: TechnicianInput!) {
        updateTechnician(id: $id, input: $input) {
          ...TechnicianFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateTechnician: Technician }>(mutation, {
      id,
      input,
    });
    return result.updateTechnician;
  }
}
