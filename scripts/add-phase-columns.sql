-- Phase 1, 2, 3 Database Schema Updates
-- Run this in Supabase SQL Editor before running the TypeScript update script

-- ============================================================================
-- REVIEWS TABLE: Add badges and cross-timeline response fields
-- ============================================================================
ALTER TABLE reviews
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS response_to_reviewer TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS response_comment TEXT DEFAULT NULL;

-- ============================================================================
-- HOSTS TABLE: Add temporal guardian badge and house rules quirks
-- ============================================================================
ALTER TABLE hosts
ADD COLUMN IF NOT EXISTS is_temporal_guardian BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS house_rules_quirks JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT NULL;

-- ============================================================================
-- LISTINGS TABLE: Add things_to_know JSONB field
-- ============================================================================
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS things_to_know JSONB DEFAULT NULL;

-- ============================================================================
-- Verify columns were added
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE 'Schema updates complete!';
  RAISE NOTICE 'Added to reviews: badges, response_to_reviewer, response_comment';
  RAISE NOTICE 'Added to hosts: is_temporal_guardian, house_rules_quirks, badges';
  RAISE NOTICE 'Added to listings: things_to_know';
END $$;
