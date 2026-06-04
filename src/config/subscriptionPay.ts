import { magazineConfig } from '@/config/magazineData';
import type { SubscriptionPaymentConfig } from '@/types/subscription';

export const subscriptionPaymentConfig: SubscriptionPaymentConfig = {
  pageTitle: '订阅《求是》数字刊',
  productName: '《求是》数字刊',
  productTag: '数字订阅',
  description: '第一时间获取最新期刊内容，支持视频学习、收藏笔记、语音伴读和理论专题知识库。',
  coverImage: magazineConfig.swiperIssues[0]?.coverImage || '',
  plans: [
    {
      id: 'month',
      title: '单月订阅',
      validity: '有效期 30 天',
      price: 22,
      priceText: '￥22',
      unitText: '22 元/月'
    },
    {
      id: 'year',
      title: '包年订阅',
      validity: '有效期 365 天',
      price: 240,
      priceText: '￥240',
      unitText: '10 元/月',
      badge: '优惠 24 元'
    }
  ],
  benefits: [
    {
      id: 'video',
      title: '视频学习',
      desc: '专题课程随时看',
      icon: 'video'
    },
    {
      id: 'notes',
      title: '收藏笔记',
      desc: '重点内容随时存',
      icon: 'notes'
    },
    {
      id: 'audio',
      title: '语音伴读',
      desc: '通勤学习更轻松',
      icon: 'audio'
    },
    {
      id: 'knowledge',
      title: '理论专题知识库',
      desc: '权威专题系统学',
      icon: 'knowledge'
    }
  ],
  paymentMethod: {
    id: 'wechat',
    title: '微信支付'
  }
};
