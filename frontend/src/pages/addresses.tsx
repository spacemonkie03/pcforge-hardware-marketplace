import Link from 'next/link';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import { createAddress, deleteAddress, fetchAddresses, updateAddress } from '../features/addresses';
import { useUserStore } from '../store/useUserStore';

const initialForm = {
  fullName: '',
  phoneNumber: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  landmark: '',
  label: '',
  isDefault: false,
};

export default function AddressesPage() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initialForm);
  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: fetchAddresses,
    enabled: Boolean(user),
  });

  const createMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setForm(initialForm);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => updateAddress(id, { isDefault: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });

  return (
    <ContentPage
      title="Addresses"
      description="Manage saved delivery addresses for checkout and future order fulfillment."
      actions={[
        { href: '/profile', label: 'Back to Profile' },
        { href: '/checkout', label: 'Go to Checkout', variant: 'secondary' },
      ]}
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Login required</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to manage saved delivery addresses and shipping preferences.</p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Add Address</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['fullName', 'Full Name'],
                ['phoneNumber', 'Phone Number'],
                ['line1', 'Address Line 1'],
                ['line2', 'Address Line 2'],
                ['city', 'City'],
                ['state', 'State'],
                ['postalCode', 'Postal Code'],
                ['country', 'Country'],
                ['landmark', 'Landmark'],
                ['label', 'Label'],
              ].map(([key, label]) => (
                <div key={key} className={key === 'line1' || key === 'line2' ? 'md:col-span-2' : ''}>
                  <label className="pf-label">{label}</label>
                  <input
                    value={(form as Record<string, string | boolean>)[key] as string}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="pf-input mt-2"
                  />
                </div>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))}
              />
              Set as default address
            </label>
            <div className="mt-6">
              <button
                type="button"
                className="pf-button-primary"
                onClick={() => createMutation.mutate(form)}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Saved Addresses</h2>
            {isLoading ? (
              <p className="mt-4 text-sm text-[var(--pf-text-secondary)]">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--pf-text-secondary)]">No saved addresses yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">{address.fullName}</p>
                          {address.isDefault && <span className="pf-badge pf-badge-accent">Default</span>}
                          {address.label && <span className="pf-badge">{address.label}</span>}
                        </div>
                        <p className="mt-2 text-sm text-gray-300">
                          {address.line1}
                          {address.line2 ? `, ${address.line2}` : ''}
                        </p>
                        <p className="text-sm text-gray-300">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-300">{address.country}</p>
                        <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">{address.phoneNumber}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {!address.isDefault && (
                          <button
                            type="button"
                            className="pf-button-secondary"
                            onClick={() => setDefaultMutation.mutate(address.id)}
                            disabled={setDefaultMutation.isPending}
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          type="button"
                          className="pf-button-secondary border-red-400/30 text-red-300 hover:bg-red-500/10"
                          onClick={() => deleteMutation.mutate(address.id)}
                          disabled={deleteMutation.isPending}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      )}
    </ContentPage>
  );
}
