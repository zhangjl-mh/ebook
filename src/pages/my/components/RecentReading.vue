<template>
  <view class="recent">
    <view class="recent__header">
      <text class="recent__title">最近阅读</text>
      <text class="recent__more">查看全部 ›</text>
    </view>

    <view v-if="items.length" class="recent__list">
      <view v-for="item in items" :key="item.id" class="recent__item" @tap="emit('select', item)">
        <view class="recent__cover">
          <image v-if="item.coverImage && !failedCoverIds.includes(item.id)" :src="item.coverImage" mode="widthFix"
            class="recent__cover-image" @error="markCoverFailed(item.id)" />
          <view v-else class="recent__cover-fallback">
            <text class="recent__cover-title">{{ item.title }}</text>
            <text class="recent__cover-issue">{{ item.issueNo }}</text>
          </view>
        </view>

        <view class="recent__body">
          <text class="recent__name">{{ item.title }}</text>
          <text class="recent__issue">{{ item.issueTitle }}</text>
          <text class="recent__progress-text">阅读进度 {{ clampProgress(item.progress) }}%</text>
          <view class="recent__progress">
            <view class="recent__progress-bar" :style="getProgressStyle(item.progress)"></view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="recent__empty">
      <text class="recent__empty-text">暂无阅读记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { RecentReadItem } from '@/types/pageData';

interface Props {
  items: RecentReadItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  select: [item: RecentReadItem];
}>();

const failedCoverIds = ref<string[]>([]);

const clampProgress = (progress: number) => Math.min(100, Math.max(0, Math.round(progress)));

const markCoverFailed = (id: string) => {
  if (failedCoverIds.value.includes(id)) {
    return;
  }

  failedCoverIds.value = [...failedCoverIds.value, id];
};

const getProgressStyle = (progress: number) => ({
  width: `${clampProgress(progress)}%`
});
</script>

<style lang="scss" scoped>
.recent {
  position: relative;
  z-index: 2;
  margin: 24rpx 36rpx 24rpx;
}

.recent__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.recent__title {
  color: #202124;
  font-size: 34rpx;
  font-weight: 700;
  line-height: 1;
}

.recent__more {
  color: #8d8f94;
  font-size: 26rpx;
  line-height: 1;
}

.recent__list {
  display: flex;
}

.recent__item {
  display: flex;
  flex: 1;
  min-width: 0;
  padding: 22rpx 22rpx 20rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  background: #fff;
  box-shadow: 0 14rpx 36rpx rgba(25, 28, 34, 0.06);
}

.recent__item+.recent__item {
  margin-left: 22rpx;
}

.recent__cover {
  position: relative;
  width: 95rpx;
  flex-shrink: 0;
  overflow: hidden;
}

.recent__cover-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.recent__cover-fallback {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff 0%, #fff6f2 100%);
}

.recent__cover-title {
  color: #df151f;
  font-family: KaiTi, STKaiti, serif;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1;
}

.recent__cover-issue {
  margin-top: 16rpx;
  color: #df151f;
  font-size: 18rpx;
  line-height: 1;
}

.recent__body {
  min-width: 0;
  margin-left: 22rpx;
  padding-top: 4rpx;
  flex: 1;
}

.recent__name {
  display: block;
  color: #1d1d1f;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.15;
}

.recent__issue,
.recent__progress-text {
  display: block;
  margin-top: 18rpx;
  color: #62666d;
  font-size: 24rpx;
  line-height: 1;
  white-space: nowrap;
}

.recent__progress {
  width: 100%;
  height: 8rpx;
  margin-top: 16rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: #e3e5e8;
}

.recent__progress-bar {
  height: 100%;
  border-radius: 999rpx;
  background: #df151f;
}

.recent__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 172rpx;
  border-radius: 20rpx;
  background: #fff;
  box-shadow: 0 14rpx 36rpx rgba(25, 28, 34, 0.06);
}

.recent__empty-text {
  color: #8b8d92;
  font-size: 26rpx;
}
</style>
