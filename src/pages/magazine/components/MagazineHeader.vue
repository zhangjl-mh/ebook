<template>
  <view class="magazine-header">
    <image src="/static/brand/magazine_top_bg.png" mode="scaleToFill" class="magazine-header__bg" />

    <view class="magazine-header__bar" :style="barStyle">
      <text class="magazine-header__title">书刊</text>
    </view>

    <view class="magazine-header__search">
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
  padding: 0 29rpx 112rpx;
  background: var(--qs-color-primary-strong);
}

.magazine-header__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}

.magazine-header__bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.magazine-header__title {
  color: var(--qs-text-inverse);
  font-size: 34rpx;
  font-weight: 600;
  line-height: 1;
  text-shadow: 0 4rpx 14rpx rgba(132, 0, 0, 0.2);
}

.magazine-header__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 58rpx;
  margin-top: 28rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.9);
  background: rgba(255, 247, 246, 0.94);
  box-shadow: 0 10rpx 24rpx rgba(158, 0, 0, 0.08);
}

.magazine-header__input {
  min-width: 0;
  flex: 1;
  color: var(--qs-text-regular);
  font-size: 25rpx;
}

.magazine-header__placeholder {
  color: var(--qs-text-muted);
}
</style>
