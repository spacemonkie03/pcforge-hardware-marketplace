import { apiClient } from '../services/apiClient';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  images?: string[];
  specs?: Record<string, any>;
  compatibility?: Record<string, any>;
  inStock: boolean;
  rating: number;
  ratingCount: number;
  seller?: {
    id: string;
    name: string;
    status?: string;
  };
}

export interface DemoCatalogSeedResult {
  created: number;
  updated: number;
  total: number;
  seller: {
    id: string;
    name: string;
  };
  products: Product[];
}

export interface CreateProductInput {
  name: string;
  brand: string;
  category: string;
  price: number;
  images?: string[];
  specs?: Record<string, any>;
  compatibility?: Record<string, any>;
  inStock?: boolean;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get('/products');
  return res.data.data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const res = await apiClient.get(`/products/${id}`);
  return res.data.data;
};

export const searchProducts = async (params: any): Promise<Product[]> => {
  const res = await apiClient.get('/search/products', { params });
  return res.data.data;
};

export const createProduct = async (payload: CreateProductInput): Promise<Product> => {
  const res = await apiClient.post('/products', payload);
  return res.data.data;
};

export const seedDemoCatalog = async (): Promise<DemoCatalogSeedResult> => {
  const res = await apiClient.post('/products/admin/demo-catalog');
  return res.data.data;
};

export const deleteProduct = async (id: string) => {
  const res = await apiClient.delete(`/products/${id}`);
  return res.data.data;
};

