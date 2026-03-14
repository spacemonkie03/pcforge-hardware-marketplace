import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { fetchProducts, Product } from '../features/products';
import { formatINR } from '../utils/currency';

export default function DealsPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['deals-products'],
    queryFn: fetchProducts,
  });

  const deals = products.slice(0, 6);

  return (
    <ContentPage
      title="Deals"
      description="Live deals pull from your real marketplace inventory. Once you add discounted or competitive listings, they will appear here."
      actions={[
        { href: '/#marketplace', label: 'Browse Products' },
        { href: '/sell', label: 'Add Listing', variant: 'secondary' },
      ]}
    >
      {deals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deals.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-blue-400/40"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300">{product.category}</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{product.name}</h2>
              <p className="mt-1 text-sm text-gray-400">{product.brand}</p>
              <p className="mt-4 text-2xl font-bold text-blue-300">{formatINR(product.price)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">No live deals yet</h2>
          <p className="mt-2 text-sm text-gray-400">Add real product listings and this page will start filling automatically.</p>
        </div>
      )}
    </ContentPage>
  );
}
