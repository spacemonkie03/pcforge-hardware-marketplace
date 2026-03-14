import { apiClient } from '../services/apiClient';

export interface OrderItem {
  id: string;
  itemType: 'PRODUCT' | 'LISTING';
  productId?: string | null;
  listingId?: number | null;
  name: string;
  brand: string;
  category: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  currency?: string;
  createdAt: string;
  paymentMethodType?: string | null;
  paymentProvider?: string | null;
  paymentMethodLabel?: string | null;
  shippingAddress?: {
    id: string;
    fullName: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  items?: OrderItem[];
}

export interface CreateOrderInput {
  items: Array<{
    itemType: 'PRODUCT' | 'LISTING';
    productId?: string;
    listingId?: number;
    quantity: number;
  }>;
  shippingAddressId?: string;
  paymentMethodId?: string;
  shippingAmount?: number;
  taxAmount?: number;
  notes?: string;
  clearCart?: boolean;
}

export const fetchMyOrders = async (): Promise<Order[]> => {
  const res = await apiClient.get('/orders/me');
  return res.data.data;
};

export const checkoutOrder = async (payload: CreateOrderInput): Promise<Order> => {
  const res = await apiClient.post('/orders/checkout', payload);
  return res.data.data;
};
