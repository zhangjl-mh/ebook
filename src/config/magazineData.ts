// 《求是》数字刊静态数据配置
export interface Article {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  tags: string[];
  thumbnail: string;
  publishDate: string;
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
    recommend: [
      {
        id: 'art-1',
        title: '坚持以高质量发展推进中国式现代化',
        subtitle: '《求是》2026年第10期 · 本期推荐',
        summary: '高质量发展是全面建设社会主义现代化国家的首要任务。必须完整、准确、全面贯彻新发展理念，坚持社会主义市场经济改革方向，坚持高水平对外开放，加快构建以国内大循环为主体、国内国际双循环相互促进的新发展格局。',
        tags: ['中国式现代化', '高质量发展'],
        thumbnail: 'https://picsum.photos/id/10/300/200', // 占位，使用优质科技新城图片效果
        publishDate: '2026-05-15'
      },
      {
        id: 'art-2',
        title: '把党的伟大自我革命进行到底',
        subtitle: '《求是》2026年第10期 · 本期推荐',
        summary: '勇于自我革命是党百年奋斗培育的鲜明品格，也是党发展壮大、长盛不衰的重要法宝。在新时代征程上，必须时刻保持解决大党独有难题的清醒和坚定，确保党在历史洪流中始终立于不败之地。',
        tags: ['自我革命', '全面从严治党'],
        thumbnail: 'https://picsum.photos/id/12/300/200',
        publishDate: '2026-05-15'
      }
    ],
    news: [
      {
        id: 'art-3',
        title: '在新的起点上继续推动文化繁荣、建设文化强国',
        subtitle: '《求是》2026年第10期 · 重要新闻',
        summary: '中华文明源远流长，博大精深。在新的历史起点上，我们要深入学习贯彻习近平文化思想，坚定文化自信，秉持开放包容，坚持守正创新，为建设中华民族现代文明不懈奋斗。',
        tags: ['文化强国', '文化自信'],
        thumbnail: 'https://picsum.photos/id/15/300/200',
        publishDate: '2026-05-15'
      },
      {
        id: 'art-4',
        title: '奋力谱写中国式现代化生态新篇章',
        subtitle: '《求是》2026年第10期 · 要闻回顾',
        summary: '生态兴则文明兴，生态衰则文明衰。必须牢固树立和践行绿水青山就是金山银山的理念，站在人与自然和谐共生的高度谋划发展，加快转变发展方式，实现绿色低碳循环发展。',
        tags: ['绿色发展', '美丽中国'],
        thumbnail: 'https://picsum.photos/id/28/300/200',
        publishDate: '2026-05-15'
      }
    ],
    theory: [
      {
        id: 'art-5',
        title: '论发展新质生产力的理论逻辑与实践路径',
        subtitle: '《求是》2026年第10期 · 理论思想',
        summary: '新质生产力是创新起主导作用，具有高科技、高效能、高质量特征，符合新发展理念的先进生产力质态。我们要准确把握新质生产力的丰富内涵与科学实质，以科技创新推动产业创新，全面培育发展新动能。',
        tags: ['新质生产力', '科技创新'],
        thumbnail: 'https://picsum.photos/id/48/300/200',
        publishDate: '2026-05-15'
      },
      {
        id: 'art-6',
        title: '深刻把握马克思主义中国化时代化的历史规律',
        subtitle: '《求是》2026年第10期 · 思想纵横',
        summary: '马克思主义是我们立党立国、兴党兴国的根本指导思想。实践告诉我们，中国共产党为什么能，中国特色社会主义为什么好，归根到底是马克思主义行，是中国化时代化的马克思主义行。',
        tags: ['马克思主义', '理论创新'],
        thumbnail: 'https://picsum.photos/id/60/300/200',
        publishDate: '2026-05-15'
      }
    ]
  }
};
