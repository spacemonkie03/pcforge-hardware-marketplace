# UI Overhaul Audit

## Public Homepage Refinement

The public homepage no longer renders audit or debug messaging. Those notes live here instead so the storefront stays customer-facing while implementation constraints remain documented for the team.

## Existing Frontend Pages

- `/`
- `/marketplace`
- `/pc-builder`
- `/products/[id]`
- `/listings/[id]`
- `/sellers/[id]`
- `/cart`
- `/checkout`
- `/wishlist`
- `/orders`
- `/addresses`
- `/payment-methods`
- `/sell`
- `/dashboard/admin`
- `/dashboard/seller`
- `/dashboard/seller/listings`
- `/profile`
- `/profile/my-listings`
- `/login`
- `/register`
- `/help`
- `/contact`
- `/privacy`
- `/terms`
- `/cookies`
- `/trust-safety`

## Existing API Coverage Used By The Redesigned UI

- `GET /api/products`
- `GET /api/products/search`
- `GET /api/products/:id`
- `GET /api/listings`
- `GET /api/search/listings`
- `GET /api/listings/:id`
- `GET /api/listings/sellers/:id/profile`
- `POST /api/pc-builder/validate`
- `GET /api/wishlist`
- `POST /api/wishlist/:listingId`
- `DELETE /api/wishlist/:listingId`

## Missing Functionality Report

### Missing Pages

- `/builder`
  - Current implementation uses `/pc-builder`.
- `/listing/:id`
  - Current implementation uses `/listings/:id`.

### Missing API Endpoints

- `GET /api/builds/popular`
  - No public builds feed exists, so the homepage does not render a fake "Popular Builds" section.
- `GET /api/listings/featured`
  - No dedicated featured or premium listings endpoint exists.
- `GET /api/listings?sort=premium|price_desc|newest`
  - Premium ranking and explicit storefront sorting are not exposed by the listings API. The homepage falls back to client-side sorting of the live listings feed by price and recency.
- `GET /api/pc-builder/recommendations`
  - The builder cannot show recommended alternatives or upgrade suggestions from the backend.
- `GET /api/pc-builder/compatibility`
  - Compatibility currently exists only as `POST /api/pc-builder/validate`.
- `GET /api/search/products` filters for socket compatibility
  - Not supported by the current backend search DTO.
- `GET /api/search/products` filters for memory type
  - Not supported by the current backend search DTO.
- `GET /api/search/products` filters for performance tier
  - Not supported by the current backend search DTO.

### UI Components Not Present As Separate Reusable Modules

- `PopularBuildsSection`
- `BuildRecommendationsPanel`
- `CompatibilityBreakdownPanel`

These were not fabricated during the overhaul because the required backend support is missing or incomplete.

## Homepage Asset And Route Notes

- Missing category image asset library
  - No dedicated static category images were found in the repo.
  - The homepage is now prepared to load future assets from `/public/categories/<slug>.webp|png|jpg|jpeg`.
  - Until those assets are added, category cards fall back to real listing or product imagery when available and then to a neutral placeholder.
- Missing listing detail alias
  - Requested alias `/listing/:id` does not exist.
  - Live detail route is `/listings/:id`.
- Category landing pages
  - Dedicated category landing pages do not exist.
  - Category cards currently link to `/marketplace?category=<slug>`, which is a working filtered marketplace route.

## Loading And Empty State Notes

- Featured listings, new listings, categories, featured products, and seller highlights all render intentional loading skeletons while API data is pending.
- Each homepage section also renders a specific empty state instead of appearing broken when the backend returns no records.
