SELECT 1;
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  listing_title TEXT NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  base_fare_usd NUMERIC(10, 2) NOT NULL,
  service_fee_usd NUMERIC(10, 2) DEFAULT 0,
  cleaning_fee_usd NUMERIC(10, 2) DEFAULT 0,
  occupancy_tax_usd NUMERIC(10, 2) DEFAULT 0,
  guest_count INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on bookings" ON bookings;
-- Allow public read access (SELECT) for bookings
CREATE POLICY "Allow public read access on bookings" ON bookings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public write access on bookings" ON bookings;
-- Allow public write access (INSERT, UPDATE, DELETE) for bookings
CREATE POLICY "Allow public write access on bookings" ON bookings
  FOR ALL USING (true);

