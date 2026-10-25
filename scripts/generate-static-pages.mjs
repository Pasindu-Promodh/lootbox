// Runs after `vite build`. GitHub Pages has no SPA fallback, so this writes:
//   dist/404.html                 – app shell for any unknown path
//   dist/<route>/index.html       – static routes (shop, orders, …)
//   dist/product/<id>/index.html  – one page per product, with its own title,
//                                   description, Open Graph tags and JSON-LD
//   dist/sitemap.xml, robots.txt
// Every file is the same app shell, so the SPA takes over after load; the
// per-page <head> lets crawlers and link previews see real content and a 200.
//
// Products are read from Supabase (products_public) using the same
// VITE_SUPABASE_* env vars as the app. If they're missing or the request
// fails, product pages are skipped (they still work via 404.html).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE_URL = "https://pickio.lk";
const DIST = "dist";
const DEFAULT_DESCRIPTION = "Find the best products and deals, effortlessly.";

const STATIC_ROUTES = [
  { path: "shop", title: "Shop | Pickio", description: "Browse all products at Pickio. Cash on delivery islandwide." },
  { path: "orders", title: "My Orders | Pickio", noindex: true },
  { path: "profile", title: "Profile | Pickio", noindex: true },
  { path: "checkout", title: "Checkout | Pickio", noindex: true },
];

function loadEnv() {
  const env = { ...process.env };
  if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !(match[1] in env)) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const oneLine = (text, max = 160) => {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
};

function setMeta(html, key, value) {
  const pattern = new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`, "s");
  return html.replace(pattern, `$1${escapeHtml(value)}$2`);
}

function withHead(template, { title, description, url, image, noindex, jsonLd }) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  const desc = description || DEFAULT_DESCRIPTION;

  for (const key of ["description", "og:description", "twitter:description"]) html = setMeta(html, key, desc);
  for (const key of ["og:title", "twitter:title"]) html = setMeta(html, key, title);
  for (const key of ["og:url", "twitter:url"]) html = setMeta(html, key, url);
  if (image) for (const key of ["og:image", "twitter:image"]) html = setMeta(html, key, image);

  const extra = [`<link rel="canonical" href="${escapeHtml(url)}" />`];
  if (noindex) extra.push(`<meta name="robots" content="noindex" />`);
  if (jsonLd) {
    // "<" is escaped so product text can't close the script tag.
    const json = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
    extra.push(`<script type="application/ld+json">${json}</script>`);
  }
  return html.replace("</head>", `    ${extra.join("\n    ")}\n  </head>`);
}

function writePage(path, html) {
  const file = join(DIST, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

async function fetchProducts(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[static-pages] VITE_SUPABASE_* not set; skipping product pages.");
    return [];
  }
  // PostgREST caps each response (max_rows = 1000), so page until a short page.
  const PAGE = 1000;
  const all = [];
  try {
    for (let offset = 0; ; offset += PAGE) {
      const res = await fetch(
        `${url}/rest/v1/products_public?select=id,name,description,images,price,in_stock,category` +
          `&order=id&limit=${PAGE}&offset=${offset}`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      const page = await res.json();
      all.push(...page);
      if (page.length < PAGE) return all;
    }
  } catch (err) {
    console.warn("[static-pages] Could not fetch products; skipping product pages:", err.message);
    return [];
  }
}

const template = readFileSync(join(DIST, "index.html"), "utf8");

writeFileSync(join(DIST, "404.html"), template);

for (const route of STATIC_ROUTES) {
  writePage(
    route.path,
    withHead(template, { ...route, url: `${SITE_URL}/${route.path}` })
  );
}

const products = await fetchProducts(loadEnv());

for (const p of products) {
  const url = `${SITE_URL}/product/${encodeURIComponent(p.id)}`;
  const image = p.images?.[0]?.main;
  const description = oneLine(p.description) || `${p.name} at Pickio. Cash on delivery islandwide.`;

  writePage(
    `product/${p.id}`,
    withHead(template, {
      title: `${oneLine(p.name, 70)} | Pickio`,
      description,
      url,
      image,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        description,
        image: image ? [image] : undefined,
        category: p.category || undefined,
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "LKR",
          price: Number(p.price),
          availability: p.in_stock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
    })
  );
}

const sitemapUrls = [`${SITE_URL}/`, `${SITE_URL}/shop`, ...products.map((p) => `${SITE_URL}/product/${encodeURIComponent(p.id)}`)];
writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map((u) => `  <url><loc>${escapeHtml(u)}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`[static-pages] 404.html, ${STATIC_ROUTES.length} routes, ${products.length} product pages, sitemap.xml`);
