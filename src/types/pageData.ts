import type {
  IssueYear,
  IssueYearFilter,
  ProfileBadgeType,
  ProfileMenuIcon
} from '@/types/enums';

export type {
  IssueYear,
  IssueYearFilter,
  ProfileBadgeType,
  ProfileMenuIcon
} from '@/types/enums';

export interface IssueYearOption {
  label: string;
  value: IssueYearFilter;
}

export interface IssueCatalogItem {
  id: string;
  year: IssueYear;
  issueNo: string;
  issueTitle: string;
  title: string;
  subtitle: string;
  subscriberCount: number;
  coverImage: string;
}

export interface ProfileBadge {
  text: string;
  type: ProfileBadgeType;
}

export interface ProfileInfo {
  name: string;
  badges: ProfileBadge[];
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: ProfileMenuIcon;
}

export interface RecentReadItem {
  id: string;
  issueId: string;
  title: string;
  issueTitle: string;
  issueNo: string;
  progress: number;
  coverImage: string;
}

export interface MemberBanner {
  title: string;
  desc: string;
  buttonText: string;
}
