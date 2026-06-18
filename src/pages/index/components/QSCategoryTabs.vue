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
  justify-content: space-between;
  padding: 18rpx 18rpx 0;
  border-bottom: 1rpx solid #e4e4e4;
  background: #fff;
}

.category-tabs__item {
  min-width: 112rpx;
  padding-bottom: 16rpx;
  border-bottom: 3rpx solid transparent;
  color: #8c8c8c;
  font-size: 28rpx;
  font-weight: 400;
  line-height: 1.25;
  text-align: center;
}

.category-tabs__item--active {
  border-bottom-color: #d71920;
  color: #d71920;
  font-weight: 650;
}
</style>
