<template>
  <scroll-view class="magazine-page qs-page-scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
    :bounces="false">
    <view class="magazine-page__inner">
      <DatabaseHeader :query="searchQuery" @search="setSearchQuery" />
      <view class="magazine-page__content">
        <PublicationGrid :publications="filteredPublications" @select="openPublication" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DatabaseHeader from '@/components/DatabaseHeader.vue';
import PublicationGrid from './components/PublicationGrid.vue';
import { databasePublications } from '@/config/issueCatalog';
import type { DatabasePublication } from '@/types/pageData';

const searchQuery = ref('');
const openingPublicationId = ref('');

const filteredPublications = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return databasePublications.filter((publication) => {
    return !query || `${publication.title}${publication.updateText}`.toLowerCase().includes(query);
  });
});

const setSearchQuery = (query: string) => {
  searchQuery.value = query;
};

const openPublication = (publication: DatabasePublication) => {
  if (openingPublicationId.value) return;
  openingPublicationId.value = publication.id;

  uni.navigateTo({
    url: `/subPages/database-issues/index?publicationId=${encodeURIComponent(publication.id)}`,
    fail: () => {
      uni.showToast({
        title: '打开期刊列表失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        if (openingPublicationId.value === publication.id) {
          openingPublicationId.value = '';
        }
      }, 500);
    }
  });
};
</script>

<style lang="scss">
page {
  background: var(--qs-page-bg);
}

.magazine-page {
  background: linear-gradient(180deg, #fff2f1 0, var(--qs-page-bg) 390rpx);
}

.magazine-page__inner {
  min-height: 100%;
  box-sizing: border-box;
}

.magazine-page__content {
  position: relative;
  z-index: 2;
  margin-top: -24rpx;
  padding-bottom: var(--qs-tabbar-bottom-space);
}
</style>
