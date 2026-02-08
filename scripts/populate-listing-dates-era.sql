-- Populate date (era) for listings that were missing it so the card shows year + rating.
-- Applied via Supabase migration: populate_listing_dates_era

UPDATE listings
SET date = '1650 CE', updated_at = NOW()
WHERE title = 'Entire royal suite hosted by Shah Jahan' AND (date IS NULL OR date = '');

UPDATE listings
SET date = '2154 CE', updated_at = NOW()
WHERE title = 'Pandora Floating Mountain Bungalow' AND (date IS NULL OR date = '');

UPDATE listings
SET date = '2050 CE', updated_at = NOW()
WHERE title = 'SpaceX Mars Colony Pod at Olympus Mons' AND (date IS NULL OR date = '');

UPDATE listings
SET date = 'c. 9600 BCE', updated_at = NOW()
WHERE title = 'The Lost Atlantean Crystal Villa' AND (date IS NULL OR date = '');
