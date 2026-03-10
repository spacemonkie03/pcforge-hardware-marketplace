import Link from 'next/link';
import { Product } from '../features/products';
import { useCompareStore } from '../store/useCompareStore';
import clsx from 'clsx';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const { ids, toggle } = useCompareStore();

  return (
    <div className="glass-panel p-4 transition-transform hover:-translate-y-1 hover:shadow-glow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs uppercase tracking-wide text-neonBlue">
          {product.category}
        </span>
        <button
          onClick={() => toggle(product.id)}
          className={clsx(
            'text-xs px-2 py-1 rounded-full border',
            ids.includes(product.id)
              ? 'border-neonBlue text-neonBlue'
              : 'border-white/20 text-gray-400'
          )}
        >
          Compare
        </button>
      </div>
      <div className="mb-3">
        <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400">{product.brand}</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-neonBlue">
            ${Number(product.price).toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>
            ⭐ {product.rating.toFixed(1)} ({product.ratingCount})
          </p>
          <Link
            href={`/products/${product.id}`}
            className="mt-1 inline-block text-neonBlue hover:underline"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

