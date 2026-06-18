export interface HomeBanner {
  id: string;
  image: string;
}

export interface HomeIssueCard {
  id: string;
  title: string;
  cover: string;
  titleImage: string;
}

export interface HomeIssueArticle {
  id: string;
  issueId: string;
  title: string;
  summary: string;
  date: string;
  thumbnail: string;
}

export interface HomeQuickAction {
  id: string;
  label: string;
  target: 'paper' | 'digital' | 'archive';
}

export interface HomeColumnArticle {
  id: string;
  title: string;
  author: string;
  source: string;
  date: string;
}

export interface HomeMessage {
  id: string;
  user: string;
  time: string;
  content: string;
}

export interface HomeAccountItem {
  id: string;
  accountName: string;
  author: string;
  title: string;
  avatar: string;
}

export interface HomeFilterPill {
  id: string;
  label: string;
}

export const homeBanners: HomeBanner[] = [
  { id: 'theory-frontier', image: '/static/home/banner-1.png' },
  { id: 'world-class-enterprise', image: '/static/home/banner-2.png' },
  { id: 'digital-reading', image: '/static/home/banner-3.png' },
  { id: 'red-flag', image: '/static/home/banner-4.png' }
];

export const homeIssueCards: HomeIssueCard[] = [
  {
    id: 'qiushi',
    title: '求是',
    cover: '/static/home/issue-qiushi.png',
    titleImage: '/static/home/issue-qiushi-title.png'
  },
  {
    id: 'qiushi-en',
    title: 'QIUSHI',
    cover: '/static/home/issue-qiushi-en.png',
    titleImage: '/static/home/issue-qiushi-en-title.png'
  },
  {
    id: 'hongqi',
    title: '红旗文稿',
    cover: '/static/home/issue-hongqi.png',
    titleImage: '/static/home/issue-hongqi-title.png'
  }
];

export const homeIssueArticles: Record<string, HomeIssueArticle[]> = {
  qiushi: [
    {
      id: 'qiushi-article-future-industry',
      issueId: 'qiushi',
      title: '前瞻布局和发展未来产业',
      summary: '总结近年来我国未来产业发展情况，分析世界未来产业发展趋势。',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb.png'
    },
    {
      id: 'qiushi-article-latest',
      issueId: 'qiushi',
      title: '《QIUSHI》最新一期解读',
      summary: '',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb-2.png'
    },
    {
      id: 'qiushi-article-huawei',
      issueId: 'qiushi',
      title: '华为“韬定律”揭示了什么？',
      summary: '',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb-3.png'
    }
  ],
  'qiushi-en': [
    {
      id: 'qiushi-en-article-governance',
      issueId: 'qiushi-en',
      title: 'Planning Ahead for Emerging Industries',
      summary: 'A review of China’s progress in emerging industries and the major trends shaping their future development.',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb.png'
    },
    {
      id: 'qiushi-en-article-new-issue',
      issueId: 'qiushi-en',
      title: 'Highlights from the Latest Issue of QIUSHI',
      summary: 'Key ideas and major articles from the newest English-language issue.',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb-2.png'
    },
    {
      id: 'qiushi-en-article-practice',
      issueId: 'qiushi-en',
      title: 'What Can We Learn from Huawei’s Approach?',
      summary: 'Insights into innovation, long-term strategy, and high-quality development through business practice.',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb-3.png'
    }
  ],
  hongqi: [
    {
      id: 'hongqi-article-culture',
      issueId: 'hongqi',
      title: '把文化自信融入中国式现代化实践',
      summary: '围绕文化建设和基层实践展开专题解读。',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb.png'
    },
    {
      id: 'hongqi-article-theory',
      issueId: 'hongqi',
      title: '《红旗文稿》最新一期导读',
      summary: '',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb-2.png'
    },
    {
      id: 'hongqi-article-enterprise',
      issueId: 'hongqi',
      title: '高质量发展中的企业创新样本',
      summary: '',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb-3.png'
    }
  ]
};

