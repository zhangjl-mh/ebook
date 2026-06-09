# 开发规范

每次开发前必须先读本文件。开发完成后必须自审修改内容，并做类型检查、构建或必要的边界测试；不符合要求就继续修改，直到通过。

## 核心原则

- 不写当前需求用不到的代码，不保留未使用的组件、变量、导入、样式和注释。
- DOM 结构使用能满足需求的最简单实现，不为视觉效果堆嵌套。
- 样式需要调整时优先重写清晰结构，不在旧样式上反复覆盖。
- 逻辑先梳理职责：可复用的抽 hook，接口和数据适配进 service，纯函数进 utils，共享类型进 types。
- 组件只做展示和交互转发；页面做组合；store 管业务状态；config 放假数据和静态配置。
- 代码要可读、可删、可测试。宁可少一层抽象，也不要无意义封装。

## 目录规则

```text
src/pages/<page>/index.vue              # 页面
src/pages/<page>/components/*.vue       # 页面私有组件
src/components/*.vue                    # 跨页面复用组件
src/hooks/useXxx.ts                     # 可复用组合逻辑
src/store/<domain>Store.ts              # Pinia 业务状态
src/config/*.ts                         # 假数据、静态配置
src/services/*.ts                       # 请求、DTO、数据适配
src/types/*.ts                          # 多处共享类型
src/utils/*.ts                          # 纯工具函数
```

组件只有被两个及以上页面复用，或明确是全局能力时，才放 `src/components`。

## Vue 与组件

- 统一使用 `<script setup lang="ts">`。
- props、emits、事件参数必须有类型，避免 `any` 外扩。
- 列表必须用稳定业务 key。
- 组件不直接请求接口，不直接写假数据，不重复拼复杂路由。
- 微信小程序优先使用 `view`、`text`、`image`、`button`、`input` 等 uni 组件。
- 对于二级页面的header优先使用组件`src/components/SecondPageHeader.vue`。
- 避免浏览器 DOM API；平台专用逻辑使用条件编译。

## 小程序枚举与 TypeScript

- 跨页面、跨组件、跨 config/service/store 使用的有限取值必须收口到共享枚举入口，使用 `as const` 对象加同名 type，避免裸字符串散落。
- 页面私有且只在单文件内使用的有限取值可留在页面内；一旦被第二处复用，必须上移到 `src/types/enums.ts`。
- header mode、tab key、订阅套餐、支付方式、权益 icon、文章块类型、个人中心 badge/menu icon 等都按共享枚举管理。
- 事件参数优先使用项目内事件类型；不稳定 payload 使用 `unknown` 加类型收窄，禁止为了省事写 `any`。
- 只作为类型使用的导入必须使用 `import type`。

## Store / Service / Config

- store 只保存业务状态、loading、error、active tab、选中项，并提供业务 action。
- service 负责 `uni.request`、远程 DTO 类型、接口字段到业务模型的转换。
- config 只放假数据和静态配置，不写请求、跳转、清洗逻辑。
- 远程数据必须有失败兜底、空态和 loading 状态。

## 样式

- 全局样式变量放 `src/uni.scss` 和 `src/App.vue`，优先复用项目变量，不在页面里重复写品牌色、页面底色、卡片色、边框色、阴影和通用间距。
- 样式编写原则：简单样式优先使用 Tailwind CSS，减少重复 CSS；复杂样式、组件级样式、特殊状态和平台兼容问题，可在对应组件内编写 scoped SCSS。
- 常见重复Tailwind代码 可通过 @apply 工具类1 工具类2 工具类3形式复用；
- 小程序自定义导航必须使用 `useSafeArea` 或 uni-app 系统变量处理状态栏、胶囊和底部安全区。
- 固定底部栏必须叠加 `safeArea.bottomInset` 或全局底部安全变量，内容区必须预留底部空间，避免被 tabBar 或 Home Indicator 遮挡。
- 组件样式默认 `scoped`。
- 删除不用的 class；不要留下“以后可能用”的样式。
- 能用一个 class 解决就不要多层容器配合。
- 公共组件不能依赖父页面样式才能正常显示。
- 中文文案统一 UTF-8，提交前检查乱码。
  按你这种格式整理如下：

## 样式

- 全局样式变量统一放在 `src/uni.scss` 和 `src/App.vue` 中，优先复用项目已有变量，不在页面内重复定义品牌色、页面底色、卡片色、边框色、阴影和通用间距。
- 简单样式优先使用 Tailwind CSS 工具类，减少重复 CSS；复杂布局、组件级样式、特殊状态、动画效果和平台兼容问题，可在对应组件内编写 `scoped SCSS`。
- 常见重复的 Tailwind CSS 工具类组合，可通过 `@apply 工具类1 工具类2 工具类3;` 的形式复用，放置全局样式中。
- 小程序自定义导航必须使用 `useSafeArea` 或 uni-app 系统变量处理状态栏、胶囊区域和底部安全区，禁止使用固定数值硬编码。
- 固定底部栏必须叠加 `safeArea.bottomInset` 或全局底部安全区变量；内容区必须预留底部空间，避免被 `tabBar` 或 Home Indicator 遮挡。
- 组件样式默认使用 `scoped`，避免样式污染其他页面或组件。
- 删除未使用的 class 和样式代码，不保留“以后可能会用”的冗余样式。
- 能用一个 class 或一个语义化容器解决的布局，不要额外增加多层无意义容器。
- 公共组件必须具备完整的内部样式，不能依赖父页面样式才能正常显示。
- 中文文案统一使用 UTF-8 编码，提交前检查是否存在乱码、异常空格或不可见字符。


## iOS 页面滚动与回弹

- 首页保留原生下拉刷新时，不设置 `disableScroll`；必须设置页面底部背景和内容底部留白，避免底部回弹露白。
- 不需要原生页面滚动或下拉刷新的页面，在 `pages.json` 的页面 `style` 中设置 `disableScroll: true`；该配置只在页面级有效，不写进 `globalStyle`。
- 设置 `disableScroll` 后，长内容必须使用固定高度的内部 `scroll-view scroll-y` 承载，保证内容仍可滚动。
- `scroll-view` 必须有稳定高度；需要 flex 布局时加 `enable-flex`。
- 电子刊、沉浸式阅读、固定底部支付栏、文章详情等页面，默认按页面级禁止回弹加内部滚动处理。

## 每次修改后的强制流程

1. 自审：是否有 unused code、重复 DOM、重复逻辑、样式覆盖、职责混乱。
2. 边界测试：至少覆盖空数据、接口失败、重复点击、无效参数、loading/refresh 结束。
3. 验证：至少运行 `npm run type-check`；涉及微信小程序产物时运行 `npm run build:mp-weixin`。
4. 复审：如果测试或审查不通过，修改后重新执行 1-3，如有问题及时询问。

## 主流工程约束

- 单一职责：一个文件只承担清晰职责。
- 就近内聚：页面私有逻辑留在页面目录，公共能力再上移。
- 显式优于隐式：状态来源、事件流、数据转换必须可追踪。
- 小步修改：避免顺手重构无关代码。
- 类型先行：共享数据结构先定义类型，再写实现。
- 失败可预期：异步流程必须考虑失败和空结果。
