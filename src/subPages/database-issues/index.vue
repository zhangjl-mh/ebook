<template>
  <scroll-view class="database-issues qs-page-scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
    :bounces="false">
    <view v-if="publication" class="database-issues__inner">
      <DatabaseHeader :query="searchQuery" show-back @search="setSearchQuery" />
      <view class="database-issues__content">
        <IssueYearTabs :options="issueYearOptions" :active-year="activeYear" @change="setActiveYear" />
        <IssueGrid :issues="filteredIssues" @select="openIssueDetail" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import DatabaseHeader from '@/components/DatabaseHeader.vue';
import IssueGrid from './components/IssueGrid.vue';
import IssueYearTabs from './components/IssueYearTabs.vue';
import { getDatabasePublication, getPublicationIssues, issueYearOptions } from '@/config/issueCatalog';
import { IssueYearFilter } from '@/types/enums';
import type {
  DatabasePublication,
  IssueCatalogItem,
  IssueYearFilter as IssueYearFilterType
} from '@/types/pageData';

interface DatabaseIssuesQuery {
  publicationId?: string;
}

const publication = ref<DatabasePublication>();
const issues = ref<IssueCatalogItem[]>([]);
const activeYear = ref<IssueYearFilterType>(IssueYearFilter.All);
const searchQuery = ref('');
const openingIssueId = ref('');

const filteredIssues = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return issues.value.filter((issue) => {
    const matchedYear = activeYear.value === IssueYearFilter.All || issue.year === activeYear.value;
    const matchedQuery = !query || `${issue.issueTitle}${issue.title}${issue.subtitle}`.toLowerCase().includes(query);

    return matchedYear && matchedQuery;
  });
});

const setActiveYear = (year: IssueYearFilterType) => {
  activeYear.value = year;
};

const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};

const openIssueDetail = (issue: IssueCatalogItem) => {
  if (openingIssueId.value) return;
  openingIssueId.value = issue.id;

  const directoryIssueId = `issue-${issue.issueNo.padStart(2, '0')}`;

  uni.navigateTo({
    url: `/subPages/book/index?title=${encodeURIComponent(issue.issueTitle)}&issueId=${encodeURIComponent(directoryIssueId)}`,
    fail: () => {
      uni.showToast({
        title: '打开电子刊失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        if (openingIssueId.value === issue.id) {
          openingIssueId.value = '';
        }
      }, 500);
    }
  });
};

const returnToDatabase = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({
    url: '/pages/magazine/index'
  });
};

onLoad((query?: DatabaseIssuesQuery) => {
  const matchedPublication = getDatabasePublication(query?.publicationId || '');

  if (!matchedPublication) {
    uni.showToast({
      title: '期刊信息不可用',
      icon: 'none'
    });
    setTimeout(returnToDatabase, 400);
    return;
  }

  publication.value = matchedPublication;
  issues.value = getPublicationIssues(matchedPublication);
});
</script>

<style lang="scss">
page {
  background: var(--qs-page-bg);
}

.database-issues {
  background: linear-gradient(180deg, #fff2f1 0, var(--qs-page-bg) 390rpx);
}

.database-issues__inner {
  min-height: 100%;
  box-sizing: border-box;
}

.database-issues__content {
  position: relative;
  z-index: 2;
  margin-top: -24rpx;
  padding-bottom: var(--qs-bottom-safe);
}
</style>
