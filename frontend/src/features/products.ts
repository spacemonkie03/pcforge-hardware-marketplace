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
  const res = await apiClient.get('/products/search', { params });
  return res.data.data;
};

