<template>
    <view class="book-reader">
        <!-- 顶部悬浮栏 -->
        <view class="reader-header" v-show="toolbarVisible">
            <view class="reader-header__main">
                <text class="reader-title">{{ title }}</text>
                <text class="reader-desc">左右拖动翻页</text>
            </view>

            <view class="reader-page-pill">
                <text class="reader-page-pill__current">{{ current + 1 }}</text>
                <text class="reader-page-pill__split">/</text>
                <text>{{ pages.length }}</text>
            </view>
        </view>

        <!-- 翻书主体 -->
        <view class="reader-book" :class="{ 'reader-book--animating': animating }"
            :style="{ height: readerHeight + 'px' }" @touchstart="onTouchStart" @touchmove="onTouchMove"
            @touchend="onTouchEnd" @touchcancel="onTouchEnd" @tap="toggleToolbar">
            <!-- 下一页：放在当前页下面 -->
            <view v-if="turnDirection === 'next' && hasNext" class="reader-sheet reader-sheet--under">
                <view class="book-page__paper">
                    <scroll-view class="book-page__scroll" scroll-y :show-scrollbar="false">
                        <image class="book-page__image" :src="pages[nextIndex]" mode="widthFix" lazy-load
                            show-menu-by-longpress @error="onImageError(nextIndex)" />
                    </scroll-view>

                    <view class="book-page__spine"></view>
                    <view class="book-page__right-curl"></view>
                    <view class="book-page__shine"></view>

                    <view v-if="failedMap[nextIndex]" class="page-error">
                        <text class="page-error__title">图片加载失败</text>
                        <text class="page-error__text">{{ pages[nextIndex] }}</text>
                    </view>
                </view>
            </view>

            <!-- 当前页 -->
            <view class="reader-sheet reader-sheet--current" :style="currentSheetStyle">
                <view class="book-page__paper">
                    <scroll-view class="book-page__scroll" scroll-y :show-scrollbar="false">
                        <image class="book-page__image" :src="pages[current]" mode="widthFix" lazy-load
                            show-menu-by-longpress @error="onImageError(current)" />
                    </scroll-view>

                    <view class="book-page__spine"></view>
                    <view class="book-page__turn-shadow" :style="{ opacity: shadowOpacity }"></view>
                    <view class="book-page__right-curl"></view>
                    <view class="book-page__shine"></view>

                    <view v-if="failedMap[current]" class="page-error">
                        <text class="page-error__title">图片加载失败</text>
                        <text class="page-error__text">{{ pages[current] }}</text>
                    </view>
                </view>
            </view>

            <!-- 上一页：从左侧翻回来 -->
            <view v-if="turnDirection === 'prev' && hasPrev" class="reader-sheet reader-sheet--turn"
                :style="prevSheetStyle">
                <view class="book-page__paper">
                    <scroll-view class="book-page__scroll" scroll-y :show-scrollbar="false">
                        <image class="book-page__image" :src="pages[prevIndex]" mode="widthFix" lazy-load
                            show-menu-by-longpress @error="onImageError(prevIndex)" />
                    </scroll-view>

                    <view class="book-page__spine"></view>
                    <view class="book-page__turn-shadow" :style="{ opacity: shadowOpacity }"></view>
                    <view class="book-page__right-curl"></view>
                    <view class="book-page__shine"></view>

                    <view v-if="failedMap[prevIndex]" class="page-error">
                        <text class="page-error__title">图片加载失败</text>
                        <text class="page-error__text">{{ pages[prevIndex] }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部控制栏 -->
        <view class="reader-control" v-show="toolbarVisible" @tap.stop>
            <button class="reader-control__btn" :disabled="!hasPrev"
                :class="{ 'reader-control__btn--disabled': !hasPrev }" @tap.stop="prevPage">
                上一页
            </button>

            <view class="reader-control__center">
                <slider class="reader-slider" :min="1" :max="pages.length" :value="current + 1" :block-size="16"
                    activeColor="#e03e2d" backgroundColor="rgba(224, 62, 45, 0.18)" @change="onSliderChange" />
                <text class="reader-progress">{{ progressPercent }}%</text>
            </view>

            <button class="reader-control__btn reader-control__btn--primary" :disabled="!hasNext"
                :class="{ 'reader-control__btn--disabled': !hasNext }" @tap.stop="nextPage">
                下一页
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';

type ReaderQuery = Record<string, string | undefined>;
type TurnDirection = 'next' | 'prev' | '';

const MAX_ROTATE = 88;
const FINISH_THRESHOLD = 0.22;
const ANIMATION_DURATION = 430;

const safeDecode = (value = '') => {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
};

const toNumber = (value: unknown, fallback: number) => {
    const num = Number(value);
    return Number.isFinite(num) && num > 0 ? num : fallback;
};

const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
};

