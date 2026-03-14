import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addCartItem } from '../../features/cart';
import { fetchProduct } from '../../features/products';
import { Layout } from '../../components/Layout';
import { PriceHistoryChart } from '../../components/PriceHistoryChart';
import { Card } from '../../components/ui/Card';
import { PriceTag } from '../../components/ui/PriceTag';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { useUserStore } from '../../store/useUserStore';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  const cartMutation = useMutation({
    mutationFn: (redirectToCheckout: boolean) =>
      addCartItem({
        itemType: 'PRODUCT',
        productId: id!,
        quantity: 1,
      }).then(() => redirectToCheckout),
    onSuccess: async (redirectToCheckout) => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (redirectToCheckout) {
        router.push('/checkout');
      }
    },
  });

  if (!id) {
    return null;
  }

  return (
    <Layout>
      <SectionContainer
        title={data?.name || 'Component Details'}
        description="Product pages now share the same dark cards, spacing, and information hierarchy as the landing and browse experiences."
      >
        {isLoading && <p className="text-sm text-[var(--pf-text-secondary)]">Loading...</p>}
        {data && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="space-y-5 p-6 md:col-span-2">
              <div>
                <p className="text-sm text-[var(--pf-text-secondary)]">{data.brand}</p>
                {data.seller?.name && (
                  <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">Seller: {data.seller.name}</p>
                )}
              </div>
              <PriceTag price={Number(data.price)} />
              <p className="text-sm text-[var(--pf-text-secondary)]">
                Rating {data.rating.toFixed(1)} ({data.ratingCount}) - {data.inStock ? 'In stock' : 'Out of stock'}
              </p>
              {user && (
                <div className="grid gap-2 sm:grid-cols-2">
                  <button type="button" className="pf-button-secondary w-full justify-center" onClick={() => cartMutation.mutate(false)}>
                    Add to Cart
                  </button>
                  <button type="button" className="pf-button-primary w-full justify-center" onClick={() => cartMutation.mutate(true)}>
                    Buy Now
                  </button>
                </div>
              )}
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--pf-accent-primary)]">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(data.specs || {}).map(([key, value]) => (
                      <tr key={key} className="border-t border-white/5">
                        <td className="py-2 pr-4 text-[var(--pf-text-secondary)]">{key}</td>
                        <td className="py-2 text-white">{String(value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card className="p-5">
              <PriceHistoryChart history={(data as any).priceHistory || []} />
            </Card>
          </div>
        )}
      </SectionContainer>
    </Layout>
  );
}
