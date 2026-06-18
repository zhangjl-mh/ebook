<template>
  <view class="subscribe-page">
    <scroll-view class="subscribe-page__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
      :bounces="false">
      <view class="subscribe-page__scroll-inner">
        <QSSubPageHeader title="会员中心" />

        <view class="subscribe-page__content">
          <view class="product-card">
            <view class="product-card__cover">
              <image v-if="coverImage && !coverFailed" :src="coverImage" mode="aspectFit"
                class="product-card__cover-image" @error="markCoverFailed" />
              <view v-else class="product-card__cover-fallback">
                <text>求是</text>
              </view>
            </view>

            <view class="product-card__info">
              <view class="product-card__title-row">
                <text class="product-card__title">{{ config.productName }}</text>
                <text class="product-card__tag">{{ config.productTag }}</text>
              </view>
              <text class="product-card__desc">{{ config.description }}</text>
              <text v-if="currentIssueTitle" class="product-card__issue">{{ currentIssueTitle }}</text>
            </view>
          </view>

          <view class="subscribe-section">
            <view class="subscribe-section__title">
              <view class="subscribe-section__mark"></view>
              <text>选择订阅套餐</text>
            </view>

            <view v-if="!config.plans.length" class="subscribe-empty">暂无可选套餐</view>
            <view v-else class="plan-list">
              <view v-for="plan in config.plans" :key="plan.id" class="plan-card"
                :class="{ 'plan-card--active': selectedPlanId === plan.id }" @tap="selectPlan(plan.id)">
                <view class="plan-card__radio">
                  <text v-if="selectedPlanId === plan.id">✓</text>
                </view>
                <view class="plan-card__body">
                  <text class="plan-card__title">{{ plan.title }}</text>
                  <text class="plan-card__validity">{{ plan.validity }}</text>
                </view>
                <view class="plan-card__price">
                  <view class="plan-card__price-main">
                    <text>{{ plan.priceText }}</text>
                    <text v-if="plan.badge" class="plan-card__badge">{{ plan.badge }}</text>
                  </view>
                  <text class="plan-card__unit">{{ plan.unitText }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="subscribe-section">
            <view class="subscribe-section__title">
              <view class="subscribe-section__mark"></view>
              <text>会员权益</text>
            </view>

            <view v-if="!config.benefits.length" class="subscribe-empty">暂无会员权益</view>
            <view v-else class="benefit-panel">
              <view v-for="benefit in config.benefits" :key="benefit.id" class="benefit-item">
                <view class="benefit-item__icon" :class="`benefit-item__icon--${benefit.icon}`">
                  <view class="benefit-item__glyph"></view>
                </view>
                <text class="benefit-item__title">{{ benefit.title }}</text>
                <text class="benefit-item__desc">{{ benefit.desc }}</text>
              </view>
            </view>
          </view>

          <view class="subscribe-section">
            <view class="subscribe-section__title">
              <view class="subscribe-section__mark"></view>
              <text>支付方式</text>
            </view>

            <view class="payment-card">
              <view class="wechat-icon">
                <view class="wechat-icon__bubble wechat-icon__bubble--large"></view>
                <view class="wechat-icon__bubble wechat-icon__bubble--small"></view>
              </view>
              <text class="payment-card__title">{{ config.paymentMethod.title }}</text>
              <view class="payment-card__check">✓</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="subscribe-footer" :style="footerStyle">
      <view class="subscribe-footer__amount">
        <text>应付金额：</text>
        <text class="subscribe-footer__price">{{ selectedPlan?.priceText || '--' }}</text>
      </view>
      <button class="subscribe-footer__button" :disabled="isPaying || !selectedPlan" @tap="handlePay">
        {{ isPaying ? '支付中...' : '立即支付' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { subscriptionPaymentConfig } from '@/subPages/config/subscriptionPay';
import { useSafeArea } from '@/hooks/useSafeArea';
import { useMagazineStore } from '@/store/magazineStore';
import type { SubscriptionPlanId } from '@/types/subscription';

const config = subscriptionPaymentConfig;
const store = useMagazineStore();
const { safeArea } = useSafeArea();

const coverFailed = ref(false);
const isPaying = ref(false);
const selectedPlanId = ref<SubscriptionPlanId | ''>(config.plans[0]?.id || '');

const coverImage = computed(() => store.currentIssue?.coverImage || config.coverImage);
const currentIssueTitle = computed(() => store.currentIssue?.fullTitle || '');
const selectedPlan = computed(() => config.plans.find((plan) => plan.id === selectedPlanId.value));
const footerStyle = computed(() => ({
  paddingBottom: `${Math.max(safeArea.value.bottomInset, 12)}px`
}));

const markCoverFailed = () => {
  coverFailed.value = true;
};

const selectPlan = (planId: SubscriptionPlanId) => {
  if (!config.plans.some((plan) => plan.id === planId)) {
    uni.showToast({ title: '套餐不可用', icon: 'none' });
    return;
  }

  selectedPlanId.value = planId;
};

const handlePay = () => {
  if (isPaying.value) return;

  if (!selectedPlan.value) {
    uni.showToast({ title: '请选择套餐', icon: 'none' });
    return;
  }

  if (store.isSubscribed) {
    uni.showToast({ title: '已订阅', icon: 'none' });
    return;
  }

  isPaying.value = true;
  store.completeSubscription();

  setTimeout(() => {
    isPaying.value = false;
    uni.navigateBack({
      fail: () => {
        uni.switchTab({ url: '/pages/index/index' });
      }
    });
  }, 600);
};
</script>

<style lang="scss">
page {
  background: #f7f7f8;
}
</style>

<style lang="scss" scoped>
.subscribe-page {
  height: 100%;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(232, 24, 34, 0.06) 0, rgba(232, 24, 34, 0) 420rpx),
    #f7f7f8;
}

.subscribe-page__scroll {
  height: 100%;
  background:
    linear-gradient(180deg, rgba(232, 24, 34, 0.06) 0, rgba(232, 24, 34, 0) 420rpx),
    #f7f7f8;
}

.subscribe-page__scroll-inner {
  min-height: 100%;
  box-sizing: border-box;
}

.subscribe-page__content {
  position: relative;
  z-index: 2;
  margin-top: -92rpx;
  padding: 0 var(--qs-page-padding-x) 190rpx;
}

.product-card {
  display: flex;
  gap: 30rpx;
  padding: 30rpx;
  border-radius: var(--qs-radius-panel);
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-card);
  box-sizing: border-box;
}

.product-card__cover {
  display: flex;
  width: 178rpx;
  height: 238rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1rpx solid #f1d4d4;
  background: var(--qs-card-bg-warm);
}

.product-card__cover-image {
  width: 100%;
  height: 100%;
}

.product-card__cover-fallback {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--qs-color-primary);
  font-size: 34rpx;
  font-weight: 800;
}

