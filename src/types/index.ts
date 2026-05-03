export interface SalesRecord {
  customerID: number;
  age: number;
  gender: string;
  loyaltyMember: string;
  productType: string;
  sku: string;
  rating: number;
  orderStatus: string;
  paymentMethod: string;
  totalPrice: number;
  unitPrice: number;
  quantity: number;
  purchaseDate: string;
  shippingType: string;
  addonsPurchased: string;
  addonTotal: number;
}

export interface FilterState {
  dateRange: [string, string];
  productType: string;
  gender: string;
  loyaltyMember: string;
  paymentMethod: string;
  orderStatus: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface KPIMetrics {
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  totalCustomers: number;
  loyaltyRatio: number;
  avgOrderValue: number;
}
