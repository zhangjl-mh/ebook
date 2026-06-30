<template>
  <view class="qs-header">
    <view class="qs-header__nav" :style="navStyle">
      <text class="qs-header__title">首页</text>
      <view class="qs-header__capsule" :style="capsuleStyle">
        <text class="qs-header__dot">•••</text>
        <view class="qs-header__circle"></view>
      </view>
    </view>

    <view class="qs-header__tools">
      <view class="qs-header__search">
        <view class="qs-header__search-icon"></view>
        <input
          type="text"
          :value="store.searchQuery"
          placeholder="请输入检索内容"
          placeholder-class="qs-header__placeholder"
          class="qs-header__input"
          confirm-type="search"
          :maxlength="40"
          @input="onSearchInput"
          @confirm="onSearchInput"
        />
      </view>
      <button class="qs-header__ai" aria-label="打开AI小是" @tap="emit('open-ai')">
        <image src="/static/home/ai-mark.png" mode="aspectFit" />
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useMagazineStore } from '@/store/magazineStore';
import { getUniInputValue } from '@/utils/events';

const emit = defineEmits<{
  'open-ai': [];
}>();

const store = useMagazineStore();
const { safeArea } = useSafeArea();

const navStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));

const capsuleStyle = computed(() => ({
  top: `${safeArea.value.capsuleTop}px`,
  height: `${safeArea.value.capsuleHeight}px`
}));

const onSearchInput = (event: unknown) => {
  store.setSearchQuery(getUniInputValue(event));
};
</script>

<style lang="scss" scoped>
.qs-header {
  position: relative;
  background: #fff;
}

.qs-header__nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.qs-header__title {
  color: #111;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1;
}

.qs-header__capsule {
  position: absolute;
  right: 18rpx;
  display: flex;
  width: 160rpx;
  align-items: center;
  justify-content: space-around;
  border: 1rpx solid #e2e2e2;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.96);
  box-sizing: border-box;
}

.qs-header__dot {
  color: #333;
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
}

.qs-header__circle {
  width: 30rpx;
  height: 30rpx;
  border: 3rpx solid #333;
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    display: block;
    width: 12rpx;
    height: 12rpx;
    margin: 6rpx auto 0;
    border-radius: 50%;
    background: #333;
    content: '';
  }
}

.qs-header__tools {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 10rpx 18rpx 8rpx;
  box-sizing: border-box;
}

.qs-header__search {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  height: 62rpx;
  padding: 0 24rpx;
  border: 2rpx solid #cd1305;
  border-radius: 999rpx;
  background: #fff;
  box-sizing: border-box;
}

.qs-header__search-icon {
  position: relative;
  width: 34rpx;
  height: 34rpx;
  flex-shrink: 0;
  margin-right: 22rpx;
  border: 6rpx solid #d71920;
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    position: absolute;
    right: -13rpx;
    bottom: -8rpx;
    width: 17rpx;
    height: 6rpx;
    border-radius: 999rpx;
    background: #d71920;
    content: '';
    transform: rotate(45deg);
    transform-origin: left center;
  }
}

.qs-header__input {
  min-width: 0;
  flex: 1;
  color: var(--qs-text-regular);
  font-size: 26rpx;
}

.qs-header__placeholder {
  color: #9a9a9a;
}

.qs-header__ai {
  display: flex;
  width: 68rpx;
  height: 68rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1;

  &::after {
    border: 0;
  }
}

.qs-header__ai image {
  display: block;
  width: 68rpx;
  height: 68rpx;
}
</style>
