import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContentPage } from '../components/ContentPage';
import {
  createPaymentMethod,
  deletePaymentMethod,
  fetchPaymentMethods,
  fetchPaymentOptions,
  updatePaymentMethod,
} from '../features/paymentMethods';
import { useUserStore } from '../store/useUserStore';

export default function PaymentMethodsPage() {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  const { data: options = [] } = useQuery({
    queryKey: ['payment-options'],
    queryFn: fetchPaymentOptions,
  });
  const { data: methods = [], isLoading } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethods,
    enabled: Boolean(user),
  });

  const [type, setType] = useState('');
  const [provider, setProvider] = useState('');
  const [label, setLabel] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [details, setDetails] = useState<Record<string, string>>({});

  const selectedOption = useMemo(() => options.find((option) => option.type === type), [options, type]);

  const createMutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setType('');
      setProvider('');
      setLabel('');
      setIsDefault(false);
      setDetails({});
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => updatePaymentMethod(id, { isDefault: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  });

  return (
    <ContentPage
      title="Payment Methods"
      description="Manage saved payment methods using the flexible backend model, with room to add more payment types later."
      actions={[
        { href: '/profile', label: 'Back to Profile' },
        { href: '/checkout', label: 'Checkout', variant: 'secondary' },
      ]}
    >
      {!user ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-white">Login required</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to manage saved payment methods and faster checkout options.</p>
          <Link href="/login" className="pf-button-primary mt-6 inline-flex">
            Sign In
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Add Payment Method</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="pf-label">Type</label>
                <select
                  value={type}
                  onChange={(event) => {
                    const nextType = event.target.value;
                    setType(nextType);
                    const nextOption = options.find((option) => option.type === nextType);
                    setProvider(nextOption?.providers[0] || '');
                    setDetails({});
                  }}
                  className="pf-input mt-2"
                >
                  <option value="">Select payment type</option>
                  {options.map((option) => (
                    <option key={option.type} value={option.type}>
                      {option.type.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="pf-label">Provider</label>
                <select
                  value={provider}
                  onChange={(event) => setProvider(event.target.value)}
                  className="pf-input mt-2"
                  disabled={!selectedOption}
                >
                  <option value="">Select provider</option>
                  {selectedOption?.providers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="pf-label">Label</label>
                <input value={label} onChange={(event) => setLabel(event.target.value)} className="pf-input mt-2" />
              </div>

              {selectedOption?.fields.map((field) => (
                <div key={field}>
                  <label className="pf-label">{field}</label>
                  <input
                    value={details[field] || ''}
                    onChange={(event) =>
                      setDetails((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className="pf-input mt-2"
                  />
                </div>
              ))}

              <label className="flex items-center gap-3 text-sm text-gray-300">
                <input type="checkbox" checked={isDefault} onChange={(event) => setIsDefault(event.target.checked)} />
                Set as default payment method
              </label>

              <button
                type="button"
                className="pf-button-primary"
                disabled={!type || !provider || !label || createMutation.isPending}
                onClick={() =>
                  createMutation.mutate({
                    type,
                    provider,
                    label,
                    details,
                    isDefault,
                  })
                }
              >
                {createMutation.isPending ? 'Saving...' : 'Save Payment Method'}
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">Saved Payment Methods</h2>
            {isLoading ? (
              <p className="mt-4 text-sm text-[var(--pf-text-secondary)]">Loading payment methods...</p>
            ) : methods.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--pf-text-secondary)]">No saved payment methods yet.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {methods.map((method) => (
                  <div key={method.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-white">{method.label}</p>
                          {method.isDefault && <span className="pf-badge pf-badge-accent">Default</span>}
                          <span className="pf-badge">{method.type.replaceAll('_', ' ')}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-300">{method.provider}</p>
                        {method.details && Object.keys(method.details).length > 0 && (
                          <div className="mt-3 space-y-1 text-sm text-[var(--pf-text-secondary)]">
                            {Object.entries(method.details).map(([key, value]) => (
                              <p key={key}>
                                {key}: {String(value)}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {!method.isDefault && (
                          <button
                            type="button"
                            className="pf-button-secondary"
                            onClick={() => setDefaultMutation.mutate(method.id)}
                            disabled={setDefaultMutation.isPending}
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          type="button"
                          className="pf-button-secondary border-red-400/30 text-red-300 hover:bg-red-500/10"
                          onClick={() => deleteMutation.mutate(method.id)}
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
