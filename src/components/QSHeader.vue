<template>
  <view
    class="qs-header-container bg-gradient-to-b from-[#b30d0d] via-[#d31c1c] to-[#e42525] px-4 pb-5 rounded-b-[40rpx] shadow-lg relative"
    :style="{ paddingTop: safeArea.statusBarHeight + 'px' }">
    <view class="flex items-center"
      :style="{ height: safeArea.capsuleHeight + 'px', marginTop: (safeArea.capsuleTop - safeArea.statusBarHeight) + 'px' }">

      <image :src="logoUrl" mode="aspectFit" class="h-7 w-16 brightness-200 contrast-125" />
      <view class="flex items-center justify-center mt-0.5">
        <view class="h-[1px] w-6 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></view>
        <text class="text-[9px] text-[#ffd700] font-medium tracking-widest px-1.5">数 字 刊</text>
        <view class="h-[1px] w-6 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"></view>
      </view>
    </view>

    <!-- Search Bar -->
    <view class="mt-4 shadow-inner">
      <view
        class="w-full bg-[#f4f4f4] rounded-full px-5 py-2.5 flex items-center border border-white/10 backdrop-blur-md">
        <!-- SVG Search Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px] text-gray-400 mr-2.5 shrink-0" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" :value="store.searchQuery" @input="onSearchInput" placeholder="搜索文章、作者、关键词"
          placeholder-class="text-gray-400 text-xs font-light"
          class="w-full text-gray-800 text-xs outline-none bg-transparent" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMagazineStore } from '../store/magazineStore';
import { useSafeArea } from '../hooks/useSafeArea';

const store = useMagazineStore();
const logoUrl = store.config.headerLogo;
const { safeArea } = useSafeArea();


const onSearchInput = (e: any) => {
  store.setSearchQuery(e.detail.value || '');
};
</script>

<style lang="scss" scoped>
.qs-header-container {
  box-shadow: 0 8px 25px rgba(179, 13, 13, 0.12);
}
</style>
