# Repository structure

High-level layout of the codebase, with focus on the design system and Storybook.

## Design system (`src/design-system/`)

- **`tokens/`** – CSS custom properties (colors, spacing, typography, radii, shadows). Single source of truth; see `tokens/TOKENS.md`.
- **`foundations/`** – Primitive UI building blocks:
  - **Text**, **Button**, **IconButton**, **Icon**, **Badge**, **Avatar**, **Input**, **Divider**, **SectionTitle**
  - IconButton: icon-only control with hover/press states (e.g. header language/menu actions).
- **`patterns/`** – Composed components:
  - **Header** – Top nav (logo, tabs with optional icons, rightSlot). Optional `onLogoClick` for logo/brand navigation (e.g. home).
  - **SearchField** – Where / Era / Who search bar with red search button (Figma homepage).
  - **SearchBar**, **ListingCard**, **BookingWidget**, **VehicleCard**, **ConfirmationSummary**, **ConfirmationListingCard**
  - **Listing-detail (Figma 283-2855):** ListingHeroGallery, ListingMeta, HostSummary, ListingHighlight, ListingDescription, SleepArrangementCard, AmenitiesGrid, ReviewScoreBars, ReviewCard, ReviewsSection, PolicyBlock, ThingsToKnow, Footer.

Foundations and patterns use design tokens and are consumed by the app and by Storybook. The homepage (`src/components/generated/Component.tsx`) uses **Header**, **SearchField**, and **ListingCard** from the design system, wired to `fetchListings` and listing detail navigation.

## Storybook (`src/stories/`)

- **`foundations/`** – One `.stories.tsx` per foundation (Button, IconButton, SectionTitle, Text, etc.).
- **`patterns/`** – One `.stories.tsx` per pattern (Header, ListingCard, ListingHighlight, ListingDescription, ReviewsSection, etc.).

Stories mirror the design system hierarchy and document variants (e.g. default, hover, press, disabled).

## App entry and routes

- **`src/App.tsx`** – Router and top-level layout.
- **`src/main.tsx`** – Entry; loads `index.css` (tokens + Tailwind).
- **`src/components/`** – Page-level and generated components (e.g. `generated/Component.tsx` for Figma-derived home page). **ConfirmationPage** uses the design-system Header (confirm-and-pay step), **ConfirmationListingCard** (post-booking view per Figma 283-3283), tokens (Figtree font), and local assets from `public/images/vehicles/` and `public/images/payments/` for teleportation and payment method icons. The post-booking confirmation view shows logo-only (no nav bar), light beige background (`--ds-confirmation-bg`), and ConfirmationListingCard.

## Docs

- **`docs/architecture/`** – Architecture and repo structure (this file).
- **`docs/decisions/`** – ADRs for design-system and architectural choices.
- **`docs/figma-mapping.md`** – Mapping of Figma frames to app flows.
