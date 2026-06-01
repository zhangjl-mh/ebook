import { defineStore } from 'pinia';
import { magazineConfig } from '../config/magazineData';
import type { MagazineIssue, Article } from '../config/magazineData';

const DATA_ENDPOINTS = {
  recommend: 'https://m.qstheory.cn/ceshi/ds_ec431a5380564d039e9336ca7870baaf.json',
  news: 'https://m.qstheory.cn/ceshi/ds_a1258b018fb54be5822c4e9a83db3bcb.json',
  theory: 'https://m.qstheory.cn/ceshi/ds_2a95645a3adc4dab8aa81747207cc847.json'
} as const;

type ArticleTabKey = keyof typeof DATA_ENDPOINTS;

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
  subtitle?: string;
  quote?: string;
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

const requestJson = (url: string): Promise<RemoteCategoryPayload> =>
  new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      success: (res) => resolve((res.data || {}) as RemoteCategoryPayload),
      fail: reject
    });
  });

const stripHtml = (input = '') => input.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

const normalizeImageUrl = (publishDomain = 'https://www.qstheory.cn', imageUrl = '') => {
  if (!imageUrl) return FALLBACK_IMAGE;
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `${publishDomain.replace(/\/$/, '')}/${imageUrl.replace(/^(\.\.\/)+/, '')}`;
};

const buildSubtitle = (item: RemoteDataItem, categoryName = '') => {
  const source = item.sourceText?.trim();
  const author = item.author?.trim();
  if (source && author) return `${source} · ${author}`;
  if (source) return source;
  if (author) return `${categoryName} · ${author}`;
  return categoryName || '求是网';
};

const buildSummary = (item: RemoteDataItem, categoryName = '') => {
  const text = stripHtml(item.summary || item.content || '');
  if (text) return text;
  return `来源：${categoryName || '求是网'}，点击查看原文。`;
};

const mapRemoteArticles = (key: ArticleTabKey, payload: RemoteCategoryPayload): Article[] => {
  const categoryName = payload.categoryName || key;
  const list = payload.datasource || [];
  return list.map((item, index) => {
    const title = stripHtml(item.title || item.showTitle || '未命名文章');
    const linkUrl = item.publishUrl || item.linkUrls?.[0]?.linkUrl || '';
    const thumbnail = normalizeImageUrl(payload.publishDomain, item.titleImages?.[0]?.imageUrl || '');
    const publishDate = (item.publishTime || '').slice(0, 10) || '1970-01-01';
    const sourceText = item.sourceText?.trim() || payload.terminalName || '求是网';
    return {
      id: item.contentId || `${key}-${index}`,
      title,
      subtitle: buildSubtitle(item, categoryName),
      summary: buildSummary(item, categoryName),
      tags: [sourceText].filter(Boolean),
      thumbnail,
      publishDate,
      linkUrl
    };
  });
};

export const useMagazineStore = defineStore('magazineStore', {
  state: () => ({
    // 所有配置数据
    config: magazineConfig,
    // 当前选中的杂志期刊ID，默认第10期
    activeIssueId: 'issue-1731',
    // 当前激活的文章栏目类别，默认 'recommend'
    activeTab: 'recommend',
    // 搜索词
    searchQuery: '',
    // 用户订阅状态
    isSubscribed: false,
    // 远端文章加载状态
    isArticlesLoading: false,
  }),

  getters: {
    // 获取当前的杂志期刊详情
    currentIssue(state): MagazineIssue {
      return state.config.swiperIssues.find(item => item.id === state.activeIssueId) || state.config.swiperIssues[0];
    },
    // 所有杂志期刊列表
    issuesList(state): MagazineIssue[] {
      return state.config.swiperIssues;
    },
    // 当前激活 Tab 下的文章列表，支持搜索词过滤
    filteredArticles(state): Article[] {
      const allCategoryArticles = state.config.articles[state.activeTab] || [];
      if (!state.searchQuery.trim()) {
        return allCategoryArticles;
      }
      const query = state.searchQuery.toLowerCase();
      return allCategoryArticles.filter(
        article =>
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
  },

  actions: {
    // 切换期刊
    changeIssue(id: string) {
      this.activeIssueId = id;
    },
    // 切换文章分类 Tab
    setActiveTab(tabKey: string) {
      this.activeTab = tabKey;
    },
    // 设置搜索框内容
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    // 模拟订阅动作
    subscribe() {
      this.isSubscribed = true;
      uni.showToast({
        title: '订阅成功',
        icon: 'success',
        duration: 2000
      });
    },
    // 模拟进入目录
    enterCatalog(issue: MagazineIssue) {
      uni.showToast({
        title: `打开 ${issue.fullTitle} 目录`,
        icon: 'none'
      });
      // 纯前端环境可在H5模式下模拟跳转或者输出日志
      console.log('Navigate to catalog:', issue.catalogUrl);
    },
    // 模拟阅读原刊
    readOriginal(issue: MagazineIssue) {
      uni.showToast({
        title: `加载原刊中...`,
        icon: 'loading'
      });
      console.log('Read original paper:', issue.originalUrl);
    },
    // 拉取推荐/要闻/思想真实数据
    async fetchArticles() {
      this.isArticlesLoading = true;
      try {
        const [recommendRes, newsRes, theoryRes] = await Promise.all([
          requestJson(DATA_ENDPOINTS.recommend),
          requestJson(DATA_ENDPOINTS.news),
          requestJson(DATA_ENDPOINTS.theory)
        ]);
        this.config.articles.recommend = mapRemoteArticles('recommend', recommendRes);
        this.config.articles.news = mapRemoteArticles('news', newsRes);
        this.config.articles.theory = mapRemoteArticles('theory', theoryRes);
      } catch (error) {
        console.error('Fetch qstheory articles failed:', error);
        uni.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      } finally {
        this.isArticlesLoading = false;
      }
    }
  }
});
