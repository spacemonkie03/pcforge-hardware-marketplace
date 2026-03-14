import { apiClient } from '../services/apiClient';
import { ListingSummary } from './listings';

export const fetchWishlist = async (): Promise<ListingSummary[]> => {
  const res = await apiClient.get('/wishlist');
  return res.data.data;
};

export const addToWishlist = async (listingId: number | string) => {
  const res = await apiClient.post(`/wishlist/${listingId}`);
  return res.data.data;
};

export const removeFromWishlist = async (listingId: number | string) => {
  const res = await apiClient.delete(`/wishlist/${listingId}`);
  return res.data.data;
};
