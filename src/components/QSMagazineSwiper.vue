<template>
  <view class="magazine-swiper-wrapper my-4 relative">
    <!-- 3D Stack Swiper showing both left and right side cards -->
    <swiper 
      class="swiper-box h-[400rpx]"
      :circular="true"
      previous-margin="80rpx"
      next-margin="80rpx"
      :current="currentIndex"
      @change="onSwiperChange"
    >
      <swiper-item 
        v-for="(item, index) in store.issuesList" 
        :key="item.id"
        class="swiper-item-box flex items-center justify-center"
      >
        <!-- The Magazine Card with scale & opacity transitions for a premium 3D stack effect -->
        <view 
          class="magazine-card flex items-center bg-white rounded-2xl p-4 border border-gray-100 transition-all duration-300 w-full mx-2 h-[340rpx]"
          :class="[
            currentIndex === index 
              ? 'scale-100 opacity-100 shadow-xl translate-y-0' 
              : 'scale-[0.88] opacity-40 translate-y-1'
          ]"
        >
          <!-- Left: Book Cover Graphic -->
          <view class="cover-container relative w-[200rpx] h-[280rpx] bg-[#c8161d] rounded-lg p-1.5 flex flex-col justify-between shadow-md border-r-4 border-black/15 shrink-0">
            <!-- inner white border -->
            <view class="absolute inset-1 border border-white/30 rounded flex flex-col justify-between p-1.5">
              <view class="flex justify-between items-start">
                <text class="text-[9rpx] text-white/70 font-light leading-none">求是</text>
                <text class="text-[9rpx] text-white/70 font-light leading-none">{{ item.year }}</text>
              </view>

              <!-- Center Big Title -->
              <view class="flex flex-col items-center justify-center my-auto">
                <text class="text-white font-serif text-2xl font-black tracking-widest leading-none">求是</text>
                <text class="text-[#ffd700] text-[12rpx] tracking-wider font-semibold mt-1">QIUSHI</text>
              </view>

              <view class="flex justify-between items-end">
                <text class="text-[9rpx] text-[#ffd700] leading-none">第{{ item.issueNum }}期</text>
                <text class="text-[8rpx] text-white/40 leading-none">机关理论刊</text>
              </view>
            </view>
          </view>

          <!-- Right: Book Metadata -->
          <view class="flex-1 flex flex-col justify-between ml-3.5 h-[280rpx]">
            <view>
              <!-- Issue Title -->
              <view class="text-base font-bold text-gray-800 flex items-center">
                {{ item.year }}年第<text class="text-[#c8161d] text-xl font-extrabold px-0.5">{{ item.issueNum }}</text>期
              </view>

              <!-- Article count -->
              <view class="text-[10px] text-gray-400 mt-0.5">
                本期收录 <text class="text-[#c8161d] font-bold">{{ item.articleCount }}</text> 篇文章
              </view>

              <!-- Key recommendations -->
              <view class="mt-2">
                <text class="text-[10px] font-bold text-[#b8860b] block">重点推荐：</text>
                <text class="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2 mt-0.5">
                  {{ item.recommendationTitle }}
                </text>
              </view>
            </view>

            <!-- Buttons -->
            <view class="flex gap-1.5 mt-auto">
              <button 
                class="flex-1 text-[10px] py-1.5 px-0 rounded-full border border-[#c8161d] text-[#c8161d] bg-white font-semibold flex items-center justify-center active:bg-red-50 transition-colors h-7"
                @tap.stop="store.enterCatalog(item)"
              >
                进入目录
              </button>
              <button 
                class="flex-1 text-[10px] py-1.5 px-0 rounded-full bg-[#c8161d] text-white font-semibold flex items-center justify-center active:bg-[#a61016] transition-colors h-7"
                @tap.stop="store.readOriginal(item)"
              >
                阅读原刊
              </button>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- Swiper Dots -->
    <view class="flex items-center justify-center gap-1.5 mt-1">
      <view 
        v-for="(item, index) in store.issuesList" 
        :key="item.id"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="[
          currentIndex === index ? 'w-4 bg-[#c8161d]' : 'w-1.5 bg-gray-300'
        ]"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMagazineStore } from '../store/magazineStore';

const store = useMagazineStore();
const currentIndex = ref(0); // Starts with 2026 Issue 10 centered

const onSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current;
  const currentIssue = store.issuesList[e.detail.current];
  if (currentIssue) {
    store.changeIssue(currentIssue.id);
  }
};
</script>

<style lang="scss" scoped>
.swiper-box {
  width: 100%;
}
.magazine-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
button {
  line-height: 1;
  border-radius: 9999px;
}
</style>
