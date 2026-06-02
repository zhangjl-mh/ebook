<template>
  <view class="magazine-header">
    <image src="/static/brand/header_bg.jpg" mode="widthFix" class="magazine-header__bg" />

    <view class="magazine-header__bar" :style="barStyle">
      <text class="magazine-header__title">全部书刊</text>
    </view>

    <view class="magazine-header__search">
      <view class="magazine-header__search-icon"></view>
      <input type="text" :value="query" placeholder="请搜索您感兴趣的期刊" placeholder-class="magazine-header__placeholder"
        class="magazine-header__input" @input="onInput" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { getUniInputValue } from '@/utils/events';

interface Props {
  query: string;
}

defineProps<Props>();
const emit = defineEmits<{
  search: [value: string];
}>();

const { safeArea } = useSafeArea();

const barStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop}px`
}));

const onInput = (event: unknown) => {
  emit('search', getUniInputValue(event));
};
</script>

<style lang="scss" scoped>
.magazine-header {
  position: relative;
  overflow: hidden;
  padding: 0 32rpx 122rpx;
  background: #d71920;

  &::after {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      linear-gradient(180deg, rgba(207, 14, 20, 0.98) 0%, rgba(219, 23, 28, 0.94) 45%, rgba(232, 53, 55, 0.62) 70%, rgba(247, 247, 247, 0) 100%),
      radial-gradient(circle at 16% 66%, rgba(255, 255, 255, 0.28) 0, rgba(255, 255, 255, 0) 34%);
    content: '';
  }
}

.magazine-header__bg {
  position: absolute;
  inset: 0;
  width: 100%;
}

.magazine-header__bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.magazine-header__title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  text-shadow: 0 4rpx 14rpx rgba(132, 0, 0, 0.2);
}

.magazine-header__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 76rpx;
  margin-top: 48rpx;
  padding: 0 30rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14rpx 32rpx rgba(156, 0, 0, 0.12);
}

.magazine-header__search-icon {
  position: relative;
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
  margin-right: 24rpx;
  border: 4rpx solid #5f6469;
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    position: absolute;
    right: -10rpx;
    bottom: -7rpx;
    width: 16rpx;
    height: 4rpx;
    border-radius: 999rpx;
    background: #5f6469;
    content: '';
    transform: rotate(45deg);
    transform-origin: left center;
  }
}

.magazine-header__input {
  min-width: 0;
  flex: 1;
  color: #333;
  font-size: 28rpx;
}

.magazine-header__placeholder {
  color: #8a8f96;
}
</style>
