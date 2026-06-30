export const HeaderMode = {
  Default: 'default',
  Compact: 'compact'
} as const;

export type HeaderMode = (typeof HeaderMode)[keyof typeof HeaderMode];

export const ArticleTabKey = {
  Recommend: 'recommend',
  News: 'news',
  Theory: 'theory',
  Enterprise: 'enterprise'
} as const;

export type ArticleTabKey = (typeof ArticleTabKey)[keyof typeof ArticleTabKey];

export const articleTabKeys = [
  ArticleTabKey.Recommend,
  ArticleTabKey.News,
  ArticleTabKey.Theory,
  ArticleTabKey.Enterprise
] as const;

export const IssueYear = {
  Y2026: '2026',
  Y2025: '2025',
  Y2024: '2024',
  Y2023: '2023'
} as const;

export type IssueYear = (typeof IssueYear)[keyof typeof IssueYear];

export const IssueYearFilter = {
  All: 'all',
  ...IssueYear
} as const;

export type IssueYearFilter = (typeof IssueYearFilter)[keyof typeof IssueYearFilter];

export const DatabasePublicationId = {
  Qiushi: 'qiushi',
  HongqiWengao: 'hongqi-wengao',
  QiushiEn: 'qiushi-en',
  HongqiArchive: 'hongqi-archive'
} as const;

export type DatabasePublicationId =
  (typeof DatabasePublicationId)[keyof typeof DatabasePublicationId];

export const SubscriptionPlanId = {
  Month: 'month',
  Year: 'year'
} as const;

export type SubscriptionPlanId = (typeof SubscriptionPlanId)[keyof typeof SubscriptionPlanId];

export const SubscriptionBenefitIcon = {
  Video: 'video',
  Notes: 'notes',
  Audio: 'audio',
  Knowledge: 'knowledge'
} as const;

export type SubscriptionBenefitIcon =
  (typeof SubscriptionBenefitIcon)[keyof typeof SubscriptionBenefitIcon];

export const PaymentMethodId = {
  Wechat: 'wechat'
} as const;

export type PaymentMethodId = (typeof PaymentMethodId)[keyof typeof PaymentMethodId];

export const ArticleBodyBlockType = {
  Heading: 'heading',
  Author: 'author',
  Paragraph: 'paragraph',
  Note: 'note',
  Caption: 'caption',
  Image: 'image'
} as const;

export type ArticleBodyBlockType =
  (typeof ArticleBodyBlockType)[keyof typeof ArticleBodyBlockType];

export const ProfileBadgeType = {
  Gold: 'gold',
  Gray: 'gray',
  Red: 'red'
} as const;

export type ProfileBadgeType = (typeof ProfileBadgeType)[keyof typeof ProfileBadgeType];

export const MediaCategoryKey = {
  Ai: 'ai',
  Youth: 'youth',
  Weekly: 'weekly',
  Abroad: 'abroad'
} as const;

export type MediaCategoryKey = (typeof MediaCategoryKey)[keyof typeof MediaCategoryKey];

export const MediaItemType = {
  Video: 'video',
  Article: 'article'
} as const;

export type MediaItemType = (typeof MediaItemType)[keyof typeof MediaItemType];

export const WeeklySectionKey = {
  Activities: 'activities',
  Policies: 'policies',
  Finance: 'finance',
  Global: 'global'
} as const;

export type WeeklySectionKey = (typeof WeeklySectionKey)[keyof typeof WeeklySectionKey];

export const ProfileFeatureType = {
  Purchased: 'purchased',
  History: 'history',
  Favorite: 'favorite',
  Subscribe: 'subscribe',
  Download: 'download',
  Notes: 'notes',
  StudyData: 'studyData',
  Invoice: 'invoice',
  Ai: 'ai',
  Service: 'service',
  Help: 'help'
} as const;

export type ProfileFeatureType = (typeof ProfileFeatureType)[keyof typeof ProfileFeatureType];

export const HomeSearchItemKind = {
  Article: 'article',
  IssueArticle: 'issueArticle',
  Column: 'column',
  Account: 'account'
} as const;

export type HomeSearchItemKind = (typeof HomeSearchItemKind)[keyof typeof HomeSearchItemKind];

export const HomeSearchTargetType = {
  ArticleDetail: 'articleDetail',
  Webview: 'webview',
  Pending: 'pending'
} as const;

export type HomeSearchTargetType =
  (typeof HomeSearchTargetType)[keyof typeof HomeSearchTargetType];
