import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { ListingCard } from '../../components/ListingCard';
import { Card } from '../../components/ui/Card';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { fetchSellerProfile } from '../../features/sellers';

export default function SellerProfilePage() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { data, isLoading } = useQuery({
    queryKey: ['seller-profile', id],
    queryFn: () => fetchSellerProfile(String(id)),
    enabled: Boolean(id),
  });

  return (
    <Layout>
      <SectionContainer
        title={data?.name ? `${data.name} Seller Profile` : 'Seller Profile'}
        description="Public seller profile with live marketplace listings."
      >
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--pf-accent-primary)]" />
            <span className="ml-3 text-[var(--pf-text-secondary)]">Loading seller profile...</span>
          </div>
        )}

        {!isLoading && !data && (
          <Card className="p-8 text-center">
            <h2 className="text-lg font-semibold text-white">Seller not found</h2>
            <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
              This seller profile is unavailable or no longer active.
            </p>
            <Link href="/#marketplace" className="pf-button-primary mt-6 inline-flex">
              Back to Marketplace
            </Link>
          </Card>
        )}

        {data && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Seller</p>
                <p className="mt-2 text-2xl font-semibold text-white">{data.name}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Role</p>
                <p className="mt-2 text-2xl font-semibold text-white">{data.role}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Listings</p>
                <p className="mt-2 text-2xl font-semibold text-white">{data.totalListings}</p>
              </Card>
            </div>

            {data.listings.length === 0 ? (
              <Card className="p-8 text-center">
                <h2 className="text-lg font-semibold text-white">No listings yet</h2>
                <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                  This seller has not published active listings.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {data.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        )}
      </SectionContainer>
    </Layout>
  );
}
