<template>
  <view class="home-content">
    <QSHomeSearchResults
      v-if="isSearching"
      :items="searchResults"
      :query="store.searchQuery"
      :loading="store.isArticlesLoading"
      :error-message="store.errorMessage"
      @select="openSearchItem"
    />

    <template v-else-if="store.activeTab === ArticleTabKey.Recommend">
      <view class="recommend-top">
        <QSMagazineSwiper />
        <QSNewIssueShelf :active-issue-id="activeIssueId" @select="handleIssueSelect" />
        <QSHomeActions />
        <view class="issue-article-list">
          <view v-for="item in activeIssueArticles" :key="item.id" class="issue-article-card"
            @tap="openIssueArticle(item)">
            <image :src="item.thumbnail" mode="aspectFill" class="issue-article-card__thumb" />
            <view class="issue-article-card__body">
              <text class="issue-article-card__title">{{ item.title }}</text>
              <text v-if="item.summary && !isEnglishIssue" class="issue-article-card__summary">{{ item.summary }}</text>
              <text class="issue-article-card__date">{{ item.date }}</text>
            </view>
          </view>
          <button class="issue-article-list__more" @tap="openIssueDirectory">更多内容</button>
        </view>
      </view>

      <view class="home-module">
        <view class="home-module__head">
          <text class="home-module__title">专栏</text>
          <button class="home-module__more" @tap="showPendingToast">更多</button>
        </view>
        <view class="summary-list">
          <view v-for="item in recommendColumns" :key="item.id" class="summary-card" @tap="showPendingToast">
            <text class="article-title">{{ item.title }}</text>
            <view class="article-meta">
              <text>作者：{{ item.author }}</text>
              <text>来源：{{ item.source }}</text>
            </view>
            <text class="article-date">时间：{{ item.date }}</text>
          </view>
        </view>
      </view>

      <view class="home-module">
        <view class="home-module__head">
          <text class="home-module__title">求是号</text>
          <button class="home-module__more" @tap="showPendingToast">更多</button>
        </view>
        <view class="account-summary-list">
          <view v-for="item in recommendAccounts" :key="item.id" class="account-card" @tap="showPendingToast">
            <view class="account-card__media">
              <image :src="item.avatar" mode="aspectFill" class="account-card__image" />
              <text class="account-card__badge">订阅</text>
            </view>
            <view class="account-card__body">
              <text class="account-card__title">{{ item.title }}</text>
              <text class="account-card__summary">华为“韬定律”揭示了什么</text>
              <text class="account-card__author">作者：{{ item.author }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="home-module">
        <view class="home-module__head">
          <text class="home-module__title">留言</text>
          <button class="home-module__more" @tap="showPendingToast">更多</button>
        </view>
        <view class="message-list">
          <view v-for="message in homeMessages" :key="message.id" class="message-card">
            <view class="message-card__meta">
              <image src="/static/home/account-logo.png" mode="aspectFill" class="message-card__avatar" />
              <view class="message-card__user">
                <text class="message-card__name">{{ message.user }}</text>
                <text class="message-card__time">{{ message.time }}</text>
              </view>
            </view>
            <text class="message-card__content">{{ message.content }}</text>
          </view>
        </view>
      </view>
    </template>

    <template v-else-if="store.activeTab === ArticleTabKey.News">
      <view class="filter-bar">
        <button v-for="item in homeColumnFilters" :key="item.id" class="filter-pill" @tap="showPendingToast">
          {{ item.label }}
        </button>
      </view>
      <view class="full-list full-list--card">
        <view v-for="item in homeColumnArticles" :key="item.id" class="full-article" @tap="showPendingToast">
          <text class="article-title">{{ item.title }}</text>
          <view class="article-meta">
            <text>作者：{{ item.author }}</text>
            <text>来源：{{ item.source }}</text>
          </view>
          <text class="article-date">时间：{{ item.date }}</text>
        </view>
      </view>
    </template>

    <template v-else-if="store.activeTab === ArticleTabKey.Theory">
      <view class="account-page-head">
        <text class="account-page-head__title">推荐</text>
        <button class="account-page-head__more" @tap="showPendingToast">
          <text class="account-page-head__icon">☰</text>
          <text>更多内容</text>
        </button>
      </view>
      <view class="account-page-list">
        <view v-for="item in homeAccountItems" :key="item.id" class="account-row" @tap="showPendingToast">
          <view class="account-row__media">
            <image :src="item.avatar" mode="aspectFill" class="account-row__image" />
            <text class="account-row__badge">订阅</text>
          </view>
          <view class="account-row__body">
            <text class="account-row__name">{{ item.accountName }}</text>
            <text class="account-row__title">华为“韬定律”揭示了什么</text>
            <text class="account-row__author">作者：{{ item.author }}</text>
          </view>
        </view>
      </view>
    </template>

    <template v-else>
      <view class="filter-bar">
        <button v-for="item in homeEnterpriseFilters" :key="item.id" class="filter-pill" @tap="showPendingToast">
          {{ item.label }}
        </button>
      </view>
      <view class="full-list full-list--enterprise">
        <view v-for="item in homeColumnArticles" :key="`enterprise-${item.id}`" class="full-article"
          @tap="showPendingToast">
          <text class="article-title">{{ item.title }}</text>
          <view class="article-meta">
            <text>作者：{{ item.author }}</text>
            <text>来源：{{ item.source }}</text>
          </view>
          <text class="article-date">时间：{{ item.date }}</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  homeAccountItems,
  homeColumnArticles,
  homeColumnFilters,
  homeEnterpriseFilters,
  homeIssueArticles,
  homeIssueCards,
  homeMessages
} from '@/config/homePage';
import type { HomeIssueArticle } from '@/config/homePage';
import { ArticleTabKey, HomeSearchTargetType } from '@/types/enums';
import { useMagazineStore } from '@/store/magazineStore';
import { buildHomeSearchItems, filterHomeSearchItems } from '@/utils/homeSearch';
import type { HomeSearchItem } from '@/types/homeSearch';
import QSMagazineSwiper from './QSMagazineSwiper.vue';
import QSNewIssueShelf from './QSNewIssueShelf.vue';
import QSHomeActions from './QSHomeActions.vue';
import QSHomeSearchResults from './QSHomeSearchResults.vue';

