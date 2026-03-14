import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ListingSummary } from '../../features/listings';
import { addCartItem } from '../../features/cart';
import { useUserStore } from '../../store/useUserStore';
import { getFallbackImageForListing } from '../../utils/imageAssets';
import { Badge } from './Badge';
import { Card } from './Card';
import { PriceTag } from './PriceTag';

interface Props {
  listing: ListingSummary;
}

export const ListingCard = ({ listing }: Props) => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageSrc = listing.firstImage || getFallbackImageForListing();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsImageLoaded(false);
  }, [imageSrc]);

  const cartMutation = useMutation({
    mutationFn: (redirectToCheckout: boolean) =>
      addCartItem({
        itemType: 'LISTING',
        listingId: listing.id,
        quantity: 1,
      }).then(() => redirectToCheckout),
    onSuccess: async (redirectToCheckout) => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (redirectToCheckout) {
        router.push('/checkout');
      }
    },
  });

  return (
    <Card elevated className="group flex h-full flex-col p-4">
      <div className="overflow-hidden rounded-[10px] border border-[var(--pf-border)] bg-[rgba(255,255,255,0.03)]">
        <div className="relative aspect-[4/3]">
          {!isImageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]" />
          )}
          <img
            src={imageSrc}
            alt={listing.gpuName}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--pf-accent-secondary)]">
            GPU Listing
          </p>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-white">{listing.gpuName}</h3>
          <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">{listing.manufacturer}</p>
          <p className="mt-1 text-sm text-[var(--pf-text-tertiary)]">
            Seller:{' '}
            <Link href={`/sellers/${listing.seller.id}`} className="text-white transition-colors hover:text-[var(--pf-accent-secondary)]">
              {listing.seller.name}
            </Link>
          </p>
        </div>
        {listing.condition && <Badge variant="accent">{listing.condition}</Badge>}
      </div>

      <div className="mt-auto space-y-4 pt-5">
        <PriceTag price={listing.price} />
        <div className="grid gap-2">
          <Link href={`/listings/${listing.id}`} className="pf-button-secondary w-full justify-center">
            View listing
          </Link>
          {user && (
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="pf-button-secondary w-full justify-center" onClick={() => cartMutation.mutate(false)}>
                Add to cart
              </button>
              <button type="button" className="pf-button-primary w-full justify-center" onClick={() => cartMutation.mutate(true)}>
                Buy now
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
