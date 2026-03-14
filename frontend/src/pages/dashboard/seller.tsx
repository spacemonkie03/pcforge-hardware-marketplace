import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { fetchSellerAnalytics } from '../../features/sellers';
import { formatINR } from '../../utils/currency';
import { useUserStore } from '../../store/useUserStore';

const sellerFocusAreas = [
  'Create and publish more listings from the sell flow.',
  'Use My Listings to edit pricing and review views and saves.',
  'Expand seller analytics once order and revenue tracking are live.',
];

export default function SellerDashboardPage() {
  const user = useUserStore((s) => s.user);
  const canAccess = user?.role === 'SELLER' || user?.role === 'ADMIN';

  const { data } = useQuery({
    queryKey: ['sellerAnalytics', user?.id],
    queryFn: () => fetchSellerAnalytics(),
    enabled: Boolean(user?.id) && canAccess,
  });

  return (
    <Layout>
      <SectionContainer
        title="Seller Dashboard"
        description="Seller-facing overview for inventory, revenue progress, and the operational routes already supported by the current marketplace stack."
        actions={
          <>
            <ButtonPrimary href="/sell">New Listing</ButtonPrimary>
            <ButtonSecondary href="/profile/my-listings">My Listings Analytics</ButtonSecondary>
          </>
        }
      >
        {!canAccess ? (
          <Card className="p-8 text-center">
            <p className="text-lg font-semibold text-white">Seller access required</p>
            <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
              Login with a seller or admin account to view dashboard metrics and manage listings.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Total Products</p>
                <p className="mt-2 text-3xl font-semibold text-white">{data?.totalProducts ?? 0}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Total Sales</p>
                <p className="mt-2 text-3xl font-semibold text-white">{data?.totalSales ?? 0}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Revenue</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatINR(data?.revenue ?? 0)}</p>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <Card className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Current seller workflow</p>
                <div className="mt-4 space-y-4 text-sm text-gray-300">
                  <p>
                    You can already create listings, browse live inventory, open individual listing pages, and manage pricing from the analytics page.
                  </p>
                  <p>
                    The next layer for this dashboard is deeper sales reporting once checkout and order persistence are connected end to end.
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Focus next</p>
                <ul className="mt-4 space-y-3 text-sm text-gray-300">
                  {sellerFocusAreas.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}
      </SectionContainer>
    </Layout>
  );
}
