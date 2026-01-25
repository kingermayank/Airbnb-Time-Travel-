-- ============================================
-- ENHANCE LISTINGS WITH COMPREHENSIVE DATA
-- This script adds theme-appropriate amenities and detailed reviews
-- ============================================

-- Step 1: Ensure all new amenities exist in the database
INSERT INTO amenities (name, icon_url)
VALUES
  -- Historical amenities
  ('Historical preservation', NULL),
  ('Period-accurate furnishings', NULL),
  ('Cultural artifacts', NULL),
  ('Educational materials', NULL),
  ('Authentic Mughal architecture', NULL),
  ('Marble craftsmanship', NULL),
  ('Private courtyard', NULL),
  ('Guided tour access', NULL),
  ('1912 decor', NULL),
  ('First-class amenities', NULL),
  ('Period-accurate technology', NULL),
  ('Authentic experience', NULL),
  ('Hidden compartments', NULL),
  ('1940s decor', NULL),
  ('Covert entry system', NULL),
  ('Historical artifacts', NULL),
  ('Authentic safehouse experience', NULL),
  ('Hieroglyphic decorations', NULL),
  ('Nile River access', NULL),
  ('Ancient Egyptian artifacts', NULL),
  ('Courtyard gardens', NULL),
  ('Guided historical tours', NULL),
  ('Military camp atmosphere', NULL),
  ('Ancient Persian decor', NULL),
  ('Camp life experience', NULL),
  ('Authentic tent structure', NULL),
  -- Futuristic/Sci-Fi amenities
  ('Life support systems', NULL),
  ('Zero-gravity sleeping pods', NULL),
  -- Underwater/Fantasy amenities
  ('Underwater views', NULL),
  ('Crystal energy systems', NULL),
  ('Ancient Atlantean technology', NULL),
  ('360-degree ocean views', NULL),
  ('Pressure-controlled environment', NULL),
  ('Marine life observation', NULL),
  ('Crystal-powered lighting', NULL),
  ('Underwater access portal', NULL),
  -- Pandora amenities
  ('Bioluminescent views', NULL),
  ('Pandoran energy systems', NULL),
  ('Native flora access', NULL),
  ('Floating structure tech', NULL),
  ('Eco-friendly systems', NULL),
  ('Mountain views', NULL),
  ('Alien wildlife observation', NULL),
  ('Na''vi cultural artifacts', NULL),
  -- Retro amenities
  ('Retro technology', NULL),
  ('Vintage entertainment', NULL),
  ('Period-accurate decor', NULL),
  ('Pre-internet experience', NULL),
  ('1990s furnishings', NULL),
  ('Retro electronics', NULL),
  ('Vintage record player', NULL),
  ('Classic NYC atmosphere', NULL)
ON CONFLICT (name) DO NOTHING;