const store = useMagazineStore();
const activeIssueId = ref(homeIssueCards[0]?.id || '');
const openingArticleId = ref('');
const openingDirectory = ref(false);
const openingSearchItemId = ref('');

const isSearching = computed(() => store.searchQuery.trim().length > 0);
const searchItems = computed(() =>
  buildHomeSearchItems({
    articlesByTab: store.config.articles,
    issueArticles: homeIssueArticles,
    columnArticles: homeColumnArticles,
    accountItems: homeAccountItems
  })
);
const searchResults = computed(() => filterHomeSearchItems(searchItems.value, store.searchQuery));
const recommendColumns = computed(() => homeColumnArticles.slice(0, 2));
const recommendAccounts = computed(() => homeAccountItems.slice(0, 2));
const activeIssueArticles = computed(() => homeIssueArticles[activeIssueId.value] || []);
const isEnglishIssue = computed(() => activeIssueId.value === 'qiushi-en');

const handleIssueSelect = (issueId: string) => {
  activeIssueId.value = issueId;
};

const openIssueArticle = (article: HomeIssueArticle) => {
  if (openingArticleId.value) return;

  openingArticleId.value = article.id;
  uni.navigateTo({
    url: `/subPages/article-detail/index?id=${encodeURIComponent(article.id)}`,
    fail: () => {
      uni.showToast({
        title: '文章详情打开失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        if (openingArticleId.value === article.id) {
          openingArticleId.value = '';
        }
      }, 500);
    }
  });
};

