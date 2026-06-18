<template>
  <view class="paper-order-page">
    <view class="paper-order-header">
      <view class="paper-order-header__bar" :style="headerBarStyle">
        <button class="icon-button paper-order-header__back" aria-label="返回" @tap="goBack">
          <uni-icons type="left" size="25" color="#333333" />
        </button>
        <text class="paper-order-header__title">购买期刊</text>
      </view>

      <view class="paper-order-tabs">
        <button class="paper-order-tab paper-order-tab--active">商品</button>
        <button class="paper-order-tab" @tap="scrollToDetail">详情</button>
        <button class="icon-button paper-order-tabs__share" aria-label="分享" @tap="showShareTip">
          <uni-icons type="redo" size="23" color="#444444" />
        </button>
        <button class="icon-button paper-order-tabs__more" aria-label="更多" @tap="showMoreActions">
          <uni-icons type="more-filled" size="24" color="#444444" />
        </button>
      </view>
    </view>

    <scroll-view class="paper-order-scroll" :scroll-y="true" :enable-flex="true" :enhanced="true" :bounces="false"
      :scroll-into-view="scrollTarget">
      <view class="paper-order-content">
        <view class="product-cover-panel">
          <view class="product-cover-panel__image-wrap">
            <image v-if="!coverFailed" :src="product.coverImage" mode="aspectFit" class="product-cover-panel__image"
              @error="coverFailed = true" />
            <view v-else class="product-cover-panel__fallback">
              <text class="product-cover-panel__fallback-name">求是</text>
              <text>QIUSHI</text>
            </view>
          </view>
          <text class="product-cover-panel__count">1/{{ product.issueCount }}</text>
        </view>

        <view class="product-info-card">
          <view class="product-info-card__title-row">
            <text class="product-info-card__title">{{ product.name }}</text>
            <text v-for="tag in product.tags" :key="tag" class="product-info-card__tag">{{ tag }}</text>
          </view>
          <text class="product-info-card__description">{{ product.description }}</text>

          <view class="product-info-card__price-row">
            <view class="product-info-card__prices">
              <text>单价：<text class="product-info-card__price">￥{{ formatPrice(product.unitPrice) }}</text></text>
              <text>年价：<text class="product-info-card__price">￥{{ formatPrice(product.annualPrice) }}</text></text>
            </view>
            <button class="favorite-button" :class="{ 'favorite-button--active': isFavorite }" @tap="toggleFavorite">
              <uni-icons :type="isFavorite ? 'star-filled' : 'star'" size="22"
                :color="isFavorite ? '#ff5a52' : '#999999'" />
              <text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
            </button>
          </view>

          <view class="product-info-card__postal">
            <text>邮发代号：{{ product.postalCode }}</text>
          </view>
        </view>

        <button class="info-row" @tap="openSpecPanel">
          <text class="info-row__label">规格</text>
          <view class="info-row__value">
            <text>年度：{{ selectedYear }}，订阅选择：{{ selectedSubscriptionType }}</text>
            <uni-icons type="right" size="18" color="#777777" />
          </view>
        </button>

        <view id="paper-order-detail" class="merchant-card">
          <view class="merchant-card__row">
            <text class="merchant-card__label">商家信息</text>
            <view class="merchant-card__value">
              <text>{{ product.merchant }}</text>
              <uni-icons type="right" size="18" color="#777777" />
            </view>
          </view>
          <view class="merchant-card__divider"></view>
          <view class="merchant-card__row">
            <text class="merchant-card__label">配送说明</text>
            <text class="merchant-card__delivery">{{ product.deliveryText }}</text>
          </view>
        </view>

        <view class="detail-card">
          <text class="detail-card__title">商品详情</text>
          <text class="detail-card__text">
            权威理论期刊，全年共 24 期。下单时请选择订阅年度和订阅方式，具体寄送时间以订单信息为准。
          </text>
        </view>
      </view>
    </scroll-view>

    <view class="purchase-footer" :style="footerStyle">
      <view class="purchase-footer__tools">
        <button class="footer-tool" @tap="showShopTip">
          <uni-icons type="shop" size="23" color="#888888" />
          <text>店铺</text>
        </button>
        <button class="footer-tool" @tap="showServiceTip">
          <uni-icons type="chat" size="23" color="#888888" />
          <text>客服</text>
        </button>
        <button class="footer-tool footer-tool--cart" @tap="showCartTip">
          <uni-icons type="cart" size="23" color="#888888" />
          <text>购物车</text>
          <text v-if="cartCount" class="footer-tool__badge">{{ cartCount }}</text>
        </button>
      </view>
      <button class="purchase-footer__action purchase-footer__action--cart" :disabled="actionPending"
        @tap="addToCart">
        加入购物车
      </button>
      <button class="purchase-footer__action purchase-footer__action--buy" :disabled="actionPending"
        @tap="buyNow">
        立即购买
      </button>
    </view>

    <view v-if="showSpecPanel" class="spec-mask" @tap="closeSpecPanel">
      <view class="spec-panel" :style="specPanelStyle" @tap.stop>
        <view class="spec-panel__head">
          <text class="spec-panel__title">选择规格</text>
          <button class="icon-button" aria-label="关闭" @tap="closeSpecPanel">
            <uni-icons type="closeempty" size="24" color="#555555" />
          </button>
        </view>

        <text class="spec-panel__label">订阅年度</text>
        <view class="spec-panel__options">
          <button v-for="year in availableYears" :key="year" class="spec-option"
            :class="{ 'spec-option--active': selectedYear === year }" @tap="selectedYear = year">
            {{ year }}
          </button>
        </view>

        <text class="spec-panel__label">订阅方式</text>
        <view class="spec-panel__options">
          <button v-for="type in availableSubscriptionTypes" :key="type" class="spec-option"
            :class="{ 'spec-option--active': selectedSubscriptionType === type }"
            @tap="selectedSubscriptionType = type">
            {{ type }}
          </button>
        </view>

        <button class="spec-panel__confirm" @tap="confirmSpec">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSafeArea } from '@/hooks/useSafeArea';
