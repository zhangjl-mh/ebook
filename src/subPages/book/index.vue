<template>
    <view class="book-reader">
        <!-- 顶部悬浮栏 -->
        <view class="reader-header" v-show="toolbarVisible">
            <view class="reader-header__main">
                <text class="reader-title">{{ title }}</text>
                <text class="reader-desc">左右滑动翻页</text>
            </view>

            <view class="reader-page-pill">
                <text class="reader-page-pill__current">{{ current + 1 }}</text>
                <text class="reader-page-pill__split">/</text>
                <text>{{ pages.length }}</text>
            </view>
        </view>

        <!-- 翻页主体 -->
        <swiper class="reader-swiper" :style="{ height: swiperHeight + 'px' }" :current="current" :duration="460"
            :circular="false" :indicator-dots="false" previous-margin="0rpx" next-margin="0rpx"
            easing-function="easeOutCubic" @change="onSwiperChange">
            <swiper-item v-for="(page, index) in pages" :key="page" class="reader-swiper-item">
                <view class="book-page" :class="getPageClass(index)" @tap="toggleToolbar">
                    <view class="book-page__paper">
                        <image class="book-page__image" :src="page" mode="aspectFit" lazy-load show-menu-by-longpress
                            @error="onImageError(index)" />

                        <!-- 翻页光影 -->
                        <view class="book-page__spine"></view>
                        <view class="book-page__turn-shadow"></view>
                        <view class="book-page__right-curl"></view>
                        <view class="book-page__shine"></view>

                        <view v-if="failedMap[index]" class="page-error">
                            <text class="page-error__title">图片加载失败</text>
                            <text class="page-error__text">
                                /static/book10/{{ index + 1 }}.png
                            </text>
                        </view>
                    </view>
                </view>
            </swiper-item>
        </swiper>

        <!-- 底部控制栏 -->
        <view class="reader-control" v-show="toolbarVisible">
            <button class="reader-control__btn" :disabled="current <= 0"
                :class="{ 'reader-control__btn--disabled': current <= 0 }" @tap="prevPage">
                上一页
            </button>

            <view class="reader-control__center">
                <slider class="reader-slider" :min="1" :max="pages.length" :value="current + 1" :block-size="16"
                    activeColor="#e03e2d" backgroundColor="rgba(224, 62, 45, 0.18)" @change="onSliderChange" />
                <text class="reader-progress">{{ progressPercent }}%</text>
            </view>

            <button class="reader-control__btn reader-control__btn--primary" :disabled="current >= pages.length - 1"
                :class="{ 'reader-control__btn--disabled': current >= pages.length - 1 }" @tap="nextPage">
                下一页
            </button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';

type ReaderQuery = Record<string, string | undefined>;

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
const bookDir = ref('book10');
const pageCount = ref(12);
const ext = ref('png');

const current = ref(0);
const swiperHeight = ref(700);
const toolbarVisible = ref(true);
const failedMap = ref<Record<number, boolean>>({});

const turning = ref(false);
const turnDirection = ref<'next' | 'prev' | ''>('');

const pages = computed(() => {
    return Array.from({ length: pageCount.value }, (_, index) => {
        return `/static/${bookDir.value}/${index + 1}.${ext.value}`;
    });
});

const progressPercent = computed(() => {
    if (!pages.value.length) return 0;
    return Math.round(((current.value + 1) / pages.value.length) * 100);
});

