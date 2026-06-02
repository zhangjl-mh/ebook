<template>
  <view class="profile-menu">
    <view v-for="item in items" :key="item.id" class="profile-menu__item" hover-class="profile-menu__item--pressed" hover-stay-time="120">
      <view class="profile-menu__icon" :class="`profile-menu__icon--${item.icon}`"></view>
      <text class="profile-menu__label">{{ item.label }}</text>
      <view class="profile-menu__arrow"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ProfileMenuItem } from '@/types/pageData';

interface Props {
  items: ProfileMenuItem[];
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.profile-menu {
  overflow: hidden;
  margin: 0 36rpx 154rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.86);
  border-radius: 24rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, #fff 100%);
  box-shadow: 0 16rpx 42rpx rgba(25, 28, 34, 0.06);
}

.profile-menu__item {
  position: relative;
  display: flex;
  align-items: center;
  height: 112rpx;
  margin: 0 30rpx;
  border-bottom: 1rpx solid rgba(230, 232, 236, 0.9);
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.profile-menu__item--pressed {
  opacity: 0.82;
  transform: scale(0.99);
}

.profile-menu__item:last-child {
  border-bottom: none;
}

.profile-menu__icon {
  position: relative;
  width: 58rpx;
  height: 58rpx;
  flex-shrink: 0;
  margin-right: 30rpx;
  box-sizing: border-box;
  border: 1rpx solid rgba(223, 21, 31, 0.12);
  border-radius: 16rpx;
  background: linear-gradient(145deg, #fff7f7 0%, #fff0f0 100%);
  color: #df151f;
}

.profile-menu__icon::before,
.profile-menu__icon::after {
  position: absolute;
  box-sizing: border-box;
  content: '';
}

.profile-menu__icon--order::before,
.profile-menu__icon--invoice::before {
  top: 12rpx;
  left: 17rpx;
  width: 24rpx;
  height: 34rpx;
  border: 3rpx solid currentColor;
  border-radius: 5rpx;
}

.profile-menu__icon--order::before,
.profile-menu__icon--invoice::before {
  background: #fff;
}

.profile-menu__icon--order::after,
.profile-menu__icon--invoice::after {
  position: absolute;
  top: 23rpx;
  left: 24rpx;
  width: 10rpx;
  height: 3rpx;
  border-radius: 999rpx;
  background: currentColor;
  box-shadow: 0 9rpx 0 currentColor, 0 18rpx 0 currentColor;
  content: '';
}

.profile-menu__icon--invoice::after {
  top: 22rpx;
  left: 22rpx;
  width: 14rpx;
  box-shadow: 0 9rpx 0 currentColor;
}

.profile-menu__icon--invoice::before {
  border-bottom-style: dashed;
  border-radius: 5rpx 5rpx 2rpx 2rpx;
}

.profile-menu__icon--verify::before {
  top: 11rpx;
  left: 15rpx;
  width: 28rpx;
  height: 34rpx;
  border: 3rpx solid currentColor;
  border-radius: 9rpx 9rpx 16rpx 16rpx;
  background: #fff;
}

.profile-menu__icon--verify::after {
  top: 24rpx;
  left: 25rpx;
  width: 11rpx;
  height: 17rpx;
  border-right: 4rpx solid currentColor;
  border-bottom: 4rpx solid currentColor;
  transform: rotate(42deg);
}

.profile-menu__icon--favorite::before {
  top: 2rpx;
  left: 10rpx;
  color: currentColor;
  font-size: 40rpx;
  line-height: 1;
  content: '☆';
}

.profile-menu__icon--favorite::after {
  right: 13rpx;
  bottom: 12rpx;
  width: 20rpx;
  height: 3rpx;
  border-radius: 999rpx;
  background: currentColor;
}

.profile-menu__icon--service::before {
  top: 15rpx;
  left: 15rpx;
  width: 28rpx;
  height: 26rpx;
  border: 3rpx solid currentColor;
  border-bottom-color: transparent;
  border-radius: 18rpx 18rpx 8rpx 8rpx;
}

.profile-menu__icon--service::after {
  top: 28rpx;
  left: 11rpx;
  width: 7rpx;
  height: 15rpx;
  border-radius: 999rpx;
  background: currentColor;
  box-shadow: 40rpx 0 0 currentColor, 24rpx 13rpx 0 -1rpx currentColor;
}

.profile-menu__label {
  flex: 1;
  color: #1f2024;
  font-size: 32rpx;
  font-weight: 500;
  line-height: 1;
}

.profile-menu__arrow {
  position: absolute;
  right: 2rpx;
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #f7f8fa;
}

.profile-menu__arrow::after {
  position: absolute;
  top: 11rpx;
  left: 12rpx;
  width: 11rpx;
  height: 11rpx;
  border-top: 3rpx solid #8c9096;
  border-right: 3rpx solid #8c9096;
  transform: rotate(45deg);
  content: '';
}
</style>
