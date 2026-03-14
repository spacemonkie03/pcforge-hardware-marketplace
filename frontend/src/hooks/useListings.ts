import { useQuery } from '@tanstack/react-query';
import { fetchListings, ListingSearchParams, ListingSummary } from '../features/listings';

export const useListings = (searchParams?: ListingSearchParams) => {
  const hasSearchParams = Boolean(
    searchParams &&
      Object.values(searchParams).some((value) => value !== undefined && value !== '')
  );

  return useQuery<ListingSummary[]>({
    queryKey: ['listings', searchParams],
    queryFn: () => fetchListings(hasSearchParams ? searchParams : undefined),
  });
};
