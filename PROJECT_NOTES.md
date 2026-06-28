# Archive Fine Textiles

A fabric catalog website for an interior textiles business. Domain: archivefinetextiles.com

## Tech Stack
- Next.js (App Router)
- Sanity CMS (fabric catalog data — inquiry-based, NOT ecommerce)
- Framer Motion for animations
- Tailwind + shadcn/ui
- Fonts: Bernhard Modern BT (headings, `font-heading`), Lato Light (body)
- Design: cream background, serif headings, minimal aesthetic. 100% opacity backgrounds (use `bg-background`).

## Environment Variables
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- (Upcoming: Shopify Storefront API token, etc.)

## Architecture / Conventions

### Unified `SiteHeader` (`components/site-header.tsx`)
Single header used across all pages. Props:
- `scrollAnimation?: { hasPassedT1, hasPassedT2, scrollDirection, skipInitialAnimation }` — homepage splash behavior only
- `showSearch?: boolean` (default `true`; `false` on Contact)
- `searchPath?: string` (`/` for Textiles, `/open-stock` for Open Stock)
- Active link state computed via `usePathname()`. Mobile uses hamburger menu (below `md`).
- Consolidated from 3 separate headers (deleted `OpenStockHeader`, `ContactHeader`).

**Header animation fix**: pass `skipInitialAnimation` (= `hasParams`) so Framer Motion uses `initial={false}` to avoid slide-in when navigating with query params.

### Open Stock
- Section mirrors the Textiles/Fabric structure exactly.
- Nav label is "Open Stock Fabrics" (URL stays `/open-stock`).
- Default sort: item number ascending (`item-asc`).

### Loading / jump fixes learned
- Keep page structure identical between Textiles and Open Stock.
- Outer wrapper: fixed `NAV_HEIGHT` padding; inner wrapper for active-filter padding with transition.
- Grid container uses `container mx-auto px-6 py-12`.
- Avoid skeleton loaders that flash; use a `hasFetched` flag before showing "no items" messages.

### Individual item views (`/fabrics/[itemNumber]`, `/open-stock/[itemNumber]`)
- Client components, fetch on mount.
- Fixed top-right X button using `router.back()`.
- Loading spinner placed within the image-area layout (not full-window) to avoid jump.

### Related fabrics ("More from" section)
- Shows other colorways within the SAME COLLECTION (not same colorway name).
- Props: `collectionId`, `collectionName`, `currentItemId`.
- Full opacity, no fade animation.

### Contact page
- Uses `export const revalidate = 0` + `{ cache: 'no-store' }` so Sanity edits appear immediately (Sanity client has `useCdn: true` globally).

## E-commerce Plan (not yet built)
- Separation: Sanity = fabric catalog (inquiry). Shopify = furniture store (transactional, few products to start).
- Shopify is inventory source of truth for furniture.
- Storefront API integration in custom Next.js app at `/shop` route (same domain, same aesthetic).
- Checkout: redirect to Shopify hosted checkout (PCI handled by Shopify). Limited customization on Basic plan (logo/colors/fonts).
- Payments: Shopify Payments. In-store: retail location — recommended Shopify POS (Lite included / Pro $89/mo) since inventory already in Shopify.
- Status: waiting on user to set up Shopify store + Storefront API token + test products + Shopify Payments.
