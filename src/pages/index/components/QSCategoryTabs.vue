<template>
  <view class="category-tabs">
    <view
      v-for="tab in store.config.tabCategories"
      :key="tab.key"
      class="category-tabs__item"
      :class="{ 'category-tabs__item--active': store.activeTab === tab.key }"
      @tap="store.setActiveTab(tab.key)"
    >
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
  gap: 56rpx;
  padding: 28rpx 40rpx 0;
  background: #fff;
}

.category-tabs__item {
  padding-bottom: 16rpx;
  border-bottom: 6rpx solid transparent;
  color: #9ca3af;
  font-size: 30rpx;
  font-weight: 500;
}

.category-tabs__item--active {
  border-bottom-color: #c8161d;
  color: #c8161d;
  font-weight: 700;
}
</style>
