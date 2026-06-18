<template>
  <view class="publication-grid">
    <view v-if="!publications.length" class="publication-grid__empty">暂无匹配刊物</view>

    <view v-for="publication in publications" v-else :key="publication.id" class="publication-card"
      @tap="emit('select', publication)">
      <view class="publication-card__cover">
        <image v-if="publication.coverImage && !failedCoverMap[publication.id]" :src="publication.coverImage"
          class="publication-card__image" mode="aspectFit" lazy-load @error="markCoverFailed(publication.id)" />
        <view v-else class="publication-card__fallback">暂无封面</view>
      </view>
      <text class="publication-card__title">{{ publication.updateText }}</text>
      <text class="publication-card__count">已有{{ publication.subscriberCount }}人订阅</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DatabasePublication } from '@/types/pageData';

defineProps<{
  publications: DatabasePublication[];
}>();

const emit = defineEmits<{
  select: [publication: DatabasePublication];
}>();

const failedCoverMap = ref<Record<string, boolean>>({});

const markCoverFailed = (publicationId: string) => {
  failedCoverMap.value = {
    ...failedCoverMap.value,
    [publicationId]: true
  };
};
</script>

<style lang="scss" scoped>
.publication-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22rpx;
  padding: 0 24rpx 44rpx;
}

.publication-grid__empty {
  grid-column: 1 / -1;
  padding: 96rpx 0;
  color: var(--qs-text-muted);
  font-size: 28rpx;
  text-align: center;
}

.publication-card {
  min-width: 0;
  overflow: hidden;
  padding: 20rpx 18rpx 24rpx;
  border-radius: 18rpx;
  background: #fff;
  box-shadow: 0 8rpx 24rpx rgba(56, 35, 35, 0.06);
  box-sizing: border-box;
}

.publication-card__cover {
  height: 330rpx;
  overflow: hidden;
  border-radius: 4rpx;
}

.publication-card__image {
  display: block;
  width: 100%;
  height: 100%;
}

.publication-card__fallback {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  color: var(--qs-text-placeholder);
  font-size: 22rpx;
}

.publication-card__title,
.publication-card__count {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.publication-card__title {
  margin-top: 16rpx;
  color: #333;
  font-size: 25rpx;
  line-height: 1.35;
}

.publication-card__count {
  margin-top: 18rpx;
  color: #b5b5b5;
  font-size: 22rpx;
  line-height: 1.2;
}
</style>
