import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsloiphxznbbwfntuxmu.supabase.co';
const supabaseKey = 'sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB';

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// ELEVATED AMENITIES — Funnier, era-specific, unique icons per listing
// Keys use the CURRENT DB titles (after rename-listing-titles.sql)
// ============================================================================
const LISTING_AMENITIES: Record<string, string[]> = {
  // ── Shah Jahan's Marble Suite, Agra (1650) ──
  // No Wi-Fi. 15 amenities, all unique icons.
  "Shah Jahan's Marble Suite, Agra": [
    'Taj Mahal sunrise terrace views',
    'Royal hammam bath spa',
    'Pietra dura gemstone inlays',
    'Makrana marble throughout',
    'Private courtyard garden',
    'Imperial guard posted 24/7',
    'Mughlai royal kitchen',
    'Silk & gold thread furnishings',
    'Yamuna River barge dock',
    'Court musician performances',
    'Peacock alarm clock (loud)',
    'Calligraphy writing desk',
    'Persian carpet heated floors',
    'Embroidered canopy bed',
    'Natural cooling architecture',
  ],

  // ── Mars Colony Pod, Olympus Mons (2157) ──
  // "Starlink 7 quantum uplink" replaces generic Wi-Fi.
  'Mars Colony Pod, Olympus Mons': [
    'Starlink 7 quantum uplink',
    'Compact galley kitchen',
    'Zero-gravity sleeping pods',
    'Mars rover excursions',
    'Life support systems',
    'Olympus Mons observation dome views',
    'Radiation-hardened habitat',
    'Automated fabric recycler',
    'Cryo-storage unit',
    'Thermal drying unit',
    'Dust storm alert system',
    'Terraforming progress telescope',
    "Elon's motivational poster collection",
  ],

  // ── Crystal Villa, Atlantis (9600 BCE) ──
  // REMOVED Wi-Fi — Atlantis predates the internet.
  'Crystal Villa, Atlantis': [
    'Orichalcum crystal walls',
    'Underwater portal access',
    'Marine life observation dome',
    'Pressure-controlled environment',
    'Crystal-powered climate system',
    'Atlantean food synthesizer kitchen',
    'Telepathic concierge shell',
    'Bioluminescent nightlight mode',
    'Coral garden terrace',
    '360-degree ocean panorama views',
    'Ancient Atlantean technology museum',
  ],

  // ── First-Class Suite, RMS Titanic (April 1912) ──
  // No Wi-Fi. Trimmed from 24 to 15, no duplicate icons.
  'First-Class Suite, RMS Titanic': [
    'Grand Staircase dining access',
    'Private en-suite bathroom',
    'Crystal chandelier lighting',
    'Turkish bath & swimming pool',
    'Gymnasium with mechanical horses',
    'Ocean-facing promenade deck',
    'White-glove steward service',
    'Spacious mahogany wardrobe',
    'Feather pillow & Irish linen bed',
    'Iceberg spotting binoculars',
    'Life jacket (decorative, surely)',
    'Brandy & champagne wine cellar',
    'Edwardian electric lighting',
    'Central steam heating',
    'Complimentary denial about icebergs',
  ],

  // ── Resistance Safehouse Loft, Berlin (1943) ──
  // No Wi-Fi, no AC — a 1943 Berlin safehouse wouldn't have AC.
  'Resistance Safehouse Loft, Berlin': [
    'Covert bookshelf entrance',
    'Hidden wall compartments',
    'BBC shortwave radio',
    'Blackout curtains (mandatory)',
    'Authentic 1940s furnishings',
    'Resistance document library',
    'Dead-drop message archive',
    'Strudel from the safe kitchen',
    'Coal-fired heating stove',
    'Three-knock entry protocol',
    'Emergency identity papers',
  ],

  // ── Floating Mountain Bungalow, Pandora (2154) ──
  // REMOVED Wi-Fi — the Na'vi don't use Wi-Fi.
  'Floating Mountain Bungalow, Pandora': [
    'Bioluminescent forest nightlights',
    'Living vine architecture walls',
    'Neural network flora access',
    'Direhor silk hammock bed',
    'Banshee observation terrace views',
    'Eywa meditation grove',
    'Anti-gravity floating patio',
    "Na'vi artifact gallery",
    'Woodsprite welcome committee',
    'Natural spring kitchen',
    'Ikran landing pad (BYOB — bring your own banshee)',
  ],

  // ── Nile Villa, Ancient Egypt (2650 BCE) ──
  // No Wi-Fi.
  'Nile Villa, Ancient Egypt': [
    'Private Nile felucca dock',
    'Step Pyramid terrace views',
    'Hieroglyphic mural gallery',
    'Lotus-column courtyard garden',
    'Royal linen bed',
    'Papyrus writing desk',
    'Bread & beer kitchen (historically accurate)',
    "Imhotep's medical remedies cabinet",
    'Stargazing observation telescope',
    'Sacred cat companionship',
    'Guided pyramid construction tour',
  ],

  // ── Alexander's Campaign Tent, Persia (330 BCE) ──
  // MAJOR ICON FIX: Previously 6 items → Tent icon, 2 → Shield. Now all unique.
  "Alexander's Campaign Tent, Persia": [
    'Persian silk & gold tent canopy',
    'Tactical war room with maps',
    'Bronze panoply display',
    'Companion cavalry stables',
    'Panoramic mountain views',
    'Persian royal wine cellar',
    'Campfire-roasted feast kitchen',
    'Elite Companion guard post',
    'Furs & captured Persian linens',
    'Bucephalus grooming station',
    "Aristotle's philosophy scrolls",
    'Dawn training ground access',
    "Darius's stolen treasure chest",
  ],

  // ── Manhattan Loft, New York (1995) ──
  // No Wi-Fi — pre-consumer internet.
  'Manhattan Loft, New York': [
    'Vintage vinyl turntable & crates',
    'Retro cathode-ray TV',
    'Working rotary phone',
    'VHS collection (Pulp Fiction included)',
    'Boombox with mixtape library',
    'Gallery-wall loft space',
    'Galley kitchen with period appliances',
    'SoHo gallery guide & subway tokens',
    'Cast-iron radiator heating',
    '1995 Macintosh (no internet)',
    'Paper street map of Manhattan',
  ],

  // ── Lunar Hilton Penthouse, Moon (2156) ──
  // "Starlink 5 neural-link Wi-Fi" replaces generic Wi-Fi.
  'Lunar Hilton Penthouse, Moon': [
    'Starlink 5 neural-link Wi-Fi',
    'Earthrise panoramic balcony',
    '1/6 gravity jacuzzi (floating blobs)',
    'Robot butler (tips in crypto only)',
    'Vintage 2089 moon rover excursion',
    'Apollo 11 gift shop walking distance',
    'Emergency evacuation pod',
    'Radiation shielding suite',
    'Replicator kitchen (pizza quality varies)',
    'Low-gravity spa (bounce off walls)',
    'Telescope (see your house from here)',
    'Dynasty-verified Hilton thread count bed',
  ],

  // ── Federation Ambassador Suite, Earth (2364) ──
  // "Subspace relay instant comms" replaces generic Wi-Fi.
  'Federation Ambassador Suite, Earth': [
    'Subspace relay instant comms',
    'Food replicator (pizza still broken)',
    'Holodeck suite (educational programs auto-suggested)',
    'Transporter pad sightseeing',
    'Universal translator implant',
    'Post-scarcity economy (everything free-ish)',
    'Vulcan neighbors in 3B (quiet hours enforced)',
    'Cultural merit point earning lounge',
    'Emergency beam-out protocol',
    'Auto-adjusting firmness bed',
    'Poetry reading salon (merit points required)',
    'Klingon cultural attache next door (loud)',
  ],

  // ── Research Platform, Bermuda Triangle (1953) ──
  // No Wi-Fi. Every amenity has a parenthetical reinforcing "time is broken".
  'Research Platform, Bermuda Triangle': [
    'Temporal anomaly proximity (free)',
    'Compass (points everywhere at once)',
    'Calendar (disagrees with itself)',
    'Radio (responses arrive before transmission)',
    'Life rafts (we think)',
    '1953 vintage research equipment',
    'Existential dread (complimentary)',
    'Mystery atmosphere (unexplained)',
    'Mess hall (meals arrive in wrong order)',
    'Research logs (some from the future)',
    'Emergency supplies (expiration date: ???)',
    'Basic bunks (gravity optional Tuesdays)',
  ],

  // ── Classified Barracks, Area 51 (1962) ──
  // WiFi password IS the joke.
  'Classified Barracks, Area 51': [
    'WiFi: "definitely_not_aliens"',
    'Classified cafeteria (unlabeled menu)',
    'Unusual housekeeping staff',
    'Monitored communications (all of them)',
    'Hangar 18 views (restricted)',
    'Night sky observation (do not investigate)',
    'Military-grade bunks',
    'Standard-issue first aid',
    '[REDACTED] amenities',
    'Weather balloon display (it\'s always a weather balloon)',
    'Vending machine (no Reese\'s Pieces)',
    'Debriefing room access (mandatory)',
  ],

  // ── Cave Dwelling, Lascaux (15,000 BCE) ──
  // No Wi-Fi (obviously). Written in Grok's voice.
  'Cave Dwelling, Lascaux': [
    'Optimal fire pit (smoke out, heat in)',
    "Grandmother's famous cave paintings",
    'Predator-resistant entrance (medium predators only)',
    'Mammoth-fur luxury bedding (minor fleas)',
    "Grok's guided hunting excursion",
    'River access (indoor plumbing alternative)',
    'Spirit journey berries (extra cost)',
    'Best-in-region berry foraging',
    'Smoke-hole ventilation system',
    'Solid rock walls (Grok checked)',
    'Night sky unpolluted by civilization',
  ],

  // ── Neo-Showa Capsule Pod, Parallel Tokyo (2087) ──
  // No traditional Wi-Fi — they rejected modern internet in this timeline.
  'Neo-Showa Capsule Pod, Parallel Tokyo': [
    'CRT television (3 timeline broadcasts)',
    'Memory foam capsule bed',
    'Compact anime-themed microwave kitchen',
    'Neon rain window views',
    'Analog clock wall collection',
    'Vintage green-phosphor terminal',
    'Apologetic Japanese toilet',
    'LAN party network (Wi-Fi is too modern)',
    'Desk workspace with calligraphy set',
    'Floppy disk data archive',
    'Pixel-chan the cat (certified paradox-free)',
    'Vending machine (47 beverage options)',
  ],
};

