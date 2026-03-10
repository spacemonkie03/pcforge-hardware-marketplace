import { Layout } from '../../components/Layout';
import { useUserStore } from '../../store/useUserStore';

export default function AdminPanelPage() {
  const user = useUserStore((s) => s.user);

  return (
    <Layout>
      <h1 className="text-xl font-semibold mb-4">Admin panel</h1>
      {!user || user.role !== 'ADMIN' ? (
        <p className="text-sm text-red-400">Admin access required.</p>
      ) : (
        <p className="text-sm text-gray-300">
          Here you can manage sellers, products, users, and categories (extend this panel to call
          additional admin APIs).
        </p>
      )}
    </Layout>
  );
}

