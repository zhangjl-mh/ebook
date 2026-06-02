<template>
  <view class="profile-hero">
    <image :src="profile.headerBg" mode="aspectFill" class="profile-hero__bg" />
    <image :src="profile.logo" mode="aspectFit" class="profile-hero__watermark" />

    <view class="profile-hero__bar" :style="barStyle">
      <text class="profile-hero__title">个人中心</text>
    </view>

    <view class="profile-hero__info">
      <image :src="profile.avatar" mode="aspectFill" class="profile-hero__avatar" />
      <view class="profile-hero__body">
        <text class="profile-hero__name">{{ profile.name }}</text>
        <view class="profile-hero__badges">
          <text v-for="badge in profile.badges" :key="badge.text" class="profile-hero__badge" :class="`profile-hero__badge--${badge.type}`">
            {{ badge.text }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import type { ProfileInfo } from '@/types/pageData';

interface Props {
  profile: ProfileInfo;
}

defineProps<Props>();

const { safeArea } = useSafeArea();

const barStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop}px`
}));
</script>

<style lang="scss" scoped>
.profile-hero {
  position: relative;
  min-height: 452rpx;
  overflow: hidden;
  padding-right: 32rpx;
  padding-left: 32rpx;
  background: linear-gradient(180deg, #f9f9f9 0%, #f1f2f4 72%, #f5f5f7 100%);
}

.profile-hero__bg,
.profile-hero__watermark {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.profile-hero__bg {
  opacity: 0.38;
}

.profile-hero__watermark {
  top: 40rpx;
  left: 28rpx;
  width: 176rpx;
  height: 84rpx;
  opacity: 0.1;
}

.profile-hero__bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.profile-hero__title {
  color: #171717;
  font-size: 38rpx;
  font-weight: 600;
}

.profile-hero__info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-top: 54rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18rpx 42rpx rgba(24, 24, 24, 0.06);
}

.profile-hero__avatar {
  width: 136rpx;
  height: 136rpx;
  flex-shrink: 0;
  border: 4rpx solid #fff;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 8rpx 22rpx rgba(210, 22, 29, 0.1);
}

.profile-hero__body {
  min-width: 0;
  margin-left: 30rpx;
}

.profile-hero__name {
  display: block;
  margin-bottom: 22rpx;
  color: #111;
  font-size: 42rpx;
  font-weight: 600;
}

.profile-hero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.profile-hero__badge {
  height: 42rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  font-size: 23rpx;
  line-height: 42rpx;
}

.profile-hero__badge--gold {
  border: 1rpx solid #f0c6c3;
  background: #fff4f2;
  color: #a62125;
}

.profile-hero__badge--gray {
  border: 1rpx solid #e2e4e8;
  background: #fff;
  color: #565b63;
}

.profile-hero__badge--red {
  border: 1rpx solid #f2b9b8;
  background: #fff5f4;
  color: #d2161d;
}
</style>