import { paperOrderProduct } from '@/subPages/config/paperOrder';

const product = paperOrderProduct;
const { safeArea } = useSafeArea();

const availableYears = ['2026', '2027'];
const availableSubscriptionTypes = ['自选定期', '全年订阅'];

const selectedYear = ref(product.year);
const selectedSubscriptionType = ref(product.subscriptionType);
const coverFailed = ref(false);
const isFavorite = ref(false);
const cartCount = ref(0);
const actionPending = ref(false);
const showSpecPanel = ref(false);
const scrollTarget = ref('');

const headerBarStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`,
  marginTop: `${safeArea.value.capsuleTop}px`
}));

const footerStyle = computed(() => ({
  paddingBottom: `${Math.max(safeArea.value.bottomInset, 8)}px`
}));

const specPanelStyle = computed(() => ({
  paddingBottom: `${Math.max(safeArea.value.bottomInset, 18)}px`
}));

const formatPrice = (price: number) => price.toFixed(2);

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({ url: '/pages/index/index' });
};

const showShareTip = () => {
  uni.showToast({ title: '请使用右上角菜单分享', icon: 'none' });
};

const showMoreActions = () => {
  uni.showActionSheet({
    itemList: ['查看订单', '联系商家'],
    success: ({ tapIndex }) => {
      uni.showToast({
        title: tapIndex === 0 ? '暂无相关订单' : '请通过客服咨询',
        icon: 'none'
      });
    }
  });
};

const scrollToDetail = () => {
  scrollTarget.value = '';
  setTimeout(() => {
    scrollTarget.value = 'paper-order-detail';
  });
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  uni.showToast({
    title: isFavorite.value ? '收藏成功' : '已取消收藏',
    icon: 'none'
  });
};

const openSpecPanel = () => {
  showSpecPanel.value = true;
};

const closeSpecPanel = () => {
  showSpecPanel.value = false;
};

const confirmSpec = () => {
  closeSpecPanel();
  uni.showToast({ title: '规格已更新', icon: 'none' });
};

const showShopTip = () => {
  uni.showToast({ title: product.merchant, icon: 'none' });
};

const showServiceTip = () => {
  uni.showToast({ title: '客服功能建设中', icon: 'none' });
};

const showCartTip = () => {
  uni.showToast({
    title: cartCount.value ? `购物车中有 ${cartCount.value} 件商品` : '购物车为空',
    icon: 'none'
  });
};

const addToCart = () => {
  if (actionPending.value) return;

  actionPending.value = true;
  cartCount.value += 1;
  uni.showToast({ title: '已加入购物车', icon: 'success' });

  setTimeout(() => {
    actionPending.value = false;
  }, 500);
};

const buyNow = () => {
  if (actionPending.value) return;

  actionPending.value = true;
  uni.showModal({
    title: '确认购买',
    content: `${selectedYear.value} 年 · ${selectedSubscriptionType.value}\n合计 ￥${formatPrice(product.annualPrice)}`,
    confirmText: '确认',
    success: ({ confirm }) => {
      if (confirm) {
        uni.showToast({ title: '订单已提交', icon: 'success' });
      }
    },
    complete: () => {
      actionPending.value = false;
    }
  });
};
</script>

<style lang="scss">
page {
  background: #f5f5f7;
}
</style>

<style lang="scss" scoped>
.paper-order-page {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #f5f5f7;
}

.paper-order-header {
  position: relative;
  z-index: 20;
  border-bottom: 1rpx solid #ececec;
  background: #fff;
}

.paper-order-header__bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28rpx;
}

.paper-order-header__back {
  position: absolute;
  left: 0;
}

.paper-order-header__title {
  color: #222;
  font-size: 30rpx;
  line-height: 1;
}

.icon-button {
  display: flex;
  width: 64rpx;
  height: 64rpx;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  line-height: 1;

  &::after {
    border: none;
  }
}

.paper-order-tabs {
  position: relative;
  display: flex;
  height: 72rpx;
  align-items: stretch;
  padding: 0 146rpx 0 100rpx;
}

.paper-order-tab {
  position: relative;
  width: 50%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #888;
  font-size: 28rpx;
  line-height: 72rpx;

  &::after {
    border: none;
  }
}

.paper-order-tab--active {
  color: #333;
  font-weight: 700;

  &::before {
    position: absolute;
    bottom: 3rpx;
    left: 50%;
    width: 26rpx;
    height: 7rpx;
    border-radius: 999rpx;
    background: #12b76a;
    content: '';
    transform: translateX(-50%);
  }
}

.paper-order-tabs__share,
.paper-order-tabs__more {
  position: absolute;
  top: 4rpx;
}

.paper-order-tabs__share {
  right: 72rpx;
}

.paper-order-tabs__more {
  right: 12rpx;
}

.paper-order-scroll {
  height: calc(100% - 116rpx - var(--status-bar-height));
  background: #f5f5f7;
}

.paper-order-content {
  min-height: 100%;
  padding: 0 20rpx 210rpx;
  box-sizing: border-box;
}

.product-cover-panel {
  position: relative;
  display: flex;
  height: 760rpx;
  align-items: center;
  justify-content: center;
  margin: 0 -20rpx;
  background: #f3f3f5;
}

.product-cover-panel__image-wrap {
  width: 562rpx;
  height: 750rpx;
}

.product-cover-panel__image {
  width: 100%;
  height: 100%;
}

.product-cover-panel__fallback {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 18rpx solid #e71919;
  background: #fff;
  color: #454545;
  font-size: 54rpx;
  font-weight: 700;
  box-sizing: border-box;
}

.product-cover-panel__fallback-name {
  margin-bottom: 20rpx;
  color: #e71919;
  font-size: 112rpx;
}

.product-cover-panel__count {
  position: absolute;
  right: 22rpx;
  bottom: 28rpx;
  padding: 8rpx 12rpx;
  border-radius: 8rpx;
  background: rgba(255, 255, 255, 0.76);
  color: #777;
  font-size: 23rpx;
}

.product-info-card,
.merchant-card,
.detail-card {
  margin-top: 18rpx;
  border-radius: 16rpx;
  background: #fff;
}

.product-info-card {
  padding: 26rpx 24rpx 20rpx;
}

.product-info-card__title-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.product-info-card__title {
  margin-right: 4rpx;
  color: #272727;
  font-size: 32rpx;
  font-weight: 700;
}

.product-info-card__tag {
  padding: 4rpx 9rpx;
  border-radius: 5rpx;
  background: #e9f8f0;
  color: #1fa96a;
  font-size: 22rpx;
  line-height: 1.2;
}

.product-info-card__tag + .product-info-card__tag {
  background: #e7f1f6;
  color: #77a8bb;
}

.product-info-card__description {
  display: block;
  margin-top: 14rpx;
  color: #999;
  font-size: 23rpx;
  line-height: 1.65;
}

.product-info-card__price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14rpx;
}

.product-info-card__prices {
  display: flex;
  flex-direction: column;
  gap: 7rpx;
  color: #555;
  font-size: 25rpx;
}

.product-info-card__price {
  color: #ff6e67;
}

.favorite-button {
  display: flex;
  width: 76rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rpx;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #888;
  font-size: 20rpx;
  line-height: 1.2;

  &::after {
    border: none;
  }
}

.favorite-button--active {
  color: #ff5a52;
}

.product-info-card__postal {
  margin-top: 16rpx;
  padding-top: 17rpx;
  border-top: 1rpx solid #eeeeee;
  color: #888;
  font-size: 24rpx;
}

.info-row {
  display: flex;
  width: 100%;
  min-height: 82rpx;
  align-items: center;
  justify-content: space-between;
  margin: 18rpx 0 0;
  padding: 0 24rpx;
  border: none;
  border-radius: 16rpx;
  background: #fff;
  color: #333;
  line-height: 1.4;
  text-align: left;

  &::after {
    border: none;
  }
}

.info-row__label,
.merchant-card__label {
  flex-shrink: 0;
  color: #999;
  font-size: 24rpx;
}

.info-row__value,
.merchant-card__value {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8rpx;
  color: #444;
  font-size: 24rpx;
}

.merchant-card {
  padding: 0 24rpx;
}

.merchant-card__row {
  display: flex;
  min-height: 82rpx;
  align-items: center;
  justify-content: space-between;
  gap: 30rpx;
}

.merchant-card__divider {
  height: 1rpx;
  background: #eeeeee;
}

.merchant-card__delivery {
  color: #666;
  font-size: 23rpx;
  text-align: right;
}

.detail-card {
  padding: 26rpx 24rpx 34rpx;
}

.detail-card__title {
  display: block;
  color: #333;
  font-size: 28rpx;
  font-weight: 700;
}

.detail-card__text {
  display: block;
  margin-top: 16rpx;
  color: #777;
  font-size: 24rpx;
  line-height: 1.7;
}

.purchase-footer {
  position: absolute;
  z-index: 30;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  min-height: 112rpx;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 20rpx;
  border-top: 1rpx solid #ededed;
  background: #fff;
  box-shadow: 0 -8rpx 24rpx rgba(0, 0, 0, 0.04);
}

.purchase-footer__tools {
  display: flex;
  width: 260rpx;
  flex-shrink: 0;
  justify-content: space-between;
}

.footer-tool {
  position: relative;
  display: flex;
  width: 78rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rpx;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #888;
  font-size: 20rpx;
  line-height: 1.2;

  &::after {
    border: none;
  }
}

.footer-tool__badge {
  position: absolute;
  top: -5rpx;
  right: 4rpx;
  min-width: 28rpx;
  height: 28rpx;
  padding: 0 6rpx;
  border: 2rpx solid #fff;
  border-radius: 999rpx;
  background: #ff554d;
  color: #fff;
  font-size: 18rpx;
  line-height: 24rpx;
  text-align: center;
}

.purchase-footer__action {
  height: 72rpx;
  flex: 1;
  margin: 0;
  padding: 0 10rpx;
  border: none;
  border-radius: 999rpx;
  color: #fff;
  font-size: 25rpx;
  line-height: 72rpx;

  &::after {
    border: none;
  }
}

.purchase-footer__action--cart {
  background: #ff9a3d;
}

.purchase-footer__action--buy {
  background: #ff5650;
}

.purchase-footer__action[disabled] {
  opacity: 0.65;
}

.spec-mask {
  position: absolute;
  z-index: 50;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.42);
}

.spec-panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 28rpx 30rpx;
  border-radius: 26rpx 26rpx 0 0;
  background: #fff;
}

.spec-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.spec-panel__title {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
}

.spec-panel__label {
  display: block;
  margin-top: 26rpx;
  color: #555;
  font-size: 25rpx;
}

.spec-panel__options {
  display: flex;
  gap: 18rpx;
  margin-top: 16rpx;
}

.spec-option {
  height: 64rpx;
  min-width: 150rpx;
  margin: 0;
  padding: 0 24rpx;
  border: 1rpx solid #e7e7e7;
  border-radius: 12rpx;
  background: #f7f7f7;
  color: #555;
  font-size: 24rpx;
  line-height: 64rpx;

  &::after {
    border: none;
  }
}

.spec-option--active {
  border-color: #ff5a52;
  background: #fff1f0;
  color: #e43c35;
}

.spec-panel__confirm {
  height: 78rpx;
  margin: 38rpx 0 0;
  padding: 0;
  border: none;
  border-radius: 999rpx;
  background: #ff5650;
  color: #fff;
  font-size: 27rpx;
  line-height: 78rpx;

  &::after {
    border: none;
  }
}
</style>
