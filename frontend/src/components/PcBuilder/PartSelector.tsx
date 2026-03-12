import React from 'react';
import { Product } from '../../features/products';

interface Props {
  label: string;
  options: Product[];
  value?: string;
  onChange: (value?: string) => void;
}

export const PartSelector: React.FC<Props> = ({ label, options, value, onChange }) => {
  const selectedProduct = options.find(p => p.id === value);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - ${Number(p.price).toFixed(2)}
          </option>
        ))}
      </select>
      {selectedProduct && (
        <div className="text-xs text-gray-400 bg-gray-800/30 rounded px-2 py-1">
          Selected: {selectedProduct.name} (${Number(selectedProduct.price).toFixed(2)})
        </div>
      )}
    </div>
  );
};

