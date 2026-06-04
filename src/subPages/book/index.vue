<template>
    <view class="book-reader">
        <!-- 顶部悬浮栏 -->
        <view class="reader-header" v-show="toolbarVisible" @tap.stop>
            <view class="reader-header__main">
                <text class="reader-title">{{ title }}</text>
                <text class="reader-desc">左右滑动翻页</text>
            </view>

            <view class="reader-page-pill">
                <text class="reader-page-pill__current" @tap="store.enterCatalog">阅读原刊</text>
            </view>
        </view>

        <!-- 翻书主体 -->
        <view class="reader-book" :class="{ 'reader-book--animating': animating }"
            :style="{ height: readerHeight + 'px' }" @touchstart="onTouchStart" @touchmove="onTouchMove"
            @touchend="onTouchEnd" @touchcancel="onTouchEnd" @tap="toggleToolbar">
            <!-- 下一页 -->
            <view class="reader-sheet reader-sheet--under" v-show="showUnderSheet">
                <view class="book-page__paper">
                    <scroll-view class="book-page__scroll" scroll-y enhanced :bounces="false" :show-scrollbar="false"
                        :scroll-with-animation="false">
                        <view class="book-page__image-wrap">
                            <image class="book-page__image" :src="pages[underSheetIndex]" mode="widthFix"
                                :fade-show="false" show-menu-by-longpress @load="onImageLoad(underSheetIndex)" />
                        </view>
                    </scroll-view>

                    <view class="book-page__spine"></view>
                </view>
            </view>

            <!-- 当前页 -->
            <view class="reader-sheet reader-sheet--current" :style="currentSheetStyle">
                <view class="book-page__paper">
                    <scroll-view class="book-page__scroll" scroll-y enhanced :bounces="false" :show-scrollbar="false"
                        :scroll-with-animation="false">
                        <view class="book-page__image-wrap">
                            <image class="book-page__image" :src="pages[currentSheetIndex]" mode="widthFix"
                                :fade-show="false" show-menu-by-longpress @load="onImageLoad(currentSheetIndex)" />
                        </view>
                    </scroll-view>

                    <view class="book-page__spine"></view>
                    <view class="book-page__turn-shadow" :style="{ opacity: shadowOpacity }"></view>
                </view>
            </view>

            <!-- 上一页 -->
            <view class="reader-sheet reader-sheet--turn" v-show="showTurnSheet" :style="prevSheetStyle">
                <view class="book-page__paper">
                    <scroll-view class="book-page__scroll" scroll-y enhanced :bounces="false" :show-scrollbar="false"
                        :scroll-with-animation="false">
                        <view class="book-page__image-wrap">
                            <image class="book-page__image" :src="pages[turnSheetIndex]" mode="widthFix"
                                :fade-show="false" show-menu-by-longpress @load="onImageLoad(turnSheetIndex)" />
                        </view>
                    </scroll-view>

                    <view class="book-page__spine"></view>
                    <view class="book-page__turn-shadow" :style="{ opacity: shadowOpacity }"></view>
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
import { computed, nextTick, ref, watch } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import { useMagazineStore } from '@/store/magazineStore';

type ReaderQuery = Record<string, string | undefined>;
type TurnDirection = 'next' | 'prev' | '';
type ActiveTurnDirection = Exclude<TurnDirection, ''>;
type GestureDirection = 'horizontal' | 'vertical' | '';

const MAX_ROTATE = 88;
const FINISH_THRESHOLD = 0.22;
const ANIMATION_DURATION = 430;
const PRELOAD_RANGE = 2;

const store = useMagazineStore()

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

const imageBaseUrl = ref('https://www.qstheory.cn/ebooks/202610');
const pageCount = ref(12);
const ext = ref('jpg');
const pageStart = ref(0);

const current = ref(0);
const readerHeight = ref(700);
const windowWidth = ref(375);

const toolbarVisible = ref(true);
const loadedMap = ref<Record<number, boolean>>({});

const touchStartX = ref(0);
const touchStartY = ref(0);
const dragging = ref(false);
const hasMoved = ref(false);
const animating = ref(false);
const gestureDirection = ref<GestureDirection>('');

const turnDirection = ref<TurnDirection>('');
const turnProgress = ref(0);
const turnFromIndex = ref(0);
const turnToIndex = ref(0);

let flipTimer: ReturnType<typeof setTimeout> | null = null;
const preloadingSet = new Set<number>();

const pages = computed(() => {
    return Array.from({ length: pageCount.value }, (_, index) => {
        return `${imageBaseUrl.value}/${pageStart.value + index}.${ext.value}`;
    });
});

const hasPrev = computed(() => current.value > 0);
const hasNext = computed(() => current.value < pages.value.length - 1);

