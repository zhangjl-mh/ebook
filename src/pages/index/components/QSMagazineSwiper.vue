<template>
  <view class="home-banner">
    <swiper class="home-banner__swiper" circular autoplay :interval="4200" :current="currentIndex"
      @change="handleChange">
      <swiper-item v-for="banner in homeBanners" :key="banner.id" class="home-banner__item">
        <image :src="banner.image" mode="aspectFill" class="home-banner__image" @tap="showPendingToast" />
      </swiper-item>
    </swiper>

    <view class="home-banner__dots">
      <view v-for="(banner, index) in homeBanners" :key="banner.id" class="home-banner__dot"
        :class="{ 'home-banner__dot--active': currentIndex === index }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { homeBanners } from '@/config/homePage';

interface SwiperChangeEvent {
  detail: {
    current: number;
  };
}

const currentIndex = ref(0);

const handleChange = (event: SwiperChangeEvent) => {
  currentIndex.value = event.detail.current;
};

const showPendingToast = () => {
  uni.showToast({ title: '内容建设中', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.home-banner {
  position: relative;
  background: #f2f2f4;
}

.home-banner__swiper {
  height: 256rpx;
}

.home-banner__item {
  padding: 0 18rpx;
  box-sizing: border-box;
}

.home-banner__image {
  display: block;
  width: 100%;
  height: 236rpx;
  border-radius: 14rpx;
  background: #fff;
}

.home-banner__dots {
  display: flex;
  justify-content: center;
  gap: 8rpx;
  margin-top: -6rpx;
  padding-bottom: 12rpx;
}

.home-banner__dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 999rpx;
  background: #d7d7d7;
}

.home-banner__dot--active {
  width: 28rpx;
  background: #d71920;
}
</style>
