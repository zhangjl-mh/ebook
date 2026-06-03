export type SubscriptionPlanId = 'month' | 'year';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  title: string;
  validity: string;
  price: number;
  priceText: string;
  unitText: string;
  badge?: string;
}

export interface SubscriptionBenefit {
  id: string;
  title: string;
  desc: string;
  icon: 'video' | 'notes' | 'audio' | 'knowledge';
}

export interface SubscriptionPaymentMethod {
  id: 'wechat';
  title: string;
}

export interface SubscriptionPaymentConfig {
  pageTitle: string;
  productName: string;
  productTag: string;
  description: string;
  coverImage: string;
  plans: SubscriptionPlan[];
  benefits: SubscriptionBenefit[];
  paymentMethod: SubscriptionPaymentMethod;
}
