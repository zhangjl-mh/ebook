<template>
  <view v-if="visible" class="media-assistant" @tap="emit('open')">
    <button class="media-assistant__close" @tap.stop="visible = false">
      <image src="/static/media/assistant-close.png" mode="aspectFit" />
    </button>
    <image src="/static/media/assistant-bot.png" mode="aspectFit" class="media-assistant__bot" />
    <text>AI助手</text>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  open: [];
}>();

const visible = ref(true);
</script>

<style lang="scss" scoped>
.media-assistant {
  position: fixed;
  right: 16rpx;
  bottom: calc(var(--qs-page-bottom-gap) + 66rpx);
  z-index: 30;
  display: flex;
  width: 86rpx;
  flex-direction: column;
  align-items: center;
}

.media-assistant__bot {
  width: 76rpx;
  height: 62rpx;
}

.media-assistant text {
  margin-top: -5rpx;
  padding: 7rpx 12rpx;
  border-radius: 24rpx;
  background: #ee4248;
  color: #fff;
  font-size: 21rpx;
  line-height: 1;
  white-space: nowrap;
}

.media-assistant__close {
  position: absolute;
  top: -8rpx;
  right: -3rpx;
  z-index: 2;
  width: 28rpx;
  height: 28rpx;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  line-height: 1;

  &::after {
    border: none;
  }
}

.media-assistant__close image {
  width: 100%;
  height: 100%;
}
</style>
