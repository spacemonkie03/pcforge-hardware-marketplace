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
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4 text-white">Filters</h3>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
          <input
            placeholder="Search products..."
            className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
            onChange={(e) => update('q', e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
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
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className="flex-1 bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
              onChange={(e) => update('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="Max"
              className="flex-1 bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
              onChange={(e) => update('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
          <select
            className="w-full bg-gray-700/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/25 transition-all"
            onChange={(e) => update('minRating', e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">Any rating</option>
            <option value="3">3★ and above</option>
            <option value="4">4★ and above</option>
            <option value="4.5">4.5★ and above</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-white/10 text-blue-600 focus:ring-blue-500"
              onChange={(e) => update('inStock', e.target.checked ? true : undefined)}
            />
            <span className="text-sm font-medium text-gray-300">In stock only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