const openIssueDirectory = () => {
  if (openingDirectory.value || !activeIssueId.value) return;

  openingDirectory.value = true;
  uni.navigateTo({
    url: `/subPages/catalog/index?publicationId=${encodeURIComponent(activeIssueId.value)}`,
    fail: () => {
      uni.showToast({
        title: '期刊目录打开失败',
        icon: 'none'
      });
    },
    complete: () => {
      setTimeout(() => {
        openingDirectory.value = false;
      }, 500);
    }
  });
};

const resetOpeningSearchItem = (itemId: string) => {
  setTimeout(() => {
    if (openingSearchItemId.value === itemId) {
      openingSearchItemId.value = '';
    }
  }, 500);
};

const openSearchItem = (item: HomeSearchItem) => {
  if (openingSearchItemId.value) return;

  openingSearchItemId.value = item.id;

  if (item.target.type === HomeSearchTargetType.ArticleDetail) {
    uni.navigateTo({
      url: `/subPages/article-detail/index?id=${encodeURIComponent(item.target.articleId)}`,
      fail: () => {
        uni.showToast({
          title: '文章详情打开失败',
          icon: 'none'
        });
      },
      complete: () => {
        resetOpeningSearchItem(item.id);
      }
    });
    return;
  }

  if (item.target.type === HomeSearchTargetType.Webview) {
    store.openWebview(item.target.url, item.target.title);
    resetOpeningSearchItem(item.id);
    return;
  }

  uni.showToast({ title: '内容建设中', icon: 'none' });
  resetOpeningSearchItem(item.id);
};

const showPendingToast = () => {
  uni.showToast({ title: '内容建设中', icon: 'none' });
};
</script>

<style lang="scss" scoped>
.home-content {
  background: #f2f2f4;
}

.recommend-top {
  padding-top: 16rpx;
  background: #f2f2f4;
}

.issue-article-list {
  padding: 0 20rpx 24rpx;
}

.issue-article-card {
  display: flex;
  height: 176rpx;
  overflow: hidden;
  border-radius: 18rpx;
  background: #fff;
}

.issue-article-card + .issue-article-card {
  margin-top: 18rpx;
}

.issue-article-card__thumb {
  width: 250rpx;
  height: 176rpx;
  flex-shrink: 0;
  background: #f3f3f3;
}

.issue-article-card__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 18rpx 22rpx 14rpx;
  box-sizing: border-box;
}

.issue-article-card__title {
  display: -webkit-box;
  overflow: hidden;
  color: #222;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.issue-article-card__summary {
  display: -webkit-box;
  margin-top: 12rpx;
  overflow: hidden;
  color: #555;
  font-size: 23rpx;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.issue-article-card__date {
  margin-top: auto;
  padding-top: 8rpx;
  color: #b8b8b8;
  font-size: 23rpx;
  line-height: 1.35;
}

.issue-article-list__more {
  width: 220rpx;
  height: 58rpx;
  margin: 24rpx auto 0;
  padding: 0;
  border: none;
  border-radius: 999rpx;
  background: #ffe2df;
  color: #e51d25;
  font-size: 25rpx;
  font-weight: 700;
  line-height: 58rpx;

  &::after {
    border: none;
  }
}

.home-module {
  background: #f2f2f4;
}

.home-module__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 26rpx 8rpx;
}

.home-module__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.35;
}

.home-module__more,
.account-page-head__more {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #222;
  font-size: 25rpx;
  line-height: 1.4;

  &::after {
    border: none;
  }
}

.summary-list,
.account-summary-list,
.message-list {
  padding: 0 20rpx 12rpx;
}

.summary-card,
.account-card,
.message-card {
  overflow: hidden;
  border-radius: 16rpx;
  background: #fff;
}

.summary-card {
  padding: 24rpx 24rpx 22rpx;
  border-bottom: 1rpx solid #ffd0cc;
}

