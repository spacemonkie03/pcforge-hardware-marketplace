import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { ListingCard } from '../components/ListingCard';
import { fetchWishlist } from '../features/wishlist';
import { useUserStore } from '../store/useUserStore';

export default function WishlistPage() {
  const user = useUserStore((s) => s.user);
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: Boolean(user),
  });

  return (
    <ContentPage
      title="Wishlist"
      description="Saved listings stay here so you can compare pricing, revisit sellers, and narrow down the parts you want to buy next."
      actions={[
        { href: '/#marketplace', label: 'Browse Listings' },
        { href: '/profile', label: 'Profile', variant: 'secondary' },
      ]}
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Login required</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Sign in to save listings, track price changes, and build a shortlist before checkout.
          </p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--pf-accent-primary)]" />
          <span className="ml-3 text-sm text-[var(--pf-text-secondary)]">Loading saved listings...</span>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">No saved listings yet</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Use the listing detail page to save GPUs you want to revisit. Saved listings make it easier to compare condition, seller quality, and pricing before you buy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#marketplace" className="pf-button-primary">
                Explore Listings
              </Link>
              <Link href="/deals" className="pf-button-secondary">
                Check Deals
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">What belongs here</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-300">
              <li>Saved listings from the marketplace.</li>
              <li>Fast access to prices, conditions, and seller names.</li>
              <li>A shortlist you can revisit before moving items into cart and checkout.</li>
            </ul>
          </article>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Saved Listings</p>
              <p className="mt-2 text-3xl font-semibold text-white">{wishlist.length}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Lowest Price</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(Math.min(...wishlist.map((item) => item.price)))}
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Unique Sellers</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {new Set(wishlist.map((item) => item.seller.id)).size}
              </p>
            </article>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlist.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </ContentPage>
  );
}
