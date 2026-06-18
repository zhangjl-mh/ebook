<template>
  <view class="year-tabs">
    <scroll-view class="year-tabs__scroller" :scroll-x="true" :enable-flex="true" :show-scrollbar="false">
      <view class="year-tabs__scroller-inner">
        <button v-for="item in options" :key="item.value" class="year-tabs__item"
          :class="{ 'year-tabs__item--active': item.value === activeYear }" @tap="emit('change', item.value)">
          {{ item.label }}
        </button>
      </view>
    </scroll-view>
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
  align-items: center;
  padding: 0 20rpx 18rpx;
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
  color: var(--qs-color-primary);
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
  background: var(--qs-color-primary-strong);
  box-shadow: 0 10rpx 22rpx rgba(210, 22, 29, 0.2);
  color: var(--qs-text-inverse);
}

</style>
