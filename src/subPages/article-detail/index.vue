<template>
  <view class="article-detail-page" :class="{ 'article-detail-page--dark': isDarkArticle }">
    <scroll-view class="article-detail-page__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
      :bounces="false">
      <view class="article-detail-page__inner">
        <view v-if="isDarkArticle" class="article-dark-header" :style="darkHeaderStyle">
          <button class="article-dark-header__back" :style="darkBackStyle" @tap="goBack">
            <uni-icons type="left" size="24" color="#d7d7d7" />
          </button>
          <text>文章详情</text>
        </view>
        <QSSubPageHeader v-else title="详情" />

        <view class="article-detail-page__content" :style="contentStyle">
          <view v-if="article" class="article-card" :class="{
            'article-card--dark': isDarkArticle,
            'article-card--english': article.language === 'en'
          }">
            <view v-if="!isDarkArticle" class="article-card__source">
              <text>来源：{{ article.source }}</text>
              <text>作者：{{ article.author }}</text>
              <text>字数：{{ article.wordCount }}</text>
            </view>

            <text class="article-card__title">{{ article.title }}</text>
            <text v-if="isDarkArticle" class="article-card__author">{{ article.author }}</text>

            <view class="article-card__meta">
              <text>{{ article.issue }}</text>
              <text>{{ article.publishTime }}</text>
              <text v-if="isDarkArticle">{{ article.source }}</text>
            </view>

            <button v-if="article.heroImage && article.heroMedia === 'video'" class="article-card__video"
              @tap="toggleVideoPlayback">
              <image v-if="!failedImageMap.hero" :src="article.heroImage" mode="aspectFill"
                @error="markImageFailed('hero')" />
              <view v-else class="article-body__image-fallback">图片加载失败</view>
              <view class="article-video__shade"></view>
              <view v-if="!isVideoPlaying" class="article-video__play">
                <view class="article-video__play-triangle"></view>
              </view>
              <view v-else class="article-video__status">
                <text>播放中</text>
                <text>{{ formattedVideoTime }} / 03:18</text>
              </view>
              <view class="article-video__progress">
                <view :style="{ width: `${videoProgress}%` }"></view>
              </view>
            </button>

            <view v-else-if="article.heroImage" class="article-card__hero">
              <image v-if="!failedImageMap.hero" :src="article.heroImage" mode="aspectFill"
                @error="markImageFailed('hero')" />
              <view v-else class="article-body__image-fallback">图片加载失败</view>
            </view>

            <view class="article-body" :class="{ 'article-body--english': article.language === 'en' }">
              <template v-for="block in article.body" :key="block.id">
                <view v-if="isImageBlock(block)" class="article-body__image-card">
                  <image v-if="!failedImageMap[block.id]" class="article-body__image" :src="getImageSrc(block)"
                    :alt="getImageAlt(block)" mode="widthFix" lazy-load show-menu-by-longpress
                    @error="markImageFailed(block.id)" />
                  <view v-else class="article-body__image-fallback">图片加载失败</view>
                </view>
                <text v-else :class="getBlockClass(block.type)">{{ getBlockText(block) }}</text>
              </template>
            </view>
          </view>

          <view v-else class="article-detail-page__empty">暂无文章内容</view>
        </view>
      </view>
    </scroll-view>

    <view v-if="article" class="article-actions" :style="actionBarStyle">
      <button class="article-actions__item" :class="{ 'article-actions__item--active': isFavorited }"
        @tap="toggleFavorite">
        {{ isFavorited ? '已收藏' : '收藏' }}
      </button>
      <button class="article-actions__item" :class="{ 'article-actions__item--active': isLiked }" @tap="likeArticle">
        点赞 {{ likeCount }}
      </button>
      <button class="article-actions__item" @tap="shareArticle">分享</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { articleDetails } from '@/subPages/config/articleDetail';
import { useSafeArea } from '@/hooks/useSafeArea';
import { safeDecode } from '@/utils/text';
import { ArticleBodyBlockType } from '@/types/enums';
import type {
  ArticleBodyBlock,
  ArticleBodyBlockType as ArticleBodyBlockTypeValue,
  ArticleDetail
} from '@/types/articleDetail';

type ArticleQuery = Record<string, string | undefined>;

const { safeArea } = useSafeArea();
const fallbackArticle = articleDetails[0] || null;
const article = ref<ArticleDetail | null>(fallbackArticle);
const isFavorited = ref(false);
const isLiked = ref(false);
const likeCount = ref(fallbackArticle?.likeCount || 0);
const failedImageMap = ref<Record<string, boolean>>({});
const isVideoPlaying = ref(false);
const videoProgress = ref(0);
let videoTimer: ReturnType<typeof setInterval> | undefined;
const isDarkArticle = computed(() => article.value?.theme === 'prototype-dark');
const formattedVideoTime = computed(() => {
  const elapsedSeconds = Math.floor(198 * videoProgress.value / 100);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = String(elapsedSeconds % 60).padStart(2, '0');

  return `${String(minutes).padStart(2, '0')}:${seconds}`;
});

