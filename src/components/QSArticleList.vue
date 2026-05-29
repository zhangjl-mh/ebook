<template>
  <view class="article-list-container mx-5 mb-24 bg-white rounded-b-2xl px-4 pb-4 shadow-sm border-t-0 border border-gray-100">
    <!-- List of Articles -->
    <view v-if="articles.length > 0">
      <view 
        v-for="(article, index) in articles" 
        :key="article.id"
        class="article-item py-5 flex items-start justify-between gap-4 border-b border-gray-50 active:bg-gray-50/50 rounded-xl px-2 transition-all"
        :class="[ index === articles.length - 1 ? 'border-b-0' : '' ]"
        @tap="openArticle(article)"
      >
        <!-- Left: Metadata & Text -->
        <view class="flex-1 flex flex-col justify-between min-h-[160rpx]">
          <view>
            <!-- Title -->
            <text class="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
              {{ article.title }}
            </text>
            <!-- Subtitle/Source info -->
            <text class="text-[10px] text-gray-400 font-light block mb-2">
              {{ article.subtitle }}
            </text>
            <!-- Paragraph summary description -->
            <text class="text-xs text-gray-500 font-light leading-relaxed line-clamp-2 mb-3">
              {{ article.summary }}
            </text>
          </view>

          <!-- Badges -->
          <view class="flex flex-wrap gap-1.5 mt-auto">
            <view 
              v-for="tag in article.tags" 
              :key="tag"
              class="tag-badge bg-[#fff0f0] border border-[#ffdbdb] rounded px-2 py-0.5"
            >
              <text class="text-[9px] text-[#c8161d] font-medium">{{ tag }}</text>
            </view>
          </view>
        </view>

        <!-- Right: Cover Image -->
        <view class="image-wrapper shrink-0 w-24 h-[160rpx] rounded-lg overflow-hidden shadow-sm bg-gray-100 border border-gray-100">
          <image 
            :src="article.thumbnail" 
            mode="aspectFill" 
            class="w-full h-full hover:scale-105 transition-transform duration-300"
          />
        </view>
      </view>
    </view>

    <!-- Empty State -->
    <view v-else class="flex flex-col items-center justify-center py-12">
      <!-- Search empty state SVG -->
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
  uni.showToast({
    title: `打开文章: ${article.title}`,
    icon: 'none',
    duration: 2000
  });
  console.log('Open article detail page:', article.id);
};
</script>

<style lang="scss" scoped>
.article-list-container {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.tag-badge {
  line-height: 1;
}
</style>
