# Project Notes — Archive Fine Textiles

A fabric catalog website for an interior textiles business (domain: archivefinetextiles.com),
with an upcoming furniture e-commerce section.

## Tech Stack
- **Framework:** Next.js (App Router)
- **CMS:** Sanity (fabric catalog data — inquiry-based, not e-commerce)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion
- **Fonts:** Bernhard Modern BT (headings, `font-heading`), Lato Light (body)
- **Design language:** cream background, serif headings, minimal aesthetic. Use solid
  `bg-background` (100% opacity) for content sections.

## Environment Variables
Current values (set in the `archive-fine-textiles` Vercel project on team `dmitry-5290s-projects`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `0piql2nt`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `SANITY_API_TOKEN` — only needed to run the data scripts (`scripts/*`); not required for the
  site to render at runtime. Add it (Editor permissions) only when importing/migrating data.
- _(Upcoming)_ Shopify Storefront API token and related vars

Sanity data lives in the Sanity project and is independent of Vercel — it reconnects via
the env vars above regardless of which Vercel account hosts the app.

## Architecture & Conventions

### Header
- A single unified `SiteHeader` (`components/site-header.tsx`) is used across all pages. Props:
  - `scrollAnimation?` — `{ hasPassedT1, hasPassedT2, scrollDirection, skipInitialAnimation }`,
    used only for the homepage splash scroll behavior.
  - `showSearch?: boolean` — default `true`; `false` on the Contact page.
  - `searchPath?: string` — `/` for Textiles, `/open-stock` for Open Stock.
- Active link state is computed from `usePathname()`.
- Mobile (below `md`) uses a hamburger menu with open/close animation.
- `skipInitialAnimation` (set to `hasParams`) makes Framer Motion use `initial={false}` so the
  header does not slide in when navigating with query params.
- Consolidated from 3 separate headers; the old `OpenStockHeader` and `ContactHeader` were deleted.

### Pages
- **Textiles (home)** and **Open Stock** share an identical page/layout structure. Keep them in
  sync. Nav label for Open Stock is "Open Stock Fabrics" (route stays `/open-stock`).
  Open Stock default sort: item number ascending (`item-asc`).
- Layout to avoid content "jump": outer wrapper has fixed `NAV_HEIGHT` top padding; inner
  wrapper handles active-filter padding with a transition. Grid container uses
  `container mx-auto px-6 py-12`.
- Avoid skeleton loaders that flash. Use a `hasFetched` flag before rendering "no items" states.

### Individual item views (`/fabrics/[itemNumber]`, `/open-stock/[itemNumber]`)
- Client components that fetch on mount.
- Fixed top-right X button using `router.back()`.
- Loading spinner sits within the image-area layout (not full-window) to avoid layout jump.
- Open Stock item view displays Price, Material, and Width (no Pattern Repeat).

### Related fabrics ("More from" section)
- Shows other colorways within the **same collection** (not items sharing a colorway name).
- Props: `collectionId`, `collectionName`, `currentItemId`. Rendered at full opacity, no fade.

### Contact page
- Uses `export const revalidate = 0` + `{ cache: 'no-store' }` so Sanity edits appear
  immediately (the Sanity client uses `useCdn: true` globally).

## Deployment & Sanity CORS
- **Workflow:** v0 pushes to a feature branch → opens/updates a PR against `main`. Vercel builds
  a Preview Deployment per PR (review there). Merging the PR into `main` triggers an automatic
  production deploy (production branch = `main`). Merge == deploy.
- **Sanity CORS (current fix, Option A):** Several `"use client"` components fetch Sanity directly
  from the browser, so each origin must be allowlisted in Sanity. Because preview URLs are unique
  per deploy, a wildcard `https://*.vercel.app` (Allow credentials OFF) plus the custom production
  domain are registered in Sanity Manage → API → CORS Origins. Safe because the dataset is
  public-read and the client uses no token. Images (`cdn.sanity.io`) are not CORS-bound.
- **FUTURE REFACTOR (Option B) — move Sanity fetches server-side:** The long-term fix is to
  eliminate browser-side `client.fetch` entirely by refactoring the `"use client"` components to
  receive data from Server Components / route handlers / server actions. Removes CORS concerns
  permanently, improves perf/SEO, and lets us safely add a read token later. Touches ~10 files
  (fabric-grid, fabric-detail-modal, related-fabrics, filter-drawer, active-filters-bar,
  open-stock-grid, open-stock-filter-drawer, open-stock-active-filters-bar,
  `app/fabrics/[itemNumber]/page.tsx`, `app/open-stock/[itemNumber]/page.tsx`) and interacts with
  the loading/jump fixes, so it needs a planned, careful pass. Deferred.

## E-commerce Plan (not yet implemented)
- **Separation of concerns:** Sanity = fabric catalog (inquiry). Shopify = furniture store
  (transactional; only a few products to start).
- Shopify is the inventory source of truth for furniture.
- Build a `/shop` route in this Next.js app using the **Shopify Storefront API**, matching the
  existing site aesthetic (same domain).
- **Checkout:** redirect to Shopify's hosted checkout (Shopify handles PCI compliance).
  Customization on Basic plan is limited to logo/colors/fonts.
- **Payments:** Shopify Payments. In-store (retail location) recommended via Shopify POS, since
  inventory already lives in Shopify.
- **Status:** waiting on user to set up Shopify store + Storefront API token + test products +
  Shopify Payments.

## Working Preferences
- Always announce/discuss unprompted changes BEFORE implementing; get sign-off on approach for
  non-trivial work.
- Prefer planning and alignment before writing code, especially for larger features.
- Value DRY/consolidated components over duplication (e.g. the unified header).

## Vercel Account Migration — COMPLETED
The project was migrated from the original Vercel account to team `dmitry-5290s-projects`.
Current setup:
- **GitHub repo (source of truth):** `dmitrysamochine/archive-fine-textiles` (production branch `main`).
- **Vercel project:** `archive-fine-textiles` on team `dmitry-5290s-projects`.
- **Env vars:** re-added on the new project (see Environment Variables above).
- **Domain:** `archivefinetextiles.com` + `www` moved via Cloudflare DNS. The `_vercel` TXT
  verification records and the `www` CNAME (`fd275faff6f60093.vercel-dns-017.com`) were added,
  ownership was verified into this project, and it auto-detached from the old account. Apex `A`
  stayed on Vercel's shared IP. SSL is issued; apex 308-redirects to `www`.
- **Sanity:** unchanged — same project (`0piql2nt`), reconnected via env vars.

### Reference: repeating a Vercel account migration
1. Push everything to GitHub (source of truth).
2. Import the GitHub repo into a new Vercel project on the new account.
3. Re-add the environment variables listed above.
4. Redeploy. Sanity needs no changes.
5. Move the domain: add the `_vercel` TXT verification record(s) and repoint the `www` CNAME to
   the new project's target in DNS, then verify ownership in the new project.
6. Re-register CORS origins in Sanity if the domain changes (see Deployment & Sanity CORS).
