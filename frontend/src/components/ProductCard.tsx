import Link from 'next/link';
import { Product } from '../features/products';
import { useCompareStore } from '../store/useCompareStore';
import { SelectedParts, usePcBuilderStore } from '../store/usePcBuilderStore';
import clsx from 'clsx';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { ids: compareIds, toggle: toggleCompare } = useCompareStore();
  const setPart = usePcBuilderStore((s) => s.setPart);

  const handleAddToBuild = () => {
    // Map category to store key
    const categoryMap: Record<string, keyof SelectedParts> = {
      CPU: 'cpuId',
      MOTHERBOARD: 'motherboardId',
      GPU: 'gpuId',
      RAM: 'ramId',
      STORAGE: 'storageId',
      PSU: 'psuId',
      CASE: 'caseId',
      COOLER: 'coolerId',
      FAN: 'fanId'
    };

    const key = categoryMap[product.category];
    if (key) {
      setPart(key, product.id);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 group">
      {/* Product Image Placeholder */}
      <div className="aspect-square bg-gray-700/50 rounded-lg mb-4 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg opacity-50 group-hover:opacity-75 transition-opacity" />
      </div>

      <div className="flex justify-between items-start mb-3">
        <span className="text-xs uppercase tracking-wide text-blue-400 font-medium">
          {product.category}
        </span>
        <button
          onClick={() => toggleCompare(product.id)}
          className={clsx(
            'text-xs px-2 py-1 rounded-full border transition-colors',
            compareIds.includes(product.id)
              ? 'border-blue-400 text-blue-400 bg-blue-400/10'
              : 'border-white/20 text-gray-400 hover:border-blue-400 hover:text-blue-400'
          )}
        >
          Compare
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-blue-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-400">{product.brand}</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-bold text-blue-400">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className={clsx(
            'text-xs',
            product.inStock ? 'text-green-400' : 'text-red-400'
          )}>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-400">★</span>
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.ratingCount})</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href={`/products/${product.id}`}
          className="flex-1 text-center px-3 py-2 rounded-lg border border-white/20 text-xs font-medium hover:border-blue-400 hover:text-blue-400 transition-colors"
        >
          Details
        </Link>
        <button
          onClick={handleAddToBuild}
          className="flex-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
        >
          Add to Build
        </button>
      </div>
    </div>
  );
};