.product-card__info {
  min-width: 0;
  flex: 1;
}

.product-card__title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14rpx;
}

.product-card__title {
  color: var(--qs-text-main);
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1.25;
}

.product-card__tag {
  padding: 5rpx 12rpx;
  border-radius: 8rpx;
  background: var(--qs-color-primary-light);
  color: #df1b25;
  font-size: 22rpx;
  font-weight: 700;
}

.product-card__desc {
  display: block;
  margin-top: 20rpx;
  color: #767b83;
  font-size: 25rpx;
  line-height: 1.55;
}

.product-card__issue {
  display: inline-flex;
  margin-top: 18rpx;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #fff5f5;
  color: var(--qs-color-primary);
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1.25;
}

.subscribe-section {
  margin-top: 38rpx;
}

.subscribe-section__title {
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: var(--qs-text-main);
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1.2;
}

.subscribe-section__mark {
  width: 8rpx;
  height: 34rpx;
  border-radius: 999rpx;
  background: var(--qs-color-primary-strong);
}

.subscribe-empty {
  margin-top: 24rpx;
  padding: 44rpx 0;
  border-radius: 18rpx;
  background: var(--qs-card-bg);
  color: var(--qs-text-placeholder);
  font-size: 26rpx;
  text-align: center;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  margin-top: 24rpx;
}

.plan-card {
  display: flex;
  align-items: center;
  min-height: 146rpx;
  padding: 28rpx 28rpx;
  border: 2rpx solid var(--qs-border-color);
  border-radius: 18rpx;
  background: var(--qs-card-bg);
  box-sizing: border-box;
}

