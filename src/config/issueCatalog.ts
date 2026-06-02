import type { IssueCatalogItem, IssueYearOption } from '@/types/pageData';

export const issueYearOptions: IssueYearOption[] = [
  { label: '全部', value: 'all' },
  { label: '2026', value: '2026' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' }
];

export const issueCatalogItems: IssueCatalogItem[] = [
  {
    id: '2026-04',
    year: '2026',
    issueNo: '4',
    issueTitle: '2026年第4期',
    title: '深入学习贯彻',
    subtitle: '习近平新时代中国特色社会主义思想',
    subscriberCount: 18,
    coverBg: '/static/issues/cover_cream.png',
    tone: 'red'
  },
  {
    id: '2026-03',
    year: '2026',
    issueNo: '3',
    issueTitle: '2026年第3期',
    title: '党建引领强根基',
    subtitle: '以高质量党建引领高质量发展',
    subscriberCount: 21,
    coverBg: '/static/issues/cover_wall.png',
    tone: 'red'
  },
  {
    id: '2026-02',
    year: '2026',
    issueNo: '2',
    issueTitle: '2026年第2期',
    title: '高质量发展',
    subtitle: '扎实推进中国式现代化',
    subscriberCount: 32,
    coverBg: '/static/issues/cover_red_city.png',
    tone: 'dark'
  },
  {
    id: '2026-01',
    year: '2026',
    issueNo: '1',
    issueTitle: '2026年第1期',
    title: '科技创新驱动',
    subtitle: '加快实现高水平科技自立自强',
    subscriberCount: 45,
    coverBg: '/static/issues/cover_blue_tech.png',
    tone: 'red'
  },
  {
    id: '2025-06',
    year: '2025',
    issueNo: '6',
    issueTitle: '2025年第6期',
    title: '文化自信自强',
    subtitle: '铸就社会主义文化新辉煌',
    subscriberCount: 27,
    coverBg: '/static/issues/cover_green_water.png',
    tone: 'red'
  },
  {
    id: '2025-05',
    year: '2025',
    issueNo: '5',
    issueTitle: '2025年第5期',
    title: '全面推进乡村振兴',
    subtitle: '加快农业农村现代化步伐',
    subscriberCount: 16,
    coverBg: '/static/issues/cover_gold_rural.png',
    tone: 'red'
  },
  {
    id: '2024-09',
    year: '2024',
    issueNo: '9',
    issueTitle: '2024年第9期',
    title: '中国式现代化',
    subtitle: '在新征程上谱写新篇章',
    subscriberCount: 38,
    coverBg: '/static/issues/cover_red_bridge.png',
    tone: 'dark'
  },
  {
    id: '2024-08',
    year: '2024',
    issueNo: '8',
    issueTitle: '2024年第8期',
    title: '民生保障',
    subtitle: '不断增强人民群众获得感幸福感安全感',
    subscriberCount: 24,
    coverBg: '/static/issues/cover_family.png',
    tone: 'red'
  },
  {
    id: '2023-12',
    year: '2023',
    issueNo: '12',
    issueTitle: '2023年第12期',
    title: '作风建设永远在路上',
    subtitle: '持之以恒正风肃纪反腐',
    subscriberCount: 29,
    coverBg: '/static/issues/cover_blue_wall.png',
    tone: 'blue'
  }
];

