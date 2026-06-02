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
}

export interface ProfileBadge {
  text: string;
  type: 'gold' | 'gray' | 'red';
}

export interface ProfileInfo {
  name: string;
  avatar: string;
  headerBg: string;
  logo: string;
  badges: ProfileBadge[];
}

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: string;
}

export interface RecentReadItem {
  id: string;
  title: string;
  issueTitle: string;
  progress: number;
  coverBg: string;
}

export interface MemberBanner {
  title: string;
  desc: string;
  buttonText: string;
  bg: string;
}
