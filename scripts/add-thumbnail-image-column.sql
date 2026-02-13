-- Add thumbnail_image column to listings table for optimized homepage images
-- This allows us to store smaller thumbnail versions (50-200 KB) for homepage cards
-- while keeping full-size images (1-3 MB) for detail pages

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS thumbnail_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN listings.thumbnail_image IS 'Optimized thumbnail image URL for homepage cards (typically 500px width, ~50-200 KB). Falls back to main_image if NULL.';
