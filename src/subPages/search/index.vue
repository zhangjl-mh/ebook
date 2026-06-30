<template>
  <view class="search-page">
    <view class="search-page__header" :style="headerStyle">
      <view class="search-box" :class="{ 'search-box--result': hasSearched }">
        <button class="search-box__back" aria-label="返回" @tap="goBack">
          <uni-icons type="left" size="21" color="#8b9098" />
        </button>
        <input
          class="search-box__input"
          :value="query"
          :focus="!hasSearched"
          :maxlength="40"
          confirm-type="search"
          placeholder="请输入搜索内容"
          placeholder-class="search-box__placeholder"
          @input="handleInput"
          @confirm="submitSearch()"
        />
        <button v-if="!hasSearched" class="search-box__submit" @tap="submitSearch()">搜索</button>
      </view>
    </view>

    <view v-if="!hasSearched" class="search-start">
      <view class="search-history">
        <text class="search-history__title">历史搜索</text>
        <view class="search-history__chips">
          <button v-for="keyword in historyKeywords" :key="keyword" class="search-history__chip"
            @tap="searchHistory(keyword)">
            {{ keyword }}
          </button>
        </view>
      </view>
    </view>

    <template v-else>
      <view class="search-tabs">
        <button v-for="tab in searchTabs" :key="tab.key" class="search-tab"
          :class="{ 'search-tab--active': activeTab === tab.key }" @tap="activeTab = tab.key">
          <text>{{ tab.label }}</text>
        </button>
      </view>

      <scroll-view class="search-result-scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
        :bounces="false">
        <view v-if="store.isArticlesLoading" class="search-state">正在检索</view>
        <view v-else-if="store.errorMessage && !allResults.length" class="search-state">{{ store.errorMessage }}</view>
        <view v-else-if="!visibleResults.length" class="search-state">未找到相关内容</view>
        <view v-else class="search-result-list">
          <button v-for="item in visibleResults" :key="item.id" class="search-result-item" @tap="openResult(item)">
            <text class="search-result-item__title">
              <text v-for="part in getTitleParts(item.title)" :key="part.id"
                :class="{ 'search-result-item__title-hit': part.highlighted }">
                {{ part.text }}
              </text>
            </text>
            <view class="search-result-item__meta">
              <text>{{ item.meta }}</text>
              <text v-if="item.date">{{ item.date }}</text>
            </view>
          </button>
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import {
  homeAccountItems,
  homeColumnArticles,
  homeIssueArticles
} from '@/config/homePage';
import { defaultSearchHistory, featuredSearchItems } from '@/config/homeSearch';
import { HomeSearchItemKind, HomeSearchTargetType } from '@/types/enums';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useMagazineStore } from '@/store/magazineStore';
import { getUniInputValue } from '@/utils/events';
import { buildHomeSearchItems, filterHomeSearchItems } from '@/utils/homeSearch';
import type { HomeSearchItem } from '@/types/homeSearch';

interface TitlePart {
  id: string;
  text: string;
  highlighted: boolean;
}

const searchTabs = [
  { key: HomeSearchItemKind.IssueArticle, label: '期刊' },
  { key: HomeSearchItemKind.Article, label: '解读' },
  { key: HomeSearchItemKind.Column, label: '专栏' },
  { key: HomeSearchItemKind.Account, label: '求是号' }
] as const;

type SearchTabKey = (typeof searchTabs)[number]['key'];

const store = useMagazineStore();
const { safeArea } = useSafeArea();
const query = ref('');
const submittedQuery = ref('');
const activeTab = ref<SearchTabKey>(HomeSearchItemKind.IssueArticle);
const openingResultId = ref('');
const historyKeywords = ref([...defaultSearchHistory]);

const headerStyle = computed(() => ({
  paddingTop: `${safeArea.value.statusBarHeight + 18}px`
}));

const hasSearched = computed(() => submittedQuery.value.trim().length > 0);

const indexedItems = computed(() => {
  const homeItems = buildHomeSearchItems({
    articlesByTab: store.config.articles,
    issueArticles: homeIssueArticles,
    columnArticles: homeColumnArticles,
    accountItems: homeAccountItems
  });
  const itemMap = new Map<string, HomeSearchItem>();

  [...featuredSearchItems, ...homeItems].forEach((item) => {
    if (!itemMap.has(item.id)) {
      itemMap.set(item.id, item);
    }
  });

  return [...itemMap.values()];
});

const allResults = computed(() => filterHomeSearchItems(indexedItems.value, submittedQuery.value, 80));

const visibleResults = computed(() =>
  allResults.value.filter((item) => item.kind === activeTab.value)
);

const handleInput = (event: unknown) => {
  query.value = getUniInputValue(event);
};

const addHistory = (keyword: string) => {
  historyKeywords.value = [
    keyword,
    ...historyKeywords.value.filter((item) => item !== keyword)
  ].slice(0, 6);
};

const submitSearch = (value = query.value) => {
  const keyword = value.trim();

  if (!keyword) {
    uni.showToast({ title: '请输入搜索内容', icon: 'none' });
    return;
  }

  query.value = keyword;
  submittedQuery.value = keyword;
  activeTab.value = HomeSearchItemKind.IssueArticle;
  addHistory(keyword);
};

const searchHistory = (keyword: string) => {
  submitSearch(keyword);
};

