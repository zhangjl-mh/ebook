# Home Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首页顶部原型搜索框中输入关键词后，展示“事项搜索”结果列表；清空关键词后恢复原首页内容。

**Architecture:** 复用 `src/pages/index/components/QSHeader.vue` 已有的 `store.searchQuery` 输入状态，在 `QSHomeSections.vue` 中根据关键词切换搜索结果视图。搜索数据先由 `src/utils/homeSearch.ts` 将首页期刊文章、专栏、求是号和 Pinia 文章统一适配成 `HomeSearchItem`，再由页面私有组件 `QSHomeSearchResults.vue` 渲染空态、加载态、失败态和结果项。

**Tech Stack:** uni-app + Vue 3 `<script setup lang="ts">`、Pinia、TypeScript、SCSS scoped、Vitest、微信小程序构建。

---

## 原型与现状

- 原型链接：`http://www.axshare.site/9RFYH4/?id=5fxfhz&p=%E9%A6%96%E9%A1%B5&c=1`
- 截图显示：首页顶部导航下方已有搜索输入框，placeholder 为“请输入检索内容”，右侧是 AI 小是入口。
- 当前实现中 `src/pages/index/components/QSHeader.vue` 已把输入写入 `store.searchQuery`。
- 当前实现中 `src/store/magazineStore.ts` 已有 `searchQuery` 和 `filteredArticles`，但 `src/pages/index/components/QSHomeSections.vue` 没有根据搜索关键词切换结果视图。
- `src/pages/index/components/QSHomeSections.vue` 仍读取 `src/config/homePage.ts` 的首页模块数据；搜索功能需要覆盖这些静态首页事项，并兼容 `store.config.articles` 的远程/兜底文章数据。

## File Structure

- Modify: `package.json`
  - 增加 `test` 与 `test:watch` 脚本。
  - 增加 `vitest` dev dependency。
- Create: `vitest.config.ts`
  - 只用于纯 TS 单元测试，配置 `@` alias 指向 `src`。
- Modify: `src/types/enums.ts`
  - 增加 `HomeSearchItemKind` 和 `HomeSearchTargetType`，避免跨文件裸字符串。
- Create: `src/types/homeSearch.ts`
  - 定义首页搜索统一事项模型和目标跳转类型。
- Create: `src/utils/homeSearch.ts`
  - 将首页模块和文章数据适配成搜索事项。
  - 提供纯函数过滤逻辑。
- Create: `src/utils/homeSearch.test.ts`
  - 覆盖空查询、标题匹配、标签/来源匹配、大小写与空格规整、结果数量限制。
- Create: `src/pages/index/components/QSHomeSearchResults.vue`
  - 页面私有搜索结果组件。
  - 负责展示加载态、失败态、空态和结果列表。
- Modify: `src/pages/index/components/QSHomeSections.vue`
  - 在有关键词时显示 `QSHomeSearchResults`。
  - 增加搜索结果点击处理，远程文章打开 webview，期刊文章打开详情，其余事项显示“内容建设中”。
- Modify: `src/pages/index/components/QSHeader.vue`
  - 给搜索输入补充 `confirm-type="search"`、`maxlength="40"`、`@confirm`，保持小程序键盘搜索键行为稳定。

---

### Task 1: Add Test Runner

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install Vitest**

Run:

```bash
npm install -D vitest@^2.1.9
```

Expected: `package.json` and `package-lock.json` include `vitest`; command exits with status 0.

- [ ] **Step 2: Add test scripts**

Run:

```bash
npm pkg set scripts.test="vitest run" scripts.test:watch="vitest"
```

Expected: `package.json` contains these entries:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.ts` with this full content:

```ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
```

- [ ] **Step 4: Run test command before tests exist**

Run:

```bash
npm run test -- --passWithNoTests
```

Expected: Vitest starts successfully, reports no test files found, and exits with status 0.

- [ ] **Step 5: Commit test runner setup**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "test: add vitest runner"
```

