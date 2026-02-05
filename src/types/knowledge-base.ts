/**
 * Knowledge Base types for SuperOps API
 */

import type { BaseResource, OrderDirection } from './common.js';

/**
 * Article status
 */
export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

/**
 * Article visibility
 */
export type ArticleVisibility = 'INTERNAL' | 'PUBLIC' | 'CLIENT_SPECIFIC';

/**
 * Knowledge base collection
 */
export interface KbCollection extends BaseResource {
  name: string;
  description?: string;
  slug?: string;
  parentId?: string;
  articleCount?: number;
  parent?: {
    id: string;
    name: string;
  };
  children?: KbCollection[];
}

/**
 * Knowledge base article
 */
export interface KbArticle extends BaseResource {
  title: string;
  content: string;
  status: ArticleStatus;
  visibility: ArticleVisibility;
  slug?: string;
  excerpt?: string;
  collectionId?: string;
  collection?: {
    id: string;
    name: string;
  };
  author?: {
    id: string;
    name: string;
  };
  publishedAt?: string;
  viewCount?: number;
  helpfulCount?: number;
  notHelpfulCount?: number;
  tags?: string[];
  relatedArticleIds?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  customFields?: Record<string, unknown>;
}

/**
 * Input for creating a collection
 */
export interface KbCollectionCreateInput {
  name: string;
  description?: string;
  slug?: string;
  parentId?: string;
}

/**
 * Input for updating a collection
 */
export interface KbCollectionUpdateInput {
  name?: string;
  description?: string;
  slug?: string;
  parentId?: string;
}

/**
 * Input for creating an article
 */
export interface KbArticleCreateInput {
  title: string;
  content: string;
  status?: ArticleStatus;
  visibility?: ArticleVisibility;
  slug?: string;
  excerpt?: string;
  collectionId?: string;
  tags?: string[];
  relatedArticleIds?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Input for updating an article
 */
export interface KbArticleUpdateInput {
  title?: string;
  content?: string;
  status?: ArticleStatus;
  visibility?: ArticleVisibility;
  slug?: string;
  excerpt?: string;
  collectionId?: string;
  tags?: string[];
  relatedArticleIds?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Knowledge base search result
 */
export interface KbSearchResult {
  article: KbArticle;
  score: number;
  highlights?: {
    title?: string;
    content?: string;
  };
}

/**
 * Article filter options
 */
export interface KbArticleFilter {
  status?: ArticleStatus | ArticleStatus[];
  visibility?: ArticleVisibility | ArticleVisibility[];
  collectionId?: string;
  authorId?: string;
  tags?: string[];
  searchQuery?: string;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
  publishedAfter?: string | Date;
  publishedBefore?: string | Date;
}

/**
 * Article order by fields
 */
export type KbArticleOrderField = 'TITLE' | 'STATUS' | 'CREATED_AT' | 'UPDATED_AT' | 'PUBLISHED_AT' | 'VIEW_COUNT';

/**
 * Article order by configuration
 */
export interface KbArticleOrderBy {
  field: KbArticleOrderField;
  direction: OrderDirection;
}
