<template>
  <view class="magazine-swiper-wrapper">
    <swiper class="swiper-box" :circular="true" previous-margin="72rpx" next-margin="72rpx" :current="currentIndex"
      @change="onSwiperChange">
      <swiper-item v-for="(item, index) in store.issuesList" :key="item.id" class="swiper-item-box">
        <view class="magazine-card" :class="[
          currentIndex === index ? 'magazine-card--active' : 'magazine-card--inactive'
        ]">
          <view class="card-body">
            <!-- 左侧：封面（1417×1892，完整展示 + 红框） -->
            <view class="cover-side">
              <view class="cover-frame">
                <image :src="item.coverImage" mode="aspectFit" class="cover-image" />
              </view>
            </view>

            <!-- 右侧：信息区 -->
            <view class="info-side">
              <view class="info-top">
                <view class="issue-title">
                  <text class="issue-title-text">{{ item.year }}年第</text>
                  <text class="issue-num">{{ item.issueNum }}</text>
                  <text class="issue-title-text">期</text>
                </view>
                <view class="issue-count">
                  <text>本期收录 </text>
                  <text class="issue-count-num">{{ item.articleCount }}</text>
                  <text> 篇文章</text>
                </view>
                <view class="recommend-block">
                  <text class="recommend-label">重点推荐：</text>
                  <text class="recommend-text">{{ item.recommendationTitle }}</text>
                </view>
              </view>

              <view class="btn-row">
                <button class="btn-outline" @tap.stop="store.enterCatalog(item)">
                  进入目录
                </button>
                <button class="btn-primary" @tap.stop="store.readOriginal(item)">
                  阅读原刊
                </button>
              </view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 圆点指示器 -->
    <view class="indicator-row">
      <view v-for="(item, index) in store.issuesList" :key="item.id" class="indicator-dot"
        :class="{ 'indicator-dot--active': currentIndex === index }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMagazineStore } from '../store/magazineStore';

const store = useMagazineStore();
const currentIndex = ref(0);

const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current;
  const currentIssue = store.issuesList[e.detail.current];
  if (currentIssue) {
    store.changeIssue(currentIssue.id);
  }
};
</script>

<style lang="scss" scoped>
.magazine-swiper-wrapper {
  width: 100%;
  padding: 0 16rpx 8rpx;
  overflow: visible;
}

.swiper-box {
  width: 100%;
  height: 420rpx;
  overflow: visible;
}

.swiper-item-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
  box-sizing: border-box;
}

.magazine-card {
  width: 100%;
  background: #fff;
  border-radius: 24rpx;
  box-sizing: border-box;
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
}

.magazine-card--active {
  transform: scale(1);
  opacity: 1;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.1);
}

.magazine-card--inactive {
  transform: scale(0.9);
  opacity: 0.65;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.card-body {
  display: flex;
  align-items: stretch;
  padding: 28rpx 24rpx 28rpx 28rpx;
  min-height: 360rpx;
}

/* 封面区域：比例 1417 × 1892 */
.cover-side {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.cover-frame {
  width: 212rpx;
  height: 284rpx;
  border-radius: 4rpx;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
}

.info-side {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 4rpx;
}

.issue-title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}

.issue-title-text {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
}

.issue-num {
  font-size: 48rpx;
  font-weight: 900;
  color: #c8161d;
  line-height: 1;
  padding: 0 4rpx;
}

.issue-count {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #999;
  line-height: 1.4;
}

.issue-count-num {
  color: #c8161d;
  font-weight: 700;
}

.recommend-block {
  margin-top: 28rpx;
}

.recommend-label {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #c8161d;
  line-height: 1.4;
}

.recommend-text {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.btn-row {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.btn-outline,
.btn-primary {
  flex: 1;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 24rpx;
  font-weight: 600;
  border-radius: 9999rpx;
  padding: 0;
  margin: 0;

  &::after {
    border: none;
  }
}

.btn-outline {
  background: #fff;
  color: #c8161d;
  border: 2rpx solid #c8161d;
}

.btn-primary {
  background: #c8161d;
  color: #fff;
  border: none;
}

.indicator-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-top: 20rpx;
}

.indicator-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 9999rpx;
  background: #d9d9d9;
  transition: all 0.3s ease;
}

.indicator-dot--active {
  width: 32rpx;
  background: #c8161d;
}
</style>