---

### Task 2: Add Search Types And Pure Search Utility

**Files:**
- Modify: `src/types/enums.ts`
- Create: `src/types/homeSearch.ts`
- Create: `src/utils/homeSearch.ts`
- Test: `src/utils/homeSearch.test.ts`

- [ ] **Step 1: Write failing search utility tests**

Create `src/utils/homeSearch.test.ts` with this full content:

```ts
import { describe, expect, it } from 'vitest';
import { ArticleTabKey, HomeSearchItemKind, HomeSearchTargetType } from '@/types/enums';
import { buildHomeSearchItems, filterHomeSearchItems } from '@/utils/homeSearch';
import type { HomeAccountItem, HomeColumnArticle, HomeIssueArticle } from '@/config/homePage';
import type { Article } from '@/types/magazine';

const issueArticles: Record<string, HomeIssueArticle[]> = {
  qiushi: [
    {
      id: 'issue-a',
      issueId: 'qiushi',
      title: '学习贯彻党的二十届四中全会精神',
      summary: '专题学习内容',
      date: '2026-06-18',
      thumbnail: '/static/home/article-thumb.png'
    }
  ]
};

const columnArticles: HomeColumnArticle[] = [
  {
    id: 'column-a',
    title: '新时代人文经济学的丰富内涵',
    author: '葛 扬',
    source: '《求是》2025/23',
    date: '2025-12-01'
  }
];

const accountItems: HomeAccountItem[] = [
  {
    id: 'account-a',
    accountName: '求是',
    author: '苏慧',
    title: '华为“韬定律”揭示了什么',
    avatar: '/static/home/article-thumb.png'
  }
];

const article: Article = {
  id: 'remote-a',
  title: 'Planning Ahead for Emerging Industries',
  subtitle: '',
  summary: 'Emerging industries and future development',
  tags: ['QIUSHI'],
  thumbnail: '/static/home/article-thumb.png',
  publishDate: '2026-06-15',
  linkUrl: 'https://www.qstheory.cn/example.html'
};

describe('homeSearch', () => {
  it('returns no results for blank query', () => {
    const items = buildHomeSearchItems({
      articlesByTab: {
        [ArticleTabKey.Recommend]: [article],
        [ArticleTabKey.News]: [],
        [ArticleTabKey.Theory]: [],
        [ArticleTabKey.Enterprise]: []
      },
      issueArticles,
      columnArticles,
      accountItems
    });

    expect(filterHomeSearchItems(items, '   ')).toEqual([]);
  });

  it('builds searchable items from all homepage sources', () => {
    const items = buildHomeSearchItems({
      articlesByTab: {
        [ArticleTabKey.Recommend]: [article],
        [ArticleTabKey.News]: [],
        [ArticleTabKey.Theory]: [],
        [ArticleTabKey.Enterprise]: []
      },
      issueArticles,
      columnArticles,
      accountItems
    });

    expect(items.map((item) => item.kind)).toEqual([
      HomeSearchItemKind.Article,
      HomeSearchItemKind.IssueArticle,
      HomeSearchItemKind.Column,
      HomeSearchItemKind.Account
    ]);
    expect(items[0].target).toEqual({
      type: HomeSearchTargetType.Webview,
      url: 'https://www.qstheory.cn/example.html',
      title: 'Planning Ahead for Emerging Industries'
    });
    expect(items[1].target).toEqual({
      type: HomeSearchTargetType.ArticleDetail,
      articleId: 'issue-a'
    });
  });

  it('matches title summary tags author and source text', () => {
    const items = buildHomeSearchItems({
      articlesByTab: {
        [ArticleTabKey.Recommend]: [article],
        [ArticleTabKey.News]: [],
        [ArticleTabKey.Theory]: [],
        [ArticleTabKey.Enterprise]: []
      },
      issueArticles,
      columnArticles,
      accountItems
    });

    expect(filterHomeSearchItems(items, '四中全会').map((item) => item.id)).toEqual(['issue-issue-a']);
    expect(filterHomeSearchItems(items, 'QIUSHI').map((item) => item.id)).toEqual(['article-remote-a']);
    expect(filterHomeSearchItems(items, '葛 扬').map((item) => item.id)).toEqual(['column-column-a']);
    expect(filterHomeSearchItems(items, '苏慧').map((item) => item.id)).toEqual(['account-account-a']);
  });

  it('normalizes case and surrounding whitespace', () => {
    const items = buildHomeSearchItems({
      articlesByTab: {
        [ArticleTabKey.Recommend]: [article],
        [ArticleTabKey.News]: [],
        [ArticleTabKey.Theory]: [],
        [ArticleTabKey.Enterprise]: []
      },
      issueArticles,
      columnArticles,
      accountItems
    });

    expect(filterHomeSearchItems(items, '  emerging  ').map((item) => item.id)).toEqual(['article-remote-a']);
  });

  it('limits result count while preserving source order', () => {
    const items = buildHomeSearchItems({
      articlesByTab: {
        [ArticleTabKey.Recommend]: [article],
        [ArticleTabKey.News]: [{ ...article, id: 'remote-b', title: 'Emerging industry review' }],
        [ArticleTabKey.Theory]: [],
        [ArticleTabKey.Enterprise]: []
      },
      issueArticles,
      columnArticles,
      accountItems
    });

    expect(filterHomeSearchItems(items, 'emerging', 1).map((item) => item.id)).toEqual(['article-remote-a']);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm run test -- src/utils/homeSearch.test.ts
```

