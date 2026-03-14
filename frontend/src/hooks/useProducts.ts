import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product, searchProducts } from '../features/products';

export const useProducts = (searchParams?: any) => {
  const hasSearchParams = Boolean(
    searchParams &&
      Object.values(searchParams).some((value) => value !== undefined && value !== '')
  );

  return useQuery<Product[]>({
    queryKey: ['products', searchParams],
    queryFn: () => (hasSearchParams ? searchProducts(searchParams) : fetchProducts()),
  });
};
