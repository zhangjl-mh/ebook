<template>
  <view class="article-detail-page">
    <scroll-view class="article-detail-page__scroll" :scroll-y="true" :enable-flex="true">
      <view class="article-detail-page__inner">
        <QSSubPageHeader title="详情" />

        <view class="article-detail-page__content" :style="contentStyle">
          <view v-if="article" class="article-card">
            <view class="article-card__source">
              <text>来源：{{ article.source }}</text>
              <text>作者：{{ article.author }}</text>
              <text>字数：{{ article.wordCount }}</text>
            </view>

            <text class="article-card__title">{{ article.title }}</text>

            <view class="article-card__meta">
              <text>{{ article.issue }}</text>
              <text>{{ article.publishTime }}</text>
            </view>

            <view class="article-body">
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
import { onLoad } from '@dcloudio/uni-app';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { articleDetails } from '@/config/articleDetail';
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

const contentStyle = computed(() => ({
  paddingBottom: `calc(170rpx + ${safeArea.value.bottomInset}px)`
}));

const actionBarStyle = computed(() => ({
  paddingBottom: `calc(14rpx + ${safeArea.value.bottomInset}px)`
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
  article.value = nextArticle;
  likeCount.value = nextArticle.likeCount;
  isFavorited.value = false;
  isLiked.value = false;
  failedImageMap.value = {};
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
</script>

<style lang="scss">
page {
  background: var(--qs-page-bg-soft);
}
</style>

<style lang="scss" scoped>
.article-detail-page {
  height: 100vh;
  background: var(--qs-page-bg-soft);
}

.article-detail-page__scroll {
  height: 100%;
  background: var(--qs-page-bg-soft);
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

.article-card {
  padding: 40rpx 34rpx 52rpx;
  border-radius: var(--qs-radius-panel);
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-card);
  box-sizing: border-box;
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
</style>
