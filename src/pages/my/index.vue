<template>
  <view class="my-page">
    <ProfileHero :profile="profileInfo" />
    <RecentReading :items="recentReadItems" />
    <MemberBanner :banner="memberBanner" />
    <ProfileMenu :items="profileMenuItems" />
  </view>
</template>

<script setup lang="ts">
import MemberBanner from './components/MemberBanner.vue';
import ProfileHero from './components/ProfileHero.vue';
import ProfileMenu from './components/ProfileMenu.vue';
import RecentReading from './components/RecentReading.vue';
import { memberBanner, profileInfo, profileMenuItems, recentReadItems } from '@/config/userCenter';
</script>

<style lang="scss">
page {
  background: #f5f5f7;
}

.my-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: #f5f5f7;
}
</style>
