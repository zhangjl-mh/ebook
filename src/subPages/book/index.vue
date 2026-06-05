<template>
    <view class="book-reader">
        <QSSubPageHeader :title="title" :mode="HeaderMode.Compact" />

        <!-- 顶部悬浮栏：保留 -->
        <view class="reader-header" v-show="toolbarVisible" :style="headerFloatStyle" @tap.stop>
            <view class="reader-header__main">
                <text class="reader-title">{{ title }}</text>
                <text class="reader-desc">左右滑动翻页</text>
            </view>

            <button class="reader-page-pill" :disabled="openingCatalog" @tap.stop="openCatalog">
                <text class="reader-page-pill__current">阅读原刊</text>
            </button>
        </view>

        <!-- 电子书主体：不用 swiper，自定义翻页 -->
        <view class="reader-book" :class="{ 'reader-book--animating': animating }" :style="readerBookStyle"
            @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd"
            @tap="toggleToolbar">
            <!-- 下一页底图 -->
            <view class="reader-sheet reader-sheet--under" :style="underSheetStyle">
                <image v-if="getPageSrc(underSheetIndex)" class="reader-page-image" :src="getPageSrc(underSheetIndex)"
                    mode="aspectFit" :fade-show="false" show-menu-by-longpress @load="onImageLoad(underSheetIndex)" />
            </view>

            <!-- 当前页 -->
            <view class="reader-sheet reader-sheet--current" :style="currentSheetStyle">
                <image v-if="getPageSrc(currentSheetIndex)" class="reader-page-image"
                    :src="getPageSrc(currentSheetIndex)" mode="aspectFit" :fade-show="false" show-menu-by-longpress
                    @load="onImageLoad(currentSheetIndex)" />

                <view class="reader-page-shadow" :style="{ opacity: shadowOpacity }"></view>
            </view>

            <!-- 上一页翻入层 -->
            <view class="reader-sheet reader-sheet--prev" :style="prevSheetStyle">
                <image v-if="getPageSrc(prevSheetIndex)" class="reader-page-image" :src="getPageSrc(prevSheetIndex)"
                    mode="aspectFit" :fade-show="false" show-menu-by-longpress @load="onImageLoad(prevSheetIndex)" />

                <view class="reader-page-shadow" :style="{ opacity: shadowOpacity }"></view>
            </view>
        </view>

        <!-- 底部控制栏：保留 -->
        <view class="reader-control" v-show="toolbarVisible" :style="controlFloatStyle" @tap.stop>
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

        <!-- 隐藏预加载：减少翻页时图片白闪 -->
        <view class="reader-preload">
            <image v-for="src in preloadPages" :key="src" :src="src" mode="aspectFit" :fade-show="false" />
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import { useSafeArea } from '@/hooks/useSafeArea';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { HeaderMode } from '@/types/enums';

type ReaderQuery = Record<string, string | undefined>;
type TurnDirection = 'next' | 'prev' | '';
type ActiveTurnDirection = Exclude<TurnDirection, ''>;
type GestureDirection = 'horizontal' | 'vertical' | '';

type UniTouchEvent = {
    touches?: Array<{
        clientX: number;
        clientY: number;
    }>;
};

type UniSliderChangeEvent = {
    detail: {
        value: number;
    };
};

const MAX_ROTATE = 82;
const FINISH_THRESHOLD = 0.16;
const ANIMATION_DURATION = 420;
const DRAG_PROGRESS_SCALE = 1.28;
const PRELOAD_RANGE = 2;

const HEADER_TOP_GAP_RPX = 20;
const HEADER_HEIGHT_RPX = 88;
const CONTROL_BOTTOM_GAP_RPX = 18;
const CONTROL_HEIGHT_RPX = 92;
const READER_VISIBLE_GAP_RPX = 18;
const READER_HIDDEN_TOP_GAP_RPX = 0;
const READER_HIDDEN_BOTTOM_GAP_RPX = 0;

const { safeArea } = useSafeArea();

const title = ref('2026 第 10 期');

const imageBaseUrl = ref('https://www.qstheory.cn/ebooks/202610');
const pageCount = ref(12);
const ext = ref('jpg');
const pageStart = ref(0);
const issueId = ref('');

const current = ref(0);
const windowWidth = ref(375);

const toolbarVisible = ref(true);
const openingCatalog = ref(false);

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

