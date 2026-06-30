# Home Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 点击首页搜索框进入独立搜索页，先展示历史搜索，提交关键词后展示分类搜索结果页。

**Architecture:** 首页 `QSHeader` 只作为搜索入口并向 `pages/index/index.vue` 发出 `open-search` 事件，由首页跳转到 `/subPages/search/index`。搜索页复用 `src/utils/homeSearch.ts` 统一索引远程文章、首页期刊文章、专栏、求是号和搜索页 mock 结果，并在页面内切换历史态与结果态。

**Tech Stack:** uni-app + Vue 3 `<script setup lang="ts">`、Pinia、TypeScript、SCSS scoped、Vitest、微信小程序分包。

---

## Current Scope

- 首页搜索框不再直接写 `store.searchQuery`，也不再在首页内容区展示结果。
- 新增 `src/subPages/search/index.vue`：
  - 未搜索态：大圆角红边搜索框、返回按钮、搜索按钮、历史搜索词。
  - 已搜索态：紧凑搜索框、分类 tab、结果列表、关键词高亮。
  - 分类包含：期刊、解读、专栏、求是号。
- 新增 `src/config/homeSearch.ts`：
  - 提供默认历史搜索词。
  - 提供原型需要的兜底搜索结果，保证“总书记”等关键词无接口数据时也能展示。
- 保留 `src/utils/homeSearch.ts` 和 `src/utils/homeSearch.test.ts` 的纯搜索逻辑与测试。
- 删除旧的 `src/pages/index/components/QSHomeSearchResults.vue`，避免首页内联搜索残留。

## Verification

- [ ] `npm test`
- [ ] `npm run type-check`
- [ ] `npm run build:mp-weixin`

## Manual Checks

- [ ] 点击首页搜索框会进入 `/subPages/search/index`。
- [ ] 搜索页初始态显示历史搜索，不显示结果列表。
- [ ] 输入或点击“总书记”后切到结果态。
- [ ] 结果页顶部搜索框变紧凑，下面显示分类 tab。
- [ ] “总书记”等命中词在标题中标红。
- [ ] 返回按钮可回到首页。
