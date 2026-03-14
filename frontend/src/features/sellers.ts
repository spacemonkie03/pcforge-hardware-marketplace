import { apiClient } from '../services/apiClient';
import { ListingSummary } from './listings';

export interface MarketplaceSellerProfile {
  id: string;
  name: string;
  role: string;
  joinedAt: string;
  totalListings: number;
  listings: ListingSummary[];
}

export const fetchSellerAnalytics = async (sellerId?: string) => {
  const path = sellerId ? `/sellers/${sellerId}/analytics` : '/sellers/me/analytics';
  const res = await apiClient.get(path);
  return res.data.data;
};

export const fetchSellerProfile = async (sellerId: string): Promise<MarketplaceSellerProfile> => {
  const res = await apiClient.get(`/listings/sellers/${sellerId}/profile`);
  return res.data.data;
};

