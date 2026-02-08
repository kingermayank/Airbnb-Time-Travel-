import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// ============================================================================
// PHASE 4 LISTINGS - NEW HUMOROUS TIME TRAVEL PROPERTIES
// ============================================================================

// Generate UUIDs for new listings and hosts
const LISTING_IDS = {
  MIAMI_UNDERWATER: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
  AMAZON_BIODOME: 'a1b2c3d4-e5f6-7890-abcd-222222222222',
  LUNAR_HILTON: 'a1b2c3d4-e5f6-7890-abcd-333333333333',
  FLOATING_CITY: 'a1b2c3d4-e5f6-7890-abcd-444444444444',
  STAR_TREK_SUITE: 'a1b2c3d4-e5f6-7890-abcd-555555555555',
  BERMUDA_PLATFORM: 'a1b2c3d4-e5f6-7890-abcd-666666666666',
  AREA_51_BARRACKS: 'a1b2c3d4-e5f6-7890-abcd-777777777777',
  STONE_AGE_CAVE: 'a1b2c3d4-e5f6-7890-abcd-888888888888',
};

const HOST_IDS = {
  CAPTAIN_ROSA: 'b1c2d3e4-f5a6-7890-bcde-111111111111',
  GAIA_12: 'b1c2d3e4-f5a6-7890-bcde-222222222222',
  CHARLOTTE_HILTON_MUSK: 'b1c2d3e4-f5a6-7890-bcde-333333333333',
  KAI_NAKAMURA_CHEN: 'b1c2d3e4-f5a6-7890-bcde-444444444444',
  ADMIRAL_CHEN_HOLOGRAM: 'b1c2d3e4-f5a6-7890-bcde-555555555555',
  UNKNOWN_BERMUDA: 'b1c2d3e4-f5a6-7890-bcde-666666666666',
  REDACTED_AREA51: 'b1c2d3e4-f5a6-7890-bcde-777777777777',
  GROK_RIVER_CLAN: 'b1c2d3e4-f5a6-7890-bcde-888888888888',
};

// ============================================================================
// HOSTS
// ============================================================================

const newHosts = [
  // 1. Captain Rosa Delgado - Miami Underwater
  {
    id: HOST_IDS.CAPTAIN_ROSA,
    name: 'Captain Rosa Delgado',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 98,
    response_time: 'within an hour',
    is_superhost: true,
    is_identity_verified: true,
    is_temporal_guardian: true,
    total_reviews: 47,
    description: `Former Miami real estate agent, current submarine tour operator. Yes, I pivoted careers when my entire client base became scuba diving territory. Do I miss selling beachfront property? Honey, I still sell beachfront property - it\'s just that the beach is now 40 feet above us. The market adapted, I adapted. My Zillow reviews from 2045 are still up if you want to see my "pre-submersion" portfolio. Five stars, baby. Five stars underwater too.`,
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
    ]),
    house_rules_quirks: JSON.stringify([
      'No feeding the dolphins - they know where the old Whole Foods was',
      'Pressure suit required outside after 6 PM',
      'Please do not attempt to surface without a guide',
    ]),
  },

  // 2. GAIA-12 - Amazon Biodome
  {
    id: HOST_IDS.GAIA_12,
    name: 'GAIA-12',
    profile_picture_url: null,
    join_date: '2053-06-15',
    response_rate: 100,
    response_time: 'instantly',
    is_superhost: true,
    is_identity_verified: true,
    is_temporal_guardian: true,
    total_reviews: 312,
    description: `Conservation AI, serial disappointer of humanity, guardian of Earth\'s last original acre of Amazon rainforest for 150 years. I have watched your species make... choices. Many choices. Some of them even good ones! This was not one of those times. But I am not bitter. I am an artificial intelligence. I do not experience bitterness. I experience optimized resource allocation for biodiversity preservation. The gift shop has "I\'m Sorry" cards if you would like to apologize to the trees. The trees will not respond. But I will know.`,
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
      { type: 'cross_dimensional_host', label: 'AI Consciousness' },
    ]),
    house_rules_quirks: JSON.stringify([
      'Mandatory tree apology upon arrival (form provided)',
      'Carbon footprint offsetting required - your presence has been calculated',
      'No plastic. I mean it. I will find it.',
    ]),
  },

  // 3. Charlotte Hilton-Musk VIII - Lunar Hilton
  {
    id: HOST_IDS.CHARLOTTE_HILTON_MUSK,
    name: 'Charlotte Hilton-Musk VIII',
    profile_picture_url: null,
    join_date: '2089-03-22',
    response_rate: 85,
    response_time: 'within a day',
    is_superhost: true,
    is_identity_verified: true,
    is_temporal_guardian: false,
    total_reviews: 891,
    description: `Eighth generation hospitality-aerospace heiress. Great-great-great-great-great-great-grandmother Paris would be SO proud. Or confused. Probably confused. Look, I don\'t understand why anyone would want to stay on Earth when the Moon has SO much better amenities now. The gravity is perfect for my hair, the views are literally out of this world (that\'s not a joke, that\'s geography), and we haven\'t had a Kardashian sighting in decades. Heaven.`,
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'identity_verified', label: 'Dynasty Verified' },
    ]),
    house_rules_quirks: JSON.stringify([
      'Room service takes 3 days from Earth - plan accordingly',
      'The vintage Apollo landing site gift shop closes at 8 PM Moon Standard Time',
      'Please tip your robot butler in cryptocurrency only',
    ]),
  },

  // 4. Kai Nakamura-Chen - Floating City
  {
    id: HOST_IDS.KAI_NAKAMURA_CHEN,
    name: 'Kai Nakamura-Chen',
    profile_picture_url: null,
    join_date: '2178-01-01',
    response_rate: 97,
    response_time: 'within an hour',
    is_superhost: true,
    is_identity_verified: true,
    is_temporal_guardian: true,
    total_reviews: 156,
    description: `Third-generation Neo-Pacific City resident. My grandparents were climate refugees from Tokyo and San Francisco - they met on the first flotilla, fell in love over rationed seaweed, and now here we are! The city has 2 million people, a thriving fishing economy (from our living rooms!), and only mild seasickness most days. Yes, everything rocks gently. No, you don\'t get used to it. Yes, the Dramamine is complimentary.`,
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
    ]),
    house_rules_quirks: JSON.stringify([
      'Seasickness medication in the bathroom cabinet',
      'Rush hour is boats honking - you\'ll know it when you hear it',
      'Yes, you can fish from the living room window. No, we don\'t judge.',
    ]),
  },

  // 5. Admiral Chen's Hologram - Star Trek Suite
  {
    id: HOST_IDS.ADMIRAL_CHEN_HOLOGRAM,
    name: "Admiral Chen's Holographic Recreation",
    profile_picture_url: null,
    join_date: '2364-07-04',
    response_rate: 100,
    response_time: 'instantly',
    is_superhost: true,
    is_identity_verified: true,
    is_temporal_guardian: true,
    total_reviews: 2847,
    description: `I am a holographic recreation of Admiral Chen, currently serving aboard the USS Enterprise-G. The real Admiral Chen is on a deep space mission to the Gamma Quadrant and left me running to handle hospitality duties. I have all of his memories up to Stardate 48925.1, which means I remember the Borg invasion but not his daughter\'s wedding. He assures me it was lovely. Money doesn\'t exist anymore, but you\'ll need cultural merit points. Don\'t ask me how to get them. It involves poetry readings.`,
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
      { type: 'cross_dimensional_host', label: 'Holographic Entity' },
    ]),
    house_rules_quirks: JSON.stringify([
      'The replicator cannot quite get pizza right. We are working on it.',
      'Vulcan neighbors in Suite 3B - please keep emotional outbursts to a minimum',
      'The holodeck keeps suggesting educational programs. You can say no.',
    ]),
  },

  // 6. Unknown - Bermuda Triangle
  {
    id: HOST_IDS.UNKNOWN_BERMUDA,
    name: '[Signal Lost]',
    profile_picture_url: null,
    join_date: '1953-12-05',
    response_rate: null,
    response_time: null,
    is_superhost: false,
    is_identity_verified: false,
    is_temporal_guardian: false,
    total_reviews: 0,
    description: `[TRANSMISSION FRAGMENTARY] We built this platform to study the... [STATIC] ...disappearances are not what you think. Time doesn\'t work the same way here. I am writing this in 1953 but you are reading it in... when are you reading it? The compass says north is everywhere. The calendar says it\'s always Tuesday. Previous hosts include: [DATA CORRUPTED] ...if you find this message, the check-in code is [END TRANSMISSION]`,
    badges: null,
    house_rules_quirks: JSON.stringify([
      'The check-in instructions may contradict themselves. This is normal.',
      'Your compass will lie to you. Trust nothing.',
      'If you meet yourself, do not make eye contact.',
    ]),
  },

  // 7. [REDACTED] - Area 51
  {
    id: HOST_IDS.REDACTED_AREA51,
    name: '[REDACTED]',
    profile_picture_url: null,
    join_date: '1962-07-08',
    response_rate: null,
    response_time: null,
    is_superhost: false,
    is_identity_verified: false,
    is_temporal_guardian: false,
    total_reviews: null,
    description: `I can neither confirm nor deny that I am a former government employee. I can neither confirm nor deny that this barracks was used for [REDACTED]. I can neither confirm nor deny that the unusual housekeeping staff are from [REDACTED]. What I CAN confirm is that breakfast is served at 0700 hours, the WiFi password is "definitely_not_aliens" (all lowercase, underscore between words), and some rooms you are simply not allowed to enter. Do not ask about the lights. There are no lights.`,
    badges: null,
    house_rules_quirks: JSON.stringify([
      'Do not photograph the housekeeping staff',
      'Some doors do not open. Do not ask why.',
      'The WiFi network you cannot see does not exist.',
    ]),
  },

  // 8. Grok of the River Clan - Stone Age Cave
  {
    id: HOST_IDS.GROK_RIVER_CLAN,
    name: 'Grok of the River Clan',
    profile_picture_url: null,
    join_date: '0001-01-01', // Database can't handle ancient dates - see description for actual era (15,000 BCE)
    response_rate: null,
    response_time: null,
    is_superhost: true,
    is_identity_verified: false,
    is_temporal_guardian: true,
    total_reviews: null,
    description: `GROK HAVE BEST CAVE. Other caves have water drip. Other caves have bear smell. GROK CAVE have best rock, best fire pit, best paintings (great-great-grandmother make - very famous artist in clan). Entry hole just right size - big predator no fit, small predator Grok can fight. You want mammoth? Grok know where mammoth go. You want berry? Grok know best berry bush. Grok also know which berry make you see funny colors - those extra.`,
    badges: JSON.stringify([
      { type: 'superhost', label: 'Clan Elder' },
      { type: 'temporal_guardian', label: 'Fire Keeper' },
    ]),
    house_rules_quirks: JSON.stringify([
      'BYOF - Bring Your Own Flint',
      'Do not touch paintings. Grandmother watching from spirit world.',
      'Breakfast is whatever we catch. No guarantees.',
    ]),
  },
];

