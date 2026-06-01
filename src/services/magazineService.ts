import { requestJson } from '@/services/request';
import { stripHtml } from '@/utils/text';
import type { Article, ArticleTabKey } from '@/types/magazine';

const DATA_ENDPOINTS: Record<ArticleTabKey, string> = {
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

const FALLBACK_IMAGE = 'https://picsum.photos/300/200';
const DEFAULT_SOURCE = '求是网';
const DEFAULT_DOMAIN = 'https://www.qstheory.cn';

const normalizeImageUrl = (publishDomain = DEFAULT_DOMAIN, imageUrl = '') => {
  if (!imageUrl) return FALLBACK_IMAGE;
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;

  const domain = publishDomain.replace(/\/$/, '');
  const path = imageUrl.replace(/^(\.\.\/)+/, '').replace(/^\/+/, '');
  return `${domain}/${path}`;
};

const buildSubtitle = (item: RemoteDataItem, categoryName = '') => {
  const source = item.sourceText?.trim();
  const author = item.author?.trim();

  if (source && author) return `${source} | ${author}`;
  if (source) return source;
  if (author) return `${categoryName || DEFAULT_SOURCE} | ${author}`;

  return categoryName || DEFAULT_SOURCE;
};

const buildSummary = (item: RemoteDataItem, categoryName = '') => {
  const text = stripHtml(item.summary || item.content || '');
  return text || `来源：${categoryName || DEFAULT_SOURCE}，点击查看原文。`;
};

const mapRemoteArticles = (key: ArticleTabKey, payload: RemoteCategoryPayload): Article[] => {
  const categoryName = payload.categoryName || key;

  return (payload.datasource || []).map((item, index) => ({
    id: item.contentId || `${key}-${index}`,
    title: stripHtml(item.title || item.showTitle || '未命名文章'),
    subtitle: buildSubtitle(item, categoryName),
    summary: buildSummary(item, categoryName),
    tags: [item.sourceText?.trim() || payload.terminalName || DEFAULT_SOURCE],
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
    theory: mapRemoteArticles('theory', theory)
  };
};
