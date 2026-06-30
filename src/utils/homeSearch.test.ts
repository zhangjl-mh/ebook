import { describe, expect, it } from 'vitest';
import { ArticleTabKey, HomeSearchItemKind, HomeSearchTargetType } from '@/types/enums';
import { buildHomeSearchItems, filterHomeSearchItems } from '@/utils/homeSearch';
import type { HomeAccountItem, HomeColumnArticle, HomeIssueArticle } from '@/config/homePage';
import type { Article } from '@/types/magazine';

const remoteArticle: Article = {
  id: 'remote-a',
  title: '学习贯彻党的二十届四中全会精神',
  subtitle: '深入学习',
  summary: '围绕高质量发展开展专题解读',
  tags: ['理论', '学习'],
  thumbnail: '/static/test/remote-a.png',
  publishDate: '2026-06-01',
  linkUrl: 'https://www.qstheory.cn/remote-a'
};

const issueArticle: HomeIssueArticle = {
  id: 'issue-a',
  issueId: 'qiushi',
  title: 'Planning Ahead for Emerging Industries',
  summary: 'A review of emerging industries and future development.',
  date: '2026-06-02',
  thumbnail: '/static/test/issue-a.png'
};

const columnArticle: HomeColumnArticle = {
  id: 'column-a',
  title: '新时代人文经济学的丰富内涵',
  author: '葛扬',
  source: '《求是》2025/23',
  date: '2025-12-01'
};

const accountItem: HomeAccountItem = {
  id: 'account-a',
  accountName: '求是',
  author: '苏慧',
  title: '华为“韬定律”揭示了什么',
  avatar: '/static/test/account-a.png'
};

const buildItems = () =>
  buildHomeSearchItems({
    articlesByTab: {
      [ArticleTabKey.Recommend]: [remoteArticle],
      [ArticleTabKey.News]: [],
      [ArticleTabKey.Theory]: [],
      [ArticleTabKey.Enterprise]: []
    },
    issueArticles: {
      qiushi: [issueArticle]
    },
    columnArticles: [columnArticle],
    accountItems: [accountItem]
  });

describe('homeSearch', () => {
  it('returns no results for blank query', () => {
    expect(filterHomeSearchItems(buildItems(), '   ')).toEqual([]);
  });

  it('builds search items from remote articles, issue articles, columns, and accounts in order', () => {
    const items = buildItems();

    expect(items.map((item) => item.id)).toEqual([
      'article-remote-a',
      'issue-issue-a',
      'column-column-a',
      'account-account-a'
    ]);
    expect(items.map((item) => item.kind)).toEqual([
      HomeSearchItemKind.Article,
      HomeSearchItemKind.IssueArticle,
      HomeSearchItemKind.Column,
      HomeSearchItemKind.Account
    ]);
  });

  it('uses webview target for remote article links and articleDetail for issue articles', () => {
    const [articleItem, issueItem] = buildItems();

    expect(articleItem.target).toEqual({
      type: HomeSearchTargetType.Webview,
      url: remoteArticle.linkUrl,
      title: remoteArticle.title
    });
    expect(issueItem.target).toEqual({
      type: HomeSearchTargetType.ArticleDetail,
      articleId: issueArticle.id
    });
  });

  it('matches title, summary, tags, author, and source or account text', () => {
    const items = buildItems();

    expect(filterHomeSearchItems(items, '四中全会').map((item) => item.id)).toEqual([
      'article-remote-a'
    ]);
    expect(filterHomeSearchItems(items, 'future development').map((item) => item.id)).toEqual([
      'issue-issue-a'
    ]);
    expect(filterHomeSearchItems(items, '理论').map((item) => item.id)).toEqual([
      'article-remote-a'
    ]);
    expect(filterHomeSearchItems(items, '葛扬').map((item) => item.id)).toEqual([
      'column-column-a'
    ]);
    expect(filterHomeSearchItems(items, '求是').map((item) => item.id)).toEqual([
      'column-column-a',
      'account-account-a'
    ]);
  });

  it('normalizes case and surrounding whitespace', () => {
    expect(filterHomeSearchItems(buildItems(), '  planning ahead  ').map((item) => item.id)).toEqual([
      'issue-issue-a'
    ]);
  });

  it('preserves source order when applying maxResults', () => {
    expect(filterHomeSearchItems(buildItems(), 'a', 2).map((item) => item.id)).toEqual([
      'article-remote-a',
      'issue-issue-a'
    ]);
  });
});
