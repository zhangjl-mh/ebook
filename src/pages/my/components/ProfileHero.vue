<template>
  <view class="profile-hero">
    <view class="profile-hero__bar" :style="barStyle">
      <text class="profile-hero__title">我的</text>
    </view>

    <view class="profile-hero__card">
      <view class="profile-hero__avatar">
        <view class="profile-hero__avatar-face"></view>
        <view class="profile-hero__avatar-hair"></view>
        <view class="profile-hero__avatar-scarf"></view>
      </view>

      <view class="profile-hero__body">
        <text class="profile-hero__name">{{ profile.name }}</text>
        <view class="profile-hero__badges">
          <text v-for="badge in profile.badges" :key="badge.text" class="profile-hero__badge"
            :class="`profile-hero__badge--${badge.type}`">
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

const barStyle = computed<Record<string, string>>(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop}px`
}));
</script>

<style lang="scss" scoped>
.profile-hero {
  position: relative;
  overflow: hidden;
  padding: 0 36rpx 50rpx;
  box-sizing: border-box;
  background: linear-gradient(154deg, #e0151f 0%, #ee3137 52%, #ef3a3a 100%);
  border-radius: 0 0 10rpx 10rpx;
}

.profile-hero::after {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: 0;
  left: 0;
  height: 168rpx;
  background: linear-gradient(180deg, rgba(245, 246, 248, 0) 0%, rgba(245, 246, 248, 0.68) 64%, #f5f6f8 100%);
  content: '';
  pointer-events: none;
}

.profile-hero__bar {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 180rpx;
  box-sizing: border-box;
}

.profile-hero__title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1;
}

.profile-hero__card {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  min-height: 236rpx;
  margin-top: 72rpx;
  padding: 30rpx 34rpx;
  box-sizing: border-box;
  border: 1rpx solid rgba(255, 255, 255, 0.72);
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.97);
  box-shadow:
    0 14rpx 26rpx rgba(123, 0, 7, 0.08),
    0 32rpx 62rpx rgba(156, 0, 8, 0.12),
    0 58rpx 112rpx rgba(35, 28, 28, 0.08);
}

.profile-hero__avatar {
  position: relative;
  width: 150rpx;
  height: 150rpx;
  flex-shrink: 0;
  border: 12rpx solid #fff;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffe2a4 0%, #ffd17e 100%);
  box-shadow: 0 14rpx 28rpx rgba(216, 28, 34, 0.12);
}

.profile-hero__avatar::before {
  position: absolute;
  top: 18rpx;
  left: 18rpx;
  width: 114rpx;
  height: 114rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.58);
  border-radius: 50%;
  content: '';
}

.profile-hero__avatar-face {
  position: absolute;
  top: 38rpx;
  left: 34rpx;
  width: 82rpx;
  height: 76rpx;
  border-radius: 44rpx;
  background: #ffbc78;
}

.profile-hero__avatar-face::before,
.profile-hero__avatar-face::after {
  position: absolute;
  top: 34rpx;
  width: 11rpx;
  height: 11rpx;
  border-radius: 50%;
  background: #232d38;
  content: '';
}

.profile-hero__avatar-face::before {
  left: 22rpx;
}

.profile-hero__avatar-face::after {
  right: 22rpx;
}

.profile-hero__avatar-hair {
  position: absolute;
  top: 48rpx;
  left: 39rpx;
  width: 72rpx;
  height: 25rpx;
  border-radius: 2rpx 2rpx 0 0;
  background: #263142;
}

.profile-hero__avatar-scarf {
  position: absolute;
  right: 26rpx;
  bottom: 28rpx;
  left: 26rpx;
  height: 20rpx;
  border-radius: 999rpx;
  background: #d91820;
}

.profile-hero__body {
  min-width: 0;
  margin-left: 32rpx;
}

.profile-hero__name {
  display: block;
  margin-bottom: 22rpx;
  color: #111;
  font-size: 44rpx;
  font-weight: 700;
  line-height: 1;
}

.profile-hero__badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.profile-hero__badge {
  height: 44rpx;
  margin: 0 12rpx 14rpx 0;
  padding: 0 18rpx;
  border-radius: 999rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  line-height: 42rpx;
  white-space: nowrap;
}

.profile-hero__badge--gold,
.profile-hero__badge--red {
  border: 1rpx solid rgba(222, 21, 31, 0.46);
  color: #df151f;
}

.profile-hero__badge--gray {
  border: 1rpx solid #d5d8dd;
  color: #4c4f55;
}
</style>
