export interface PaperOrderProduct {
  id: string;
  name: string;
  tags: string[];
  description: string;
  unitPrice: number;
  annualPrice: number;
  postalCode: string;
  coverImage: string;
  issueCount: number;
  year: string;
  subscriptionType: string;
  merchant: string;
  deliveryText: string;
}

export const paperOrderProduct: PaperOrderProduct = {
  id: 'qiushi-paper',
  name: '求是',
  tags: ['包邮', '半月刊'],
  description: '《求是》杂志是中国共产党中央委员会主办的机关刊物，是党中央指导全党全国工作的重要思想理论阵地。',
  unitPrice: 11,
  annualPrice: 264,
  postalCode: '2-371',
  coverImage: '/static/brand/ebook_issue_10.jpg',
  issueCount: 1,
  year: '2026',
  subscriptionType: '自选定期',
  merchant: '求是杂志社',
  deliveryText: '付款后按所选订阅周期寄送'
};