const contentStyle = computed(() => ({
  paddingBottom: `calc(170rpx + ${safeArea.value.bottomInset}px)`
}));

const actionBarStyle = computed(() => ({
  paddingBottom: `calc(14rpx + ${safeArea.value.bottomInset}px)`
}));
const darkHeaderStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));
const darkBackStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`
}));

onLoad((query?: ArticleQuery) => {
  const articleId = safeDecode(query?.id);
  const matchedArticle = articleDetails.find((item) => item.id === articleId);

  if (matchedArticle) {
    setArticle(matchedArticle);
    return;
  }

  if (fallbackArticle) {
    setArticle(fallbackArticle);
  }

  if (articleId) {
    uni.showToast({
      title: '文章参数无效，已显示默认文章',
      icon: 'none'
    });
  }
});

const setArticle = (nextArticle: ArticleDetail) => {
  stopVideoPlayback();
  videoProgress.value = 0;
  article.value = nextArticle;
  likeCount.value = nextArticle.likeCount;
  isFavorited.value = false;
  isLiked.value = false;
  failedImageMap.value = {};
};

const stopVideoPlayback = () => {
  if (videoTimer) {
    clearInterval(videoTimer);
    videoTimer = undefined;
  }

  isVideoPlaying.value = false;
};

const toggleVideoPlayback = () => {
  if (failedImageMap.value.hero) return;

  if (isVideoPlaying.value) {
    stopVideoPlayback();
    return;
  }

  isVideoPlaying.value = true;
  videoTimer = setInterval(() => {
    videoProgress.value = videoProgress.value >= 100 ? 0 : videoProgress.value + 0.5;
  }, 1000);
};

const getBlockClass = (type: ArticleBodyBlockTypeValue) => [
  'article-body__block',
  `article-body__block--${type}`
];

const isImageBlock = (block: ArticleBodyBlock) => block.type === ArticleBodyBlockType.Image;

const getImageSrc = (block: ArticleBodyBlock) => (
  block.type === ArticleBodyBlockType.Image ? block.src : ''
);

const getImageAlt = (block: ArticleBodyBlock) => (
  block.type === ArticleBodyBlockType.Image ? block.alt : ''
);

const getBlockText = (block: ArticleBodyBlock) => (
  block.type === ArticleBodyBlockType.Image ? '' : block.text
);

const markImageFailed = (blockId: string) => {
  failedImageMap.value = {
    ...failedImageMap.value,
    [blockId]: true
  };
};

const toggleFavorite = () => {
  isFavorited.value = !isFavorited.value;

  uni.showToast({
    title: isFavorited.value ? '已收藏' : '已取消收藏',
    icon: 'none',
    duration: 1000
  });
};

const likeArticle = () => {
  if (isLiked.value) {
    uni.showToast({
      title: '已点赞',
      icon: 'none',
      duration: 1000
    });
    return;
  }

  isLiked.value = true;
  likeCount.value += 1;
};

const shareArticle = () => {
  uni.showToast({
    title: '分享功能暂未接入',
    icon: 'none',
    duration: 1200
  });
};

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({
    url: '/pages/index/index'
  });
};

onUnload(stopVideoPlayback);
</script>

<style lang="scss">
page {
  background: var(--qs-page-bg-soft);
}
</style>

<style lang="scss" scoped>
.article-detail-page {
  height: 100%;
  overflow: hidden;
  background: var(--qs-page-bg-soft);
}

.article-detail-page__scroll {
  height: 100%;
  background: var(--qs-page-bg-soft);
}

.article-detail-page--dark,
.article-detail-page--dark .article-detail-page__scroll {
  background: #171717;
}

.article-dark-header {
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #171717;
  box-sizing: border-box;
  color: #d7d7d7;
  font-size: 28rpx;
}

.article-dark-header__back {
  position: absolute;
  left: 22rpx;
  bottom: 6rpx;
  display: flex;
  width: 70rpx;
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

.article-detail-page__inner {
  min-height: 100%;
  box-sizing: border-box;
}

.article-detail-page__content {
  position: relative;
  z-index: 2;
  margin-top: -92rpx;
  padding: 0 var(--qs-page-padding-x);
  box-sizing: border-box;
}

.article-detail-page--dark .article-detail-page__content {
  margin-top: 0;
  padding: 0;
}

.article-card {
  padding: 40rpx 34rpx 52rpx;
  border-radius: var(--qs-radius-panel);
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-card);
  box-sizing: border-box;
}

.article-card--dark {
  min-height: 100vh;
  padding: 18rpx 40rpx 80rpx;
  border-radius: 0;
  background: #171717;
  box-shadow: none;
}

.article-card__source {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 28rpx;
  padding: 18rpx 20rpx;
  border-radius: 10rpx;
  background: #f7f7f7;
  color: #737780;
  font-size: 24rpx;
  line-height: 1.45;
}

.article-card__title {
  display: block;
  margin-top: 34rpx;
  color: #24262b;
  font-size: 39rpx;
  font-weight: 800;
  line-height: 1.38;
}

.article-card--dark .article-card__title {
  margin-top: 0;
  color: #ef3a35;
  font-size: 39rpx;
  line-height: 1.36;
  text-align: center;
}

.article-card__author {
  display: block;
  margin-top: 54rpx;
  color: #969696;
  font-size: 32rpx;
  line-height: 1.4;
  text-align: center;
}

.article-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 26rpx;
  margin-top: 20rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid var(--qs-border-color);
  color: #8b9098;
  font-size: 24rpx;
  line-height: 1.45;
}

.article-card--dark .article-card__meta {
  justify-content: center;
  margin-top: 24rpx;
  padding-bottom: 24rpx;
  border-color: #292929;
  color: #777;
  font-size: 21rpx;
  text-align: center;
}

.article-card__hero {
  overflow: hidden;
  margin: 10rpx -14rpx 0;
  border-radius: 4rpx;
  background: #242424;
}

.article-card__hero image,
.article-card__video image {
  display: block;
  width: 100%;
  height: 330rpx;
}

.article-card__video {
  position: relative;
  display: block;
  width: calc(100% + 28rpx);
  height: 330rpx;
  overflow: hidden;
  margin: 10rpx -14rpx 0;
  padding: 0;
  border: 0;
  border-radius: 4rpx;
  background: #242424;
  line-height: 1;

  &::after {
    border: 0;
  }
}

.article-video__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.42));
}

.article-video__play {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  width: 92rpx;
  height: 92rpx;
  align-items: center;
  justify-content: center;
  border: 3rpx solid rgba(255, 255, 255, 0.88);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.26);
  box-sizing: border-box;
  transform: translate(-50%, -50%);
}

.article-video__play-triangle {
  width: 0;
  height: 0;
  margin-left: 8rpx;
  border-top: 17rpx solid transparent;
  border-bottom: 17rpx solid transparent;
  border-left: 26rpx solid #fff;
}

.article-video__status {
  position: absolute;
  right: 18rpx;
  bottom: 22rpx;
  left: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 21rpx;
  line-height: 1.3;
  text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.5);
}

.article-video__progress {
  position: absolute;
  right: 18rpx;
  bottom: 10rpx;
  left: 18rpx;
  height: 5rpx;
  overflow: hidden;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.32);
}

.article-video__progress view {
  height: 100%;
  border-radius: inherit;
  background: #ef3a35;
  transition: width 0.3s linear;
}

.article-body {
  padding-top: 30rpx;
}

.article-body__block {
  display: block;
}

.article-body__image-card {
  overflow: hidden;
  margin-top: 34rpx;
  border-radius: 12rpx;
  background: #f4f5f6;
}

.article-body__image {
  display: block;
  width: 100%;
}

.article-body__image-fallback {
  display: flex;
  min-height: 280rpx;
  align-items: center;
  justify-content: center;
  color: #8b9098;
  font-size: 25rpx;
}

.article-body__block--heading {
  margin: 34rpx 0 20rpx;
  color: #202226;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 1.45;
  text-align: center;
}

.article-body__block--author {
  margin: 12rpx 0 34rpx;
  color: #3b3d42;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
}

.article-body__block--paragraph {
  margin-top: 24rpx;
  color: #2f3338;
  font-size: 31rpx;
  line-height: 1.95;
  text-align: justify;
  text-indent: 2em;
}

.article-card--dark .article-body__block--paragraph {
  margin-top: 34rpx;
  color: #aaa;
  font-size: 30rpx;
  line-height: 1.9;
}

.article-body--english .article-body__block--paragraph {
  text-align: left;
  text-indent: 0;
}

.article-body__block--note {
  margin-top: 16rpx;
  color: #636871;
  font-size: 25rpx;
  line-height: 1.75;
  text-align: center;
}

.article-body__block--caption {
  margin: 34rpx 0 10rpx;
  padding: 20rpx 22rpx;
  border-left: 6rpx solid #e31822;
  border-radius: 8rpx;
  background: #fafafa;
  color: #747982;
  font-size: 24rpx;
  line-height: 1.65;
}

.article-detail-page__empty {
  padding: 120rpx 0;
  border-radius: 20rpx;
  background: var(--qs-card-bg);
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

.article-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1rpx;
  padding: 14rpx 30rpx;
  border-top: 1rpx solid var(--qs-border-color);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -10rpx 30rpx rgba(28, 30, 34, 0.05);
  box-sizing: border-box;
}

.article-detail-page--dark .article-actions {
  border-color: #303030;
  background: rgba(23, 23, 23, 0.98);
  box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.24);
}

.article-actions__item {
  flex: 1;
  height: 72rpx;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #70757e;
  font-size: 25rpx;
  line-height: 72rpx;

  &::after {
    border: none;
  }
}

.article-actions__item--active {
  color: #d71920;
  font-weight: 700;
}

.article-detail-page--dark .article-actions__item {
  color: #9b9b9b;
}

.article-detail-page--dark .article-actions__item--active {
  color: #ef3a35;
}
</style>
