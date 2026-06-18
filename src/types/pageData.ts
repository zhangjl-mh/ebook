import type {
  DatabasePublicationId,
  IssueYear,
  IssueYearFilter,
  MediaCategoryKey,
  MediaItemType,
  ProfileBadgeType,
  ProfileFeatureType,
  WeeklySectionKey
} from '@/types/enums';

export type {
  DatabasePublicationId,
  IssueYear,
  IssueYearFilter,
  MediaCategoryKey,
  MediaItemType,
  ProfileBadgeType,
  ProfileFeatureType,
  WeeklySectionKey
} from '@/types/enums';

export interface IssueYearOption {
  label: string;
  value: IssueYearFilter;
}

export interface IssueCatalogItem {
  id: string;
  publicationId: DatabasePublicationId;
  year: IssueYear;
  issueNo: string;
  issueTitle: string;
  title: string;
  subtitle: string;
  subscriberCount: number;
  coverImage: string;
}

export interface DatabasePublication {
  id: DatabasePublicationId;
  title: string;
  updateText: string;
  subscriberCount: number;
  latestIssueNo: number;
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

export interface MemberBanner {
  title: string;
  desc: string;
  buttonText: string;
}

export interface MediaCategory {
  key: MediaCategoryKey;
  label: string;
}

export interface MediaItem {
  id: string;
  category: MediaCategoryKey;
  type: MediaItemType;
  title: string;
  source: string;
  date: string;
  summary: string;
  thumbnail: string;
  poster?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

export interface WeeklySection {
  key: WeeklySectionKey;
  label: string;
  paragraphs: string[];
}

export interface ProfileContentAction {
  type: ProfileFeatureType;
  label: string;
  icon: string;
}

export interface ProfileFeatureListItem {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  tag?: string;
  thumbnail?: string;
}

export interface ProfileFeatureConfig {
  type: ProfileFeatureType;
  title: string;
  description: string;
  items: ProfileFeatureListItem[];
}
