import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsloiphxznbbwfntuxmu.supabase.co';
const supabaseKey = 'sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB';

const supabase = createClient(supabaseUrl, supabaseKey);

// COMPREHENSIVE FIX: Remove ALL redundancies and ensure unique icons
const LISTING_AMENITIES: Record<string, string[]> = {
  '1990s Manhattan Loft in Pre-Internet NYC': [
    // REMOVED: 'Heating system' - duplicate Thermometer icon with 'Air conditioning'
    '1990s furnishings', // Armchair
    'Kitchen facilities', // UtensilsCrossed
    'Air conditioning', // Thermometer
    'Retro TV technology', // Tv
    'Classic NYC building atmosphere', // Building2
    'Vintage vinyl record player', // Music
  ],

  "Alexander the Great's Campaign Tent — Persia, 330 BCE": [
    'Personal effects storage', // Warehouse
    'Companion-friendly aide-de-camp', // Users
    'Bronze armor display', // ShieldCheck
    'Military perimeter monitoring', // Eye
    'Campaign map collection', // BookOpen
    'Campfire proximity', // Flame
    'Command-only access', // Lock
    'Kitchen facilities', // UtensilsCrossed
    'Furs and linen furnishings', // Armchair
    'Military war room', // Tent
    'Climate-adaptive canvas walls', // Wind
    'Military weapons rack', // Swords
    // REMOVED: 'Panoramic mountain views' - duplicate Eye icon with 'Military perimeter monitoring'
    // REMOVED: 'Night watch protection' - duplicate ShieldCheck icon with 'Bronze armor display'
    'Elite guard perimeter', // Shield
  ],

  'Ancient Egyptian Nile Villa (Old Kingdom)': [
    'Nile River access', // Anchor
    'Guided historical tour', // Compass
    'Kitchen facilities', // UtensilsCrossed
    'Hieroglyphic decorations', // Palette
    'Period-accurate furnishings', // Armchair
    'Ancient pyramid artifacts', // Scroll
    'Courtyard garden', // Leaf
  ],

  'Area 51 Classified Barracks — Nevada, 1962': [
    'Hangar views (restricted)', // Ban
    'Unusual housekeeping', // Users
    'Monitored communications', // Radio
    'Night sky observation', // Moon
    'Military bunks', // Bed
    'Classified cafeteria', // UtensilsCrossed
    // REMOVED: 'Kitchen' - duplicate UtensilsCrossed icon with 'Classified cafeteria'
    'Wi-Fi', // Wifi
    'First aid', // Heart
    'Redacted amenities', // XCircle
  ],

  'Bermuda Triangle Research Platform — Atlantic, 1953': [
    'Temporal anomaly proximity', // Clock
    'Emergency supplies', // Heart (could conflict with others)
    'Subjective calendar', // CalendarClock
    'Life rafts', // Anchor
    '1953 research equipment', // Settings
    'Research logs', // BookOpen
    'Radio communication', // Radio
    'Existential dread', // AlertTriangle
    'Basic bunks', // Bed
    'Mystery atmosphere', // Eye
    'Unreliable compass', // Navigation
    'Mess hall', // UtensilsCrossed
  ],

  'Federation Ambassador Suite — Earth, 2364': [
    'Cultural merit system', // Star
    'Post-scarcity living', // Sparkles
    'Universal translator', // Globe
    'Vulcan neighbors', // Users
    'Transporter access', // Zap
    'Educational programs', // BookOpen
    'Replicator access', // Cpu
    'Kitchen', // UtensilsCrossed
    // REMOVED: 'Holodeck privileges' - duplicate Sparkles icon with 'Post-scarcity living'
    'Wi-Fi', // Wifi
    'Emergency transport', // Rocket
  ],

  'Lunar Hilton Penthouse — Moon, 2156': [
    'Low-gravity spa', // Bath
    'Earth views', // Eye
    'Radiation shielding', // Shield
    'Robot butler service', // Bot
    'Kitchen', // UtensilsCrossed
    'Wi-Fi', // Wifi
    'Moon rover access', // Car
    'Emergency evacuation pod', // Rocket
  ],

  'Neo-Showa Capsule Pod in Parallel Tokyo 2087': [
    'Capsule sleeping pod', // Bed
    'Compact kitchen', // UtensilsCrossed
    'Climate control', // Thermometer
    'Rain view window', // Eye
    'Analog clock collection', // Clock
    'Desk workspace', // Armchair (could be different)
  ],

  'Pandora Floating Mountain Bungalow': [
    'Bioluminescent views', // Sparkles
    'Kitchen facilities', // UtensilsCrossed
    'Native flora access', // TreePine
    "Na'vi artifacts", // Scroll
    'Alien wildlife observation', // Bird
    'Floating structure technology', // Mountain
    // REMOVED: 'Mountain horizon views' - duplicate Mountain icon with 'Floating structure technology'
  ],

  'Premium Cave Dwelling — Lascaux, 15,000 BCE': [
    'River access nearby', // Anchor
    'Smoke ventilation', // Wind
    'Cave paintings', // Palette
    'Predator-resistant entrance', // Shield
    'Hunting guide (Grok)', // Binoculars
    'Spirit journey berries', // Sparkles
    'Fire pit', // Flame
    'Fur bedding', // Bed
    'Berry foraging', // Leaf
    // REMOVED: 'Mammoth-fur comfort' - DUPLICATE Bed icon with 'Fur bedding'
  ],

  "Shah Jahan's Marble Suite — Agra, 1650": [
    'Private courtyard garden', // Leaf
    'Natural cooling architecture', // Snowflake
    'Historical artifacts', // Scroll
    'Yamuna River views', // Anchor
    'Kitchen facilities', // UtensilsCrossed
    'Imperial guard security', // Shield
    'Royal hammam bath spa', // Bath
    'Semi-precious stone inlays', // Gem
    'Royal entry', // Crown
    'Cultural immersion', // Award
    'Makrana marble craftsmanship', // Landmark
    'Sunrise horizon views', // Sun
    'Silk cushion furnishings', // Armchair
    // REMOVED: 'Taj Mahal garden access' - duplicate Leaf icon with 'Private courtyard garden'
    'Bird wildlife watching', // Bird
    'Embroidered canopy', // Feather
  ],

  'SpaceX Mars Colony Pod at Olympus Mons': [
    'Thermal drying unit', // Sun
    'Mars surface view', // Eye
    'Zero-gravity sleeping pods', // Bed
    'Compact galley kitchen', // UtensilsCrossed
    'Cold-storage unit', // Refrigerator
    'Starlink Wi-Fi connection', // Wifi
    'Automated fabric recycler', // Recycle
    // REMOVED: 'External perimeter monitoring' - duplicate Eye icon with 'Mars surface view'
    'Exploration rovers', // Car
    'Life support systems', // Activity
    'Climate-controlled habitat', // Building2
  ],

  'The Lost Atlantean Crystal Villa': [
    'Pressure-controlled environment', // Gauge
    'Underwater access portal', // DoorOpen
    'Marine life observation', // Fish
    'Kitchen facilities', // UtensilsCrossed
    'Wifi connection', // Wifi
    'Crystal energy systems', // Gem
    // REMOVED: 'Crystal-powered lighting' - duplicate Gem icon with 'Crystal energy systems'
    'Ancient Atlantean technology', // Cpu
    '360-degree ocean views', // Waves
  ],

  'Titanic First-Class Suite — April 1912': [
    'First-class dining access', // Utensils
    'Edwardian technology', // Settings
    'Ocean deck walks', // Ship
    'Spacious wardrobe', // Warehouse
    'White-glove steward service', // ConciergeBell
    'Fine linen furnishings', // Armchair
    'Ocean wave view windows', // Waves
    // REMOVED: 'Southampton departure' - duplicate Ship icon
    // REMOVED: '24-hour steward service' - duplicate ConciergeBell icon
    'Feather pillow furnishings', // Feather
    'Life jacket safety', // Shield
    'Kitchen facilities', // UtensilsCrossed
    'Iceberg spotting views', // Binoculars
    'Private en-suite bathroom', // Bath
    'Central heating', // Thermometer
    'Crystal chandelier decor', // Sparkles
    // REMOVED: 'Turkish bath spa' - duplicate Bath icon with 'Private en-suite bathroom'
    // REMOVED: 'Brandy service' - would be duplicate ConciergeBell
    'Ocean-facing suite', // Eye
    'Indoor swimming pool', // Droplets
    // REMOVED: 'Champagne service' - would be duplicate ConciergeBell
    // REMOVED: 'Atlantic crossing' - would be duplicate Ship
    'Gymnasium facilities', // Dumbbell
  ],

  'WWII German Resistance Safehouse Loft': [
    'Covert entry system', // DoorClosed
    'Historical artifacts', // Scroll
    'Kitchen facilities', // UtensilsCrossed
    'Hidden compartments', // Lock
    'Educational materials', // GraduationCap
    'Authentic 1940s decor', // Palette
    'Period-accurate furnishings', // Armchair
  ],
};

async function applyComprehensiveFix() {
  console.log('🔧 Applying comprehensive amenity fixes...\n');

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
      continue;
    }

    console.log(`📝 ${listing.title}`);
    console.log(`   Amenities: ${correctedAmenities.length}`);

    // Delete all existing amenities
    await supabase
      .from('listing_amenities')
      .delete()
      .eq('listing_id', listing.id);

    // Add new amenities
    for (const amenityName of correctedAmenities) {
      let { data: existingAmenity } = await supabase
        .from('amenities')
        .select('id')
        .eq('name', amenityName)
        .single();

      let amenityId: string;

      if (!existingAmenity) {
        const { data: newAmenity } = await supabase
          .from('amenities')
          .insert({ name: amenityName })
          .select('id')
          .single();

        amenityId = newAmenity!.id;
      } else {
        amenityId = existingAmenity.id;
      }

      await supabase
        .from('listing_amenities')
        .insert({
          listing_id: listing.id,
          amenity_id: amenityId,
        });
    }

    console.log(`   ✅ Complete\n`);
  }

  console.log('✅ All amenities updated!');
}

applyComprehensiveFix();
