<template>
  <view class="magazine-page">
    <MagazineHeader :query="searchQuery" @search="setSearchQuery" />
    <view class="magazine-page__content">
      <IssueYearTabs :options="issueYearOptions" :active-year="activeYear" @change="setActiveYear" @filter="showFilterTips" />
      <IssueGrid :issues="filteredIssues" :logo-src="logoSrc" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MagazineHeader from './components/MagazineHeader.vue';
import IssueGrid from './components/IssueGrid.vue';
import IssueYearTabs from './components/IssueYearTabs.vue';
import { issueCatalogItems, issueYearOptions } from '@/config/issueCatalog';
import type { IssueYearFilter } from '@/types/pageData';

const activeYear = ref<IssueYearFilter>('all');
const searchQuery = ref('');
const logoSrc = '/static/brand/header_logo_original.png';

const filteredIssues = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return issueCatalogItems.filter((issue) => {
    const matchedYear = activeYear.value === 'all' || issue.year === activeYear.value;
    const matchedQuery = !query || `${issue.issueTitle}${issue.title}${issue.subtitle}`.toLowerCase().includes(query);

    return matchedYear && matchedQuery;
  });
});

const setActiveYear = (year: IssueYearFilter) => {
  activeYear.value = year;
};

const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};

const showFilterTips = () => {
  uni.showToast({
    title: '暂无更多筛选',
    icon: 'none',
    duration: 1200
  });
};
</script>

<style lang="scss">
page {
  background: #f7f7f7;
}

.magazine-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f7f7f7;
}

.magazine-page__content {
  position: relative;
  z-index: 2;
  margin-top: -78rpx;
  padding-bottom: 154rpx;
}
</style>
