import { Layout } from '../components/Layout';
import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import { useCompareStore } from '../store/useCompareStore';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../features/products';
import { CompareTable } from '../components/CompareTable';

export default function HomePage() {
  const [filters, setFilters] = useState<any>({});
  const { data, isLoading } = useProducts(filters);
  const compareIds = useCompareStore((s) => s.ids);

  const { data: compareProducts = [] } = useQuery({
    queryKey: ['compare', compareIds],
    queryFn: async () => Promise.all(compareIds.map((id) => fetchProduct(id))),
    enabled: compareIds.length > 0
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">
          Build your dream <span className="text-neonBlue">PC</span>
        </h1>
        <p className="text-sm text-gray-400">
          Curated components with smart compatibility checks and live price tracking.
        </p>
      </div>
      <ProductFilters onChange={setFilters} />
      {isLoading && <p className="text-sm text-gray-400">Loading products...</p>}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <CompareTable products={compareProducts} />
    </Layout>
  );
}