.plan-card--active {
  border-color: var(--qs-color-primary-strong);
  background: linear-gradient(90deg, #fff8f8 0%, #fff 100%);
}

.plan-card__radio {
  display: flex;
  width: 42rpx;
  height: 42rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  border: 3rpx solid #d5d7dc;
  border-radius: 50%;
  color: #fff;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 1;
  box-sizing: border-box;
}

.plan-card--active .plan-card__radio {
  border-color: var(--qs-color-primary-strong);
  background: var(--qs-color-primary-strong);
}

.plan-card__body {
  min-width: 0;
  flex: 1;
}

.plan-card__title {
  display: block;
  color: #2b2e34;
  font-size: 31rpx;
  font-weight: 800;
  line-height: 1.25;
}

.plan-card__validity {
  display: block;
  margin-top: 12rpx;
  color: #898e96;
  font-size: 25rpx;
  line-height: 1.25;
}

.plan-card__price {
  flex-shrink: 0;
  margin-left: 22rpx;
  text-align: right;
}

.plan-card__price-main {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12rpx;
  color: var(--qs-color-primary-strong);
  font-size: 44rpx;
  font-weight: 800;
  line-height: 1.15;
}

.plan-card__badge {
  padding: 5rpx 10rpx;
  border-radius: 7rpx;
  background: var(--qs-color-primary-light);
  color: #df1b25;
  font-size: 21rpx;
  font-weight: 700;
}

.plan-card__unit {
  display: block;
  margin-top: 8rpx;
  color: #8d929a;
  font-size: 24rpx;
}

.benefit-panel {
  display: flex;
  gap: 14rpx;
  margin-top: 24rpx;
  padding: 26rpx 18rpx 24rpx;
  border-radius: 18rpx;
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-soft);
  box-sizing: border-box;
}

.benefit-item {
  min-width: 0;
  flex: 1;
  text-align: center;
}

