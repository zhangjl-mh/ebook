<template>
  <view class="member-banner">
    <view class="member-banner__icon">
      <view class="member-banner__bookmark"></view>
    </view>
    <view class="member-banner__content">
      <text class="member-banner__title">{{ banner.title }}</text>
      <text class="member-banner__desc">{{ banner.desc }}</text>
    </view>
    <button class="member-banner__button">{{ banner.buttonText }} </button>
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
  min-height: 128rpx;
  margin: 0 36rpx 24rpx;
  padding: 26rpx 28rpx;
  box-sizing: border-box;
  border: 1rpx solid rgba(230, 31, 40, 0.08);
  border-radius: 18rpx;
  background: linear-gradient(110deg, #fff 0%, #fff7f6 58%, #fff1ef 100%);
  box-shadow: 0 14rpx 36rpx rgba(25, 28, 34, 0.05);
}

.member-banner__icon {
  position: relative;
  width: 76rpx;
  height: 76rpx;
  flex-shrink: 0;
  border-radius: 50%;
  background: linear-gradient(145deg, #e91d27 0%, #c90612 100%);
  box-shadow: 0 12rpx 24rpx rgba(216, 16, 24, 0.22);
}

.member-banner__bookmark {
  position: absolute;
  top: 18rpx;
  left: 24rpx;
  width: 28rpx;
  height: 38rpx;
  border-radius: 5rpx 5rpx 2rpx 2rpx;
  background: #fff;
}

.member-banner__bookmark::after {
  position: absolute;
  right: 0;
  bottom: -1rpx;
  left: 0;
  width: 0;
  height: 0;
  margin: 0 auto;
  border-right: 9rpx solid transparent;
  border-left: 9rpx solid transparent;
  border-bottom: 9rpx solid #e1141d;
  content: '';
}

.member-banner__bookmark::before {
  position: absolute;
  top: 9rpx;
  left: 7rpx;
  color: #df151f;
  font-size: 18rpx;
  line-height: 1;
  content: '★';
}

.member-banner__content {
  flex: 1;
  min-width: 0;
  margin-left: 24rpx;
}

.member-banner__title {
  display: block;
  color: #df151f;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1;
}

.member-banner__desc {
  display: block;
  margin-top: 16rpx;
  color: #62666d;
  font-size: 23rpx;
  line-height: 1;
  white-space: nowrap;
}

.member-banner__button {
  flex-shrink: 0;
  height: 60rpx;
  margin: 0 0 0 20rpx;
  padding: 0 28rpx;
  border: none;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #e21a24, #c60812);
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 60rpx;
  box-shadow: 0 10rpx 22rpx rgba(216, 16, 24, 0.2);
}

.member-banner__button::after {
  border: none;
}
</style>
