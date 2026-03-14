import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { fetchListing } from '../../features/listings';
import { Badge } from '../../components/ui/Badge';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { PriceTag } from '../../components/ui/PriceTag';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { addToWishlist, fetchWishlist, removeFromWishlist } from '../../features/wishlist';
import { addCartItem } from '../../features/cart';
import { useUserStore } from '../../store/useUserStore';
import { getFallbackImageForListing } from '../../utils/imageAssets';

export default function ListingDetailPage() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => fetchListing(String(id)),
    enabled: Boolean(id),
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: Boolean(user),
  });

  const wishlistMutation = useMutation({
    mutationFn: async () => {
      const listingId = Number(id);
      const saved = wishlist.some((entry) => entry.id === listingId);
      return saved ? removeFromWishlist(listingId) : addToWishlist(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings-analytics'] });
    },
  });

  const cartMutation = useMutation({
    mutationFn: (redirectToCheckout: boolean) =>
      addCartItem({
        itemType: 'LISTING',
        listingId: Number(id),
        quantity: 1,
      }).then(() => redirectToCheckout),
    onSuccess: async (redirectToCheckout) => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (redirectToCheckout) {
        router.push('/checkout');
      }
    },
  });

  const isSaved = wishlist.some((entry) => entry.id === Number(id));

  return (
    <Layout>
      <SectionContainer
        title={data?.gpuName || 'Listing'}
        description="Listing pages use the same card language, spacing, and specification layout as the rest of the marketplace."
      >
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--pf-accent-primary)]" />
            <span className="ml-3 text-[var(--pf-text-secondary)]">Loading listing...</span>
          </div>
        )}

        {!isLoading && data && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <section className="space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-[4/3] bg-[linear-gradient(135deg,rgba(99,102,241,0.16),rgba(139,92,246,0.08))]">
                  <img
                    src={data.firstImage || getFallbackImageForListing()}
                    alt={data.gpuName}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Card>

              {data.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {data.images.slice(1).map((image) => (
                    <Card key={image} className="overflow-hidden">
                      <div className="aspect-square">
                        <img src={image} alt={data.gpuName} className="h-full w-full object-cover" />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <aside className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">GPU Listing</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">{data.gpuName}</h2>
                    <p className="mt-2 text-[var(--pf-text-secondary)]">{data.manufacturer}</p>
                  </div>
                  {data.condition && <Badge variant="accent">{data.condition}</Badge>}
                </div>
                <div className="mt-6">
                  <PriceTag price={data.price} />
                </div>
                <p className="mt-3 text-sm text-[var(--pf-text-secondary)]">
                  Seller:{' '}
                  <Link href={`/sellers/${data.seller.id}`} className="text-white transition-colors hover:text-[var(--pf-accent-primary)]">
                    {data.seller.name}
                  </Link>
                </p>
                {user && (
                  <div className="mt-5 space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button type="button" className="pf-button-secondary w-full justify-center" onClick={() => cartMutation.mutate(false)}>
                        Add to Cart
                      </button>
                      <button type="button" className="pf-button-primary w-full justify-center" onClick={() => cartMutation.mutate(true)}>
                        Buy Now
                      </button>
                    </div>
                    {isSaved ? (
                      <ButtonSecondary onClick={() => wishlistMutation.mutate()} disabled={wishlistMutation.isPending}>
                        {wishlistMutation.isPending ? 'Updating...' : 'Remove from Wishlist'}
                      </ButtonSecondary>
                    ) : (
                      <ButtonPrimary onClick={() => wishlistMutation.mutate()} disabled={wishlistMutation.isPending}>
                        {wishlistMutation.isPending ? 'Saving...' : 'Save Listing'}
                      </ButtonPrimary>
                    )}
                  </div>
                )}
                {data.description && (
                  <p className="mt-6 text-sm leading-7 text-[var(--pf-text-secondary)]">{data.description}</p>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white">GPU Reference Specs</h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">Architecture</dt>
                    <dd className="text-white">{data.gpu.architecture || '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">Release Year</dt>
                    <dd className="text-white">{data.gpu.releaseYear ?? '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">Process</dt>
                    <dd className="text-white">{data.gpu.processNm ? `${data.gpu.processNm} nm` : '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">VRAM</dt>
                    <dd className="text-white">{data.gpu.vramGb ? `${data.gpu.vramGb} GB` : '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">Memory Type</dt>
                    <dd className="text-white">{data.gpu.memoryType || '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">Memory Bus</dt>
                    <dd className="text-white">{data.gpu.memoryBusWidth ? `${data.gpu.memoryBusWidth}-bit` : '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">PCIe</dt>
                    <dd className="text-white">{data.gpu.pcieVersion || '-'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-[var(--pf-text-secondary)]">TDP</dt>
                    <dd className="text-white">{data.gpu.tdpWatts ? `${data.gpu.tdpWatts} W` : '-'}</dd>
                  </div>
                </dl>
              </Card>
            </aside>
          </div>
        )}
      </SectionContainer>
    </Layout>
  );
}
