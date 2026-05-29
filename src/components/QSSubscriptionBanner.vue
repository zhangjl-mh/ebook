<template>
  <view class="subscription-banner mx-5 my-4 p-4 rounded-2xl bg-gradient-to-r from-[#fff5eb] to-[#ffe3cd] flex items-center justify-between border border-[#ffdfc4] shadow-sm relative overflow-hidden">
    <!-- Background gold sheen -->
    <view class="absolute -right-10 -bottom-10 w-28 h-28 bg-[#ffdcb9]/30 rounded-full blur-2xl pointer-events-none"></view>
    
    <!-- Left: Graphic representation of Red Book and Bell -->
    <view class="graphic-container relative w-16 h-16 flex items-center justify-center shrink-0 mr-3">
      <!-- Red book back -->
      <view class="w-12 h-14 bg-gradient-to-br from-[#c8161d] to-[#990a0f] rounded-l-md shadow-md flex items-center justify-end pr-1 border-r-2 border-white/20 relative">
        <view class="w-1.5 h-12 bg-white/20 rounded-sm absolute left-1.5 top-1"></view>
        <!-- Page lines edge -->
        <view class="w-1.5 h-14 bg-[#fcfcfc] rounded-r-sm absolute right-[-4rpx] border-y border-r border-gray-300"></view>
      </view>
      <!-- Floating golden bell -->
      <view class="absolute bottom-0 right-0 animate-bounce-slow">
        <image 
          :src="store.config.subscription.bellIcon" 
          mode="aspectFit" 
          class="w-10 h-10 drop-shadow-md"
        />
      </view>
    </view>

    <!-- Center: Content -->
    <view class="flex-1 flex flex-col justify-center min-w-0 pr-2">
      <text class="text-sm font-bold text-[#8a1f11] tracking-wide mb-0.5">
        {{ store.config.subscription.title }}
      </text>
      <text class="text-[10px] text-[#9b5145] font-light leading-normal line-clamp-2">
        {{ store.config.subscription.description }}
      </text>
    </view>

    <!-- Right: Button CTA -->
    <button 
      class="cta-btn shrink-0 text-xs py-2 px-4 rounded-full text-white font-semibold flex items-center justify-center active:scale-95 transition-all shadow-md"
      :class="[
        store.isSubscribed 
          ? 'bg-emerald-600 shadow-emerald-200' 
          : 'bg-[#c8161d] hover:bg-[#b01218] shadow-red-200'
      ]"
      @tap="store.subscribe()"
    >
      <text>{{ store.isSubscribed ? '已订阅' : store.config.subscription.btnText }}</text>
      <svg v-if="!store.isSubscribed" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
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
  box-shadow: 0 4px 15px rgba(255, 172, 100, 0.12);
}
.cta-btn {
  border: none;
  line-height: 1;
}
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(8deg);
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
