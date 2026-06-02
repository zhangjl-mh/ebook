<template>
  <view class="issue-grid">
    <view v-if="!issues.length" class="issue-grid__empty">暂无匹配书刊</view>

    <template v-else>
      <view v-for="issue in issues" :key="issue.id" class="issue-card">
        <view class="issue-card__cover">
          <view class="issue-card__cover-inner">
            <text class="issue-card__publisher">中国共产党中央委员会主办</text>
            <text class="issue-card__wordmark">求是</text>
            <text class="issue-card__roman">QIUSHI</text>
            <view class="issue-card__issue-no">
              <text>{{ issue.year }}</text>
              <text>·</text>
              <text>{{ issue.issueNo }}</text>
            </view>
          </view>
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
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.issue-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 26rpx 25rpx;
  padding: 0 29rpx 44rpx;
}

.issue-grid__empty {
  width: 100%;
  padding: 96rpx 0;
  text-align: center;
  color: #8a8f96;
  font-size: 28rpx;
}

.issue-card {
  width: calc((100% - 50rpx) / 3);
  overflow: hidden;
  padding: 20rpx 20rpx 18rpx;
  border-radius: 14rpx;
  background: #fff;
  box-shadow: 0 12rpx 32rpx rgba(27, 27, 27, 0.055);
  box-sizing: border-box;
}

.issue-card__cover {
  position: relative;
  height: 222rpx;
  overflow: hidden;
  background: #fff;
}

.issue-card__cover-inner {
  position: absolute;
  inset: 0;
  border: 6rpx solid #e3000b;
  background:
    linear-gradient(115deg, rgba(243, 243, 243, 0) 0 44%, rgba(242, 242, 242, 0.55) 45%, rgba(255, 255, 255, 0) 62%),
    radial-gradient(circle at 24% 38%, rgba(210, 0, 8, 0.035) 0, rgba(210, 0, 8, 0) 36%),
    #fff;
  box-sizing: border-box;
}

.issue-card__publisher {
  display: block;
  margin: 11rpx 12rpx 0;
  overflow: hidden;
  color: #e3000b;
  font-size: 10rpx;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
}

.issue-card__wordmark {
  display: block;
  margin-top: 33rpx;
  color: #e3000b;
  font-family: STXingkai, FZShuTi, KaiTi, STKaiti, serif;
  font-size: 66rpx;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  text-shadow: 0 2rpx 1rpx rgba(227, 0, 11, 0.08);
  transform: skewX(-6deg);
}

.issue-card__roman {
  display: block;
  margin-top: 5rpx;
  color: #323232;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

.issue-card__issue-no {
  position: absolute;
  right: 12rpx;
  bottom: 11rpx;
  display: flex;
  align-items: baseline;
  gap: 5rpx;
  color: #191919;
  font-size: 12rpx;
  font-style: italic;
  font-weight: 700;
  line-height: 1;

  text:last-child {
    color: #e3000b;
    font-size: 18rpx;
  }
}

.issue-card__title {
  display: block;
  margin-top: 16rpx;
  overflow: hidden;
  color: #222;
  font-size: 26rpx;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.issue-card__count {
  display: block;
  margin-top: 8rpx;
  overflow: hidden;
  color: #858585;
  font-size: 22rpx;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
