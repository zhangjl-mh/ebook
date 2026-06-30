import type { HomeAccountItem, HomeColumnArticle, HomeIssueArticle } from '@/config/homePage';
import { HomeSearchItemKind, HomeSearchTargetType } from '@/types/enums';
import { articleTabKeys } from '@/types/magazine';
import type { Article, ArticleTabKey } from '@/types/magazine';
import type { HomeSearchItem } from '@/types/homeSearch';

interface BuildHomeSearchItemsInput {
  articlesByTab: Record<ArticleTabKey, Article[]>;
  issueArticles: Record<string, HomeIssueArticle[]>;
  columnArticles: HomeColumnArticle[];
  accountItems: HomeAccountItem[];
}

const compactKeywords = (keywords: string[]) => keywords.filter((keyword) => keyword.trim().length > 0);

export const buildHomeSearchItems = (input: BuildHomeSearchItemsInput): HomeSearchItem[] => {
  const articleItems = articleTabKeys.flatMap((tabKey) =>
    input.articlesByTab[tabKey].map((article) => ({
      id: `article-${article.id}`,
      kind: HomeSearchItemKind.Article,
      title: article.title,
      description: article.summary,
      meta: article.tags[0] || '求是网',
      date: article.publishDate,
      thumbnail: article.thumbnail,
      keywords: compactKeywords([
        article.title,
        article.subtitle,
        article.summary,
        article.publishDate,
        article.linkUrl,
        ...article.tags
      ]),
      target: article.linkUrl
        ? {
            type: HomeSearchTargetType.Webview,
            url: article.linkUrl,
            title: article.title
          }
        : {
            type: HomeSearchTargetType.Pending
          }
    }))
  );

  const issueItems = Object.values(input.issueArticles).flatMap((articles) =>
    articles.map((article) => ({
      id: `issue-${article.id}`,
      kind: HomeSearchItemKind.IssueArticle,
      title: article.title,
      description: article.summary,
      meta: '电子刊',
      date: article.date,
      thumbnail: article.thumbnail,
      keywords: compactKeywords([article.title, article.summary, article.date, article.issueId]),
      target: {
        type: HomeSearchTargetType.ArticleDetail,
        articleId: article.id
      }
    }))
  );

  const columnItems = input.columnArticles.map((article) => ({
    id: `column-${article.id}`,
    kind: HomeSearchItemKind.Column,
    title: article.title,
    description: article.source,
    meta: `作者：${article.author}`,
    date: article.date,
    thumbnail: '',
    keywords: compactKeywords([article.title, article.author, article.source, article.date]),
    target: {
      type: HomeSearchTargetType.Pending
    }
  }));

  const accountItems = input.accountItems.map((item) => ({
    id: `account-${item.id}`,
    kind: HomeSearchItemKind.Account,
    title: item.title,
    description: item.accountName,
    meta: `作者：${item.author}`,
    date: '',
    thumbnail: item.avatar,
    keywords: compactKeywords([item.title, item.accountName, item.author]),
    target: {
      type: HomeSearchTargetType.Pending
    }
  }));

  return [...articleItems, ...issueItems, ...columnItems, ...accountItems];
};

export const filterHomeSearchItems = (
  items: HomeSearchItem[],
  query: string,
  maxResults = 30
): HomeSearchItem[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return items
    .filter((item) =>
      item.keywords.some((keyword) => keyword.trim().toLowerCase().includes(normalizedQuery))
    )
    .slice(0, maxResults);
};