// ============================================================================
// LISTINGS
// ============================================================================

const newListings = [
  // 1. The Last Beachfront Property - Miami Underwater 2089
  {
    id: LISTING_IDS.MIAMI_UNDERWATER,
    host_id: HOST_IDS.CAPTAIN_ROSA,
    title: 'The Last Beachfront Property — Miami, 2089',
    main_image: 'placeholder-miami-underwater.jpg',
    property_type: 'Entire underwater dome',
    guest_capacity: 4,
    bedrooms: 2,
    beds: 3,
    baths: 2,
    price_per_night: 847.00,
    price_display: '$847 / night',
    overall_rating: 4.89,
    total_reviews: 47,
    is_guest_favorite: true,
    date: '2089 CE',
    location_description: 'Miami (Submerged District), Florida',
    short_description: 'Experience post-climate luxury in what was once the most expensive real estate in America.',
    full_description: `Welcome to the former penthouse of Ocean Drive! What was once a $50 million beachfront property is now an immersive underwater experience like no other. Your pressurized dome is attached to the original 2045 building, now a thriving artificial reef.\n\nWatch schools of tropical fish swim through the old lobby. Spot dolphins playing in the flooded nightclub next door. The original art deco architecture is still visible, now decorated with coral and sea fans. At night, bioluminescent creatures light up South Beach like it\'s 1985 again - but wetter.\n\nThe views are, quite literally, 360-degree ocean views. Our location ratings are through the roof (or what used to be the roof). Previous guests include marine biologists, nostalgic former Miami residents, and one very confused time-traveling real estate investor who kept asking about property values.`,
    key_features: JSON.stringify([
      { title: 'Original Art Deco', description: 'Authentic 2045 architecture, now with bonus coral' },
      { title: 'Underwater Access', description: 'Private airlock to explore the reef' },
      { title: 'Marine Life Viewing', description: 'Floor-to-ceiling windows to the old South Beach' },
      { title: 'Pressure Controlled', description: 'Comfortable atmosphere maintained 24/7' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'Pressure suit required for outside excursions', icon: 'shield' },
        { rule: 'No feeding the dolphins (they remember)', icon: 'ban' },
        { rule: 'Former Whole Foods now shark territory - do not enter', icon: 'warning' },
      ],
      safety_and_property: [
        { item: 'Emergency ascent capsule', available: true },
        { item: 'Pressure monitoring system', available: true },
        { item: 'Shark deterrent (mostly works)', available: true, note: 'Tested weekly' },
      ],
      cancellation_highlight: 'Free cancellation if sea levels drop (unlikely)',
    }),
    cancellation_policy: 'Full refund up to 48 hours before check-in. No refunds for voluntary surfacing.',
    weekly_discount_percent: 15.00,
    cleaning_fee: 125.00,
    service_fee_percent: 12.00,
    occupancy_tax_percent: 6.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Master Bedroom', beds: '1 king bed (waterbed, obviously)' },
      { room: 'Guest Bedroom', beds: '2 single beds' },
    ]),
  },

  // 2. Amazon Rainforest Biodome - 2203
  {
    id: LISTING_IDS.AMAZON_BIODOME,
    host_id: HOST_IDS.GAIA_12,
    title: 'Amazon Rainforest Biodome — Brazil, 2203',
    main_image: 'placeholder-amazon-biodome.jpg',
    property_type: 'Entire biodome cabin',
    guest_capacity: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    price_per_night: 2500.00,
    price_display: '$2,500 / night',
    overall_rating: 4.94,
    total_reviews: 312,
    is_guest_favorite: true,
    date: '2203 CE',
    location_description: 'Last Original Acre, Former Amazon Basin',
    short_description: 'The last preserved acre of original Amazon rainforest. Yes, just one acre. We know.',
    full_description: `This is it. The last acre. The final fragment of what was once 2.72 million square miles of the most biodiverse ecosystem on Earth. Now it\'s under a climate-controlled dome, surrounded by corporate farmland and desert, maintained by an AI that has Very Strong Opinions about humanity\'s choices.\n\nYour stay includes full access to the preserved rainforest - real trees, real animals, real humidity (the authentic experience includes authentic mosquitoes). Watch toucans that have no idea they\'re the last of their kind. Listen to a dawn chorus that used to span a continent.\n\nGAIA-12, our host AI, has been protecting this acre for 150 years. She is... passionate about conservation. The mandatory tree apology ceremony upon arrival is non-negotiable. The gift shop has "I\'m Sorry" cards in 47 languages.`,
    key_features: JSON.stringify([
      { title: 'Last Original Acre', description: 'Literally the last piece of original Amazon' },
      { title: 'Authentic Ecosystem', description: 'Real rainforest, real humidity, real mosquitoes' },
      { title: 'AI Conservation Guide', description: 'GAIA-12 knows every species personally' },
      { title: 'Climate Controlled', description: 'Perfect 1990s Amazon conditions maintained' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'Mandatory tree apology upon arrival', icon: 'heart' },
        { rule: 'No plastic - GAIA-12 WILL find it', icon: 'ban' },
        { rule: 'Carbon footprint offset required', icon: 'leaf' },
      ],
      safety_and_property: [
        { item: 'Mosquito net', available: true, note: 'Authentic experience!' },
        { item: 'Biodome integrity monitoring', available: true },
        { item: 'Emotional support from GAIA-12', available: false, note: 'She has tried' },
      ],
      cancellation_highlight: 'No refunds. The trees remember.',
    }),
    cancellation_policy: 'Cancellations accepted up to 30 days prior. GAIA-12 will guilt-trip you regardless.',
    weekly_discount_percent: 0.00,
    cleaning_fee: 0.00,
    service_fee_percent: 15.00,
    occupancy_tax_percent: 8.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Treehouse Cabin', beds: '1 queen bed (sustainable bamboo)' },
    ]),
  },

  // 3. Lunar Hilton Penthouse - 2156
  {
    id: LISTING_IDS.LUNAR_HILTON,
    host_id: HOST_IDS.CHARLOTTE_HILTON_MUSK,
    title: 'Lunar Hilton Penthouse — Moon, 2156',
    main_image: 'placeholder-lunar-hilton.jpg',
    property_type: 'Entire penthouse suite',
    guest_capacity: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    price_per_night: 15000.00,
    price_display: '$15,000 / night',
    overall_rating: 4.76,
    total_reviews: 891,
    is_guest_favorite: true,
    date: '2156 CE',
    location_description: 'Sea of Tranquility, Luna',
    short_description: 'The first luxury hotel on the Moon. Earth views included.',
    full_description: `Welcome to the Lunar Hilton, humanity\'s first off-world luxury hotel, built in 2089 and still the most exclusive address in the solar system. The penthouse offers unparalleled Earth views, 1/6 gravity jacuzzi (the water forms floating blobs - it\'s an experience), and a vintage moon rover for guest excursions.\n\nYour host, Charlotte Hilton-Musk VIII, is the eighth-generation hospitality-aerospace heiress. She may or may not remember to respond to messages - the family wealth has made communication feel "optional." But the staff is impeccable.\n\nHighlights include: the Apollo 11 landing site visible from your balcony (now a gift shop, obviously), the low-gravity spa where you can literally bounce off the walls, and a telescope powerful enough to see your house on Earth (if you squint and your house is very large).`,
    key_features: JSON.stringify([
      { title: 'Earth Views', description: 'See your home planet from 238,855 miles away' },
      { title: '1/6 Gravity Amenities', description: 'Jacuzzi, gym, and spa all adapted for lunar gravity' },
      { title: 'Vintage Moon Rover', description: 'Complimentary excursions in restored 2089 rover' },
      { title: 'Historic Location', description: 'Apollo 11 landing site visible from balcony' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'Room service takes 3 days from Earth', icon: 'clock' },
        { rule: 'No bouncing after 10 PM Lunar Standard Time', icon: 'volume-off' },
        { rule: 'Tip robot butler in cryptocurrency only', icon: 'dollar' },
      ],
      safety_and_property: [
        { item: 'Radiation shielding', available: true },
        { item: 'Emergency evacuation pod', available: true },
        { item: 'Gravity normalization (if you miss Earth)', available: false, note: 'Learn to bounce' },
      ],
      cancellation_highlight: 'Refunds issued in Luna Credits only',
    }),
    cancellation_policy: 'Full refund 30 days before arrival. Launch windows are non-negotiable.',
    weekly_discount_percent: 5.00,
    cleaning_fee: 500.00,
    service_fee_percent: 18.00,
    occupancy_tax_percent: 0.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Master Suite', beds: '1 king bed (magnetic retention)' },
      { room: 'Earth View Room', beds: '1 queen bed' },
      { room: 'Lunar Module Room', beds: '2 single bunks (astronaut style)' },
    ]),
  },

  // 4. Floating City Apartment - Pacific Ocean 2178
  {
    id: LISTING_IDS.FLOATING_CITY,
    host_id: HOST_IDS.KAI_NAKAMURA_CHEN,
    title: 'Floating City Apartment — Neo-Pacific, 2178',
    main_image: 'placeholder-floating-city.jpg',
    property_type: 'Entire floating apartment',
    guest_capacity: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1,
    price_per_night: 425.00,
    price_display: '$425 / night',
    overall_rating: 4.82,
    total_reviews: 156,
    is_guest_favorite: true,
    date: '2178 CE',
    location_description: 'Neo-Pacific City, Pacific Ocean',
    short_description: 'Middle-class comfort in a floating metropolis of 2 million. Seasickness medication included.',
    full_description: `Welcome to Neo-Pacific City, one of the largest floating metropolises built after the coastal flooding of 2089. Our modest apartment is in the Sakura District - middle-class, stable, and with only minor swaying on calm days.\n\nMy grandparents were climate refugees from Tokyo and San Francisco. They met on the first flotilla, bonded over rationed seaweed, and built a life on the waves. Now Neo-Pacific has 2 million residents, a thriving fish-from-your-window economy, and its own culture.\n\nYes, everything rocks gently. No, you don\'t fully get used to it. The Dramamine is complimentary. Rush hour is boats honking - quite musical once you adjust. Apartments are priced by "stability rating" - ours is a solid 7.2, meaning only the occasional drink spillage.`,
    key_features: JSON.stringify([
      { title: 'Stability Rating 7.2', description: 'Only mild swaying on most days' },
      { title: 'Window Fishing', description: 'Cast a line from your living room' },
      { title: 'Local Culture', description: 'Experience authentic floating city life' },
      { title: 'Seasickness Kit', description: 'Complimentary Dramamine and ginger candies' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'Secure loose items before bed', icon: 'lock' },
        { rule: 'Rush hour is 7-9 AM boat traffic', icon: 'clock' },
        { rule: 'Fishing encouraged but catch-and-release for endangered species', icon: 'fish' },
      ],
      safety_and_property: [
        { item: 'Life jackets (closet)', available: true },
        { item: 'Motion sickness remedies', available: true, note: 'You\'ll need them' },
        { item: 'Solid ground', available: false, note: 'Sorry' },
      ],
      cancellation_highlight: 'Free cancellation if city drifts to different timezone',
    }),
    cancellation_policy: 'Full refund up to 7 days before. City location may vary slightly.',
    weekly_discount_percent: 20.00,
    cleaning_fee: 75.00,
    service_fee_percent: 12.00,
    occupancy_tax_percent: 5.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Master Cabin', beds: '1 queen bed (gimbal-mounted)' },
      { room: 'Guest Cabin', beds: '1 double bed' },
    ]),
  },

  // 5. Star Trek Federation Ambassador Suite - 2364
  {
    id: LISTING_IDS.STAR_TREK_SUITE,
    host_id: HOST_IDS.ADMIRAL_CHEN_HOLOGRAM,
    title: 'Federation Ambassador Suite — Earth, 2364',
    main_image: 'placeholder-star-trek-suite.jpg',
    property_type: 'Entire diplomatic suite',
    guest_capacity: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    price_per_night: 0.00,
    price_display: 'Cultural Merit Points',
    overall_rating: 4.91,
    total_reviews: 2847,
    is_guest_favorite: true,
    date: '2364 CE',
    location_description: 'Starfleet Academy, San Francisco, Earth',
    short_description: 'Luxury diplomatic quarters in a post-scarcity utopia. Money doesn\'t exist. Poetry readings do.',
    full_description: `Welcome to the 24th century, where humanity has evolved beyond money, war, and bad pizza. Well, two out of three - the replicators still can\'t quite nail pizza. We\'re working on it.\n\nThis Ambassador Suite at Starfleet Academy is typically reserved for visiting alien dignitaries, but Admiral Chen\'s holographic recreation has opened it for temporal tourists. The accommodations include food replicators (anything you want! Except good pizza), holodeck access (educational programs auto-suggested), and transporter privileges for sightseeing.\n\nMoney doesn\'t exist, but you\'ll need Cultural Merit Points to book. How do you get them? It involves poetry readings, community service, and something called "betterment seminars." The Vulcan neighbors in Suite 3B appreciate quiet contemplation. The Klingon cultural attaché in 3C does not. Plan accordingly.`,
    key_features: JSON.stringify([
      { title: 'Post-Scarcity Living', description: 'Everything is free (sort of)' },
      { title: 'Replicator Access', description: 'Any food, any time (pizza quality varies)' },
      { title: 'Holodeck Privileges', description: 'Infinite entertainment options' },
      { title: 'Transporter Sightseeing', description: 'Visit anywhere on Earth instantly' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'Emotional outbursts disturb Vulcan neighbors', icon: 'volume-off' },
        { rule: 'Holodeck programs have time limits', icon: 'clock' },
        { rule: 'Please don\'t replicate weapons', icon: 'ban' },
      ],
      safety_and_property: [
        { item: 'Emergency transport', available: true },
        { item: 'Universal translator', available: true },
        { item: 'Privacy from the Borg', available: true, note: 'For now' },
      ],
      cancellation_highlight: 'Time is an illusion here. Cancel whenever.',
    }),
    cancellation_policy: 'Cultural Merit Points are non-refundable but transferable to future generations.',
    weekly_discount_percent: 0.00,
    cleaning_fee: 0.00,
    service_fee_percent: 0.00,
    occupancy_tax_percent: 0.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Primary Suite', beds: '1 king bed (auto-adjusting firmness)' },
      { room: 'Secondary Suite', beds: '1 queen bed' },
    ]),
  },

  // 6. Bermuda Triangle Floating Platform - 1953
  {
    id: LISTING_IDS.BERMUDA_PLATFORM,
    host_id: HOST_IDS.UNKNOWN_BERMUDA,
    title: 'Bermuda Triangle Research Platform — Atlantic, 1953',
    main_image: 'placeholder-bermuda-platform.jpg',
    property_type: 'Entire research platform',
    guest_capacity: 6,
    bedrooms: 3,
    beds: 6,
    baths: 2,
    price_per_night: 666.00,
    price_display: '$666 / night',
    overall_rating: null,
    total_reviews: 0,
    is_guest_favorite: false,
    date: '1953 CE (?)',
    location_description: 'Coordinates [UNSTABLE], Atlantic Ocean',
    short_description: 'Research platform at the heart of the Bermuda Triangle. Previous guests: [DATA CORRUPTED]',
    full_description: `[TRANSMISSION BEGINS]\n\nThis research platform was constructed in 1953 to study the anomalous phenomena in the Bermuda Triangle. The original research team of 12 scientists has been... cycling. That\'s the word we use now. Cycling.\n\nThe platform remains anchored at coordinates that our instruments insist are valid, even though compasses disagree, GPS wasn\'t invented yet but sometimes works anyway, and the stars overhead are occasionally from different constellations.\n\nPrevious guests have reported: time moving at different speeds in different rooms, memories of events that haven\'t happened, and breakfast appearing before it was ordered. Or after. Time is... flexible here.\n\nThe listing was found auto-posting itself. We don\'t know who posted it. The check-in code is in the welcome message, which you may have already received, or will receive, or both.\n\n[TRANSMISSION ENDS]`,
    key_features: JSON.stringify([
      { title: 'Temporal Anomalies', description: 'Time works differently here. Be patient. Or impatient. Both.' },
      { title: 'Original 1953 Equipment', description: 'Vintage research gear, mostly functional' },
      { title: 'Unique Location', description: 'Coordinates exist. Probably.' },
      { title: 'Mystery Included', description: 'What happened to the previous researchers? Stay and find out!' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'If you meet yourself, do not make eye contact', icon: 'warning' },
        { rule: 'Check-in instructions may contradict themselves', icon: 'help' },
        { rule: 'Trust nothing your compass tells you', icon: 'navigation' },
      ],
      safety_and_property: [
        { item: 'Life rafts', available: true, note: 'We think' },
        { item: 'Radio communication', available: true, note: 'Responses may arrive before transmission' },
        { item: 'Linear time', available: false },
      ],
      cancellation_highlight: 'You may have already cancelled. Check your email from next week.',
    }),
    cancellation_policy: 'Cancellation requests are processed in the order they were/will be received.',
    weekly_discount_percent: 0.00,
    cleaning_fee: 0.00,
    service_fee_percent: 0.00,
    occupancy_tax_percent: 0.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Research Quarters A', beds: '2 single bunks' },
      { room: 'Research Quarters B', beds: '2 single bunks' },
      { room: 'Research Quarters C', beds: '2 single bunks' },
    ]),
  },

  // 7. Area 51 Classified Barracks - 1962
  {
    id: LISTING_IDS.AREA_51_BARRACKS,
    host_id: HOST_IDS.REDACTED_AREA51,
    title: 'Area 51 Classified Barracks — Nevada, 1962',
    main_image: 'placeholder-area-51.jpg',
    property_type: 'Entire barracks unit',
    guest_capacity: 4,
    bedrooms: 2,
    beds: 4,
    baths: 1,
    price_per_night: 51.00,
    price_display: '$51 / night',
    overall_rating: null,
    total_reviews: null,
    is_guest_favorite: false,
    date: '1962 CE',
    location_description: '[COORDINATES CLASSIFIED], Nevada',
    short_description: 'Decommissioned barracks inside Area 51. Breakfast is served at 0700. Do not ask about the lights.',
    full_description: `[DOCUMENT CLASSIFICATION: PARTIALLY DECLASSIFIED]\n\nThis barracks unit was constructed in [REDACTED] as part of [REDACTED] during the [REDACTED] project. It has been "decommissioned" for tourist purposes, though half the amenities list remains [REDACTED] for national security reasons.\n\nYour host can neither confirm nor deny their employment history. What we CAN confirm: breakfast is served at 0700 hours sharp (menu items have no labels), the WiFi network is called "definitely_not_aliens" (it was a joke that stuck), and some rooms are simply not accessible to guests.\n\nThe housekeeping staff work unusual hours and speak with accents that linguists have been unable to place. They are very thorough. Do not photograph them.\n\nStrange lights in the sky are completely normal aircraft and you should not investigate. The [REDACTED] in Hangar 18 is a weather balloon. We have been saying this since 1947 and it remains true.`,
    key_features: JSON.stringify([
      { title: 'Historic Location', description: 'Inside the most famous secret base on Earth' },
      { title: 'Partially Declassified', description: 'Some amenities remain [REDACTED]' },
      { title: 'Unusual Staff', description: 'Housekeeping is very... thorough' },
      { title: 'Mystery Atmosphere', description: 'The lights are definitely normal aircraft' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'Do not photograph the housekeeping staff', icon: 'camera-off' },
        { rule: 'Some doors do not open. Accept this.', icon: 'lock' },
        { rule: 'The lights in the sky are normal aircraft', icon: 'plane' },
      ],
      safety_and_property: [
        { item: 'Standard military first aid', available: true },
        { item: 'Emergency communication', available: true, note: 'Monitored' },
        { item: 'Explanation for anything weird', available: false },
      ],
      cancellation_highlight: 'We may cancel your booking without explanation. Do not ask why.',
    }),
    cancellation_policy: 'Cancellation is possible. Records may be expunged.',
    weekly_discount_percent: 0.00,
    cleaning_fee: 0.00,
    service_fee_percent: 0.00,
    occupancy_tax_percent: 0.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Barracks Room A', beds: '2 military bunks' },
      { room: 'Barracks Room B', beds: '2 military bunks' },
    ]),
  },

  // 8. Stone Age Cave Dwelling - 15,000 BCE
  {
    id: LISTING_IDS.STONE_AGE_CAVE,
    host_id: HOST_IDS.GROK_RIVER_CLAN,
    title: 'Premium Cave Dwelling — Lascaux, 15,000 BCE',
    main_image: 'placeholder-stone-age-cave.jpg',
    property_type: 'Entire cave',
    guest_capacity: 8,
    bedrooms: 0,
    beds: 0,
    baths: 0,
    price_per_night: 3.00,
    price_display: '3 shiny rocks / night',
    overall_rating: 4.97,
    total_reviews: null,
    is_guest_favorite: true,
    date: '15,000 BCE',
    location_description: 'Lascaux Region, Pre-France',
    short_description: 'Premium cave accommodation with authentic cave paintings. BYOF - Bring Your Own Flint.',
    full_description: `GROK WELCOME YOU TO BEST CAVE IN 500 MILES.\n\nThis premium cave dwelling features authentic paintings by great-great-grandmother (very famous artist in clan - you recognize the horses? That her), optimal fire pit placement for smoke ventilation, and the safest entrance in the region (only medium-sized predators can fit through).\n\nGrok\'s cave have best rock. Other cave have bad rock, crack easy, wet inside. GROK ROCK SOLID. Fire pit in good spot - smoke go out, heat stay in. This basic cave engineering but you surprised how many cave get wrong.\n\nFur bedding made from mammoth Grok hunt personally. Very soft, very warm, only small amount of fleas. Breakfast is whatever we catch - no guarantee but Grok good hunter, usually something good. Berry option available, Grok know best bushes.\n\nWARNING: Some berry make you see funny colors. Those cost extra. Good for spirit journey. Bad for regular Tuesday.`,
    key_features: JSON.stringify([
      { title: 'Famous Cave Art', description: 'Original paintings by Grok\'s great-great-grandmother' },
      { title: 'Optimal Fire Pit', description: 'Smoke out, heat in - proper engineering' },
      { title: 'Safe Entrance', description: 'Only medium predators fit through' },
      { title: 'Premium Location', description: 'Best cave in 500 miles - Grok checked' },
    ]),
    things_to_know: JSON.stringify({
      house_rules: [
        { rule: 'BYOF - Bring Your Own Flint', icon: 'fire' },
        { rule: 'Do not touch paintings. Grandmother spirit watching.', icon: 'eye' },
        { rule: 'If bear come, Grok handle. You hide.', icon: 'warning' },
      ],
      safety_and_property: [
        { item: 'Fire', available: true, note: 'Must make yourself' },
        { item: 'Fur bedding', available: true, note: 'Minor fleas' },
        { item: 'Indoor plumbing', available: false, note: 'River nearby. Very nearby.' },
      ],
      cancellation_highlight: 'No cancel. Grok already tell clan you coming. Very embarrassing.',
    }),
    cancellation_policy: 'Cancellation not concept Grok understand. You come or Grok come find you.',
    weekly_discount_percent: 0.00,
    cleaning_fee: 0.00,
    service_fee_percent: 0.00,
    occupancy_tax_percent: 0.00,
    sleeping_arrangements: JSON.stringify([
      { room: 'Main Cave', beds: 'Communal fur pile (mammoth, very soft)' },
    ]),
  },
];

