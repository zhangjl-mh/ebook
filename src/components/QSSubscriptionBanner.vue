<template>
  <view class="subscription-banner mx-4 my-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#fff8f0] to-[#ffe8d0] flex items-center justify-between border border-[#ffe0c4] relative overflow-hidden">
    <!-- 背景光晕装饰 -->
    <view class="absolute -right-8 -bottom-8 w-24 h-24 bg-[#ffdcb9]/25 rounded-full blur-2xl pointer-events-none"></view>

    <!-- 左侧：红色书本 + 金铃铛组合图形 -->
    <view class="graphic-container relative w-14 h-14 flex items-center justify-center shrink-0 mr-3">
      <!-- 红色书本 -->
      <view class="book-graphic w-10 h-12 bg-gradient-to-br from-[#c8161d] to-[#990a0f] rounded-l-[3px] shadow-md relative">
        <!-- 书脊线 -->
        <view class="absolute left-1 top-1 w-1 h-10 bg-white/20 rounded-sm"></view>
        <!-- 书页边缘 -->
        <view class="absolute right-[-3rpx] top-0 w-1 h-12 bg-[#fcfcfc] rounded-r-sm border-y border-r border-gray-200"></view>
      </view>
      <!-- 浮动金色铃铛 -->
      <view class="absolute -bottom-0.5 -right-0.5 animate-bounce-slow">
        <image
          :src="store.config.subscription.bellIcon"
          mode="aspectFit"
          class="w-8 h-8 drop-shadow-md"
        />
      </view>
    </view>

    <!-- 中间：文案 -->
    <view class="flex-1 flex flex-col justify-center min-w-0 pr-2">
      <text class="text-[13px] font-bold text-[#8a1f11] tracking-wide mb-0.5">
        {{ store.config.subscription.title }}
      </text>
      <text class="text-[9px] text-[#9b5145] font-light leading-normal line-clamp-2">
        {{ store.config.subscription.description }}
      </text>
    </view>

    <!-- 右侧：CTA 按钮 -->
    <button
      class="cta-btn shrink-0 text-xs py-2 px-4 rounded-full text-white font-semibold flex items-center justify-center shadow-md"
      :class="[
        store.isSubscribed
          ? 'bg-emerald-600 shadow-emerald-200'
          : 'bg-[#c8161d] shadow-red-200'
      ]"
      @tap="store.subscribe()"
    >
      <text>{{ store.isSubscribed ? '已订阅' : store.config.subscription.btnText }}</text>
      <svg v-if="!store.isSubscribed" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </view>
</template>

<script setup lang="ts">
import { useMagazineStore } from '../store/magazineStore';

const store = useMagazineStore();
</script>

<style lang="scss" scoped>
.subscription-banner {
  box-shadow: 0 4px 15px rgba(255, 172, 100, 0.1);
}
.cta-btn {
  border: none;
  line-height: 1;
  &:active {
    opacity: 0.85;
    transform: scale(0.96);
  }
}
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(6deg);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
