<template>
  <view class="subscription-banner">
    <image :src="store.config.subscription.bellIcon" mode="aspectFit" class="subscription-banner__icon" />

    <view class="subscription-banner__content">
      <text class="subscription-banner__title">{{ store.config.subscription.title }}</text>
      <text class="subscription-banner__desc">{{ store.config.subscription.description }}</text>
    </view>

    <button
      class="subscription-banner__button"
      :class="{ 'subscription-banner__button--done': store.isSubscribed }"
      @tap="store.subscribe()"
    >
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
  gap: 20rpx;
  margin: 24rpx 32rpx;
  padding: 24rpx;
  border: 1rpx solid #ffe0c4;
  border-radius: 16rpx;
  background: #fff7ed;
}

.subscription-banner__icon {
  width: 72rpx;
  height: 72rpx;
  flex-shrink: 0;
}

.subscription-banner__content {
  min-width: 0;
  flex: 1;
}

.subscription-banner__title {
  display: block;
  color: #8a1f11;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 1.4;
}

.subscription-banner__desc {
  display: -webkit-box;
  margin-top: 4rpx;
  overflow: hidden;
  color: #9b5145;
  font-size: 20rpx;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.subscription-banner__button {
  height: 64rpx;
  margin: 0;
  padding: 0 28rpx;
  border: none;
  border-radius: 999rpx;
  background: #c8161d;
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 64rpx;

  &::after {
    border: none;
  }
}

.subscription-banner__button--done {
  background: #059669;
}
</style>