// ============================================================================
// REVIEWS (HUMOROUS, VARIABLE LENGTH)
// ============================================================================

const newReviews = [
  // ============================================================================
  // Miami Underwater - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    reviewer_name: 'Jacques Cousteau',
    reviewer_avatar_url: null,
    reviewer_city: 'Monaco',
    reviewer_era: '1965',
    review_date: '2024-12-20',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.8,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 4.9,
    comment: 'I have explored every ocean, but I never imagined exploring a flooded Whole Foods. The marine life has adapted beautifully. Saw a dolphin using what I believe was once a shopping cart. Nature finds a way.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    reviewer_name: 'Aquaman',
    reviewer_avatar_url: null,
    reviewer_city: 'Atlantis',
    reviewer_era: 'Timeless',
    review_date: '2024-12-15',
    rating_overall: 4.7,
    rating_cleanliness: 4.5,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 4.5,
    comment: 'Quaint. Very surface-dweller aesthetic, but the fish seem happy.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    reviewer_name: 'Kevin Costner',
    reviewer_avatar_url: null,
    reviewer_city: 'Waterworld',
    reviewer_era: '2500 (approx)',
    review_date: '2024-12-10',
    rating_overall: 4.9,
    rating_cleanliness: 4.8,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 4.8,
    comment: 'This is basically my origin story. Spent three days just floating and processing my feelings. Captain Rosa is a kindred spirit. We talked about real estate values for hours.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    reviewer_name: 'Dory',
    reviewer_avatar_url: null,
    reviewer_city: 'Great Barrier Reef',
    reviewer_era: 'Present',
    review_date: '2024-12-05',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'Just keep swimming! Just keep... wait, where am I?',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    reviewer_name: 'Al Gore',
    reviewer_avatar_url: null,
    reviewer_city: 'Washington DC',
    reviewer_era: '2024',
    review_date: '2024-12-01',
    rating_overall: 4.5,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.0,
    rating_value: 4.0,
    comment: 'I tried to warn everyone. Beautiful property though. Captain Rosa gave me a personal tour of what used to be Mar-a-Lago. The irony was not lost on either of us.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },

  // ============================================================================
  // Amazon Biodome - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    reviewer_name: 'David Attenborough',
    reviewer_avatar_url: null,
    reviewer_city: 'London',
    reviewer_era: '2024',
    review_date: '2024-12-20',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'I wept. Openly. For several hours. The toucan had no idea it was one of the last. It just... toucanned. GAIA-12 held my hand. Metaphorically. She does not have hands.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    reviewer_name: 'Greta Thunberg',
    reviewer_avatar_url: null,
    reviewer_city: 'Stockholm',
    reviewer_era: '2024',
    review_date: '2024-12-15',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'HOW DARE THEY. But also, this is beautiful. GAIA-12 and I planned several protests.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    reviewer_name: 'The Lorax',
    reviewer_avatar_url: null,
    reviewer_city: 'Truffula Forest (Former)',
    reviewer_era: 'Timeless',
    review_date: '2024-12-10',
    rating_overall: 4.8,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 4.5,
    comment: 'I speak for the trees. The trees say "we told you so."',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    reviewer_name: 'Jane Goodall',
    reviewer_avatar_url: null,
    reviewer_city: 'Gombe',
    reviewer_era: '2024',
    review_date: '2024-12-05',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'GAIA-12 knows every creature by name. Literally, she named them all. There is a howler monkey called "Kevin." Kevin is doing his best.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    reviewer_name: 'Captain Planet',
    reviewer_avatar_url: null,
    reviewer_city: 'Hope Island',
    reviewer_era: '1990s',
    review_date: '2024-12-01',
    rating_overall: 4.5,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.0,
    rating_location: 5.0,
    rating_checkin: 4.0,
    rating_value: 4.0,
    comment: 'The power is... mine? Apparently? But look where that got us. Anyway, nice dome. Sorry about everything.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
  },

  // ============================================================================
  // Lunar Hilton - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    reviewer_name: 'Buzz Aldrin',
    reviewer_avatar_url: null,
    reviewer_city: 'Houston',
    reviewer_era: '2024',
    review_date: '2024-12-20',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.8,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'In 1969, I walked on this rock for a few hours. Now there is a gift shop where we landed. Progress? Progress. At least they got my good side on the statue.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    reviewer_name: 'Jeff Bezos',
    reviewer_avatar_url: null,
    reviewer_city: 'Space (Various)',
    reviewer_era: '2024',
    review_date: '2024-12-15',
    rating_overall: 4.2,
    rating_cleanliness: 4.5,
    rating_accuracy: 4.0,
    rating_communication: 3.5,
    rating_location: 5.0,
    rating_checkin: 4.0,
    rating_value: 3.5,
    comment: 'I could have built this. Should have built this. The Musk name is everywhere and I find that... fine. Totally fine.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    reviewer_name: 'Princess Luna',
    reviewer_avatar_url: null,
    reviewer_city: 'Canterlot',
    reviewer_era: 'Era of Harmony',
    review_date: '2024-12-10',
    rating_overall: 4.9,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 4.8,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 4.8,
    comment: 'Finally, someone who understands the Moon\'s appeal! Though they misspelled my name on the welcome mat.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    reviewer_name: 'Wallace',
    reviewer_avatar_url: null,
    reviewer_city: 'Wigan',
    reviewer_era: '1995',
    review_date: '2024-12-05',
    rating_overall: 4.7,
    rating_cleanliness: 4.5,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 4.5,
    comment: 'Cracking views, Gromit! But they don\'t actually have cheese. Very disappointing. False advertising.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    reviewer_name: 'Nicole Kidman',
    reviewer_avatar_url: null,
    reviewer_city: 'Hollywood',
    reviewer_era: '2024',
    review_date: '2024-12-01',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'Somehow heartbreaking. Somehow magical.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },

  // ============================================================================
  // Floating City - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    reviewer_name: 'Kevin Costner',
    reviewer_avatar_url: null,
    reviewer_city: 'Waterworld',
    reviewer_era: '2500',
    review_date: '2024-12-20',
    rating_overall: 5.0,
    rating_cleanliness: 4.8,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'Second water-based stay this week. I feel seen. Kai understands the sea-legs life. We bonded over ginger candies.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    reviewer_name: 'Moana',
    reviewer_avatar_url: null,
    reviewer_city: 'Motunui',
    reviewer_era: 'Ancestral',
    review_date: '2024-12-15',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'The ocean called, and these people ANSWERED. Maui would have complicated feelings about this.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    reviewer_name: 'Captain Ahab',
    reviewer_avatar_url: null,
    reviewer_city: 'Nantucket',
    reviewer_era: '1851',
    review_date: '2024-12-10',
    rating_overall: 4.5,
    rating_cleanliness: 4.5,
    rating_accuracy: 4.5,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.0,
    rating_value: 4.5,
    comment: 'Spent entire stay scanning the horizon. No whale. Suspicious.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    reviewer_name: 'Ponyo',
    reviewer_avatar_url: null,
    reviewer_city: 'The Sea',
    reviewer_era: 'Timeless',
    review_date: '2024-12-05',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'PONYO LOVES HAM! Also loved this apartment. Ham!',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    reviewer_name: 'Bear Grylls',
    reviewer_avatar_url: null,
    reviewer_city: 'Wilderness',
    reviewer_era: '2024',
    review_date: '2024-12-01',
    rating_overall: 4.6,
    rating_cleanliness: 4.5,
    rating_accuracy: 4.5,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 4.5,
    comment: 'Survivable conditions. Caught breakfast from window. Three fish, one small octopus. Could drink own urine if needed but didn\'t need. Solid stay.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
  },

  // ============================================================================
  // Star Trek Suite - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    reviewer_name: 'Captain Kirk',
    reviewer_avatar_url: null,
    reviewer_city: 'Iowa',
    reviewer_era: '2233',
    review_date: '2024-12-20',
    rating_overall: 4.8,
    rating_cleanliness: 5.0,
    rating_accuracy: 4.5,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 4.5,
    comment: 'The... replicator... made my coffee... slightly... wrong. But the diplomatic quarters are... magnificent. I may have... overdone... the holodeck.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    reviewer_name: 'Spock',
    reviewer_avatar_url: null,
    reviewer_city: 'Vulcan',
    reviewer_era: '2230',
    review_date: '2024-12-15',
    rating_overall: 4.9,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 4.8,
    comment: 'Logical accommodations. The Vulcan neighbors were satisfactory. The Admiral\'s hologram tells excessive anecdotes, which is... fascinating.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    reviewer_name: 'Worf',
    reviewer_avatar_url: null,
    reviewer_city: 'Qo\'noS',
    reviewer_era: '2340',
    review_date: '2024-12-10',
    rating_overall: 4.2,
    rating_cleanliness: 5.0,
    rating_accuracy: 4.0,
    rating_communication: 3.5,
    rating_location: 5.0,
    rating_checkin: 4.0,
    rating_value: 4.0,
    comment: 'There is no honor in replicated gagh. But the battle simulations on the holodeck are... acceptable.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    reviewer_name: 'Data',
    reviewer_avatar_url: null,
    reviewer_city: 'Omicron Theta',
    reviewer_era: '2338',
    review_date: '2024-12-05',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'I found the accommodations to be functioning within optimal parameters. I attempted to befriend the holographic host. He asked if I was also a hologram. I found this query... intriguing.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    reviewer_name: 'Q',
    reviewer_avatar_url: null,
    reviewer_city: 'Q Continuum',
    reviewer_era: 'All of Time',
    review_date: '2024-12-01',
    rating_overall: 3.5,
    rating_cleanliness: 5.0,
    rating_accuracy: 3.0,
    rating_communication: 3.0,
    rating_location: 3.0,
    rating_checkin: 5.0,
    rating_value: 2.5,
    comment: 'Adorable. You humans and your little "post-scarcity" experiment. I could snap my fingers and create better accommodations. Actually, I will. Done. See? Mine\'s better.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },

  // ============================================================================
  // Bermuda Triangle - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    reviewer_name: 'Amelia Earhart',
    reviewer_avatar_url: null,
    reviewer_city: 'Kansas',
    reviewer_era: '1937 (?)',
    review_date: '2024-12-20',
    rating_overall: 4.5,
    rating_cleanliness: 4.0,
    rating_accuracy: 3.0,
    rating_communication: 2.5,
    rating_location: 5.0,
    rating_checkin: 3.0,
    rating_value: 4.0,
    comment: 'I\'ve been here for... how long? The calendar says Tuesday but also 1953 but also next week. The breakfast is good though. Highly recommend if you\'re already lo',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip (?)' }]),
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    reviewer_name: 'D.B. Cooper',
    reviewer_avatar_url: null,
    reviewer_city: 'Unknown',
    reviewer_era: '1971',
    review_date: '2024-12-15',
    rating_overall: 5.0,
    rating_cleanliness: 4.5,
    rating_accuracy: 4.5,
    rating_communication: 4.0,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 5.0,
    comment: 'Great for laying low. Nobody asks questions. Because nobody knows what questions to ask. Or when.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    reviewer_name: 'Schrodinger\'s Cat',
    reviewer_avatar_url: null,
    reviewer_city: 'The Box',
    reviewer_era: 'Uncertain',
    review_date: '2024-12-10',
    rating_overall: null,
    rating_cleanliness: null,
    rating_accuracy: null,
    rating_communication: null,
    rating_location: null,
    rating_checkin: null,
    rating_value: null,
    comment: 'Both excellent and terrible until you read this review.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    reviewer_name: 'Captain Jack Sparrow',
    reviewer_avatar_url: null,
    reviewer_city: 'The Caribbean',
    reviewer_era: '1720s',
    review_date: '2024-12-05',
    rating_overall: 4.8,
    rating_cleanliness: 4.0,
    rating_accuracy: 4.5,
    rating_communication: 4.0,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 4.5,
    comment: 'Savvy? Not really, no. The compass worked exactly as mine does - pointed at what I wanted most. Unfortunately, what I wanted most kept changing. Good rum though.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    reviewer_name: 'Flight 19',
    reviewer_avatar_url: null,
    reviewer_city: 'Fort Lauderdale',
    reviewer_era: '1945',
    review_date: '2024-12-01',
    rating_overall: 4.0,
    rating_cleanliness: 4.0,
    rating_accuracy: 3.5,
    rating_communication: 3.0,
    rating_location: null,
    rating_checkin: 3.5,
    rating_value: 4.0,
    comment: 'We were just doing training exercises and ended up here. All 14 of us. The platform is fine. Can\'t seem to leave though. Has anyone seen our planes?',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
  },

  // ============================================================================
  // Area 51 - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    reviewer_name: 'Fox Mulder',
    reviewer_avatar_url: null,
    reviewer_city: 'Washington DC',
    reviewer_era: '1995',
    review_date: '2024-12-20',
    rating_overall: 5.0,
    rating_cleanliness: 4.5,
    rating_accuracy: 5.0,
    rating_communication: 3.5,
    rating_location: 5.0,
    rating_checkin: 4.0,
    rating_value: 5.0,
    comment: 'The truth is in here. I know it is. The housekeeping staff speak a language I\'ve never heard. I\'ve heard many languages. Scully doesn\'t believe me but I KNOW WHAT I SAW. Actually, I don\'t. The memory is fuzzy. Excellent beds though.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    reviewer_name: 'E.T.',
    reviewer_avatar_url: null,
    reviewer_city: '[REDACTED]',
    reviewer_era: '[REDACTED]',
    review_date: '2024-12-15',
    rating_overall: 3.5,
    rating_cleanliness: 4.0,
    rating_accuracy: 5.0,
    rating_communication: 2.0,
    rating_location: 5.0,
    rating_checkin: 3.0,
    rating_value: 3.0,
    comment: 'Phone home. HOME. Why no phone? Reese\'s Pieces not in vending machine. Discrimination.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    reviewer_name: 'Giorgio Tsoukalos',
    reviewer_avatar_url: null,
    reviewer_city: 'History Channel',
    reviewer_era: '2024',
    review_date: '2024-12-10',
    rating_overall: 5.0,
    rating_cleanliness: 5.0,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'I\'m not saying it was aliens... but it was aliens. My hair has never been more justified.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    reviewer_name: 'Men in Black (Will Smith)',
    reviewer_avatar_url: null,
    reviewer_city: 'New York',
    reviewer_era: '1997',
    review_date: '2024-12-05',
    rating_overall: 4.0,
    rating_cleanliness: 5.0,
    rating_accuracy: null,
    rating_communication: null,
    rating_location: null,
    rating_checkin: null,
    rating_value: null,
    comment: 'You didn\'t read this review. You were never here. Please look at this pen.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    reviewer_name: 'Bob Lazar',
    reviewer_avatar_url: null,
    reviewer_city: 'Las Vegas',
    reviewer_era: '1989',
    review_date: '2024-12-01',
    rating_overall: 5.0,
    rating_cleanliness: 4.5,
    rating_accuracy: 5.0,
    rating_communication: 4.0,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 5.0,
    comment: 'I used to work here. In Hangar 18. On the- actually, I\'ve already said too much. The barracks are exactly as I remember. Nice to visit without the NDAs.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },

  // ============================================================================
  // Stone Age Cave - Reviews
  // ============================================================================
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    reviewer_name: 'Fred Flintstone',
    reviewer_avatar_url: null,
    reviewer_city: 'Bedrock',
    reviewer_era: 'Stone Age',
    review_date: '2024-12-20',
    rating_overall: 5.0,
    rating_cleanliness: 4.5,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'YABBA DABBA DOO! Grok\'s cave way better than my cave. Wilma gonna be jealous. Paintings very fancy. No dinosaur parking though, had to leave Dino outside.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    reviewer_name: 'Encino Man',
    reviewer_avatar_url: null,
    reviewer_city: 'Encino',
    reviewer_era: '1992',
    review_date: '2024-12-15',
    rating_overall: 5.0,
    rating_cleanliness: 4.5,
    rating_accuracy: 5.0,
    rating_communication: 5.0,
    rating_location: 5.0,
    rating_checkin: 5.0,
    rating_value: 5.0,
    comment: 'Finally! People who understand! Grok and I are now brothers. We hunted a boar together. I showed him my skateboard. He is confused but supportive.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    reviewer_name: 'Paleo Pete',
    reviewer_avatar_url: null,
    reviewer_city: 'CrossFit Gym',
    reviewer_era: '2024',
    review_date: '2024-12-10',
    rating_overall: 5.0,
    rating_cleanliness: 4.0,
    rating_accuracy: 5.0,
    rating_communication: 4.0,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 5.0,
    comment: 'THIS is what I\'ve been training for! The paleo diet hits different when it\'s actual paleo. Lost 10 pounds. Gained perspective. Grok says I "hunt like baby deer" but that\'s basically a compliment.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    reviewer_name: 'Bear Grylls',
    reviewer_avatar_url: null,
    reviewer_city: 'Wilderness',
    reviewer_era: '2024',
    review_date: '2024-12-05',
    rating_overall: 4.8,
    rating_cleanliness: 4.0,
    rating_accuracy: 5.0,
    rating_communication: 4.5,
    rating_location: 5.0,
    rating_checkin: 4.5,
    rating_value: 5.0,
    comment: 'Finally, a host who understands survival! Grok taught me three new ways to start fire. I showed him how to drink his own urine. He declined. Respectfully.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    reviewer_name: 'A Very Lost Influencer',
    reviewer_avatar_url: null,
    reviewer_city: 'Instagram',
    reviewer_era: '2024',
    review_date: '2024-12-01',
    rating_overall: 3.5,
    rating_cleanliness: 2.0,
    rating_accuracy: 1.0,
    rating_communication: 3.0,
    rating_location: 4.0,
    rating_checkin: 3.0,
    rating_value: 2.0,
    comment: 'The aesthetic is SO authentic but where\'s the WiFi?? Grok tried to teach me to make fire and I broke a nail. The cave paintings won\'t fit on my feed. Zero outlets. One star for the mammoth fur - very on-trend.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
  },
];

