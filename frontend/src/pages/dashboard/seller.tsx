import { Layout } from '../../components/Layout';
import { useUserStore } from '../../store/useUserStore';
import { useQuery } from '@tanstack/react-query';
import { fetchSellerAnalytics } from '../../features/sellers';

export default function SellerDashboardPage() {
  const user = useUserStore((s) => s.user);
  const sellerId = user?.id;

  const { data } = useQuery({
    queryKey: ['sellerAnalytics', sellerId],
    queryFn: () => fetchSellerAnalytics(sellerId!),
    enabled: !!sellerId
  });

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Seller dashboard</h1>
      {!user && <p className="text-sm text-gray-400">Login as seller to view analytics.</p>}
      {user && data && (
        <div className="glass-panel p-4 max-w-md text-sm">
          <p>Total products: {data.totalProducts}</p>
          <p>Total sales: {data.totalSales}</p>
          <p>Revenue: ${data.revenue}</p>
        </div>
      )}
    </Layout>
  );
}

