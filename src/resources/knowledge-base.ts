/**
 * Knowledge Base resource for SuperOps API
 */

import { BaseResource, prepareFilter, type BaseResourceOptions } from './base.js';
import { gql } from '../graphql-client.js';
import type {
  KbArticle,
  KbCollection,
  KbArticleCreateInput,
  KbArticleUpdateInput,
  KbCollectionCreateInput,
  KbCollectionUpdateInput,
  KbArticleFilter,
  KbArticleOrderBy,
  KbSearchResult,
  Connection,
  ListParams,
  AsyncIterableWithHelpers,
} from '../types/index.js';

/**
 * GraphQL fragments for knowledge base
 */
const KB_ARTICLE_FRAGMENT = gql`
  fragment KbArticleFields on KbArticle {
    id
    title
    content
    status
    visibility
    slug
    excerpt
    collectionId
    publishedAt
    viewCount
    helpfulCount
    notHelpfulCount
    tags
    relatedArticleIds
    createdAt
    updatedAt
    collection {
      id
      name
    }
    author {
      id
      name
    }
    attachments {
      id
      name
      url
      size
      mimeType
    }
  }
`;

const KB_COLLECTION_FRAGMENT = gql`
  fragment KbCollectionFields on KbCollection {
    id
    name
    description
    slug
    parentId
    articleCount
    createdAt
    updatedAt
    parent {
      id
      name
    }
  }
`;

/**
 * Knowledge Base resource class
 */
export class KnowledgeBaseResource extends BaseResource {
  constructor(options: BaseResourceOptions) {
    super(options);
  }

  /**
   * Get a single article by ID
   */
  async getArticle(id: string): Promise<KbArticle> {
    const query = gql`
      ${KB_ARTICLE_FRAGMENT}
      query GetKbArticle($id: ID!) {
        getKbArticle(id: $id) {
          ...KbArticleFields
        }
      }
    `;

    const result = await this.client.query<{ getKbArticle: KbArticle }>(query, { id });
    return result.getKbArticle;
  }

  /**
   * Get a single collection by ID
   */
  async getCollection(id: string): Promise<KbCollection> {
    const query = gql`
      ${KB_COLLECTION_FRAGMENT}
      query GetKbCollection($id: ID!) {
        getKbCollection(id: $id) {
          ...KbCollectionFields
          children {
            id
            name
            description
            articleCount
          }
        }
      }
    `;

    const result = await this.client.query<{ getKbCollection: KbCollection }>(query, { id });
    return result.getKbCollection;
  }

  /**
   * Search the knowledge base
   */
  async search(
    searchQuery: string,
    params?: Omit<ListParams<KbArticleFilter, KbArticleOrderBy>, 'filter'>
  ): Promise<Connection<KbSearchResult>> {
    const query = gql`
      ${KB_ARTICLE_FRAGMENT}
      query SearchKnowledgeBase(
        $query: String!
        $first: Int
        $after: String
        $orderBy: KbArticleOrderInput
      ) {
        searchKnowledgeBase(query: $query, first: $first, after: $after, orderBy: $orderBy) {
          edges {
            node {
              article {
                ...KbArticleFields
              }
              score
              highlights {
                title
                content
              }
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
      query: searchQuery,
      first: params?.first ?? 50,
      after: params?.after,
      orderBy: params?.orderBy,
    };

    const result = await this.client.query<{ searchKnowledgeBase: Connection<KbSearchResult> }>(
      query,
      variables
    );
    return result.searchKnowledgeBase;
  }

  /**
   * List articles with pagination and filtering
   */
  async listArticles(
    params?: ListParams<KbArticleFilter, KbArticleOrderBy>
  ): Promise<Connection<KbArticle>> {
    const query = gql`
      ${KB_ARTICLE_FRAGMENT}
      query GetKbArticleList(
        $first: Int
        $after: String
        $filter: KbArticleFilterInput
        $orderBy: KbArticleOrderInput
      ) {
        getKbArticleList(first: $first, after: $after, filter: $filter, orderBy: $orderBy) {
          edges {
            node {
              ...KbArticleFields
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

    const result = await this.client.query<{ getKbArticleList: Connection<KbArticle> }>(
      query,
      variables
    );
    return result.getKbArticleList;
  }

  /**
   * List all articles with automatic pagination
   */
  listArticlesAll(
    params?: Omit<ListParams<KbArticleFilter, KbArticleOrderBy>, 'first' | 'after'>
  ): AsyncIterableWithHelpers<KbArticle> {
    return this.createListIterator<KbArticle, KbArticleFilter, KbArticleOrderBy>(
      (p) => this.listArticles(p),
      params
    );
  }

  /**
   * Create a new collection
   */
  async createCollection(input: KbCollectionCreateInput): Promise<KbCollection> {
    const mutation = gql`
      ${KB_COLLECTION_FRAGMENT}
      mutation CreateKbCollection($input: KbCollectionInput!) {
        createKbCollection(input: $input) {
          ...KbCollectionFields
        }
      }
    `;

    const result = await this.client.mutate<{ createKbCollection: KbCollection }>(mutation, {
      input,
    });
    return result.createKbCollection;
  }

  /**
   * Update a collection
   */
  async updateCollection(id: string, input: KbCollectionUpdateInput): Promise<KbCollection> {
    const mutation = gql`
      ${KB_COLLECTION_FRAGMENT}
      mutation UpdateKbCollection($id: ID!, $input: KbCollectionInput!) {
        updateKbCollection(id: $id, input: $input) {
          ...KbCollectionFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateKbCollection: KbCollection }>(mutation, {
      id,
      input,
    });
    return result.updateKbCollection;
  }

  /**
   * Create a new article
   */
  async createArticle(input: KbArticleCreateInput): Promise<KbArticle> {
    const mutation = gql`
      ${KB_ARTICLE_FRAGMENT}
      mutation CreateKbArticle($input: KbArticleInput!) {
        createKbArticle(input: $input) {
          ...KbArticleFields
        }
      }
    `;

    const result = await this.client.mutate<{ createKbArticle: KbArticle }>(mutation, { input });
    return result.createKbArticle;
  }

  /**
   * Update an article
   */
  async updateArticle(id: string, input: KbArticleUpdateInput): Promise<KbArticle> {
    const mutation = gql`
      ${KB_ARTICLE_FRAGMENT}
      mutation UpdateKbArticle($id: ID!, $input: KbArticleInput!) {
        updateKbArticle(id: $id, input: $input) {
          ...KbArticleFields
        }
      }
    `;

    const result = await this.client.mutate<{ updateKbArticle: KbArticle }>(mutation, {
      id,
      input,
    });
    return result.updateKbArticle;
  }

  /**
   * Publish an article
   */
  async publishArticle(id: string): Promise<KbArticle> {
    const mutation = gql`
      ${KB_ARTICLE_FRAGMENT}
      mutation PublishKbArticle($id: ID!) {
        publishKbArticle(id: $id) {
          ...KbArticleFields
        }
      }
    `;

    const result = await this.client.mutate<{ publishKbArticle: KbArticle }>(mutation, { id });
    return result.publishKbArticle;
  }
}