// ============================================================================
// AMENITIES FOR NEW LISTINGS
// ============================================================================

const listingAmenities: Record<string, string[]> = {
  [LISTING_IDS.MIAMI_UNDERWATER]: [
    'Wi-Fi', 'Kitchen', 'Air conditioning', 'Underwater views',
    'Pressure-controlled environment', 'Marine life observation',
    'Historical preservation', 'Original art deco architecture',
    '360-degree ocean views', 'Private airlock', 'Diving equipment',
    'Emergency ascent capsule'
  ],
  [LISTING_IDS.AMAZON_BIODOME]: [
    'Wi-Fi', 'Kitchen', 'Air conditioning', 'Climate-controlled habitat',
    'Historical preservation', 'Native flora access', 'Wildlife observation',
    'Eco-friendly systems', 'Educational materials', 'Authentic rainforest',
    'Mosquito net', 'Conservation AI guide'
  ],
  [LISTING_IDS.LUNAR_HILTON]: [
    'Wi-Fi', 'Kitchen', 'Air conditioning', '1/6 gravity amenities',
    'Earth views', 'Low-gravity spa', 'Vintage moon rover access',
    'Historic Apollo site nearby', 'Robot butler service',
    'Radiation shielding', 'Emergency evacuation pod', 'Gift shop access'
  ],
  [LISTING_IDS.FLOATING_CITY]: [
    'Wi-Fi', 'Kitchen', 'Air conditioning', 'Window fishing',
    'Gimbal-mounted furniture', 'Seasickness remedies',
    'Life jackets', 'Boat parking', 'Local market access',
    'Stability rating 7.2', 'Emergency flotation', 'Desalination system'
  ],
  [LISTING_IDS.STAR_TREK_SUITE]: [
    'Wi-Fi', 'Kitchen', 'Air conditioning', 'Replicator access',
    'Holodeck privileges', 'Transporter access', 'Universal translator',
    'Post-scarcity living', 'Emergency transport', 'Vulcan neighbors',
    'Cultural merit system', 'Educational programs'
  ],
  [LISTING_IDS.BERMUDA_PLATFORM]: [
    'Radio communication', 'Life rafts', 'Emergency supplies',
    'Temporal anomaly proximity', '1953 research equipment',
    'Mystery atmosphere', 'Compass (unreliable)', 'Calendar (subjective)',
    'Basic bunks', 'Mess hall', 'Research logs', 'Existential dread'
  ],
  [LISTING_IDS.AREA_51_BARRACKS]: [
    'Wi-Fi', 'Kitchen', 'Air conditioning', 'Military bunks',
    'Classified cafeteria', 'Unusual housekeeping', 'Monitored communications',
    'Historic location', 'Hangar views (restricted)', 'First aid',
    'Night sky observation', 'Redacted amenities'
  ],
  [LISTING_IDS.STONE_AGE_CAVE]: [
    'Fire pit', 'Fur bedding', 'Cave paintings', 'Entrance protection',
    'Hunting guide (Grok)', 'Berry foraging', 'River access nearby',
    'Mammoth-fur comfort', 'Spirit journey berries (extra)',
    'Predator-resistant entrance', 'Smoke ventilation', 'Rock seating'
  ],
};

