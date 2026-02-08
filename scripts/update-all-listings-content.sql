-- ============================================================================
-- UPDATE ALL LISTINGS WITH APPROPRIATE HOSTS AND REVIEWERS
-- Designed with historically/thematically appropriate figures and comical reviews
-- ============================================================================

-- ============================================================================
-- 1. SHAH JAHAN'S MARBLE SUITE IN AGRA (Mughal Empire, 1648 CE)
-- ============================================================================
-- Listing ID: bdf429ac-9274-44e1-9986-b43dcffe87e9
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2446 (will create)

-- Create/Update Host: Shah Jahan
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2446',
  'Emperor Shah Jahan',
  NULL,
  '2024-01-01',
  100,
  'within a day',
  true,
  true,
  18,
  'Fifth Mughal Emperor and architecture enthusiast. I built the Taj Mahal for my beloved wife Mumtaz, and honestly, the property values around here have never been better. When I am not commissioning world wonders or managing an empire spanning millions, I enjoy calligraphy, poetry, and reviewing guest feedback. My hosting philosophy: if it is not inlaid with precious stones, it is not finished.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2446' WHERE id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

-- Insert reviews for Shah Jahan's Suite
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Marco Polo', NULL, '2024-12-20', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'I have traveled from Venice to China and back. I have seen palaces, temples, and wonders beyond description. But this marble suite? The inlay work alone took my breath away. I tried to describe it in my journal but gave up after three pages. Some things you just have to experience. The morning chai service was exceptional, and the view of the Taj Mahal construction site is genuinely moving. Worth every ducat.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Cleopatra VII', NULL, '2024-12-15', 4.8, 5.0, 4.5, 5.0, 5.0, 5.0, 4.5, 'As someone who knows a thing or two about opulent living, I was impressed. The pietra dura work rivals anything in Alexandria. My only note: the peacocks outside are beautiful but LOUD at dawn. Brought my own asp for security. The host was gracious and did not mention the incident with the fountain.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Indiana Jones', NULL, '2024-12-10', 4.9, 4.5, 5.0, 4.5, 5.0, 4.5, 5.0, 'Came for research. Stayed for the architecture. Did NOT steal anything, despite what the guards are saying. The hidden compartments in the walls are fascinating from a purely academic perspective. The food was incredible, and I learned three new things about Mughal engineering that will definitely appear in my next lecture. Highly recommend the moonlit Taj viewing.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Queen Victoria', NULL, '2024-12-05', 4.7, 5.0, 4.5, 4.5, 5.0, 4.5, 4.5, 'We were amused. The suite is rather lovely, though we found the lack of proper English tea somewhat vexing. The marble work is exquisite - we have made notes for renovations at Buckingham. The host was most accommodating, though his ideas about British-Indian relations were... optimistic.'),
  ('bdf429ac-9274-44e1-9986-b43dcffe87e9', 'Aladdin', NULL, '2024-12-01', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'Way better than my lamp. 10/10.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';


-- ============================================================================
-- 2. THE LOST ATLANTEAN CRYSTAL VILLA (Atlantis, 9600 BCE)
-- ============================================================================
-- Listing ID: cf84c7ff-aea0-49f3-ad12-3bc09a52326b
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2447 (will create)

-- Create/Update Host: Poseidon
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2447',
  'Lord Poseidon',
  NULL,
  '2024-01-01',
  95,
  'within an hour',
  true,
  true,
  12,
  'God of the Sea, Earthquakes, and Horses. Founder of Atlantis back when the continent was still above water (long story, do not ask my brother about it). I have been hosting visitors to my underwater realm for millennia. My crystal villas are powered by ancient technology that your scientists still cannot explain, which brings me great satisfaction. Fair warning: I take reviews personally. Very personally.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2447' WHERE id = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';

-- Insert reviews for Atlantean Villa
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Aquaman', NULL, '2024-12-20', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'Finally, a listing that understands underwater living. The crystal tech here puts Atlantis Prime to shame, and I live there. Spent three days just talking to the local fish population - the gossip down here is WILD. The bioluminescent bathroom alone is worth the trip. Poseidon was a gracious host, though he kept making passive-aggressive comments about my movie.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Jacques Cousteau', NULL, '2024-12-15', 5.0, 5.0, 5.0, 4.5, 5.0, 5.0, 5.0, 'I have explored every ocean on Earth, but nothing prepared me for this. The marine life is extraordinary - species I have never documented, behaving in ways that defy conventional biology. I filled seventeen notebooks. The crystal energy system deserves its own documentary. Only minor issue: my camera kept malfunctioning near the power core. Mysterious.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Ariel', NULL, '2024-12-10', 4.8, 5.0, 4.5, 5.0, 5.0, 5.0, 4.5, 'It is like my grotto but BETTER. So many human things! The crystal screens show moving pictures and everything. Daddy was NOT happy I stayed here but honestly the accommodations are superior. The coral garden is beautiful and I may have accidentally adopted a flounder. Bringing him home. Do not tell Sebastian.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'Captain Nemo', NULL, '2024-12-05', 4.9, 4.5, 5.0, 4.5, 5.0, 4.5, 5.0, 'The Nautilus has taken me to wonders beyond imagination, but this villa exceeds even my highest expectations. The engineering is centuries ahead of its time - I have taken extensive notes. The water tunnel to the coral garden is a masterpiece of pressure management. The host and I had productive discussions about renewable energy and the failings of surface civilization.'),
  ('cf84c7ff-aea0-49f3-ad12-3bc09a52326b', 'SpongeBob SquarePants', NULL, '2024-12-01', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'I am ready! I am ready! Best vacation ever! The crystal walls are so shiny and the jellyfish outside are amazing! Patrick got lost in the water tunnel for six hours but he said it was the best six hours of his life. The kitchen is way fancier than the Krusty Krab. Do not tell Mr. Krabs.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';


-- ============================================================================
-- 3. FIRST-CLASS SUITE IN TITANIC (April 1912)
-- ============================================================================
-- Listing ID: 0580d737-156f-49ea-abcb-621797f493cf
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2448 (will create)

-- Create/Update Host: Captain Edward Smith
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2448',
  'Captain Edward Smith',
  NULL,
  '2024-01-01',
  98,
  'within an hour',
  true,
  true,
  15,
  'Commodore of the White Star Line with over 40 years of maritime experience. This was supposed to be my final voyage before retirement, and I have to say, it is going splendidly. The Titanic is the finest ship ever built - absolutely unsinkable, as the engineers keep assuring me. I pride myself on providing guests with a smooth, uneventful crossing. Nothing could possibly go wrong. Weather looks clear ahead.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2448' WHERE id = '0580d737-156f-49ea-abcb-621797f493cf';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = '0580d737-156f-49ea-abcb-621797f493cf';

-- Insert reviews for Titanic Suite
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Jack Dawson', NULL, '2024-12-20', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'Okay so I technically won my ticket in a poker game and was in steerage, but I snuck up to see the first-class suites and WOW. The carved oak, the chandeliers, the private promenade - it is like nothing I have ever seen. Met an amazing girl up there too. Best four days of my life. The ending was a bit rough but I would definitely book again. King of the world vibes.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Rose DeWitt Bukater', NULL, '2024-12-15', 4.9, 5.0, 5.0, 4.5, 5.0, 5.0, 4.5, 'The accommodations were exquisite, if somewhat stifling with all the societal expectations. The grand staircase is truly magnificent. I learned to spit properly off the bow, danced in steerage, and had my portrait drawn. Life-changing experience. Lost a priceless diamond necklace overboard but honestly, worth it. My heart will go on. And on.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Molly Brown', NULL, '2024-12-10', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'They call me unsinkable, and so is this ship! The first-class dining is absolutely divine - twelve courses! The suite has everything a Colorado mining heiress could want. Made some snooty aristocrats uncomfortable by being loud and nouveau riche. Their problem, not mine. Captain Smith runs a tight ship. What could go wrong?'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Benjamin Guggenheim', NULL, '2024-12-05', 4.8, 5.0, 4.5, 5.0, 5.0, 4.5, 5.0, 'As a man accustomed to the finest things, I can confirm this suite meets every expectation. The mahogany paneling, the electric lights, the en-suite bathroom - civilization at its peak. I have dressed in my finest evening wear for dinner every night. If anything were to happen, I am prepared to go down as a gentleman. But nothing will happen. Obviously.'),
  ('0580d737-156f-49ea-abcb-621797f493cf', 'Leonardo DiCaprio', NULL, '2024-12-01', 4.7, 4.5, 5.0, 4.5, 5.0, 4.5, 4.5, 'Felt strangely familiar, like I had been here before. Great for method acting research. The door in our suite is definitely big enough for two people to float on, just saying. Beautiful ship, haunting in a way I cannot quite explain. The band was excellent.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = '0580d737-156f-49ea-abcb-621797f493cf';


-- ============================================================================
-- 4. WWII GERMAN RESISTANCE SAFEHOUSE LOFT (Berlin, 1943)
-- ============================================================================
-- Listing ID: 903e8b2c-dc8d-4d37-98f4-b98d1b250ae5
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2449 (will create)

-- Create/Update Host: Hans & Sophie Hoffmann (fictional composite resistance members)
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2449',
  'Hans & Sophie Hoffmann',
  NULL,
  '2024-01-01',
  92,
  'within a few hours',
  true,
  true,
  8,
  'University students by day, resistance members by night. We believe in a free Germany and have converted our family loft into a safehouse for those who share our vision. The location is discreet, the neighbors are trustworthy, and the hidden compartments have never failed an inspection. We cannot tell you more for your own safety. Check-in instructions will be delivered via dead drop. Knock three times, pause, then twice more.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2449' WHERE id = '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5';

-- Insert reviews for WWII Safehouse
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Oskar Schindler', NULL, '2024-12-20', 5.0, 4.5, 5.0, 5.0, 5.0, 5.0, 5.0, 'An essential listing for anyone committed to doing the right thing in difficult times. The hidden compartments are ingeniously designed - I took notes for my factory. The hosts are brave beyond measure. Stayed three nights while arranging paperwork. The 1940s radio picks up BBC World Service if you know the frequency. Discreet, dignified, necessary.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Anne Frank', NULL, '2024-12-15', 5.0, 5.0, 5.0, 5.0, 4.5, 5.0, 5.0, 'I know something about hiding, and this place is exceptional. Much more spacious than my previous accommodation. The bookshelf entrance is clever - wish we had thought of that. Spent my time writing in my diary and dreaming of better days. The hosts provided paper and hope, which are equally valuable.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Indiana Jones', NULL, '2024-12-10', 4.8, 4.5, 5.0, 4.5, 5.0, 4.5, 4.5, 'Needed a place to lay low after a disagreement with some people who shall remain nameless. The safehouse was perfect - unassuming exterior, secure interior, excellent sightlines. The covert entry system made me feel like a real spy. Found some interesting documents in the hidden wall safe. For academic purposes only, of course.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Captain America', NULL, '2024-12-05', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'Stopped by during a mission. The hosts represent everything good about humanity - courage, conviction, and really excellent homemade strudel. The loft reminded me why we fight. I could not stay long but I left inspired. These are the real heroes.'),
  ('903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', 'Inglourious Brad', NULL, '2024-12-01', 4.7, 4.0, 4.5, 4.5, 5.0, 4.5, 4.5, 'Bonjourno. Needed a place for my team to coordinate. The safehouse delivered. Hidden compartments fit our equipment perfectly. The period radio was useful for intercepting transmissions. Hosts did not ask questions, which I appreciated. Left them a nice tip and a carved wooden bear.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5';


-- ============================================================================
-- 5. PANDORA FLOATING MOUNTAIN BUNGALOW (Pandora, 2154 CE)
-- ============================================================================
-- Listing ID: 41f8401a-e8a8-42fa-9809-10604c91d274
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2450 (will create)

-- Create/Update Host: Neytiri
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2450',
  'Neytiri te Tskaha Mo''at''ite',
  NULL,
  '2024-01-01',
  97,
  'within an hour',
  true,
  true,
  22,
  'Daughter of the Omaticaya clan leaders and skilled hunter. I did not want to host sky people at first - you come here and do not See. But my mate Jake convinced me that some of you can learn. This bungalow floats among the Hallelujah Mountains where Eywa''s presence is strongest. I will teach you to See if you are willing, or at least not to fall off the mountain. The ikran are not included but we can negotiate. Oel ngati kameie - I See you.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2450' WHERE id = '41f8401a-e8a8-42fa-9809-10604c91d274';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = '41f8401a-e8a8-42fa-9809-10604c91d274';

-- Insert reviews for Pandora Bungalow
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Jake Sully', NULL, '2024-12-20', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'I mean, I live here now, but I can objectively say this is the most incredible place in the known universe. Waking up among floating mountains never gets old. The bioluminescence at night is beyond description. Neytiri is an amazing host - patient with newcomers, tough when needed. Just do not touch the horses. Or the dogs. Actually, do not touch anything until she says it is okay. Trust me on this.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Dr. Grace Augustine', NULL, '2024-12-15', 5.0, 5.0, 5.0, 4.5, 5.0, 5.0, 5.0, 'As a xenobotanist, I can confirm this location offers unprecedented access to Pandoran flora. The neural network connections between the trees are visible from the bungalow deck. Spent most nights taking samples and talking to Eywa. Not sure she answered but the forest definitely listens. The living architecture is scientifically fascinating. Cigarettes not recommended at this altitude.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Avatar Aang', NULL, '2024-12-10', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'As someone who rides a flying bison, I thought I was prepared for floating mountains. I was not. The spiritual energy here rivals the Spirit World. Spent hours in meditation connecting with Eywa - she has similar energy to Raava. The bioluminescent nights reminded me of the Northern Water Tribe. Neytiri and I had a great conversation about balance. Appa loved it here.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'David Attenborough', NULL, '2024-12-05', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'In all my years documenting life on Earth, nothing compares to what I witnessed on Pandora. The bioluminescent ecosystem, the neural connectivity of the flora, the majestic creatures soaring between floating mountains - I wept openly on several occasions. I have narrated many wonders, but I was rendered speechless. The bungalow itself is a triumph of sustainable living architecture. Absolutely essential viewing.'),
  ('41f8401a-e8a8-42fa-9809-10604c91d274', 'Colonel Miles Quaritch', NULL, '2024-12-01', 3.5, 3.0, 4.0, 2.0, 5.0, 3.0, 3.0, 'Hostile territory but strategically valuable position. The floating location is tactically interesting. The host was... uncooperative with my requests for unobtanium mining access. The local wildlife tried to kill me three times. Bioluminescence made night operations difficult. The bed was comfortable though. Will return with reinforcements.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = '41f8401a-e8a8-42fa-9809-10604c91d274';


-- ============================================================================
-- 6. ANCIENT EGYPTIAN NILE VILLA (Memphis, 2650 BCE)
-- ============================================================================
-- Listing ID: 32bb68c5-f89a-4a83-a8f3-90b712482575
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2451 (will create)

-- Create/Update Host: Imhotep (the real architect, not the mummy movie villain)
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2451',
  'Imhotep',
  NULL,
  '2024-01-01',
  99,
  'within an hour',
  true,
  true,
  10,
  'Chancellor to Pharaoh Djoser, architect of the Step Pyramid, high priest of Ra, and physician. Basically, I invented stone architecture. You are welcome. This villa showcases the finest Old Kingdom craftsmanship - I designed it myself during a quiet weekend. The Nile views are exceptional, the pyramid construction is visible from the terrace, and the hieroglyphic murals tell stories you cannot read but look impressive. I have also included my own medical remedies for common travel ailments. Do not worry, I was eventually deified. I know what I am doing.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2451' WHERE id = '32bb68c5-f89a-4a83-a8f3-90b712482575';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = '32bb68c5-f89a-4a83-a8f3-90b712482575';

-- Insert reviews for Egyptian Villa
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Cleopatra VII', NULL, '2024-12-20', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'I rule Egypt from Alexandria, but this Old Kingdom villa reminded me of our glorious heritage. The Nile access was perfect for my barge. The lotus-shaped columns are exquisite - I have commissioned similar ones for my palace. Imhotep is a legend, and his hospitality matches his architectural genius. My asp was very comfortable here. The pyramid views at sunrise brought tears to my kohl-lined eyes.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Howard Carter', NULL, '2024-12-15', 5.0, 5.0, 5.0, 4.5, 5.0, 4.5, 5.0, 'Wonderful things! This villa is a treasure trove of authentic Old Kingdom design. Spent hours sketching the hieroglyphics - they tell stories of Djoser''s reign that my colleagues will not believe. The host was generous with historical context, though he seemed puzzled by my questions about tomb curses. For the record, I feel perfectly healthy. The courtyard gardens are peaceful and the local cats are friendly.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Moses', NULL, '2024-12-10', 4.8, 5.0, 5.0, 4.5, 5.0, 4.5, 4.5, 'Complicated feelings about Egypt, as you might imagine, but this villa predates all of that. The Nile views were nostalgic - spent time contemplating the river that once carried me. Imhotep was a thoughtful host who discussed architecture and medicine with genuine passion. The accommodations were excellent. Did not need to perform any miracles during my stay, which was refreshing.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Brendan Fraser', NULL, '2024-12-05', 4.5, 4.5, 4.0, 5.0, 5.0, 4.5, 4.5, 'Kept expecting something to come alive but nothing did. Very disappointed in that regard but also relieved? The host was surprisingly friendly and not at all cursed as far as I could tell. Nice villa, great views, authentic hieroglyphics that I definitely did not accidentally read aloud. The Book of the Dead on the coffee table was a nice decorative touch. Would cautiously recommend.'),
  ('32bb68c5-f89a-4a83-a8f3-90b712482575', 'Asterix', NULL, '2024-12-01', 4.9, 4.5, 5.0, 5.0, 5.0, 5.0, 5.0, 'These Egyptians are crazy! But in a good way. The architecture here makes our Gaulish huts look primitive, which Obelix found offensive. The host showed us the pyramid construction and explained how it works (no aliens involved, despite what Obelix hoped). The Nile fish was delicious. Did not need magic potion even once. Brought back some papyrus for Getafix.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = '32bb68c5-f89a-4a83-a8f3-90b712482575';


-- ============================================================================
-- 7. ALEXANDER THE GREAT'S CAMPAIGN TENT (Persian Empire, 330 BCE)
-- ============================================================================
-- Listing ID: 385e8c54-9458-4fc4-8482-4b2efe7efc2b
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2452 (will create)

-- Create/Update Host: Alexander the Great
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2452',
  'Alexander the Great',
  NULL,
  '2024-01-01',
  100,
  'immediately',
  true,
  true,
  7,
  'King of Macedonia, Pharaoh of Egypt, King of Persia, and Lord of Asia. Undefeated in battle. I conquered the known world by 30 and still had time to plan this listing. My campaign tent has hosted strategy sessions that shaped history. The Persian treasures are authentic - I took them personally. Aristotle was my tutor, so expect intellectual conversation. Currently planning to conquer India but taking a brief hosting break. The only thing I have not conquered is bad reviews.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2452' WHERE id = '385e8c54-9458-4fc4-8482-4b2efe7efc2b';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = '385e8c54-9458-4fc4-8482-4b2efe7efc2b';

-- Insert reviews for Alexander's Tent
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Julius Caesar', NULL, '2024-12-20', 5.0, 4.5, 5.0, 5.0, 5.0, 5.0, 5.0, 'I wept when I visited this tent. Not because of the accommodation - which is excellent - but because Alexander achieved so much by my age while I had barely started. The Persian treasures are magnificent, the military maps inspiring. We discussed tactics over wine until dawn. He has some interesting ideas about world domination that I plan to... adapt. Veni, vidi, booked again.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Genghis Khan', NULL, '2024-12-15', 4.8, 4.0, 5.0, 4.5, 5.0, 4.5, 5.0, 'Decent tent. I have conquered more land but Alexander did it with style. The Persian silk hangings are softer than my yurt felt, which is both impressive and slightly annoying. We compared conquest strategies - his phalanx is interesting but my cavalry tactics are superior. Good host, ambitious, drinks too much. The location in Persia was nice but I prefer the steppes.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Napoleon Bonaparte', NULL, '2024-12-10', 5.0, 4.5, 5.0, 4.5, 5.0, 5.0, 5.0, 'Magnifique! I have always admired Alexander, and staying in his actual tent was profoundly moving. The military maps showed campaigns I studied at academy. We discussed Egypt - I apparently will make some interesting choices there. He was taller than I expected. The accommodations are fit for a conqueror. His horse Bucephalus is better than any of mine, which I find vexing.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Wonder Woman', NULL, '2024-12-05', 4.7, 4.5, 4.5, 5.0, 5.0, 4.5, 4.5, 'My Amazon sisters have mixed feelings about Macedonian conquerors, but I must admit Alexander was a gracious host. We sparred at dawn - he fights well for a mortal. The tent contains fascinating artifacts from cultures he... encountered. His respect for Darius and the Persian customs shows honor. The military camp atmosphere was nostalgic. Good warrior, reasonable man, needs to listen to his generals more.'),
  ('385e8c54-9458-4fc4-8482-4b2efe7efc2b', 'Diogenes', NULL, '2024-12-01', 3.5, 3.0, 5.0, 5.0, 4.0, 3.5, 2.5, 'Alexander visited me once and offered anything I wanted. I told him to move because he was blocking my sunlight. Now I have visited his tent. Too many possessions. Too much gold. The man has conquered the world but cannot find inner peace. Good wine though. I slept in my barrel outside - the tent was too comfortable. If I were not Diogenes, I would want to be Diogenes sleeping outside this tent.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = '385e8c54-9458-4fc4-8482-4b2efe7efc2b';


-- ============================================================================
-- 8. 1990s MANHATTAN LOFT IN PRE-INTERNET NYC (SoHo, 1995)
-- ============================================================================
-- Listing ID: ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93
-- Host ID: 5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453 (will create)

-- Create/Update Host: Derek & Monica Chen (fictional 90s artists)
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453',
  'Derek & Monica Chen',
  NULL,
  '2024-01-01',
  94,
  'within a few hours',
  true,
  true,
  14,
  'Mixed media artists living the SoHo dream. We moved here when the rent was almost reasonable and have witnessed the neighborhood transform from industrial wasteland to cultural epicenter. Our loft doubles as gallery and living space - every wall tells a story. The answering machine is temperamental, the VHS collection is extensive, and the vinyl selection is chef''s kiss. No internet because it does not really exist yet and honestly, we do not miss what we have never had. Leave a message after the beep.'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  response_time = EXCLUDED.response_time;

-- Update listing to link to host
UPDATE listings SET host_id = '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453' WHERE id = 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93';

-- Delete existing reviews
DELETE FROM reviews WHERE listing_id = 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93';

-- Insert reviews for 90s Manhattan Loft
INSERT INTO reviews (listing_id, reviewer_name, reviewer_avatar_url, review_date, rating_overall, rating_cleanliness, rating_accuracy, rating_communication, rating_location, rating_checkin, rating_value, comment)
VALUES
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Jerry Seinfeld', NULL, '2024-12-20', 5.0, 4.5, 5.0, 5.0, 5.0, 5.0, 5.0, 'What IS the deal with time travel listings? No but seriously, this place is perfect. The answering machine messages alone are comedy gold. Kramer stopped by and somehow already knew the hosts. The diner down the street serves a decent tuna on rye. Spent an evening debating nothing with George over the rotary phone. It is the quintessential 90s NYC experience. Not that there is anything wrong with that.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Rachel Green', NULL, '2024-12-15', 4.9, 5.0, 5.0, 5.0, 5.0, 5.0, 4.5, 'Oh. My. God. This loft is everything! The vintage clothing in the closet? To die for. The coffee shop nearby is not Central Perk but it will do. Spent hours with the hosts talking about fashion and art. Used their phone to leave passive-aggressive messages for Ross - very satisfying without call waiting interrupting. Monica would love the organized kitchen drawers. Could this BE any more 90s?'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Will Smith', NULL, '2024-12-10', 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 'This is a story all about how my stay at this loft was wild! Fresh Prince vibes everywhere. The boombox is fully functional - had a dance party with the hosts. The neighborhood is everything West Philadelphia was not but in a good way? Watched Fresh Prince on the living room TV which was a weird experience. Carlton would hate it here. 10/10.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Carrie Bradshaw', NULL, '2024-12-05', 4.8, 4.5, 5.0, 5.0, 5.0, 4.5, 4.5, 'I could not help but wonder... is pre-internet dating better? After a week in this SoHo loft, I have my answer: absolutely. No swiping, no apps, just meeting people at gallery openings and leaving voice messages. Very romantic. The vintage typewriter was perfect for my column. The shoe closet needs expansion but the Manolos I found at a nearby consignment store made up for it. The city feels more alive without everyone staring at phones.'),
  ('ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', 'Doc Brown', NULL, '2024-12-01', 4.7, 4.0, 5.0, 4.5, 5.0, 4.5, 4.5, 'Great Scott! A time travel listing where I am the guest instead of the facilitator! The technology here is charmingly primitive but functional. The 1995 Macintosh reminded me of my early flux capacitor calculations. The hosts were curious about my DeLorean but I said it was in the shop. The lack of internet is actually peaceful. Did not accidentally alter the timeline, which is always a plus. 1.21 gigawatts not required.');

-- Update total_reviews count
UPDATE listings SET total_reviews = 5 WHERE id = 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93';


-- ============================================================================
-- SUMMARY OF ALL HOSTS AND REVIEWERS FOR AVATAR GENERATION
-- ============================================================================
--
-- Listing 1: Shah Jahan's Marble Suite
--   Host: Emperor Shah Jahan
--   Reviewers: Marco Polo, Cleopatra VII, Indiana Jones, Queen Victoria, Aladdin
--
-- Listing 2: Lost Atlantean Crystal Villa
--   Host: Lord Poseidon
--   Reviewers: Aquaman, Jacques Cousteau, Ariel, Captain Nemo, SpongeBob SquarePants
--
-- Listing 3: Titanic First-Class Suite
--   Host: Captain Edward Smith
--   Reviewers: Jack Dawson, Rose DeWitt Bukater, Molly Brown, Benjamin Guggenheim, Leonardo DiCaprio
--
-- Listing 4: WWII Resistance Safehouse
--   Host: Hans & Sophie Hoffmann
--   Reviewers: Oskar Schindler, Anne Frank, Indiana Jones, Captain America, Inglourious Brad
--
-- Listing 5: Pandora Floating Mountain Bungalow
--   Host: Neytiri te Tskaha Mo'at'ite
--   Reviewers: Jake Sully, Dr. Grace Augustine, Avatar Aang, David Attenborough, Colonel Miles Quaritch
--
-- Listing 6: Ancient Egyptian Nile Villa
--   Host: Imhotep
--   Reviewers: Cleopatra VII, Howard Carter, Moses, Brendan Fraser, Asterix
--
-- Listing 7: Alexander's Campaign Tent
--   Host: Alexander the Great
--   Reviewers: Julius Caesar, Genghis Khan, Napoleon Bonaparte, Wonder Woman, Diogenes
--
-- Listing 8: 1990s Manhattan Loft
--   Host: Derek & Monica Chen
--   Reviewers: Jerry Seinfeld, Rachel Green, Will Smith, Carrie Bradshaw, Doc Brown
--