onLoad((query?: ReaderQuery) => {
    title.value = safeDecode(query?.title || '2026 第 10 期');
    bookDir.value = safeDecode(query?.bookDir || 'book10');
    pageCount.value = toNumber(query?.pageCount, 12);
    ext.value = safeDecode(query?.ext || 'png');

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

    /**
     * 让图片区域尽量撑满屏幕。
     * 顶部和底部控制栏都是悬浮的，不再挤压图片主体。
     */
    swiperHeight.value = systemInfo.windowHeight;
}

function onSwiperChange(e: any) {
    const nextIndex = e.detail.current;
    turnDirection.value = nextIndex > current.value ? 'next' : 'prev';
    current.value = nextIndex;

    turning.value = true;
    setTimeout(() => {
        turning.value = false;
        turnDirection.value = '';
    }, 420);
}

function onSliderChange(e: any) {
    const page = Number(e.detail.value);
    const nextIndex = clamp(page - 1, 0, pages.value.length - 1);

    turnDirection.value = nextIndex > current.value ? 'next' : 'prev';
    current.value = nextIndex;

    turning.value = true;
    setTimeout(() => {
        turning.value = false;
        turnDirection.value = '';
    }, 420);
}

function prevPage() {
    if (current.value <= 0) return;

    turnDirection.value = 'prev';
    current.value -= 1;

    turning.value = true;
    setTimeout(() => {
        turning.value = false;
        turnDirection.value = '';
    }, 420);
}

function nextPage() {
    if (current.value >= pages.value.length - 1) return;

    turnDirection.value = 'next';
    current.value += 1;

    turning.value = true;
    setTimeout(() => {
        turning.value = false;
        turnDirection.value = '';
    }, 420);
}

function toggleToolbar() {
    toolbarVisible.value = !toolbarVisible.value;
}

function onImageError(index: number) {
    failedMap.value = {
        ...failedMap.value,
        [index]: true
    };
}

function getPageClass(index: number) {
    return {
        'book-page--active': index === current.value,
        'book-page--prev': index === current.value - 1,
        'book-page--next': index === current.value + 1,
        'book-page--turn-next': turning.value && index === current.value && turnDirection.value === 'next',
        'book-page--turn-prev': turning.value && index === current.value && turnDirection.value === 'prev'
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
        radial-gradient(circle at 50% -10%, rgba(224, 62, 45, 0.16) 0, rgba(224, 62, 45, 0) 42%),
        linear-gradient(180deg, #fff5f1 0%, #f8e8e2 42%, #f6f1ee 100%);
    box-sizing: border-box;
}

/* 顶部悬浮栏 */
.reader-header {
    position: fixed;
    left: 24rpx;
    right: 24rpx;
    top: 24rpx;
    z-index: 20;
    height: 88rpx;
    padding: 0 24rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.82);
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

/* swiper 区域 */
.reader-swiper {
    position: relative;
    z-index: 2;
    width: 100%;
}

.reader-swiper-item {
    box-sizing: border-box;
}

/* 页面主体：不再有边框，不再有外卡片 */
.book-page {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    perspective: 1800rpx;
    transform-style: preserve-3d;
    overflow: hidden;
}

/* 这一层只负责承载图片和翻页光影 */
.book-page__paper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    /*
     * 只保留右侧上下圆角。
     * 左侧保持直边，更像书页装订侧。
     */
    border-radius: 0 26rpx 26rpx 0;
    background: transparent;
    transform-origin: left center;
    transition:
        transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.42s ease,
        filter 0.42s ease;
}

/* 图片撑满宽度，没有边框 */
.book-page__image {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    border-radius: 0 26rpx 26rpx 0;
}

/* 当前页 */
.book-page--active .book-page__paper {
    transform: rotateY(0deg) scale(1);
    box-shadow:
        0 28rpx 70rpx rgba(111, 37, 28, 0.16),
        0 8rpx 22rpx rgba(111, 37, 28, 0.08);
}

/* 上一页：像已经翻过去 */
.book-page--prev .book-page__paper {
    transform-origin: right center;
    transform: translateX(-18rpx) scale(0.985) rotateY(8deg);
    filter: brightness(0.94);
}

/* 下一页：右侧待翻页 */
.book-page--next .book-page__paper {
    transform-origin: left center;
    transform: translateX(18rpx) scale(0.985) rotateY(-8deg);
    filter: brightness(0.96);
}

/* 正在向后翻 */
.book-page--turn-next .book-page__paper {
    transform-origin: left center;
    transform: rotateY(-7deg) scale(0.995);
}

/* 正在向前翻 */
.book-page--turn-prev .book-page__paper {
    transform-origin: right center;
    transform: rotateY(7deg) scale(0.995);
}

/* 左侧轻微装订阴影 */
.book-page__spine {
    position: absolute;
    z-index: 5;
    left: 0;
    top: 0;
    bottom: 0;
    width: 42rpx;
    background: linear-gradient(90deg,
            rgba(48, 20, 14, 0.16) 0%,
            rgba(48, 20, 14, 0.07) 34%,
            rgba(255, 255, 255, 0.12) 70%,
            rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
}

/* 翻页时右侧阴影 */
.book-page__turn-shadow {
    position: absolute;
    z-index: 6;
    right: 0;
    top: 0;
    bottom: 0;
    width: 120rpx;
    background: linear-gradient(270deg,
            rgba(45, 14, 10, 0.24) 0%,
            rgba(45, 14, 10, 0.1) 38%,
            rgba(45, 14, 10, 0) 100%);
    opacity: 0.24;
    pointer-events: none;
    transition: opacity 0.32s ease;
}

/* 右下角轻微卷页感 */
.book-page__right-curl {
    position: absolute;
    z-index: 7;
    right: 0;
    bottom: 0;
    width: 116rpx;
    height: 116rpx;
    border-bottom-right-radius: 26rpx;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 44%,
            rgba(224, 62, 45, 0.08) 45%,
            rgba(224, 62, 45, 0.2) 100%);
    opacity: 0.55;
    pointer-events: none;
}

/* 页面高光 */
.book-page__shine {
    position: absolute;
    z-index: 8;
    inset: 0;
    border-radius: 0 26rpx 26rpx 0;
    background:
        linear-gradient(108deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.08) 24%,
            rgba(255, 255, 255, 0) 48%),
        linear-gradient(180deg,
            rgba(255, 255, 255, 0.18),
            rgba(255, 255, 255, 0) 18%);
    pointer-events: none;
}

/* 翻页中强化阴影 */
.book-page--turn-next .book-page__turn-shadow,
.book-page--turn-prev .book-page__turn-shadow {
    opacity: 0.46;
}

/* 图片错误 */
.page-error {
    position: absolute;
    z-index: 30;
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
    z-index: 20;
    padding: 14rpx;
    border-radius: 999rpx;
    background: rgba(255, 255, 255, 0.84);
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