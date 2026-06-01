<template>
  <view class="index-page">
    <QSHeader />
    <QSMagazineSwiper />
    <QSSubscriptionBanner />

    <view class="article-section">
      <QSCategoryTabs />
      <QSArticleList />
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
  background-color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.index-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f5f5f7;
}

.article-section {
  margin: 24rpx 32rpx 160rpx;
  overflow: hidden;
  border: 1rpx solid #f0f0f0;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.03);
}
</style>
