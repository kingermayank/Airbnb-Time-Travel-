-- Supabase Migration Script for Airbnb Listings
-- This script creates all necessary tables and inserts initial data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: hosts
-- ============================================
CREATE TABLE IF NOT EXISTS hosts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  profile_picture_url TEXT,
  join_date DATE,
  response_rate INTEGER,
  response_time TEXT,
  is_superhost BOOLEAN DEFAULT false,
  is_identity_verified BOOLEAN DEFAULT false,
  total_reviews INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: listings
-- ============================================
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES hosts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  main_image TEXT NOT NULL,
  property_type TEXT,
  guest_capacity INTEGER,
  bedrooms INTEGER,
  beds INTEGER,
  baths INTEGER,
  price_per_night NUMERIC(10, 2) NOT NULL,
  price_display TEXT,
  overall_rating NUMERIC(3, 2),
  total_reviews INTEGER DEFAULT 0,
  is_guest_favorite BOOLEAN DEFAULT false,
  date TEXT,
  location_description TEXT,
  short_description TEXT,
  full_description TEXT,
  key_features JSONB,
  cancellation_policy TEXT,
  weekly_discount_percent NUMERIC(5, 2),
  cleaning_fee NUMERIC(10, 2),
  service_fee_percent NUMERIC(5, 2),
  occupancy_tax_percent NUMERIC(5, 2),
  sleeping_arrangements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: listing_images
-- ============================================
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: amenities
-- ============================================
CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: listing_amenities (junction table)
-- ============================================
CREATE TABLE IF NOT EXISTS listing_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, amenity_id)
);

