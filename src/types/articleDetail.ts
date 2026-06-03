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

export type ArticleBodyBlockType = 'heading' | 'author' | 'paragraph' | 'note' | 'caption';

export interface ArticleBodyBlock {
  id: string;
  type: ArticleBodyBlockType;
  text: string;
}

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
