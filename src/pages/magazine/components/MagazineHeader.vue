<template>
  <view class="magazine-header">
    <image src="/static/issues/magazine_header.png" mode="aspectFit" class="magazine-header__bg" />

    <view class="magazine-header__bar" :style="barStyle">
      <text class="magazine-header__title">全部期刊</text>
    </view>

    <view class="magazine-header__search">
      <text class="magazine-header__search-icon">⌕</text>
      <input
        type="text"
        :value="query"
        placeholder="请搜索您感兴趣的期刊"
        placeholder-class="magazine-header__placeholder"
        class="magazine-header__input"
        @input="onInput"
      />
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
  padding: 0 32rpx 64rpx;
  background: #f5f5f7;
}

.magazine-header__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 190rpx;
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
  color: #8d1114;
  font-size: 38rpx;
  font-weight: 700;
  letter-spacing: 0;
  text-shadow: 0 6rpx 18rpx rgba(255, 255, 255, 0.82);
}

.magazine-header__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 76rpx;
  margin-top: 42rpx;
  padding: 0 30rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.76);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12rpx 34rpx rgba(72, 50, 34, 0.08);
}

.magazine-header__search-icon {
  margin-right: 14rpx;
  color: #9a918a;
  font-size: 36rpx;
  line-height: 1;
}

.magazine-header__input {
  flex: 1;
  color: #333;
  font-size: 28rpx;
}

.magazine-header__placeholder {
  color: #a79d98;
}
</style>
