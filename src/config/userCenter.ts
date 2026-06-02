import type { MemberBanner, ProfileInfo, ProfileMenuItem, RecentReadItem } from '@/types/pageData';

export const profileInfo: ProfileInfo = {
  name: '华华',
  avatar: '/static/profile/avatar.png',
  headerBg: '/static/profile/profile_header.png',
  logo: '/static/brand/header_logo_original.png',
  badges: [
    { text: '求是数字刊年度会员', type: 'gold' },
    { text: '已认证用户', type: 'gray' },
    { text: '理论学习者', type: 'red' }
  ]
};

export const profileMenuItems: ProfileMenuItem[] = [
  { id: 'orders', label: '我的订单', icon: '/static/profile/icon_order.png' },
  { id: 'verify', label: '单位认证', icon: '/static/profile/icon_verify.png' },
  { id: 'invoice', label: '补开发票', icon: '/static/profile/icon_invoice.png' },
  { id: 'favorite', label: '我的收藏', icon: '/static/profile/icon_favorite.png' },
  { id: 'service', label: '联系客服', icon: '/static/profile/icon_service.png' }
];

export const recentReadItems: RecentReadItem[] = [
  {
    id: 'recent-2024-09',
    title: '求是',
    issueTitle: '2024年第09期',
    progress: 68,
    coverBg: '/static/issues/cover_cream.png'
  },
  {
    id: 'recent-2024-08',
    title: '求是',
    issueTitle: '2024年第08期',
    progress: 32,
    coverBg: '/static/issues/cover_wall.png'
  }
];

export const memberBanner: MemberBanner = {
  title: '求是数字刊会员',
  desc: '畅读权威内容  领略思想之光',
  buttonText: '会员中心',
  bg: '/static/profile/member_banner.png'
};

