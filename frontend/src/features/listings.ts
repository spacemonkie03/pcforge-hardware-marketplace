import { apiClient } from '../services/apiClient';

export interface ListingSummary {
  id: number;
  gpuName: string;
  slug: string;
  manufacturer: string;
  price: number;
  condition?: string | null;
  isDemoSeed?: boolean;
  firstImage?: string | null;
  createdAt: string;
  seller: {
    id: string;
    name: string;
  };
}

export interface ListingDetail extends ListingSummary {
  description?: string | null;
  images: string[];
  gpu: {
    id: number;
    name: string;
    slug: string;
    manufacturer: string;
    architecture?: string | null;
    releaseYear?: number | null;
    processNm?: number | null;
    vramGb?: number | null;
    memoryType?: string | null;
    memoryBusWidth?: number | null;
    pcieVersion?: string | null;
    tdpWatts?: number | null;
  };
}

export interface ListingAnalyticsItem {
  listingId: number;
  gpuName: string;
  price: number;
  condition?: string | null;
  views: number;
  saves: number;
  createdAt: string;
}

export interface UpdateListingInput {
  price?: number;
  condition?: string;
  description?: string;
  images?: string[];
}

export interface ListingPriceHistoryEntry {
  id: number;
  price: number;
  recordedAt: string;
}

export interface CreateListingInput {
  gpuId: number;
  price: number;
  condition?: string;
  description?: string;
  images?: string[];
}

export interface ListingSearchParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface DemoListingSeedResult {
  created: number;
  updated: number;
  total: number;
  seller: {
    id: string;
    name: string;
  };
  listings: ListingSummary[];
}

export const fetchListings = async (params?: ListingSearchParams): Promise<ListingSummary[]> => {
  const hasSearch = Boolean(
    params &&
      Object.values(params).some((value) => value !== undefined && value !== '')
  );
  const res = await apiClient.get(hasSearch ? '/search/listings' : '/listings', { params });
  return res.data.data;
};

export const fetchListing = async (id: number | string): Promise<ListingDetail> => {
  const res = await apiClient.get(`/listings/${id}`);
  return res.data.data;
};

export const fetchListingPriceHistory = async (
  id: number | string
): Promise<ListingPriceHistoryEntry[]> => {
  const res = await apiClient.get(`/listings/${id}/price-history`);
  return res.data.data;
};

export const createListing = async (payload: CreateListingInput) => {
  const res = await apiClient.post('/listings', payload);
  return res.data.data;
};

export const seedDemoListings = async (): Promise<DemoListingSeedResult> => {
  const res = await apiClient.post('/listings/admin/demo-catalog');
  return res.data.data;
};

export const updateListing = async (
  id: number | string,
  payload: UpdateListingInput
): Promise<ListingDetail> => {
  const res = await apiClient.patch(`/listings/${id}`, payload);
  return res.data.data;
};

export const deleteListing = async (id: number | string) => {
  const res = await apiClient.delete(`/listings/${id}`);
  return res.data.data;
};

export const fetchMyListingAnalytics = async (): Promise<ListingAnalyticsItem[]> => {
  const res = await apiClient.get('/my-listings/analytics');
  return res.data.data;
};
