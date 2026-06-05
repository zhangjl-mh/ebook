<template>
  <scroll-view class="magazine-page qs-page-scroll" scroll-y enable-flex>
    <view class="magazine-page__inner qs-page-scroll__inner">
      <MagazineHeader :query="searchQuery" @search="setSearchQuery" />
      <view class="magazine-page__content">
        <IssueYearTabs :options="issueYearOptions" :active-year="activeYear" @change="setActiveYear"
          @filter="showFilterTips" />
        <IssueGrid :issues="filteredIssues" @select="openIssueDetail" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MagazineHeader from './components/MagazineHeader.vue';
import IssueGrid from './components/IssueGrid.vue';
import IssueYearTabs from './components/IssueYearTabs.vue';
import { issueCatalogItems, issueYearOptions } from '@/config/issueCatalog';
import { IssueYearFilter } from '@/types/enums';
import type { IssueCatalogItem, IssueYearFilter as IssueYearFilterType } from '@/types/pageData';

const activeYear = ref<IssueYearFilterType>(IssueYearFilter.All);
const searchQuery = ref('');
const openingIssueId = ref('');

const filteredIssues = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return issueCatalogItems.filter((issue) => {
    const matchedYear = activeYear.value === 'all' || issue.year === activeYear.value;
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

  const title = issue.issueTitle.trim();

  if (!title) {
    uni.showToast({
      title: '期刊信息不可用',
      icon: 'none'
    });
    return;
  }

  openingIssueId.value = issue.id;

  const directoryIssueId = `issue-${issue.issueNo.padStart(2, '0')}`;

  uni.navigateTo({
    url: `/subPages/book/index?title=${encodeURIComponent(title)}&issueId=${encodeURIComponent(directoryIssueId)}`,
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
  background: var(--qs-page-bg);
}

.magazine-page {
  overflow-x: hidden;
  background: linear-gradient(180deg, #fff6f5 0, var(--qs-page-bg) 330rpx);
}

.magazine-page__inner {
  background: linear-gradient(180deg, #fff6f5 0, var(--qs-page-bg) 330rpx);
}

.magazine-page__content {
  position: relative;
  z-index: 2;
  margin-top: -95rpx;
  padding-bottom: $qs-tabbar-bottom-space;
}
</style>
