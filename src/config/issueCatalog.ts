import type { DatabasePublication, IssueCatalogItem, IssueYearOption } from '@/types/pageData';
import { DatabasePublicationId, IssueYear, IssueYearFilter } from '@/types/enums';

export const issueYearOptions: IssueYearOption[] = [
  { label: '全部', value: IssueYearFilter.All },
  { label: '2026', value: IssueYearFilter.Y2026 },
  { label: '2025', value: IssueYearFilter.Y2025 },
  { label: '2024', value: IssueYearFilter.Y2024 },
  { label: '2023', value: IssueYearFilter.Y2023 }
];

export const databasePublications: DatabasePublication[] = [
  {
    id: DatabasePublicationId.Qiushi,
    title: '求是',
    updateText: '更新至2026年第11期',
    subscriberCount: 27,
    latestIssueNo: 11,
    coverImage: '/static/database/qiushi.jpg'
  },
  {
    id: DatabasePublicationId.HongqiWengao,
    title: '红旗文稿',
    updateText: '更新至2026年第10期',
    subscriberCount: 27,
    latestIssueNo: 10,
    coverImage: '/static/database/hongqi-wengao.jpg'
  },
  {
    id: DatabasePublicationId.QiushiEn,
    title: 'QIUSHI',
    updateText: '更新至2026年第2期',
    subscriberCount: 27,
    latestIssueNo: 2,
    coverImage: '/static/database/qiushi-en.jpg'
  },
  {
    id: DatabasePublicationId.HongqiArchive,
    title: '《红旗》历史文献',
    updateText: '1958年—1988年全集',
    subscriberCount: 27,
    latestIssueNo: 12,
    coverImage: '/static/database/hongqi-archive.jpg'
  }
];

const issueCountsByYear = {
  [IssueYear.Y2026]: 12,
  [IssueYear.Y2025]: 12,
  [IssueYear.Y2024]: 12,
  [IssueYear.Y2023]: 12
} satisfies Record<IssueYear, number>;

export const getDatabasePublication = (publicationId: string) => {
  return databasePublications.find((publication) => publication.id === publicationId);
};

export const getPublicationIssues = (publication: DatabasePublication): IssueCatalogItem[] => {
  return issueYearOptions.flatMap(({ value }) => {
    if (value === IssueYearFilter.All) return [];

    const configuredCount = issueCountsByYear[value];
    const issueCount = value === IssueYear.Y2026
      ? Math.min(configuredCount, publication.latestIssueNo)
      : configuredCount;

    return Array.from({ length: issueCount }, (_, index) => {
      const issueNo = String(issueCount - index);

      return {
        id: `${publication.id}-${value}-${issueNo}`,
        publicationId: publication.id,
        year: value,
        issueNo,
        issueTitle: `${value}年第${issueNo}期`,
        title: publication.title,
        subtitle: publication.updateText,
        subscriberCount: publication.subscriberCount,
        coverImage: publication.coverImage
      };
    });
  });
};
