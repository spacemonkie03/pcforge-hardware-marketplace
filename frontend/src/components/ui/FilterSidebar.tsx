import { ChangeEvent } from 'react';
import { Card } from './Card';

export interface FilterValues {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
}

interface FilterSidebarProps {
  values: FilterValues;
  onChange: (filters: FilterValues) => void;
  categories?: Array<{ value: string; label: string }>;
  showApiLimitationsNotice?: boolean;
}

const defaultCategories = [
  { value: 'GPU', label: 'GPU' },
  { value: 'CPU', label: 'CPU' },
  { value: 'MOTHERBOARD', label: 'Motherboard' },
  { value: 'RAM', label: 'RAM' },
  { value: 'STORAGE', label: 'Storage' },
  { value: 'PSU', label: 'PSU' },
];

export const FilterSidebar = ({
  values,
  onChange,
  categories = defaultCategories,
  showApiLimitationsNotice = false,
}: FilterSidebarProps) => {
  const update = <K extends keyof FilterValues>(key: K, value: FilterValues[K]) => {
    onChange({ ...values, [key]: value || undefined });
  };

  const updateNumber = (key: 'minPrice' | 'maxPrice' | 'minRating') =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const nextValue = event.target.value;
      update(key, nextValue ? Number(nextValue) : undefined);
    };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Filters</h2>
          <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
            Narrow results with the filters currently supported by the live search API.
          </p>
        </div>

        <div className="space-y-2">
          <label className="pf-label">Search</label>
          <input
            value={values.q || ''}
            onChange={(event) => update('q', event.target.value)}
            placeholder="Search GPUs or sellers..."
            className="pf-input"
          />
        </div>

        <div className="space-y-2">
          <label className="pf-label">Category</label>
          <select
            value={values.category || ''}
            onChange={(event) => update('category', event.target.value || undefined)}
            className="pf-input"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="pf-label">Brand</label>
          <input
            value={values.brand || ''}
            onChange={(event) => update('brand', event.target.value)}
            placeholder="AMD, ASUS, MSI, Corsair..."
            className="pf-input"
          />
        </div>

        <div className="space-y-2">
          <label className="pf-label">Price Range</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <input
              type="number"
              value={values.minPrice ?? ''}
              onChange={updateNumber('minPrice')}
              placeholder="Min"
              className="pf-input"
            />
            <input
              type="number"
              value={values.maxPrice ?? ''}
              onChange={updateNumber('maxPrice')}
              placeholder="Max"
              className="pf-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="pf-label">Minimum Rating</label>
          <select
            value={values.minRating ?? ''}
            onChange={updateNumber('minRating')}
            className="pf-input"
          >
            <option value="">Any rating</option>
            <option value="3">3 stars and above</option>
            <option value="4">4 stars and above</option>
            <option value="4.5">4.5 stars and above</option>
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm text-white">
          <input
            type="checkbox"
            checked={Boolean(values.inStock)}
            onChange={(event) => update('inStock', event.target.checked ? true : undefined)}
            className="h-4 w-4 rounded border-white/10 bg-transparent"
          />
          In stock only
        </label>

        {showApiLimitationsNotice ? (
          <div className="pf-surface-muted p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--pf-text-tertiary)]">
              Missing server filters
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--pf-text-secondary)]">
              Socket compatibility, memory type, and performance tier are not exposed by the current search API, so they are not shown as interactive filters yet.
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
