import { MediaCategoryKey, MediaItemType, WeeklySectionKey } from '@/types/enums';
import type { MediaCategory, MediaItem, WeeklySection } from '@/types/pageData';

export const mediaCategories: MediaCategory[] = [
  { key: MediaCategoryKey.Ai, label: 'A智荟' },
  { key: MediaCategoryKey.Youth, label: '青年“悦读汇”' },
  { key: MediaCategoryKey.Weekly, label: '周览天下' },
  { key: MediaCategoryKey.Abroad, label: '国外思想理论' }
];

const videoDefaults = {
  type: MediaItemType.Video,
  source: '求是融媒',
  date: '2026-06-18',
  summary: '聚焦理论热点，以短视频形式进行权威、清晰的解读。',
  poster: '/subPages/static/media/video-poster.jpg',
  viewCount: 269,
  likeCount: 58,
  commentCount: 19,
  shareCount: 27
} as const;

const repeatedVideoTitle = '如何把握《习近平法治文选》（第一卷）的核心要点（下）';

const aiVideos: MediaItem[] = [
  {
    ...videoDefaults,
    id: 'ai-law',
    category: MediaCategoryKey.Ai,
    title: '人工智能，需要什么样的法？',
    summary: '围绕人工智能治理、技术向善和制度建设展开解读。',
    thumbnail: '/static/media/ai-law.jpg'
  },
  {
    ...videoDefaults,
    id: 'ai-governance',
    category: MediaCategoryKey.Ai,
    title: 'AI治理难，我们怎么办？',
    summary: '以通俗方式拆解人工智能治理中的关键问题。',
    thumbnail: '/static/media/ai-governance.jpg'
  },
  ...Array.from({ length: 6 }, (_, index): MediaItem => ({
    ...videoDefaults,
    id: `ai-reading-${index + 1}`,
    category: MediaCategoryKey.Ai,
    title: repeatedVideoTitle,
    summary: '围绕《习近平法治文选》第一卷的理论脉络和核心要点展开解读。',
    thumbnail: '/static/media/youth-reading.jpg'
  }))
];

const youthVideos: MediaItem[] = Array.from({ length: 5 }, (_, index): MediaItem => ({
  ...videoDefaults,
  id: `youth-reading-${index + 1}`,
  category: MediaCategoryKey.Youth,
  title: repeatedVideoTitle,
  source: '青年“悦读汇”',
  summary: '青年理论学习栏目，聚焦重点著作的阅读方法和核心要点。',
  thumbnail: '/static/media/youth-reading.jpg'
}));

const weeklyItems: MediaItem[] = Array.from({ length: 8 }, (_, index): MediaItem => ({
  id: `weekly-${index + 1}`,
  category: MediaCategoryKey.Weekly,
  type: MediaItemType.Article,
  title: '周览天下|5月31日-6月6日热点速览，一分钟读懂',
  source: '求是网',
  date: '2025-12-01',
  summary: '从重要活动、重要政策、财经动态和全球热点四个维度梳理一周大事。',
  thumbnail: '/static/media/weekly-banner.jpg'
}));

const abroadItems: MediaItem[] = [
  {
    id: 'abroad-resource-nationalism',
    title: '国外思想理论一瞥｜资源民族主义浪潮的兴起与发展',
    date: '06-05'
  },
  {
    id: 'abroad-tech-feudalism',
    title: '国外思想理论一瞥｜技术封建主义给当代资本主义带来的新变化',
    date: '05-19'
  },
  {
    id: 'abroad-ai-nationalism',
    title: '国外思想理论一瞥｜人工智能的发展与技术民族主义回潮',
    date: '05-08'
  },
  {
    id: 'abroad-algorithm-racism',
    title: '国外思想理论一瞥｜什么是算法种族主义',
    date: '04-17'
  },
  {
    id: 'abroad-surveillance-capitalism',
    title: '国外思想理论一瞥｜什么是监控资本主义',
    date: '04-04'
  }
].map((item): MediaItem => ({
  ...item,
  category: MediaCategoryKey.Abroad,
  type: MediaItemType.Article,
  source: '求是网',
  summary: '聚焦国外思想理论前沿，观察国际政治经济和科技发展中的新思潮、新变化。',
  thumbnail: ''
}));

