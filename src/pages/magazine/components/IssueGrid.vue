<template>
  <view class="issue-grid">
    <view v-if="!issues.length" class="issue-grid__empty">暂无匹配期刊</view>

    <template v-else>
      <view v-for="issue in issues" :key="issue.id" class="issue-card">
        <view class="issue-card__cover">
          <image :src="issue.coverBg" mode="aspectFill" class="issue-card__cover-bg" />
          <image :src="logoSrc" mode="aspectFit" class="issue-card__logo" />
          <text class="issue-card__theme" :class="`issue-card__theme--${issue.tone}`">{{ issue.title }}</text>
          <text class="issue-card__subtitle" :class="`issue-card__subtitle--${issue.tone}`">{{ issue.subtitle }}</text>
          <text class="issue-card__no" :class="`issue-card__no--${issue.tone}`">{{ issue.year }} · {{ issue.issueNo }}</text>
        </view>

        <text class="issue-card__title">{{ issue.issueTitle }}</text>
        <text class="issue-card__count">已有{{ issue.subscriberCount }}人订阅</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import type { IssueCatalogItem } from '@/types/pageData';

interface Props {
  issues: IssueCatalogItem[];
  logoSrc: string;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.issue-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 34rpx 22rpx;
  padding: 0 28rpx 44rpx;
}

.issue-grid__empty {
  width: 100%;
  padding: 80rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

.issue-card {
  width: calc((100% - 44rpx) / 3);
}

.issue-card__cover {
  position: relative;
  height: 286rpx;
  overflow: hidden;
  border-radius: 14rpx;
  background: #fff7ea;
  box-shadow: 0 12rpx 26rpx rgba(108, 66, 28, 0.12);
}

.issue-card__cover-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.issue-card__logo {
  position: relative;
  display: block;
  width: 126rpx;
  height: 60rpx;
  margin: 24rpx auto 0;
}

.issue-card__theme,
.issue-card__subtitle,
.issue-card__no {
  position: relative;
  display: block;
  text-align: center;
}

.issue-card__theme {
  margin-top: 26rpx;
  color: #c8161d;
  font-size: 23rpx;
  font-weight: 700;
  line-height: 1.2;
}

.issue-card__subtitle {
  max-height: 54rpx;
  margin: 8rpx 14rpx 0;
  overflow: hidden;
  color: #c8161d;
  font-size: 18rpx;
  font-weight: 600;
  line-height: 1.45;
}

.issue-card__no {
  position: absolute;
  right: 10rpx;
  bottom: 10rpx;
  color: #fff;
  font-size: 20rpx;
  font-weight: 700;
}

.issue-card__theme--dark,
.issue-card__subtitle--dark,
.issue-card__no--dark {
  color: #ffe8b7;
}

.issue-card__theme--blue,
.issue-card__subtitle--blue {
  color: #174a67;
}

.issue-card__title {
  display: block;
  margin-top: 16rpx;
  color: #222;
  font-size: 27rpx;
  font-weight: 500;
  line-height: 1.25;
}

.issue-card__count {
  display: block;
  margin-top: 8rpx;
  color: #8d8580;
  font-size: 22rpx;
}
</style>
