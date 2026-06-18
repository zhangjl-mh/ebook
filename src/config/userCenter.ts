import type {
  MemberBanner,
  ProfileContentAction,
  ProfileFeatureConfig,
  ProfileInfo
} from '@/types/pageData';
import { ProfileBadgeType, ProfileFeatureType } from '@/types/enums';

export const profileInfo: ProfileInfo = {
  name: 'hhhhhhhhui',
  badges: [
    { text: '以书为舟，漫游山海', type: ProfileBadgeType.Gray },
    { text: '求是数字刊年度会员', type: ProfileBadgeType.Red }
  ]
};

export const memberBanner: MemberBanner = {
  title: '求是数字刊会员',
  desc: '畅读权威内容，领略思想之光',
  buttonText: '会员中心'
};

export const profileContentActions: ProfileContentAction[] = [
  { type: ProfileFeatureType.Purchased, label: '已购', icon: 'cart' },
  { type: ProfileFeatureType.History, label: '浏览记录', icon: 'time' },
  { type: ProfileFeatureType.Favorite, label: '收藏', icon: 'star' },
  { type: ProfileFeatureType.Subscribe, label: '订阅', icon: 'plus' },
  { type: ProfileFeatureType.Download, label: '下载记录', icon: 'download' },
  { type: ProfileFeatureType.Notes, label: '笔记', icon: 'compose' },
  { type: ProfileFeatureType.StudyData, label: '学习数据', icon: 'map' },
  { type: ProfileFeatureType.Invoice, label: '发票', icon: 'paperclip' }
];

export const profileFeatureConfigs: Record<string, ProfileFeatureConfig> = {
  [ProfileFeatureType.Purchased]: {
    type: ProfileFeatureType.Purchased,
    title: '已购',
    description: '已购买的数字刊内容',
    items: [
      {
        id: 'purchased-month',
        title: '《求是》数字刊',
        subtitle: '第一时间获取最新期刊内容，支持视频学习、收藏笔记、语音伴读和理论专题知识库。',
        meta: '2026年第10期',
        tag: '数字订阅',
        thumbnail: '/static/home/issue-qiushi.png'
      },
      {
        id: 'purchased-year',
        title: '《求是》数字刊',
        subtitle: '全年数字订阅权益，覆盖 2026 年 24 期。',
        meta: '2026全年24期',
        tag: '数字订阅',
        thumbnail: '/static/home/issue-qiushi.png'
      }
    ]
  },
  [ProfileFeatureType.History]: {
    type: ProfileFeatureType.History,
    title: '收藏/浏览记录',
    description: '最近阅读过的内容',
    items: [
      { id: 'history-1', title: '前瞻布局和发展未来产业 / 习近平', subtitle: '12:38', meta: '2026年第11期《求是》' },
      { id: 'history-2', title: '前瞻布局和发展未来产业 / 习近平', subtitle: '12:38', meta: '2026年第11期《求是》' },
      { id: 'history-3', title: '前瞻布局和发展未来产业 / 习近平', subtitle: '12:38', meta: '2026年第11期《求是》' }
    ]
  },
  [ProfileFeatureType.Favorite]: {
    type: ProfileFeatureType.Favorite,
    title: '收藏/浏览记录',
    description: '收藏过的重点文章',
    items: [
      { id: 'favorite-1', title: '前瞻布局和发展未来产业 / 习近平', subtitle: '12:38', meta: '2026年第11期《求是》' },
      { id: 'favorite-2', title: '前瞻布局和发展未来产业 / 习近平', subtitle: '12:38', meta: '2026年第11期《求是》' }
    ]
  },
  [ProfileFeatureType.Download]: {
    type: ProfileFeatureType.Download,
    title: '收藏/浏览记录',
    description: '已缓存到本地的学习内容',
    items: [
      { id: 'download-1', title: '前瞻布局和发展未来产业 / 习近平', subtitle: '12:38', meta: '2026年第11期《求是》' },
      { id: 'download-2', title: '华为“韬定律”揭示了什么', subtitle: '12:38', meta: '2026年第10期《求是》' }
    ]
  },
  [ProfileFeatureType.Subscribe]: {
    type: ProfileFeatureType.Subscribe,
    title: '订阅',
    description: '已订阅的求是号',
    items: [
      { id: 'sub-1', title: 'XXX大学研究院院长 张三', subtitle: '华为“韬定律”揭示了什么', meta: '已订阅', thumbnail: '/static/home/article-thumb-3.png' },
      { id: 'sub-2', title: '海峡通讯', subtitle: '华为“韬定律”揭示了什么', meta: '已订阅', thumbnail: '/static/home/article-thumb-3.png' },
      { id: 'sub-3', title: '前线', subtitle: '华为“韬定律”揭示了什么', meta: '已订阅', thumbnail: '/static/home/article-thumb-3.png' }
    ]
  },
  [ProfileFeatureType.Notes]: {
    type: ProfileFeatureType.Notes,
    title: '笔记',
    description: '学习时记录的重点',
    items: [
      {
        id: 'note-1',
        title: '前瞻布局和发展未来产业 / 习近平',
        subtitle: '发展未来产业，不能面面俱到、平均用力，必须明确方向、找准重点。这里面点名了新的经济增长点。',
        meta: '2026年第11期《求是》'
      },
      {
        id: 'note-2',
        title: '前瞻布局和发展未来产业 / 习近平',
        subtitle: '党的二十届四中全会提出，要推动量子科技、生物制造、氢能和核聚变能、脑机接口、具身智能等成为新的经济增长点。',
        meta: '2026年第11期《求是》'
      }
    ]
  },
  [ProfileFeatureType.StudyData]: {
    type: ProfileFeatureType.StudyData,
    title: '学习数据',
    description: 'Hi，hhhhhhhhui，你是求是的第859843位读者',
    items: [
      { id: 'data-digital', title: '数字刊', subtitle: '3本', meta: '学过的内容' },
      { id: 'data-article', title: '文章', subtitle: '17篇', meta: '学过的内容' },
      { id: 'data-video', title: '视频', subtitle: '5个', meta: '学过的内容' },
      { id: 'data-notes', title: '笔记', subtitle: '29篇', meta: '学过的内容' }
    ]
  },
  [ProfileFeatureType.Invoice]: {
    type: ProfileFeatureType.Invoice,
    title: '已开发票',
    description: '发票记录',
    items: [
      { id: 'invoice-1', title: '个人发票', subtitle: '开票金额：240.00元', meta: '开票日期：2026/6/3' },
      { id: 'invoice-2', title: '单位发票', subtitle: '开票金额：240.00元', meta: '开票日期：2026/6/3' },
      { id: 'invoice-3', title: '个人发票', subtitle: '开票金额：240.00元', meta: '开票日期：2026/6/3' }
    ]
  },
  [ProfileFeatureType.Help]: {
    type: ProfileFeatureType.Help,
    title: '帮助中心',
    description: '常见问题',
    items: [
      { id: 'help-1', title: '如何订阅数字刊？', subtitle: '进入会员中心选择订阅套餐并完成支付。', meta: '订阅问题' },
      { id: 'help-2', title: '如何查看已购买内容？', subtitle: '在我的内容中点击“已购”查看。', meta: '内容问题' },
      { id: 'help-3', title: '如何联系客服？', subtitle: '在我的页面点击“联系客服”。', meta: '服务问题' }
    ]
  }
};

export const aiSuggestedQuestions = [
  '怎么看待现在的人工智能',
  '绿水青山就是金山银山解读',
  '前瞻布局和发展未来产业解读'
];
