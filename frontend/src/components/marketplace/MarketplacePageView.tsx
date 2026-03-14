import { SectionContainer } from '../ui/SectionContainer';
import { MarketplaceCatalogFeed } from './MarketplaceCatalogFeed';
import {
  findCategoryBySlug,
  marketplaceCategoryOptions,
} from '../../config/categories.config';

interface MarketplacePageViewProps {
  query?: string;
  categorySlug?: string;
}

export const MarketplacePageView = ({
  query,
  categorySlug,
}: MarketplacePageViewProps) => {
  const selectedCategory = findCategoryBySlug(categorySlug);

  return (
    <SectionContainer
      title={selectedCategory ? `${selectedCategory.name} Marketplace` : 'Marketplace'}
      description={
        selectedCategory
          ? `Filtered marketplace results for ${selectedCategory.name}. Use the sidebar to refine pricing, ratings, and stock availability.`
          : 'Browse the full PCForge catalog with category-aware navigation, search, and marketplace filters.'
      }
    >
      <MarketplaceCatalogFeed
        query={query}
        category={selectedCategory?.filterValue}
        categories={marketplaceCategoryOptions}
        showApiLimitationsNotice={false}
      />
    </SectionContainer>
  );
};
