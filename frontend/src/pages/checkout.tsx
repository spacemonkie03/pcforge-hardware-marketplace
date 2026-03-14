import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { fetchAddresses } from '../features/addresses';
import { fetchCart } from '../features/cart';
import { checkoutOrder } from '../features/orders';
import { fetchPaymentMethods } from '../features/paymentMethods';
import { useUserStore } from '../store/useUserStore';
import { formatINR } from '../utils/currency';

export default function CheckoutPage() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  const [shippingAddressId, setShippingAddressId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [shippingAmount, setShippingAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const { data: cart = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: Boolean(user),
  });
  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    enabled: Boolean(user),
  });
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethods,
    enabled: Boolean(user),
  });

  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal + shippingAmount + taxAmount;

  const checkoutMutation = useMutation({
    mutationFn: checkoutOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setNotes('');
    },
  });

  return (
    <ContentPage
      title="Checkout"
      description="Checkout now uses your real saved cart, delivery addresses, and payment methods."
      actions={[
        { href: '/cart', label: 'View Cart' },
        { href: '/#marketplace', label: 'Continue Shopping', variant: 'secondary' },
      ]}
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Login required</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to check out your saved cart.</p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">Cart Items</h2>
              <div className="mt-5 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-[var(--pf-text-secondary)]">Your cart is empty.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">
                            {item.itemType} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-white">{formatINR(item.lineTotal)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">Delivery & Payment</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="pf-label">Shipping Address</label>
                  <select value={shippingAddressId} onChange={(event) => setShippingAddressId(event.target.value)} className="pf-input mt-2">
                    <option value="">Select address</option>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>
                        {address.fullName} - {address.city}
                        {address.isDefault ? ' (Default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="pf-label">Payment Method</label>
                  <select value={paymentMethodId} onChange={(event) => setPaymentMethodId(event.target.value)} className="pf-input mt-2">
                    <option value="">Select payment method</option>
                    {paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.label} - {method.type}
                        {method.isDefault ? ' (Default)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="pf-label">Shipping Amount</label>
                  <input type="number" min={0} value={shippingAmount} onChange={(event) => setShippingAmount(Number(event.target.value) || 0)} className="pf-input mt-2" />
                </div>
                <div>
                  <label className="pf-label">Tax Amount</label>
                  <input type="number" min={0} value={taxAmount} onChange={(event) => setTaxAmount(Number(event.target.value) || 0)} className="pf-input mt-2" />
                </div>
              </div>
              <div className="mt-4">
                <label className="pf-label">Notes</label>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="pf-input mt-2 min-h-[110px]" placeholder="Optional delivery or order notes" />
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{formatINR(shippingAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>{formatINR(taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 font-semibold text-white">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
                <button
                  type="button"
                  className="pf-button-primary mt-3 w-full"
                  disabled={cart.length === 0 || !shippingAddressId || !paymentMethodId || checkoutMutation.isPending}
                  onClick={() =>
                    checkoutMutation.mutate({
                      items: cart.map((item) => ({
                        itemType: item.itemType,
                        productId: item.productId || undefined,
                        listingId: item.listingId || undefined,
                        quantity: item.quantity,
                      })),
                      shippingAddressId,
                      paymentMethodId,
                      shippingAmount,
                      taxAmount,
                      notes,
                      clearCart: true,
                    })
                  }
                >
                  {checkoutMutation.isPending ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Required before placing</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-300">
                <li>{addresses.length > 0 ? 'Saved addresses are available.' : 'Add at least one saved address.'}</li>
                <li>{paymentMethods.length > 0 ? 'Saved payment methods are available.' : 'Add at least one payment method.'}</li>
                <li>{cart.length > 0 ? 'Cart contains items ready for checkout.' : 'Add items to the cart first.'}</li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/addresses" className="pf-button-secondary">Addresses</Link>
                <Link href="/payment-methods" className="pf-button-secondary">Payment Methods</Link>
              </div>
            </article>
          </div>
        </div>
      )}
    </ContentPage>
  );
}
