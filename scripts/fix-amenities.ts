import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsloiphxznbbwfntuxmu.supabase.co';
const supabaseKey = 'sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB';

const supabase = createClient(supabaseUrl, supabaseKey);

// Corrected amenities for each listing
const LISTING_AMENITIES: Record<string, string[]> = {
  '1990s Manhattan Loft in Pre-Internet NYC': [
    'Heating system',
    '1990s furnishings',
    'Kitchen facilities',
    'Air conditioning',
    'Retro TV technology', // Fixed capitalization
    // REMOVED: 'Wifi connection' - not available in 1990s pre-internet
    'Vintage vinyl record player',
    'Classic NYC building atmosphere', // Shortened, removed redundant "city"
    // REMOVED: '1990s period decor' - redundant with '1990s furnishings'
  ],

  "Alexander the Great's Campaign Tent — Persia, 330 BCE": [
    'Personal effects storage',
    'Companion-friendly aide-de-camp',
    'Bronze armor display', // Shortened
    'Heating system',
    'Military perimeter monitoring',
    'Campaign map collection',
    'Campfire proximity',
    'Command-only access', // Consolidated military access items
    'Kitchen facilities',
    'Furs and linen furnishings',
    'Military war room',
    'Air conditioning',
    'Elite guard perimeter',
    // REMOVED: 'Wifi connection' - not available in 330 BCE
    'Climate-adaptive canvas walls',
    'Military weapons rack', // Consolidated
    'Panoramic mountain views',
    'Night watch protection',
  ],

  'Ancient Egyptian Nile Villa (Old Kingdom)': [
    'Nile River access', // Capitalized River
    'Heating system',
    'Courtyard garden',
    'Historical preservation',
    'Kitchen facilities',
    'Guided historical tour',
    'Air conditioning',
    // REMOVED: 'Wifi connection' - not available in Old Kingdom Egypt
    'Period-accurate furnishings',
    'Ancient pyramid artifacts',
    'Hieroglyphic decorations', // Shortened
  ],

  'Area 51 Classified Barracks — Nevada, 1962': [
    'Hangar views (restricted)',
    'Unusual housekeeping',
    'Monitored communications',
    'Night sky observation',
    'Military bunks',
    'Air conditioning',
    'Classified cafeteria',
    'Kitchen',
    'Wi-Fi', // Kept for 1962 (ARPANET era)
    'First aid',
    'Redacted amenities',
  ],

  'Bermuda Triangle Research Platform — Atlantic, 1953': [
    'Temporal anomaly proximity',
    'Emergency supplies',
    'Subjective calendar', // Changed from 'Calendar (subjective)' for uniqueness
    'Life rafts',
    '1953 research equipment',
    'Research logs',
    'Radio communication',
    'Existential dread',
    'Basic bunks',
    'Mystery atmosphere',
    'Unreliable compass', // Changed from 'Compass (unreliable)' for uniqueness
    'Mess hall',
  ],

  'Federation Ambassador Suite — Earth, 2364': [
    'Cultural merit system',
    'Post-scarcity living',
    'Universal translator',
    'Air conditioning',
    'Vulcan neighbors',
    'Transporter access',
    'Educational programs',
    'Replicator access',
    'Kitchen',
    'Holodeck privileges',
    'Wi-Fi',
    'Emergency transport',
  ],

  'Lunar Hilton Penthouse — Moon, 2156': [
    'Low-gravity spa',
    'Earth views',
    'Radiation shielding',
    'Air conditioning',
    'Robot butler service',
    'Kitchen',
    'Wi-Fi',
    'Moon rover access', // Changed from 'Vintage moon rover access'
    'Emergency evacuation pod',
  ],

  'Neo-Showa Capsule Pod in Parallel Tokyo 2087': [
    'Capsule sleeping pod',
    'Compact kitchen',
    'Climate control',
    'Rain view window',
    'Analog clock collection',
    'Desk workspace',
  ],

  'Pandora Floating Mountain Bungalow': [
    'Heating system',
    'Bioluminescent views', // Shortened
    'Kitchen facilities',
    'Native flora access', // Shortened
    'Air conditioning',
    'Wifi connection',
    "Na'vi artifacts", // Changed to be more general
    'Alien wildlife observation',
    'Floating structure technology',
    'Mountain horizon views',
  ],

  'Premium Cave Dwelling — Lascaux, 15,000 BCE': [
    'River access nearby',
    'Smoke ventilation',
    'Cave paintings',
    'Predator-resistant entrance',
    'Hunting guide (Grok)',
    'Spirit journey berries',
    'Fire pit',
    'Fur bedding',
    'Berry foraging',
    'Mammoth-fur comfort',
  ],

  "Shah Jahan's Marble Suite — Agra, 1650": [
    'Private courtyard garden',
    'Natural cooling architecture',
    'Historical artifacts',
    'Heating system',
    'Yamuna River views', // Capitalized River
    'Kitchen facilities',
    'Imperial guard security',
    'Air conditioning',
    // REMOVED: 'Wifi connection' - not available in 1650
    'Royal hammam bath spa',
    'Semi-precious stone inlays',
    'Royal entry',
    'Cultural immersion',
    'Makrana marble craftsmanship',
    'Sunrise horizon views',
    'Silk cushion furnishings',
    'Taj Mahal garden access',
    'Bird wildlife watching',
    'Embroidered canopy',
  ],

  'SpaceX Mars Colony Pod at Olympus Mons': [
    'Heating system',
    'Thermal drying unit',
    'Mars surface view',
    'Zero-gravity sleeping pods',
    'Compact galley kitchen',
    'Cold-storage unit',
    'Air conditioning',
    'Starlink Wi-Fi connection', // Consolidated Wi-Fi entries
    'Automated fabric recycler',
    'External perimeter monitoring',
    'Exploration rovers',
    'Life support systems',
    'Climate-controlled habitat',
  ],

  'The Lost Atlantean Crystal Villa': [
    'Pressure-controlled environment',
    'Heating system',
    'Underwater access portal',
    'Marine life observation',
    'Kitchen facilities',
    'Air conditioning',
    'Wifi connection',
    'Crystal energy systems',
    'Crystal-powered lighting',
    'Ancient Atlantean technology',
    '360-degree ocean views', // Consolidated ocean views
  ],

  'Titanic First-Class Suite — April 1912': [
    'First-class dining access',
    'Edwardian technology', // Shortened
    'Ocean deck walks',
    'Spacious wardrobe',
    'White-glove steward service',
    'Fine linen furnishings',
    'Heating system',
    'Ocean wave view windows',
    'Southampton departure',
    '24-hour steward service',
    'Feather pillow furnishings',
    'Life jacket safety',
    'Kitchen facilities',
    'Iceberg spotting views',
    'Private en-suite bathroom',
    'Central heating',
    // REMOVED: 'Wifi connection' - not available in 1912
    'Crystal chandelier decor',
    'Turkish bath spa',
    'Brandy service',
    'Ocean-facing suite',
    'Indoor swimming pool',
    'Champagne service',
    'Atlantic crossing',
    'Gymnasium facilities',
  ],

  'WWII German Resistance Safehouse Loft': [
    'Covert entry system',
    'Historical artifacts',
    'Authentic safehouse experience',
    'Heating system',
    'Historical preservation',
    'Kitchen facilities',
    'Hidden compartments',
    'Air conditioning',
    // REMOVED: 'Wifi connection' - not available in WWII
    'Educational materials', // Changed from 'book materials'
    'Authentic 1940s decor',
    'Period-accurate furnishings',
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