Expected: FAIL with an import error for `@/utils/homeSearch` or missing exports from `@/types/enums`.

- [ ] **Step 3: Add shared enum values**

Append this code to `src/types/enums.ts`:

```ts
export const HomeSearchItemKind = {
  Article: 'article',
  IssueArticle: 'issueArticle',
  Column: 'column',
  Account: 'account'
} as const;

export type HomeSearchItemKind = (typeof HomeSearchItemKind)[keyof typeof HomeSearchItemKind];

export const HomeSearchTargetType = {
  ArticleDetail: 'articleDetail',
  Webview: 'webview',
  Pending: 'pending'
} as const;

export type HomeSearchTargetType =
  (typeof HomeSearchTargetType)[keyof typeof HomeSearchTargetType];
```

- [ ] **Step 4: Create shared search types**

Create `src/types/homeSearch.ts` with this full content:

```ts
import { HomeSearchTargetType } from '@/types/enums';
import type { HomeSearchItemKind } from '@/types/enums';

export type HomeSearchTarget =
  | {
      type: typeof HomeSearchTargetType.ArticleDetail;
      articleId: string;
    }
  | {
      type: typeof HomeSearchTargetType.Webview;
      url: string;
      title: string;
    }
  | {
      type: typeof HomeSearchTargetType.Pending;
    };

export interface HomeSearchItem {
  id: string;
  kind: HomeSearchItemKind;
  title: string;
  description: string;
  meta: string;
  date: string;
  thumbnail: string;
  keywords: string[];
  target: HomeSearchTarget;
}
```

- [ ] **Step 5: Create search utility**

Create `src/utils/homeSearch.ts` with this full content:

