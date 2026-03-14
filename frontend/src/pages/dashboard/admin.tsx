import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui/Card';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { deleteListing, fetchListings, seedDemoListings } from '../../features/listings';
import { deleteProduct, fetchProducts, seedDemoCatalog } from '../../features/products';
import { useUserStore } from '../../store/useUserStore';
import { formatINR } from '../../utils/currency';

const adminQueues = [
  ['Catalog coverage', 'Check which categories have live inventory and where the marketplace is still thin.'],
  ['Seller operations', 'Review seller applications, quality controls, and account approvals when the admin APIs expand.'],
  ['Trust and safety', 'Use listing quality rules, report handling, and moderation actions to keep the marketplace reliable.'],
];

export default function AdminPanelPage() {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.role === 'ADMIN';
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
    enabled: isAdmin,
  });

  const { data: listings = [] } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: () => fetchListings(),
    enabled: isAdmin,
  });

  const seedMutation = useMutation({
    mutationFn: seedDemoCatalog,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const seedListingsMutation = useMutation({
    mutationFn: seedDemoListings,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['landing-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['my-listings-analytics'] });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['landing-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['my-listings-analytics'] });
    },
  });

  const demoProducts = products.filter((product) => product.specs?.marketplaceMeta?.demoSeed);
  const myListings = listings.filter((listing) => listing.seller.id === user?.id);
  const seededListings = myListings.filter((listing) => listing.isDemoSeed);

  const deleteAllSeededListingsMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(seededListings.map((listing) => deleteListing(listing.id)));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['listings'] });
      void queryClient.invalidateQueries({ queryKey: ['landing-listings'] });
      void queryClient.invalidateQueries({ queryKey: ['my-listings-analytics'] });
    },
  });

  return (
    <Layout>
      <SectionContainer
        title="Admin Panel"
        description="Platform oversight for inventory coverage, seller operations, and the marketplace surfaces currently available in this stack."
      >
        {!isAdmin ? (
          <Card className="p-8 text-center">
            <p className="text-lg font-semibold text-white">Admin access required</p>
            <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
              Login with an admin account to view platform-level inventory and operational summaries.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Products</p>
                <p className="mt-2 text-3xl font-semibold text-white">{products.length}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Listings</p>
                <p className="mt-2 text-3xl font-semibold text-white">{listings.length}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Unique Listing Sellers</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {new Set(listings.map((listing) => listing.seller.id)).size}
                </p>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Temporary Demo Catalog</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Seed real products through the API</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    This creates actual product records with image URLs under your admin-owned seller profile, so the marketplace surfaces use live API data and you can remove the seeded items later.
                  </p>
                  {seedMutation.data ? (
                    <p className="mt-3 text-sm text-emerald-300">
                      Synced {seedMutation.data.total} demo products for {seedMutation.data.seller.name}. Created {seedMutation.data.created}, updated {seedMutation.data.updated}.
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => seedMutation.mutate()}
                  disabled={seedMutation.isPending}
                  className="rounded-lg bg-[var(--pf-accent-primary)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {seedMutation.isPending ? 'Adding Demo Products...' : 'Add Demo Products'}
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Temporary Demo Listings</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Seed real marketplace GPU listings</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    This creates real listing rows from the GPU database using your admin account as the seller identity. They appear on browse, listing detail pages, and My Listings so you can edit or delete them later.
                  </p>
                  {seedListingsMutation.data ? (
                    <p className="mt-3 text-sm text-emerald-300">
                      Synced {seedListingsMutation.data.total} listings for {seedListingsMutation.data.seller.name}. Created {seedListingsMutation.data.created}, updated {seedListingsMutation.data.updated}.
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => seedListingsMutation.mutate()}
                  disabled={seedListingsMutation.isPending}
                  className="rounded-lg border border-cyan-300/30 bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {seedListingsMutation.isPending ? 'Adding Demo Listings...' : 'Add Demo Listings'}
                </button>
              </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <Card className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Live Admin Surface</p>
                <div className="mt-4 space-y-4 text-sm text-gray-300">
                  <p>
                    The current backend already exposes real products, listings, seller analytics, and wishlist/listing activity. This panel now summarizes the parts of the marketplace you can inspect today.
                  </p>
                  <p>
                    What is still missing is the deeper admin workflow: seller approval queues, user management, moderation actions, and configurable category operations.
                  </p>
                </div>
              </Card>

              <div className="grid gap-4">
                {adminQueues.map(([title, copy]) => (
                  <Card key={title} className="p-5">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{copy}</p>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Seeded Catalog</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Demo products created through your admin seller</h2>
                </div>
                <p className="text-sm text-[var(--pf-text-secondary)]">{demoProducts.length} demo products</p>
              </div>

              {demoProducts.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">
                  No demo products have been created yet. Use the action above to seed the catalog through the backend API.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {demoProducts.map((product) => (
                    <article key={product.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="aspect-[4/3] bg-slate-900/80">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-500">No image</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col space-y-3 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--pf-accent-primary)]">{product.category}</p>
                            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-white">{product.name}</h3>
                          </div>
                          <span className="self-start rounded-full border border-white/10 px-2 py-1 text-xs text-gray-300">{product.brand}</span>
                        </div>
                        <p className="text-sm text-gray-400">Seller: {product.seller?.name || 'Unknown seller'}</p>
                        <p className="mt-auto text-lg font-semibold text-white">Rs. {Number(product.price).toLocaleString('en-IN')}</p>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(product.id)}
                          disabled={deleteMutation.isPending}
                          className="w-full rounded-lg border border-rose-400/40 px-3 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleteMutation.isPending ? 'Removing...' : 'Remove Product'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Your Live Listings</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Listings owned by your admin account</h2>
                  <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                    {seededListings.length} seeded demo listing{seededListings.length === 1 ? '' : 's'} currently attached to this admin seller.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <p className="text-sm text-[var(--pf-text-secondary)]">{myListings.length} listings</p>
                  {seededListings.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => deleteAllSeededListingsMutation.mutate()}
                      disabled={deleteAllSeededListingsMutation.isPending}
                      className="rounded-lg border border-rose-400/40 px-4 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleteAllSeededListingsMutation.isPending ? 'Removing Seeded Listings...' : 'Remove Seeded Demo Listings'}
                    </button>
                  ) : null}
                </div>
              </div>

              {myListings.length === 0 ? (
                <p className="mt-4 text-sm text-gray-400">
                  No listings are currently owned by this admin account. Seed them above or create one from the sell flow.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {myListings.slice(0, 12).map((listing) => (
                    <article key={listing.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <div className="aspect-[4/3] bg-slate-900/80">
                        {listing.firstImage ? (
                          <img src={listing.firstImage} alt={listing.gpuName} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-gray-500">No image</div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col space-y-3 p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--pf-accent-primary)]">{listing.manufacturer}</p>
                            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-white">{listing.gpuName}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {listing.isDemoSeed ? (
                              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200">
                                Demo Seed
                              </span>
                            ) : null}
                            <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-gray-300">
                              {listing.condition || 'Used'}
                            </span>
                          </div>
                        </div>
                        <p className="mt-auto text-lg font-semibold text-white">{formatINR(listing.price)}</p>
                        <button
                          type="button"
                          onClick={() => deleteListingMutation.mutate(listing.id)}
                          disabled={deleteListingMutation.isPending}
                          className="w-full rounded-lg border border-rose-400/40 px-3 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deleteListingMutation.isPending ? 'Removing...' : 'Remove Listing'}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </SectionContainer>
    </Layout>
  );
}
