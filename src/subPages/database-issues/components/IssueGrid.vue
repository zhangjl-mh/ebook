<template>
  <view class="issue-grid">
    <view v-if="!issues.length" class="issue-grid__empty">暂无匹配期刊</view>

    <template v-else>
      <view v-for="issue in issues" :key="issue.id" class="issue-card" @tap="emit('select', issue)">
        <view class="issue-card__cover">
          <image v-if="issue.coverImage && !failedCoverMap[issue.id]" class="issue-card__cover-image"
            :src="issue.coverImage" mode="aspectFit" lazy-load @error="markCoverFailed(issue.id)" />
          <view v-else class="issue-card__cover-fallback">
            <text>暂无封面</text>
          </view>
        </view>

        <text class="issue-card__title">{{ issue.issueTitle }}</text>
        <text class="issue-card__count">已有{{ issue.subscriberCount }}人订阅</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IssueCatalogItem } from '@/types/pageData';

interface Props {
  issues: IssueCatalogItem[];
}

defineProps<Props>();

const emit = defineEmits<{
  select: [issue: IssueCatalogItem];
}>();

const failedCoverMap = ref<Record<string, boolean>>({});

const markCoverFailed = (issueId: string) => {
  failedCoverMap.value = {
    ...failedCoverMap.value,
    [issueId]: true
  };
};
</script>

<style lang="scss" scoped>
.issue-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18rpx 14rpx;
  padding: 0 20rpx 44rpx;
}

.issue-grid__empty {
  width: 100%;
  padding: 96rpx 0;
  text-align: center;
  color: var(--qs-text-muted);
  font-size: 28rpx;
}

.issue-card {
  overflow: hidden;
  padding: 12rpx 10rpx 16rpx;
  border-radius: 14rpx;
  background: var(--qs-card-bg);
  box-sizing: border-box;
}

.issue-card__cover {
  position: relative;
  height: 240rpx;
  overflow: hidden;
  border-radius: 4rpx;
}

.issue-card__cover-image {
  width: 100%;
  height: 100%;
  display: block;
  background: #f7f7f7;
}

.issue-card__cover-fallback {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--qs-text-placeholder);
  font-size: 22rpx;
}

.issue-card__title {
  display: block;
  margin-top: 12rpx;
  overflow: hidden;
  color: var(--qs-text-main);
  font-size: 23rpx;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.issue-card__count {
  display: block;
  margin-top: 7rpx;
  overflow: hidden;
  color: var(--qs-text-muted);
  font-size: 19rpx;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
