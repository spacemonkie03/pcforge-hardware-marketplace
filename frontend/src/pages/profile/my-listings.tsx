import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { PriceTag } from '../../components/ui/PriceTag';
import { SectionContainer } from '../../components/ui/SectionContainer';
import {
  deleteListing,
  fetchMyListingAnalytics,
  ListingAnalyticsItem,
  updateListing,
} from '../../features/listings';
import { useUserStore } from '../../store/useUserStore';

interface EditState {
  price: string;
  condition: string;
}

export default function MyListingsPage() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, EditState>>({});

  const isSeller = user?.role === 'SELLER' || user?.role === 'ADMIN';

  const { data: analytics = [] } = useQuery({
    queryKey: ['my-listings-analytics'],
    queryFn: fetchMyListingAnalytics,
    enabled: Boolean(isSeller),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { price?: number; condition?: string } }) =>
      updateListing(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['landing-listings'] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['landing-listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing'] });
    },
  });

  const totals = useMemo(() => {
    return analytics.reduce(
      (acc, item) => {
        acc.views += item.views;
        acc.saves += item.saves;
        return acc;
      },
      { views: 0, saves: 0 }
    );
  }, [analytics]);

  const startEdit = (item: ListingAnalyticsItem) => {
    setDrafts((current) => ({
      ...current,
      [item.listingId]: {
        price: String(item.price),
        condition: item.condition || '',
      },
    }));
    setEditingId(item.listingId);
  };

  const saveEdit = (id: number) => {
    const draft = drafts[id];
    if (!draft) {
      return;
    }

    updateMutation.mutate({
      id,
      payload: {
        price: Number(draft.price),
        condition: draft.condition,
      },
    });
  };

  return (
    <Layout>
      <SectionContainer
        title="My Listings"
        description="Track views, saves, and price performance for the listings you own. Edit pricing safely from here without leaving your seller workspace."
        actions={<ButtonPrimary href="/sell">Post New Listing</ButtonPrimary>}
      >
        {!user && (
          <Card className="p-8 text-center">
            <p className="text-lg font-semibold text-white">You are not logged in</p>
            <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
              Login with a seller or admin account to view listing analytics.
            </p>
          </Card>
        )}

        {user && !isSeller && (
          <Card className="p-8 text-center">
            <p className="text-lg font-semibold text-white">Seller access required</p>
            <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
              Only listing owners can view analytics, edit prices, or delete listings.
            </p>
          </Card>
        )}

        {isSeller && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Listings</p>
                <p className="mt-2 text-3xl font-semibold text-white">{analytics.length}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Total Views</p>
                <p className="mt-2 text-3xl font-semibold text-white">{totals.views}</p>
              </Card>
              <Card className="p-5">
                <p className="text-sm text-[var(--pf-text-secondary)]">Total Saves</p>
                <p className="mt-2 text-3xl font-semibold text-white">{totals.saves}</p>
              </Card>
            </div>

            <div className="grid gap-6">
              {analytics.map((item) => {
                const isEditing = editingId === item.listingId;
                const draft = drafts[item.listingId];

                return (
                  <Card key={item.listingId} className="p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--pf-accent-primary)]">Listing #{item.listingId}</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">{item.gpuName}</h2>
                        <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                          Posted {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </p>
                        <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                          Condition: {item.condition || 'Not specified'}
                        </p>
                      </div>

                      <div className="grid min-w-[280px] gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-[var(--pf-text-secondary)]">Views</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{item.views}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-[var(--pf-text-secondary)]">Saves</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{item.saves}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-[var(--pf-text-secondary)]">Price</p>
                          <div className="mt-2">
                            <PriceTag price={item.price} className="text-2xl" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isEditing && draft && (
                      <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="pf-label">Price</label>
                          <input
                            value={draft.price}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [item.listingId]: {
                                  ...draft,
                                  price: event.target.value,
                                },
                              }))
                            }
                            type="number"
                            className="pf-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="pf-label">Condition</label>
                          <input
                            value={draft.condition}
                            onChange={(event) =>
                              setDrafts((current) => ({
                                ...current,
                                [item.listingId]: {
                                  ...draft,
                                  condition: event.target.value,
                                },
                              }))
                            }
                            className="pf-input"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                      <ButtonSecondary href={`/listings/${item.listingId}`}>View</ButtonSecondary>
                      {isEditing ? (
                        <>
                          <ButtonPrimary onClick={() => saveEdit(item.listingId)} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save'}
                          </ButtonPrimary>
                          <ButtonSecondary onClick={() => setEditingId(null)}>Cancel</ButtonSecondary>
                        </>
                      ) : (
                        <ButtonSecondary onClick={() => startEdit(item)}>Edit</ButtonSecondary>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(item.listingId)}
                        className="pf-button-secondary border-red-400/30 text-red-300 hover:bg-red-500/10"
                      >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </Card>
                );
              })}

              {analytics.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-lg font-semibold text-white">No listings yet</p>
                  <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                    Create a listing to start collecting views, saves, and price history.
                  </p>
                  <div className="mt-6">
                    <Link href="/sell" className="pf-button-primary">
                      Create Listing
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </SectionContainer>
    </Layout>
  );
}
