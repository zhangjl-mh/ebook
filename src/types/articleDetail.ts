import type { ArticleBodyBlockType } from '@/types/enums';

export type { ArticleBodyBlockType } from '@/types/enums';

export interface IssueDirectoryItem {
  id: string;
  title: string;
  author?: string;
  targetArticleId?: string;
}

export interface IssueDirectory {
  issueId: string;
  issueTitle: string;
  guideTitle: string;
  targetArticleId: string;
  items: IssueDirectoryItem[];
}

export interface ArticleTextBlock {
  id: string;
  type: Exclude<ArticleBodyBlockType, 'image'>;
  text: string;
}

export interface ArticleImageBlock {
  id: string;
  type: Extract<ArticleBodyBlockType, 'image'>;
  src: string;
  alt: string;
}

export type ArticleBodyBlock = ArticleTextBlock | ArticleImageBlock;

export interface ArticleDetail {
  id: string;
  title: string;
  source: string;
  issue: string;
  author: string;
  publishTime: string;
  wordCount: number;
  likeCount: number;
  heroImage?: string;
  heroMedia?: 'image' | 'video';
  language?: 'zh' | 'en';
  theme?: 'default' | 'prototype-dark';
  body: ArticleBodyBlock[];
}
