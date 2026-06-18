<template>
  <view class="database-header">
    <view class="database-header__bar" :style="barStyle">
      <text class="database-header__title">{{ title }}</text>
    </view>

    <view class="database-header__search-panel">
      <image src="/static/brand/magazine_top_bg.png" mode="scaleToFill" class="database-header__bg" />
      <button v-if="showBack" class="database-header__back" @tap="goBack">
        <uni-icons type="left" size="23" color="#ffffff" />
      </button>
      <view class="database-header__search">
        <uni-icons type="search" size="18" color="#d71920" />
        <input type="text" :value="query" placeholder="请输入检索内容"
          placeholder-class="database-header__placeholder" class="database-header__input" @input="onInput" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { getUniInputValue } from '@/utils/events';

interface Props {
  query: string;
  title?: string;
  showBack?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: '数据库',
  showBack: false
});

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

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({
    url: '/pages/magazine/index'
  });
};
</script>

<style lang="scss" scoped>
.database-header {
  background: #fff;
}

.database-header__bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.database-header__title {
  color: #333;
  font-size: 30rpx;
  font-weight: 500;
  line-height: 1;
}

.database-header__search-panel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8rpx;
  overflow: hidden;
  padding: 18rpx 24rpx 42rpx;
  background: var(--qs-color-primary-strong);
}

.database-header__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.database-header__back {
  position: relative;
  z-index: 1;
  display: flex;
  width: 40rpx;
  height: 62rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;

  &::after {
    border: 0;
  }
}

.database-header__search {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  height: 62rpx;
  flex: 1;
  align-items: center;
  gap: 14rpx;
  padding: 0 22rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.92);
  border-radius: 999rpx;
  background: #fff;
  box-shadow: 0 10rpx 24rpx rgba(158, 0, 0, 0.08);
  box-sizing: border-box;
}

.database-header__input {
  min-width: 0;
  flex: 1;
  color: var(--qs-text-regular);
  font-size: 25rpx;
}

.database-header__placeholder {
  color: var(--qs-text-muted);
}
</style>
