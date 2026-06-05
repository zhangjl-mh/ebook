<template>
  <view class="qs-header">
    <image :src="store.config.headerBackground" mode="aspectFill" class="qs-header__bg" />

    <view class="qs-header__brand" :style="brandStyle">
      <image :src="store.config.headerLogo" mode="heightFix" class="qs-header__wordmark" />
    </view>

    <view class="qs-header__search">
      <view class="qs-header__search-icon"></view>
      <input type="text" :value="store.searchQuery" placeholder="搜索文章、作者、关键词" placeholder-class="qs-header__placeholder"
        class="qs-header__input" @input="onSearchInput" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useMagazineStore } from '@/store/magazineStore';
import { getUniInputValue } from '@/utils/events';

const store = useMagazineStore();
const { safeArea } = useSafeArea();

const brandStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop}px`
}));

const onSearchInput = (event: unknown) => {
  store.setSearchQuery(getUniInputValue(event));
};
</script>

<style lang="scss" scoped>
.qs-header {
  position: relative;
  overflow: hidden;
  padding: 0 32rpx 172rpx;
  background: var(--qs-color-primary);

  &::after {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      linear-gradient(180deg, rgba(214, 25, 32, 0.98) 0%, rgba(219, 26, 32, 0.96) 46%, rgba(225, 50, 54, 0.72) 72%, rgba(245, 246, 248, 0) 100%),
      radial-gradient(circle at 18% 46%, rgba(255, 255, 255, 0.24) 0, rgba(255, 255, 255, 0) 34%);
    content: '';
  }
}

.qs-header__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.qs-header__brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
}

.qs-header__wordmark {
  display: block;
  height: 100%;
  width: auto;
}

.qs-header__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 72rpx;
  margin-top: 32rpx;
  padding: 0 30rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12rpx 30rpx rgba(105, 0, 0, 0.08);
}

.qs-header__search-icon {
  position: relative;
  width: 28rpx;
  height: 28rpx;
  flex-shrink: 0;
  margin-right: 22rpx;
  border: 4rpx solid #696d72;
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    position: absolute;
    right: -10rpx;
    bottom: -7rpx;
    width: 15rpx;
    height: 4rpx;
    border-radius: 999rpx;
    background: #696d72;
    content: '';
    transform: rotate(45deg);
    transform-origin: left center;
  }
}

.qs-header__input {
  min-width: 0;
  flex: 1;
  color: var(--qs-text-regular);
  font-size: 28rpx;
}

.qs-header__placeholder {
  color: var(--qs-text-secondary);
}
</style>