const title = ref('2026 第 10 期');

/**
 * 图片地址规则：
 * https://www.qstheory.cn/ebooks/202610/0.jpg
 * https://www.qstheory.cn/ebooks/202610/1.jpg
 * https://www.qstheory.cn/ebooks/202610/2.jpg
 */
const imageBaseUrl = ref('https://www.qstheory.cn/ebooks/202610');
const pageCount = ref(12);
const ext = ref('jpg');
const pageStart = ref(0);

const current = ref(0);
const readerHeight = ref(700);
const windowWidth = ref(375);

const toolbarVisible = ref(true);
const failedMap = ref<Record<number, boolean>>({});

const touchStartX = ref(0);
const touchStartY = ref(0);
const dragging = ref(false);
const hasMoved = ref(false);
const animating = ref(false);
const turnDirection = ref<TurnDirection>('');
const turnProgress = ref(0);

const pages = computed(() => {
    return Array.from({ length: pageCount.value }, (_, index) => {
        return `${imageBaseUrl.value}/${pageStart.value + index}.${ext.value}`;
    });
});

const hasPrev = computed(() => current.value > 0);
const hasNext = computed(() => current.value < pages.value.length - 1);

const prevIndex = computed(() => {
    return hasPrev.value ? current.value - 1 : 0;
});

const nextIndex = computed(() => {
    return hasNext.value ? current.value + 1 : current.value;
});

const progressPercent = computed(() => {
    if (!pages.value.length) return 0;
    return Math.round(((current.value + 1) / pages.value.length) * 100);
});

const shadowOpacity = computed(() => {
    if (!turnDirection.value) return '0.22';
    return String(0.2 + turnProgress.value * 0.38);
});

const currentSheetStyle = computed(() => {
    if (turnDirection.value === 'next') {
        const rotate = -MAX_ROTATE * turnProgress.value;
        const translateX = -18 * turnProgress.value;
        const opacity = 1 - turnProgress.value * 0.18;

        return {
            zIndex: 8,
            opacity,
            transform: `translateX(${translateX}rpx) rotateY(${rotate}deg)`
        };
    }

    if (turnDirection.value === 'prev') {
        return {
            zIndex: 2,
            opacity: 1,
            transform: 'rotateY(0deg)'
        };
    }

    return {
        zIndex: 5,
        opacity: 1,
        transform: 'rotateY(0deg)'
    };
});

const prevSheetStyle = computed(() => {
    const rotate = -MAX_ROTATE + MAX_ROTATE * turnProgress.value;
    const translateX = -20 + 20 * turnProgress.value;
    const opacity = 0.46 + turnProgress.value * 0.54;

    return {
        zIndex: 9,
        opacity,
        transform: `translateX(${translateX}rpx) rotateY(${rotate}deg)`
    };
});

onLoad((query?: ReaderQuery) => {
    title.value = safeDecode(query?.title || '2026 第 10 期');

    imageBaseUrl.value = safeDecode(
        query?.imageBaseUrl || 'https://www.qstheory.cn/ebooks/202610'
    );

    pageCount.value = toNumber(query?.pageCount, 12);
    ext.value = safeDecode(query?.ext || 'jpg');

    const start = Number(query?.pageStart ?? 0);
    pageStart.value = Number.isFinite(start) ? start : 0;

    const startPage = toNumber(query?.page, 1);
    current.value = clamp(startPage - 1, 0, pageCount.value - 1);

    uni.setNavigationBarTitle({
        title: title.value
    });
});

onReady(() => {
    initLayout();
});

function initLayout() {
    const systemInfo = uni.getSystemInfoSync();

    readerHeight.value = systemInfo.windowHeight;
    windowWidth.value = systemInfo.windowWidth || 375;
}

function onTouchStart(e: any) {
    if (animating.value) return;

    const touch = e.touches?.[0];
    if (!touch) return;

    touchStartX.value = touch.clientX;
    touchStartY.value = touch.clientY;
    dragging.value = true;
    hasMoved.value = false;
}

