<template>
  <view class="webview-page">
    <web-view v-if="url" :src="url" />
    <view v-else class="empty-wrap">
      <text class="empty-text">链接无效</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const url = ref('');

onLoad((query) => {
  const rawUrl = decodeURIComponent((query?.url as string) || '');
  const title = decodeURIComponent((query?.title as string) || '详情');
  if (title) {
    uni.setNavigationBarTitle({ title });
  }
  if (/^https?:\/\//.test(rawUrl)) {
    url.value = rawUrl;
  }
});
</script>

<style lang="scss">
.webview-page {
  width: 100%;
  min-height: 100vh;
}
.empty-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-text {
  color: #999;
  font-size: 28rpx;
}
</style>
