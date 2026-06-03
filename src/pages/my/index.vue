<template>
  <view class="my-page">
    <ProfileHero :profile="profileInfo" />
    <RecentReading :items="recentReadItems" @select="openRecentReading" />
    <MemberBanner :banner="memberBanner" />
    <ProfileMenu :items="profileMenuItems" />
  </view>
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
    url: `/subPages/book/index?title=${encodeURIComponent(title)}`,
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
  background: #f5f6f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.my-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f5f6f8;
}
</style>
