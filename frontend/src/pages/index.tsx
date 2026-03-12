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
        <h1 className="text-3xl font-bold mb-2">
          Build your dream <span className="text-blue-400">PC</span>
        </h1>
        <p className="text-gray-400">
          Curated components with smart compatibility checks and live price tracking.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters onChange={setFilters} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-gray-400">Loading products...</span>
            </div>
          )}

          {!isLoading && data && (
            <>
              <div className="mb-4 text-sm text-gray-400">
                {data.length} products found
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}

          <CompareTable products={compareProducts} />
        </main>
      </div>
    </Layout>
  );
}

