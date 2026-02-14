# PR: Phase 2 – UX and touch (design engineering)

Design audit Phase 2: 44px tap targets, hover-only effects, reserve toasts, and ListingCard price display.

---

## Files changed

| File | Change type |
|------|-------------|
| `src/design-system/patterns/Header/Header.css` | Modified |
| `src/design-system/patterns/ListingCard/ListingCard.tsx` | Modified |
| `src/design-system/patterns/ListingCard/ListingCard.css` | Modified |
| `src/design-system/patterns/BookingWidget/BookingWidget.tsx` | Modified |
| `src/design-system/patterns/SearchField/SearchField.css` | Modified |
| `src/design-system/foundations/Button/Button.css` | Modified |
| `src/main.tsx` | Modified |
| `src/components/ListingDetailPage.tsx` | Modified |

No new components or new variants. One existing dependency used: `sonner` (already in package.json).

---

## Code changes

### 1. P1-3: 44px minimum tap targets

**`src/design-system/patterns/Header/Header.css`**
- `.ds-header-right-icon-btn`: `width`/`height` 40px → 44px; added `min-width`/`min-height: 44px`.
- Header Help and Menu (hamburger) buttons now meet 44px tap target.

**`src/design-system/patterns/ListingCard/ListingCard.tsx`**
- Heart button inline style: added `minWidth: 44`, `minHeight: 44`, `padding: 10` (was `padding: 0`) so the 24px icon sits in a 44px hit area.

**`src/design-system/patterns/BookingWidget/BookingWidget.tsx`**
- Duration option buttons: added `minHeight: 44` to inline style.
- “Change” (guests) button: added `minHeight: 44`, `padding: 'var(--ds-spacing-8) 0'` (replaced `padding: 0`).

### 2. P1-4: Hover-only effects (`@media (hover: hover)`)

**`src/design-system/patterns/Header/Header.css`**
- Wrapped `.ds-header-right-icon-btn:hover` in `@media (hover: hover) { ... }`.

**`src/design-system/patterns/SearchField/SearchField.css`**
- Wrapped `.ds-search-field-section:hover:not(:disabled)` and the who-zone hover override in `@media (hover: hover)`.
- Wrapped `.ds-search-field-search-btn:hover:not(:disabled)` in `@media (hover: hover)`.

**`src/design-system/foundations/Button/Button.css`**
- Wrapped `.ds-button--primary:hover`, `--secondary:hover`, `--ghost:hover` (overlay box-shadow) in `@media (hover: hover)`.

**`src/design-system/patterns/ListingCard/ListingCard.css`**
- Wrapped `.ds-listing-card-heart-btn:hover .ds-listing-card-heart-icon { transform: scale(1.10); }` in `@media (hover: hover)`.

### 3. P1-5: Toast on reserve success/error

**`src/main.tsx`**
- Import: `import { Toaster } from 'sonner';`
- Rendered `<Toaster position="top-center" richColors closeButton />` inside `BrowserRouter` (sibling to `App`).

**`src/components/ListingDetailPage.tsx`**
- Import: `import { toast } from 'sonner';`
- `handleReserve`: wrapped in `try/catch`. On success: `toast.success('Time window reserved — confirm and pay')` before `navigate(...)`. On catch: `toast.error('Something went wrong. Please try again.')` and `setIsBooking(false)`.

### 4. P1-6: ListingCard display price

**`src/design-system/patterns/ListingCard/ListingCard.tsx`**
- In the price row (below title): render `price` first as `<Text variant="bodySmall" color="primary" weight="medium">{price}</Text>`.
- Then keep existing year/rating segments with leading ` · ` so the row reads e.g. `₿0.012540 / hour · 330 BCE · ★ 4.82` (or just price when no year/rating).

---

## Before / after behavior

| Area | Before | After |
|------|--------|--------|
| Header icon buttons (Help, Menu) | 40×40px tap target | 44×44px; better for touch and a11y. |
| Listing card heart | Small hit area (~24px) | 44×44px hit area with padding. |
| Booking duration / “Change” | Could be &lt; 44px height | min 44px height for tap. |
| Hover effects (buttons, search, heart) | Fired on touch (e.g. sticky hover) | Only when `hover: hover` (pointer devices); touch doesn’t get hover. |
| Reserve flow | No feedback before navigate | Success toast “Time window reserved — confirm and pay” then navigate; on error, toast and stay on page. |
| Listing cards | Price prop not shown | Price shown in card (e.g. “₿0.012540 / hour”) with year/rating when present. |

---

## New components / variants

- **None.** Only existing components and styles were updated; `Toaster` from `sonner` is the only new UI element (global toast container).

---

## How to verify

1. **Tap targets**: Use devtools or tap on header icons, card heart, duration chips, and “Change” — all should have at least 44px interactive area.
2. **Hover**: On desktop, hover buttons/search/heart to see effects; on a touch device or with “Emulate CSS media feature `prefers-reduced-motion`” disabled and “hover” off, hover effects should not stick.
3. **Toasts**: On listing detail, click Reserve; after ~3s expect success toast then redirect to confirm. (Error path can be checked by forcing a failure in `handleReserve`.)
4. **ListingCard price**: Home and listing grids show price on each card (e.g. “₿0.012540 / hour”) along with optional year/rating.
