<template>
  <view class="media-detail">
    <view class="media-detail__header" :style="headerStyle">
      <button class="media-detail__back" :style="backStyle" @tap="goBack">
        <uni-icons type="left" size="24" color="#555555" />
      </button>
      <text>视频汇</text>
    </view>

    <scroll-view class="media-detail__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true" :bounces="false">
      <template v-if="item">
        <view v-if="isVideo" class="video-detail">
          <text class="video-detail__title">{{ item.title }}</text>
          <text class="video-detail__meta">{{ item.viewCount || 0 }}观看过｜发表于 {{ item.date }}</text>

          <button class="video-player" @tap="togglePlayback">
            <image v-if="item.poster && !posterFailed" :src="item.poster" mode="widthFix" class="video-player__poster"
              @error="posterFailed = true" />
            <view v-else class="video-player__fallback">视频内容暂不可用</view>
            <view class="video-player__control">
              <text v-if="isPlaying" class="video-player__pause">Ⅱ</text>
              <uni-icons v-else type="videocam-filled" size="25" color="#ffffff" />
            </view>
          </button>

          <view class="video-actions">
            <button class="video-actions__item" :class="{ 'video-actions__item--active': liked }" @tap="toggleLike">
              <uni-icons :type="liked ? 'heart-filled' : 'heart'" size="24"
                :color="liked ? '#d71920' : '#a4a4a4'" />
              <text>{{ likeCount }}</text>
            </button>
            <button class="video-actions__item" @tap="showCommentTips">
              <uni-icons type="chat-filled" size="23" color="#a4a4a4" />
              <text>{{ item.commentCount || 0 }}</text>
            </button>
            <button class="video-actions__item" @tap="shareContent">
              <uni-icons type="redo-filled" size="24" color="#a4a4a4" />
              <text>{{ item.shareCount || 0 }}</text>
            </button>
          </view>
        </view>

        <view v-else-if="isWeekly" class="weekly-detail">
          <image src="/static/media/weekly-banner.jpg" mode="aspectFill" class="weekly-detail__banner" />

          <view class="weekly-detail__tabs">
            <button v-for="section in weeklySections" :key="section.key" class="weekly-detail__tab"
              :class="{ 'weekly-detail__tab--active': activeWeeklySection === section.key }"
              @tap="activeWeeklySection = section.key">
              {{ section.label }}
            </button>
          </view>

          <view class="weekly-detail__body">
            <text v-for="(paragraph, index) in activeSection?.paragraphs || []" :key="`${activeWeeklySection}-${index}`">
              {{ index + 1 }}、{{ paragraph }}
            </text>
          </view>
        </view>

        <view v-else class="article-detail">
          <text class="article-detail__breadcrumb">求是网 &gt; 国外思想理论一瞥</text>
          <view class="article-detail__line"></view>
          <text class="article-detail__title">{{ item.title }}</text>
          <view class="article-detail__meta">
            <text>来源-{{ item.source }}</text>
            <text>{{ item.date }}</text>
          </view>
          <view class="article-detail__body">
            <text>{{ item.summary }}</text>
            <text>当前国际思想理论领域出现了一系列值得关注的新概念和新趋势。理解这些变化，需要放在科技发展、资本运行和全球治理的背景下进行观察。</text>
            <text>本文从概念源流、现实表现和社会影响三个方面进行梳理，为读者提供清晰、可靠的理论参考。</text>
          </view>
        </view>
      </template>

      <view v-else class="media-detail__empty">
        <uni-icons type="info" size="32" color="#b6b6b6" />
        <text>内容不存在或已下线</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { mediaItems, weeklySections } from '@/config/mediaCenter';
import { useSafeArea } from '@/hooks/useSafeArea';
import { MediaCategoryKey, MediaItemType, WeeklySectionKey } from '@/types/enums';
import type { WeeklySectionKey as WeeklySectionKeyValue } from '@/types/enums';

const { safeArea } = useSafeArea();
const itemId = ref('');
const posterFailed = ref(false);
const isPlaying = ref(false);
const liked = ref(false);
const activeWeeklySection = ref<WeeklySectionKeyValue>(WeeklySectionKey.Activities);

