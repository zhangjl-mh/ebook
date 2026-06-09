import type { MemberBanner, ProfileInfo, ProfileMenuItem, RecentReadItem } from '@/types/pageData';
import { magazineConfig } from '@/config/magazineData';
import { ProfileBadgeType, ProfileMenuIcon } from '@/types/enums';

export const profileInfo: ProfileInfo = {
  name: '用户06543',
  badges: [
    { text: '求是数字刊年度会员', type: ProfileBadgeType.Gold },
    { text: '已认证用户', type: ProfileBadgeType.Gray },
    { text: '理论学习者', type: ProfileBadgeType.Red }
  ]
};

export const profileMenuItems: ProfileMenuItem[] = [
  { id: 'orders', label: '我的订单', icon: ProfileMenuIcon.Order },
  { id: 'verify', label: '单位认证', icon: ProfileMenuIcon.Verify },
  { id: 'invoice', label: '补开发票', icon: ProfileMenuIcon.Invoice },
  { id: 'favorite', label: '我的收藏', icon: ProfileMenuIcon.Favorite },
  { id: 'service', label: '联系客服', icon: ProfileMenuIcon.Service }
];

const recentIssueProgress: Record<string, number> = {
  'issue-09': 68,
  'issue-08': 32
};

export const recentReadItems: RecentReadItem[] = magazineConfig.swiperIssues
  .filter((issue) => Object.prototype.hasOwnProperty.call(recentIssueProgress, issue.id))
  .map((issue) => ({
    id: `recent-${issue.id}`,
    issueId: issue.id,
    title: '求是',
    issueTitle: issue.fullTitle,
    issueNo: issue.issueNum.padStart(2, '0'),
    progress: recentIssueProgress[issue.id],
    coverImage: issue.coverImage
  }));

export const memberBanner: MemberBanner = {
  title: '求是数字刊会员',
  desc: '畅读权威内容 领略思想之光',
  buttonText: '会员中心'
};
