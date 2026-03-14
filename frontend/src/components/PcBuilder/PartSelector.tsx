import React from 'react';
import { Product } from '../../features/products';
import { getFallbackImageForProductCategory } from '../../utils/imageAssets';
import { formatINR } from '../../utils/currency';

interface Props {
  label: string;
  options: Product[];
  value?: string;
  onChange: (value?: string) => void;
}

export const PartSelector: React.FC<Props> = ({ label, options, value, onChange }) => {
  const selectedProduct = options.find((p) => p.id === value);

  return (
    <div className="space-y-3">
      <label className="pf-label">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="pf-input"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - {formatINR(p.price)}
          </option>
        ))}
      </select>
      {selectedProduct && (
        <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-xs text-[var(--pf-text-secondary)]">
          <div className="h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-black/20">
            <img
              src={selectedProduct.images?.[0] || getFallbackImageForProductCategory(selectedProduct.category)}
              alt={selectedProduct.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{selectedProduct.name}</p>
            <p className="mt-1 text-xs text-[var(--pf-text-secondary)]">
              {formatINR(selectedProduct.price)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

