<template>
  <view class="feature-page" :class="{ 'feature-page--ai': isAiPage }">
    <view v-if="isAiPage" class="ai-header" :style="aiHeaderStyle">
      <button class="ai-header__back" :style="aiBackStyle" @tap="goBack">
        <uni-icons type="left" size="24" color="#555555" />
      </button>
      <text>会员中心</text>
    </view>
    <QSSubPageHeader v-else :title="pageTitle" v-model:mode="headerMode" />

    <template v-if="isAiPage">
      <scroll-view class="feature-page__scroll feature-page__scroll--with-input" :scroll-y="true" :enable-flex="true"
        :enhanced="true" :bounces="false">
        <view class="ai-page">
          <view class="ai-page__hero">
            <view class="ai-page__brand">
              <image src="/static/media/assistant-bot.png" mode="aspectFit" />
              <text>AI小是</text>
            </view>
            <view class="ai-page__intro">
              <text>HI～</text>
              <text>我是求是伴读小助手，您可以像我提问，一起变得更智慧～</text>
              <text>我可以帮助你做如下事项：</text>
              <text>1、聊天问答：围绕党的创新理论进行提问，我来进行精准回答。</text>
              <text>2、AI速读：选择一篇文章，快速获取文章摘要。</text>
            </view>
          </view>

          <view v-if="messages.length" class="chat-list">
            <view v-for="message in messages" :key="message.id" class="chat-message"
              :class="`chat-message--${message.role}`">
              <text>{{ message.text }}</text>
            </view>
          </view>

          <view class="question-panel">
            <text class="question-panel__title">精选问题</text>
            <button v-for="question in aiSuggestedQuestions" :key="question" class="question-item"
              @tap="askQuestion(question)">
              <text>{{ question }}</text>
              <uni-icons type="right" size="16" color="#aaaaaa" />
            </button>
          </view>
        </view>
      </scroll-view>

      <view class="message-input" :style="inputBarStyle">
        <input class="message-input__field" :value="inputValue" placeholder="输入想了解的问题"
          placeholder-class="message-input__placeholder" @input="handleInput" @confirm="sendMessage" />
        <button class="message-input__send" @tap="sendMessage">
          <uni-icons type="paperplane-filled" size="20" color="#ffffff" />
        </button>
      </view>
    </template>

    <template v-else-if="isServicePage">
      <scroll-view class="feature-page__scroll feature-page__scroll--with-input" :scroll-y="true" :enable-flex="true"
        :enhanced="true" :bounces="false">
        <view class="service-chat">
          <view class="service-chat__status">
            <view class="service-chat__avatar">
              <uni-icons type="chat-filled" size="26" color="#ffffff" />
            </view>
            <view>
              <text class="service-chat__name">在线客服</text>
              <text class="service-chat__state">工作时间 9:00-18:00</text>
            </view>
          </view>
          <view class="service-chat__message">您好，请问有什么可以帮助您？</view>
          <view v-for="message in messages" :key="message.id" class="service-chat__user-message">
            {{ message.text }}
          </view>
        </view>
      </scroll-view>

      <view class="message-input" :style="inputBarStyle">
        <input class="message-input__field" :value="inputValue" placeholder="请输入您的问题"
          placeholder-class="message-input__placeholder" @input="handleInput" @confirm="sendServiceMessage" />
        <button class="message-input__text-send" @tap="sendServiceMessage">发送</button>
      </view>
    </template>

    <scroll-view v-else class="feature-page__scroll" :scroll-y="true" :enable-flex="true" :enhanced="true"
      :bounces="false">
      <view v-if="config" class="feature-content">
        <view v-if="config.description" class="feature-summary">
          <text>{{ config.description }}</text>
        </view>

        <view v-if="isStudyData" class="study-grid">
          <view v-for="item in config.items" :key="item.id" class="study-card">
            <text class="study-card__value">{{ item.subtitle }}</text>
            <text class="study-card__title">{{ item.title }}</text>
            <text class="study-card__meta">{{ item.meta }}</text>
          </view>
        </view>

        <view v-else-if="!config.items.length" class="feature-empty">
          <uni-icons type="info" size="30" color="#bbbbbb" />
          <text>暂无内容</text>
        </view>

        <view v-else class="feature-list">
          <view v-for="item in config.items" :key="item.id" class="feature-item"
            :class="{ 'feature-item--media': item.thumbnail }">
            <view v-if="item.thumbnail" class="feature-item__thumb">
              <image v-if="!failedImages[item.id]" :src="item.thumbnail" mode="aspectFill"
                class="feature-item__image" @error="markImageFailed(item.id)" />
              <text v-else>求是</text>
            </view>
            <view class="feature-item__body">
              <view class="feature-item__title-row">
                <text class="feature-item__title">{{ item.title }}</text>
                <text v-if="item.tag" class="feature-item__tag">{{ item.tag }}</text>
              </view>
              <text class="feature-item__subtitle">{{ item.subtitle }}</text>
              <text class="feature-item__meta">{{ item.meta }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="feature-empty feature-empty--page">
        <uni-icons type="info" size="32" color="#bbbbbb" />
        <text>页面参数无效</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import QSSubPageHeader from '@/components/QSSubPageHeader.vue';
import { aiSuggestedQuestions, profileFeatureConfigs } from '@/config/userCenter';
import { useSafeArea } from '@/hooks/useSafeArea';
import { getUniInputValue } from '@/utils/events';
import { HeaderMode, ProfileFeatureType } from '@/types/enums';
import type { ProfileFeatureType as ProfileFeatureTypeValue } from '@/types/enums';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const validFeatureTypes = Object.values(ProfileFeatureType);
const featureType = ref<ProfileFeatureTypeValue | ''>('');
const headerMode = ref(HeaderMode.Compact);
const inputValue = ref('');
const failedImages = ref<Record<string, boolean>>({});
const messages = ref<ChatMessage[]>([]);
const { safeArea } = useSafeArea();

const config = computed(() => featureType.value ? profileFeatureConfigs[featureType.value] : undefined);
const isAiPage = computed(() => featureType.value === ProfileFeatureType.Ai);
const isServicePage = computed(() => featureType.value === ProfileFeatureType.Service);
const isStudyData = computed(() => featureType.value === ProfileFeatureType.StudyData);
const pageTitle = computed(() => {
  if (isAiPage.value) return 'AI小是';
  if (isServicePage.value) return '联系客服';
  return config.value?.title || '我的内容';
});
const inputBarStyle = computed(() => ({
  paddingBottom: `${Math.max(safeArea.value.bottomInset, 12)}px`
}));
const aiHeaderStyle = computed(() => ({
  height: `${safeArea.value.headerHeight}px`,
  paddingTop: `${safeArea.value.statusBarHeight}px`
}));
const aiBackStyle = computed(() => ({
  height: `${safeArea.value.capsuleHeight}px`
}));

onLoad((query) => {
  const rawType = typeof query?.type === 'string' ? decodeURIComponent(query.type) : '';

  if (validFeatureTypes.includes(rawType as ProfileFeatureTypeValue)) {
    featureType.value = rawType as ProfileFeatureTypeValue;
  }
});

const handleInput = (event: unknown) => {
  inputValue.value = getUniInputValue(event);
};

const appendConversation = (question: string) => {
  const trimmed = question.trim();
  if (!trimmed) return;

  const timestamp = Date.now();
  messages.value.push(
    { id: `user-${timestamp}`, role: 'user', text: trimmed },
    {
      id: `assistant-${timestamp}`,
      role: 'assistant',
      text: '这是一个值得深入学习的问题。AI小是已为你整理相关理论要点，完整问答能力将在后续版本开放。'
    }
  );
  inputValue.value = '';
};

const askQuestion = (question: string) => {
  appendConversation(question);
};

const sendMessage = () => {
  if (!inputValue.value.trim()) {
    uni.showToast({ title: '请输入问题', icon: 'none' });
    return;
  }

  appendConversation(inputValue.value);
};

const sendServiceMessage = () => {
  const message = inputValue.value.trim();
  if (!message) {
    uni.showToast({ title: '请输入问题', icon: 'none' });
    return;
  }

  messages.value.push({
    id: `service-${Date.now()}`,
    role: 'user',
    text: message
  });
  inputValue.value = '';
  uni.showToast({ title: '消息已发送', icon: 'success' });
};

const markImageFailed = (id: string) => {
  failedImages.value = {
    ...failedImages.value,
    [id]: true
  };
};

const goBack = () => {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }

  uni.switchTab({ url: '/pages/media/index' });
};
</script>

