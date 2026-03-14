import React from 'react';
import { Product } from '../features/products';
import { formatINR } from '../utils/currency';

interface Props {
  products: Product[];
}

export const CompareTable: React.FC<Props> = ({ products }) => {
  if (!products.length) return null;

  return (
    <div className="overflow-x-auto">
      <h3 className="mb-3 text-sm font-semibold text-white">Comparison</h3>
      <table className="min-w-full text-xs">
        <thead>
          <tr className="border-b border-white/10 text-left text-[var(--pf-text-secondary)]">
            <th className="py-2 pr-4">Spec</th>
            {products.map((p) => (
              <th key={p.id} className="py-2 pr-4 text-left">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/5">
            <td className="py-2 pr-4 text-[var(--pf-text-secondary)]">Brand</td>
            {products.map((p) => (
              <td key={p.id} className="py-2 pr-4 text-white">{p.brand}</td>
            ))}
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-2 pr-4 text-[var(--pf-text-secondary)]">Price</td>
            {products.map((p) => (
              <td key={p.id} className="py-2 pr-4 text-white">{formatINR(p.price)}</td>
            ))}
          </tr>
          <tr>
            <td className="py-2 pr-4 text-[var(--pf-text-secondary)]">Rating</td>
            {products.map((p) => (
              <td key={p.id} className="py-2 pr-4 text-white">
                {p.rating.toFixed(1)} ({p.ratingCount})
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

