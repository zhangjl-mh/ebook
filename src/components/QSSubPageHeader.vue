<template>
  <view class="qs-sub-page-header" :class="headerClass">
    <view class="qs-sub-page-header__nav" :style="barStyle">
      <button class="qs-sub-page-header__back" @tap="goBack">
        <uni-icons type="left" size="24" color="#ffffff" />
      </button>
      <text class="qs-sub-page-header__title">{{ title }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';

type HeaderMode = 'default' | 'compact';

interface Props {
  title: string;
}

defineProps<Props>();
const mode = defineModel<HeaderMode>('mode', { default: 'default' });

const { safeArea } = useSafeArea();

const headerClass = computed(() => `qs-sub-page-header--${mode.value}`);

const barStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop}px`
}));

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({
    url: '/pages/index/index'
  });
};
</script>

<style lang="scss" scoped>
.qs-sub-page-header {
  position: relative;
  overflow: hidden;
  padding-bottom: 130rpx;
  background:
    radial-gradient(circle at 18% 28%, rgba(255, 255, 255, 0.3) 0, rgba(255, 255, 255, 0) 34%),
    linear-gradient(180deg, #e81822 0%, #d70f19 100%);
  box-sizing: border-box;
}

.qs-sub-page-header--compact {
  position: sticky;
  top: 0;
  z-index: 40;
  padding-bottom: 6rpx;
}

.qs-sub-page-header__nav {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
}

.qs-sub-page-header--compact .qs-sub-page-header__nav {
  margin-bottom: 8rpx;
}

.qs-sub-page-header__back {
  position: absolute;
  left: 30rpx;
  top: 50%;
  display: flex;
  width: 68rpx;
  height: 68rpx;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #fff;
  line-height: 1;
  transform: translateY(-50%);

  &::after {
    border: none;
  }
}

.qs-sub-page-header__title {
  max-width: 420rpx;
  overflow: hidden;
  color: #fff;
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
