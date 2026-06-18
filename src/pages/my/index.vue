<template>
  <view class="my-page qs-page">
    <view class="my-page__header" :style="headerStyle">
      <text>我的</text>
    </view>

    <scroll-view class="my-page__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true" :bounces="false">
      <view class="my-page__content">
        <view class="profile-card">
          <view class="profile-card__avatar">
            <uni-icons type="person-filled" size="34" color="#ffffff" />
          </view>
          <view class="profile-card__info">
            <text class="profile-card__name">{{ profileInfo.name }}</text>
            <text class="profile-card__slogan">{{ profileInfo.badges[0]?.text }}</text>
            <text class="profile-card__member">{{ profileInfo.badges[1]?.text }}</text>
          </view>
          <uni-icons type="right" size="18" color="#999999" />
        </view>

        <view class="member-card">
          <view class="member-card__icon">
            <uni-icons type="vip-filled" size="26" color="#d71920" />
          </view>
          <view class="member-card__body">
            <text class="member-card__title">{{ memberBanner.title }}</text>
            <text class="member-card__desc">{{ memberBanner.desc }}</text>
          </view>
          <button class="member-card__button" @tap="openMemberCenter">{{ memberBanner.buttonText }}</button>
        </view>

        <view class="content-panel">
          <text class="section-title">我的内容</text>
          <view class="action-grid">
            <button v-for="action in profileContentActions" :key="action.type" class="action-item"
              @tap="openFeature(action.type)">
              <view class="action-item__icon">
                <uni-icons :type="action.icon" size="24" color="#333333" />
              </view>
              <text>{{ action.label }}</text>
            </button>
          </view>
        </view>

        <button class="ai-entry" @tap="openFeature(ProfileFeatureType.Ai)">
          <view class="ai-entry__mark">AI</view>
          <view class="ai-entry__body">
            <text class="ai-entry__title">AI速读，聊天回答</text>
            <text class="ai-entry__desc">理论学习智能助手</text>
          </view>
          <uni-icons type="right" size="18" color="#999999" />
        </button>

        <view class="service-panel">
          <button class="service-row" @tap="openFeature(ProfileFeatureType.Service)">
            <uni-icons type="chat" size="22" color="#333333" />
            <text>联系客服</text>
            <uni-icons type="right" size="18" color="#999999" />
          </button>
          <button class="service-row" @tap="openFeature(ProfileFeatureType.Help)">
            <uni-icons type="help" size="22" color="#333333" />
            <text>帮助中心</text>
            <uni-icons type="right" size="18" color="#999999" />
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { memberBanner, profileContentActions, profileInfo } from '@/config/userCenter';
import { useSafeArea } from '@/hooks/useSafeArea';
import { ProfileFeatureType } from '@/types/enums';
import type { ProfileFeatureType as ProfileFeatureTypeValue } from '@/types/enums';

const { safeArea } = useSafeArea();
const openingPath = ref('');

const headerStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));

const navigateOnce = (url: string) => {
  if (openingPath.value) return;

  openingPath.value = url;
  uni.navigateTo({
    url,
    fail: () => {
      uni.showToast({ title: '页面打开失败', icon: 'none' });
    },
    complete: () => {
      setTimeout(() => {
        if (openingPath.value === url) openingPath.value = '';
      }, 500);
    }
  });
};

const openMemberCenter = () => {
  navigateOnce('/subPages/subscribe/index');
};

const openFeature = (type: ProfileFeatureTypeValue) => {
  navigateOnce(`/subPages/profile-feature/index?type=${encodeURIComponent(type)}`);
};
</script>

<style lang="scss">
page {
  background: #f4f4f5;
}
</style>

<style lang="scss" scoped>
.my-page {
  height: 100%;
  overflow: hidden;
  background: #f4f4f5;
}

.my-page__header {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #eeeeee;
  background: #fff;
  box-sizing: border-box;
  color: #111;
  font-size: 30rpx;
  font-weight: 600;
}

.my-page__scroll {
  height: calc(100% - 88rpx);
}

.my-page__content {
  padding: 20rpx 20rpx var(--qs-tabbar-bottom-space);
}

.profile-card,
.member-card,
.content-panel,
.ai-entry,
.service-panel {
  margin-bottom: 18rpx;
  border-radius: 8rpx;
  background: #fff;
}

.profile-card {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
}

.profile-card__avatar {
  display: flex;
  width: 94rpx;
  height: 94rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #b9bdc2;
}

.profile-card__info {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin-left: 22rpx;
}

.profile-card__name {
  color: #222;
  font-size: 32rpx;
  font-weight: 700;
}

.profile-card__slogan {
  margin-top: 8rpx;
  color: #888;
  font-size: 22rpx;
}

.profile-card__member {
  align-self: flex-start;
  margin-top: 10rpx;
  padding: 5rpx 12rpx;
  border-radius: 4rpx;
  background: #fff0ef;
  color: #d71920;
  font-size: 20rpx;
}

.member-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #fff2f1;
}

.member-card__icon {
  display: flex;
  width: 64rpx;
  height: 64rpx;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
}

.member-card__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin-left: 18rpx;
}

.member-card__title {
  color: #5d1717;
  font-size: 27rpx;
  font-weight: 700;
}

.member-card__desc {
  margin-top: 6rpx;
  color: #a26565;
  font-size: 21rpx;
}

.member-card__button {
  height: 54rpx;
  margin: 0;
  padding: 0 20rpx;
  border: none;
  border-radius: 27rpx;
  background: #d71920;
  color: #fff;
  font-size: 22rpx;
  line-height: 54rpx;

  &::after {
    border: none;
  }
}

.content-panel {
  padding: 24rpx 12rpx 12rpx;
}

.section-title {
  display: block;
  padding: 0 12rpx 18rpx;
  color: #222;
  font-size: 28rpx;
  font-weight: 700;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.action-item {
  display: flex;
  height: 132rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #555;
  font-size: 22rpx;
  line-height: 1;

  &::after {
    border: none;
  }
}

.action-item__icon {
  display: flex;
  width: 54rpx;
  height: 54rpx;
  align-items: center;
  justify-content: center;
}

.ai-entry {
  display: flex;
  width: 100%;
  align-items: center;
  margin-left: 0;
  margin-right: 0;
  padding: 24rpx;
  border: none;
  box-sizing: border-box;
  text-align: left;

  &::after {
    border: none;
  }
}

.ai-entry__mark {
  display: flex;
  width: 64rpx;
  height: 64rpx;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #d71920;
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.ai-entry__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  margin-left: 18rpx;
}

.ai-entry__title {
  color: #222;
  font-size: 27rpx;
  font-weight: 700;
}

.ai-entry__desc {
  margin-top: 5rpx;
  color: #999;
  font-size: 21rpx;
}

.service-panel {
  overflow: hidden;
}

.service-row {
  display: flex;
  width: 100%;
  height: 94rpx;
  align-items: center;
  gap: 18rpx;
  margin: 0;
  padding: 0 24rpx;
  border: none;
  border-bottom: 1rpx solid #eeeeee;
  border-radius: 0;
  background: #fff;
  color: #333;
  font-size: 26rpx;
  text-align: left;

  &::after {
    border: none;
  }
}

.service-row:last-child {
  border-bottom: none;
}

.service-row text {
  min-width: 0;
  flex: 1;
}
</style>