```ts
import type {
  HomeAccountItem,
  HomeColumnArticle,
  HomeIssueArticle
} from '@/config/homePage';
import { articleTabKeys } from '@/types/magazine';
import { HomeSearchItemKind, HomeSearchTargetType } from '@/types/enums';
import type { Article, ArticleTabKey } from '@/types/magazine';
import type { HomeSearchItem } from '@/types/homeSearch';

interface BuildHomeSearchItemsInput {
  articlesByTab: Record<ArticleTabKey, Article[]>;
  issueArticles: Record<string, HomeIssueArticle[]>;
  columnArticles: HomeColumnArticle[];
  accountItems: HomeAccountItem[];
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const compactKeywords = (values: string[]) => values.map((value) => value.trim()).filter(Boolean);

const buildArticleItem = (article: Article): HomeSearchItem => ({
  id: `article-${article.id}`,
  kind: HomeSearchItemKind.Article,
  title: article.title,
  description: article.summary,
  meta: article.tags[0] || '求是网',
  date: article.publishDate,
  thumbnail: article.thumbnail,
  keywords: compactKeywords([
    article.title,
    article.subtitle,
    article.summary,
    article.publishDate,
    article.linkUrl,
    ...article.tags
  ]),
  target: article.linkUrl
    ? {
        type: HomeSearchTargetType.Webview,
        url: article.linkUrl,
        title: article.title
      }
    : {
        type: HomeSearchTargetType.Pending
      }
});

const buildIssueArticleItem = (article: HomeIssueArticle): HomeSearchItem => ({
  id: `issue-${article.id}`,
  kind: HomeSearchItemKind.IssueArticle,
  title: article.title,
  description: article.summary,
  meta: '电子刊',
  date: article.date,
  thumbnail: article.thumbnail,
  keywords: compactKeywords([article.title, article.summary, article.date, article.issueId]),
  target: {
    type: HomeSearchTargetType.ArticleDetail,
    articleId: article.id
  }
});

const buildColumnItem = (article: HomeColumnArticle): HomeSearchItem => ({
  id: `column-${article.id}`,
  kind: HomeSearchItemKind.Column,
  title: article.title,
  description: article.source,
  meta: `作者：${article.author}`,
  date: article.date,
  thumbnail: '',
  keywords: compactKeywords([article.title, article.author, article.source, article.date]),
  target: {
    type: HomeSearchTargetType.Pending
  }
});

const buildAccountItem = (item: HomeAccountItem): HomeSearchItem => ({
  id: `account-${item.id}`,
  kind: HomeSearchItemKind.Account,
  title: item.title,
  description: item.accountName,
  meta: `作者：${item.author}`,
  date: '',
  thumbnail: item.avatar,
  keywords: compactKeywords([item.title, item.accountName, item.author]),
  target: {
    type: HomeSearchTargetType.Pending
  }
});

export const buildHomeSearchItems = ({
  articlesByTab,
  issueArticles,
  columnArticles,
  accountItems
}: BuildHomeSearchItemsInput): HomeSearchItem[] => {
  const articleItems = articleTabKeys.flatMap((tabKey) => articlesByTab[tabKey].map(buildArticleItem));
  const issueItems = Object.values(issueArticles).flatMap((items) => items.map(buildIssueArticleItem));
  const columnItems = columnArticles.map(buildColumnItem);
  const accountSearchItems = accountItems.map(buildAccountItem);

  return [...articleItems, ...issueItems, ...columnItems, ...accountSearchItems];
};

export const filterHomeSearchItems = (
  items: HomeSearchItem[],
  query: string,
  maxResults = 30
): HomeSearchItem[] => {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) return [];

  return items
    .filter((item) => item.keywords.some((keyword) => normalizeText(keyword).includes(normalizedQuery)))
    .slice(0, maxResults);
};
```

- [ ] **Step 6: Run utility tests**

Run:

```bash
npm run test -- src/utils/homeSearch.test.ts
```

Expected: PASS for all five tests in `homeSearch.test.ts`.

- [ ] **Step 7: Run type check**

Run:

```bash
npm run type-check
```

Expected: PASS with no TypeScript errors. If `src/types/homeSearch.ts` reports literal type incompatibility for target `type`, confirm `HomeSearchTargetType` is imported as a runtime value where object literals are built and as a type only where only annotations are used.

- [ ] **Step 8: Commit search utility**

```bash
git add src/types/enums.ts src/types/homeSearch.ts src/utils/homeSearch.ts src/utils/homeSearch.test.ts
git commit -m "feat: add home search utility"
```

