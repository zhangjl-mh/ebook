<template>
  <view class="profile-menu">
    <view v-for="item in items" :key="item.id" class="profile-menu__item" hover-class="profile-menu__item--pressed"
      hover-stay-time="120">
      <view class="profile-menu__icon">
        <view class="profile-menu__icon-dot"></view>
        <view class="profile-menu__icon-lines">
          <view></view>
          <view></view>
          <view></view>
        </view>
      </view>

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
  border-radius: var(--qs-radius-panel);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, #fff 100%);
  box-shadow: var(--qs-shadow-card-soft);
}

.profile-menu__item {
  position: relative;
  display: flex;
  align-items: center;
  height: 112rpx;
  margin: 0 30rpx;
  border-bottom: 1rpx solid var(--qs-border-color);
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.profile-menu__item--pressed {
  opacity: 0.82;
  transform: scale(0.99);
}

.profile-menu__item:last-child {
  border-bottom: none;
}

/* 左侧列表图标 */
.profile-menu__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58rpx;
  height: 58rpx;
  flex-shrink: 0;
  margin-right: 30rpx;
  border: 1rpx solid rgba(223, 21, 31, 0.12);
  border-radius: 16rpx;
  background: linear-gradient(145deg, #fff7f7 0%, #fff0f0 100%);
}

.profile-menu__icon-dot {
  display: flex;
  flex-direction: column;
  gap: 7rpx;
  margin-right: 7rpx;
}

.profile-menu__icon-dot::before,
.profile-menu__icon-dot::after,
.profile-menu__icon-dot {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: var(--qs-color-primary);
}

.profile-menu__icon-dot::before,
.profile-menu__icon-dot::after {
  display: block;
  content: '';
}

.profile-menu__icon-lines {
  display: flex;
  flex-direction: column;
  gap: 7rpx;
}

.profile-menu__icon-lines view {
  width: 24rpx;
  height: 5rpx;
  border-radius: 999rpx;
  background: var(--qs-color-primary);
}

.profile-menu__label {
  flex: 1;
  color: var(--qs-text-main);
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
