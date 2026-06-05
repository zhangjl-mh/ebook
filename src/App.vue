<script setup lang="ts">
defineOptions({ name: 'App' });
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

page {
  --qs-color-primary: #d71920;
  --qs-color-primary-strong: #e31822;
  --qs-color-primary-light: #fff0f1;
  --qs-page-bg: #f5f6f8;
  --qs-page-bg-soft: #f6f7f9;
  --qs-card-bg: #ffffff;
  --qs-text-main: #202228;
  --qs-text-regular: #33363d;
  --qs-text-secondary: #70757e;
  --qs-text-muted: #8b9098;
  --qs-text-placeholder: #999999;
  --qs-border-color: #eceef1;
  --qs-border-color-light: #f0f1f3;
  --qs-status-bar-height: var(--status-bar-height);
  --qs-window-bottom: var(--window-bottom);
  --qs-bottom-safe: constant(safe-area-inset-bottom);
  --qs-bottom-safe: env(safe-area-inset-bottom);
  --qs-page-bottom-gap: calc(var(--qs-window-bottom) + var(--qs-bottom-safe));
  --qs-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

  min-height: 100%;
  background: var(--qs-page-bg);
  color: var(--qs-text-main);
  font-family: var(--qs-font-family);
  font-size: 28rpx;
  box-sizing: border-box;
}

.qs-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--qs-page-bg);
  box-sizing: border-box;
}

.qs-page-scroll {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}

.qs-page-scroll__inner {
  min-height: 100%;
  box-sizing: border-box;
}
</style>