const prevIndex = computed(() => {
    return hasPrev.value ? current.value - 1 : current.value;
});

const nextIndex = computed(() => {
    return hasNext.value ? current.value + 1 : current.value;
});

const currentSheetIndex = computed(() => {
    return turnDirection.value ? turnFromIndex.value : current.value;
});

const underSheetIndex = computed(() => {
    return turnDirection.value === 'next' ? turnToIndex.value : nextIndex.value;
});

const turnSheetIndex = computed(() => {
    return turnDirection.value === 'prev' ? turnToIndex.value : prevIndex.value;
});

const showUnderSheet = computed(() => {
    return turnDirection.value === 'next' && hasNext.value;
});

const showTurnSheet = computed(() => {
    return turnDirection.value === 'prev' && hasPrev.value;
});

const progressPercent = computed(() => {
    if (!pages.value.length) return 0;
    return Math.round(((current.value + 1) / pages.value.length) * 100);
});

const shadowOpacity = computed(() => {
    if (!turnDirection.value) return '0';
    return String(0.16 + turnProgress.value * 0.32);
});

const currentSheetStyle = computed(() => {
    if (turnDirection.value === 'next') {
        const rotate = -MAX_ROTATE * turnProgress.value;
        const translateX = -14 * turnProgress.value;

        return {
            zIndex: 8,
            transform: `translate3d(${translateX}rpx, 0, 0) rotateY(${rotate}deg)`
        };
    }

    return {
        zIndex: 5,
        transform: 'translate3d(0, 0, 0) rotateY(0deg)'
    };
});

