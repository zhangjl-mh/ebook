<template>
  <view class="category-tabs mt-4">
    <view v-for="tab in store.config.tabCategories" :key="tab.key" class="category-tabs__item"
      :class="{ 'category-tabs__item--active': store.activeTab === tab.key }" @tap="store.setActiveTab(tab.key)">
      {{ tab.name }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { useMagazineStore } from '@/store/magazineStore';

const store = useMagazineStore();
</script>

<style lang="scss" scoped>
.category-tabs {
  display: flex;
  align-items: center;
  gap: 58rpx;
  padding: 28rpx 38rpx 0;
  border-bottom: 1rpx solid $qs-border-color;
  background: $qs-card-bg;
}

.category-tabs__item {
  padding-bottom: 20rpx;
  border-bottom: 5rpx solid transparent;
  color: var(--qs-text-muted);
  font-size: 31rpx;
  font-weight: 500;
  line-height: 1.25;
}

.category-tabs__item--active {
  border-bottom-color: $qs-color-primary;
  color: $qs-color-primary;
  font-weight: 700;
}
</style>
