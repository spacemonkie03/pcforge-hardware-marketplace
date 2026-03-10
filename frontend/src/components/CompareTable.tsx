import React from 'react';
import { Product } from '../features/products';

interface Props {
  products: Product[];
}

export const CompareTable: React.FC<Props> = ({ products }) => {
  if (!products.length) return null;

  return (
    <div className="glass-panel p-4 mt-6 overflow-x-auto">
      <h3 className="text-sm font-semibold mb-3">Comparison</h3>
      <table className="min-w-full text-xs">
        <thead>
          <tr>
            <th className="text-left text-gray-400">Spec</th>
            {products.map((p) => (
              <th key={p.id} className="text-left">
                {p.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-gray-400">Brand</td>
            {products.map((p) => (
              <td key={p.id}>{p.brand}</td>
            ))}
          </tr>
          <tr>
            <td className="text-gray-400">Price</td>
            {products.map((p) => (
              <td key={p.id}>${Number(p.price).toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td className="text-gray-400">Rating</td>
            {products.map((p) => (
              <td key={p.id}>
                {p.rating.toFixed(1)} ({p.ratingCount})
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