---

### Task 3: Add Search Results Component

**Files:**
- Create: `src/pages/index/components/QSHomeSearchResults.vue`

- [ ] **Step 1: Create component**

Create `src/pages/index/components/QSHomeSearchResults.vue` with this full content:

```vue
<template>
  <view class="home-search">
    <view class="home-search__head">
      <text class="home-search__title">搜索结果</text>
      <text class="home-search__count">{{ resultCountText }}</text>
    </view>

    <view v-if="loading" class="home-search__state">
      <text>正在检索</text>
    </view>

    <view v-else-if="errorMessage" class="home-search__state">
      <text>{{ errorMessage }}</text>
    </view>

    <view v-else-if="items.length === 0" class="home-search__state">
      <text>未找到相关内容</text>
    </view>

    <view v-else class="home-search__list">
      <view v-for="item in items" :key="item.id" class="home-search-card" @tap="emit('select', item)">
        <image v-if="item.thumbnail" :src="item.thumbnail" mode="aspectFill" class="home-search-card__thumb" />
        <view class="home-search-card__body">
          <view class="home-search-card__top">
            <text class="home-search-card__tag">{{ getKindLabel(item.kind) }}</text>
            <text v-if="item.date" class="home-search-card__date">{{ item.date }}</text>
          </view>
          <text class="home-search-card__title">{{ item.title }}</text>
          <text v-if="item.description" class="home-search-card__desc">{{ item.description }}</text>
          <text class="home-search-card__meta">{{ item.meta }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { HomeSearchItemKind } from '@/types/enums';
import type { HomeSearchItem } from '@/types/homeSearch';
import type { HomeSearchItemKind as HomeSearchItemKindType } from '@/types/enums';

const props = defineProps<{
  items: HomeSearchItem[];
  query: string;
  loading: boolean;
  errorMessage: string;
}>();

const emit = defineEmits<{
  select: [item: HomeSearchItem];
}>();

const resultCountText = computed(() => {
  const query = props.query.trim();
  if (!query) return '';
  if (props.loading) return '检索中';
  return `${props.items.length} 条`;
});

const kindLabelMap: Record<HomeSearchItemKindType, string> = {
  [HomeSearchItemKind.Article]: '文章',
  [HomeSearchItemKind.IssueArticle]: '电子刊',
  [HomeSearchItemKind.Column]: '专栏',
  [HomeSearchItemKind.Account]: '求是号'
};

const getKindLabel = (kind: HomeSearchItemKindType) => kindLabelMap[kind];
</script>

<style lang="scss" scoped>
.home-search {
  min-height: 640rpx;
  padding: 18rpx 18rpx 32rpx;
  background: #f2f2f4;
  box-sizing: border-box;
}

.home-search__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rpx 8rpx 18rpx;
}

.home-search__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.35;
}

.home-search__count {
  color: #8c8c8c;
  font-size: 24rpx;
  line-height: 1.35;
}

.home-search__state {
  display: flex;
  min-height: 360rpx;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: #fff;
  color: #8c8c8c;
  font-size: 28rpx;
  line-height: 1.4;
}

.home-search__list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.home-search-card {
  display: flex;
  min-height: 176rpx;
  overflow: hidden;
  border-radius: 16rpx;
  background: #fff;
}

.home-search-card__thumb {
  width: 190rpx;
  height: 176rpx;
  flex-shrink: 0;
  background: #f3f3f3;
}

.home-search-card__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 18rpx 22rpx 16rpx;
  box-sizing: border-box;
}

.home-search-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.home-search-card__tag {
  flex-shrink: 0;
  padding: 3rpx 12rpx;
  border-radius: 999rpx;
  background: #ffe9e7;
  color: #d71920;
  font-size: 21rpx;
  font-weight: 700;
  line-height: 1.35;
}

.home-search-card__date {
  overflow: hidden;
  color: #b8b8b8;
  font-size: 22rpx;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-search-card__title {
  display: -webkit-box;
  margin-top: 10rpx;
  overflow: hidden;
  color: #222;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-search-card__desc {
  display: -webkit-box;
  margin-top: 8rpx;
  overflow: hidden;
  color: #555;
  font-size: 24rpx;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.home-search-card__meta {
  display: block;
  margin-top: auto;
  padding-top: 8rpx;
  overflow: hidden;
  color: #b8b8b8;
  font-size: 22rpx;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
```

