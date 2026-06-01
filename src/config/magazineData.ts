// 《求是》数字刊静态数据配置
export interface Article {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  thumbnail: string;
  publishDate: string;
  linkUrl: string;
}

export interface MagazineIssue {
  id: string;
  year: string;
  issueNum: string; // 例如: "10"
  fullTitle: string; // 例如: "2026年第10期"
  articleCount: number;
  recommendationTitle: string;
  coverImage: string;
  catalogUrl: string;
  originalUrl: string;
}

export interface ConfigData {
  headerLogo: string;
  headerTitle: string;
  swiperIssues: MagazineIssue[];
  subscription: {
    title: string;
    description: string;
    bellIcon: string;
    btnText: string;
  };
  tabCategories: { key: string; name: string }[];
  articles: Record<string, Article[]>;
}

export const magazineConfig: ConfigData = {
  headerLogo: 'https://www.qstheory.cn/qs/images/index_logo.png',
  headerTitle: '求是数字刊',
  swiperIssues: [
    {
      id: 'issue-1731',
      year: '2026',
      issueNum: '10',
      fullTitle: '2026年第10期',
      articleCount: 12,
      recommendationTitle: '深入学习贯彻习近平新时代中国特色社会主义思想',
      coverImage: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1731&openMode=0&curAdr=1', // 示意，实际通过CSS或存本地占位，也可以渲染红白求是典型封皮
      catalogUrl: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1731&openMode=0&curAdr=1',
      originalUrl: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1731&openMode=0&curAdr=1'
    },
    {
      id: 'issue-1730',
      year: '2026',
      issueNum: '09',
      fullTitle: '2026年第09期',
      articleCount: 14,
      recommendationTitle: '全面推进乡村振兴 奋力谱写农业强国新篇章',
      coverImage: '',
      catalogUrl: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1730',
      originalUrl: ''
    },
    {
      id: 'issue-1729',
      year: '2026',
      issueNum: '08',
      fullTitle: '2026年第08期',
      articleCount: 11,
      recommendationTitle: '坚持以高水平安全保障高质量发展',
      coverImage: '',
      catalogUrl: 'https://ebook.qstheory.cn/elecPublish/bookshelfdetail?id=1729',
      originalUrl: ''
    }
  ],
  subscription: {
    title: '订阅《求是》数字刊',
    description: '第一时间获取最新期刊内容，支持按期阅读、专题学习和文章收藏',
    bellIcon: 'https://img.icons8.com/isometric/100/null/bell.png', // 3D金铃铛拟真图标
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
