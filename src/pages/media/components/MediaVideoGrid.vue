<template>
  <view class="video-grid">
    <button v-for="item in items" :key="item.id" class="video-card" @tap="emit('select', item)">
      <view class="video-card__media">
        <image v-if="item.thumbnail && !failedImages[item.id]" :src="item.thumbnail" mode="aspectFill"
          class="video-card__image" lazy-load @error="markImageFailed(item.id)" />
        <view v-else class="video-card__fallback">视频汇</view>
        <view class="video-card__play">
          <uni-icons type="videocam-filled" size="14" color="#ffffff" />
        </view>
      </view>
      <text class="video-card__title">{{ item.title }}</text>
      <text class="video-card__date">{{ item.date }}</text>
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { MediaItem } from '@/types/pageData';

interface Props {
  items: MediaItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  select: [item: MediaItem];
}>();

const failedImages = ref<Record<string, boolean>>({});

const markImageFailed = (id: string) => {
  failedImages.value = {
    ...failedImages.value,
    [id]: true
  };
};
</script>

<style lang="scss" scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx 18rpx;
}

.video-card {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  margin: 0;
  padding: 0 0 16rpx;
  overflow: hidden;
  border: none;
  border-radius: 5rpx;
  background: #fff;
  box-sizing: border-box;
  color: #222;
  text-align: left;

  &::after {
    border: none;
  }
}

.video-card__media {
  position: relative;
  width: 100%;
  height: 192rpx;
  overflow: hidden;
  background: #e7e7e7;
}

.video-card__image,
.video-card__fallback {
  width: 100%;
  height: 100%;
}

.video-card__fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 24rpx;
}

.video-card__play {
  position: absolute;
  right: 10rpx;
  bottom: 10rpx;
  display: flex;
  width: 32rpx;
  height: 32rpx;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  background: rgba(36, 36, 36, 0.62);
}

.video-card__title {
  display: -webkit-box;
  min-height: 66rpx;
  margin: 13rpx 12rpx 0;
  overflow: hidden;
  color: #222;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.video-card__date {
  margin: 14rpx 12rpx 0;
  color: #c2c2c2;
  font-size: 21rpx;
  line-height: 1;
}
</style>
