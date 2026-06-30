<template>
  <view class="home-search">
    <view class="home-search__head">
      <text class="home-search__title">搜索结果</text>
      <text class="home-search__count">{{ resultCountText }}</text>
    </view>

    <view v-if="loading" class="home-search__state">
      <text>正在检索</text>
    </view>

    <view v-else-if="errorMessage" class="home-search__state">
      <text>{{ errorMessage }}</text>
    </view>

    <view v-else-if="items.length === 0" class="home-search__state">
      <text>未找到相关内容</text>
    </view>

    <view v-else class="home-search__list">
      <view v-for="item in items" :key="item.id" class="home-search-card" @tap="emit('select', item)">
        <image v-if="item.thumbnail" :src="item.thumbnail" mode="aspectFill" class="home-search-card__thumb" />
        <view class="home-search-card__body">
          <view class="home-search-card__top">
            <text class="home-search-card__tag">{{ getKindLabel(item.kind) }}</text>
            <text v-if="item.date" class="home-search-card__date">{{ item.date }}</text>
          </view>
          <text class="home-search-card__title">{{ item.title }}</text>
          <text v-if="item.description" class="home-search-card__desc">{{ item.description }}</text>
          <text class="home-search-card__meta">{{ item.meta }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HomeSearchItemKind } from '@/types/enums';
import type { HomeSearchItem } from '@/types/homeSearch';
import type { HomeSearchItemKind as HomeSearchItemKindType } from '@/types/enums';

const props = defineProps<{
  items: HomeSearchItem[];
  query: string;
  loading: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  select: [item: HomeSearchItem];
}>();

const resultCountText = computed(() => {
  const query = props.query.trim();
  if (!query) return '';
  if (props.loading) return '检索中';
  return `${props.items.length} 条`;
});

const kindLabelMap: Record<HomeSearchItemKindType, string> = {
  [HomeSearchItemKind.Article]: '文章',
  [HomeSearchItemKind.IssueArticle]: '电子刊',
  [HomeSearchItemKind.Column]: '专栏',
  [HomeSearchItemKind.Account]: '求是号'
};

const getKindLabel = (kind: HomeSearchItemKindType) => kindLabelMap[kind];
</script>

<style lang="scss" scoped>
.home-search {
  min-height: 640rpx;
  padding: 18rpx 18rpx 32rpx;
  background: #f2f2f4;
  box-sizing: border-box;
}

.home-search__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rpx 8rpx 18rpx;
}

.home-search__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.35;
}

.home-search__count {
  color: #8c8c8c;
  font-size: 24rpx;
  line-height: 1.35;
}

.home-search__state {
  display: flex;
  min-height: 360rpx;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: #fff;
  color: #8c8c8c;
  font-size: 28rpx;
  line-height: 1.4;
}

.home-search__list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.home-search-card {
  display: flex;
  min-height: 176rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: #fff;
}

.home-search-card__thumb {
  width: 190rpx;
  height: 176rpx;
  flex-shrink: 0;
  background: #f3f3f3;
}

.home-search-card__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 18rpx 22rpx 16rpx;
  box-sizing: border-box;
}

.home-search-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.home-search-card__tag {
  flex-shrink: 0;
  padding: 3rpx 12rpx;
  border-radius: 999rpx;
  background: #ffe9e7;
  color: #d71920;
  font-size: 21rpx;
  font-weight: 700;
  line-height: 1.35;
}

.home-search-card__date {
  overflow: hidden;
  color: #b8b8b8;
  font-size: 22rpx;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-search-card__title {
  display: -webkit-box;
  margin-top: 10rpx;
  overflow: hidden;
  color: #222;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-search-card__desc {
  display: -webkit-box;
  margin-top: 8rpx;
  overflow: hidden;
  color: #555;
  font-size: 24rpx;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-search-card__meta {
  display: block;
  margin-top: auto;
  padding-top: 8rpx;
  overflow: hidden;
  color: #b8b8b8;
  font-size: 22rpx;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