function onTouchMove(e: any) {
    if (!dragging.value || animating.value) return;

    const touch = e.touches?.[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartX.value;
    const dy = touch.clientY - touchStartY.value;

    if (Math.abs(dx) < 8) return;

    // 纵向滚动更明显时，不触发翻页
    if (Math.abs(dy) > Math.abs(dx) * 1.2) return;

    hasMoved.value = true;

    if (dx < 0) {
        turnDirection.value = 'next';

        if (!hasNext.value) {
            turnProgress.value = clamp(Math.abs(dx) / windowWidth.value, 0, 0.1);
            return;
        }

        turnProgress.value = clamp((Math.abs(dx) / windowWidth.value) * 1.15, 0, 1);
        return;
    }

    if (dx > 0) {
        turnDirection.value = 'prev';

        if (!hasPrev.value) {
            turnProgress.value = clamp(dx / windowWidth.value, 0, 0.1);
            return;
        }

        turnProgress.value = clamp((dx / windowWidth.value) * 1.15, 0, 1);
    }
}

function onTouchEnd() {
    if (!dragging.value) return;

    dragging.value = false;

    const direction = turnDirection.value;
    const canTurn =
        direction === 'next'
            ? hasNext.value
            : direction === 'prev'
                ? hasPrev.value
                : false;

    if (!direction || !canTurn || turnProgress.value < FINISH_THRESHOLD) {
        rollbackFlip();
        return;
    }

    finishFlip(direction);
}

function rollbackFlip() {
    animating.value = true;
    turnProgress.value = 0;

    setTimeout(() => {
        resetFlipState();
    }, ANIMATION_DURATION);
}

function finishFlip(direction: TurnDirection) {
    if (!direction) return;

    animating.value = true;
    turnProgress.value = 1;

    setTimeout(() => {
        if (direction === 'next' && hasNext.value) {
            current.value += 1;
        }

        if (direction === 'prev' && hasPrev.value) {
            current.value -= 1;
        }

        resetFlipState();
    }, ANIMATION_DURATION);
}

function resetFlipState() {
    animating.value = false;
    dragging.value = false;
    turnDirection.value = '';
    turnProgress.value = 0;

    setTimeout(() => {
        hasMoved.value = false;
    }, 80);
}

async function playFlip(direction: 'next' | 'prev') {
    if (animating.value) return;

    if (direction === 'next' && !hasNext.value) return;
    if (direction === 'prev' && !hasPrev.value) return;

    turnDirection.value = direction;
    turnProgress.value = 0;
    animating.value = true;

    await nextTick();

    setTimeout(() => {
        turnProgress.value = 1;
    }, 20);

    setTimeout(() => {
        if (direction === 'next') {
            current.value += 1;
        } else {
            current.value -= 1;
        }

        resetFlipState();
    }, ANIMATION_DURATION + 40);
}

function prevPage() {
    playFlip('prev');
}

function nextPage() {
    playFlip('next');
}

function onSliderChange(e: any) {
    const page = Number(e.detail.value);
    const nextPageIndex = clamp(page - 1, 0, pages.value.length - 1);

    if (nextPageIndex === current.value) return;

    // 相邻页播放翻页动画；跨多页直接跳转
    if (Math.abs(nextPageIndex - current.value) === 1) {
        playFlip(nextPageIndex > current.value ? 'next' : 'prev');
        return;
    }

    current.value = nextPageIndex;
    resetFlipState();
}

function toggleToolbar() {
    if (dragging.value || animating.value || hasMoved.value) return;
    toolbarVisible.value = !toolbarVisible.value;
}

function onImageError(index: number) {
    failedMap.value = {
        ...failedMap.value,
        [index]: true
    };
}
</script>

<style lang="scss" scoped>
$theme: #e03e2d;

.book-reader {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background:
        radial-gradient(circle at 50% -10%, rgba(224, 62, 45, 0.18) 0, rgba(224, 62, 45, 0) 42%),
        linear-gradient(180deg, #fff5f1 0%, #faebe6 42%, #f7f1ee 100%);
    box-sizing: border-box;
}

/* 顶部悬浮栏 */
.reader-header {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    top: 24rpx;
    z-index: 30;
    height: 88rpx;
    padding: 0 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.86);
    box-shadow: 0 16rpx 42rpx rgba(112, 38, 28, 0.14);
    backdrop-filter: blur(18rpx);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
}

.reader-header__main {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4rpx;
}

.reader-title {
    max-width: 470rpx;
    color: #2d1712;
    font-size: 30rpx;
    font-weight: 800;
    line-height: 1.15;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.reader-desc {
    color: rgba(45, 23, 18, 0.48);
    font-size: 20rpx;
}

.reader-page-pill {
    height: 54rpx;
    min-width: 112rpx;
    padding: 0 18rpx;
    border-radius: 999rpx;
    background: rgba(224, 62, 45, 0.1);
    color: rgba(45, 23, 18, 0.58);
    font-size: 23rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5rpx;
}

.reader-page-pill__current {
    color: $theme;
    font-size: 31rpx;
    font-weight: 900;
}

.reader-page-pill__split {
    opacity: 0.42;
}

/* 翻书区域 */
.reader-book {
    position: relative;
    z-index: 2;
    width: 100%;
    overflow: hidden;
    perspective: 1800rpx;
    transform-style: preserve-3d;
    background:
        linear-gradient(90deg, rgba(94, 32, 22, 0.08), rgba(255, 255, 255, 0) 16%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0));
}

.reader-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-origin: left center;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    will-change: transform, opacity;
    transition: none;
}