<style lang="scss">
page {
  background: #f6f7f9;
}
</style>

<style lang="scss" scoped>
.feature-page {
  height: 100%;
  overflow: hidden;
  background: #f6f7f9;
}

.feature-page--ai {
  background: #fff;
}

.ai-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #dedede;
  background: #fff;
  box-sizing: border-box;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}

.ai-header__back {
  position: absolute;
  left: 22rpx;
  bottom: 0;
  display: flex;
  width: 70rpx;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;

  &::after {
    border: none;
  }
}

.feature-page__scroll {
  height: calc(100% - 96rpx);
}

.feature-page__scroll--with-input {
  height: calc(100% - 214rpx);
}

.feature-content,
.ai-page,
.service-chat {
  padding: 26rpx 22rpx calc(50rpx + env(safe-area-inset-bottom));
}

.feature-summary {
  margin-bottom: 20rpx;
  padding: 24rpx;
  border-radius: 8rpx;
  background: #fff;
  color: #666;
  font-size: 25rpx;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.feature-item {
  display: flex;
  min-height: 142rpx;
  padding: 26rpx;
  border-radius: 8rpx;
  background: #fff;
  box-sizing: border-box;
}

.feature-item__thumb {
  display: flex;
  width: 172rpx;
  height: 118rpx;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 22rpx;
  border-radius: 4rpx;
  background: #f1f1f1;
  color: #d71920;
  font-size: 28rpx;
  font-weight: 700;
}

.feature-item__image {
  width: 100%;
  height: 100%;
}

.feature-item__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
}