const loadedMap = ref<Record<number, boolean>>({});
const preloadingSet = new Set<number>();

let flipTimer: ReturnType<typeof setTimeout> | null = null;

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
    if (turnDirection.value === 'next') return turnToIndex.value;
    if (turnDirection.value === 'prev') return current.value;
    return nextIndex.value;
});

const prevSheetIndex = computed(() => {
    if (turnDirection.value === 'prev') return turnToIndex.value;
    return prevIndex.value;
});

const progressPercent = computed(() => {
    if (!pages.value.length) return 0;
    return Math.round(((current.value + 1) / pages.value.length) * 100);
});

const preloadPages = computed(() => {
    const list: string[] = [];

    for (let offset = -PRELOAD_RANGE; offset <= PRELOAD_RANGE; offset += 1) {
        const src = getPageSrc(current.value + offset);

        if (src) {
            list.push(src);
        }
    }

    return list;
});

const shadowOpacity = computed(() => {
    if (!turnDirection.value) return '0';

    const value = Math.sin(turnProgress.value * Math.PI);
    return String(0.1 + value * 0.22);
});

const currentSheetStyle = computed(() => {
    if (turnDirection.value === 'next') {
        const progress = turnProgress.value;
        const rotate = -MAX_ROTATE * progress;
        const translateX = -18 * progress;
        const scale = 1 - 0.012 * progress;

        return {
            zIndex: 8,
            opacity: 1,
            transform: `translate3d(${translateX}rpx, 0, 0) rotateY(${rotate}deg) scale(${scale})`
        };
    }

    if (turnDirection.value === 'prev') {
        const progress = turnProgress.value;
        const scale = 0.992 + 0.008 * progress;

        return {
            zIndex: 4,
            opacity: 1,
            transform: `translate3d(0, 0, 0) scale(${scale})`
        };
    }

    return {
        zIndex: 5,
        opacity: 1,
        transform: 'translate3d(0, 0, 0) rotateY(0deg) scale(1)'
    };
});

const underSheetStyle = computed(() => {
    if (turnDirection.value === 'next') {
        const progress = turnProgress.value;
        const translateX = 20 * (1 - progress);
        const scale = 0.992 + 0.008 * progress;

        return {
            zIndex: 2,
            opacity: 1,
            transform: `translate3d(${translateX}rpx, 0, 0) scale(${scale})`
        };
    }

    if (turnDirection.value === 'prev') {
        return {
            zIndex: 1,
            opacity: 1,
            transform: 'translate3d(0, 0, 0) scale(1)'
        };
    }

    return {
        zIndex: 1,
        opacity: 0,
        transform: 'translate3d(0, 0, 0) scale(1)'
    };
});

const prevSheetStyle = computed(() => {
    if (turnDirection.value !== 'prev') {
        return {
            zIndex: 0,
            opacity: 0,
            transform: `translate3d(-20rpx, 0, 0) rotateY(${-MAX_ROTATE}deg) scale(0.992)`
        };
    }

    const progress = turnProgress.value;
    const rotate = -MAX_ROTATE + MAX_ROTATE * progress;
    const translateX = -20 + 20 * progress;
    const scale = 0.992 + 0.008 * progress;

    return {
        zIndex: 9,
        opacity: 1,
        transform: `translate3d(${translateX}rpx, 0, 0) rotateY(${rotate}deg) scale(${scale})`
    };
});

const headerTop = computed(() => {
    return safeArea.value.capsuleBottom + uni.upx2px(HEADER_TOP_GAP_RPX);
});

const controlBottom = computed(() => {
    return safeArea.value.bottomInset + uni.upx2px(CONTROL_BOTTOM_GAP_RPX);
});

const readerTop = computed(() => {
    if (!toolbarVisible.value) {
        return safeArea.value.headerHeight + uni.upx2px(READER_HIDDEN_TOP_GAP_RPX);
    }

    return headerTop.value + uni.upx2px(HEADER_HEIGHT_RPX + READER_VISIBLE_GAP_RPX);
});

const readerBottom = computed(() => {
    if (!toolbarVisible.value) {
        return safeArea.value.bottomInset + uni.upx2px(READER_HIDDEN_BOTTOM_GAP_RPX);
    }

    return controlBottom.value + uni.upx2px(CONTROL_HEIGHT_RPX + READER_VISIBLE_GAP_RPX);
});

