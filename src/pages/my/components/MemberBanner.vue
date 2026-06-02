<template>
  <view class="member-banner">
    <image :src="banner.bg" mode="aspectFill" class="member-banner__bg" />
    <view class="member-banner__content">
      <text class="member-banner__title">{{ banner.title }}</text>
      <text class="member-banner__desc">{{ banner.desc }}</text>
    </view>
    <button class="member-banner__button">{{ banner.buttonText }} ›</button>
  </view>
</template>

<script setup lang="ts">
import type { MemberBanner } from '@/types/pageData';

interface Props {
  banner: MemberBanner;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.member-banner {
  position: relative;
  display: flex;
  align-items: center;
  height: 124rpx;
  margin: 0 24rpx 24rpx;
  overflow: hidden;
  border: 1rpx solid #ededf0;
  border-radius: 22rpx;
  background: linear-gradient(135deg, #fff 0%, #fff6f5 100%);
  box-shadow: 0 14rpx 34rpx rgba(24, 24, 24, 0.05);
}

.member-banner__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.22;
}

.member-banner__content {
  position: relative;
  flex: 1;
  min-width: 0;
  padding-left: 34rpx;
}

.member-banner__title {
  display: block;
  color: #8e1519;
  font-size: 32rpx;
  font-weight: 700;
}

.member-banner__desc {
  display: block;
  margin-top: 10rpx;
  color: #69635f;
  font-size: 24rpx;
}

.member-banner__button {
  position: relative;
  height: 60rpx;
  margin: 0 26rpx 0 18rpx;
  padding: 0 28rpx;
  border: none;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #e01d22, #bd0710);
  color: #fff;
  font-size: 26rpx;
  line-height: 60rpx;
  box-shadow: 0 10rpx 22rpx rgba(210, 22, 29, 0.22);

  &::after {
    border: none;
  }
}
</style>
