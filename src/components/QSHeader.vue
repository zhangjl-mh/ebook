<template>
  <view
    class="qs-header-container relative overflow-hidden"
    :style="{ paddingTop: safeArea.statusBarHeight + 'px' }">
    <!-- 红色渐变背景 -->
    <view class="absolute inset-0 bg-gradient-to-b from-[#b30d0d] via-[#d31c1c] to-[#e42525]"></view>
    <!-- 左右两侧装饰红色竖条纹 -->
    <view class="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ff4040]/40 to-transparent"></view>
    <view class="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ff4040]/40 to-transparent"></view>

    <!-- 导航栏区域：左图标 + 标题 + 右图标 -->
    <view
      class="relative z-10 flex items-center justify-between px-4"
      :style="{ height: safeArea.capsuleHeight + 'px', marginTop: (safeArea.capsuleTop - safeArea.statusBarHeight) + 'px' }">

      <!-- 左侧：用户头像图标 -->
      <view class="header-icon-btn w-8 h-8 rounded-full border-2 border-white/60 flex items-center justify-center bg-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </view>

      <!-- 中间：标题区域 -->
      <view class="flex flex-col items-center justify-center flex-1">
        <text class="text-white text-xl font-bold tracking-[6rpx] leading-none header-title-text">求是数字刊</text>
        <!-- 金色星号装饰 -->
        <view class="flex items-center justify-center mt-1">
          <view class="h-[1px] w-5 bg-gradient-to-r from-transparent to-[#ffd700]/60"></view>
          <text class="text-[#ffd700] text-[10px] mx-1.5 leading-none">★</text>
          <view class="h-[1px] w-5 bg-gradient-to-l from-transparent to-[#ffd700]/60"></view>
        </view>
      </view>

      <!-- 右侧：设置齿轮图标 -->
      <view class="header-icon-btn w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </view>
    </view>

    <!-- 搜索栏 -->
    <view class="relative z-10 mx-4 mt-3 mb-5">
      <view
        class="w-full bg-white rounded-full px-4 py-2.5 flex items-center shadow-sm">
        <!-- 搜索图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 mr-2 shrink-0" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" :value="store.searchQuery" @input="onSearchInput" placeholder="搜索文章、作者、关键词"
          placeholder-class="text-gray-400 text-xs"
          class="w-full text-gray-800 text-xs outline-none bg-transparent" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useMagazineStore } from '../store/magazineStore';
import { useSafeArea } from '../hooks/useSafeArea';

const store = useMagazineStore();
const { safeArea } = useSafeArea();

const onSearchInput = (e: any) => {
  store.setSearchQuery(e.detail.value || '');
};
</script>

<style lang="scss" scoped>
.qs-header-container {
  box-shadow: 0 8px 25px rgba(179, 13, 13, 0.12);
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
}
.header-title-text {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-family: 'STSong', 'SimSun', 'Songti SC', serif;
}
.header-icon-btn {
  -webkit-tap-highlight-color: transparent;
  &:active {
    opacity: 0.7;
    transform: scale(0.92);
  }
}
</style>
