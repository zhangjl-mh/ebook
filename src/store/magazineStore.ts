import { defineStore } from 'pinia';
import { magazineConfig } from '@/config/magazineData';
import { fetchMagazineArticles } from '@/services/magazineService';
import type { Article, ArticleTabKey, MagazineConfig, MagazineIssue } from '@/types/magazine';

interface MagazineState {
  config: MagazineConfig;
  activeIssueId: string;
  activeTab: ArticleTabKey;
  searchQuery: string;
  isSubscribed: boolean;
  isArticlesLoading: boolean;
  errorMessage: string;
}

const createMagazineConfig = (): MagazineConfig => ({
  ...magazineConfig,
  subscription: { ...magazineConfig.subscription },
  swiperIssues: magazineConfig.swiperIssues.map((issue) => ({ ...issue })),
  tabCategories: magazineConfig.tabCategories.map((tab) => ({ ...tab })),
  articles: {
    recommend: [...magazineConfig.articles.recommend],
    news: [...magazineConfig.articles.news],
    theory: [...magazineConfig.articles.theory]
  }
});
export const useMagazineStore = defineStore('magazineStore', {
  state: (): MagazineState => ({
    config: createMagazineConfig(),
    activeIssueId: 'issue-10',
    activeTab: 'recommend',
    searchQuery: '',
    isSubscribed: false,
    isArticlesLoading: false,
    errorMessage: ''
  }),

  getters: {
    currentIssue(state): MagazineIssue {
      return state.config.swiperIssues.find((item) => item.id === state.activeIssueId) || state.config.swiperIssues[0];
    },
    issuesList(state): MagazineIssue[] {
      return state.config.swiperIssues;
    },
    filteredArticles(state): Article[] {
      const articles = state.config.articles[state.activeTab];
      const query = state.searchQuery.trim().toLowerCase();

      if (!query) return articles;

      return articles.filter((article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
  },

  actions: {
    changeIssue(id: string) {
      this.activeIssueId = id;
    },
    setActiveTab(tabKey: ArticleTabKey) {
      this.activeTab = tabKey;
    },
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    subscribe() {
      if (this.isSubscribed) {
        uni.showToast({ title: '已订阅', icon: 'none' });
        return;
      }

      this.isSubscribed = true;
      uni.showToast({
        title: '订阅成功',
        icon: 'success',
        duration: 2000
      });
    },
    openWebview(url: string, title: string) {
      if (!url) {
        uni.showToast({ title: '链接不可用', icon: 'none' });
        return;
      }

      uni.navigateTo({
        url: `/subPages/webview/index?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      });
    },
    enterCatalog(issue: MagazineIssue) {
      this.openWebview(issue.catalogUrl, `${issue.fullTitle} 目录`);
    },
    readOriginal(issue: MagazineIssue) {
      uni.navigateTo({
        url: `/subPages/book/index?title = ${encodeURIComponent(issue.fullTitle)}`
      })
    },
    async fetchArticles() {
      if (this.isArticlesLoading) return;

      this.isArticlesLoading = true;
      this.errorMessage = '';

      try {
        this.config.articles = await fetchMagazineArticles();
      } catch (error) {
        this.errorMessage = '数据加载失败';
        console.error('Fetch qstheory articles failed:', error);
        uni.showToast({ title: this.errorMessage, icon: 'none' });
      } finally {
        this.isArticlesLoading = false;
      }
    }
  }
});
