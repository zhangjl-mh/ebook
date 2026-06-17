# 求是数字刊小程序

基于 uni-app、Vue 3、TypeScript、Pinia 和 Tailwind CSS 构建的微信小程序项目，主要包含推荐首页、期刊书架、数字刊阅读、文章详情、订阅会员和个人中心等功能。

## 技术栈

- uni-app + Vue 3 + TypeScript
- Pinia 状态管理
- Vite + `@dcloudio/vite-plugin-uni`
- Tailwind CSS + `weapp-tailwindcss`
- SCSS，全局变量集中在 `src/uni.scss`
- uni-ui，已通过 `easycom` 自动导入 `uni-*` 组件

## 快速开始

```bash
npm install
npm run dev:mp-weixin
npm run dev:h5
```

使用微信开发者工具导入 `dist/dev/mp-weixin` 目录进行预览和调试。

如需生成微信小程序构建产物：

```bash
npm run build:mp-weixin
```

## 常用脚本

| 命令                      | 说明                     |
| ------------------------- | ------------------------ |
| `npm run dev:mp-weixin`   | 启动微信小程序开发构建   |
| `npm run build:mp-weixin` | 生成微信小程序生产构建   |
| `npm run dev:h5`          | 启动 H5 开发环境         |
| `npm run build:h5`        | 生成 H5 构建产物         |
| `npm run type-check`      | 执行 TypeScript 类型检查 |

## 目录结构

```text
src/
  pages/                 主包页面
    index/               推荐首页
    magazine/            期刊书架
    my/                  个人中心
  subPages/              分包页面
    article-detail/      文章详情
    book/                数字刊阅读
    catalog/             目录
    subscribe/           订阅会员
    webview/             WebView 承载页
  components/            跨页面复用组件
  hooks/                 可复用组合逻辑
  store/                 Pinia 状态
  config/                mock 数据和静态配置
  services/              请求封装与数据适配
  types/                 共享类型与枚举
  utils/                 纯工具函数
  static/                静态资源
```

页面私有组件放在对应页面目录下的 `components` 中，只有跨页面复用的组件才放入 `src/components`。

## 页面与路由

主包页面配置在 `src/pages.json` 的 `pages` 中：

- `pages/index/index`：推荐首页，包含头部、期刊轮播、订阅入口和文章列表。
- `pages/magazine/index`：期刊书架，支持年份筛选、搜索和期刊打开。
- `pages/my/index`：个人中心。

分包页面配置在 `subPackages` 中：

- `subPages/book/index`：数字刊阅读页。
- `subPages/catalog/index`：目录页。
- `subPages/subscribe/index`：订阅会员页。
- `subPages/article-detail/index`：文章详情页。
- `subPages/webview/index`：外部链接承载页。

## 开发约定

每次开发前必须先阅读并遵循 [`docs/development-guidelines.md`](docs/development-guidelines.md)。

核心约定：

- 不保留未使用的组件、变量、导入、样式或注释。
- 页面只做组合，组件负责展示和交互转发，跨页面共享状态统一放入 store。
- mock 数据和静态配置放在 `src/config`，真实请求和数据适配放在 `src/services`。
- 优先使用 Tailwind CSS；复杂布局、状态样式和兼容性样式使用 scoped SCSS。
- 微信小程序自定义导航、固定底栏和滚动页面必须处理顶部胶囊、安全区和底部安全距离。
- 修改后至少运行 `npm run type-check`；涉及微信小程序产物时运行 `npm run build:mp-weixin`。

## 小程序调试

1. 运行 `npm run dev:mp-weixin`。
2. 打开微信开发者工具。
3. 导入 `dist/dev/mp-weixin`。
4. 如需使用自己的小程序 AppID，请检查并调整 `src/manifest.json` 中的 `mp-weixin.appid`。

## 提交前检查

```bash
npm run type-check
```

涉及页面渲染、路由、静态资源或小程序配置的修改，额外执行：

```bash
npm run build:mp-weixin
```
