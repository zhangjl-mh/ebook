<template>
  <view class="qs-header" :style="{ paddingTop: `${safeArea.statusBarHeight}px` }">
    <view class="qs-header__bar" :style="barStyle">
      <image :src="store.config.headerLogo" mode="aspectFit" class="qs-header__logo" />
      <text class="qs-header__title">{{ store.config.headerTitle }}</text>
    </view>

    <input
      type="text"
      :value="store.searchQuery"
      placeholder="搜索文章、作者、关键词"
      placeholder-class="qs-header__placeholder"
      class="qs-header__search"
      @input="onSearchInput"
    />
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
  padding-right: 32rpx;
  padding-left: 32rpx;
  padding-bottom: 40rpx;
  background: #c8161d;
}

.qs-header__bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.qs-header__logo {
  width: 58rpx;
  height: 58rpx;
}

.qs-header__title {
  color: #fff;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1;
}

.qs-header__search {
  height: 72rpx;
  margin-top: 28rpx;
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
