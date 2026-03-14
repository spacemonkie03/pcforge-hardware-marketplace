import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { fetchListings, fetchMyListingAnalytics } from '../features/listings';
import { fetchMyOrders } from '../features/orders';
import { fetchProducts } from '../features/products';
import { fetchSellerAnalytics } from '../features/sellers';
import { fetchAdminUserStats } from '../features/users';
import { fetchWishlist } from '../features/wishlist';
import { useUserStore } from '../store/useUserStore';

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(value))
    : 'Not available';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  const { data: orders = [] } = useQuery({
    queryKey: ['profile-orders'],
    queryFn: fetchMyOrders,
    enabled: Boolean(user),
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ['profile-wishlist'],
    queryFn: fetchWishlist,
    enabled: Boolean(user),
  });

  const { data: listingAnalytics = [] } = useQuery({
    queryKey: ['profile-listing-analytics'],
    queryFn: fetchMyListingAnalytics,
    enabled: Boolean(user) && isSeller,
  });

  const { data: sellerAnalytics } = useQuery({
    queryKey: ['profile-seller-analytics', user?.id],
    queryFn: () => fetchSellerAnalytics(),
    enabled: Boolean(user?.id) && isSeller,
  });

  const { data: adminUserStats } = useQuery({
    queryKey: ['profile-admin-user-stats'],
    queryFn: fetchAdminUserStats,
    enabled: Boolean(user) && isAdmin,
  });

  const { data: adminListings = [] } = useQuery({
    queryKey: ['profile-admin-listings'],
    queryFn: () => fetchListings(),
    enabled: Boolean(user) && isAdmin,
  });

  const { data: adminProducts = [] } = useQuery({
    queryKey: ['profile-admin-products'],
    queryFn: fetchProducts,
    enabled: Boolean(user) && isAdmin,
  });

  const recentOrders = [...orders]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 3);
  const wishlistPreview = [...wishlist]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 3);
  const savedItemsCount = wishlist.length;
  const listingViews = listingAnalytics.reduce((sum, item) => sum + item.views, 0);
  const listingSaves = listingAnalytics.reduce((sum, item) => sum + item.saves, 0);
  const recentActivity = [
    recentOrders[0]
      ? {
          label: 'Latest order',
          value: `${formatCurrency(recentOrders[0].total)} on ${formatDate(recentOrders[0].createdAt)}`,
        }
      : null,
    wishlistPreview[0]
      ? {
          label: 'Wishlist focus',
          value: `${wishlistPreview[0].gpuName} from ${wishlistPreview[0].manufacturer}`,
        }
      : null,
    isSeller && listingAnalytics[0]
      ? {
          label: 'Top seller signal',
          value: `${listingAnalytics[0].gpuName} has ${listingAnalytics[0].views} views and ${listingAnalytics[0].saves} saves`,
        }
      : null,
    {
      label: 'Account status',
      value: `${user?.role || 'USER'} access active`,
    },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <ContentPage
      title="Account Dashboard"
      description="Your account summary, recent marketplace activity, and role-aware signals for buying, selling, and platform access."
      actions={
        user
          ? [
              { href: '/marketplace', label: 'Browse Marketplace' },
              ...(isSeller
                ? [
                    {
                      href: '/dashboard/seller',
                      label: 'Seller Dashboard',
                      variant: 'secondary' as const,
                    },
                  ]
                : []),
            ]
          : [{ href: '/login', label: 'Login to Continue' }]
      }
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">You are not logged in</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Login to view your account, saved items, orders, and seller tools.
          </p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Account Summary</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">{user.name}</h2>
              <p className="mt-2 text-sm text-gray-400">{user.email}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-[var(--pf-accent-primary)]/30 px-3 py-1 text-xs font-medium text-[var(--pf-accent-primary)]">
                  Role: {user.role}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-gray-300">
                  Marketplace account active
                </span>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Account Status</h2>
              <div className="mt-4 grid gap-3 text-sm text-gray-300">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  Signed in as <span className="font-semibold text-white">{user.role}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  Saved items ready: <span className="font-semibold text-white">{savedItemsCount}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  Seller tools: <span className="font-semibold text-white">{isSeller ? 'Enabled' : 'Not enabled'}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  Admin access: <span className="font-semibold text-white">{isAdmin ? 'Enabled' : 'Not enabled'}</span>
                </div>
              </div>
            </article>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Recent Orders</p>
              <p className="mt-2 text-3xl font-semibold text-white">{orders.length}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Saved Items</p>
              <p className="mt-2 text-3xl font-semibold text-white">{savedItemsCount}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Marketplace Activity</p>
              <p className="mt-2 text-3xl font-semibold text-white">{recentActivity.length}</p>
            </article>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Recent Orders</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Last 3 orders</h2>
                </div>
                <span className="text-sm text-[var(--pf-text-secondary)]">{recentOrders.length} shown</span>
              </div>
              {recentOrders.length === 0 ? (
                <p className="mt-5 text-sm leading-6 text-gray-400">
                  You have not placed any orders yet. Use the marketplace to start building your purchase history.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">Order #{order.id.slice(0, 8)}</p>
                          <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">{formatCurrency(order.total)}</p>
                          <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">
                            {order.status} / {order.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Wishlist Preview</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Saved items you can revisit</h2>
              {wishlistPreview.length === 0 ? (
                <p className="mt-5 text-sm leading-6 text-gray-400">
                  Your wishlist is empty. Save listings from the marketplace to track them here.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {wishlistPreview.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <p className="text-sm font-semibold text-white">{item.gpuName}</p>
                      <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">{item.manufacturer}</p>
                      <p className="mt-3 text-sm font-semibold text-[var(--pf-accent-primary)]">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Marketplace Activity</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Recent signals from your account</h2>
              <div className="mt-5 space-y-3">
                {recentActivity.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-text-secondary)]">{item.label}</p>
                    <p className="mt-2 text-sm text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Saved Items</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Saved-item count and buyer readiness</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Saved items</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{savedItemsCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Unique sellers</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {new Set(wishlist.map((item) => item.seller.id)).size}
                  </p>
                </div>
              </div>
            </article>
          </div>

          {isSeller && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Seller View</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Your listing performance snapshot</h2>
                </div>
                <Link
                  href="/dashboard/seller"
                  className="rounded-full border border-[var(--pf-accent-primary)]/35 px-4 py-2 text-sm font-medium text-[var(--pf-accent-primary)] transition-colors hover:bg-[var(--pf-accent-primary)]/10"
                >
                  Open Seller Dashboard
                </Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Active listings</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{listingAnalytics.length}</p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Listing views</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{listingViews}</p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Listing saves</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{listingSaves}</p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Products published</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{sellerAnalytics?.totalProducts ?? 0}</p>
                </article>
              </div>
            </section>
          )}

          {isAdmin && (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--pf-accent-primary)]">Admin View</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Platform stats at a glance</h2>
                </div>
                <Link
                  href="/dashboard/admin"
                  className="rounded-full border border-cyan-300/35 px-4 py-2 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-300/10"
                >
                  Open Admin Panel
                </Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Platform stats</p>
                  <p className="mt-2 text-sm leading-6 text-white">
                    Inventory, users, and seller surfaces currently visible in the running marketplace.
                  </p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Total listings</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{adminListings.length}</p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Users count</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{adminUserStats?.totalUsers ?? 0}</p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-[var(--pf-text-secondary)]">Products</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{adminProducts.length}</p>
                </article>
              </div>
            </section>
          )}
        </div>
      )}
    </ContentPage>
  );
}
