import React from 'react';
import { FilterSidebar, FilterValues } from './ui/FilterSidebar';

export interface ProductFilterValues extends FilterValues {}

interface Props {
  initialFilters?: ProductFilterValues;
  onChange: (filters: ProductFilterValues) => void;
  categories?: Array<{ value: string; label: string }>;
  showApiLimitationsNotice?: boolean;
}

export const ProductFilters: React.FC<Props> = ({
  initialFilters,
  onChange,
  categories,
  showApiLimitationsNotice = false,
}) => {
  const [local, setLocal] = React.useState<ProductFilterValues>(initialFilters || {});

  React.useEffect(() => {
    setLocal(initialFilters || {});
  }, [initialFilters]);

  const handleChange = (filters: ProductFilterValues) => {
    setLocal(filters);
    onChange(filters);
  };

  return (
    <FilterSidebar
      values={local}
      onChange={handleChange}
      categories={categories}
      showApiLimitationsNotice={showApiLimitationsNotice}
    />
  );
};
