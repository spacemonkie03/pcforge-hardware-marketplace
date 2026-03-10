import React from 'react';
import { Product } from '../../features/products';

interface Props {
  label: string;
  options: Product[];
  value?: string;
  onChange: (value?: string) => void;
}

export const PartSelector: React.FC<Props> = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 text-xs">
      <span className="text-gray-300">{label}</span>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="bg-black/40 border border-white/10 rounded px-2 py-1"
      >
        <option value="">None</option>
        {options.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} - ${Number(p.price).toFixed(2)}
          </option>
        ))}
      </select>
    </div>
  );
};

