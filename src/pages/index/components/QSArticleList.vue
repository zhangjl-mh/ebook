<template>
  <view class="article-list">
    <view v-if="store.isArticlesLoading" class="article-list__state">加载中...</view>
    <view v-else-if="!articles.length" class="article-list__state">{{ emptyText }}</view>

    <template v-else>
      <view
        v-for="(article, index) in articles"
        :key="article.id"
        class="article-item"
        :class="{ 'article-item--bordered': index !== articles.length - 1 }"
        @tap="openArticle(article)"
      >
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
  padding: 0 32rpx 26rpx;
  background: #fff;
}

.article-list__state {
  padding: 72rpx 0;
  text-align: center;
  color: #999;
  font-size: 24rpx;
}

.article-item {
  display: flex;
  gap: 24rpx;
  padding: 32rpx 0;
}

.article-item--bordered {
  border-bottom: 1rpx solid #f0f0f0;
}

.article-item__body {
  display: flex;
  min-width: 0;
  min-height: 180rpx;
  flex: 1;
  flex-direction: column;
}

.article-item__title {
  display: -webkit-box;
  overflow: hidden;
  color: #111827;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-item__subtitle {
  margin-top: 8rpx;
  color: #9ca3af;
  font-size: 20rpx;
  line-height: 1.4;
}

.article-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: auto;
}

.article-item__tag {
  padding: 6rpx 10rpx;
  border: 1rpx solid #ffdbdb;
  border-radius: 6rpx;
  background: #fff0f0;
  color: #c8161d;
  font-size: 20rpx;
  line-height: 1;
}

.article-item__image {
  width: 180rpx;
  height: 180rpx;
  flex-shrink: 0;
  border-radius: 12rpx;
  background: #f3f4f6;
}
</style>
