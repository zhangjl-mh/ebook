<template>
  <view class="issue-shelf">
    <view class="issue-shelf__head">
      <text class="issue-shelf__title">新刊上架</text>
      <button class="issue-shelf__more" @tap="showPendingToast">更多</button>
    </view>

    <scroll-view class="issue-shelf__scroll" scroll-x :show-scrollbar="false">
      <view class="issue-shelf__list">
        <view v-for="item in homeIssueCards" :key="item.id" class="issue-card"
          :class="{ 'issue-card--active': item.id === activeIssueId }" @tap="emit('select', item.id)">
          <image :src="item.cover" mode="aspectFit" class="issue-card__cover" />
          <image :src="item.titleImage" mode="aspectFit" class="issue-card__title-image" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { homeIssueCards } from '@/config/homePage';

defineProps<{
  activeIssueId: string;
}>();

const emit = defineEmits<{
  (event: 'select', issueId: string): void;
}>();

const showPendingToast = () => {
  uni.showToast({ title: '内容建设中', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.issue-shelf {
  background: #f2f2f4;
}

.issue-shelf__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 26rpx 10rpx;
}

.issue-shelf__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.35;
}

.issue-shelf__more {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #222;
  font-size: 25rpx;
  line-height: 1.4;

  &::after {
    border: none;
  }
}

.issue-shelf__scroll {
  width: 100%;
}

.issue-shelf__list {
  display: flex;
  gap: 18rpx;
  padding: 0 20rpx 18rpx;
}

.issue-card {
  width: 214rpx;
  flex-shrink: 0;
  padding: 18rpx 14rpx 14rpx;
  border-radius: 16rpx;
  background: #fff;
  box-sizing: border-box;
}

.issue-card--active {
  box-shadow: 0 0 30rpx rgba(228, 40, 48, 0.34);
}

.issue-card__cover {
  display: block;
  width: 150rpx;
  height: 204rpx;
  margin: 0 auto;
}

.issue-card__title-image {
  display: block;
  width: 168rpx;
  height: 38rpx;
  margin: 14rpx auto 0;
}
</style>