.benefit-item__icon {
  position: relative;
  display: flex;
  width: 88rpx;
  height: 88rpx;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 50%;
  background: linear-gradient(180deg, #fff0f1 0%, #fbd7d9 100%);
  box-shadow: 0 10rpx 28rpx rgba(215, 25, 32, 0.08);
}

.benefit-item__glyph,
.benefit-item__glyph::before,
.benefit-item__glyph::after {
  position: absolute;
  content: '';
  box-sizing: border-box;
}

.benefit-item__icon--video .benefit-item__glyph {
  width: 44rpx;
  height: 30rpx;
  border-radius: 8rpx;
  background: #d71920;
}

.benefit-item__icon--video .benefit-item__glyph::after {
  left: 17rpx;
  top: 8rpx;
  width: 0;
  height: 0;
  border-top: 7rpx solid transparent;
  border-bottom: 7rpx solid transparent;
  border-left: 12rpx solid #fff;
}

.benefit-item__icon--notes .benefit-item__glyph {
  width: 34rpx;
  height: 42rpx;
  border: 4rpx solid #d71920;
  border-radius: 6rpx;
}

.benefit-item__icon--notes .benefit-item__glyph::before {
  left: 7rpx;
  top: 11rpx;
  width: 16rpx;
  height: 4rpx;
  border-radius: 999rpx;
  background: #d71920;
  box-shadow: 0 11rpx 0 #d71920;
}

.benefit-item__icon--audio .benefit-item__glyph {
  left: 23rpx;
  width: 16rpx;
  height: 24rpx;
  border-radius: 4rpx;
  background: #d71920;
}

.benefit-item__icon--audio .benefit-item__glyph::before {
  left: -14rpx;
  top: 5rpx;
  width: 0;
  height: 0;
  border-top: 9rpx solid transparent;
  border-bottom: 9rpx solid transparent;
  border-right: 16rpx solid #d71920;
}

.benefit-item__icon--audio .benefit-item__glyph::after {
  right: -15rpx;
  top: 1rpx;
  width: 14rpx;
  height: 22rpx;
  border: 4rpx solid #d71920;
  border-left: 0;
  border-radius: 0 18rpx 18rpx 0;
}

.benefit-item__icon--knowledge .benefit-item__glyph {
  width: 42rpx;
  height: 38rpx;
  border: 4rpx solid #d71920;
  border-radius: 8rpx;
}

.benefit-item__icon--knowledge .benefit-item__glyph::before {
  left: 6rpx;
  right: 6rpx;
  top: 10rpx;
  height: 4rpx;
  border-radius: 999rpx;
  background: #d71920;
  box-shadow: 0 11rpx 0 #d71920;
}

.benefit-item__icon--knowledge .benefit-item__glyph::after {
  right: -8rpx;
  bottom: -8rpx;
  width: 18rpx;
  height: 18rpx;
  border: 4rpx solid #d71920;
  border-radius: 50%;
  background: #fff0f1;
}

.benefit-item__title {
  display: block;
  margin-top: 16rpx;
  color: #2e3137;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1.35;
}

.benefit-item__desc {
  display: block;
  margin-top: 8rpx;
  color: #898e96;
  font-size: 22rpx;
  line-height: 1.35;
}

.payment-card {
  display: flex;
  align-items: center;
  min-height: 104rpx;
  margin-top: 24rpx;
  padding: 0 26rpx;
  border: 1rpx solid var(--qs-border-color);
  border-radius: 18rpx;
  background: var(--qs-card-bg);
  box-shadow: var(--qs-shadow-soft);
  box-sizing: border-box;
}

.wechat-icon {
  position: relative;
  width: 50rpx;
  height: 50rpx;
  flex-shrink: 0;
  margin-right: 22rpx;
  border-radius: 10rpx;
  background: linear-gradient(180deg, #20d261 0%, #0fba43 100%);
  box-shadow: 0 8rpx 18rpx rgba(15, 186, 67, 0.22);
}

.wechat-icon__bubble,
.wechat-icon__bubble::before {
  position: absolute;
  content: '';
  box-sizing: border-box;
}

.wechat-icon__bubble {
  border-radius: 50%;
  background: #fff;
}

.wechat-icon__bubble--large {
  left: 8rpx;
  top: 13rpx;
  width: 25rpx;
  height: 19rpx;
}

.wechat-icon__bubble--large::before {
  left: 7rpx;
  top: 7rpx;
  width: 4rpx;
  height: 4rpx;
  border-radius: 50%;
  background: #14bd49;
  box-shadow: 9rpx 0 0 #14bd49;
}

.wechat-icon__bubble--small {
  right: 7rpx;
  bottom: 12rpx;
  width: 23rpx;
  height: 17rpx;
}

.wechat-icon__bubble--small::before {
  left: 6rpx;
  top: 6rpx;
  width: 4rpx;
  height: 4rpx;
  border-radius: 50%;
  background: #14bd49;
  box-shadow: 8rpx 0 0 #14bd49;
}

.payment-card__title {
  min-width: 0;
  flex: 1;
  color: #30333a;
  font-size: 29rpx;
  line-height: 1.3;
}

.payment-card__check {
  display: flex;
  width: 42rpx;
  height: 42rpx;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--qs-color-primary-strong);
  color: #fff;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 1;
}

.subscribe-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8;
  display: flex;
  align-items: center;
  gap: 26rpx;
  padding: 22rpx 30rpx;
  border-top: 1rpx solid var(--qs-border-color);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 -10rpx 34rpx rgba(31, 34, 40, 0.06);
  box-sizing: border-box;
}

.subscribe-footer__amount {
  min-width: 0;
  flex: 1;
  color: var(--qs-text-regular);
  font-size: 27rpx;
  line-height: 1.3;
}

.subscribe-footer__price {
  margin-left: 8rpx;
  color: var(--qs-color-primary-strong);
  font-size: 40rpx;
  font-weight: 900;
}

.subscribe-footer__button {
  width: 288rpx;
  height: 86rpx;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #f52631 0%, #d80f19 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 86rpx;
  box-shadow: 0 14rpx 34rpx rgba(216, 15, 25, 0.22);
}

.subscribe-footer__button::after {
  border: none;
}

.subscribe-footer__button[disabled] {
  background: #c4c8cf;
  color: #fff;
  box-shadow: none;
}
</style>
