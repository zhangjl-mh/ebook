import type { ArticleTabKey } from '@/types/enums';

export { articleTabKeys } from '@/types/enums';
export type { ArticleTabKey } from '@/types/enums';

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  thumbnail: string;
  publishDate: string;
  linkUrl: string;
}

export interface MagazineIssue {
  id: string;
  year: string;
  issueNum: string;
  fullTitle: string;
  articleCount: number;
  recommendationTitle: string;
  coverImage: string;
  originalUrl: string;
}

export interface TabCategory {
  key: ArticleTabKey;
  name: string;
}

export interface MagazineConfig {
  headerLogo: string;
  headerBackground: string;
  swiperIssues: MagazineIssue[];
  subscription: {
    title: string;
    description: string;
    bellIcon: string;
    btnText: string;
  };
  tabCategories: TabCategory[];
  articles: Record<ArticleTabKey, Article[]>;
}
