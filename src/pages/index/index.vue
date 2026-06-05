<template>
  <view class="index-page qs-page">
    <scroll-view class="index-page__scroll qs-page-scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
      :bounces="false">
      <view class="index-page__inner">
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
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
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
</script>

<style lang="scss">
page {
  background-color: var(--qs-page-bg);
}

.index-page {
  height: 100%;
  background: var(--qs-page-bg);
}

.index-page__scroll {
  background: var(--qs-page-bg);
}

.index-page__inner {
  min-height: 100%;
  overflow-x: hidden;
  padding-bottom: var(--qs-page-bottom-gap);
  background: var(--qs-page-bg);
  box-sizing: border-box;
}

.index-page__carousel {
  position: relative;
  z-index: 2;
  margin-top: -110rpx;
}

.index-page__content {
  position: relative;
  z-index: 1;
  margin: 20rpx 32rpx var(--qs-tabbar-bottom-space);
}

.article-section {
  overflow: hidden;
  border: 1rpx solid var(--qs-border-color-light);
  border-radius: 18rpx;
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-card-soft);
  margin-top: 40rpx;
}
</style>
