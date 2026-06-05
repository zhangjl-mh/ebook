<template>
  <view class="webview-page">
    <web-view v-if="url" :src="url" />
    <view v-else class="webview-page__empty">链接无效，请检查配置</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

type WebviewQuery = Record<string, string | undefined>;

const url = ref('');

const safeDecode = (value = '') => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

onLoad((query?: WebviewQuery) => {
  const rawUrl = safeDecode(query?.url);
  const title = safeDecode(query?.title || '详情');

  uni.setNavigationBarTitle({ title });

  if (/^https?:\/\//.test(rawUrl)) {
    url.value = rawUrl;
  }
});
</script>

<style lang="scss" scoped>
.webview-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--qs-page-bg);
}

.webview-page__empty {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  color: var(--qs-text-placeholder);
  font-size: 28rpx;
}
</style>