-- ============================================
-- TABLE: reviews
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_avatar_url TEXT,
  review_date DATE NOT NULL,
  rating_overall NUMERIC(3, 2),
  rating_cleanliness NUMERIC(3, 2),
  rating_accuracy NUMERIC(3, 2),
  rating_communication NUMERIC(3, 2),
  rating_location NUMERIC(3, 2),
  rating_checkin NUMERIC(3, 2),
  rating_value NUMERIC(3, 2),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON listings(host_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_order ON listing_images(listing_id, image_order);
CREATE INDEX IF NOT EXISTS idx_listing_amenities_listing_id ON listing_amenities(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_amenities_amenity_id ON listing_amenities(amenity_id);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hosts_updated_at BEFORE UPDATE ON hosts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Enable RLS on all tables
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access (SELECT) for all tables
CREATE POLICY "Allow public read access on hosts" ON hosts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on listings" ON listings
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on listing_images" ON listing_images
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on amenities" ON amenities
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on listing_amenities" ON listing_amenities
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on reviews" ON reviews
  FOR SELECT USING (true);

-- Allow public write access (INSERT, UPDATE, DELETE) for all tables
-- This allows editing via Supabase dashboard without authentication
CREATE POLICY "Allow public write access on hosts" ON hosts
  FOR ALL USING (true);

CREATE POLICY "Allow public write access on listings" ON listings
  FOR ALL USING (true);

CREATE POLICY "Allow public write access on listing_images" ON listing_images
  FOR ALL USING (true);

CREATE POLICY "Allow public write access on amenities" ON amenities
  FOR ALL USING (true);

CREATE POLICY "Allow public write access on listing_amenities" ON listing_amenities
  FOR ALL USING (true);

CREATE POLICY "Allow public write access on reviews" ON reviews
  FOR ALL USING (true);

-- ============================================
-- INITIAL DATA: Hosts
-- ============================================
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES
  (uuid_generate_v4(), 'Elon', 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/elon-profile.jpg', '2025-05-01', 100, 'within an hour', true, true, 8, 'Superhost with expertise in futuristic accommodations'),
  (uuid_generate_v4(), 'Historical Host', NULL, '2024-01-01', 95, 'within 2 hours', true, true, 15, 'Specializing in time travel experiences'),
  (uuid_generate_v4(), 'Adventure Host', NULL, '2023-06-01', 98, 'within an hour', false, true, 12, 'Curator of unique and extraordinary stays')
ON CONFLICT DO NOTHING;

-- Get host IDs for use in listings (using a subquery approach)
DO $$
DECLARE
  host_elon_id UUID;
  host_historical_id UUID;
  host_adventure_id UUID;
BEGIN
  SELECT id INTO host_elon_id FROM hosts WHERE name = 'Elon' LIMIT 1;
  SELECT id INTO host_historical_id FROM hosts WHERE name = 'Historical Host' LIMIT 1;
  SELECT id INTO host_adventure_id FROM hosts WHERE name = 'Adventure Host' LIMIT 1;

-- ============================================
-- INITIAL DATA: Listings
-- ============================================
INSERT INTO listings (
  id, host_id, title, main_image, property_type, guest_capacity, bedrooms, beds, baths,
  price_per_night, price_display, overall_rating, total_reviews, is_guest_favorite, date,
  location_description, short_description, full_description, key_features, cancellation_policy,
  weekly_discount_percent, cleaning_fee, service_fee_percent, occupancy_tax_percent, sleeping_arrangements
)
VALUES
  (
    uuid_generate_v4(),
    host_historical_id,
    'Shah Jahan''s Marble Suite in Agra',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg',
    'Entire rental unit',
    2, 1, 1, 1,
    1586.00, '$1,586 for 1 night',
    4.82, 18, true, NULL,
    'Agra, India',
    'Luxurious marble suite from the Mughal era',
    'Experience the opulence of the Mughal Empire in this exquisite marble suite. Built during the reign of Shah Jahan, this accommodation offers unparalleled luxury and historical significance.',
    '[
      {"title": "Entire Suite", "description": "A private, fully furnished suite with no shared spaces"},
      {"title": "Historical Authenticity", "description": "Original Mughal architecture and design preserved"},
      {"title": "Self Check-in", "description": "Easy access via secure entrance"}
    ]'::jsonb,
    'Free cancellation before 5 days before arrival',
    5.00, 50.00, 12.00, 4.00,
    '[{"room": "Bedroom", "beds": "1 queen bed"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_elon_id,
    'SpaceX Mars Colony Pod at Olympus Mons',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg',
    'Entire rental unit',
    2, 1, 2, 1,
    687.00, '$687 for 1 night',
    4.82, 18, false, NULL,
    'Olympus Mons Base, Mars',
    'Futuristic Mars habitat with stunning views',
    'A fully pressurized, self-sustaining habitat designed for explorers, engineers, and curious Earthlings alike. Located on the slopes of the tallest volcano in the solar system, offering uninterrupted views of the Martian horizon.',
    '[
      {"title": "Entire Colony Pod", "description": "A private, fully pressurized Mars habitat with no shared modules"},
      {"title": "Enhanced Decontamination", "description": "Follows SpaceX''s multi-step planetary air-filtration protocol"},
      {"title": "Autonomous Entry", "description": "Self check-in via secure airlock keypad"}
    ]'::jsonb,
    'Free cancellation before 5 days before arrival (Earth Standard Time)',
    5.00, 62.00, 12.00, 4.00,
    '[{"room": "Bedroom", "beds": "1 queen bed"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_adventure_id,
    'The Lost Atlantean Crystal Villa',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/bbe5b882-690a-4661-836a-08f66193c3f1.jpg',
    'Entire villa',
    4, 2, 3, 2,
    1045.00, '$1,045 for 1 night',
    4.82, 12, false, NULL,
    'Atlantis, Underwater',
    'Mystical crystal villa beneath the waves',
    'Discover the legendary city of Atlantis in this stunning crystal villa. Built with ancient Atlantean technology, this underwater paradise offers a unique experience unlike any other.',
    '[
      {"title": "Entire Villa", "description": "Private crystal villa with full autonomy"},
      {"title": "Underwater Views", "description": "360-degree views of the ocean depths"},
      {"title": "Ancient Technology", "description": "Powered by Atlantean crystal energy"}
    ]'::jsonb,
    'Free cancellation before 7 days before arrival',
    10.00, 75.00, 12.00, 5.00,
    '[{"room": "Master Bedroom", "beds": "1 king bed"}, {"room": "Guest Bedroom", "beds": "1 queen bed"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_historical_id,
    'First-Class Suite in Titanic April 1912',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg',
    'Entire rental unit',
    2, 1, 1, 1,
    564.00, '$564 for 1 night',
    4.82, 15, false, 'April 1912',
    'RMS Titanic, North Atlantic',
    'Luxurious first-class accommodation on the iconic ship',
    'Step back in time to experience the grandeur of the Titanic''s first-class accommodations. This meticulously recreated suite offers the elegance and luxury of the early 20th century.',
    '[
      {"title": "Entire Suite", "description": "Private first-class suite with period-accurate furnishings"},
      {"title": "Historical Accuracy", "description": "Authentic 1912 decor and amenities"},
      {"title": "Ocean Views", "description": "Stunning views of the North Atlantic"}
    ]'::jsonb,
    'Free cancellation before 3 days before arrival',
    0.00, 40.00, 10.00, 3.00,
    '[{"room": "Bedroom", "beds": "1 queen bed"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_historical_id,
    'WWII German Resistance Safehouse Loft',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/b2e96b48-0491-4bea-a1df-887341cc53d5.jpg',
    'Entire loft',
    2, 1, 1, 1,
    298.00, '$298 for 1 night',
    4.75, 8, false, '1944',
    'Berlin, Germany',
    'Covert accommodation with historical significance',
    'A carefully preserved safehouse used during World War II. This loft offers a glimpse into the courageous efforts of the resistance movement, with authentic period details and hidden features.',
    '[
      {"title": "Entire Loft", "description": "Private loft with no shared spaces"},
      {"title": "Historical Preservation", "description": "Authentic 1940s furnishings and hidden compartments"},
      {"title": "Self Check-in", "description": "Discreet entry via secret passage"}
    ]'::jsonb,
    'Free cancellation before 2 days before arrival',
    0.00, 25.00, 8.00, 2.00,
    '[{"room": "Loft", "beds": "1 double bed"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_adventure_id,
    'Pandora Floating Mountain Bungalow',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1221494e-450b-4112-b3ec-6845b91292d6.png',
    'Entire bungalow',
    4, 2, 2, 2,
    2265.00, '$2,265 for 1 night',
    4.82, 22, true, NULL,
    'Pandora, Alpha Centauri System',
    'Floating mountain retreat with bioluminescent views',
    'Experience the wonder of Pandora in this floating mountain bungalow. Surrounded by the planet''s unique flora and fauna, this accommodation offers breathtaking views and an otherworldly experience.',
    '[
      {"title": "Entire Bungalow", "description": "Private floating structure with full autonomy"},
      {"title": "Bioluminescent Views", "description": "Stunning night-time displays from native Pandoran life"},
      {"title": "Eco-Friendly", "description": "Powered by Pandoran natural energy sources"}
    ]'::jsonb,
    'Free cancellation before 7 days before arrival',
    15.00, 120.00, 15.00, 6.00,
    '[{"room": "Master Bedroom", "beds": "1 king bed"}, {"room": "Guest Room", "beds": "1 queen bed"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_historical_id,
    'Ancient Egyptian Nile Villa (Old Kingdom)',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/04c1ff57-425d-4847-8646-178516b6c4f3.png',
    'Entire villa',
    6, 3, 4, 3,
    782.00, '$782 for 1 night',
    4.70, 10, false, '330 BCE',
    'Nile River, Egypt',
    'Luxurious villa from the Old Kingdom era',
    'Travel back to ancient Egypt in this magnificent Nile-side villa. Built during the Old Kingdom, this accommodation offers a unique glimpse into one of history''s greatest civilizations.',
    '[
      {"title": "Entire Villa", "description": "Private villa with multiple rooms and courtyards"},
      {"title": "Nile Views", "description": "Direct access to the Nile River with stunning views"},
      {"title": "Historical Authenticity", "description": "Period-accurate architecture and furnishings"}
    ]'::jsonb,
    'Free cancellation before 5 days before arrival',
    8.00, 60.00, 10.00, 4.00,
    '[{"room": "Master Bedroom", "beds": "1 king bed"}, {"room": "Guest Bedroom 1", "beds": "1 queen bed"}, {"room": "Guest Bedroom 2", "beds": "2 single beds"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_historical_id,
    'Alexander the Great''s Campaign Tent',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/31951292-b7a3-4d4e-9d00-944e3fd01f43.jpg',
    'Entire tent',
    4, 2, 3, 1,
    687.00, '$687 for 1 night',
    4.65, 7, false, '330 BCE',
    'Persia, Ancient World',
    'Luxurious campaign tent from Alexander''s conquests',
    'Experience life as a commander in Alexander the Great''s army. This opulent campaign tent offers a unique historical experience with authentic military accommodations from the era.',
    '[
      {"title": "Entire Tent", "description": "Private tent with separate sleeping and living areas"},
      {"title": "Historical Accuracy", "description": "Authentic 4th century BCE military furnishings"},
      {"title": "Camp Life", "description": "Experience the atmosphere of an ancient military camp"}
    ]'::jsonb,
    'Free cancellation before 3 days before arrival',
    0.00, 35.00, 8.00, 3.00,
    '[{"room": "Commander''s Quarters", "beds": "1 king bed"}, {"room": "Officer''s Area", "beds": "2 single beds"}]'::jsonb
  ),
  (
    uuid_generate_v4(),
    host_adventure_id,
    '1990s Manhattan Loft in Pre-Internet NYC',
    'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1e517539-a473-4b2a-b992-a49cc7dbbe8e.jpg',
    'Entire loft',
    2, 1, 1, 1,
    229.00, '$229 for 1 night',
    4.82, 14, false, '1990',
    'Manhattan, New York',
    'Retro NYC loft from the pre-internet era',
    'Step back to 1990s Manhattan in this authentic loft. Experience New York City before the internet age, with period-accurate decor and a true sense of the era.',
    '[
      {"title": "Entire Loft", "description": "Private loft with no shared spaces"},
      {"title": "Retro Decor", "description": "Authentic 1990s furnishings and technology"},
      {"title": "Manhattan Location", "description": "Prime location in the heart of NYC"}
    ]'::jsonb,
    'Free cancellation before 2 days before arrival',
    0.00, 20.00, 8.00, 2.00,
    '[{"room": "Loft", "beds": "1 queen bed"}]'::jsonb
  );

