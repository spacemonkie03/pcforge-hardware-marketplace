import React from 'react';

interface Props {
  onChange: (filters: any) => void;
}

export const ProductFilters: React.FC<Props> = ({ onChange }) => {
  const [local, setLocal] = React.useState<any>({});

  const update = (key: string, value: any) => {
    const updated = { ...local, [key]: value || undefined };
    setLocal(updated);
    onChange(updated);
  };

  return (
    <div className="glass-panel p-4 mb-4 flex flex-wrap gap-3 text-xs">
      <input
        placeholder="Search"
        className="bg-black/40 border border-white/10 rounded px-2 py-1 w-40"
        onChange={(e) => update('q', e.target.value)}
      />
      <select
        className="bg-black/40 border border-white/10 rounded px-2 py-1"
        onChange={(e) => update('category', e.target.value || undefined)}
      >
        <option value="">All Categories</option>
        <option value="GPU">GPU</option>
        <option value="CPU">CPU</option>
        <option value="MOTHERBOARD">Motherboard</option>
        <option value="RAM">RAM</option>
        <option value="STORAGE">Storage</option>
        <option value="PSU">PSU</option>
        <option value="COOLER">Cooler</option>
        <option value="CASE">Case</option>
        <option value="FAN">Fan</option>
        <option value="ACCESSORY">Accessory</option>
      </select>
      <input
        type="number"
        placeholder="Min $"
        className="bg-black/40 border border-white/10 rounded px-2 py-1 w-24"
        onChange={(e) => update('minPrice', e.target.value ? Number(e.target.value) : undefined)}
      />
      <input
        type="number"
        placeholder="Max $"
        className="bg-black/40 border border-white/10 rounded px-2 py-1 w-24"
        onChange={(e) => update('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
      />
      <select
        className="bg-black/40 border border-white/10 rounded px-2 py-1"
        onChange={(e) => update('minRating', e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">Any rating</option>
        <option value="3">3★+</option>
        <option value="4">4★+</option>
        <option value="4.5">4.5★+</option>
      </select>
      <label className="flex items-center gap-1">
        <input
          type="checkbox"
          onChange={(e) => update('inStock', e.target.checked ? true : undefined)}
        />
        In stock only
      </label>
    </div>
  );
};