const item = computed(() => mediaItems.find((mediaItem) => mediaItem.id === itemId.value));
const isVideo = computed(() => item.value?.type === MediaItemType.Video);
const isWeekly = computed(() => item.value?.category === MediaCategoryKey.Weekly);
const likeCount = computed(() => (item.value?.likeCount || 0) + (liked.value ? 1 : 0));
const activeSection = computed(() =>
  weeklySections.find((section) => section.key === activeWeeklySection.value)
);
const headerStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));
const backStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`
}));

onLoad((query) => {
  itemId.value = typeof query?.id === 'string' ? decodeURIComponent(query.id) : '';
});

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({ url: '/pages/media/index' });
};

const togglePlayback = () => {
  isPlaying.value = !isPlaying.value;
  uni.showToast({
    title: isPlaying.value ? '开始播放' : '已暂停',
    icon: 'none',
    duration: 900
  });
};

const toggleLike = () => {
  liked.value = !liked.value;
};

const showCommentTips = () => {
  uni.showToast({ title: '评论功能建设中', icon: 'none' });
};

const shareContent = () => {
  uni.showToast({ title: '请使用右上角分享', icon: 'none' });
};
</script>

<style lang="scss">
page {
  background: #f6f7f9;
}
</style>

<style lang="scss" scoped>
.media-detail {
  display: flex;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  background: #f6f7f9;
}

.media-detail__header {
  position: relative;
  z-index: 10;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #e5e5e5;
  background: #fff;
  box-sizing: border-box;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}

.media-detail__back {
  position: absolute;
  left: 22rpx;
  bottom: 0;
  display: flex;
  width: 70rpx;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;

  &::after {
    border: none;
  }
}

.media-detail__scroll {
  min-height: 0;
  flex: 1;
}

.video-detail {
  min-height: 100%;
  padding: 34rpx 28rpx calc(50rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-sizing: border-box;
}

.video-detail__title {
  display: block;
  color: #333;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.45;
}

.video-detail__meta {
  display: block;
  margin-top: 22rpx;
  color: #a8a8a8;
  font-size: 22rpx;
  font-weight: 600;
}

.video-player {
  position: relative;
  display: block;
  width: 74%;
  min-height: 780rpx;
  overflow: hidden;
  margin: 106rpx auto 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: #10152e;

  &::after {
    border: none;
  }
}

.video-player__poster {
  display: block;
  width: 100%;
}

.video-player__fallback {
  display: flex;
  height: 780rpx;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26rpx;
}

.video-player__control {
  position: absolute;
  left: 16rpx;
  bottom: 16rpx;
  display: flex;
  width: 58rpx;
  height: 58rpx;
  align-items: center;
  justify-content: center;
  border: 3rpx solid #fff;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
}

.video-player__pause {
  color: #fff;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 1;
}

.video-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 42rpx;
  padding: 20rpx 12rpx;
  border-top: 1rpx solid #eeeeee;
}

.video-actions__item {
  display: flex;
  width: 120rpx;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #a4a4a4;
  font-size: 23rpx;

  &::after {
    border: none;
  }
}

.video-actions__item--active {
  color: #d71920;
}

.weekly-detail {
  min-height: 100%;
  background: #fff;
}

.weekly-detail__banner {
  display: block;
  width: 100%;
  height: 176rpx;
}

.weekly-detail__tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 0 18rpx;
  border-bottom: 1rpx solid #dcdcdc;
  background: #fff;
}

.weekly-detail__tab {
  height: 76rpx;
  margin: 0;
  padding: 0;
  border: none;
  border-bottom: 3rpx solid transparent;
  border-radius: 0;
  background: transparent;
  color: #0787dc;
  font-size: 24rpx;
  line-height: 76rpx;

  &::after {
    border: none;
  }
}

.weekly-detail__tab--active {
  border-bottom-color: #0787dc;
  font-weight: 700;
}

.weekly-detail__body {
  display: flex;
  flex-direction: column;
  gap: 46rpx;
  padding: 28rpx 38rpx calc(70rpx + env(safe-area-inset-bottom));
  color: #3d3d3d;
  font-size: 28rpx;
  line-height: 2;
  text-align: justify;
}

.article-detail {
  min-height: 100%;
  padding: 38rpx 30rpx calc(70rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-sizing: border-box;
}

.article-detail__breadcrumb {
  color: #999;
  font-size: 24rpx;
}

.article-detail__line {
  height: 4rpx;
  margin: 36rpx 0 30rpx;
  background: #c93b3b;
}

.article-detail__title {
  display: block;
  color: #333;
  font-size: 38rpx;
  font-weight: 700;
  line-height: 1.55;
}

.article-detail__meta {
  display: flex;
  gap: 28rpx;
  margin-top: 28rpx;
  color: #aaa;
  font-size: 23rpx;
}

.article-detail__body {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  margin-top: 44rpx;
  color: #444;
  font-size: 29rpx;
  line-height: 1.9;
  text-align: justify;
}

.media-detail__empty {
  display: flex;
  height: 70vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18rpx;
  color: #999;
  font-size: 26rpx;
}
</style>