const getTitleParts = (title: string): TitlePart[] => {
  const keyword = submittedQuery.value.trim();
  if (!keyword) {
    return [{ id: '0', text: title, highlighted: false }];
  }

  const parts: TitlePart[] = [];
  const lowerTitle = title.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  let cursor = 0;
  let index = lowerTitle.indexOf(lowerKeyword, cursor);
  let partIndex = 0;

  while (index >= 0) {
    if (index > cursor) {
      parts.push({
        id: `${partIndex}-plain`,
        text: title.slice(cursor, index),
        highlighted: false
      });
      partIndex += 1;
    }

    parts.push({
      id: `${partIndex}-hit`,
      text: title.slice(index, index + keyword.length),
      highlighted: true
    });
    partIndex += 1;
    cursor = index + keyword.length;
    index = lowerTitle.indexOf(lowerKeyword, cursor);
  }

  if (cursor < title.length) {
    parts.push({
      id: `${partIndex}-tail`,
      text: title.slice(cursor),
      highlighted: false
    });
  }

  return parts.length ? parts : [{ id: '0', text: title, highlighted: false }];
};

const resetOpeningResult = (itemId: string) => {
  setTimeout(() => {
    if (openingResultId.value === itemId) {
      openingResultId.value = '';
    }
  }, 500);
};

const openResult = (item: HomeSearchItem) => {
  if (openingResultId.value) return;

  openingResultId.value = item.id;

  if (item.target.type === HomeSearchTargetType.ArticleDetail) {
    uni.navigateTo({
      url: `/subPages/article-detail/index?id=${encodeURIComponent(item.target.articleId)}`,
      fail: () => {
        uni.showToast({ title: '文章详情打开失败', icon: 'none' });
      },
      complete: () => {
        resetOpeningResult(item.id);
      }
    });
    return;
  }

  if (item.target.type === HomeSearchTargetType.Webview) {
    store.openWebview(item.target.url, item.target.title);
    resetOpeningResult(item.id);
    return;
  }

  uni.showToast({ title: '内容建设中', icon: 'none' });
  resetOpeningResult(item.id);
};

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({ url: '/pages/index/index' });
};

onLoad(() => {
  // #ifdef MP-WEIXIN
  store.fetchArticles();
  // #endif
});
</script>

<style lang="scss" scoped>
page {
  background: #f5f6f8;
}

.search-page {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  background: #f5f6f8;
}

.search-page__header {
  flex-shrink: 0;
  padding-right: 20rpx;
  padding-left: 20rpx;
  background: #fff;
  box-sizing: border-box;
}

.search-box {
  display: flex;
  min-height: 150rpx;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 20rpx 20rpx 8rpx;
  border: 2rpx solid #d23b33;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: 0 16rpx 38rpx rgba(90, 39, 39, 0.05);
  box-sizing: border-box;
}

.search-box--result {
  min-height: 66rpx;
  padding: 0 18rpx 0 0;
  border-radius: 999rpx;
  box-shadow: none;
}

.search-box__back {
  display: flex;
  width: 58rpx;
  height: 58rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  line-height: 1;

  &::after {
    border: 0;
  }
}

.search-box__input {
  min-width: 0;
  flex: 1;
  color: #33363d;
  font-size: 28rpx;
  line-height: 1.4;
}

.search-box__placeholder {
  color: #8b9098;
}

.search-box__submit {
  width: 120rpx;
  height: 60rpx;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999rpx;
  background: #bd3b33;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 60rpx;
  box-shadow: 0 8rpx 18rpx rgba(189, 59, 51, 0.18);

  &::after {
    border: 0;
  }
}

.search-start {
  flex: 1;
  padding: 30rpx 28rpx;
  background: #fff;
}

.search-history__title {
  display: block;
  color: #2f3238;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.4;
}

.search-history__chips {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18rpx 26rpx;
  margin-top: 18rpx;
}

.search-history__chip {
  height: 58rpx;
  min-width: 0;
  margin: 0;
  padding: 0 20rpx;
  overflow: hidden;
  border: 0;
  border-radius: 999rpx;
  background: #f1f1f2;
  color: #777b84;
  font-size: 24rpx;
  line-height: 58rpx;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::after {
    border: 0;
  }
}

.search-tabs {
  display: flex;
  height: 78rpx;
  flex-shrink: 0;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 20rpx;
  border-bottom: 1rpx solid #e5e7eb;
  background: #f5f6f8;
  box-sizing: border-box;
}

.search-tab {
  position: relative;
  height: 78rpx;
  min-width: 112rpx;
  margin: 0;
  padding: 0 10rpx;
  border: 0;
  background: transparent;
  color: #565b64;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 74rpx;

  &::after {
    border: 0;
  }
}

.search-tab--active {
  color: #22262d;

  &::before {
    position: absolute;
    right: 28rpx;
    bottom: 0;
    left: 28rpx;
    height: 5rpx;
    border-radius: 999rpx;
    background: #d71920;
    content: '';
  }
}

.search-result-scroll {
  min-height: 0;
  flex: 1;
  background: #f5f6f8;
}

.search-result-list {
  padding: 0 0 40rpx;
}

.search-result-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 142rpx;
  margin: 0;
  padding: 24rpx 28rpx 18rpx;
  border: 0;
  border-bottom: 1rpx solid #e7e9ed;
  border-radius: 0;
  background: #f5f6f8;
  color: #292d34;
  text-align: left;
  box-sizing: border-box;

  &::after {
    border: 0;
  }
}

.search-result-item__title {
  color: #292d34;
  font-size: 31rpx;
  font-weight: 650;
  line-height: 1.45;
}

.search-result-item__title-hit {
  color: #e13d46;
}

.search-result-item__meta {
  display: flex;
  gap: 26rpx;
  margin-top: 16rpx;
  color: #b4b8bf;
  font-size: 23rpx;
  font-weight: 600;
  line-height: 1.35;
}

.search-state {
  display: flex;
  min-height: 420rpx;
  align-items: center;
  justify-content: center;
  color: #8b9098;
  font-size: 28rpx;
}
</style>
