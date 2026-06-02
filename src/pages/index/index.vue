<template>
  <view class="index-page">
    <QSHeader />

    <view class="index-page__carousel">
      <QSMagazineSwiper />
    </view>

    <view class="index-page__content">
      <QSSubscriptionBanner />
      <view class="article-section">
        <QSCategoryTabs />
        <QSArticleList />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import QSHeader from './components/QSHeader.vue';
import QSMagazineSwiper from './components/QSMagazineSwiper.vue';
import QSSubscriptionBanner from './components/QSSubscriptionBanner.vue';
import QSCategoryTabs from './components/QSCategoryTabs.vue';
import QSArticleList from './components/QSArticleList.vue';
import { useMagazineStore } from '@/store/magazineStore';

const store = useMagazineStore();

onLoad(() => {
  store.fetchArticles();
});

onPullDownRefresh(async () => {
  await store.fetchArticles();
  uni.stopPullDownRefresh();

  if (!store.errorMessage) {
    uni.showToast({
      title: '更新成功',
      icon: 'success',
      duration: 1000
    });
  }
});
</script>

<style lang="scss">
page {
  background-color: #f5f6f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.index-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f5f6f8;
}

.index-page__carousel {
  position: relative;
  z-index: 2;
  margin-top: -110rpx;
}

.index-page__content {
  position: relative;
  z-index: 1;
  margin: 20rpx 32rpx 160rpx;
}

.article-section {
  overflow: hidden;
  margin-top: 8rpx;
  border: 1rpx solid #f0f0f0;
  border-radius: 18rpx;
  background: #fff;
  box-shadow: 0 10rpx 30rpx rgba(25, 28, 34, 0.04);
  margin-top: 40rpx;
}
</style>
