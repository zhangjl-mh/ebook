<template>
  <view class="category-tabs-container flex items-center px-5 pt-4 pb-2 bg-white">
    <view
      v-for="tab in store.config.tabCategories"
      :key="tab.key"
      class="tab-item relative mr-8 pb-2 cursor-pointer"
      @tap="onTabChange(tab.key)"
    >
      <text
        class="text-[15px] transition-all duration-200"
        :class="[
          store.activeTab === tab.key
            ? 'font-bold text-[#c8161d]'
            : 'font-medium text-gray-400'
        ]"
      >{{ tab.name }}</text>
      <!-- 底部红色指示条 -->
      <view
        v-if="store.activeTab === tab.key"
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#c8161d] rounded-full"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useMagazineStore } from '../store/magazineStore';

const store = useMagazineStore();

const onTabChange = (tabKey: string) => {
  store.setActiveTab(tabKey);
};
</script>

<style lang="scss" scoped>
.tab-item {
  -webkit-tap-highlight-color: transparent;
  &:active {
    opacity: 0.7;
  }
}
</style>