async function updateListingAmenities() {
  console.log('🔍 Starting amenities update...\n');

  // First, get all listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title');

  if (listingsError) {
    console.error('❌ Error fetching listings:', listingsError);
    return;
  }

  for (const listing of listings || []) {
    const correctedAmenities = LISTING_AMENITIES[listing.title];

    if (!correctedAmenities) {
      console.log(`⚠️  No corrections defined for: ${listing.title}`);
      continue;
    }

    console.log(`\n📝 Processing: ${listing.title}`);
    console.log(`   Will have ${correctedAmenities.length} amenities`);

    // Step 1: Delete all existing amenities for this listing
    const { error: deleteError } = await supabase
      .from('listing_amenities')
      .delete()
      .eq('listing_id', listing.id);

    if (deleteError) {
      console.error(`   ❌ Error deleting old amenities:`, deleteError);
      continue;
    }

    // Step 2: For each amenity, ensure it exists in the amenities table
    for (const amenityName of correctedAmenities) {
      // Check if amenity exists
      let { data: existingAmenity, error: fetchError } = await supabase
        .from('amenities')
        .select('id')
        .eq('name', amenityName)
        .single();

      let amenityId: string;

      if (fetchError && fetchError.code === 'PGRST116') {
        // Amenity doesn't exist, create it
        const { data: newAmenity, error: createError } = await supabase
          .from('amenities')
          .insert({ name: amenityName })
          .select('id')
          .single();

        if (createError || !newAmenity) {
          console.error(`   ❌ Error creating amenity "${amenityName}":`, createError);
          continue;
        }
        amenityId = newAmenity.id;
        console.log(`   ✅ Created new amenity: ${amenityName}`);
      } else if (existingAmenity) {
        amenityId = existingAmenity.id;
      } else {
        console.error(`   ❌ Error fetching amenity "${amenityName}":`, fetchError);
        continue;
      }

      // Step 3: Link amenity to listing
      const { error: linkError } = await supabase
        .from('listing_amenities')
        .insert({
          listing_id: listing.id,
          amenity_id: amenityId,
        });

      if (linkError) {
        console.error(`   ❌ Error linking amenity "${amenityName}":`, linkError);
      }
    }

    console.log(`   ✅ Updated ${listing.title} with ${correctedAmenities.length} amenities`);
  }

  console.log('\n✅ Amenities update complete!');
}

updateListingAmenities();
