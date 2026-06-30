import { HomeSearchItemKind, HomeSearchTargetType } from '@/types/enums';
import type { HomeSearchItem } from '@/types/homeSearch';

export const defaultSearchHistory = [
  '总书记',
  '中国式现代化',
  '高质量发展',
  '能源安全',
  '青年儿童',
  '华为'
];

export const featuredSearchItems: HomeSearchItem[] = [
  {
    id: 'featured-xi-important-article',
    kind: HomeSearchItemKind.IssueArticle,
    title: '第12期《求是》杂志发表习近平总书记重要文章',
    description: '围绕党的创新理论最新成果进行权威解读。',
    meta: '要闻',
    date: '18小时前',
    thumbnail: '',
    keywords: ['第12期', '求是', '习近平', '总书记', '重要文章', '要闻'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-energy-security',
    kind: HomeSearchItemKind.IssueArticle,
    title: '践行习近平总书记重要论述深入实施能源安全新战略',
    description: '系统阐释能源安全新战略的实践路径。',
    meta: '要闻',
    date: '06-14',
    thumbnail: '',
    keywords: ['习近平', '总书记', '能源安全', '新战略', '要闻'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-dprk-visit',
    kind: HomeSearchItemKind.IssueArticle,
    title: '习近平总书记朝鲜之行的深远意义',
    description: '从国际关系和周边外交角度观察访问成果。',
    meta: '要闻',
    date: '06-13',
    thumbnail: '',
    keywords: ['习近平', '总书记', '朝鲜', '深远意义', '要闻'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-maritime-power',
    kind: HomeSearchItemKind.IssueArticle,
    title: '习近平总书记重要论述引领中国特色的向海图强之路',
    description: '聚焦海洋强国建设的理论逻辑与现实路径。',
    meta: '要闻',
    date: '06-12',
    thumbnail: '',
    keywords: ['习近平', '总书记', '海洋强国', '向海图强', '要闻'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-children-growth',
    kind: HomeSearchItemKind.IssueArticle,
    title: '习近平总书记的深情寄望鼓舞新时代少年儿童成长成才',
    description: '记录关怀少年儿童成长成才的重要论述。',
    meta: '要闻',
    date: '06-01',
    thumbnail: '',
    keywords: ['习近平', '总书记', '少年儿童', '成长成才', '要闻'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-food-safety',
    kind: HomeSearchItemKind.IssueArticle,
    title: '习近平总书记关切事丨一餐一饭里的民生“食”事',
    description: '从民生视角观察粮食安全与餐桌保障。',
    meta: '要闻',
    date: '05-25',
    thumbnail: '',
    keywords: ['习近平', '总书记', '民生', '食事', '粮食安全', '要闻'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-theory-interpretation',
    kind: HomeSearchItemKind.IssueArticle,
    title: '从重要讲话读懂中国式现代化的理论展开',
    description: '围绕中国式现代化的理论体系进行专题解读。',
    meta: '解读',
    date: '06-10',
    thumbnail: '',
    keywords: ['总书记', '中国式现代化', '理论', '解读'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-column-development',
    kind: HomeSearchItemKind.Column,
    title: '把高质量发展要求贯穿改革全过程',
    description: '专栏',
    meta: '作者：求是网评论员',
    date: '06-08',
    thumbnail: '',
    keywords: ['高质量发展', '改革', '专栏', '求是网评论员'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  },
  {
    id: 'featured-account-qiushi',
    kind: HomeSearchItemKind.Account,
    title: '求是号专题：总书记关切的民生实事',
    description: '求是号',
    meta: '作者：求是融媒',
    date: '',
    thumbnail: '/static/home/article-thumb.png',
    keywords: ['求是号', '总书记', '民生', '求是融媒'],
    target: {
      type: HomeSearchTargetType.Pending
    }
  }
];
