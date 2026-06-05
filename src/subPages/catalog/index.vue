<template>
  <view class="catalog-page">
    <scroll-view class="catalog-page__scroll" :scroll-y="true" :enable-flex="true">
      <view class="catalog-page__inner">
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
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { issueDirectory } from '@/config/articleDetail';
import { useMagazineStore } from '@/store/magazineStore';

const directory = issueDirectory;
const store = useMagazineStore();
const openingItemId = ref('');
const promptingSubscribe = ref(false);

const formatOrder = (index: number) => String(index + 1).padStart(2, '0');

const openArticle = (itemId: string) => {
  if (openingItemId.value || promptingSubscribe.value) return;

  if (!store.isSubscribed) {
    promptingSubscribe.value = true;

    uni.showModal({
      title: '会员专享',
      content: '开通会员后可阅读完整文章，是否前往开通？',
      confirmText: '去开通',
      cancelText: '暂不开通',
      success: (res) => {
        if (res.confirm) {
          store.openSubscriptionPage();
        }
      },
      complete: () => {
        promptingSubscribe.value = false;
      }
    });

    return;
  }

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
  background: var(--qs-page-bg-soft);
}
</style>

<style lang="scss" scoped>
.catalog-page {
  height: 100vh;
  background: var(--qs-page-bg-soft);
}

.catalog-page__scroll {
  height: 100%;
  background: var(--qs-page-bg-soft);
}

.catalog-page__inner {
  min-height: 100%;
  box-sizing: border-box;
}

.catalog-page__content {
  position: relative;
  z-index: 3;
  margin-top: -92rpx;
  padding: 0 var(--qs-page-padding-x) 70rpx;
}

.catalog-card {
  overflow: hidden;
  border-radius: var(--qs-radius-card);
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-card);
}

.catalog-card__issue {
  padding: 38rpx 34rpx 12rpx;
}

.catalog-card__issue-title {
  display: block;
  color: var(--qs-text-main);
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
  color: var(--qs-text-placeholder);
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
  border-top: 1rpx solid var(--qs-border-color-light);
}

.catalog-item__index {
  width: 46rpx;
  flex-shrink: 0;
  color: var(--qs-color-primary);
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
