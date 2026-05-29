import { defineStore } from 'pinia';
import { magazineConfig } from '../config/magazineData';
import type { MagazineIssue, Article } from '../config/magazineData';

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
    }
  }
});
