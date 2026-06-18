<template>
  <view class="catalog-page" :class="{ 'catalog-page--home': isHomeDirectory }">
    <scroll-view class="catalog-page__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
      :bounces="false">
      <view class="catalog-page__inner">
        <view v-if="isHomeDirectory" class="catalog-home-header" :style="homeHeaderStyle">
          <button class="catalog-home-header__back" :style="homeBackStyle" @tap="goBack">
            <uni-icons type="left" size="23" color="#ffffff" />
          </button>
          <text>{{ directory.issueTitle }}</text>
        </view>
        <QSSubPageHeader v-else title="目录" />

        <view class="catalog-page__content">
          <view class="catalog-card">
            <view class="catalog-card__issue">
              <text class="catalog-card__issue-title">{{ isHomeDirectory ? '目录' : directory.issueTitle }}</text>
              <text v-if="!isHomeDirectory" class="catalog-card__issue-desc">
                《求是》 {{ directory.issueTitle.replace('第', ' 第') }}
              </text>
            </view>

            <view class="catalog-card__header">
              <view class="catalog-card__mark"></view>
              <text class="catalog-card__title">{{ directory.guideTitle }}</text>
            </view>

            <view v-if="!directory.items.length" class="catalog-card__empty">暂无目录内容</view>

            <view v-else class="catalog-list">
              <view v-for="(item, index) in directory.items" :key="item.id" class="catalog-item"
                @tap="openArticle(item)">
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
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { homeIssueDirectories, issueDirectory } from '@/subPages/config/articleDetail';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useMagazineStore } from '@/store/magazineStore';
import type { IssueDirectory, IssueDirectoryItem } from '@/types/articleDetail';

interface CatalogQuery {
  publicationId?: string;
}

const directory = ref<IssueDirectory>(issueDirectory);
const store = useMagazineStore();
const openingItemId = ref('');
const promptingSubscribe = ref(false);
const isHomeDirectory = ref(false);
const { safeArea } = useSafeArea();

const homeHeaderStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));

const homeBackStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`
}));

const formatOrder = (index: number) => String(index + 1).padStart(2, '0');

onLoad((query?: CatalogQuery) => {
  const publicationId = typeof query?.publicationId === 'string'
    ? decodeURIComponent(query.publicationId)
    : '';
  const matchedDirectory = homeIssueDirectories[publicationId];

  if (matchedDirectory) {
    directory.value = matchedDirectory;
    isHomeDirectory.value = true;
  }
});

const openArticle = (item: IssueDirectoryItem) => {
  if (openingItemId.value || promptingSubscribe.value) return;

  if (!isHomeDirectory.value && !store.isSubscribed) {
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

  const articleId = item.targetArticleId || directory.value.targetArticleId;
  if (!articleId) {
    uni.showToast({
      title: '文章信息不可用',
      icon: 'none'
    });
    return;
  }

  openingItemId.value = item.id;

  uni.navigateTo({
    url: `/subPages/article-detail/index?id=${encodeURIComponent(articleId)}`,
    fail: () => {
      uni.showToast({
        title: '打开文章失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        if (openingItemId.value === item.id) {
          openingItemId.value = '';
        }
      }, 500);
    }
  });
};

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({
    url: '/pages/index/index'
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
  height: 100%;
  overflow: hidden;
  background: var(--qs-page-bg-soft);
}

.catalog-page__scroll {
  height: 100%;
  background: var(--qs-page-bg-soft);
}

.catalog-page--home,
.catalog-page--home .catalog-page__scroll {
  background: #fff;
}

.catalog-home-header {
  position: relative;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 70rpx;
  padding-left: 70rpx;
  background: #241f1d;
  box-sizing: border-box;
  color: #fff;
  font-size: 27rpx;
  line-height: 1.25;
  text-align: center;
}

.catalog-home-header__back {
  position: absolute;
  left: 20rpx;
  bottom: 6rpx;
  display: flex;
  width: 64rpx;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;

  &::after {
    border: 0;
  }
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

.catalog-page--home .catalog-page__content {
  margin-top: 0;
  padding: 0 34rpx 70rpx;
}

.catalog-card {
  overflow: hidden;
  border-radius: var(--qs-radius-card);
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-card);
}

.catalog-page--home .catalog-card {
  border-radius: 0;
  box-shadow: none;
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

.catalog-page--home .catalog-card__issue {
  padding: 22rpx 0 28rpx;
}

.catalog-page--home .catalog-card__issue-title {
  color: #a33b35;
  font-size: 38rpx;
  text-align: center;
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

.catalog-page--home .catalog-card__header {
  padding: 22rpx 10rpx;
}

.catalog-page--home .catalog-card__mark {
  display: none;
}

.catalog-page--home .catalog-card__title {
  font-size: 33rpx;
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

.catalog-page--home .catalog-list {
  padding: 0 10rpx 20rpx;
}

.catalog-item {
  display: flex;
  align-items: flex-start;
  gap: 22rpx;
  padding: 28rpx 0;
  border-top: 1rpx solid var(--qs-border-color-light);
}

.catalog-page--home .catalog-item {
  gap: 12rpx;
  padding: 30rpx 0;
}

.catalog-page--home .catalog-item__index,
.catalog-page--home .catalog-item__arrow {
  display: none;
}

.catalog-page--home .catalog-item__title {
  font-size: 30rpx;
  line-height: 1.6;
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