END $$;

-- ============================================
-- INITIAL DATA: Listing Images
-- ============================================
-- Insert main images for each listing (additional images can be added via dashboard)
INSERT INTO listing_images (listing_id, image_url, image_order, caption)
SELECT 
  l.id,
  l.main_image,
  1,
  'Main image'
FROM listings l
ON CONFLICT DO NOTHING;

-- ============================================
-- INITIAL DATA: Amenities
-- ============================================
INSERT INTO amenities (name, icon_url)
VALUES
  ('Mars surface view', NULL),
  ('Compact galley kitchen', NULL),
  ('Starlink Wi-Fi', NULL),
  ('Companion-friendly', NULL),
  ('Automated fabric recycler', NULL),
  ('Thermal drying unit', NULL),
  ('Climate-controlled habitat', NULL),
  ('External perimeter monitoring', NULL),
  ('Cold-storage unit', NULL),
  ('Exploration rovers', NULL),
  ('Wi-Fi', NULL),
  ('Kitchen', NULL),
  ('Air conditioning', NULL),
  ('Heating', NULL),
  ('Washer', NULL),
  ('Dryer', NULL),
  ('Parking', NULL),
  ('Pool', NULL),
  ('Hot tub', NULL),
  ('Gym', NULL)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- INITIAL DATA: Link Amenities to Listings