- [ ] **Step 2: Run type check for component**

Run:

```bash
npm run type-check
```

Expected: PASS with no `defineProps` or enum typing errors.

- [ ] **Step 3: Commit component**

```bash
git add src/pages/index/components/QSHomeSearchResults.vue
git commit -m "feat: add home search results component"
```

---

### Task 4: Integrate Search Into Home Sections

**Files:**
- Modify: `src/pages/index/components/QSHomeSections.vue`

- [ ] **Step 1: Replace template opening with search branch**

In `src/pages/index/components/QSHomeSections.vue`, replace the opening template block:

```vue
<template>
  <view class="home-content">
    <template v-if="store.activeTab === ArticleTabKey.Recommend">
```

with:

```vue
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
```

- [ ] **Step 2: Update script imports**

In the `<script setup lang="ts">` block, replace the import group:

```ts
import { ArticleTabKey } from '@/types/enums';
import { useMagazineStore } from '@/store/magazineStore';
import QSMagazineSwiper from './QSMagazineSwiper.vue';
import QSNewIssueShelf from './QSNewIssueShelf.vue';
import QSHomeActions from './QSHomeActions.vue';
```

with:

```ts
import { ArticleTabKey, HomeSearchTargetType } from '@/types/enums';
import { useMagazineStore } from '@/store/magazineStore';
import { buildHomeSearchItems, filterHomeSearchItems } from '@/utils/homeSearch';
import type { HomeSearchItem } from '@/types/homeSearch';
import QSMagazineSwiper from './QSMagazineSwiper.vue';
import QSNewIssueShelf from './QSNewIssueShelf.vue';
import QSHomeActions from './QSHomeActions.vue';
import QSHomeSearchResults from './QSHomeSearchResults.vue';
```

- [ ] **Step 3: Add computed search state**

After the existing refs:

```ts
const activeIssueId = ref(homeIssueCards[0]?.id || '');
const openingArticleId = ref('');
const openingDirectory = ref(false);
```

insert:

```ts
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
```

- [ ] **Step 4: Add search result click handler**

Add this function above `showPendingToast`:

```ts
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
```

- [ ] **Step 5: Run utility tests**

Run:

```bash
npm run test -- src/utils/homeSearch.test.ts
```

Expected: PASS; integration must not change pure search behavior.

- [ ] **Step 6: Run type check**

Run:

```bash
npm run type-check
```

Expected: PASS with no template or discriminated union errors.

- [ ] **Step 7: Commit integration**

```bash
git add src/pages/index/components/QSHomeSections.vue
git commit -m "feat: integrate home search results"
```

---

### Task 5: Tighten Header Search Input Behavior

**Files:**
- Modify: `src/pages/index/components/QSHeader.vue`

- [ ] **Step 1: Update input attributes**

Replace the input block:

```vue
<input type="text" :value="store.searchQuery" placeholder="请输入检索内容" placeholder-class="qs-header__placeholder"
  class="qs-header__input" @input="onSearchInput" />
```

with:

```vue
<input
  type="text"
  :value="store.searchQuery"
  placeholder="请输入检索内容"
  placeholder-class="qs-header__placeholder"
  class="qs-header__input"
  confirm-type="search"
  :maxlength="40"
  @input="onSearchInput"
  @confirm="onSearchInput"
/>
```

- [ ] **Step 2: Run type check**

Run:

