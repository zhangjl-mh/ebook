<template>
  <view class="abroad-channel">
    <view class="abroad-list">
      <button v-for="item in items" :key="item.id" class="abroad-item" @tap="emit('select', item)">
        <text class="abroad-item__title">{{ item.title }}</text>
        <view class="abroad-item__meta">
          <text>来源-求是网</text>
          <text>{{ item.date }}</text>
        </view>
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
.abroad-channel {
  background: #fff;
}

.abroad-list {
  padding: 0 24rpx;
}

.abroad-item {
  display: flex;
  width: 100%;
  min-height: 186rpx;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0;
  padding: 24rpx 0;
  border: none;
  border-bottom: 1rpx solid #dddddd;
  border-radius: 0;
  background: #fff;
  box-sizing: border-box;
  text-align: left;

  &::after {
    border: none;
  }
}

.abroad-item__title {
  color: #3c3c3c;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.55;
}

.abroad-item__meta {
  display: flex;
  gap: 28rpx;
  margin-top: 22rpx;
  color: #b7b7b7;
  font-size: 23rpx;
}
</style>
