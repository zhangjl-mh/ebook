<template>
  <view class="subscription-banner mt-4">
    <image :src="store.config.subscription.bellIcon" mode="aspectFit" class="subscription-banner__icon" />

    <view class="subscription-banner__content">
      <text class="subscription-banner__title">{{ store.config.subscription.title }}</text>
      <text class="subscription-banner__desc">{{ store.config.subscription.description }}</text>
    </view>

    <button class="subscription-banner__button" :class="{ 'subscription-banner__button--done': store.isSubscribed }"
      @tap="store.subscribe()">
      {{ store.isSubscribed ? '已订阅' : store.config.subscription.btnText }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { useMagazineStore } from '@/store/magazineStore';

const store = useMagazineStore();
</script>

<style lang="scss" scoped>
.subscription-banner {
  display: flex;
  align-items: center;
  gap: 22rpx;
  min-height: 128rpx;
  padding: 20rpx 30rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.92);
  border-radius: 16rpx;
  background: linear-gradient(90deg, #fff7f2 0%, #fffdfb 100%);
  box-sizing: border-box;
  box-shadow: 0 10rpx 28rpx rgba(170, 36, 25, 0.04);
}

.subscription-banner__icon {
  width: 66rpx;
  height: 66rpx;
  flex-shrink: 0;
}

.subscription-banner__content {
  min-width: 0;
  flex: 1;
}

.subscription-banner__title {
  display: block;
  color: #c8161d;
  font-size: 29rpx;
  font-weight: 700;
  line-height: 1.25;
}

.subscription-banner__desc {
  display: -webkit-box;
  margin-top: 10rpx;
  overflow: hidden;
  color: #6f7378;
  font-size: 24rpx;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.subscription-banner__button {
  height: 58rpx;
  margin: 0;
  padding: 0 28rpx;
  border: none;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #ee3337 0%, #c9161d 100%);
  color: #fff;
  font-size: 25rpx;
  font-weight: 600;
  line-height: 58rpx;

  &::after {
    border: none;
  }
}

.subscription-banner__button--done {
  background: #8b949e;
}
</style>