-- Step 2: Remove existing generic amenities links (keep only the 4 generic ones for now, we'll replace them)
-- Actually, we'll just add the new ones and keep existing - the ON CONFLICT will handle duplicates

-- Step 3: Link theme-appropriate amenities to each listing
-- Shah Jahan's Marble Suite in Agra
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  'bdf429ac-9274-44e1-9986-b43dcffe87e9'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Historical preservation', 'Period-accurate furnishings',
  'Cultural artifacts', 'Educational materials',
  'Authentic Mughal architecture', 'Marble craftsmanship',
  'Private courtyard', 'Guided tour access'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- SpaceX Mars Colony Pod at Olympus Mons
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  '10b2efa4-819b-4a10-99a0-1f5dc580b080'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Starlink Wi-Fi', 'Compact galley kitchen', 'Mars surface view',
  'Life support systems', 'Climate-controlled habitat',
  'Exploration rovers', 'Automated fabric recycler',
  'Thermal drying unit', 'External perimeter monitoring',
  'Cold-storage unit', 'Companion-friendly', 'Zero-gravity sleeping pods'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- The Lost Atlantean Crystal Villa
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  'cf84c7ff-aea0-49f3-ad12-3bc09a52326b'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Underwater views', 'Crystal energy systems',
  'Ancient Atlantean technology', '360-degree ocean views',
  'Pressure-controlled environment', 'Marine life observation',
  'Crystal-powered lighting', 'Underwater access portal'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- First-Class Suite in Titanic April 1912
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  '0580d737-156f-49ea-abcb-621797f493cf'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Historical preservation', 'Period-accurate furnishings',
  '1912 decor', 'Ocean views', 'First-class amenities',
  'Period-accurate technology', 'Cultural artifacts', 'Authentic experience'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- WWII German Resistance Safehouse Loft
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Historical preservation', 'Period-accurate furnishings',
  'Hidden compartments', '1940s decor', 'Covert entry system',
  'Historical artifacts', 'Educational materials', 'Authentic safehouse experience'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- Pandora Floating Mountain Bungalow
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  '41f8401a-e8a8-42fa-9809-10604c91d274'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Bioluminescent views', 'Pandoran energy systems',
  'Native flora access', 'Floating structure tech',
  'Eco-friendly systems', 'Mountain views',
  'Alien wildlife observation', 'Na''vi cultural artifacts'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- Ancient Egyptian Nile Villa (Old Kingdom)
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  '32bb68c5-f89a-4a83-a8f3-90b712482575'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Historical preservation', 'Period-accurate furnishings',
  'Nile River access', 'Ancient Egyptian artifacts',
  'Hieroglyphic decorations', 'Courtyard gardens',
  'Cultural immersion', 'Guided historical tours'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- Alexander the Great's Campaign Tent
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  '385e8c54-9458-4fc4-8482-4b2efe7efc2b'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Historical preservation', 'Period-accurate furnishings',
  'Military camp atmosphere', 'Ancient Persian decor',
  'Camp life experience', 'Historical artifacts',
  'Authentic tent structure', 'Educational materials'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- 1990s Manhattan Loft in Pre-Internet NYC
INSERT INTO listing_amenities (listing_id, amenity_id)
SELECT 
  'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93'::uuid,
  a.id
FROM amenities a
WHERE a.name IN (
  'Wi-Fi', 'Kitchen', 'Air conditioning', 'Heating',
  'Retro technology', 'Vintage entertainment',
  'Period-accurate decor', 'Pre-internet experience',
  '1990s furnishings', 'Retro electronics',
  'Vintage record player', 'Classic NYC atmosphere'
)
ON CONFLICT (listing_id, amenity_id) DO NOTHING;

-- Step 4: Delete existing generic reviews (we'll replace them with detailed ones)
DELETE FROM reviews WHERE listing_id IN (
  'bdf429ac-9274-44e1-9986-b43dcffe87e9',
  '10b2efa4-819b-4a10-99a0-1f5dc580b080',
  'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
  '0580d737-156f-49ea-abcb-621797f493cf',
  '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
  '41f8401a-e8a8-42fa-9809-10604c91d274',
  '32bb68c5-f89a-4a83-a8f3-90b712482575',
  '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
  'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93'
);

-- Step 5: Insert detailed reviews for each listing

-- Shah Jahan's Marble Suite in Agra (6 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Priya Sharma', NULL, '2024-11-15', 4.9, 5.0, 5.0, 4.8, 5.0, 5.0, 4.7, 'Absolutely breathtaking! The marble craftsmanship is exquisite and the historical authenticity is remarkable. The private courtyard was perfect for morning tea. The guided tour provided incredible insights into Mughal architecture. This is truly a once-in-a-lifetime experience.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'James Mitchell', NULL, '2024-10-22', 4.8, 4.9, 4.8, 4.7, 4.9, 5.0, 4.6, 'Stunning suite with incredible attention to detail. The period-accurate furnishings and cultural artifacts made us feel like we stepped back in time. The location near the Taj Mahal is perfect. The host was very knowledgeable about the history.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Aisha Khan', NULL, '2024-09-30', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 4.9, 'Pure luxury and historical immersion! Every corner of this suite tells a story. The marble work is museum-quality, and the educational materials helped us appreciate the Mughal era even more. Highly recommend for history enthusiasts.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Robert Chen', NULL, '2024-08-18', 4.7, 4.8, 4.7, 4.6, 4.8, 4.9, 4.5, 'Beautiful suite with authentic Mughal architecture. The preservation work is impressive, and the cultural artifacts add to the experience. The kitchen had modern amenities while maintaining the historical aesthetic. Great value for such a unique stay.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Sofia Martinez', NULL, '2024-07-05', 4.9, 5.0, 4.9, 4.8, 5.0, 5.0, 4.8, 'An extraordinary experience! The marble suite exceeded all expectations. The attention to historical detail is remarkable, from the furnishings to the architectural elements. The guided tour was informative and the host was incredibly responsive.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'David Thompson', NULL, '2024-06-12', 4.8, 4.9, 4.8, 4.7, 4.9, 4.8, 4.7, 'Incredible historical authenticity combined with modern comfort. The period-accurate furnishings and cultural artifacts create an immersive experience. The location is perfect for exploring Agra''s historical sites. Highly recommend!');

-- SpaceX Mars Colony Pod at Olympus Mons (7 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Dr. Sarah Chen', NULL, '2024-11-20', 4.9, 5.0, 5.0, 4.9, 5.0, 5.0, 4.8, 'As a planetary scientist, I was blown away by the technical accuracy of this habitat. The life support systems are state-of-the-art, and the Mars surface views from the observation dome are absolutely stunning. The exploration rovers are a fantastic addition. This is the future of space tourism!'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Marcus Rodriguez', NULL, '2024-10-28', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.6, 'Incredible experience! The Starlink Wi-Fi worked perfectly, and the climate-controlled habitat made the stay comfortable despite Mars'' harsh environment. The automated fabric recycler and thermal drying unit are brilliant innovations. The zero-gravity sleeping pods are a unique touch.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Dr. Emily Watson', NULL, '2024-09-15', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 4.9, 'Absolutely phenomenal! The life support systems are flawless, and the external perimeter monitoring gives great peace of mind. The cold-storage unit kept our supplies fresh, and the companion-friendly setup was perfect for our research team. This is space exploration at its finest.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Alex Kim', NULL, '2024-08-22', 4.7, 4.8, 4.7, 4.6, 4.9, 4.8, 4.5, 'Amazing futuristic experience! The Mars surface views are breathtaking, especially during sunrise. The compact galley kitchen has everything needed, and the exploration rovers made our excursions unforgettable. The habitat feels safe and well-maintained.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Dr. Michael Park', NULL, '2024-07-10', 4.9, 5.0, 4.9, 4.8, 5.0, 5.0, 4.8, 'Outstanding habitat design! The climate control is perfect, and the life support systems are incredibly reliable. The automated systems make daily life easy, and the views of Olympus Mons are spectacular. This is exactly what I imagined living on Mars would be like.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Jessica Liu', NULL, '2024-06-25', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Incredible stay on the Red Planet! The habitat is well-designed with all the modern amenities you''d expect, plus some amazing space-specific features. The thermal drying unit and fabric recycler are game-changers. The host (Elon) was very responsive to questions.'),
  ('10b2efa4-819b-4a10-99a0-1f5dc580b080', 'Dr. Raj Patel', NULL, '2024-05-18', 4.9, 5.0, 5.0, 4.9, 5.0, 5.0, 4.8, 'As an aerospace engineer, I''m impressed by the technical excellence of this habitat. The life support systems are top-notch, and the external monitoring provides excellent security. The exploration rovers are well-maintained and fun to operate. A truly unique experience!');

-- The Lost Atlantean Crystal Villa (6 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Marina Delphinus', NULL, '2024-11-10', 4.9, 5.0, 5.0, 4.8, 5.0, 5.0, 4.8, 'Absolutely magical! The crystal energy systems create the most beautiful ambient lighting, and the 360-degree ocean views are mesmerizing. The pressure-controlled environment is perfectly maintained. Watching marine life through the crystal walls is an unforgettable experience.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Oceanus Triton', NULL, '2024-10-05', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Incredible underwater villa! The ancient Atlantean technology is fascinating, and the crystal-powered lighting creates an ethereal atmosphere. The underwater access portal made exploring the ocean depths easy and safe. This is truly a unique experience.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Coral Reef', NULL, '2024-09-18', 5.0, 5.0, 5.0, 4.9, 5.0, 5.0, 4.9, 'A dream come true! The crystal villa is stunning, and the marine life observation opportunities are incredible. The pressure control is flawless, and the ancient technology adds to the mystique. The underwater views are absolutely breathtaking, especially at night when the bioluminescent creatures pass by.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Neptune Wave', NULL, '2024-08-12', 4.7, 4.8, 4.7, 4.6, 5.0, 4.8, 4.6, 'Amazing underwater experience! The crystal energy systems work perfectly, and the 360-degree views are stunning. The marine life observation is a highlight - we saw so many fascinating creatures. The villa combines ancient mystique with modern comfort beautifully.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Aqua Blue', NULL, '2024-07-22', 4.9, 5.0, 4.9, 4.8, 5.0, 5.0, 4.8, 'Incredible stay in Atlantis! The crystal villa is beautifully designed, and the underwater access portal is a fantastic feature. The pressure-controlled environment is perfectly maintained, and the crystal-powered lighting creates a magical atmosphere. Highly recommend!'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Deep Sea Explorer', NULL, '2024-06-08', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Fascinating underwater villa! The ancient Atlantean technology is impressive, and the crystal energy systems provide beautiful ambient lighting. The marine life observation is incredible - we saw species we''ve never encountered before. A truly unique and memorable experience.');

-- First-Class Suite in Titanic April 1912 (6 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Margaret Astor', NULL, '2024-11-08', 4.9, 5.0, 5.0, 4.8, 5.0, 5.0, 4.8, 'Exquisite first-class accommodations! The 1912 decor is meticulously recreated, and the period-accurate furnishings transport you back in time. The ocean views are stunning, and the cultural artifacts add authenticity. This is exactly how I imagined first-class travel on the Titanic would be.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'William Vanderbilt', NULL, '2024-10-15', 4.8, 4.9, 4.8, 4.7, 4.9, 4.9, 4.7, 'Remarkable historical accuracy! The suite captures the elegance of the era perfectly. The period-accurate technology and furnishings create an immersive experience. The ocean views are breathtaking, and the first-class amenities are exactly as described. A truly unique stay.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Eleanor Straus', NULL, '2024-09-22', 5.0, 5.0, 5.0, 4.9, 5.0, 5.0, 4.9, 'Absolutely magnificent! The historical preservation is outstanding, and every detail reflects the opulence of 1912 first-class travel. The cultural artifacts and period-accurate decor create an authentic experience. The ocean views are spectacular, especially at sunset.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'John Thayer', NULL, '2024-08-30', 4.7, 4.8, 4.7, 4.6, 4.8, 4.8, 4.6, 'Beautiful suite with incredible attention to historical detail. The 1912 furnishings and technology are fascinating, and the ocean views are stunning. The authentic experience is enhanced by the cultural artifacts. A wonderful journey back in time.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Madeleine Astor', NULL, '2024-07-14', 4.9, 5.0, 4.9, 4.8, 5.0, 5.0, 4.8, 'Elegant and historically accurate! The suite perfectly captures the grandeur of Titanic''s first-class accommodations. The period-accurate decor and cultural artifacts create an immersive experience. The ocean views are magnificent, and the host was very knowledgeable about the ship''s history.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Benjamin Guggenheim', NULL, '2024-06-20', 4.8, 4.9, 4.8, 4.7, 4.9, 4.9, 4.7, 'Incredible historical recreation! The suite is beautifully furnished with period-accurate items, and the 1912 technology is fascinating to experience. The ocean views are spectacular, and the cultural artifacts add authenticity. A truly unique and memorable stay.');

-- WWII German Resistance Safehouse Loft (5 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Sophie Scholl', NULL, '2024-11-12', 4.8, 4.9, 5.0, 4.7, 4.8, 4.9, 4.7, 'Powerful and moving experience. The historical preservation is remarkable, and the hidden compartments are fascinating to discover. The 1940s decor and period-accurate furnishings create an authentic atmosphere. The educational materials help you understand the significance of this place.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Hans von Dohnanyi', NULL, '2024-10-19', 4.7, 4.8, 4.9, 4.6, 4.7, 4.8, 4.6, 'Incredible historical significance. The safehouse is well-preserved with authentic 1940s furnishings and hidden compartments that tell a story. The covert entry system adds to the experience. The historical artifacts and educational materials provide important context.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Claus von Stauffenberg', NULL, '2024-09-25', 4.9, 4.9, 5.0, 4.8, 4.8, 5.0, 4.8, 'A deeply meaningful stay. The loft preserves the courage and sacrifice of the resistance movement. The hidden compartments and period-accurate decor create an authentic experience. The historical artifacts are carefully curated, and the educational materials are invaluable.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Maria von Maltzan', NULL, '2024-08-16', 4.8, 4.8, 4.9, 4.7, 4.8, 4.9, 4.7, 'Remarkable preservation of history. The safehouse maintains its authentic character with 1940s furnishings and hidden features. The covert entry system is fascinating, and the historical artifacts tell important stories. A moving and educational experience.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Helmuth von Moltke', NULL, '2024-07-28', 4.7, 4.8, 4.8, 4.6, 4.7, 4.8, 4.6, 'Powerful historical experience. The loft is authentically preserved with period-accurate decor and hidden compartments. The educational materials help you understand the resistance movement''s significance. The historical artifacts are carefully maintained and tell important stories.');

-- Pandora Floating Mountain Bungalow (7 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Jake Sully', NULL, '2024-11-18', 5.0, 5.0, 5.0, 4.9, 5.0, 5.0, 4.9, 'Absolutely incredible! The bioluminescent views at night are beyond words - watching the native Pandoran life light up the sky is magical. The floating structure technology is fascinating, and the eco-friendly systems work perfectly. The Na''vi cultural artifacts add authenticity. This is paradise!'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Neytiri te Tskaha', NULL, '2024-10-25', 4.9, 5.0, 5.0, 4.8, 5.0, 5.0, 4.8, 'Beautiful connection with Pandora! The native flora access allows you to experience the planet''s unique ecosystem up close. The floating structure provides stunning mountain views, and the Pandoran energy systems are impressive. The alien wildlife observation is incredible.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Dr. Grace Augustine', NULL, '2024-09-12', 4.9, 5.0, 5.0, 4.9, 5.0, 5.0, 4.8, 'As a xenobiologist, I''m amazed by the access to Pandora''s native flora and wildlife. The bungalow''s eco-friendly systems are perfectly integrated with the environment. The bioluminescent displays are spectacular, and the floating structure technology is remarkable. A researcher''s dream!'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Norm Spellman', NULL, '2024-08-20', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Incredible experience on Pandora! The floating mountain bungalow offers breathtaking views, and the bioluminescent displays at night are mesmerizing. The Pandoran energy systems are fascinating, and the native flora access is a unique feature. The Na''vi artifacts add cultural depth.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Trudy Chacón', NULL, '2024-07-05', 4.9, 5.0, 4.9, 4.8, 5.0, 5.0, 4.8, 'Absolutely stunning! The floating structure provides incredible views of Pandora''s landscape. The bioluminescent views are the highlight - watching the native life light up at night is unforgettable. The eco-friendly systems work perfectly, and the mountain views are spectacular.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Dr. Max Patel', NULL, '2024-06-15', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Fascinating stay on Pandora! The floating mountain bungalow is beautifully designed, and the Pandoran energy systems are impressive. The native flora access and alien wildlife observation opportunities are incredible. The bioluminescent displays are truly magical. Highly recommend!'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Tsu''tey', NULL, '2024-05-22', 4.9, 5.0, 5.0, 4.8, 5.0, 5.0, 4.8, 'Beautiful connection with Eywa! The bungalow respects Pandora''s ecosystem with its eco-friendly systems. The floating structure provides amazing views, and the Na''vi cultural artifacts honor our traditions. The bioluminescent displays are breathtaking. A true Pandoran experience!');

-- Ancient Egyptian Nile Villa (Old Kingdom) (6 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Cleopatra VII', NULL, '2024-11-14', 4.9, 5.0, 5.0, 4.8, 5.0, 5.0, 4.8, 'Magnificent villa with authentic Old Kingdom architecture! The hieroglyphic decorations are beautifully preserved, and the Nile River access is perfect for morning boat rides. The courtyard gardens are peaceful, and the ancient Egyptian artifacts are fascinating. The guided historical tours are informative.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Ramesses II', NULL, '2024-10-21', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Incredible historical immersion! The villa''s period-accurate furnishings and hieroglyphic decorations create an authentic Old Kingdom atmosphere. The Nile River access is wonderful, and the cultural artifacts are well-curated. The guided tours provide excellent historical context.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Hatshepsut', NULL, '2024-09-28', 5.0, 5.0, 5.0, 4.9, 5.0, 5.0, 4.9, 'Exquisite villa with remarkable historical preservation! The Old Kingdom architecture is authentic, and the hieroglyphic decorations are stunning. The Nile views are breathtaking, especially at sunrise. The courtyard gardens are peaceful, and the cultural immersion experience is unparalleled.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Tutankhamun', NULL, '2024-08-14', 4.7, 4.8, 4.7, 4.6, 4.9, 4.8, 4.6, 'Beautiful villa with authentic Egyptian character! The period-accurate furnishings and hieroglyphic decorations create an immersive experience. The Nile River access is fantastic, and the ancient artifacts are fascinating. The guided tours help you appreciate the historical significance.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Nefertiti', NULL, '2024-07-30', 4.9, 5.0, 4.9, 4.8, 5.0, 5.0, 4.8, 'Stunning villa with incredible attention to historical detail! The Old Kingdom architecture and hieroglyphic decorations are beautifully preserved. The Nile views are spectacular, and the courtyard gardens provide a peaceful retreat. The cultural artifacts and guided tours enhance the experience.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Imhotep', NULL, '2024-06-18', 4.8, 4.9, 4.8, 4.7, 5.0, 4.9, 4.7, 'Remarkable historical authenticity! The villa captures the essence of Old Kingdom Egypt perfectly. The hieroglyphic decorations and period-accurate furnishings create an immersive experience. The Nile River access and courtyard gardens are highlights. The guided historical tours are excellent.');

-- Alexander the Great's Campaign Tent (5 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Hephaestion', NULL, '2024-11-16', 4.8, 4.9, 5.0, 4.7, 4.8, 4.9, 4.7, 'Authentic military camp experience! The tent structure is impressive, and the period-accurate furnishings transport you to Alexander''s campaigns. The military camp atmosphere is well-captured, and the ancient Persian decor adds authenticity. The historical artifacts are fascinating.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Ptolemy I', NULL, '2024-10-23', 4.7, 4.8, 4.9, 4.6, 4.7, 4.8, 4.6, 'Incredible historical recreation! The campaign tent is authentically designed with period-accurate furnishings and ancient Persian decor. The military camp atmosphere is immersive, and the historical artifacts provide context. The educational materials help you understand the era.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Craterus', NULL, '2024-09-30', 4.9, 4.9, 5.0, 4.8, 4.8, 5.0, 4.8, 'Remarkable authenticity! The tent captures the essence of Alexander''s military campaigns perfectly. The period-accurate furnishings and ancient Persian decor create an immersive experience. The camp life atmosphere is well-maintained, and the historical artifacts are carefully curated.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Seleucus I', NULL, '2024-08-18', 4.8, 4.8, 4.9, 4.7, 4.8, 4.9, 4.7, 'Fascinating historical experience! The campaign tent is beautifully designed with authentic 4th century BCE military furnishings. The ancient Persian decor and military camp atmosphere create an immersive experience. The historical artifacts and educational materials are excellent.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Perdiccas', NULL, '2024-07-12', 4.7, 4.8, 4.8, 4.6, 4.7, 4.8, 4.6, 'Authentic military camp experience! The tent structure is impressive, and the period-accurate furnishings are fascinating. The ancient Persian decor adds authenticity, and the camp life atmosphere is well-captured. The historical artifacts provide valuable context.');

-- 1990s Manhattan Loft in Pre-Internet NYC (6 reviews)
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Sarah Chen', NULL, '2024-11-22', 4.8, 4.9, 4.8, 4.7, 4.9, 4.9, 4.7, 'Nostalgic trip back to the 90s! The retro technology and vintage entertainment are fantastic - the record player still works perfectly. The period-accurate decor captures that pre-internet NYC vibe beautifully. The vintage electronics are a fun touch, and the classic Manhattan atmosphere is spot-on.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Mike Johnson', NULL, '2024-10-30', 4.7, 4.8, 4.7, 4.6, 4.8, 4.8, 4.6, 'Great retro experience! The 1990s furnishings and technology are authentic, and the pre-internet experience is refreshing. The vintage entertainment options are fun, and the period-accurate decor creates a genuine 90s NYC atmosphere. The location is perfect for exploring Manhattan.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Jennifer Martinez', NULL, '2024-09-20', 4.9, 5.0, 4.9, 4.8, 4.9, 5.0, 4.8, 'Absolutely loved the 90s vibe! The retro technology is fascinating to experience, and the vintage record player is a highlight. The period-accurate decor and 1990s furnishings create an authentic pre-internet NYC experience. The classic Manhattan atmosphere is perfect.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'David Kim', NULL, '2024-08-26', 4.8, 4.9, 4.8, 4.7, 4.9, 4.9, 4.7, 'Nostalgic and fun! The retro technology and vintage entertainment take you back to a simpler time. The period-accurate decor is well-maintained, and the pre-internet experience is refreshing. The 1990s furnishings and classic NYC atmosphere make this a unique stay.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Lisa Thompson', NULL, '2024-07-18', 4.7, 4.8, 4.7, 4.6, 4.8, 4.8, 4.6, 'Great retro loft! The 1990s decor and technology are authentic, and the vintage entertainment options are entertaining. The period-accurate furnishings create a genuine pre-internet NYC experience. The location in Manhattan is perfect for exploring the city.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Robert Williams', NULL, '2024-06-28', 4.9, 5.0, 4.9, 4.8, 4.9, 5.0, 4.8, 'Amazing 90s experience! The retro technology and vintage record player are highlights. The period-accurate decor and 1990s furnishings create an authentic pre-internet atmosphere. The classic Manhattan location is perfect, and the vintage electronics add to the charm.');

-- ============================================
-- COMPLETION MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'Enhancement completed successfully!';
  RAISE NOTICE 'Added theme-appropriate amenities to all listings';
  RAISE NOTICE 'Inserted detailed, themed reviews for all listings';
END $$;

