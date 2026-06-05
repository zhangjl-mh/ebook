export const HeaderMode = {
  Default: 'default',
  Compact: 'compact'
} as const;

export type HeaderMode = (typeof HeaderMode)[keyof typeof HeaderMode];

export const ArticleTabKey = {
  Recommend: 'recommend',
  News: 'news',
  Theory: 'theory'
} as const;

export type ArticleTabKey = (typeof ArticleTabKey)[keyof typeof ArticleTabKey];

export const articleTabKeys = [
  ArticleTabKey.Recommend,
  ArticleTabKey.News,
  ArticleTabKey.Theory
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

export const ProfileMenuIcon = {
  Order: 'order',
  Verify: 'verify',
  Invoice: 'invoice',
  Favorite: 'favorite',
  Service: 'service'
} as const;

export type ProfileMenuIcon = (typeof ProfileMenuIcon)[keyof typeof ProfileMenuIcon];