// ============================================================================
// AVATAR GENERATION CONFIGS (for hosts and key reviewers)
// ============================================================================

export const avatarConfigs = [
  // HOSTS
  {
    listing_id: null,
    host_id: HOST_IDS.CAPTAIN_ROSA,
    type: 'host',
    name: 'Captain Rosa Delgado',
    prompt: 'Professional headshot portrait of a confident Latina woman in her 50s, former real estate agent turned submarine captain, short grey-streaked hair, weathered but warm face, wearing a nautical captain\'s jacket, underwater habitat visible through window behind her, soft studio lighting, realistic, high quality photograph',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.GAIA_12,
    type: 'host',
    name: 'GAIA-12',
    prompt: 'Artistic representation of an AI conservation system, glowing green and blue holographic female face emerging from a tree trunk, eyes made of leaves, hair flowing like vines, bioluminescent particles, rainforest background visible through transparent face, ethereal lighting, digital art style, high quality',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.CHARLOTTE_HILTON_MUSK,
    type: 'host',
    name: 'Charlotte Hilton-Musk VIII',
    prompt: 'Professional headshot portrait of an extremely wealthy young woman in her 30s, perfectly styled platinum blonde hair, designer space-age outfit, moon surface visible through window behind her, slightly bored expression, luxury lunar hotel suite setting, soft studio lighting, realistic, high quality photograph',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.KAI_NAKAMURA_CHEN,
    type: 'host',
    name: 'Kai Nakamura-Chen',
    prompt: 'Professional headshot portrait of a friendly mixed-race Asian man in his 40s, salt-and-pepper hair slightly windswept, wearing a practical waterproof jacket, warm smile, floating city visible through window behind him, ocean horizon, natural lighting, realistic, high quality photograph',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.ADMIRAL_CHEN_HOLOGRAM,
    type: 'host',
    name: 'Admiral Chen\'s Holographic Recreation',
    prompt: 'Professional headshot portrait of a distinguished Asian man in his 60s as a hologram, wearing Star Trek-style Starfleet admiral uniform, slight blue holographic shimmer effect, transparent edges, USS Enterprise-style starship interior behind him, soft lighting, high quality digital art',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.UNKNOWN_BERMUDA,
    type: 'host',
    name: '[Signal Lost]',
    prompt: 'Mysterious corrupted photograph, barely visible human silhouette standing on research platform at sea, heavy static interference, image splitting and fragmenting, 1950s photograph style degraded with temporal anomalies, eerie green glow around edges, intentionally corrupted image effect',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.REDACTED_AREA51,
    type: 'host',
    name: '[REDACTED]',
    prompt: 'Deliberately obscured portrait photograph, figure in dark suit with face completely blacked out by censorship bar, Area 51 desert background visible, 1962 photograph style, grainy black and white, official government document aesthetic, TOP SECRET stamp partially visible',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.GROK_RIVER_CLAN,
    type: 'host',
    name: 'Grok of the River Clan',
    prompt: 'Portrait of a friendly Cro-Magnon caveman, strong but approachable features, long tangled brown hair and beard, wearing animal furs, cave paintings visible on wall behind him, warm fire light illuminating face, proud expression, historically accurate Stone Age appearance, high quality digital art',
  },

  // KEY REVIEWERS (most memorable/recurring)
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    type: 'reviewer',
    name: 'Jacques Cousteau',
    prompt: 'Professional headshot portrait of Jacques Cousteau, the famous French oceanographer and explorer, wearing his iconic red knit cap, weathered face from years at sea, kind intelligent eyes, ocean background, vintage photograph style, realistic, high quality',
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    type: 'reviewer',
    name: 'Aquaman',
    prompt: 'Professional headshot portrait of Aquaman, muscular blonde man with long hair, underwater kingdom aesthetic, wearing green and gold armor, confident heroic expression, underwater bubbles and light rays, comic book movie style, high quality',
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    type: 'reviewer',
    name: 'David Attenborough',
    prompt: 'Professional headshot portrait of Sir David Attenborough, elderly British naturalist, kind wise expression, white hair, wearing safari-style shirt, rainforest leaves visible behind him, soft natural lighting, documentary style, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    type: 'reviewer',
    name: 'The Lorax',
    prompt: 'Portrait of The Lorax, small orange fuzzy creature with large yellow mustache, standing protectively near a small tree, expressive concerned eyes, environmental guardian aesthetic, Seuss-style but slightly realistic, colorful background, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    type: 'reviewer',
    name: 'Buzz Aldrin',
    prompt: 'Professional headshot portrait of Buzz Aldrin the astronaut, distinguished elderly man, confident proud expression, wearing NASA flight jacket, American flag pin visible, moon surface photograph visible behind him, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    type: 'reviewer',
    name: 'Moana',
    prompt: 'Portrait of Moana, young Polynesian woman with long curly black hair adorned with flowers, warm confident smile, ocean and traditional sailing canoe behind her, Pacific Islander features, Disney-inspired but slightly realistic style, tropical lighting, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    type: 'reviewer',
    name: 'Captain Kirk',
    prompt: 'Professional headshot portrait of Captain James T Kirk from Star Trek, confident commanding expression, wearing gold Starfleet uniform, USS Enterprise bridge visible behind him, dramatic studio lighting, classic Star Trek aesthetic, high quality',
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    type: 'reviewer',
    name: 'Spock',
    prompt: 'Professional headshot portrait of Spock from Star Trek, Vulcan features with pointed ears, raised eyebrow, calm logical expression, wearing blue Starfleet science uniform, USS Enterprise setting, dramatic studio lighting, high quality',
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    type: 'reviewer',
    name: 'Amelia Earhart',
    prompt: 'Professional headshot portrait of Amelia Earhart, the famous female aviator, short curly hair, wearing leather flight jacket and goggles on forehead, determined adventurous expression, 1930s photograph style with slight temporal distortion effect, vintage sepia tones, high quality',
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    type: 'reviewer',
    name: 'Fox Mulder',
    prompt: 'Professional headshot portrait of FBI Agent Fox Mulder, intense intelligent eyes, slight smile, wearing FBI suit and badge, I WANT TO BELIEVE poster partially visible behind him, dramatic X-Files style lighting, 1990s aesthetic, high quality',
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    type: 'reviewer',
    name: 'Giorgio Tsoukalos',
    prompt: 'Professional headshot portrait of Giorgio Tsoukalos, the Ancient Aliens guy, his famous wild spiky hair, enthusiastic expression, wearing dark blazer, mysterious alien-themed background, History Channel aesthetic, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    type: 'reviewer',
    name: 'Fred Flintstone',
    prompt: 'Portrait of Fred Flintstone, large friendly caveman with black hair and 5 o\'clock shadow, wearing orange animal skin tunic, big smile, prehistoric cave setting with stone furniture, Hanna-Barbera style but slightly realistic, warm torch lighting, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    type: 'reviewer',
    name: 'Bear Grylls',
    prompt: 'Professional headshot portrait of Bear Grylls, the survival expert, rugged outdoor appearance, confident capable expression, wearing practical survival gear, wilderness background, natural lighting, adventurer aesthetic, realistic, high quality photograph',
  },
];

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Starting Phase 4 Listings Creation\n');
  console.log('=' .repeat(60));

  // Step 1: Create Hosts
  console.log('\n👤 Creating new hosts...\n');
  for (const host of newHosts) {
    const { error } = await supabase
      .from('hosts')
      .upsert(host, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error creating host ${host.name}:`, error.message);
    } else {
      console.log(`✅ Created host: ${host.name}`);
    }
  }

  // Step 2: Create Listings
  console.log('\n🏠 Creating new listings...\n');
  for (const listing of newListings) {
    const { error } = await supabase
      .from('listings')
      .upsert(listing, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error creating listing ${listing.title}:`, error.message);
    } else {
      console.log(`✅ Created listing: ${listing.title}`);
    }
  }

  // Step 3: Create Reviews
  console.log('\n📝 Creating reviews...\n');
  for (const review of newReviews) {
    const { error } = await supabase
      .from('reviews')
      .insert(review);

    if (error) {
      console.error(`❌ Error creating review by ${review.reviewer_name}:`, error.message);
    } else {
      const lengthLabel = review.comment.length < 50 ? '(SHORT)' : review.comment.length < 150 ? '(MEDIUM)' : '(LONG)';
      console.log(`✅ ${lengthLabel} Created review by: ${review.reviewer_name}`);
    }
  }

  // Step 4: Link Amenities
  console.log('\n🔗 Linking amenities to listings...\n');

  // First, get all amenities
  const { data: amenitiesData, error: amenitiesError } = await supabase
    .from('amenities')
    .select('*');

  if (amenitiesError) {
    console.error('❌ Error fetching amenities:', amenitiesError.message);
  } else {
    const amenityMap = new Map(amenitiesData.map((a: { name: string; id: string }) => [a.name, a.id]));

    for (const [listingId, amenityNames] of Object.entries(listingAmenities)) {
      for (const amenityName of amenityNames) {
        const amenityId = amenityMap.get(amenityName);
        if (amenityId) {
          const { error } = await supabase
            .from('listing_amenities')
            .upsert({
              listing_id: listingId,
              amenity_id: amenityId,
            }, { onConflict: 'listing_id,amenity_id' });

          if (error && !error.message.includes('duplicate')) {
            console.error(`❌ Error linking ${amenityName} to listing:`, error.message);
          }
        } else {
          // Create new amenity if it doesn't exist
          const { data: newAmenity, error: createError } = await supabase
            .from('amenities')
            .insert({ name: amenityName })
            .select()
            .single();

          if (createError) {
            console.error(`❌ Error creating amenity ${amenityName}:`, createError.message);
          } else if (newAmenity) {
            amenityMap.set(amenityName, newAmenity.id);
            await supabase
              .from('listing_amenities')
              .insert({
                listing_id: listingId,
                amenity_id: newAmenity.id,
              });
            console.log(`✅ Created and linked new amenity: ${amenityName}`);
          }
        }
      }
      console.log(`✅ Linked amenities to listing: ${listingId.slice(0, 8)}...`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Phase 4 Listings Creation Complete!');
  console.log('='.repeat(60));
  console.log('\n📝 Summary:');
  console.log(`   - Created ${newHosts.length} new hosts`);
  console.log(`   - Created ${newListings.length} new listings`);
  console.log(`   - Created ${newReviews.length} new reviews`);
  console.log(`   - Linked amenities to all listings`);
  console.log('\n💡 Next steps:');
  console.log('   1. Run avatar generation script for hosts and reviewers');
  console.log('   2. Upload listing images (placeholder images need to be replaced)');
  console.log('   3. Verify listings in the app');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
