<template>
  <view class="magazine-swiper-wrapper mt-[-90rpx] mb-2 relative">
    <!-- Swiper 轮播 -->
    <swiper class="swiper-box" :circular="true" previous-margin="94rpx" next-margin="94rpx" :current="currentIndex"
      @change="onSwiperChange">
      <swiper-item v-for="(item, index) in store.issuesList" :key="item.id"
        class="swiper-item-box flex items-center justify-center">
        <!-- 杂志卡片 -->
        <view
          class="magazine-card flex items-stretch bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300"
          :class="[
            currentIndex === index
              ? 'scale-100 opacity-100 shadow-card-active'
              : 'scale-[0.88] opacity-70'
          ]">
          <!-- 左侧：封面 -->
          <view class="cover-container relative w-[240rpx] bg-[#c8161d] flex flex-col shrink-0">
            <!-- 封面内容区 -->
            <view class="flex-1 flex flex-col justify-between p-3 relative">
              <!-- 内框白色边框 -->
              <view class="absolute inset-2 border border-white/25 rounded-sm pointer-events-none"></view>

              <!-- 顶部信息 -->
              <view class="relative z-10 flex justify-between items-start px-1 pt-0.5">
                <text class="text-[8rpx] text-white/50 leading-none">
                  中共中央机关刊
                </text>
              </view>

              <!-- 中间：大号“求是” -->
              <view class="relative z-10 flex flex-col items-center justify-center flex-1 my-2">
                <text class="cover-title-text text-white text-3xl font-black tracking-widest leading-none">
                  求是
                </text>
                <text class="text-[#ffd700] text-[14rpx] tracking-[4rpx] font-semibold mt-2 uppercase">
                  QIUSHI
                </text>
              </view>

              <!-- 底部信息 -->
              <view class="relative z-10 flex justify-between items-end px-1 pb-0.5">
                <view class="flex flex-col">
                  <text class="text-[8rpx] text-white/40 leading-tight">
                    中共中央主管主办权威理论文选
                  </text>
                  <text class="text-[8rpx] text-white/40 leading-tight">
                    全国公开发行半月刊
                  </text>
                </view>
              </view>
            </view>

            <!-- 底部红色期号条 -->
            <view class="bg-[#a80e14] py-2 flex items-center justify-center">
              <text class="text-white/90 text-sm font-bold tracking-wider">
                {{ item.year }}
              </text>
              <text class="text-[#ffd700] text-xs font-bold mx-1">
                ·
              </text>
              <text class="text-white text-xl font-black">
                {{ item.issueNum }}
              </text>
            </view>
          </view>

          <!-- 右侧：信息区 -->
          <view class="flex-1 flex flex-col justify-between p-4 min-w-0">
            <view>
              <!-- 期号标题 -->
              <view class="flex items-baseline">
                <text class="text-base font-bold text-gray-800">
                  {{ item.year }}年第
                </text>
                <text class="text-[#c8161d] text-2xl font-black px-0.5">
                  {{ item.issueNum }}
                </text>
                <text class="text-base font-bold text-gray-800">
                  期
                </text>
              </view>

              <!-- 文章数量 -->
              <view class="text-[10px] text-gray-400 mt-1">
                本期收录
                <text class="text-[#c8161d] font-bold">
                  {{ item.articleCount }}
                </text>
                篇文章
              </view>

              <!-- 重点推荐 -->
              <view class="mt-3">
                <text class="text-[11px] font-bold text-[#c8161d] block">
                  重点推荐：
                </text>
                <text class="text-[10px] text-gray-600 font-medium leading-relaxed line-clamp-2 mt-1">
                  {{ item.recommendationTitle }}
                </text>
              </view>
            </view>

            <!-- 按钮组 -->
            <view class="flex gap-2 mt-3">
              <button
                class="btn-outline flex-1 text-[10px] py-1.5 px-0 rounded-full border border-[#c8161d] text-[#c8161d] bg-white font-semibold flex items-center justify-center h-8"
                @tap.stop="store.enterCatalog(item)">
                进入目录
              </button>

              <button
                class="btn-primary flex-1 text-[10px] py-1.5 px-0 rounded-full bg-[#c8161d] text-white font-semibold flex items-center justify-center h-8"
                @tap.stop="store.readOriginal(item)">
                阅读原刊
              </button>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 圆点指示器 -->
    <view class="flex items-center justify-center gap-1.5 mt-2">
      <view v-for="(item, index) in store.issuesList" :key="item.id"
        class="h-[6px] rounded-full transition-all duration-300" :class="[
          currentIndex === index ? 'w-4 bg-[#c8161d]' : 'w-1.5 bg-gray-300'
        ]"></view>
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
  overflow: visible;
}

.swiper-box {
  width: 100%;
  height: 440rpx;
  overflow: visible;
}

.swiper-item-box {
  overflow: visible;
}

.magazine-card {
  width: 100%;
  height: 400rpx;
}

.shadow-card-active {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

.cover-title-text {
  font-family: 'STKaiti', 'KaiTi', 'Kaiti SC', serif;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.btn-outline,
.btn-primary {
  line-height: 1;
  border-radius: 9999px;

  &:active {
    opacity: 0.8;
    transform: scale(0.97);
  }
}

.btn-outline:active {
  background-color: #fff5f5;
}

.btn-primary:active {
  background-color: #a61016;
}
</style>