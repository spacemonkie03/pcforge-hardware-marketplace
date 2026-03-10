import { apiClient } from '../services/apiClient';

export const fetchSellerAnalytics = async (sellerId: string) => {
  const res = await apiClient.get(`/sellers/${sellerId}/analytics`);
  return res.data.data;
};

