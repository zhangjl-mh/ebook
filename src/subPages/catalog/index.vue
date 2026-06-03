<template>
  <view class="catalog-page">
    <QSSubPageHeader title="目录" />

    <view class="catalog-page__content">
      <view class="catalog-card">
        <view class="catalog-card__issue">
          <text class="catalog-card__issue-title">{{ directory.issueTitle }}</text>
          <text class="catalog-card__issue-desc">《求是》 {{ directory.issueTitle.replace('第', ' 第') }}</text>
        </view>

        <view class="catalog-card__header">
          <view class="catalog-card__mark"></view>
          <text class="catalog-card__title">{{ directory.guideTitle }}</text>
        </view>

        <view v-if="!directory.items.length" class="catalog-card__empty">暂无目录内容</view>

        <view v-else class="catalog-list">
          <view v-for="(item, index) in directory.items" :key="item.id" class="catalog-item"
            @tap="openArticle(item.id)">
            <text class="catalog-item__index">{{ formatOrder(index) }}</text>
            <view class="catalog-item__body">
              <text class="catalog-item__title">{{ item.title }}</text>
              <text v-if="item.author" class="catalog-item__author">/{{ item.author }}</text>
            </view>
            <text class="catalog-item__arrow">›</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { issueDirectory } from '@/config/articleDetail';
import { safeDecode } from '@/utils/text';

type CatalogQuery = Record<string, string | undefined>;

const directory = issueDirectory;
const openingItemId = ref('');

onLoad((query?: CatalogQuery) => {
  const issueId = safeDecode(query?.issueId);

  if (issueId && issueId !== directory.issueId) {
    uni.showToast({
      title: '目录参数无效，已显示默认目录',
      icon: 'none'
    });
  }
});

const formatOrder = (index: number) => String(index + 1).padStart(2, '0');

const openArticle = (itemId: string) => {
  if (openingItemId.value) return;

  openingItemId.value = itemId;

  uni.navigateTo({
    url: `/subPages/article-detail/index?id=${encodeURIComponent(directory.targetArticleId)}`,
    fail: () => {
      uni.showToast({
        title: '打开文章失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        if (openingItemId.value === itemId) {
          openingItemId.value = '';
        }
      }, 500);
    }
  });
};
</script>

<style lang="scss">
page {
  background: #f6f7f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>

<style lang="scss" scoped>
.catalog-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f6f7f9;
}

.catalog-page__content {
  position: relative;
  z-index: 3;
  margin-top: -92rpx;
  padding: 0 30rpx 70rpx;
}

.catalog-card {
  overflow: hidden;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: 0 18rpx 42rpx rgba(56, 28, 28, 0.08);
}

.catalog-card__issue {
  padding: 38rpx 34rpx 12rpx;
}

.catalog-card__issue-title {
  display: block;
  color: #202228;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 1.25;
}

.catalog-card__issue-desc {
  display: block;
  margin-top: 12rpx;
  color: #7b8088;
  font-size: 25rpx;
  line-height: 1.4;
}

.catalog-card__header {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 22rpx 34rpx;
}

.catalog-card__mark {
  width: 8rpx;
  height: 34rpx;
  border-radius: 999rpx;
  background: #e31822;
}

.catalog-card__title {
  color: #1f2024;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1.2;
}

.catalog-card__empty {
  padding: 88rpx 0;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}

.catalog-list {
  padding: 0 34rpx 20rpx;
}

.catalog-item {
  display: flex;
  align-items: flex-start;
  gap: 22rpx;
  padding: 28rpx 0;
  border-top: 1rpx solid #f0f1f3;
}

.catalog-item__index {
  width: 46rpx;
  flex-shrink: 0;
  color: #d71920;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 1.7;
}

.catalog-item__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8rpx;
}

.catalog-item__title {
  color: #24262b;
  font-size: 29rpx;
  font-weight: 600;
  line-height: 1.55;
}

.catalog-item__author {
  color: #80858d;
  font-size: 24rpx;
  line-height: 1.55;
}

.catalog-item__arrow {
  flex-shrink: 0;
  color: #b6bac2;
  font-size: 36rpx;
  line-height: 1.1;
}
</style>
