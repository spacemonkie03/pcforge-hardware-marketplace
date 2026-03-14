import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { SiteLayout } from '../components/layout/SiteLayout';
import { ListingCard } from '../components/ui/ListingCard';
import { MarketplaceCatalogFeed } from '../components/marketplace/MarketplaceCatalogFeed';
import {
  buildMarketplaceCategoryHref,
  categoryItems,
  findCategoryBySlug,
} from '../config/categories.config';
import { fetchListings, ListingSummary } from '../features/listings';
import { fetchProducts, Product } from '../features/products';
import {
  getCategoryCoverBySlug,
  getFallbackImageForListing,
  getFallbackImageForProductCategory,
  hasDedicatedCategoryCover,
} from '../utils/imageAssets';
import { formatINR } from '../utils/currency';

const featuredCategories = categoryItems.slice(0, 6);

type CategoryPreview = {
  image: string | null;
  count: number;
};

const sortPremiumListings = (listings: ListingSummary[]) =>
  [...listings].sort((a, b) => {
    if (b.price !== a.price) {
      return b.price - a.price;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

const sortLatestListings = (listings: ListingSummary[]) =>
  [...listings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

const buildCategoryPreview = (
  filterValue: string,
  listings: ListingSummary[],
  products: Product[],
): CategoryPreview => {
  const categoryProducts = products.filter((product) => product.category === filterValue);
  const categoryListings = filterValue === 'GPU' ? listings : [];
  const image =
    categoryListings.find((listing) => listing.firstImage)?.firstImage ||
    categoryProducts.find((product) => product.images?.[0])?.images?.[0] ||
    null;

  return {
    image,
    count: categoryProducts.length + categoryListings.length,
  };
};

const formatListingDate = (createdAt: string) =>
  new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const SectionSkeleton = ({ cards = 3, tall = false }: { cards?: number; tall?: boolean }) => (
  <div className={`grid gap-4 ${cards >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4">
        <div className={`animate-pulse rounded-[10px] bg-white/[0.05] ${tall ? 'aspect-[4/3]' : 'h-24'}`} />
        <div className="mt-4 space-y-3">
          <div className="h-3 w-20 animate-pulse rounded-full bg-white/[0.05]" />
          <div className="h-5 w-4/5 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/[0.05]" />
          <div className="h-4 w-24 animate-pulse rounded-full bg-white/[0.05]" />
        </div>
      </div>
    ))}
  </div>
);

const SectionEmptyState = ({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) => (
  <div className="rounded-xl border border-dashed border-[var(--pf-border)] bg-white/[0.02] p-8 text-center">
    <p className="text-lg font-semibold text-white">{title}</p>
    <p className="mx-auto mt-2 max-w-[52ch] text-sm leading-6 text-[var(--pf-text-secondary)]">
      {description}
    </p>
    {actionHref && actionLabel ? (
      <Link href={actionHref} className="pf-button-secondary mt-5">
        {actionLabel}
      </Link>
    ) : null}
  </div>
);

const CategoryImage = ({
  slug,
  name,
  fallbackImage,
}: {
  slug: string;
  name: string;
  fallbackImage: string | null;
}) => {
  const imageSrc = hasDedicatedCategoryCover(slug)
    ? getCategoryCoverBySlug(slug)
    : fallbackImage || getCategoryCoverBySlug(slug);

  if (!imageSrc) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--pf-border)] bg-[var(--pf-card-alt)] text-[var(--pf-text-tertiary)]">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="4" y="7" width="16" height="10" rx="2" />
              <path d="M8 10h8M8 14h4" />
            </svg>
          </div>
          <p className="mt-3 text-xs text-[var(--pf-text-secondary)]">
            Placeholder until category assets are added in /public/images/categories/
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <img src={imageSrc} alt={name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,17,21,0.88)] via-transparent to-transparent" />
    </>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const {
    data: listings = [],
    isLoading: isListingsLoading,
  } = useQuery<ListingSummary[]>({
    queryKey: ['landing-listings'],
    queryFn: () => fetchListings(),
  });
  const {
    data: products = [],
    isLoading: isProductsLoading,
  } = useQuery<Product[]>({
    queryKey: ['landing-products'],
    queryFn: () => fetchProducts(),
  });

  const nextQuery = router.query.q;
  const nextCategory = router.query.category;
  const query = Array.isArray(nextQuery) ? nextQuery[0] : nextQuery;
  const categorySlug = Array.isArray(nextCategory) ? nextCategory[0] : nextCategory;
  const category = findCategoryBySlug(categorySlug)?.filterValue;

  const premiumListings = sortPremiumListings(listings).slice(0, 4);
  const latestListings = sortLatestListings(listings).slice(0, 6);
  const newestListings = latestListings.slice(0, 3);
  const featuredProducts = [...products]
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 4);

  const sellers = Array.from(
    new Map(
      listings.map((listing) => [
        listing.seller.id,
        {
          id: listing.seller.id,
          name: listing.seller.name,
          listings: listings.filter((entry) => entry.seller.id === listing.seller.id).length,
          averagePrice: Math.round(
            listings
              .filter((entry) => entry.seller.id === listing.seller.id)
              .reduce((sum, entry) => sum + entry.price, 0) /
              Math.max(
                1,
                listings.filter((entry) => entry.seller.id === listing.seller.id).length,
              ),
          ),
        },
      ]),
    ).values(),
  )
    .sort((a, b) => b.averagePrice - a.averagePrice)
    .slice(0, 3);

  return (
    <>
      <Head>
        <title>PCForge - Buy and Sell Used PC Parts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <SiteLayout fullWidth>
        <div className="pf-page-shell">
          <section className="py-8 lg:py-10">
            <div className="pf-main-container space-y-6">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]">
                <div className="pf-card p-6 lg:p-7">
                  <p className="pf-eyebrow">Featured marketplace</p>
                  <h1 className="mt-3 max-w-[16ch] text-3xl font-semibold tracking-[-0.05em] text-white md:text-[2.5rem] md:leading-[1.02]">
                    Premium PC parts from trusted sellers
                  </h1>
                  <p className="mt-4 max-w-[42ch] text-sm leading-7 text-[var(--pf-text-secondary)]">
                    High-end components and recent listings, surfaced first.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/marketplace" className="pf-button-primary">
                      Shop components
                    </Link>
                    <Link href="#new-listings" className="pf-button-secondary">
                      Browse latest listings
                    </Link>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <div className="pf-stat">
                      <span className="pf-stat-label">Featured now</span>
                      <span className="pf-stat-value">
                        {isListingsLoading ? '...' : premiumListings.length}
                      </span>
                    </div>
                    <div className="pf-stat">
                      <span className="pf-stat-label">Trusted sellers</span>
                      <span className="pf-stat-value">
                        {isListingsLoading
                          ? '...'
                          : new Set(listings.map((listing) => listing.seller.id)).size}
                      </span>
                    </div>
                    <div className="pf-stat">
                      <span className="pf-stat-label">Live inventory</span>
                      <span className="pf-stat-value">
                        {isListingsLoading || isProductsLoading ? '...' : products.length + listings.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {isListingsLoading ? (
                    <SectionSkeleton cards={4} tall />
                  ) : premiumListings.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {premiumListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  ) : (
                    <SectionEmptyState
                      title="No featured listings yet"
                      description="The featured rail will populate automatically as soon as live listings are available from the backend."
                      actionHref="/marketplace"
                      actionLabel="Browse marketplace"
                    />
                  )}
                </div>
              </div>

              <div id="new-listings" className="pf-card p-5">
                <div className="flex items-end justify-between gap-4 border-b border-[var(--pf-border)] pb-4">
                  <div>
                    <p className="pf-eyebrow">New listings</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                      The latest parts added to the marketplace.
                    </h2>
                  </div>
                  <Link href="/marketplace" className="pf-button-ghost hidden md:inline-flex">
                    See all listings
                  </Link>
                </div>

                <div className="mt-5">
                  {isListingsLoading ? (
                    <SectionSkeleton cards={3} />
                  ) : newestListings.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-3">
                      {newestListings.map((listing) => (
                        <Link
                          key={listing.id}
                          href={`/listings/${listing.id}`}
                          className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4 transition-colors hover:border-[var(--pf-border-strong)]"
                        >
                          <div className="flex gap-4">
                            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[10px] border border-[var(--pf-border)] bg-white/[0.03]">
                              <img
                                src={listing.firstImage || getFallbackImageForListing()}
                                alt={listing.gpuName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-base font-semibold leading-6 text-white">
                                {listing.gpuName}
                              </h3>
                              <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                                {listing.seller.name}
                              </p>
                              <p className="mt-1 text-sm text-[var(--pf-text-tertiary)]">
                                {formatListingDate(listing.createdAt)}
                              </p>
                              <p className="mt-3 font-mono text-sm text-[var(--pf-accent-secondary)]">
                                {formatINR(listing.price)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <SectionEmptyState
                      title="No new listings available"
                      description="When sellers publish fresh inventory, the newest listings will appear here automatically."
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="pb-16">
            <div className="pf-main-container">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <p className="pf-eyebrow">Shop by category</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                    Browse the marketplace visually.
                  </h2>
                </div>
                <Link href="/marketplace" className="pf-button-ghost hidden md:inline-flex">
                  View full marketplace
                </Link>
              </div>

              {isListingsLoading && isProductsLoading ? (
                <SectionSkeleton cards={6} tall />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {featuredCategories.map((categoryItem) => {
                    const preview = buildCategoryPreview(
                      categoryItem.filterValue,
                      listings,
                      products,
                    );

                  return (
                    <Link
                      key={categoryItem.slug}
                      href={buildMarketplaceCategoryHref(categoryItem.slug)}
                      className="pf-card pf-card-hover overflow-hidden"
                    >
                        <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--pf-border)] bg-white/[0.03]">
                          <CategoryImage
                            slug={categoryItem.slug}
                            name={categoryItem.name}
                            fallbackImage={preview.image}
                          />

                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--pf-accent-secondary)]">
                                {categoryItem.name}
                              </p>
                              <p className="mt-2 text-sm text-white">
                                {hasDedicatedCategoryCover(categoryItem.slug)
                                  ? 'Licensed category cover'
                                  : preview.image
                                    ? 'Live preview'
                                    : 'Dedicated asset slot ready'}
                              </p>
                            </div>
                            <span className="rounded-full border border-[rgba(231,234,240,0.18)] bg-[rgba(15,17,21,0.72)] px-3 py-1 text-sm text-white">
                              {preview.count}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <p className="text-lg font-semibold text-white">{categoryItem.name}</p>
                          <p className="mt-2 max-w-[32ch] text-sm leading-6 text-[var(--pf-text-secondary)]">
                            {categoryItem.description}
                          </p>
                          <p className="mt-4 text-sm text-[var(--pf-text-tertiary)]">
                            {preview.count} listing{preview.count === 1 ? '' : 's'} available
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <section className="pb-16">
            <div className="pf-main-container grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
              <div className="pf-card p-6">
                <p className="pf-eyebrow">High-end components</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Premium products for new builds.
                </h2>
                <div className="mt-6">
                  {isProductsLoading ? (
                    <SectionSkeleton cards={4} tall />
                  ) : featuredProducts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {featuredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4 transition-colors hover:border-[var(--pf-border-strong)]"
                        >
                          <div className="aspect-[4/3] overflow-hidden rounded-[10px] border border-[var(--pf-border)] bg-white/[0.03]">
                            <img
                              src={product.images?.[0] || getFallbackImageForProductCategory(product.category)}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--pf-accent-secondary)]">
                            {product.category}
                          </p>
                          <h3 className="mt-2 text-base font-semibold leading-6 text-white">
                            {product.name}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--pf-text-secondary)]">
                            {product.brand}
                          </p>
                          <p className="mt-4 pf-price">{formatINR(product.price)}</p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <SectionEmptyState
                      title="No premium products available"
                      description="This section will populate when products are available from the catalog API."
                    />
                  )}
                </div>
              </div>

              <div className="pf-card p-6">
                <p className="pf-eyebrow">Trusted sellers</p>
                <div className="mt-4">
                  {isListingsLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4"
                        >
                          <div className="h-5 w-32 animate-pulse rounded-full bg-white/[0.05]" />
                          <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-white/[0.05]" />
                          <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-white/[0.05]" />
                        </div>
                      ))}
                    </div>
                  ) : sellers.length > 0 ? (
                    <div className="space-y-4">
                      {sellers.map((seller) => (
                        <div
                          key={seller.id}
                          className="rounded-xl border border-[var(--pf-border)] bg-white/[0.03] p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-white">{seller.name}</p>
                              <p className="mt-1 text-sm text-[var(--pf-text-secondary)]">
                                {seller.listings} active listing{seller.listings > 1 ? 's' : ''}
                              </p>
                            </div>
                            <span className="rounded-full border border-[rgba(21,128,61,0.28)] bg-[rgba(21,128,61,0.12)] px-3 py-1 text-xs font-medium text-emerald-300">
                              Verified
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-[var(--pf-text-secondary)]">
                            Average listing price {formatINR(seller.averagePrice)}
                          </p>
                          <Link
                            href={`/sellers/${seller.id}`}
                            className="mt-4 inline-flex text-sm font-medium text-[var(--pf-accent-secondary)]"
                          >
                            View seller profile
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <SectionEmptyState
                      title="No seller profiles to feature"
                      description="Seller highlights will appear here once there are live listings tied to seller accounts."
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section id="marketplace" className="scroll-mt-28 pb-16">
            <div className="pf-main-container">
              <div className="mb-8">
                <p className="pf-eyebrow">Marketplace catalog</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Continue browsing the full catalog.
                </h2>
              </div>
              <MarketplaceCatalogFeed
                query={query}
                category={category}
                showApiLimitationsNotice={false}
              />
            </div>
          </section>
        </div>
      </SiteLayout>
    </>
  );
}
