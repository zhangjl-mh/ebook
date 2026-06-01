<template>
  <view class="min-h-screen bg-[#f5f5f7] flex flex-col font-sans select-none overflow-x-hidden relative">
    <!-- 顶部Header + 搜索 -->
    <QSHeader />

    <!-- 杂志期刊轮播 -->
    <QSMagazineSwiper />

    <!-- 订阅横幅 -->
    <QSSubscriptionBanner />

    <!-- Tab分类 + 文章列表 合为一个白色卡片 -->
    <view class="article-section mx-4 mb-24 rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100">
      <QSCategoryTabs />
      <view class="w-full h-[1px] bg-gray-100"></view>
      <QSArticleList />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import QSHeader from '../../components/QSHeader.vue';
import QSMagazineSwiper from '../../components/QSMagazineSwiper.vue';
import QSSubscriptionBanner from '../../components/QSSubscriptionBanner.vue';
import QSCategoryTabs from '../../components/QSCategoryTabs.vue';
import QSArticleList from '../../components/QSArticleList.vue';
import { useMagazineStore } from '../../store/magazineStore';

const store = useMagazineStore();

onLoad(() => {
  store.fetchArticles();
});

// Handle pull to refresh simulation
onPullDownRefresh(async () => {
  await store.fetchArticles();
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
  background-color: #f5f5f7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.article-section {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}
</style>
