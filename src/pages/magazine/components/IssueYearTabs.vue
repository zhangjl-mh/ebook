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
  gap: 22rpx;
  padding: 12rpx 29rpx 20rpx;
}

.year-tabs__scroller {
  min-width: 0;
  flex: 1;
  scrollbar-width: none;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  :deep(.uni-scroll-view),
  :deep(.uni-scroll-view-content) {
    scrollbar-width: none;
  }

  :deep(.uni-scroll-view::-webkit-scrollbar),
  :deep(.uni-scroll-view-content::-webkit-scrollbar) {
    display: none;
    width: 0;
    height: 0;
  }
}

.year-tabs__scroller-inner {
  display: flex;
  align-items: center;
  gap: 23rpx;
}

.year-tabs__item {
  display: flex;
  width: 98rpx;
  flex-shrink: 0;
  height: 56rpx;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1rpx solid rgba(215, 25, 32, 0.24);
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.82);
  box-sizing: border-box;
  color: $qs-color-primary;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1;
  box-shadow: none;

  &::after {
    border: none;
  }
}

.year-tabs__item--active {
  border-color: transparent;
  background: $qs-color-primary-strong;
  box-shadow: 0 10rpx 22rpx rgba(210, 22, 29, 0.2);
  color: $qs-text-inverse;
}

.year-tabs__filter {
  display: flex;
  width: 82rpx;
  height: 56rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 7rpx;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #3f3f3f;
  font-size: 24rpx;
  line-height: 1;

  &::after {
    border: none;
  }
}

.year-tabs__filter-icon {
  position: relative;
  width: 26rpx;
  height: 28rpx;
  flex-shrink: 0;

  &::before {
    position: absolute;
    top: 4rpx;
    left: 1rpx;
    width: 21rpx;
    height: 13rpx;
    border: 3rpx solid #333;
    border-bottom: 0;
    border-radius: 3rpx 3rpx 0 0;
    content: '';
    transform: perspective(30rpx) rotateX(-32deg);
  }

  &::after {
    position: absolute;
    top: 16rpx;
    left: 11rpx;
    width: 6rpx;
    height: 9rpx;
    border-radius: 2rpx;
    background: #343434;
    content: '';
  }
}
</style>