.reader-book--animating .reader-sheet {
    transition:
        transform 0.43s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.43s ease;
}

.reader-sheet--under {
    z-index: 1;
}

.reader-sheet--current {
    z-index: 5;
}

.reader-sheet--turn {
    z-index: 9;
}

/* 页面纸张 */
.book-page__paper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    /* 不要外边框，只保留右侧上下圆角 */
    border-radius: 0 28rpx 28rpx 0;
    background: #fff;

    box-shadow:
        0 28rpx 70rpx rgba(111, 37, 28, 0.16),
        0 8rpx 22rpx rgba(111, 37, 28, 0.08);
    box-sizing: border-box;
}

/* 图片宽度撑满 */
.book-page__scroll {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    padding-top: 100rpx;
}

.book-page__image {
    width: 100%;
    display: block;
    background: #fff;
    border-radius: 0 28rpx 28rpx 0;
}

/* 左侧装订阴影 */
.book-page__spine {
    position: absolute;
    z-index: 5;
    left: 0;
    top: 0;
    bottom: 0;
    width: 46rpx;
    background: linear-gradient(90deg,
            rgba(48, 20, 14, 0.2) 0%,
            rgba(48, 20, 14, 0.08) 34%,
            rgba(255, 255, 255, 0.12) 70%,
            rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
}

/* 翻页右侧阴影 */
.book-page__turn-shadow {
    position: absolute;
    z-index: 6;
    right: 0;
    top: 0;
    bottom: 0;
    width: 150rpx;
    background: linear-gradient(270deg,
            rgba(45, 14, 10, 0.3) 0%,
            rgba(45, 14, 10, 0.12) 42%,
            rgba(45, 14, 10, 0) 100%);
    pointer-events: none;
    transition: opacity 0.24s ease;
}

/* 右下角卷页 */
.book-page__right-curl {
    position: absolute;
    z-index: 7;
    right: 0;
    bottom: 0;
    width: 128rpx;
    height: 128rpx;
    border-bottom-right-radius: 28rpx;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 44%,
            rgba(224, 62, 45, 0.08) 45%,
            rgba(224, 62, 45, 0.22) 100%);
    opacity: 0.58;
    pointer-events: none;
}

/* 页面高光 */
.book-page__shine {
    position: absolute;
    z-index: 8;
    inset: 0;
    border-radius: 0 28rpx 28rpx 0;
    background:
        linear-gradient(108deg,
            rgba(255, 255, 255, 0.24) 0%,
            rgba(255, 255, 255, 0.08) 24%,
            rgba(255, 255, 255, 0) 48%),
        linear-gradient(180deg,
            rgba(255, 255, 255, 0.18),
            rgba(255, 255, 255, 0) 18%);
    pointer-events: none;
}

/* 图片错误 */
.page-error {
    position: absolute;
    z-index: 40;
    left: 40rpx;
    right: 40rpx;
    top: 50%;
    transform: translateY(-50%);
    padding: 36rpx 26rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 20rpx 50rpx rgba(111, 37, 28, 0.16);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
}

.page-error__title {
    color: $theme;
    font-size: 30rpx;
    font-weight: 800;
}

.page-error__text {
    color: rgba(44, 21, 16, 0.62);
    font-size: 23rpx;
    text-align: center;
    word-break: break-all;
}

/* 底部控制栏 */
.reader-control {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    bottom: 28rpx;
    z-index: 30;
    padding: 14rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.86);
    box-shadow: 0 18rpx 46rpx rgba(111, 37, 28, 0.16);
    backdrop-filter: blur(18rpx);
    display: flex;
    align-items: center;
    gap: 14rpx;
    box-sizing: border-box;
}

.reader-control__btn {
    width: 126rpx;
    height: 64rpx;
    line-height: 64rpx;
    padding: 0;
    margin: 0;
    border-radius: 999rpx;
    background: #fff;
    color: rgba(44, 21, 16, 0.72);
    font-size: 24rpx;
    font-weight: 700;
    border: none;
}

.reader-control__btn::after {
    border: none;
}

.reader-control__btn--primary {
    background: linear-gradient(135deg, #ff6a58 0%, $theme 100%);
    color: #fff;
    box-shadow: 0 14rpx 30rpx rgba(224, 62, 45, 0.28);
}

.reader-control__btn--disabled {
    opacity: 0.36;
}

.reader-control__center {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.reader-slider {
    flex: 1;
    margin: 0;
}

.reader-progress {
    width: 58rpx;
    text-align: right;
    color: rgba(44, 21, 16, 0.5);
    font-size: 21rpx;
}
</style>