<template>
  <view class="recent">
    <view class="recent__header">
      <text class="recent__title">最近阅读</text>
      <text class="recent__more">查看全部 ›</text>
    </view>

    <view class="recent__card">
      <view v-for="item in items" :key="item.id" class="recent__item">
        <view class="recent__cover">
          <image :src="item.coverBg" mode="aspectFill" class="recent__cover-bg" />
          <image src="/static/brand/header_logo_original.png" mode="aspectFit" class="recent__cover-logo" />
        </view>

        <view class="recent__body">
          <text class="recent__name">{{ item.title }}</text>
          <text class="recent__issue">{{ item.issueTitle }}</text>
          <text class="recent__progress-text">阅读进度 {{ item.progress }}%</text>
          <view class="recent__progress">
            <view class="recent__progress-bar" :style="getProgressStyle(item.progress)"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { RecentReadItem } from '@/types/pageData';

interface Props {
  items: RecentReadItem[];
}

defineProps<Props>();

const getProgressStyle = (progress: number) => {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return { width: `${safeProgress}%` };
};
</script>

<style lang="scss" scoped>
.recent {
  position: relative;
  z-index: 2;
  margin: -42rpx 24rpx 24rpx;
}

.recent__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.recent__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 600;
}

.recent__more {
  color: #868b92;
  font-size: 26rpx;
}

.recent__card {
  display: flex;
  overflow: hidden;
  border: 1rpx solid #ededf0;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: 0 14rpx 34rpx rgba(24, 24, 24, 0.05);
}

.recent__item {
  display: flex;
  flex: 1;
  min-width: 0;
  padding: 22rpx;
}

.recent__item + .recent__item {
  border-left: 1rpx solid #ededf0;
}

.recent__cover {
  position: relative;
  width: 106rpx;
  height: 136rpx;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8rpx;
}

.recent__cover-bg,
.recent__cover-logo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.recent__cover-logo {
  height: 58rpx;
  margin-top: 24rpx;
}

.recent__body {
  min-width: 0;
  margin-left: 16rpx;
}

.recent__name {
  display: block;
  color: #222;
  font-size: 30rpx;
  font-weight: 600;
}

.recent__issue,
.recent__progress-text {
  display: block;
  margin-top: 14rpx;
  color: #666b72;
  font-size: 24rpx;
}

.recent__progress {
  width: 100%;
  height: 7rpx;
  margin-top: 12rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #e1e3e6;
}

.recent__progress-bar {
  height: 100%;
  border-radius: 999rpx;
  background: #d2161d;
}
</style>
