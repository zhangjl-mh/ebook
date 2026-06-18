<template>
  <view class="home-actions">
    <button v-for="item in homeQuickActions" :key="item.id" class="home-actions__button"
      @tap="handleAction(item.target)">
      {{ item.label }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { homeQuickActions } from '@/config/homePage';
import { useMagazineStore } from '@/store/magazineStore';
import type { HomeQuickAction } from '@/config/homePage';

const store = useMagazineStore();
const openingPaperOrder = ref(false);

const handleAction = (target: HomeQuickAction['target']) => {
  if (target === 'paper') {
    if (openingPaperOrder.value) return;

    openingPaperOrder.value = true;
    uni.navigateTo({
      url: '/subPages/paper-order/index',
      fail: () => {
        uni.showToast({ title: '购买页面打开失败', icon: 'none' });
      },
      complete: () => {
        setTimeout(() => {
          openingPaperOrder.value = false;
        }, 500);
      }
    });
    return;
  }

  if (target === 'digital') {
    const currentIssue = store.currentIssue;

    if (!currentIssue) {
      uni.showToast({ title: '当前期刊不可用', icon: 'none' });
      return;
    }

    store.readOriginal(currentIssue);
    return;
  }

  if (target === 'archive') {
    uni.switchTab({
      url: '/pages/magazine/index',
      fail: () => {
        uni.showToast({ title: '打开书刊失败', icon: 'none' });
      }
    });
    return;
  }
};
</script>

<style lang="scss" scoped>
.home-actions {
  display: flex;
  gap: 16rpx;
  padding: 0 20rpx 18rpx;
  background: #f2f2f4;
}

.home-actions__button {
  height: 70rpx;
  flex: 1;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 999rpx;
  background: #fff;
  color: #d71920;
  font-size: 26rpx;
  font-weight: 700;
  line-height: 70rpx;

  &::after {
    border: none;
  }
}
</style>