.feature-item__title-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.feature-item__title {
  min-width: 0;
  flex: 1;
  color: #222;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.45;
}

.feature-item__tag {
  flex-shrink: 0;
  padding: 4rpx 9rpx;
  border-radius: 4rpx;
  background: #fff0ef;
  color: #d71920;
  font-size: 19rpx;
}

.feature-item__subtitle {
  margin-top: 12rpx;
  color: #666;
  font-size: 24rpx;
  line-height: 1.6;
}

.feature-item__meta {
  margin-top: 14rpx;
  color: #aaa;
  font-size: 21rpx;
}

.study-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18rpx;
}

.study-card {
  display: flex;
  height: 210rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  background: #fff;
}

.study-card__value {
  color: #d71920;
  font-size: 42rpx;
  font-weight: 700;
}

.study-card__title {
  margin-top: 12rpx;
  color: #333;
  font-size: 27rpx;
  font-weight: 600;
}

.study-card__meta {
  margin-top: 8rpx;
  color: #aaa;
  font-size: 20rpx;
}

.feature-empty {
  display: flex;
  min-height: 320rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  color: #999;
  font-size: 25rpx;
}

.feature-empty--page {
  height: 65vh;
}

.ai-page__hero {
  display: flex;
  flex-direction: column;
  padding: 8rpx 0 34rpx;
}

.ai-page__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  color: #333;
  font-size: 32rpx;
  font-weight: 700;
}

.ai-page__brand image {
  width: 64rpx;
  height: 54rpx;
}

.ai-page__intro {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  margin-top: 28rpx;
  padding: 0 30rpx;
  color: #333;
  font-size: 25rpx;
  line-height: 1.55;
}

.question-panel {
  overflow: hidden;
  background: #fff;
}

.question-panel__title {
  display: block;
  padding: 24rpx 30rpx 12rpx;
  color: #222;
  font-size: 30rpx;
  font-weight: 700;
}

.question-item {
  display: flex;
  width: 100%;
  min-height: 84rpx;
  align-items: center;
  gap: 16rpx;
  margin: 0;
  padding: 0 30rpx;
  border: none;
  border-bottom: none;
  border-radius: 0;
  background: #fff;
  color: #444;
  font-size: 23rpx;
  text-align: left;

  &::after {
    border: none;
  }
}

.question-item text {
  min-width: 0;
  flex: 1;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 22rpx;
}

.chat-message {
  max-width: 78%;
  padding: 18rpx 22rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  line-height: 1.55;
}

.chat-message--user {
  align-self: flex-end;
  background: #d71920;
  color: #fff;
}

.chat-message--assistant {
  align-self: flex-start;
  background: #fff;
  color: #444;
}

.service-chat__status {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
  border-radius: 8rpx;
  background: #fff;
}

.service-chat__avatar {
  display: flex;
  width: 68rpx;
  height: 68rpx;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #d71920;
}

.service-chat__name,
.service-chat__state {
  display: block;
}

.service-chat__name {
  color: #222;
  font-size: 27rpx;
  font-weight: 700;
}

.service-chat__state {
  margin-top: 7rpx;
  color: #999;
  font-size: 21rpx;
}

.service-chat__message,
.service-chat__user-message {
  max-width: 74%;
  margin-top: 24rpx;
  padding: 20rpx 22rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  line-height: 1.55;
}

.service-chat__message {
  background: #fff;
  color: #444;
}

.service-chat__user-message {
  margin-left: auto;
  background: #d71920;
  color: #fff;
}

.message-input {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  min-height: 118rpx;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 22rpx;
  border-top: 1rpx solid #e8e8e8;
  background: #d5d5d5;
  box-sizing: border-box;
}

.message-input__field {
  min-width: 0;
  height: 72rpx;
  flex: 1;
  padding: 0 24rpx;
  border-radius: 36rpx;
  background: #f2f3f5;
  color: #333;
  font-size: 25rpx;
}

.message-input__placeholder {
  color: #aaa;
}

.message-input__send,
.message-input__text-send {
  display: flex;
  height: 68rpx;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: none;
  background: #d71920;
  color: #fff;

  &::after {
    border: none;
  }
}

.message-input__send {
  width: 68rpx;
  padding: 0;
  border-radius: 50%;
}

.message-input__text-send {
  width: 104rpx;
  padding: 0;
  border-radius: 34rpx;
  font-size: 24rpx;
}
</style>
