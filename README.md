# Pickio storefront

Customer-facing shop for [pickio.lk](https://pickio.lk). React 19 + MUI + Vite, backed by Supabase (Postgres, Auth with Google, Edge Functions). Cash on delivery only.

The admin dashboard lives in a separate repo, `lootbox-dashboard`.

## Local development

```bash
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev            # http://localhost:5173
```

For Google sign-in to work locally, `http://localhost:5173` must be in Supabase → Authentication → URL Configuration → Redirect URLs.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run lint` | ESLint (also runs in CI) |
| `npm test` | Vitest: order validation/pricing and checkout helpers (also runs in CI) |
| `npm run build` | Type-check, build to `dist/`, then generate static pages |

## Routing and static pages

The app uses real URLs (`/product/<id>`, `/shop?category=…`). Old `/#/…` links are rewritten on load.

GitHub Pages has no SPA fallback, so after `vite build`, `scripts/generate-static-pages.mjs` writes:

- `404.html`: the app shell, served for any unknown path.
- `<route>/index.html` for each static route, and `product/<id>/index.html` for every product. Each has that page's title, description, Open Graph tags and Product JSON-LD, so crawlers and link previews get real content with a 200.
- `sitemap.xml` and `robots.txt`.

Products added after a deploy still work (via `404.html`) but get their own page only on the next build. The script reads `products_public` with the same `VITE_SUPABASE_*` variables and skips product pages if they're missing.

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`: lint, test, build, then publish `dist/` to the `gh-pages` branch. The workflow sets `cname: pickio.lk` and `public/CNAME` is also published, so the custom domain is kept on every deploy.

Required repository secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.

## Edge function: `create-order`

All orders go through `supabase/functions/create-order`, which uses the service-role key. It:

- recomputes every price from the `products` table (the client's prices are never trusted),
- takes the customer from the verified JWT (guests send the anon key),
- validates items, quantities, phone numbers and district, and checks stock,
- rate-limits by phone number,
- atomically reserves tracked stock and bumps `sold_count` (`reserve_stock`), releasing it if the insert fails,
- sends the owner a WhatsApp notification (Green-API).

Validation and pricing live in `order.ts` (no Deno APIs), which `tests/order.test.ts` covers.

```bash
supabase functions deploy create-order
```

Secrets: `GREEN_API_URL`, `GREEN_API_ID_INSTANCE`, `GREEN_API_TOKEN` (optional; notifications are skipped without them). `reserve_stock` / `release_stock` come from `lootbox-dashboard/supabase-sql/security_hardening.sql`; until that's applied the function still works, just without stock tracking.

Shipping fee, max quantity and the district list are duplicated between `src/utils/checkout.ts` and `order.ts`; `tests/checkout.test.ts` fails if they drift apart.
