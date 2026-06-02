<template>
  <view class="year-tabs">
    <button
      v-for="item in options"
      :key="item.value"
      class="year-tabs__item"
      :class="{ 'year-tabs__item--active': item.value === activeYear }"
      @tap="emit('change', item.value)"
    >
      {{ item.label }}
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
}>();
</script>

<style lang="scss" scoped>
.year-tabs {
  display: flex;
  gap: 14rpx;
  padding: 28rpx 28rpx 26rpx;
}

.year-tabs__item {
  flex: 1;
  height: 62rpx;
  margin: 0;
  padding: 0;
  border: 1rpx solid #f0c5c2;
  border-radius: 16rpx;
  background: #fff8f5;
  color: #c8161d;
  font-size: 29rpx;
  font-weight: 600;
  line-height: 62rpx;

  &::after {
    border: none;
  }
}

.year-tabs__item--active {
  border-color: transparent;
  background: linear-gradient(135deg, #e01d22, #bd0710);
  box-shadow: 0 10rpx 22rpx rgba(210, 22, 29, 0.22);
  color: #fff;
}
</style>
