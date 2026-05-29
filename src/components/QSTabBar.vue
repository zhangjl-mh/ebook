<template>
  <view class="tabbar-container fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-50 px-4 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
    <!-- Tab Item: Home -->
    <view 
      class="tabbar-item flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer"
      @tap="switchTab('home')"
    >
      <!-- Top active indicator bar -->
      <view v-if="activeTab === 'home'" class="absolute top-0 w-12 h-0.5 bg-[#c8161d] rounded-full"></view>
      
      <!-- Home Icon Image -->
      <image 
        :src="activeTab === 'home' ? '/static/tabs/home_active.png' : '/static/tabs/home.png'" 
        mode="aspectFit" 
        class="w-6 h-6 mb-0.5 mt-1"
      />
      <text 
        class="text-[10px]"
        :class="[ activeTab === 'home' ? 'font-bold text-[#c8161d]' : 'font-medium text-gray-400' ]"
      >首页</text>
    </view>

    <!-- Tab Item: Books -->
    <view 
      class="tabbar-item flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer"
      @tap="switchTab('book')"
    >
      <!-- Top active indicator bar -->
      <view v-if="activeTab === 'book'" class="absolute top-0 w-12 h-0.5 bg-[#c8161d] rounded-full"></view>
      
      <!-- Book Icon Image -->
      <image 
        :src="activeTab === 'book' ? '/static/tabs/book_active.png' : '/static/tabs/book.png'" 
        mode="aspectFit" 
        class="w-6 h-6 mb-0.5 mt-1"
      />
      <text 
        class="text-[10px]"
        :class="[ activeTab === 'book' ? 'font-bold text-[#c8161d]' : 'font-medium text-gray-400' ]"
      >书刊</text>
    </view>

    <!-- Tab Item: My -->
    <view 
      class="tabbar-item flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer"
      @tap="switchTab('my')"
    >
      <!-- Top active indicator bar -->
      <view v-if="activeTab === 'my'" class="absolute top-0 w-12 h-0.5 bg-[#c8161d] rounded-full"></view>
      
      <!-- My Icon Image -->
      <image 
        :src="activeTab === 'my' ? '/static/tabs/my_active.png' : '/static/tabs/my.png'" 
        mode="aspectFit" 
        class="w-6 h-6 mb-0.5 mt-1"
      />
      <text 
        class="text-[10px]"
        :class="[ activeTab === 'my' ? 'font-bold text-[#c8161d]' : 'font-medium text-gray-400' ]"
      >我的</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('home');

const switchTab = (tabName: string) => {
  activeTab.value = tabName;
  
  const chineseName = tabName === 'home' ? '首页' : tabName === 'book' ? '书刊' : '我的';
  uni.showToast({
    title: `切换到 ${chineseName} 频道`,
    icon: 'none',
    duration: 1500
  });
  
  console.log('Navigate custom simulated tab:', tabName);
};
</script>

<style lang="scss" scoped>
.pb-safe {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.tabbar-item {
  -webkit-tap-highlight-color: transparent;
}
image {
  transition: transform 0.2s ease;
}
.tabbar-item:active image {
  transform: scale(0.9);
}
</style>