.summary-card + .summary-card,
.account-card + .account-card,
.message-card + .message-card {
  margin-top: 14rpx;
}

.article-title {
  display: -webkit-box;
  overflow: hidden;
  color: #222;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 38rpx;
  margin-top: 18rpx;
  color: #b8b8b8;
  font-size: 22rpx;
  font-weight: 650;
  line-height: 1.35;
}

.article-date {
  display: block;
  margin-top: 10rpx;
  color: #b8b8b8;
  font-size: 22rpx;
  font-weight: 650;
  line-height: 1.35;
}

.account-card,
.account-row {
  display: flex;
  align-items: center;
}

.account-card {
  padding: 22rpx 34rpx 22rpx 50rpx;
}

.account-card__media,
.account-row__media {
  position: relative;
  flex-shrink: 0;
}

.account-card__image {
  width: 244rpx;
  height: 132rpx;
  display: block;
}

.account-card__badge,
.account-row__badge {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2rpx 10rpx;
  border-radius: 0 0 8rpx 0;
  background: #ff160f;
  color: #fff;
  font-size: 21rpx;
  font-weight: 700;
  line-height: 1.35;
}

.account-card__body {
  min-width: 0;
  flex: 1;
  margin-left: 28rpx;
}

.account-card__title,
.account-row__name {
  display: block;
  overflow: hidden;
  color: #222;
  font-size: 29rpx;
  font-weight: 700;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-card__summary,
.account-card__author,
.account-row__title,
.account-row__author {
  display: block;
  overflow: hidden;
  margin-top: 8rpx;
  color: #555;
  font-size: 25rpx;
  font-weight: 650;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-card {
  padding: 18rpx 22rpx 20rpx;
}

.message-card__meta {
  display: flex;
  align-items: center;
}

.message-card__avatar {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
  border-radius: 50%;
  background: #fff0ef;
}

.message-card__user {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin-left: 14rpx;
}

.message-card__name {
  color: #333;
  font-size: 25rpx;
  line-height: 1.3;
}

.message-card__time {
  margin-top: 2rpx;
  color: #aaa;
  font-size: 20rpx;
  line-height: 1.3;
}

.message-card__content {
  display: -webkit-box;
  margin-top: 14rpx;
  overflow: hidden;
  color: #333;
  font-size: 26rpx;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.filter-bar {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
  padding: 14rpx 14rpx;
  background: transparent;
  white-space: nowrap;
}

.filter-pill {
  flex-shrink: 0;
  height: 56rpx;
  min-width: 146rpx;
  margin: 0;
  padding: 0 24rpx;
  border: none;
  border-radius: 999rpx;
  background: #fff;
  color: #222;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 56rpx;

  &::after {
    border: none;
  }
}

.full-list {
  padding: 0 16rpx 24rpx;
  background: transparent;
}

.full-list--card {
  padding-top: 0;
}

.full-article {
  padding: 24rpx 24rpx 26rpx;
  border-bottom: 1rpx solid #ffd0cc;
  background: #fff;
}

.full-article:first-child {
  border-radius: 16rpx 16rpx 0 0;
}

.full-article:last-child {
  border-bottom: none;
  border-radius: 0 0 16rpx 16rpx;
}

.account-page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 16rpx 18rpx;
  background: #fff;
}

.account-page-head__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.35;
}

.account-page-head__more {
  display: flex;
  align-items: center;
  color: #333;
}

.account-page-head__icon {
  margin-right: 8rpx;
  font-size: 36rpx;
  line-height: 1;
}

.account-page-list {
  padding: 0 16rpx 24rpx;
  background: #fff;
}

.account-row {
  padding: 28rpx 0;
  border-bottom: 1rpx solid #e5e5e5;
}

.account-row__image {
  display: block;
  width: 246rpx;
  height: 130rpx;
}

.account-row__body {
  min-width: 0;
  flex: 1;
  margin-left: 34rpx;
}
</style>
