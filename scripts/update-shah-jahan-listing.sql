-- Update Shah Jahan's Marble Suite listing with comprehensive details
-- Listing ID: bdf429ac-9274-44e1-9986-b43dcffe87e9
-- Host ID: 8acf9b13-6ade-49cb-9083-fbe483293d12

-- Step 1: Update Host Information (Shah Jahan)
UPDATE hosts
SET
  name = 'Shah Jahan',
  description = 'Emperor · 20 years hosting',
  join_date = '1628-01-01',
  response_rate = 100,
  response_time = 'Within the same court session',
  is_superhost = true,
  is_identity_verified = true,
  total_reviews = 12,
  updated_at = NOW()
WHERE id = '8acf9b13-6ade-49cb-9083-fbe483293d12';

-- Step 2: Update Listing Details
UPDATE listings
SET
  title = 'Entire royal suite hosted by Shah Jahan',
  guest_capacity = 2,
  bedrooms = 1,
  beds = 1,
  baths = 1,
  overall_rating = 5.0,
  total_reviews = 12,
  is_guest_favorite = true,
  short_description = 'A private, hand-carved marble residence within the Mughal imperial complex. Designed for royalty, poets, and honored guests, this suite offers unparalleled craftsmanship, serenity, and views of the Yamuna River.',
  full_description = 'Commissioned during the golden age of the Mughal Empire, Shah Jahan''s Marble Suite is a masterwork of symmetry, proportion, and devotion. Crafted from Makrana marble and adorned with pietra dura inlays of semi-precious stones, the suite reflects the emperor''s pursuit of eternal beauty.

Wake to the call of birds echoing across the gardens, watch the marble glow at sunrise, and experience life as it was lived by emperors, scholars, and courtiers at the height of Indo-Islamic architecture.',
  key_features = '[
    {
      "title": "Imperial Privacy Protocols",
      "description": "Discreet guards ensure uninterrupted solitude and security."
    },
    {
      "title": "Daily Marble Cooling Rituals",
      "description": "Floors cooled with water and shaded courtyards for comfort in the Agra heat."
    },
    {
      "title": "Royal Entry",
      "description": "Private procession entrance through the palace gardens."
    }
  ]'::jsonb,
  sleeping_arrangements = '[
    {
      "room": "Royal Bedchamber",
      "beds": "1 hand-crafted royal bed with silk cushions and embroidered canopies"
    }
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

-- Step 3: Ensure all new amenities exist
INSERT INTO amenities (name, icon_url)
VALUES
  ('Yamuna River views', NULL),
  ('Taj Mahal garden access', NULL),
  ('Hand-carved marble interiors', NULL),
  ('Natural cooling architecture', NULL),
  ('Royal hammam (steam bath)', NULL),
  ('Incense and oil aromatics', NULL),
  ('Persian carpet flooring', NULL),
  ('Companion-friendly (royal attendants available)', NULL),
  ('Calligraphy-adorned walls', NULL),
  ('Nighttime candle illumination', NULL),
  ('Private courtyard access', NULL),
  ('Security by imperial guards', NULL),
  ('Imperial Privacy Protocols', NULL),
  ('Daily Marble Cooling Rituals', NULL),
  ('Royal Entry', NULL),
  ('Makrana marble', NULL),
  ('Pietra dura inlays', NULL),
  ('Silk cushions', NULL),
  ('Embroidered canopies', NULL),
  ('Palace gardens', NULL),
  ('Mughal imperial complex', NULL),
  ('Indo-Islamic architecture', NULL),
  ('Semi-precious stone inlays', NULL),
  ('Garden views', NULL),
  ('Bird watching', NULL),
  ('Sunrise views', NULL),
  ('Historical artifacts', NULL),
  ('Cultural immersion', NULL),
  ('Royal experience', NULL)
ON CONFLICT (name) DO NOTHING;

-- Step 4: Remove existing amenity links for this listing
DELETE FROM listing_amenities
WHERE listing_id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

