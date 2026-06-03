export type IssueYearFilter = 'all' | '2026' | '2025' | '2024' | '2023';
export type IssueYear = Exclude<IssueYearFilter, 'all'>;

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
  type: 'gold' | 'gray' | 'red';
}

export interface ProfileInfo {
  name: string;
  badges: ProfileBadge[];
}

export type ProfileMenuIcon = 'order' | 'verify' | 'invoice' | 'favorite' | 'service';

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: ProfileMenuIcon;
}

export interface RecentReadItem {
  id: string;
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
