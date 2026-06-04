export interface IssueDirectoryItem {
  id: string;
  title: string;
  author?: string;
}

export interface IssueDirectory {
  issueId: string;
  issueTitle: string;
  guideTitle: string;
  targetArticleId: string;
  items: IssueDirectoryItem[];
}

export type ArticleBodyBlockType = 'heading' | 'author' | 'paragraph' | 'note' | 'caption' | 'image';

export interface ArticleTextBlock {
  id: string;
  type: Exclude<ArticleBodyBlockType, 'image'>;
  text: string;
}

export interface ArticleImageBlock {
  id: string;
  type: 'image';
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
  body: ArticleBodyBlock[];
}