-- Step 5: Link new amenities to the listing
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT
  'bdf429ac-9274-44e1-9986-b43dcffe87e9'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi',
  'Kitchen',
  'Air conditioning',
  'Heating',
  'Yamuna River views',
  'Taj Mahal garden access',
  'Hand-carved marble interiors',
  'Natural cooling architecture',
  'Royal hammam (steam bath)',
  'Incense and oil aromatics',
  'Persian carpet flooring',
  'Companion-friendly (royal attendants available)',
  'Calligraphy-adorned walls',
  'Nighttime candle illumination',
  'Private courtyard access',
  'Security by imperial guards',
  'Imperial Privacy Protocols',
  'Daily Marble Cooling Rituals',
  'Royal Entry',
  'Makrana marble',
  'Pietra dura inlays',
  'Silk cushions',
  'Embroidered canopies',
  'Palace gardens',
  'Mughal imperial complex',
  'Indo-Islamic architecture',
  'Semi-precious stone inlays',
  'Garden views',
  'Bird watching',
  'Sunrise views',
  'Historical artifacts',
  'Cultural immersion',
  'Royal experience'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- Step 6: Delete existing reviews for this listing
DELETE FROM reviews
WHERE listing_id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

-- Step 7: Insert new reviews
INSERT INTO reviews (
  listing_id,
  reviewer_name,
  reviewer_avatar_url,
  review_date,
  rating_overall,
  rating_cleanliness,
  rating_accuracy,
  rating_communication,
  rating_location,
  rating_checkin,
  rating_value,
  comment
)
VALUES
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Aamir',
    NULL,
    '1633-06-15',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'An experience beyond words. The marble glows like moonlight.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Fatima',
    NULL,
    '1634-08-22',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'Quiet, dignified, and deeply peaceful. The gardens alone are worth the journey.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Rahim',
    NULL,
    '1635-03-10',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'Architecture at its finest. Attendants were attentive without being intrusive.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Zara',
    NULL,
    '1632-11-05',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    4.8,
    'The royal hammam is a treasure. The entire suite reflects the emperor''s devotion to beauty and perfection.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Khalid',
    NULL,
    '1633-09-18',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'Waking to the call of birds and watching the marble glow at sunrise is an experience I will never forget.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Meera',
    NULL,
    '1634-12-01',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    4.9,
    'The calligraphy on the walls and the Persian carpets create an atmosphere of true imperial elegance.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Arjun',
    NULL,
    '1635-01-20',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'The private courtyard and garden access make this a truly special place. The security protocols ensure complete privacy.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Sana',
    NULL,
    '1633-04-12',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    4.9,
    'The incense and oil aromatics create a serene environment. The natural cooling architecture works perfectly even in the Agra heat.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Hassan',
    NULL,
    '1634-07-08',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'The hand-carved marble interiors are a testament to the finest craftsmanship of the Mughal era. Every detail is perfect.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Layla',
    NULL,
    '1635-05-25',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    4.8,
    'The nighttime candle illumination creates a magical atmosphere. The royal attendants are available but never intrusive.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Omar',
    NULL,
    '1632-10-14',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'The views of the Yamuna River and access to the Taj Mahal gardens make this an unparalleled experience. Truly fit for royalty.'
  ),
  (
    'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    'Noor',
    NULL,
    '1634-02-28',
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    5.0,
    'The Makrana marble and pietra dura inlays are breathtaking. This suite embodies the golden age of the Mughal Empire.'
  );

-- Step 8: Verify the update
SELECT 
  l.title,
  l.guest_capacity,
  l.bedrooms,
  l.beds,
  l.baths,
  l.overall_rating,
  l.total_reviews,
  h.name as host_name,
  h.description as host_description,
  h.join_date,
  h.response_rate,
  h.response_time,
  h.is_superhost,
  h.is_identity_verified,
  h.total_reviews as host_total_reviews,
  (SELECT COUNT(*) FROM listing_amenities WHERE listing_id = l.id) as amenity_count,
  (SELECT COUNT(*) FROM reviews WHERE listing_id = l.id) as review_count
FROM listings l
LEFT JOIN hosts h ON l.host_id = h.id
WHERE l.id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