const headerFloatStyle = computed(() => ({
    top: `${headerTop.value}px`
}));

const controlFloatStyle = computed(() => ({
    bottom: `${controlBottom.value}px`
}));

const readerBookStyle = computed(() => ({
    top: `${readerTop.value}px`,
    bottom: `${readerBottom.value}px`
}));

onLoad((query?: ReaderQuery) => {
    title.value = safeDecode(query?.title || '2026 第 10 期');

    imageBaseUrl.value = safeDecode(
        query?.imageBaseUrl || 'https://www.qstheory.cn/ebooks/202610'
    );

    pageCount.value = toNumber(query?.pageCount, 30);
    ext.value = safeDecode(query?.ext || 'jpg');
    issueId.value = safeDecode(query?.issueId || '');

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
    const systemInfo = uni.getSystemInfoSync();

    windowWidth.value = systemInfo.windowWidth || 375;

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

function getPageSrc(index: number) {
    if (index < 0 || index >= pages.value.length) return '';
    return pages.value[index] || '';
}

function onTouchStart(e: UniTouchEvent) {
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

function onTouchMove(e: UniTouchEvent) {
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
        turnProgress.value = clamp((absX / windowWidth.value) * DRAG_PROGRESS_SCALE, 0, 1);
        return;
    }

    if (dx > 0) {
        if (!beginTurn('prev')) return;
        turnProgress.value = clamp((dx / windowWidth.value) * DRAG_PROGRESS_SCALE, 0, 1);
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

function onSliderChange(e: UniSliderChangeEvent) {
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

function openCatalog() {
    if (openingCatalog.value) return;

    if (!issueId.value) {
        uni.showToast({
            title: '期刊信息不可用',
            icon: 'none'
        });
        return;
    }

    openingCatalog.value = true;

    uni.navigateTo({
        url: `/subPages/catalog/index?issueId=${encodeURIComponent(issueId.value)}`,
        fail: () => {
            uni.showToast({
                title: '打开目录失败',
                icon: 'none'
            });
        },
        complete: () => {
            setTimeout(() => {
                openingCatalog.value = false;
            }, 500);
        }
    });
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
    const src = getPageSrc(index);

    if (!src) return;
    if (loadedMap.value[index] || preloadingSet.has(index)) return;

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
.book-reader {
    position: relative;
    height: 100vh;
    min-height: 100vh;
    overflow: hidden;
    background: #fff;
    box-sizing: border-box;
}

.reader-header {
    position: absolute;
    left: 24rpx;
    right: 24rpx;
    z-index: 30;
    height: 88rpx;
    padding: 0 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.96);
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
    margin: 0;
    padding: 0 18rpx;
    border: none;
    border-radius: 999rpx;
    background: rgba(224, 62, 45, 0.1);
    color: #e03e2d;
    font-size: 23rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 54rpx;
}

.reader-page-pill::after {
    border: none;
}

.reader-page-pill__current {
    color: #e03e2d;
    font-size: 24rpx;
    font-weight: 700;
}

.reader-book {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
    overflow: hidden;
    background: #fff;
    perspective: 2200rpx;
    -webkit-perspective: 2200rpx;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    transition: top 0.24s ease, bottom 0.24s ease;
    box-sizing: border-box;
    transform: translate3d(0, 0, 0);
}

.reader-sheet {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    transform-origin: left center;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    pointer-events: none;
    will-change: transform;
    transform: translate3d(0, 0, 0);
}

.reader-book--animating .reader-sheet {
    transition: transform 0.42s cubic-bezier(0.18, 0.82, 0.2, 1);
}

.reader-page-image {
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.reader-page-shadow {
    position: absolute;
    z-index: 6;
    right: 0;
    top: 0;
    bottom: 0;
    width: 180rpx;
    background: linear-gradient(270deg,
            rgba(45, 14, 10, 0.2) 0%,
            rgba(45, 14, 10, 0.08) 42%,
            rgba(45, 14, 10, 0) 100%);
    pointer-events: none;
}

.reader-control {
    position: absolute;
    left: 24rpx;
    right: 24rpx;
    z-index: 30;
    padding: 14rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.96);
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
    background: linear-gradient(135deg, #ff6a58 0%, #e03e2d 100%);
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

.reader-preload {
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
}

.reader-preload image {
    width: 1px;
    height: 1px;
}
</style>