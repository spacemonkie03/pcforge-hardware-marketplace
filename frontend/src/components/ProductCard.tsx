import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '../features/products';
import { addCartItem } from '../features/cart';
import { useCompareStore } from '../store/useCompareStore';
import { SelectedParts, usePcBuilderStore } from '../store/usePcBuilderStore';
import { useUserStore } from '../store/useUserStore';
import { getFallbackImageForProductCategory } from '../utils/imageAssets';
import { formatINR } from '../utils/currency';

interface Props {
  product: Product;
}

const buildKeySpecs = (product: Product) => {
  const specs = product.specs || {};

  switch (product.category) {
    case 'CPU':
      return [specs.architecture, specs.cores && `${specs.cores} cores`, specs.boostClockGHz && `${specs.boostClockGHz} GHz boost`]
        .filter(Boolean)
        .join(' • ');
    case 'GPU':
      return [specs.chipset, specs.vramGb && `${specs.vramGb}GB`, specs.vramType]
        .filter(Boolean)
        .join(' • ');
    case 'MOTHERBOARD':
      return [specs.chipset, product.compatibility?.motherboardSocket, product.compatibility?.ramType]
        .filter(Boolean)
        .join(' • ');
    case 'RAM':
      return [specs.capacityGb && `${specs.capacityGb}GB`, product.compatibility?.ramType, specs.speedMtS && `${specs.speedMtS} MT/s`]
        .filter(Boolean)
        .join(' • ');
    case 'STORAGE':
      return [specs.storageType, specs.capacityGb && `${specs.capacityGb}GB`, specs.interface]
        .filter(Boolean)
        .join(' • ');
    case 'PSU':
      return [product.compatibility?.psuWattage && `${product.compatibility.psuWattage}W`, specs.efficiency, specs.modularity]
        .filter(Boolean)
        .join(' • ');
    default:
      return [product.brand, product.category].filter(Boolean).join(' • ');
  }
};

export const ProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  const { ids: compareIds, toggle: toggleCompare } = useCompareStore();
  const setPart = usePcBuilderStore((s) => s.setPart);
  const cartMutation = useMutation({
    mutationFn: (redirectToCheckout: boolean) =>
      addCartItem({
        itemType: 'PRODUCT',
        productId: product.id,
        quantity: 1,
      }).then(() => redirectToCheckout),
    onSuccess: async (redirectToCheckout) => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (redirectToCheckout) {
        router.push('/checkout');
      }
    },
  });

  const handleAddToBuild = () => {
    const categoryMap: Record<string, keyof SelectedParts> = {
      CPU: 'cpuId',
      MOTHERBOARD: 'motherboardId',
      GPU: 'gpuId',
      RAM: 'ramId',
      STORAGE: 'storageId',
      PSU: 'psuId',
      CASE: 'caseId',
      COOLER: 'coolerId',
      FAN: 'fanId',
    };

    const key = categoryMap[product.category] as keyof SelectedParts;
    if (key) {
      setPart(key, product.id);
    }
  };

  const keySpecs = buildKeySpecs(product);

  return (
    <div className="pf-card pf-card-hover group flex h-full flex-col overflow-hidden p-4">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[10px] border border-[var(--pf-border)] bg-[rgba(255,255,255,0.03)]">
        <img
          src={product.images?.[0] || getFallbackImageForProductCategory(product.category)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--pf-accent-secondary)]">
            {product.category}
          </p>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-6 text-white">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">{product.brand}</p>
          <p className="mt-1 min-h-[20px] text-sm text-[var(--pf-text-tertiary)]">
            {keySpecs || 'Detailed specs available on product page'}
          </p>
        </div>
        <button
          onClick={() => toggleCompare(product.id)}
          className={clsx(
            'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            compareIds.includes(product.id)
              ? 'border-[rgba(96,165,250,0.4)] bg-[rgba(37,99,235,0.14)] text-[var(--pf-accent-secondary)]'
              : 'border-[var(--pf-border)] text-[var(--pf-text-secondary)] hover:border-[var(--pf-border-strong)] hover:text-white'
          )}
        >
          Compare
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="pf-price">{formatINR(product.price)}</p>
          <p className={clsx('mt-1 text-sm', product.inStock ? 'text-emerald-300' : 'text-red-300')}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>
        </div>
        <div className="text-right text-xs text-[var(--pf-text-secondary)]">
          <p>Seller</p>
          <p className="mt-1 font-medium text-white">{product.seller?.name || 'Marketplace seller'}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--pf-border)] pt-4 text-sm text-[var(--pf-text-secondary)]">
        <span>Rating {product.rating.toFixed(1)}</span>
        <span>{product.ratingCount} reviews</span>
      </div>

      <div className="mt-4 grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product.id}`}
            className="pf-button-secondary w-full justify-center"
          >
            Details
          </Link>
          <button
            onClick={handleAddToBuild}
            className="pf-button-primary w-full justify-center"
          >
            Add to Build
          </button>
        </div>
        {user && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => cartMutation.mutate(false)}
              className="pf-button-secondary w-full justify-center"
            >
              Add to Cart
            </button>
            <button
              onClick={() => cartMutation.mutate(true)}
              className="pf-button-ghost w-full justify-center border border-[var(--pf-border)]"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