export const homeQuickActions: HomeQuickAction[] = [
  { id: 'paper', label: '购买纸刊', target: 'paper' },
  { id: 'digital', label: '查看数字刊', target: 'digital' },
  { id: 'archive', label: '往期书刊', target: 'archive' }
];

export const homeColumnArticles: HomeColumnArticle[] = [
  {
    id: 'column-human-economics',
    title: '新时代人文经济学的丰富内涵和理论贡献',
    author: '葛 扬',
    source: '《求是》2025/23',
    date: '2025-12-01'
  },
  {
    id: 'column-governance',
    title: '经济治理理论的创新和突破——学习习近平经济思想的经济治理理论',
    author: '葛 扬',
    source: '《求是》2025/23',
    date: '2025-12-01'
  },
  {
    id: 'column-future-industry',
    title: '以科技创新引领现代化产业体系建设',
    author: '求是网评论员',
    source: '《求是》2026/10',
    date: '2026-06-15'
  },
  {
    id: 'column-governance-2',
    title: '经济治理理论的创新和突破——学习习近平经济思想的经济治理理论',
    author: '葛 扬',
    source: '《求是》2025/23',
    date: '2025-12-01'
  },
  {
    id: 'column-human-economics-2',
    title: '新时代人文经济学的丰富内涵和理论贡献',
    author: '葛 扬',
    source: '《求是》2025/23',
    date: '2025-12-01'
  }
];

export const homeMessages: HomeMessage[] = [
  {
    id: 'message-1',
    user: '150****6902',
    time: '2026-06-03 23:05:41',
    content: '看完文章后深受启发，学好政绩观，关键还是要把调查研究、群众评价和长期成效结合起来。'
  },
  {
    id: 'message-2',
    user: '188****1026',
    time: '2026-06-02 18:22:09',
    content: '数字刊阅读体验很适合集中学习，希望后续可以继续增加专题导读和收藏整理能力。'
  }
];

export const homeAccountItems: HomeAccountItem[] = [
  {
    id: 'account-qiushi',
    accountName: '求是',
    author: '苏慧',
    title: '华为“韬定律”揭示了什么',
    avatar: '/static/home/article-thumb.png'
  },
  {
    id: 'account-qianxian',
    accountName: '前线',
    author: '清华大学教育机构',
    title: '从企业实践理解高质量发展的方法论',
    avatar: '/static/home/article-thumb.png'
  },
  {
    id: 'account-yangmei',
    accountName: '央媒专栏',
    author: '人民日报理论部',
    title: '把学习成果转化为推动工作的实际成效',
    avatar: '/static/home/article-thumb.png'
  },
  {
    id: 'account-qianxian-2',
    accountName: '前线',
    author: '清华大学教育机构',
    title: '华为“韬定律”揭示了什么',
    avatar: '/static/home/article-thumb-2.png'
  },
  {
    id: 'account-practice',
    accountName: '实践',
    author: '苏慧',
    title: '华为“韬定律”揭示了什么',
    avatar: '/static/home/article-thumb-3.png'
  },
  {
    id: 'account-haixia',
    accountName: '海峡通讯',
    author: '苏慧',
    title: '华为“韬定律”揭示了什么',
    avatar: '/static/home/article-thumb.png'
  }
];

export const homeColumnFilters: HomeFilterPill[] = [
  { id: 'theory-system', label: '体系化学理化' },
  { id: 'deep-research', label: '深度调研' },
  { id: 'culture-china', label: '文化中国' },
  { id: 'frontier', label: '前沿观察' }
];

export const homeEnterpriseFilters: HomeFilterPill[] = [
  { id: 'knowledge', label: '学习知识库' },
  { id: 'package', label: '独家资料包' },
  { id: 'case', label: '案例库' },
  { id: 'report', label: '行业研究报告' }
];
