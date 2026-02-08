# Figma to App Mapping

Design system and app pages are aligned to the following Figma frames in the [airbnb Figma file](https://www.figma.com/design/i86DhDKpgmbt6yhKbCqu3s/airbnb).

| Node ID  | Page / flow           | Use for |
|----------|------------------------|--------|
| 307-4788 | Header navigation      | Header pattern: logo, nav tabs, right slot (Become a host, icon buttons) |
| 283-2649 | Home (frame)           | Design system reference: top nav (four tabs), icon/text buttons, listing cards (title+year, rating, heart, guest favorite chip) |
| 283-3280 | Header buttons         | "Become a host" (ghost text, default/hover pill), icon buttons (default/hover gray), accent search button |
| 283-3730 | Home                   | Homepage: header, search bar, listing grid |
| 293-4354 | Listing card variations | Card variations: default, guest favorite chip, heart saved, with date; grid layout |
| 303-4652 | Search field           | Search field: Where / Era / Who sections; default + three active states |
| 283-2855 | Listing details        | Listing detail page. Design system components: **ListingHeroGallery** (title + 5-image grid), **ListingMeta**, **HostSummary**, **ListingHighlight**, **ListingDescription**, **SectionTitle** + **SleepArrangementCard**, **AmenitiesGrid**, **ReviewScoreBars** + **ReviewCard** + **ReviewsSection**, **PolicyBlock** + **ThingsToKnow**, **Footer**. All "Show more" / "Show all N" CTAs use Button variant=secondary. |
| 283-3145 | Booking flow           | Vehicle selection, currency, payment step |
| 283-3283 | Post-booking summary   | Confirmation page shown after "Book Launch Window" on `/listing/:id/confirm`: **logo only** (no nav bar), light beige background (`--ds-confirmation-bg`), **ConfirmationListingCard**, "Securing arrival window" message, Share and Give Feedback buttons |
| 283-3285 | Confirmation card      | **ConfirmationListingCard** pattern: white card, 16px radius, subtle border/shadow; image 3:4 (portrait, ~60–65% of card); title, era, then larger gap, guest count and total; generous padding |

**Token source:** Manual extraction from Figma Dev Mode (Inspect). Colors, spacing, typography, radii, and shadows are documented in `src/design-system/tokens/TOKENS.md` and implemented in `src/design-system/tokens/index.css`.
