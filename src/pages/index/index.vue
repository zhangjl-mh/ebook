<template>
  <view class="index-page qs-page">
    <scroll-view class="index-page__scroll qs-page-scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
      :bounces="false">
      <view class="index-page__inner">
        <QSHeader @open-ai="openAiAssistant" />
        <QSCategoryTabs />
        <QSHomeSections />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import QSHeader from './components/QSHeader.vue';
import QSCategoryTabs from './components/QSCategoryTabs.vue';
import QSHomeSections from './components/QSHomeSections.vue';
import { useMagazineStore } from '@/store/magazineStore';

const store = useMagazineStore();
const openingAiPage = ref(false);

const openAiAssistant = () => {
  if (openingAiPage.value) return;

  openingAiPage.value = true;
  uni.navigateTo({
    url: '/subPages/profile-feature/index?type=ai',
    fail: () => {
      uni.showToast({
        title: 'AI小是打开失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        openingAiPage.value = false;
      }, 500);
    }
  });
};

onLoad(() => {
  // #ifdef MP-WEIXIN
  store.fetchArticles();
  // #endif
});
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
}

.index-page {
  height: 100%;
  background: #f5f5f5;
}

.index-page__scroll {
  background: #f5f5f5;
}

.index-page__inner {
  min-height: 100%;
  overflow-x: hidden;
  padding-bottom: var(--qs-page-bottom-gap);
  background: #f5f5f5;
  box-sizing: border-box;
}

</style>
