# 项目开发约定

本项目是 uni-app + Vue 3 + TypeScript 微信小程序。每次开发前必须先阅读并遵循 [docs/development-guidelines.md](docs/development-guidelines.md)。

执行要点：

- 不写未使用代码，不堆 DOM，不用样式覆盖掩盖结构问题。
- 页面私有组件放 `src/pages/<page>/components`，跨页面复用组件才放 `src/components`。
- hooks、store、config、services、types、utils 按职责拆分。
- 图标优先使用uni-app提供的图标。
- 本项目为微信小程序项目所以需要注意 顶部安全胶囊的安全距离，以及底部的安全区域，等等小程序的兼容问题。
- 假数据和静态配置放 `src/config`，真实请求和数据适配放 `src/services`。
- 修改后必须自审，并覆盖空数据、接口失败、重复点击、无效参数等边界。
- 至少运行 `npm run type-check`；涉及小程序产物时运行 `npm run build:mp-weixin`。

