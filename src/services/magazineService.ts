import { requestJson } from '@/services/request';
import { stripHtml } from '@/utils/text';
import type { Article, ArticleTabKey } from '@/types/magazine';

type RemoteArticleTabKey = Exclude<ArticleTabKey, 'enterprise'>;

const DATA_ENDPOINTS: Record<RemoteArticleTabKey, string> = {
  recommend: 'https://m.qstheory.cn/ceshi/ds_ec431a5380564d039e9336ca7870baaf.json',
  news: 'https://m.qstheory.cn/ceshi/ds_a1258b018fb54be5822c4e9a83db3bcb.json',
  theory: 'https://m.qstheory.cn/ceshi/ds_2a95645a3adc4dab8aa81747207cc847.json'
};

interface RemoteDataItem {
  contentId?: string;
  title?: string;
  showTitle?: string;
  summary?: string;
  content?: string;
  publishTime?: string;
  publishUrl?: string;
  sourceText?: string;
  author?: string;
  titleImages?: Array<{ imageUrl?: string }>;
  linkUrls?: Array<{ linkUrl?: string }>;
}

interface RemoteCategoryPayload {
  categoryName?: string;
  terminalName?: string;
  publishDomain?: string;
  datasource?: RemoteDataItem[];
}

const DEFAULT_SOURCE = '求是网';
const DEFAULT_DOMAIN = 'https://www.qstheory.cn';

const normalizeImageUrl = (publishDomain = DEFAULT_DOMAIN, imageUrl = '') => {
  const source = imageUrl.trim();
  if (!source) return '';
  if (/^https:\/\//i.test(source)) return encodeURI(source);
  if (/^http:\/\//i.test(source)) return encodeURI(source.replace(/^http:\/\//i, 'https://'));

  const domain = publishDomain.trim().replace(/^http:\/\//i, 'https://').replace(/\/+$/, '') || DEFAULT_DOMAIN;
  const path = source.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
  return encodeURI(`${domain}/${path}`);
};

const buildSummary = (item: RemoteDataItem, categoryName = '') => {
  const text = stripHtml(item.summary || item.content || '');
  return text || `来源：${categoryName || DEFAULT_SOURCE}，点击查看原文。`;
};

const normalizeSourceTag = (sourceText = '', fallback = DEFAULT_SOURCE) => {
  const text = sourceText.trim() || fallback;
  return text.replace(/(》)(\d)/, '$1 $2');
};

const mapRemoteArticles = (key: ArticleTabKey, payload: RemoteCategoryPayload): Article[] => {
  const categoryName = payload.categoryName || key;

  return (payload.datasource || []).map((item, index) => ({
    id: item.contentId || `${key}-${index}`,
    title: stripHtml(item.title || item.showTitle || '未命名文章'),
    subtitle: item.author || '',
    summary: buildSummary(item, categoryName),
    tags: [normalizeSourceTag(item.sourceText, payload.terminalName)],
    thumbnail: normalizeImageUrl(payload.publishDomain, item.titleImages?.[0]?.imageUrl || ''),
    publishDate: (item.publishTime || '').slice(0, 10) || '1970-01-01',
    linkUrl: item.publishUrl || item.linkUrls?.[0]?.linkUrl || ''
  }));
};

export const fetchMagazineArticles = async (): Promise<Record<ArticleTabKey, Article[]>> => {
  const [recommend, news, theory] = await Promise.all([
    requestJson<RemoteCategoryPayload>(DATA_ENDPOINTS.recommend),
    requestJson<RemoteCategoryPayload>(DATA_ENDPOINTS.news),
    requestJson<RemoteCategoryPayload>(DATA_ENDPOINTS.theory)
  ]);

  return {
    recommend: mapRemoteArticles('recommend', recommend),
    news: mapRemoteArticles('news', news),
    theory: mapRemoteArticles('theory', theory),
    enterprise: []
  };
};