-- ============================================
-- This is a simplified version - you can add more specific amenities per listing via dashboard
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  l.id,
  a.id
FROM listings l
CROSS JOIN amenities a
WHERE a.name IN ('Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating')
ON CONFLICT DO NOTHING;

-- ============================================
-- INITIAL DATA: Reviews (Sample reviews)
-- ============================================
INSERT INTO reviews (
  listing_id, reviewer_name, reviewer_avatar_url, review_date,
  rating_overall, rating_cleanliness, rating_accuracy, rating_communication,
  rating_location, rating_checkin, rating_value, comment
)
SELECT 
  l.id,
  CASE (ROW_NUMBER() OVER (PARTITION BY l.id)) % 4
    WHEN 0 THEN 'Jose'
    WHEN 1 THEN 'Luke'
    WHEN 2 THEN 'Shayna'
    ELSE 'Josh'
  END,
  NULL,
  CURRENT_DATE - (RANDOM() * 365)::INTEGER,
  4.5 + (RANDOM() * 0.5),
  4.5 + (RANDOM() * 0.5),
  4.5 + (RANDOM() * 0.5),
  4.5 + (RANDOM() * 0.5),
  4.5 + (RANDOM() * 0.5),
  4.5 + (RANDOM() * 0.5),
  4.5 + (RANDOM() * 0.5),
  CASE (ROW_NUMBER() OVER (PARTITION BY l.id)) % 4
    WHEN 0 THEN 'Host was very attentive.'
    WHEN 1 THEN 'Nice place to stay!'
    WHEN 2 THEN 'Wonderful experience, highly recommend!'
    ELSE 'Well designed and fun space.'
  END
FROM listings l
CROSS JOIN generate_series(1, 2) -- 2 reviews per listing
ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Created tables: hosts, listings, listing_images, amenities, listing_amenities, reviews';
  RAISE NOTICE 'Inserted initial data for all listings.';
  RAISE NOTICE 'RLS policies configured for public read/write access.';
END $$;

