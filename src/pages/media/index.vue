<template>
  <view class="media-page qs-page">
    <view class="media-page__header" :style="headerStyle">
      <text class="media-page__header-title">视频汇</text>
    </view>

    <view class="media-search">
      <view class="media-search__box">
        <uni-icons type="search" size="20" color="#d71920" />
        <input class="media-search__input" type="text" :value="searchQuery" placeholder="请输入检索内容"
          placeholder-class="media-search__placeholder" @input="handleInput" />
      </view>
      <button class="media-search__ai" @tap="openAiAssistant">
        <image src="/static/home/ai-mark.png" mode="aspectFit" />
      </button>
    </view>

    <view class="media-tabs">
      <button v-for="category in mediaCategories" :key="category.key" class="media-tabs__item"
        :class="{ 'media-tabs__item--active': activeCategory === category.key }" @tap="setCategory(category.key)">
        {{ category.label }}
      </button>
    </view>

    <scroll-view class="media-page__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true" :bounces="false"
      :scroll-top="scrollTop">
      <view class="media-page__content"
        :class="{ 'media-page__content--flush': activeCategory === MediaCategoryKey.Weekly || activeCategory === MediaCategoryKey.Abroad }">
        <view v-if="!filteredItems.length" class="media-empty">
          <uni-icons type="search" size="30" color="#bcbcbc" />
          <text>暂无匹配内容</text>
        </view>

        <MediaVideoGrid v-else-if="isVideoCategory" :items="filteredItems" @select="openDetail" />
        <MediaWeeklyList v-else-if="activeCategory === MediaCategoryKey.Weekly" :items="filteredItems"
          @select="openDetail" />
        <MediaAbroadList v-else :items="filteredItems" @select="openDetail" />
      </view>
    </scroll-view>

    <MediaAssistant @open="openAiAssistant" />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import MediaAbroadList from './components/MediaAbroadList.vue';
import MediaAssistant from './components/MediaAssistant.vue';
import MediaVideoGrid from './components/MediaVideoGrid.vue';
import MediaWeeklyList from './components/MediaWeeklyList.vue';
import { mediaCategories, mediaItems } from '@/config/mediaCenter';
import { MediaCategoryKey } from '@/types/enums';
import { useSafeArea } from '@/hooks/useSafeArea';
import { getUniInputValue } from '@/utils/events';
import type { MediaCategoryKey as MediaCategoryKeyType } from '@/types/enums';
import type { MediaItem } from '@/types/pageData';

const { safeArea } = useSafeArea();
const activeCategory = ref<MediaCategoryKeyType>(MediaCategoryKey.Ai);
const searchQuery = ref('');
const openingPath = ref('');
const scrollTop = ref(0);

const headerStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));

const isVideoCategory = computed(() =>
  activeCategory.value === MediaCategoryKey.Ai || activeCategory.value === MediaCategoryKey.Youth
);

const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return mediaItems.filter((item) => {
    const matchedCategory = item.category === activeCategory.value;
    const matchedQuery = !query || `${item.title}${item.summary}${item.source}`.toLowerCase().includes(query);

    return matchedCategory && matchedQuery;
  });
});

const navigateOnce = (url: string) => {
  if (openingPath.value) return;

  openingPath.value = url;
  uni.navigateTo({
    url,
    fail: () => {
      uni.showToast({ title: '页面打开失败', icon: 'none' });
    },
    complete: () => {
      setTimeout(() => {
        if (openingPath.value === url) openingPath.value = '';
      }, 500);
    }
  });
};

const setCategory = async (category: MediaCategoryKeyType) => {
  if (category === activeCategory.value) return;

  activeCategory.value = category;
  scrollTop.value = 1;
  await nextTick();
  scrollTop.value = 0;
};

const handleInput = (event: unknown) => {
  searchQuery.value = getUniInputValue(event);
};

const openDetail = (item: MediaItem) => {
  navigateOnce(`/subPages/media-detail/index?id=${encodeURIComponent(item.id)}`);
};

const openAiAssistant = () => {
  navigateOnce('/subPages/profile-feature/index?type=ai');
};
</script>

<style lang="scss" scoped>
.media-page {
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  background: #f4f4f5;
}

.media-page__header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-sizing: border-box;
}

.media-page__header-title {
  color: #111;
  font-size: 28rpx;
  font-weight: 500;
}

.media-search {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12rpx;
  padding: 9rpx 15rpx 8rpx;
  border-bottom: 1rpx solid #ededed;
  background: #fff;
}

.media-search__box {
  display: flex;
  height: 62rpx;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 18rpx;
  padding: 0 20rpx;
  border: 2rpx solid #d71920;
  border-radius: 31rpx;
  box-sizing: border-box;
}

.media-search__input {
  min-width: 0;
  flex: 1;
  color: #333;
  font-size: 25rpx;
}

.media-search__placeholder {
  color: #aaa;
}

.media-search__ai {
  width: 68rpx;
  height: 68rpx;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;

  &::after {
    border: none;
  }
}

.media-search__ai image {
  width: 100%;
  height: 100%;
}

.media-tabs {
  display: grid;
  flex-shrink: 0;
  grid-template-columns: 0.78fr 1.32fr 1fr 1.34fr;
  padding: 0 10rpx;
  border-bottom: 1rpx solid #e4e4e4;
  background: #fff;
}

.media-tabs__item {
  min-width: 0;
  height: 66rpx;
  margin: 0;
  padding: 0 4rpx;
  overflow: hidden;
  border: none;
  border-bottom: 3rpx solid transparent;
  border-radius: 0;
  background: transparent;
  color: #888;
  font-size: 24rpx;
  line-height: 66rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::after {
    border: none;
  }
}

.media-tabs__item--active {
  border-bottom-color: #d71920;
  color: #d71920;
  font-weight: 600;
}

.media-page__scroll {
  min-height: 0;
  flex: 1;
}

.media-page__content {
  min-height: 100%;
  padding: 20rpx 16rpx var(--qs-tabbar-bottom-space);
  box-sizing: border-box;
}

.media-page__content--flush {
  padding-top: 0;
}

.media-empty {
  display: flex;
  padding: 130rpx 0;
  flex-direction: column;
  align-items: center;
  gap: 18rpx;
  color: #999;
  font-size: 25rpx;
}
</style>
