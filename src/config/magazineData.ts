import { ArticleTabKey } from '@/types/enums';
import type { MagazineConfig } from '@/types/magazine';

export const magazineConfig: MagazineConfig = {
  headerLogo: '/static/brand/header_logo_white.png',
  headerBackground: '/static/brand/magazine_top_bg.png',
  swiperIssues: [
    {
      id: 'issue-10',
      year: '2026',
      issueNum: '10',
      fullTitle: '2026年第10期',
      articleCount: 12,
      recommendationTitle: '习近平：构建高水平社会主义市场经济体制',
      coverImage: '/static/brand/ebook_issue_10.jpg',
      originalUrl: 'https://ebook.qstheory.cn/elecPublish/content?id=43073&form=bookshelfdetai&shelfId=1731&openMode=0'
    },
    {
      id: 'issue-09',
      year: '2026',
      issueNum: '09',
      fullTitle: '2026年第09期',
      articleCount: 14,
      recommendationTitle: '习近平：在省部级主要领导干部学习贯彻党的二十届四中全会精神专题研讨班上的讲话',
      coverImage: '/static/brand/ebook_issue_09.jpg',
      originalUrl: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1731&openMode=0&curAdr=1'
    },
    {
      id: 'issue-08',
      year: '2026',
      issueNum: '08',
      fullTitle: '2026年第08期',
      articleCount: 11,
      recommendationTitle: '习近平：推动全民阅读，建设书香社会',
      coverImage: '/static/brand/ebook_issue_08.jpg',
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
    { key: ArticleTabKey.Recommend, name: '精选' },
    { key: ArticleTabKey.News, name: '专栏' },
    { key: ArticleTabKey.Theory, name: '求是号' },
    { key: ArticleTabKey.Enterprise, name: '企业定制' }
  ],
  articles: {
    [ArticleTabKey.Recommend]: [
      {
        id: 'home-recommend-1',
        title: '前瞻布局和发展未来产业',
        subtitle: '总结近年来我国未来产业发展情况，分析世界未来产业发展趋势',
        summary: '总结近年来我国未来产业发展情况，分析世界未来产业发展趋势。',
        tags: ['《求是》2025/23'],
        thumbnail: '/static/home/article-thumb.png',
        publishDate: '2026-06-18',
        linkUrl: ''
      },
      {
        id: 'home-recommend-2',
        title: '《QIUSHI》最新一期解读',
        subtitle: '权威解读最新一期重点文章',
        summary: '权威解读最新一期重点文章。',
        tags: ['QIUSHI'],
        thumbnail: '/static/home/article-thumb-2.png',
        publishDate: '2026-06-18',
        linkUrl: ''
      },
      {
        id: 'home-recommend-3',
        title: '华为“韬定律”揭示了什么？',
        subtitle: '从企业实践理解高质量发展方法论',
        summary: '从企业实践理解高质量发展方法论。',
        tags: ['红旗文稿'],
        thumbnail: '/static/home/article-thumb-3.png',
        publishDate: '2026-06-18',
        linkUrl: ''
      }
    ],
    [ArticleTabKey.News]: [
      {
        id: 'home-column-1',
        title: '新时代人文经济学的丰富内涵和理论贡献',
        subtitle: '作者：葛 扬',
        summary: '来源：《求是》2025/23，时间：2025-12-01。',
        tags: ['专栏'],
        thumbnail: '',
        publishDate: '2025-12-01',
        linkUrl: ''
      },
      {
        id: 'home-column-2',
        title: '经济治理理论的创新和突破',
        subtitle: '学习习近平经济思想的经济治理理论',
        summary: '来源：《求是》2025/23，时间：2025-12-01。',
        tags: ['专栏'],
        thumbnail: '',
        publishDate: '2025-12-01',
        linkUrl: ''
      }
    ],
    [ArticleTabKey.Theory]: [
      {
        id: 'home-account-1',
        title: '华为“韬定律”揭示了什么',
        subtitle: '作者：苏慧',
        summary: '企业观察与理论学习内容。',
        tags: ['订阅'],
        thumbnail: '/static/home/account-logo.png',
        publishDate: '2026-06-18',
        linkUrl: ''
      },
      {
        id: 'home-account-2',
        title: '前线：华为“韬定律”揭示了什么',
        subtitle: '作者：清华大学教育机构',
        summary: '求是号精选内容。',
        tags: ['订阅'],
        thumbnail: '/static/home/account-logo.png',
        publishDate: '2026-06-18',
        linkUrl: ''
      }
    ],
    [ArticleTabKey.Enterprise]: [
      {
        id: 'home-enterprise-1',
        title: '学习知识库',
        subtitle: '独家资料包、案例库、行业研究报告',
        summary: '为企业学习场景提供专题知识服务。',
        tags: ['企业定制'],
        thumbnail: '/static/home/account-logo.png',
        publishDate: '2026-06-18',
        linkUrl: ''
      }
    ]
  }
};
