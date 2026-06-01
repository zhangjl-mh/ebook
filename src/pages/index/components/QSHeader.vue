<template>
  <view class="qs-header" :style="{ paddingTop: `${safeArea.statusBarHeight}px` }">

    <view class="qs-header__brand" :style="barStyle">
      <image :src="store.config.headerLogo" mode="heightFix" class="qs-header__wordmark" />
    </view>

    <input type="text" :value="store.searchQuery" placeholder="搜索文章、作者、关键词" placeholder-class="qs-header__placeholder"
      class="qs-header__search" @input="onSearchInput" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useMagazineStore } from '@/store/magazineStore';

const store = useMagazineStore();
const { safeArea } = useSafeArea();

const barStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop - safeArea.value.statusBarHeight}px`
}));

const getInputValue = (event: unknown) => {
  if (!event || typeof event !== 'object' || !('detail' in event)) return '';

  const detail = (event as { detail?: unknown }).detail;
  if (!detail || typeof detail !== 'object' || !('value' in detail)) return '';

  const value = (detail as { value?: unknown }).value;
  return typeof value === 'string' ? value : String(value || '');
};

const onSearchInput = (event: unknown) => {
  store.setSearchQuery(getInputValue(event));
};
</script>

<style lang="scss" scoped>
.qs-header {
  position: relative;
  overflow: hidden;
  padding-right: 32rpx;
  padding-left: 32rpx;
  padding-bottom: 168rpx;
  background: #c8161d;
}

.qs-header__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.qs-header__brand {}

.qs-header__wordmark {
  display: block;
  height: 100%;
  width: auto;
  background: #fff;
  border-radius: 50rpx;
}

.qs-header__search {
  position: relative;
  z-index: 1;
  height: 72rpx;
  margin-top: 34rpx;
  padding: 0 28rpx;
  border-radius: 999rpx;
  background: #fff;
  color: #333;
  font-size: 26rpx;
}

.qs-header__placeholder {
  color: #999;
}
</style>
