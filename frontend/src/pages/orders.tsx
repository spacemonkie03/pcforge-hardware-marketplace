import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { fetchMyOrders } from '../features/orders';
import { formatINR } from '../utils/currency';
import { useUserStore } from '../store/useUserStore';

export default function OrdersPage() {
  const user = useUserStore((s) => s.user);
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', 'me'],
    queryFn: fetchMyOrders,
    enabled: Boolean(user),
  });

  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <ContentPage
      title="Orders"
      description="Track purchase history, order totals, and delivery/payment status in one place."
      actions={[
        { href: '/#marketplace', label: 'Browse Products' },
        { href: '/profile', label: 'Back to Profile', variant: 'secondary' },
      ]}
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Login required</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to view purchase history, order totals, and future shipment updates.</p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--pf-accent-primary)]" />
          <span className="ml-3 text-sm text-[var(--pf-text-secondary)]">Loading orders...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Order Count</p>
              <p className="mt-2 text-3xl font-semibold text-white">{orders.length}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Total Spend</p>
              <p className="mt-2 text-3xl font-semibold text-white">{formatINR(totalSpent)}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-[var(--pf-text-secondary)]">Latest Status</p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {orders[0]?.status ? String(orders[0].status) : 'No orders'}
              </p>
            </article>
          </div>

          {orders.length === 0 ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8">
                <h2 className="text-xl font-semibold text-white">No orders yet</h2>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Orders appear here after checkout. You can review totals, statuses, and item-level details for every purchase.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/#marketplace" className="pf-button-primary">
                    Browse Inventory
                  </Link>
                  <Link href="/checkout" className="pf-button-secondary">
                    Review Checkout
                  </Link>
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Order page will cover</p>
                <ul className="mt-4 space-y-3 text-sm text-gray-300">
                  <li>Placed, shipped, delivered, and cancelled status tags.</li>
                  <li>Order totals and item-level breakdowns.</li>
                  <li>Quick links to saved addresses and payment methods.</li>
                </ul>
              </article>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => (
                <article key={order.id} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Order #{order.id}</p>
                      <h2 className="mt-2 text-xl font-semibold text-white">{String(order.status)}</h2>
                      <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                        Placed {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                      <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">
                        Payment: {String(order.paymentStatus)}
                        {order.paymentMethodLabel ? ` via ${order.paymentMethodLabel}` : ''}
                      </p>
                      {order.shippingAddress && (
                        <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">
                          Shipping to {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      )}
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-[var(--pf-text-secondary)]">Order Total</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{formatINR(order.total)}</p>
                    </div>
                  </div>
                  {order.items && order.items.length > 0 && (
                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--pf-accent-primary)]">Items</p>
                      <div className="mt-3 space-y-2 text-sm text-gray-300">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4">
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span>{formatINR(item.lineTotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </ContentPage>
  );
}
