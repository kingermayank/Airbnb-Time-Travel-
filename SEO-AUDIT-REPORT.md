# SEO Audit Report — Warpbnb

**Date:** February 22, 2025  
**Scope:** Technical + on-page (source and markup)  
**Site type:** Single-page app (Vite + React), travel/stays product (Warpbnb — time travel stays)

---

## Executive Summary

**Overall health:** Needs improvement. The site has a clear brand (Warpbnb) and good content structure, but **critical gaps** in meta tags, social sharing, and crawlability will limit discoverability and how links appear when shared.

**Top priorities:**
1. **Add meta description and Open Graph / Twitter Card tags** (including preview image) — high impact, quick win.
2. **Add a preview (OG) image** so shared links show a proper card.
3. **Consider `robots.txt` and sitemap** once the production URL is fixed; ensure important routes are crawlable (SPA).

**Quick wins:** Meta description, OG/Twitter tags, and OG image are being added in this pass.

---

## Technical SEO Findings

### Crawlability

| Issue | Impact | Evidence | Fix |
|-------|--------|----------|-----|
| No `robots.txt` | Low | No file in `public/` | Add `public/robots.txt` allowing crawlers; add Sitemap URL when you have a sitemap. |
| No XML sitemap | Medium | No sitemap file or reference | For SPAs, consider a sitemap with homepage + key listing routes (e.g. `/`, `/listing/:id`, `/faq`). Submit in Search Console. |
| SPA with client-side routes | Medium | All routes serve same `index.html` (see `vercel.json` rewrites) | Ensure crawlers can see content (Googlebot runs JS). For critical listing pages, consider pre-render or SSR if you need stronger SEO. |

### Indexation

| Issue | Impact | Evidence | Fix |
|-------|--------|----------|-----|
| No canonical tag | Medium | `index.html` has no `<link rel="canonical">` | Add canonical to the final URL (e.g. production origin). For a single-domain SPA, one canonical per route is ideal (would need dynamic head or build-time URL). |
| No meta robots | Low | No `noindex`/`noindex, follow` on staging | If you have a staging URL, add `noindex` there so only production is indexed. |

### Site speed & Core Web Vitals

- **Vite + React:** Good base for fast loads; ensure code-splitting and lazy loading where appropriate.
- **Fonts:** Preconnect/preload for Google Fonts in `index.html` is good; watch LCP if fonts block first paint.
- **Recommendation:** Run PageSpeed Insights (and Search Console CWV) on the live URL after deployment.

### Mobile & security

- Viewport meta is set; responsive layout is in place.
- HTTPS and security depend on hosting (e.g. Vercel); ensure no mixed content.

---

## On-Page SEO Findings

### Title tags

| Issue | Impact | Evidence | Fix |
|-------|--------|----------|-----|
| Single global title only | Medium | `index.html`: `<title>Warpbnb</title>` for entire app | OK for homepage. For listing/detail pages, consider dynamic titles (e.g. React Helmet or `document.title`) so each page has a unique, descriptive title (e.g. "Crystal Villa, Atlantis — Warpbnb"). |

**Current:** "Warpbnb" (good brand, short).  
**Suggestion:** Keep as default; add per-page titles for listing and key static pages.

### Meta descriptions

| Issue | Impact | Evidence | Fix |
|-------|--------|----------|-----|
| No meta description | High | No `<meta name="description" content="...">` in `index.html` | Add a unique, compelling description (150–160 chars) for the homepage. Improves CTR in search and clarity when shared. |

**Added in this pass:** A default meta description for the site.

### Heading structure

- Homepage content is in the generated component; ensure there is **one clear H1** (e.g. “Find your time-travel stay” or similar) and logical H2/H3 for sections.
- Listing and FAQ pages should each have one H1 that matches the page purpose.

### Open Graph & Twitter Card (social preview)

| Issue | Impact | Evidence | Fix |
|-------|--------|----------|-----|
| No OG/Twitter meta | High | No `og:*` or `twitter:*` in `index.html` | Add `og:title`, `og:description`, `og:image`, `og:url`, `og:type` and Twitter `summary_large_image` with same image. |
| No preview image | High | No `og:image` | Add an image (e.g. 1200×630) at a stable URL; set `og:image` and `twitter:image` (absolute URL preferred when possible). |

**Added in this pass:** Full OG and Twitter Card tags plus a default preview image path.

### Image optimization

- Listing images use external URLs; ensure they use appropriate formats (e.g. WebP where possible) and dimensions.
- **Alt text:** Ensure every meaningful image has descriptive `alt` (e.g. listing titles as alt on cards).

### URL structure

- Routes like `/`, `/listing/:id`, `/faq` are clean and descriptive; good for SEO.

---

## Content quality

- **Value proposition:** Time-travel stays (Warpbnb) is clear and differentiated.
- **Listing content:** Rich titles and themes (eras, locations); ensure listing detail pages have enough unique copy for search.
- **FAQ / Support:** Good for long-tail and trust; keep content accurate and updated.

---

## Prioritized action plan

1. **Done in this pass**
   - Add meta description.
   - Add Open Graph and Twitter Card meta tags.
   - Add a default OG preview image and wire it in `index.html`.

2. **Next steps (you)**
   - Replace the default OG image with your own 1200×630 asset in `public/images/og-preview.png` (or update the meta to point to your preferred image URL).
   - Add per-page `<title>` (and optionally meta description) for listing and key pages (e.g. via `document.title` or a small head utility).
   - Add `public/robots.txt` (allow crawlers; optional Sitemap URL).
   - When the site is live, add the property to Google Search Console and (if you generate one) submit the sitemap.
   - Run PageSpeed Insights and Mobile-Friendly Test on the production URL.

3. **Later**
   - Consider a sitemap (static or generated) for main routes.
   - If you need maximum SEO for listing pages, consider pre-rendering or SSR for critical paths.

---

## Summary

The codebase is in good shape for a product SPA; the main gaps were **missing meta description**, **no social preview (OG/Twitter)**, and **no preview image**. Adding these improves how the site appears in search and when shared. After deployment, verify the preview with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator).
