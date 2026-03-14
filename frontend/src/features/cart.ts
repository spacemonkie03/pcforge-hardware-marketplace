import { apiClient } from '../services/apiClient';

export type CartItemType = 'PRODUCT' | 'LISTING';

export interface CartItem {
  id: string;
  itemType: CartItemType;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productId?: string | null;
  listingId?: number | null;
  name: string;
  brand: string;
  category: string;
  sellerName?: string | null;
  condition?: string | null;
  image?: string | null;
}

export interface AddCartItemInput {
  itemType: CartItemType;
  productId?: string;
  listingId?: number;
  quantity: number;
}

export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await apiClient.get('/cart');
  return res.data.data;
};

export const addCartItem = async (payload: AddCartItemInput): Promise<CartItem> => {
  const res = await apiClient.post('/cart/items', payload);
  return res.data.data;
};

export const updateCartItem = async (id: string, quantity: number): Promise<CartItem> => {
  const res = await apiClient.patch(`/cart/items/${id}`, { quantity });
  return res.data.data;
};

export const removeCartItem = async (id: string) => {
  const res = await apiClient.delete(`/cart/items/${id}`);
  return res.data.data;
};

export const clearCart = async () => {
  const res = await apiClient.delete('/cart/clear');
  return res.data.data;
};
