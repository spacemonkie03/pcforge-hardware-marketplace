import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { clearCart, fetchCart, removeCartItem, updateCartItem } from '../features/cart';
import { useUserStore } from '../store/useUserStore';
import { formatINR } from '../utils/currency';

export default function CartPage() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  const { data: cart = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: Boolean(user),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => updateCartItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <ContentPage
      title="Cart"
      description="Review saved products and listings, update quantities, and move directly into checkout."
      actions={[
        { href: '/#marketplace', label: 'Browse Products' },
        { href: '/checkout', label: 'Checkout', variant: 'secondary' },
      ]}
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Login required</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to save cart items across your account.</p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : isLoading ? (
        <p className="text-sm text-[var(--pf-text-secondary)]">Loading cart...</p>
      ) : cart.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8">
            <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Add products or listings from browse cards and detail pages to start checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#marketplace" className="pf-button-primary">
                Find Components
              </Link>
              <Link href="/wishlist" className="pf-button-secondary">
                Review Wishlist
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Cart supports</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-300">
              <li>Products from the catalog.</li>
              <li>Marketplace listings, including GPU listings.</li>
              <li>Direct checkout through your saved address and payment method.</li>
            </ul>
          </article>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">{item.itemType}</p>
                      <h2 className="mt-1 text-lg font-semibold text-white">{item.name}</h2>
                      <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">{item.brand}</p>
                      {item.sellerName && <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">Seller: {item.sellerName}</p>}
                      {item.condition && <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">Condition: {item.condition}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:items-end">
                    <div className="w-24">
                      <label className="pf-label">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          updateMutation.mutate({
                            id: item.id,
                            quantity: Math.max(1, Number(event.target.value) || 1),
                          })
                        }
                        className="pf-input mt-2"
                      />
                    </div>
                    <p className="text-lg font-semibold text-white">{formatINR(item.lineTotal)}</p>
                    <button
                      type="button"
                      className="pf-button-secondary border-red-400/30 text-red-300 hover:bg-red-500/10"
                      onClick={() => removeMutation.mutate(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 font-semibold text-white">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/checkout" className="pf-button-primary justify-center">
                Proceed to Checkout
              </Link>
              <button type="button" className="pf-button-secondary" onClick={() => clearMutation.mutate()}>
                Clear Cart
              </button>
            </div>
          </article>
        </div>
      )}
    </ContentPage>
  );
}
