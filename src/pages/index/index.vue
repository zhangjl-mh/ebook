<template>
  <view class="min-h-screen bg-[#f7f7f9] flex flex-col font-sans select-none overflow-x-hidden relative">
    <!-- Premium Header & Search area -->
    <QSHeader />

    <!-- Magazine Stack Slider -->
    <QSMagazineSwiper />

    <!-- Premium Subscription Banner -->
    <QSSubscriptionBanner />

    <!-- Article Content list matching selected tab -->
    <QSArticleList />
  </view>
</template>

<script setup lang="ts">
import { onPullDownRefresh } from '@dcloudio/uni-app';
import QSHeader from '../../components/QSHeader.vue';
import QSMagazineSwiper from '../../components/QSMagazineSwiper.vue';
import QSSubscriptionBanner from '../../components/QSSubscriptionBanner.vue';
import QSArticleList from '../../components/QSArticleList.vue';
import { useMagazineStore } from '../../store/magazineStore';

const store = useMagazineStore();

// Handle pull to refresh simulation
onPullDownRefresh(() => {
  setTimeout(() => {
    uni.stopPullDownRefresh();
    uni.showToast({
      title: '更新成功',
      icon: 'success',
      duration: 1000
    });
  }, 800);
});
</script>

<style lang="scss">
/* Page specific smooth styles */
page {
  background-color: #f7f7f9;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
</style>

