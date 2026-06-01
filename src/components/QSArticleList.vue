<template>
  <view class="article-list-container px-4 pb-4 bg-white">
    <!-- 文章列表 -->
    <view v-if="articles.length > 0">
      <view
        v-for="(article, index) in articles"
        :key="article.id"
        class="article-item py-4 flex items-start justify-between gap-3"
        :class="[ index !== articles.length - 1 ? 'border-b border-gray-100' : '' ]"
        @tap="openArticle(article)"
      >
        <!-- 左侧：文字信息 -->
        <view class="flex-1 flex flex-col justify-between min-h-[140rpx]">
          <view>
            <!-- 标题 -->
            <text class="text-[14px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
              {{ article.title }}
            </text>
            <!-- 来源/副标题 -->
            <text class="text-[10px] text-gray-400 font-light block mb-1.5">
              {{ article.subtitle }}
            </text>
            <!-- 摘要 -->
            <text class="text-[12px] text-gray-500 font-light leading-relaxed line-clamp-3">
              {{ article.summary }}
            </text>
          </view>

          <!-- 标签 -->
          <view class="flex flex-wrap gap-1.5 mt-2.5">
            <view
              v-for="tag in article.tags"
              :key="tag"
              class="tag-badge bg-[#fff0f0] border border-[#ffdbdb] rounded px-2.5 py-1"
            >
              <text class="text-[10px] text-[#c8161d] font-medium">{{ tag }}</text>
            </view>
          </view>
        </view>

        <!-- 右侧：缩略图 -->
        <view class="image-wrapper shrink-0 w-[180rpx] h-[180rpx] rounded-lg overflow-hidden bg-gray-100">
          <image
            :src="article.thumbnail"
            mode="aspectFill"
            class="w-full h-full"
          />
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center justify-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <text class="text-xs text-gray-400 font-light">暂无符合条件的文章</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMagazineStore } from '../store/magazineStore';
import type { Article } from '../config/magazineData';

const store = useMagazineStore();
const articles = computed(() => store.filteredArticles);

const openArticle = (article: Article) => {
  if (!article.linkUrl) {
    uni.showToast({
      title: '暂无可访问链接',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(article.linkUrl)}&title=${encodeURIComponent(article.title)}`
  });
};
</script>

<style lang="scss" scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.article-item {
  -webkit-tap-highlight-color: transparent;
  &:active {
    background-color: rgba(0, 0, 0, 0.01);
  }
}
.tag-badge {
  line-height: 1;
}
</style>
