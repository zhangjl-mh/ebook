export const articleTabKeys = ['recommend', 'news', 'theory'] as const;

export type ArticleTabKey = (typeof articleTabKeys)[number];

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
  catalogUrl: string;
  originalUrl: string;
}

export interface TabCategory {
  key: ArticleTabKey;
  name: string;
}

export interface MagazineConfig {
  headerLogo: string;
  headerTitle: string;
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
