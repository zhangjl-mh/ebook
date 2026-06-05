<template>
  <scroll-view class="my-page" :scroll-y="true" :enable-flex="true">
    <view class="my-page__inner">
      <ProfileHero :profile="profileInfo" />
      <RecentReading :items="recentReadItems" @select="openRecentReading" />
      <MemberBanner :banner="memberBanner" />
      <ProfileMenu :items="profileMenuItems" />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MemberBanner from './components/MemberBanner.vue';
import ProfileHero from './components/ProfileHero.vue';
import ProfileMenu from './components/ProfileMenu.vue';
import RecentReading from './components/RecentReading.vue';
import { memberBanner, profileInfo, profileMenuItems, recentReadItems } from '@/config/userCenter';
import type { RecentReadItem } from '@/types/pageData';

const openingRecentId = ref('');

const openRecentReading = (item: RecentReadItem) => {
  if (openingRecentId.value) return;

  const title = item.issueTitle.trim();

  if (!title) {
    uni.showToast({
      title: '期刊信息不可用',
      icon: 'none'
    });
    return;
  }

  openingRecentId.value = item.id;

  uni.navigateTo({
    url: `/subPages/book/index?title=${encodeURIComponent(title)}&issueId=${encodeURIComponent(item.issueId)}`,
    fail: () => {
      uni.showToast({
        title: '打开电子刊失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        if (openingRecentId.value === item.id) {
          openingRecentId.value = '';
        }
      }, 500);
    }
  });
};
</script>

<style lang="scss">
page {
  background: var(--qs-page-bg);
}

.my-page {
  height: 100vh;
  overflow-x: hidden;
  background: var(--qs-page-bg);
}

.my-page__inner {
  min-height: 100%;
  background: var(--qs-page-bg);
  box-sizing: border-box;
}
</style>
