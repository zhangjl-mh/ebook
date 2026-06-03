import type { MagazineConfig } from '@/types/magazine';

export const magazineConfig: MagazineConfig = {
  headerLogo: '/static/brand/header_logo_white.png',
  headerBackground: '/static/brand/header_bg.jpg',
  swiperIssues: [
    {
      id: 'issue-10',
      year: '2026',
      issueNum: '10',
      fullTitle: '2026年第10期',
      articleCount: 12,
      recommendationTitle: '习近平：构建高水平社会主义市场经济体制',
      coverImage: 'https://img2.founderfx.cn/TQMS/ebook/202605/28/5701514591b94ddf8d3d13726a5a25dd/1.jpg',
      originalUrl: 'https://ebook.qstheory.cn/elecPublish/content?id=43073&form=bookshelfdetai&shelfId=1731&openMode=0'
    },
    {
      id: 'issue-09',
      year: '2026',
      issueNum: '09',
      fullTitle: '2026年第09期',
      articleCount: 14,
      recommendationTitle: '习近平：在省部级主要领导干部学习贯彻党的二十届四中全会精神专题研讨班上的讲话',
      coverImage: 'https://img2.founderfx.cn/TQMS/ebook/202605/13/35990c9923384895a08985afb3747f7c/1.jpg',
      originalUrl: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1731&openMode=0&curAdr=1'
    },
    {
      id: 'issue-08',
      year: '2026',
      issueNum: '08',
      fullTitle: '2026年第08期',
      articleCount: 11,
      recommendationTitle: '习近平：推动全民阅读，建设书香社会',
      coverImage: 'https://img2.founderfx.cn/TQMS/ebook/202605/13/35990c9923384895a08985afb3747f7c/1.jpg',
      originalUrl: 'https://ebook.qstheory.cn/elecPublish/content?id=42431&form=bookshelfdetai&shelfId=1731&openMode=0'
    }
  ],
  subscription: {
    title: '订阅《求是》数字刊',
    description: '第一时间获取最新期刊内容，支持按期阅读、专题学习和文章收藏',
    bellIcon: '/static/brand/subscribe_icon.png',
    btnText: '立即订阅'
  },
  tabCategories: [
    { key: 'recommend', name: '推荐' },
    { key: 'news', name: '要闻' },
    { key: 'theory', name: '思想' }
  ],
  articles: {
    recommend: [],
    news: [],
    theory: []
  }
};
