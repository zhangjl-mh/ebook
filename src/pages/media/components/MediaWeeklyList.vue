<template>
  <view class="weekly-section">
    <image src="/static/media/weekly-banner.jpg" mode="aspectFill" class="weekly-section__banner" />

    <view class="weekly-list">
      <button v-for="item in items" :key="item.id" class="weekly-item" @tap="emit('select', item)">
        <text class="weekly-item__title">{{ item.title }}</text>
        <text class="weekly-item__meta">来源：{{ item.source }}</text>
        <text class="weekly-item__meta">时间：{{ item.date }}</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { MediaItem } from '@/types/pageData';

interface Props {
  items: MediaItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  select: [item: MediaItem];
}>();
</script>

<style lang="scss" scoped>
.weekly-section {
  overflow: hidden;
  background: #fff;
}

.weekly-section__banner {
  display: block;
  width: 100%;
  height: 168rpx;
}

.weekly-list {
  padding: 0 16rpx;
}

.weekly-item {
  display: flex;
  width: 100%;
  min-height: 184rpx;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0;
  padding: 24rpx 8rpx;
  border: none;
  border-bottom: 1rpx solid #ffd4d1;
  border-radius: 0;
  background: #fff;
  box-sizing: border-box;
  text-align: left;

  &::after {
    border: none;
  }
}

.weekly-item__title {
  color: #333;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 1.45;
}

.weekly-item__meta {
  margin-top: 13rpx;
  color: #b9b9b9;
  font-size: 21rpx;
  line-height: 1;
}
</style>
