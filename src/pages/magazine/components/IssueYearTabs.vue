<template>
  <view class="year-tabs">
    <scroll-view class="year-tabs__scroller" scroll-x enable-flex show-scrollbar="false">
      <view class="year-tabs__scroller-inner">
        <button v-for="item in options" :key="item.value" class="year-tabs__item"
          :class="{ 'year-tabs__item--active': item.value === activeYear }" @tap="emit('change', item.value)">
          {{ item.label }}
        </button>
      </view>
    </scroll-view>

    <button class="year-tabs__filter" @tap="emit('filter')">
      <view class="year-tabs__filter-icon"></view>
      <text>筛选</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import type { IssueYearFilter, IssueYearOption } from '@/types/pageData';

interface Props {
  options: IssueYearOption[];
  activeYear: IssueYearFilter;
}

defineProps<Props>();

const emit = defineEmits<{
  change: [value: IssueYearFilter];
  filter: [];
}>();
</script>

<style lang="scss" scoped>
.year-tabs {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 28rpx;
}

.year-tabs__scroller {
  min-width: 0;
  flex: 1;
  white-space: nowrap;
}

.year-tabs__scroller-inner {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.year-tabs__item {
  flex-shrink: 0;
  height: 62rpx;
  padding: 0 30rpx;
  border: 1rpx solid rgba(216, 25, 32, 0.26);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.86);
  color: #d71920;
  font-size: 28rpx;
  line-height: 62rpx;
  box-shadow: none;

  &::after {
    border: none;
  }
}

.year-tabs__item--active {
  border-color: transparent;
  background: linear-gradient(135deg, #e01d22, #bd0710);
  box-shadow: 0 10rpx 22rpx rgba(210, 22, 29, 0.22);
  color: #fff;
  font-weight: 600;
}

.year-tabs__filter {
  display: flex;
  width: 92rpx;
  height: 62rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 10rpx;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #3f3f3f;
  font-size: 26rpx;
  line-height: 62rpx;

  &::after {
    border: none;
  }
}

.year-tabs__filter-icon {
  position: relative;
  width: 30rpx;
  height: 28rpx;
  flex-shrink: 0;

  &::before {
    position: absolute;
    top: 2rpx;
    left: 0;
    width: 0;
    height: 0;
    border-right: 15rpx solid transparent;
    border-left: 15rpx solid transparent;
    border-top: 17rpx solid #343434;
    content: '';
  }

  &::after {
    position: absolute;
    top: 17rpx;
    left: 12rpx;
    width: 6rpx;
    height: 10rpx;
    border-radius: 2rpx;
    background: #343434;
    content: '';
  }
}
</style>