const prevSheetStyle = computed(() => {
    const rotate = -MAX_ROTATE + MAX_ROTATE * turnProgress.value;
    const translateX = -18 + 18 * turnProgress.value;

    return {
        zIndex: 9,
        transform: `translate3d(${translateX}rpx, 0, 0) rotateY(${rotate}deg)`
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

    turnFromIndex.value = current.value;
    turnToIndex.value = current.value;

    uni.setNavigationBarTitle({
        title: title.value
    });
});

onReady(() => {
    initLayout();
    preloadAround(current.value);
});

watch(current, (index) => {
    preloadAround(index);
});

watch(pages, () => {
    loadedMap.value = {};
    preloadingSet.clear();
    preloadAround(current.value);
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

    clearFlipTimer();

    touchStartX.value = touch.clientX;
    touchStartY.value = touch.clientY;

    dragging.value = true;
    hasMoved.value = false;
    gestureDirection.value = '';
}

function onTouchMove(e: any) {
    if (!dragging.value || animating.value) return;

    const touch = e.touches?.[0];
    if (!touch) return;

    const dx = touch.clientX - touchStartX.value;
    const dy = touch.clientY - touchStartY.value;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!gestureDirection.value) {
        if (absX < 8 && absY < 8) return;
        gestureDirection.value = absX > absY * 1.15 ? 'horizontal' : 'vertical';
    }

    if (gestureDirection.value === 'vertical') return;

    hasMoved.value = true;

    if (dx < 0) {
        if (!beginTurn('next')) return;
        turnProgress.value = clamp((absX / windowWidth.value) * 1.15, 0, 1);
        return;
    }

    if (dx > 0) {
        if (!beginTurn('prev')) return;
        turnProgress.value = clamp((dx / windowWidth.value) * 1.15, 0, 1);
    }
}

function onTouchEnd() {
    if (!dragging.value) return;

    dragging.value = false;
    gestureDirection.value = '';

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

function beginTurn(direction: ActiveTurnDirection) {
    if (direction === 'next' && !hasNext.value) return false;
    if (direction === 'prev' && !hasPrev.value) return false;

    if (turnDirection.value === direction) return true;

    turnFromIndex.value = current.value;
    turnToIndex.value = direction === 'next' ? nextIndex.value : prevIndex.value;
    turnDirection.value = direction;

    preloadImage(turnToIndex.value);

    return true;
}

function rollbackFlip() {
    if (!turnDirection.value) {
        resetFlipState();
        return;
    }

    animating.value = true;

    nextTick(() => {
        turnProgress.value = 0;
    });

    flipTimer = setTimeout(() => {
        resetFlipState();
    }, ANIMATION_DURATION + 30);
}

function finishFlip(direction: TurnDirection) {
    if (!direction) return;

    const targetIndex = turnToIndex.value;

    animating.value = true;

    nextTick(() => {
        turnProgress.value = 1;
    });

    flipTimer = setTimeout(() => {
        current.value = clamp(targetIndex, 0, pages.value.length - 1);
        resetFlipState();
    }, ANIMATION_DURATION + 30);
}

async function playFlip(direction: ActiveTurnDirection) {
    if (animating.value) return;
    if (!beginTurn(direction)) return;

    turnProgress.value = 0;
    animating.value = true;

    await nextTick();

    setTimeout(() => {
        turnProgress.value = 1;
    }, 30);

    flipTimer = setTimeout(() => {
        current.value =
            direction === 'next'
                ? clamp(current.value + 1, 0, pages.value.length - 1)
                : clamp(current.value - 1, 0, pages.value.length - 1);

        resetFlipState();
    }, ANIMATION_DURATION + 60);
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

function resetFlipState() {
    clearFlipTimer();

    animating.value = false;
    dragging.value = false;
    gestureDirection.value = '';
    turnDirection.value = '';
    turnProgress.value = 0;
    turnFromIndex.value = current.value;
    turnToIndex.value = current.value;

    setTimeout(() => {
        hasMoved.value = false;
    }, 80);
}

function clearFlipTimer() {
    if (!flipTimer) return;

    clearTimeout(flipTimer);
    flipTimer = null;
}

function preloadAround(centerIndex: number) {
    for (let offset = -PRELOAD_RANGE; offset <= PRELOAD_RANGE; offset += 1) {
        preloadImage(centerIndex + offset);
    }
}

function preloadImage(index: number) {
    if (index < 0 || index >= pages.value.length) return;
    if (loadedMap.value[index] || preloadingSet.has(index)) return;

    const src = pages.value[index];
    if (!src) return;

    preloadingSet.add(index);

    uni.getImageInfo({
        src,
        success: () => {
            loadedMap.value = {
                ...loadedMap.value,
                [index]: true
            };
        },
        complete: () => {
            preloadingSet.delete(index);
        }
    });
}

function onImageLoad(index: number) {
    loadedMap.value = {
        ...loadedMap.value,
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
        radial-gradient(circle at 50% -10%, rgba(224, 62, 45, 0.14) 0, rgba(224, 62, 45, 0) 42%),
        linear-gradient(180deg, #fff5f1 0%, #faebe6 42%, #f7f1ee 100%);
    box-sizing: border-box;
}

.reader-header {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    top: 24rpx;
    z-index: 30;
    height: 88rpx;
    padding: 0 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 16rpx 42rpx rgba(112, 38, 28, 0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    transform: translate3d(0, 0, 0);
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
    font-size: 24rpx;
    font-weight: 600;
}

.reader-page-pill__split {
    opacity: 0.42;
}

.reader-book {
    position: relative;
    z-index: 2;
    width: 100%;
    overflow: hidden;
    perspective: 1800rpx;
    transform-style: preserve-3d;
    transform: translate3d(0, 0, 0);
    background:
        linear-gradient(90deg, rgba(94, 32, 22, 0.06), rgba(255, 255, 255, 0) 16%),
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
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: transform;
    transition: none;
    transform: translate3d(0, 0, 0);
}

.reader-book--animating .reader-sheet {
    transition: transform 0.43s cubic-bezier(0.22, 1, 0.36, 1);
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

.book-page__paper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 0 28rpx 28rpx 0;
    background: #fff;
    box-shadow:
        0 24rpx 60rpx rgba(111, 37, 28, 0.14),
        0 8rpx 20rpx rgba(111, 37, 28, 0.07);
    box-sizing: border-box;
    transform: translate3d(0, 0, 0);
}

.book-page__scroll {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    box-sizing: border-box;
}

.book-page__image-wrap {
    min-height: 100%;
    width: 100%;
    padding: 100rpx 0 120rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.book-page__image {
    width: 100%;
    display: block;
    background: #fff;
    border-radius: 0 28rpx 28rpx 0;
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.book-page__spine {
    position: absolute;
    z-index: 5;
    left: 0;
    top: 0;
    bottom: 0;
    width: 42rpx;
    background: linear-gradient(90deg,
            rgba(48, 20, 14, 0.18) 0%,
            rgba(48, 20, 14, 0.07) 42%,
            rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
}

.book-page__turn-shadow {
    position: absolute;
    z-index: 6;
    right: 0;
    top: 0;
    bottom: 0;
    width: 132rpx;
    background: linear-gradient(270deg,
            rgba(45, 14, 10, 0.28) 0%,
            rgba(45, 14, 10, 0.1) 46%,
            rgba(45, 14, 10, 0) 100%);
    pointer-events: none;
}

.reader-control {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    bottom: 28rpx;
    z-index: 30;
    padding: 14rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 18rpx 46rpx rgba(111, 37, 28, 0.14);
    display: flex;
    align-items: center;
    gap: 14rpx;
    box-sizing: border-box;
    transform: translate3d(0, 0, 0);
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
    box-shadow: 0 14rpx 30rpx rgba(224, 62, 45, 0.25);
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