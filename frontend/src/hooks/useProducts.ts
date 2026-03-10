import { useQuery } from "@tanstack/react-query";
import { fetchProducts, searchProducts } from "../features/products";
import { Product } from "../features/products";

export const useProducts = (searchParams?: any) => {
  const queryKey = ["products", searchParams];

  const queryFn = () =>
    searchParams ? searchProducts(searchParams) : fetchProducts();

  return useQuery<Product[]>({
    queryKey,
    queryFn,
  });
};