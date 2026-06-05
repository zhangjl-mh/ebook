<script setup lang="ts">
defineOptions({ name: 'App' });
</script>

<style lang="scss">
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

*,
page,
view,
text,
image,
button,
input,
textarea,
scroll-view,
swiper,
swiper-item,
navigator {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

page {
  --qs-color-primary: #d71920;
  --qs-color-primary-strong: #e31822;
  --qs-color-primary-light: #fff0f1;
  --qs-color-success: #14bd49;
  --qs-page-bg: #f5f6f8;
  --qs-page-bg-soft: #f6f7f9;
  --qs-card-bg: #ffffff;
  --qs-card-bg-warm: #fffafa;
  --qs-text-main: #202228;
  --qs-text-regular: #33363d;
  --qs-text-secondary: #70757e;
  --qs-text-muted: #8b9098;
  --qs-text-placeholder: #999999;
  --qs-text-inverse: #ffffff;
  --qs-border-color: #eceef1;
  --qs-border-color-light: #f0f1f3;
  --qs-radius-sm: 8rpx;
  --qs-radius-base: 18rpx;
  --qs-radius-card: 22rpx;
  --qs-radius-panel: 24rpx;
  --qs-radius-pill: 999rpx;
  --qs-page-padding-x: 30rpx;
  --qs-page-bottom-space: 160rpx;
  --qs-tabbar-bottom-space: 160rpx;
  --qs-shadow-soft: 0 12rpx 34rpx rgba(31, 34, 40, 0.04);
  --qs-shadow-card: 0 18rpx 42rpx rgba(56, 28, 28, 0.08);
  --qs-shadow-card-soft: 0 10rpx 30rpx rgba(25, 28, 34, 0.04);
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
  background: var(--qs-page-bg);
}
</style>
