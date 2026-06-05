<template>
  <view class="article-list">
    <view v-if="store.isArticlesLoading" class="article-list__state">加载中...</view>
    <view v-else-if="!articles.length" class="article-list__state">{{ emptyText }}</view>

    <template v-else>
      <view v-for="(article, index) in articles" :key="article.id" class="article-item"
        :class="{ 'article-item--bordered': index !== articles.length - 1 }" @tap="openArticle(article)">
        <view class="article-item__body">
          <text class="article-item__title">{{ article.title }}</text>
          <text class="article-item__subtitle">{{ article.subtitle }}</text>

          <view class="article-item__tags">
            <text v-for="tag in article.tags" :key="tag" class="article-item__tag">{{ tag }}</text>
          </view>
        </view>

        <image :src="article.thumbnail" mode="aspectFill" class="article-item__image" />
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMagazineStore } from '@/store/magazineStore';
import type { Article } from '@/types/magazine';

const store = useMagazineStore();
const articles = computed(() => store.filteredArticles);
const emptyText = computed(() => store.errorMessage || '暂无符合条件的文章');

const openArticle = (article: Article) => {
  store.openWebview(article.linkUrl, article.title);
};
</script>

<style lang="scss" scoped>
.article-list {
  padding: 0 38rpx 28rpx;
  background: var(--qs-card-bg);
}

.article-list__state {
  padding: 72rpx 0;
  text-align: center;
  color: var(--qs-text-placeholder);
  font-size: 24rpx;
}

.article-item {
  display: flex;
  gap: 26rpx;
  padding: 34rpx 0;
}

.article-item--bordered {
  border-bottom: 1rpx solid var(--qs-border-color-light);
}

.article-item__body {
  display: flex;
  min-width: 0;
  min-height: 138rpx;
  flex: 1;
  flex-direction: column;
  gap: 16rpx;
}

.article-item__title {
  display: -webkit-box;
  overflow: hidden;
  color: var(--qs-text-main);
  font-size: 31rpx;
  font-weight: 700;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-item__subtitle {
  color: var(--qs-text-muted);
  font-size: 24rpx;
  line-height: 1.4;
}

.article-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.article-item__tag {
  padding: 8rpx 16rpx;
  border-radius: 7rpx;
  background: #fde8ea;
  color: var(--qs-color-primary);
  font-size: 22rpx;
  line-height: 1;
}

.article-item__image {
  width: 150rpx;
  height: 138rpx;
  flex-shrink: 0;
  border-radius: 10rpx;
  background: #f3f4f6;
}
</style>
