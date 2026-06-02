<template>
  <view class="profile-menu">
    <view v-for="item in items" :key="item.id" class="profile-menu__item">
      <image :src="item.icon" mode="aspectFit" class="profile-menu__icon" />
      <text class="profile-menu__label">{{ item.label }}</text>
      <text class="profile-menu__arrow">›</text>
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
  margin: 0 24rpx 154rpx;
  border: 1rpx solid #ededf0;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 16rpx 40rpx rgba(24, 24, 24, 0.05);
}

.profile-menu__item {
  display: flex;
  align-items: center;
  height: 104rpx;
  margin: 0 30rpx;
  border-bottom: 1rpx solid #ededf0;
}

.profile-menu__item:last-child {
  border-bottom: none;
}

.profile-menu__icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 34rpx;
}

.profile-menu__label {
  flex: 1;
  color: #222;
  font-size: 32rpx;
  font-weight: 500;
}

.profile-menu__arrow {
  color: #8f8a85;
  font-size: 48rpx;
  line-height: 1;
}
</style>
