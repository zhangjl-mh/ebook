import type {
  PaymentMethodId,
  SubscriptionBenefitIcon,
  SubscriptionPlanId
} from '@/types/enums';

export type {
  PaymentMethodId,
  SubscriptionBenefitIcon,
  SubscriptionPlanId
} from '@/types/enums';

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
  icon: SubscriptionBenefitIcon;
}

export interface SubscriptionPaymentMethod {
  id: PaymentMethodId;
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
