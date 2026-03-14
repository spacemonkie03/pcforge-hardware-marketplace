import { useEffect, useState } from 'react';
import { ListingCard } from '../ListingCard';
import { ProductCard } from '../ProductCard';
import { CompareTable } from '../CompareTable';
import { ProductFilters, ProductFilterValues } from '../ProductFilters';
import { Card } from '../ui/Card';
import { useListings } from '../../hooks/useListings';
import { useProducts } from '../../hooks/useProducts';
import { useCompareStore } from '../../store/useCompareStore';

interface MarketplaceCatalogFeedProps {
  query?: string;
  category?: string;
  categories?: Array<{ value: string; label: string }>;
  showApiLimitationsNotice?: boolean;
}

export const MarketplaceCatalogFeed = ({
  query,
  category,
  categories,
  showApiLimitationsNotice = false,
}: MarketplaceCatalogFeedProps) => {
  const [filters, setFilters] = useState<ProductFilterValues>({
    q: query,
    category,
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      q: query || undefined,
      category: category || undefined,
    }));
  }, [query, category]);

  const listingFilters = {
    q: filters.q,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };
  const productFilters = {
    q: filters.q,
    category: filters.category,
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    inStock: filters.inStock,
  };
  const shouldShowListings = !filters.category || filters.category === 'GPU';

  const { data: products, isLoading: isProductsLoading } = useProducts(productFilters);
  const { data: listings, isLoading: isListingsLoading } = useListings(listingFilters);
  const compareIds = useCompareStore((state) => state.ids);
  const clearCompare = useCompareStore((state) => state.clear);
  const isLoading = isProductsLoading || (shouldShowListings && isListingsLoading);
  const totalResults = (products?.length || 0) + (shouldShowListings ? listings?.length || 0 : 0);
  const compareProducts = (products || []).filter((product) => compareIds.includes(product.id));

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
      <aside className="w-full">
        <div className="sticky top-24">
          <ProductFilters
            initialFilters={filters}
            onChange={setFilters}
            categories={categories}
            showApiLimitationsNotice={showApiLimitationsNotice}
          />
        </div>
      </aside>

      <main className="min-w-0">
        <Card className="p-5">
          <div className="mb-6 flex flex-col gap-4 border-b border-[var(--pf-border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="pf-eyebrow">Available Components</p>
              <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                Filtered results across products and live listings.
              </p>
            </div>
            <p className="text-sm text-[var(--pf-text-secondary)]">
              {isLoading ? 'Refreshing components...' : `${totalResults} results found`}
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--pf-accent-primary)]" />
              <span className="ml-3 text-[var(--pf-text-secondary)]">Loading components...</span>
            </div>
          )}

          {!isLoading && totalResults > 0 && (
            <>
              {compareProducts.length > 0 && (
                <div className="mb-6 rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="pf-eyebrow">
                      Comparing {compareProducts.length} product{compareProducts.length > 1 ? 's' : ''}
                    </p>
                    <button
                      type="button"
                      onClick={clearCompare}
                      className="rounded-lg border border-[var(--pf-border)] px-3 py-1 text-xs text-[var(--pf-text-secondary)] transition-colors hover:border-[var(--pf-border-strong)] hover:text-white"
                    >
                      Clear Comparison
                    </button>
                  </div>
                  <CompareTable products={compareProducts} />
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {(products || []).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {shouldShowListings &&
                  (listings || []).map((listing) => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            </>
          )}

          {!isLoading && totalResults === 0 && (
            <div className="flex min-h-[280px] items-center justify-center rounded-[14px] border border-dashed border-white/10 bg-white/5 text-center">
              <div>
                <p className="text-lg font-semibold text-white">No components match these filters</p>
                <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                  Try a broader search or clear the price range.
                </p>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
