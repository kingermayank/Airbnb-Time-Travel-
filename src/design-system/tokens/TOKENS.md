# Design System Tokens

Tokens are defined in `index.css` and used by foundation and pattern components. Values are aligned with the [airbnb Figma file](https://www.figma.com/design/i86DhDKpgmbt6yhKbCqu3s/airbnb) (manual extraction from Dev Mode).

## Colors

| Token | Value | Figma usage |
|-------|--------|-------------|
| `--ds-primary` | #222222 | Primary buttons, main text |
| `--ds-primary-foreground` | #ffffff | Text on primary |
| `--ds-secondary` | #ebebeb | Secondary buttons, hover |
| `--ds-accent` | #ff385c | Heart icon, links, focus ring |
| `--ds-surface` | #ffffff | Cards, badges |
| `--ds-text-primary` | #222222 | Headings, body |
| `--ds-text-secondary` | #717171 | Supporting text |
| `--ds-text-nav-inactive` | #6a6a6a | Nav tabs (default state) |
| `--ds-text-muted` | rgba(0,0,0,0.5) | Icons, placeholder |
| `--ds-border` | rgba(217,217,217,1) | Dividers, inputs |
| `--ds-surface-icon-button` | #f2f2f2 | Icon button default (muted) |
| `--ds-icon-white` | #ffffff | Icon on dark/photo backgrounds (e.g. listing card heart) |
| `--ds-heart-interior-unfilled` | rgba(0,0,0,0.3) | Listing card heart interior when not liked (30% black); when liked, fill uses `--ds-accent` (red) |
| `--ds-overlay-hover` | rgba(0,0,0,0.08) | Button and icon button hover (8% black overlay) |
| `--ds-surface-ghost-hover` | #f2f2f2 | Ghost text button hover (pill fill, e.g. "Become a host") |
| `--ds-surface-header` | rgba(251,251,251,1) | Header and search bar background (shared gray; no divider below header) |
| `--ds-navbar-active` | #222222 | Header nav active tab (Figma 307-4788) |
| Coming soon pill | radial #354668 50% → #657E9B 100%, radius 8px 16px 2px 16px | Header pill (Figma 307-4788) |
| `--ds-header-coming-soon-glow` | 0 0 14px rgba(120,180,255,0.45) | Coming soon pill glow |
| `--ds-confirmation-bg` | #FAF9F7 | Confirmation page background (Figma 283-3283: light beige/off-white) |

## Spacing

Scale from 0 to 128px (`--ds-spacing-0` … `--ds-spacing-128`). Used for padding, gaps, and layout. Matches existing `--spacing-*` in app CSS.

## Typography

- **Font:** Figtree (same as app).
- **Sizes:** 10px–32px (`--ds-text-10` … `--ds-text-32`), plus `--ds-text-30` (30px) for host card name.
- **Weights:** 400, 500, 600, 700.
- **Letter spacing:** -1% (`--ds-letter-spacing`).

## Radii

- `--ds-radius-sm` 4px, `--ds-radius-md` 8px, `--ds-radius-lg` 12px, `--ds-radius-xl` 24px, `--ds-radius-full` 3000px (pill).
- `--ds-radius-booking-card` 12px, `--ds-booking-card-padding` 24px (Figma 283-2976).

## Shadows

- `--ds-shadow-badge` – Guest favorite badge.
- `--ds-shadow-card` – Cards, modals.
- `--ds-shadow-booking-card` – Booking/pricing card (Figma 283-2976): `0 6px 16px rgba(0,0,0,0.12)`.
- `--ds-shadow-focus` – Focus ring (accent color).

## Component-specific (listing card, badge)

- `--ds-listing-card-badge-inset-top` – 11px. Top offset for the Guest favorite pill on listing cards (1px less than `--ds-spacing-12`).
- `--ds-listing-card-badge-inset-left` – Same as `--ds-spacing-12`. Left offset for the pill.
- `--ds-badge-padding-top` – 6px. Top padding inside the Badge pill (e.g. Guest favorite); includes +1px from base.
- `--ds-badge-padding-bottom` – 5px. Bottom padding inside the Badge pill; includes +1px from base.

## Listing detail section / content spacing

- `--ds-section-padding-y` – 24px. Padding below section content and margin before next section.
- `--ds-section-divider` – 1px solid var(--ds-border-light). Divider between sections.
- `--ds-content-gap-sm` – 16px. Gap between list items (amenities, highlights, policy bullets).
- `--ds-content-gap-md` – 24px. Gap between distinct blocks (e.g. section title to content, rating bars to review cards).

## Host card (Figma 283-3049)

- `--ds-host-card-width` – 370px. Exact card width.
- `--ds-host-card-height` – 216px. Exact card height.

## Listing card heart interaction

- **Hover:** Heart icon scales to 110% (`transform: scale(1.10)`), transition 0.2s ease.
- **Click (like):** Fill/stroke transition to accent (red) over 0.28s; button plays a short scale pop animation (keyframes `ds-heart-liked-pop`: 1 → 1.12 → 0.98 → 1) over 0.4s.