```bash
npm run type-check
```

Expected: PASS with no template attribute errors.

- [ ] **Step 3: Commit header input behavior**

```bash
git add src/pages/index/components/QSHeader.vue
git commit -m "feat: refine home search input"
```

---

### Task 6: Build And Manual Verification

**Files:**
- Verify only; no source edits expected unless a command fails.

- [ ] **Step 1: Run focused tests**

Run:

```bash
npm run test -- src/utils/homeSearch.test.ts
```

Expected: PASS for all home search tests.

- [ ] **Step 2: Run type check**

Run:

```bash
npm run type-check
```

Expected: PASS with no TypeScript errors.

- [ ] **Step 3: Build WeChat mini-program output**

Run:

```bash
npm run build:mp-weixin
```

Expected: PASS and generated output under `dist/build/mp-weixin`.

- [ ] **Step 4: Manual mini-program behavior check**

Open the built project in WeChat DevTools and verify these concrete cases:

```text
1. 首页初始状态：搜索框为空，展示原首页轮播、新刊上架、专栏、求是号、留言等内容。
2. 输入“四中全会”：首页内容区切换为搜索结果；至少展示匹配标题或摘要的事项。
3. 输入“华为”：搜索结果同时包含电子刊或求是号相关事项；连续点击同一结果不会触发重复跳转。
4. 输入“not-found-keyword”：展示“未找到相关内容”空态。
5. 清空输入框：立即恢复原首页内容，并保留当前 tab 选中状态。
6. 网络失败但本地兜底数据存在：不阻塞本地首页事项搜索；`store.errorMessage` 为空时不展示失败态。
7. 搜索远程文章：有 `linkUrl` 的结果打开 `/subPages/webview/index`。
8. 搜索电子刊文章：结果打开 `/subPages/article-detail/index?id=...`。
9. 搜索专栏或求是号：结果展示“内容建设中”toast。
```

- [ ] **Step 5: Self-review changed files**

Check the diff:

```bash
git diff -- src/types/enums.ts src/types/homeSearch.ts src/utils/homeSearch.ts src/utils/homeSearch.test.ts src/pages/index/components/QSHomeSearchResults.vue src/pages/index/components/QSHomeSections.vue src/pages/index/components/QSHeader.vue package.json vitest.config.ts
```

Expected:

```text
- No unused imports.
- No unrelated homepage visual refactor.
- No hard-coded status bar, capsule, or bottom safe-area values.
- Search state remains centralized in Pinia store.searchQuery.
- Search utility is pure and covered by unit tests.
- Empty query, empty result, fetch failure, duplicate tap, and invalid no-link target are handled.
```

- [ ] **Step 6: Commit final verification fixes if any files changed**

If Step 5 required source corrections, run:

```bash
git add src/types/enums.ts src/types/homeSearch.ts src/utils/homeSearch.ts src/utils/homeSearch.test.ts src/pages/index/components/QSHomeSearchResults.vue src/pages/index/components/QSHomeSections.vue src/pages/index/components/QSHeader.vue package.json package-lock.json vitest.config.ts
git commit -m "fix: polish home search edge cases"
```

Expected: commit is created only when Step 5 produced corrections.

---

## Self-Review

- Spec coverage: 原型顶部搜索框、事项搜索输入、搜索结果展示、清空恢复首页、结果点击、空态、失败态、重复点击、验证命令均有任务覆盖。
- Placeholder scan: 文档不包含待补内容，所有新增文件和关键修改均给出完整代码或精确替换块。
- Type consistency: `HomeSearchItemKind`、`HomeSearchTargetType`、`HomeSearchItem`、`buildHomeSearchItems`、`filterHomeSearchItems` 在测试、工具和组件中的命名一致。
- Scope control: 搜索结果组件放在 `src/pages/index/components`，纯函数放 `src/utils`，共享类型放 `src/types`，没有移动首页既有模块或修改无关页面。
