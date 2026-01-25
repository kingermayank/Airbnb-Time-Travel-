-- ============================================================================
-- FULL LISTING CONTENT POPULATION SCRIPT
-- Airbnb Time Travel - Complete content for all 9 listings
-- Run this script in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE HOSTS FOR EACH LISTING
-- ============================================================================

-- Host for Shah Jahan's Marble Suite
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-shah-jahan',
  'Emperor Shah Jahan',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-shah-jahan.jpg',
  '1628-01-01',
  98,
  'within an hour',
  true,
  true,
  847,
  'Fifth Mughal Emperor and builder of the Taj Mahal. I opened my private marble suite to share the grandeur of Mughal architecture with travelers across time. When not hosting, I oversee construction projects and compose Persian poetry. My passion is preserving the artistic heritage of the Mughal dynasty for future generations.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for SpaceX Mars Colony Pod
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-elon-musk',
  'Elon Musk',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-elon.jpg',
  '2045-03-15',
  95,
  'within a few hours',
  true,
  true,
  2341,
  'CEO of SpaceX and founder of the Mars Colony. After decades of dreaming about making humanity multi-planetary, I''m thrilled to welcome guests to our Olympus Mons habitat. When not managing interplanetary logistics, I enjoy driving rovers across the Martian surface and tweeting from space. Your comfort and safety are my top priorities.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for Atlantean Crystal Villa
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-poseidon',
  'Lord Poseidon',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-poseidon.jpg',
  '-9600-01-01',
  100,
  'within minutes',
  true,
  true,
  3892,
  'God of the Sea and protector of Atlantis. For millennia, I have guarded the crystal villas of our lost civilization. Now, through the miracle of time travel, I welcome curious souls to experience the wonders of Atlantean technology and underwater living. The dolphins and sea creatures are my neighbors - they may visit during your stay!'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for Titanic First-Class Suite
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-captain-smith',
  'Captain Edward Smith',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-captain-smith.jpg',
  '1912-04-10',
  97,
  'within an hour',
  true,
  true,
  1247,
  'Captain of the RMS Titanic on her maiden voyage. With over 40 years of maritime experience, I take pride in ensuring every first-class passenger enjoys the finest accommodations the White Star Line has to offer. The Titanic represents the pinnacle of luxury ocean travel. Welcome aboard the Ship of Dreams.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for WWII Resistance Safehouse
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-resistance',
  'Hans & Sophie Hoffmann',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-resistance.jpg',
  '1943-07-01',
  92,
  'within a day',
  false,
  true,
  156,
  'Members of the German Resistance during World War II. We risk everything to shelter those in need and fight against tyranny. Our safehouse has protected dozens of refugees and resistance fighters. We share this space to educate future generations about courage, sacrifice, and the importance of standing against injustice.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for Pandora Bungalow
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-neytiri',
  'Neytiri te Tskaha Mo''at''ite',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-neytiri.jpg',
  '2154-08-01',
  99,
  'within an hour',
  true,
  true,
  567,
  'Daughter of the Omaticaya clan''s spiritual leader and fierce warrior of Pandora. I have learned to bridge the gap between the Na''vi and sky people, sharing the beauty of our world while protecting it. Stay in my bungalow and experience the deep connection between all living things. I See You.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for Ancient Egyptian Villa
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-imhotep',
  'Imhotep',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-imhotep.jpg',
  '-2650-01-01',
  96,
  'within a few hours',
  true,
  true,
  1823,
  'High Priest, architect of the Step Pyramid, and physician to Pharaoh Djoser. I designed this villa along the sacred Nile to showcase the majesty of Old Kingdom Egypt. As one who has been deified for my wisdom, I take hosting very seriously. Expect hieroglyphic tours, astronomical observations, and authentic Egyptian hospitality.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for Alexander's Campaign Tent
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-alexander',
  'Alexander the Great',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-alexander.jpg',
  '-330-01-01',
  94,
  'within a few hours',
  true,
  true,
  2156,
  'King of Macedon, Pharaoh of Egypt, Lord of Asia. While conquering the known world, I ensure my campaign headquarters offers comfort befitting royalty. My tent has witnessed strategy sessions that changed history. Join me on this journey across Persia and experience the life of a conqueror. Fortune favors the bold!'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- Host for 1990s Manhattan Loft
