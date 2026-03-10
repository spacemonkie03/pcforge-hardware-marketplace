import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../../features/products';
import { Layout } from '../../components/Layout';
import { PriceHistoryChart } from '../../components/PriceHistoryChart';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id
  });

  if (!id) return null;

  return (
    <Layout>
      {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
      {data && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-5">
            <h1 className="text-xl font-semibold mb-1">{data.name}</h1>
            <p className="text-sm text-gray-400 mb-3">{data.brand}</p>
            <p className="text-2xl text-neonBlue font-bold mb-2">
              ${Number(data.price).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mb-4">
              ⭐ {data.rating.toFixed(1)} ({data.ratingCount}) •{' '}
              {data.inStock ? 'In stock' : 'Out of stock'}
            </p>
            <h3 className="text-sm font-semibold mb-2">Specs</h3>
            <table className="text-xs w-full">
              <tbody>
                {Object.entries(data.specs || {}).map(([k, v]) => (
                  <tr key={k}>
                    <td className="text-gray-400 pr-3 py-0.5">{k}</td>
                    <td>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <PriceHistoryChart history={(data as any).priceHistory || []} />
          </div>
        </div>
      )}
    </Layout>
  );
}