export const mediaItems: MediaItem[] = [
  ...aiVideos,
  ...youthVideos,
  ...weeklyItems,
  ...abroadItems
];

export const weeklySections: WeeklySection[] = [
  {
    key: WeeklySectionKey.Activities,
    label: '重要活动',
    paragraphs: [
      '在“六一”国际儿童节即将到来之际，中共中央总书记、国家主席、中央军委主席习近平在给中共一大纪念馆、南湖革命纪念馆少先队红领巾讲解员回信中强调，今年是中国共产党成立105周年，党的事业需要一代又一代人接续奋斗。希望你们高举队旗跟党走，传承红色基因，增长知识本领，磨练意志品质，做党和人民的红孩子，在新征程上跑好历史接力赛。',
      '6月5日，中共中央总书记、国家主席习近平在人民大会堂同来华进行国事访问的老挝人民革命党中央总书记、国家主席通伦举行会谈。习近平主席指出，中方始终将老挝视作周边外交重要方向，愿同老方弘扬传统友谊，深化互利合作，推动中老关系实现新的跃升。',
      '应朝鲜劳动党总书记、朝鲜民主主义人民共和国国务委员长金正恩邀请，中共中央总书记、中华人民共和国主席习近平将于6月8日至9日对朝鲜民主主义人民共和国进行国事访问。'
    ]
  },
  {
    key: WeeklySectionKey.Policies,
    label: '重要政策',
    paragraphs: [
      '日前，国务院印发《加快农业农村现代化“十五五”规划》，明确了“十五五”时期加快农业农村现代化的思路目标、重点任务和政策措施。',
      '6月5日，国务院常务会议召开，审议通过《实施就业优先战略“十五五”规划》、《退役军人就业创业促进条例（草案）》。会议指出，就业是民生之本，要持续用力推动就业扩容提质。',
      '《国务院关于对外投资的规定》日前公布，自2026年7月1日起施行，旨在推进高水平对外开放，促进对外投资高质量发展。',
      '住房公积金拟扩大使用范围。住房城乡建设部就《住房公积金管理条例（修订征求意见稿）》向社会公开征求意见。',
      '民政部等27部门近日印发通知，要求进一步加强流动儿童和留守儿童“精准摸排、精确建档、精细服务”工作。'
    ]
  },
  {
    key: WeeklySectionKey.Finance,
    label: '财经动态',
    paragraphs: [
      '2025年A股上市公司年报披露，超5500家企业共实现总营收约73万亿元、净利润5.4万亿元，上市公司业绩向好态势进一步巩固。',
      '2025年我国多式联运发展保持稳步增长态势，全年集装箱多式联运量同比增长超过15%。',
      '5月份中国制造业采购经理指数（PMI）为50%，制造业运行整体稳定，高技术制造业PMI为52.9%。',
      '财政部近期下达2026年育儿补贴补助资金999亿元，以支持各地为符合条件的婴幼儿发放育儿补贴。',
      '《科技期刊世界影响力指数（WJCI）报告》2025版显示，学科排名位列全球前5%的中国科技期刊达76种。',
      '2025年国内居民出游人次65.22亿，国内居民出游花费6.30万亿元，入境游客同比增长17.1%。',
      '欧洲央行报告显示，黄金在全球官方储备资产总额中的占比升至27%，超越美国国债。',
      '国际油价5日下跌，纽约商品交易所轻质原油期货和伦敦布伦特原油期货价格均出现回落。',
      '纽约股市三大股指5日大幅下跌，道琼斯、标准普尔500和纳斯达克综合指数均收跌。',
      '6月5日截至收盘，A股三大指数为：上证指数4027.74、深证成指15314.70、创业板指3957.94。'
    ]
  },
  {
    key: WeeklySectionKey.Global,
    label: '全球热点',
    paragraphs: [
      '联合国大会3日选举奥地利、吉尔吉斯斯坦、葡萄牙、特立尼达和多巴哥、津巴布韦为安理会非常任理事国。',
      '美伊谈判再添新变数。在接近达成协议的关键节点，以色列升级对黎巴嫩打击，引发美伊强烈不满。',
      '世界卫生组织与非洲疾病预防控制中心共同宣布，启动5.18亿美元埃博拉疫情防控计划。'
    ]
  }
];