INSERT INTO hosts (id, name, profile_picture_url, join_date, response_rate, response_time, is_superhost, is_identity_verified, total_reviews, description)
VALUES (
  'host-90s-artist',
  'Derek & Monica Chen',
  'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/host-90s-artist.jpg',
  '1995-06-01',
  97,
  'within an hour',
  true,
  true,
  892,
  'Artists and musicians living the SoHo dream in pre-internet NYC. Our loft has hosted legendary jam sessions, gallery openings, and countless creative souls. Experience Manhattan before smartphones, when people actually talked to each other on the subway. We''ve preserved everything from our VHS collection to the rotary phone. Totally rad!'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  response_rate = EXCLUDED.response_rate,
  is_superhost = EXCLUDED.is_superhost;

-- ============================================================================
-- PART 2: UPDATE LISTINGS WITH FULL CONTENT
-- ============================================================================

-- Shah Jahan's Marble Suite in Agra
UPDATE listings SET
  host_id = 'host-shah-jahan',
  property_type = 'Entire palace suite',
  guest_capacity = 4,
  bedrooms = 2,
  beds = 2,
  baths = 2,
  location_description = 'Agra, Mughal Empire, 1648 CE',
  short_description = 'Experience royal Mughal luxury in this exquisite marble suite with views of the Taj Mahal construction.',
  full_description = 'Step into the golden age of the Mughal Empire in this breathtaking marble suite within the imperial palace complex of Agra. Built during my reign as the fifth Mughal Emperor, this suite showcases the finest craftsmanship of Indian artisans - from intricate pietra dura inlay work to hand-carved marble lattice screens (jali) that filter the warm Agra sunlight.

Wake to the sound of morning prayers echoing across the Yamuna River and witness the ongoing construction of the Taj Mahal from your private terrace. The suite features authentic Mughal furnishings, including a canopied bed with silk draperies, Persian carpets woven with gold thread, and cushioned seating areas for traditional mehfil gatherings.

Your stay includes access to the royal kitchens where master chefs prepare authentic Mughlai cuisine - biryanis, kebabs, and the legendary petha sweets of Agra. The private courtyard fountain provides a cooling retreat, while our court musicians can arrange evening performances of classical ragas.',
  key_features = '[
    {"title": "Taj Mahal Construction Views", "description": "Witness the world''s greatest monument being built from your private terrace"},
    {"title": "Royal Mughal Architecture", "description": "Authentic pietra dura inlay, marble lattice screens, and hand-carved details"},
    {"title": "Imperial Kitchen Access", "description": "Meals prepared by royal chefs specializing in Mughlai cuisine"},
    {"title": "Court Entertainment", "description": "Classical music performances and poetry recitations available upon request"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Emperor''s Chamber", "beds": "1 king-sized canopied bed"},
    {"room": "Attendant''s Quarters", "beds": "1 queen daybed with silk cushions"}
  ]'::jsonb,
  cancellation_policy = 'Flexible cancellation - full refund if cancelled 24 hours before arrival. Imperial decree protects all time travelers from booking penalties.',
  weekly_discount_percent = 15,
  cleaning_fee = 85,
  service_fee_percent = 14,
  occupancy_tax_percent = 8
WHERE id = 'bdf429ac-9274-44e1-9986-b43dcffe87e9';

-- SpaceX Mars Colony Pod at Olympus Mons
UPDATE listings SET
  host_id = 'host-elon-musk',
  property_type = 'Entire habitat pod',
  guest_capacity = 2,
  bedrooms = 1,
  beds = 2,
  baths = 1,
  location_description = 'Olympus Mons Base, Mars, 2157 CE',
  short_description = 'Live the dream of Mars colonization in this state-of-the-art SpaceX habitat with stunning red planet views.',
  full_description = 'Welcome to humanity''s greatest achievement - the first tourist-accessible habitat on Mars. Located at the base of Olympus Mons, the tallest planetary mountain in our solar system, this SpaceX-engineered pod offers the ultimate frontier experience without sacrificing comfort or safety.

The habitat features our latest life support technology, maintaining Earth-like conditions with optimal oxygen levels, temperature control, and radiation shielding. The panoramic observation dome provides 270-degree views of the Martian landscape - watch dust devils dance across the Tharsis plateau or gaze at Earth as a bright point in the night sky.

Your pod includes a compact but fully-equipped galley kitchen with rehydration systems and a selection of space-optimized meals developed by world-class chefs. The zero-gravity sleeping pods use magnetic suspension for the most unique sleep experience in the solar system. Starlink provides reliable high-speed internet connectivity back to Earth (with only a 20-minute delay, of course).

Exploration rovers are available for guided excursions across the Martian surface. Venture to nearby lava tubes, ancient riverbeds, or simply watch the sunset paint the sky in shades of blue and pink.',
  key_features = '[
    {"title": "Advanced Life Support", "description": "SpaceX''s latest environmental systems maintain perfect Earth-like conditions"},
    {"title": "Observation Dome", "description": "270-degree panoramic views of Olympus Mons and the Martian landscape"},
    {"title": "Rover Excursions", "description": "Guided surface exploration with pressurized rovers included"},
    {"title": "Zero-G Sleep Pods", "description": "Experience weightless sleep with magnetic suspension technology"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Main Pod", "beds": "2 zero-gravity suspension pods"}
  ]'::jsonb,
  cancellation_policy = 'Moderate cancellation - full refund if cancelled 7 Mars sols (7.4 Earth days) before arrival. Launch windows may affect rescheduling options.',
  weekly_discount_percent = 10,
  cleaning_fee = 150,
  service_fee_percent = 14,
  occupancy_tax_percent = 0
WHERE id = '10b2efa4-819b-4a10-99a0-1f5dc580b080';

-- The Lost Atlantean Crystal Villa
UPDATE listings SET
  host_id = 'host-poseidon',
  property_type = 'Entire underwater villa',
  guest_capacity = 6,
  bedrooms = 3,
  beds = 4,
  baths = 2,
  location_description = 'Atlantis, Atlantic Ocean, 9600 BCE',
  short_description = 'Discover the mythical lost city in this stunning crystal-powered villa with 360-degree ocean views.',
  full_description = 'Descend into legend and experience the technological marvels of Atlantis in this extraordinary crystal villa. Located in the heart of the lost city, this dwelling showcases the advanced civilization that flourished thousands of years before recorded history.

The villa is constructed entirely from Atlantean orichalcum-infused crystal, which harnesses the natural energy of the ocean currents to power all systems. Watch in wonder as bioluminescent sea creatures illuminate the waters around you, creating an ever-changing light show through the transparent walls. The crystal amplifies and focuses this light, allowing you to observe marine life in stunning detail.

Three spacious bedrooms offer panoramic underwater views, with temperature-controlled sleeping surfaces that adjust to your body''s needs using ancient Atlantean bio-feedback technology. The central gathering hall features a circular reflecting pool connected to the open ocean through a molecular membrane - reach in and touch passing fish, or use the underwater access portal for swimming excursions.

The villa''s crystal energy systems also power advanced water filtration, climate control, and food synthesis capabilities. Our Atlantean chefs can prepare cuisine from any era, though we recommend trying traditional Atlantean delicacies infused with rare deep-sea ingredients.',
  key_features = '[
    {"title": "Crystal Energy Systems", "description": "Self-sustaining power from ancient Atlantean technology"},
    {"title": "360-Degree Ocean Views", "description": "Transparent crystal walls reveal the wonders of the deep"},
    {"title": "Underwater Portal Access", "description": "Swim directly into the ocean through molecular membrane technology"},
    {"title": "Bioluminescent Light Shows", "description": "Nightly displays of glowing sea creatures around the villa"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Poseidon Suite", "beds": "1 king crystal platform bed"},
    {"room": "Nereid Chamber", "beds": "1 queen floating bed"},
    {"room": "Triton Room", "beds": "2 single suspended beds"}
  ]'::jsonb,
  cancellation_policy = 'Flexible cancellation - full refund anytime. The tides of time flow both ways in Atlantis.',
  weekly_discount_percent = 20,
  cleaning_fee = 125,
  service_fee_percent = 14,
  occupancy_tax_percent = 5
WHERE id = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';

-- First-Class Suite in Titanic April 1912
UPDATE listings SET
  host_id = 'host-captain-smith',
  property_type = 'First-class suite',
  guest_capacity = 2,
  bedrooms = 1,
  beds = 1,
  baths = 1,
  location_description = 'RMS Titanic, Atlantic Ocean, April 1912',
  short_description = 'Sail aboard the Ship of Dreams in unprecedented luxury on Titanic''s maiden voyage.',
  full_description = 'Experience the pinnacle of Edwardian luxury aboard the RMS Titanic, the largest and most opulent ocean liner ever built. Your first-class suite on B-Deck offers accommodations rivaling the finest hotels in London and Paris, complete with period-authentic furnishings crafted by the most skilled artisans of the era.

The suite features a private sitting room with mahogany paneling, a working fireplace (electric, for safety), and windows overlooking the promenade deck. The bedroom showcases a brass bed with the finest Irish linens, while the private bathroom includes the revolutionary "en-suite" design with hot and cold running water - a luxury most homes of this era cannot match.

Dine in the magnificent first-class dining saloon, where a ten-course dinner unfolds over three hours. The ship''s French chef, formerly of the Ritz Paris, prepares dishes that would satisfy any palate. After dinner, gentlemen may retire to the smoking room for brandy and cigars, while ladies gather in the elegant reading room.

Take a dip in the heated swimming pool, work out in the gymnasium with its mechanical horses and rowing machines, or simply stroll the deck and watch the endless Atlantic horizon. This is travel as it was meant to be - before the age of rushing.',
  key_features = '[
    {"title": "Private Promenade Access", "description": "Your own section of deck for morning constitutionals"},
    {"title": "First-Class Dining", "description": "Ten-course meals prepared by Ritz-trained chefs"},
    {"title": "Ship Amenities", "description": "Access to swimming pool, gymnasium, Turkish bath, and squash court"},
    {"title": "Edwardian Luxury", "description": "Period-authentic furnishings and impeccable White Star Line service"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Master Stateroom", "beds": "1 queen brass bed with Irish linens"}
  ]'::jsonb,
  cancellation_policy = 'Strict cancellation - 50% refund if cancelled 3 days before departure. The White Star Line appreciates your understanding.',
  weekly_discount_percent = 0,
  cleaning_fee = 75,
  service_fee_percent = 14,
  occupancy_tax_percent = 10
WHERE id = '0580d737-156f-49ea-abcb-621797f493cf';

-- WWII German Resistance Safehouse Loft
UPDATE listings SET
  host_id = 'host-resistance',
  property_type = 'Private loft',
  guest_capacity = 3,
  bedrooms = 1,
  beds = 3,
  baths = 1,
  location_description = 'Berlin, Germany, 1943',
  short_description = 'Step into history in this authentic WWII resistance safehouse, preserved as a tribute to courage.',
  full_description = 'This is not merely accommodation - it is a portal to one of history''s most dangerous and heroic periods. Our safehouse loft in Berlin served as a crucial link in the underground network that helped persecuted individuals escape Nazi Germany and coordinated resistance activities against the Third Reich.

The space has been meticulously preserved to reflect its wartime configuration. The main living area features 1940s furnishings, blackout curtains, and a period radio carefully tuned to BBC broadcasts (the only reliable source of news). Hidden compartments throughout the loft once concealed documents, refugees, and resistance communications - you''ll discover some of these secrets during your stay.

The covert entry system remains functional, accessed through what appears to be a regular coat closet. This attention to detail saved many lives and continues to serve as an educational tool for visitors understanding the resistance movement.

We provide extensive educational materials about the German Resistance, the White Rose movement, and the countless ordinary citizens who risked everything to oppose tyranny. Evening discussions with our hosts offer personal perspectives on this critical period of history.

Note: This is an immersive historical experience. While we ensure your safety and comfort, the atmosphere deliberately reflects the tension and austerity of wartime Berlin.',
  key_features = '[
    {"title": "Hidden Compartments", "description": "Discover secret spaces used to hide refugees and documents"},
    {"title": "Period-Authentic Details", "description": "Original 1940s furnishings, blackout curtains, and resistance equipment"},
    {"title": "Covert Entry System", "description": "Experience the secret entrance used by resistance members"},
    {"title": "Educational Programs", "description": "In-depth materials and discussions about the German Resistance"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Main Loft", "beds": "1 double bed, 2 cots (resistance-style)"}
  ]'::jsonb,
  cancellation_policy = 'Understanding cancellation - full refund anytime. We know plans change, especially in times of uncertainty.',
  weekly_discount_percent = 25,
  cleaning_fee = 45,
  service_fee_percent = 14,
  occupancy_tax_percent = 7
WHERE id = '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5';

-- Pandora Floating Mountain Bungalow
UPDATE listings SET
  host_id = 'host-neytiri',
  property_type = 'Entire floating bungalow',
  guest_capacity = 4,
  bedrooms = 2,
  beds = 3,
  baths = 1,
  location_description = 'Hallelujah Mountains, Pandora, 2154 CE',
  short_description = 'Connect with nature in a gravity-defying bungalow among Pandora''s floating mountains.',
  full_description = 'Oel ngati kameie - I See You. Welcome to my home among the Hallelujah Mountains of Pandora, where massive rock formations float impossibly in the sky, held aloft by the unique magnetic fields of unobtanium deposits. This bungalow, woven from living Pandoran plants, offers an experience of harmony with nature that your world has forgotten.

The structure is grown rather than built, using traditional Na''vi techniques passed down through generations. Living vines form the walls, naturally regulating temperature and humidity while connecting you to the neural network of Pandora''s ecosystem. At night, the entire forest transforms as bioluminescent plants and creatures illuminate the darkness in brilliant blues, purples, and greens.

Two sleeping areas feature hammocks woven from direhor se silk, the most comfortable sleeping surface known on any world. The eco-friendly systems recycle all waste through natural biological processes, while fresh water flows from a pristine mountain spring.

Wildlife observation opportunities abound - from your terrace, watch direhorses (pa''li) graze on floating meadows, observe the graceful flight of mountain banshees (ikran), and if you''re fortunate, witness the sacred Woodsprites (atokirina'') that carry the will of Eywa. Guided excursions to Hometree and the Tree of Souls can be arranged.',
  key_features = '[
    {"title": "Gravity-Defying Location", "description": "Suspended among the famous floating mountains of Pandora"},
    {"title": "Bioluminescent Nights", "description": "Experience the magical glow of Pandoran life after dark"},
    {"title": "Living Architecture", "description": "Grown from native plants using traditional Na''vi methods"},
    {"title": "Wildlife Encounters", "description": "Observe ikran, direhorses, and Pandora''s unique creatures"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Tsaheylu Chamber", "beds": "1 king hammock bed"},
    {"room": "Ikran Nest", "beds": "2 single woven hammocks"}
  ]'::jsonb,
  cancellation_policy = 'Harmonious cancellation - full refund with 48 hours notice. Eywa understands all journeys.',
  weekly_discount_percent = 12,
  cleaning_fee = 95,
  service_fee_percent = 14,
  occupancy_tax_percent = 0
WHERE id = '41f8401a-e8a8-42fa-9809-10604c91d274';

-- Ancient Egyptian Nile Villa
UPDATE listings SET
  host_id = 'host-imhotep',
  property_type = 'Entire riverside villa',
  guest_capacity = 6,
  bedrooms = 3,
  beds = 4,
  baths = 2,
  location_description = 'Memphis, Ancient Egypt, 2650 BCE',
  short_description = 'Live like royalty in this Old Kingdom villa with private Nile access and pyramid views.',
  full_description = 'May the blessings of Ra illuminate your stay in this magnificent villa along the sacred Nile River. Built during the glorious Old Kingdom period, this estate showcases the architectural achievements that made Egypt the wonder of the ancient world.

The villa features traditional mud-brick construction with whitewashed walls that keep the interior cool even during the hottest days. Hieroglyphic murals depict scenes of daily Egyptian life, religious ceremonies, and the journey to the afterlife - each one hand-painted by temple artisans. Lotus-shaped columns support covered terraces where you can watch the eternal flow of the Nile.

Three sleeping chambers offer views of either the river or the courtyard gardens, where pomegranate trees, date palms, and papyrus provide shade and sustenance. Beds feature wooden frames with woven reed mattresses and fine linen sheets - the same design used by the Pharaoh himself.

The villa includes private access to the Nile, where feluccas await to take you upriver to the Step Pyramid at Saqqara or downriver to the great temples of Memphis. Evening meals are served in the garden, featuring bread, beer, roasted meats, and the freshest fruits from our orchards. Our household servants will attend to your every need.

Guided tours to the pyramid construction sites can be arranged - witness the monuments being built that will stand for millennia!',
  key_features = '[
    {"title": "Private Nile Access", "description": "Your own riverfront dock with feluccas for exploration"},
    {"title": "Pyramid Views", "description": "Watch the construction of monuments that will last 4,000 years"},
    {"title": "Hieroglyphic Art", "description": "Original murals by temple artisans throughout the villa"},
    {"title": "Traditional Gardens", "description": "Courtyard oasis with native plants and reflecting pools"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Pharaoh''s Suite", "beds": "1 king wooden platform bed"},
    {"room": "Scribe''s Chamber", "beds": "1 queen bed"},
    {"room": "Servant''s Quarters", "beds": "2 single reed beds"}
  ]'::jsonb,
  cancellation_policy = 'Divine cancellation - full refund with the blessing of Thoth. May your journey be protected.',
  weekly_discount_percent = 18,
  cleaning_fee = 65,
  service_fee_percent = 14,
  occupancy_tax_percent = 6
WHERE id = '32bb68c5-f89a-4a83-a8f3-90b712482575';

-- Alexander the Great's Campaign Tent
UPDATE listings SET
  host_id = 'host-alexander',
  property_type = 'Royal campaign tent',
  guest_capacity = 4,
  bedrooms = 2,
  beds = 3,
  baths = 1,
  location_description = 'Persian Empire (Modern Iran), 330 BCE',
  short_description = 'Experience the life of a conqueror in Alexander''s legendary campaign headquarters.',
  full_description = 'Fortune favors the bold! Join me in my campaign headquarters as we reshape the world. This royal tent served as my command center during the conquest of the Persian Empire - within these walls, strategies were devised that changed the course of history.

The main pavilion spans over 100 square feet and is constructed from the finest Macedonian leather and silk fabrics captured from the Persian king Darius himself. Persian carpets cover the floors, while golden braziers provide warmth and light. The furniture represents the wealth of a dozen kingdoms - Greek craftsmanship, Egyptian gold, Persian luxury, and treasures from across the known world.

The military atmosphere permeates everything. Maps and tactical documents cover the planning table where I consult with my generals. You''ll dine on campaign fare elevated to royal standards - roasted meats, Mediterranean wines, olives, cheese, and bread baked fresh daily by our army''s finest cooks.

Two sleeping chambers offer different experiences: the Royal Quarter features my personal effects and a bed worthy of a king, while the Companion''s Section provides the authentic experience of my elite cavalry officers. Either way, you''ll fall asleep to the sounds of a military camp - distant horns, horses, and the chatter of soldiers from every corner of Greece.

Join our morning training exercises, attend strategic briefings, or simply observe the diverse cultures of the Macedonian army. History is being made - be part of it!',
  key_features = '[
    {"title": "Historical Command Center", "description": "Where Alexander planned the conquest of the Persian Empire"},
    {"title": "Persian Royal Treasures", "description": "Furnishings captured from King Darius''s own palace"},
    {"title": "Military Camp Experience", "description": "Immerse yourself in the daily life of a conquering army"},
    {"title": "Companion Training", "description": "Optional participation in Macedonian military exercises"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Royal Quarter", "beds": "1 king campaign bed with Persian silks"},
    {"room": "Companion''s Section", "beds": "2 military cots with quality bedding"}
  ]'::jsonb,
  cancellation_policy = 'Warrior''s honor - 75% refund if cancelled 3 days before arrival. The campaign waits for no one.',
  weekly_discount_percent = 10,
  cleaning_fee = 55,
  service_fee_percent = 14,
  occupancy_tax_percent = 5
WHERE id = '385e8c54-9458-4fc4-8482-4b2efe7efc2b';

-- 1990s Manhattan Loft in Pre-Internet NYC
UPDATE listings SET
  host_id = 'host-90s-artist',
  property_type = 'Entire loft',
  guest_capacity = 4,
  bedrooms = 1,
  beds = 2,
  baths = 1,
  location_description = 'SoHo, Manhattan, 1995',
  short_description = 'Time travel to the golden age of NYC culture before the internet changed everything.',
  full_description = 'Welcome to pre-internet New York City! Our SoHo loft captures the magic of 1990s Manhattan - when artists could still afford to live here, when people met in coffee shops instead of dating apps, and when the city''s creative energy was at its peak.

This authentic industrial loft features exposed brick walls, original cast-iron columns, and massive windows flooding the space with natural light. The open floor plan includes a living area with vintage furniture, a galley kitchen with period appliances, and a sleeping loft accessed by a spiral staircase.

Our retro technology collection is the heart of the experience: a working rotary phone, a boombox with cassette deck, a VHS player with an extensive movie collection (including original releases of Pulp Fiction, Clueless, and The Matrix), and a turntable with crates of vinyl spanning every genre. There''s also a functioning 1995 Macintosh - experience the early days of personal computing!

The neighborhood is peak-90s SoHo: galleries on every corner, independent coffee shops, record stores, and vintage boutiques. We''ll provide recommendations for the best spots, plus a Walkman with mixtapes for your urban explorations. The subway token in your welcome basket works on the actual 1990s transit system.

Warning: No cell phones, no GPS, no social media. You''ll have to navigate using paper maps and actually talk to strangers for directions. It''s terrifying and wonderful.',
  key_features = '[
    {"title": "Authentic 90s Tech", "description": "VHS player, rotary phone, boombox, vinyl collection, and vintage Mac"},
    {"title": "SoHo Location", "description": "Prime arts district before the galleries became luxury boutiques"},
    {"title": "Pre-Internet Experience", "description": "Disconnect from digital life and reconnect with analog reality"},
    {"title": "Period Entertainment", "description": "Extensive collection of 90s movies, music, and magazines"}
  ]'::jsonb,
  sleeping_arrangements = '[
    {"room": "Sleeping Loft", "beds": "1 queen mattress on platform, 1 futon"}
  ]'::jsonb,
  cancellation_policy = 'Chill cancellation - full refund anytime, no questions asked. It''s all good, dude.',
  weekly_discount_percent = 15,
  cleaning_fee = 60,
  service_fee_percent = 14,
  occupancy_tax_percent = 9
WHERE id = 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93';

-- ============================================================================
-- PART 3: VERIFY THE UPDATES
-- ============================================================================

-- Check hosts were created
SELECT id, name, is_superhost, response_rate FROM hosts WHERE id LIKE 'host-%';

-- Check listings were updated with full content
SELECT
  id,
  title,
  host_id,
  property_type,
  guest_capacity,
  bedrooms,
  beds,
  baths,
  CASE WHEN full_description IS NOT NULL THEN 'Yes' ELSE 'No' END as has_description,
  CASE WHEN key_features IS NOT NULL THEN 'Yes' ELSE 'No' END as has_features,
  CASE WHEN sleeping_arrangements IS NOT NULL THEN 'Yes' ELSE 'No' END as has_sleeping
FROM listings
WHERE id IN (
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
