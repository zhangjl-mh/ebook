<template>
  <view class="magazine-swiper">
    <swiper
      v-if="store.issuesList.length"
      class="magazine-swiper__body"
      circular
      previous-margin="58rpx"
      next-margin="58rpx"
      :current="currentIndex"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(item, index) in store.issuesList" :key="item.id" class="magazine-swiper__item">
        <view class="magazine-card" :class="{ 'magazine-card--inactive': currentIndex !== index }">
          <image :src="item.coverImage" mode="aspectFit" class="magazine-card__cover" />

          <view class="magazine-card__content">
            <text class="magazine-card__title">{{ item.fullTitle }}</text>
            <text class="magazine-card__count">本期收录 {{ item.articleCount }} 篇文章</text>
            <text class="magazine-card__recommend">{{ item.recommendationTitle }}</text>

            <view class="magazine-card__actions">
              <button class="magazine-card__button magazine-card__button--ghost" @tap.stop="store.enterCatalog(item)">
                目录
              </button>
              <button class="magazine-card__button" @tap.stop="store.readOriginal(item)">
                原刊
              </button>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view v-else class="magazine-swiper__empty">暂无期刊</view>

    <view v-if="store.issuesList.length > 1" class="magazine-swiper__indicator">
      <view
        v-for="(item, index) in store.issuesList"
        :key="item.id"
        class="magazine-swiper__dot"
        :class="{ 'magazine-swiper__dot--active': currentIndex === index }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMagazineStore } from '@/store/magazineStore';

interface SwiperChangeEvent {
  detail: {
    current: number;
  };
}

const store = useMagazineStore();
const currentIndex = ref(0);

const onSwiperChange = (event: SwiperChangeEvent) => {
  const nextIndex = event.detail.current;
  const currentIssue = store.issuesList[nextIndex];

  currentIndex.value = nextIndex;

  if (currentIssue) {
    store.changeIssue(currentIssue.id);
  }
};
</script>

<style lang="scss" scoped>
.magazine-swiper {
  padding: 0 10rpx 6rpx;
}

.magazine-swiper__body {
  height: 392rpx;
}

.magazine-swiper__item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
  box-sizing: border-box;
}

.magazine-card {
  display: flex;
  width: 100%;
  min-height: 318rpx;
  padding: 26rpx;
  border-radius: 18rpx;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 18rpx 44rpx rgba(70, 10, 10, 0.12);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.magazine-card--inactive {
  opacity: 0.65;
  transform: scale(0.92);
}

.magazine-card__cover {
  width: 184rpx;
  height: 246rpx;
  flex-shrink: 0;
  margin-right: 26rpx;
  border: 1rpx solid #f1d8d8;
  border-radius: 8rpx;
  background: #fff;
}

.magazine-card__content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.magazine-card__title {
  color: #333;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.3;
}

.magazine-card__count {
  margin-top: 10rpx;
  color: #999;
  font-size: 22rpx;
}

.magazine-card__recommend {
  display: -webkit-box;
  margin-top: 22rpx;
  overflow: hidden;
  color: #333;
  font-size: 24rpx;
  font-weight: 500;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.magazine-card__actions {
  display: flex;
  gap: 16rpx;
  margin-top: auto;
}

.magazine-card__button {
  flex: 1;
  height: 64rpx;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 999rpx;
  background: #c8161d;
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  line-height: 64rpx;

  &::after {
    border: none;
  }
}

.magazine-card__button--ghost {
  border: 2rpx solid #c8161d;
  background: #fff;
  color: #c8161d;
}

.magazine-swiper__empty {
  padding: 72rpx 0;
  text-align: center;
  color: #999;
  font-size: 26rpx;
}

.magazine-swiper__indicator {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin-top: 14rpx;
}

.magazine-swiper__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 999rpx;
  background: #d9d9d9;
}

.magazine-swiper__dot--active {
  width: 32rpx;
  background: #c8161d;
}
</style>
