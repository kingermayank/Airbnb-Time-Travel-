import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Mapping of old amenity names to new sentence-cased names with icon-matching keywords
// Keywords in names should match patterns in getAmenityIconFallback() in ListingDetailPage.tsx
const amenityRenames: Record<string, string> = {
  // Common amenities
  'Wifi connection': 'Wifi connection', // Already updated
  'Kitchen facilities': 'Kitchen facilities', // Already updated
  'Air conditioning': 'Air conditioning',
  'Heating system': 'Heating system', // Already updated
  'Washer': 'Washer',
  'Dryer': 'Dryer',
  'Parking': 'Parking',
  'Pool': 'Pool',
  'Hot tub': 'Hot tub',
  'Gym': 'Gym',

  // Mars Colony specific
  'Starlink wifi connection': 'Starlink wifi connection', // Already updated
  'Compact galley kitchen': 'Compact galley kitchen',
  'Mars surface view': 'Mars surface view',
  'Life support systems': 'Life support systems',
  'Climate-controlled habitat': 'Climate-controlled habitat',
  'Exploration rovers': 'Exploration rovers',
  'Automated fabric recycler': 'Automated fabric recycler',
  'Thermal drying unit': 'Thermal drying unit',
  'External perimeter monitoring': 'External perimeter monitoring',
  'Military Security Perimeter': 'Military perimeter monitoring',
  'Cold-storage unit': 'Cold-storage unit',
  'Companion-friendly': 'Companion-friendly',
  'Companion-friendly (royal attendants available)': 'Companion-friendly royal attendants',
  'Companion-friendly (aide-de-camp available)': 'Companion-friendly aide-de-camp',
  'Zero-gravity sleeping pods': 'Zero-gravity sleeping pods',

  // Atlantis/Underwater
  'Underwater ocean views': 'Underwater ocean views', // Already updated
  'Crystal energy systems': 'Crystal energy systems',
  'Ancient Atlantean technology': 'Ancient Atlantean technology',
  '360-degree ocean views': '360-degree ocean views',
  'Pressure-controlled environment': 'Pressure-controlled environment',
  'Marine life observation': 'Marine life observation',
  'Crystal-powered lighting': 'Crystal-powered lighting',
  'Underwater access portal': 'Underwater access portal',

  // Titanic
  'Historical preservation': 'Historical preservation',
  'Period-accurate furnishings': 'Period-accurate furnishings',
  'Authentic 1912 decor': 'Authentic 1912 decor', // Already updated
  'Ocean wave views': 'Ocean wave views', // Already updated
  'First-class luxury amenities': 'First-class luxury amenities', // Already updated
  'First-class dining saloon access': 'First-class dining galley access',
  'Period-accurate technology': 'Period-accurate technology',
  'Cultural artifacts': 'Cultural artifacts',
  'Authentic immersion experience': 'Authentic immersion experience', // Already updated
  'Ocean-view windows': 'Ocean wave view windows',
  'Private en-suite bathroom': 'Private en-suite bathroom',
  'Central heating': 'Central heating system',
  'Personal writing desk': 'Personal writing desk',
  'Spacious wardrobe (room for evening gowns and sketchbooks)': 'Spacious wardrobe furnishings',
  'Live string orchestra performances': 'Live music orchestra performances',
  'Grand Staircase proximity': 'Grand staircase proximity',
  'Turkish baths': 'Turkish bath spa facilities',
  'Gymnasium facilities': 'Gymnasium facilities',
  'Indoor swimming pool': 'Indoor swimming pool',
  '24-hour steward service': '24-hour steward service',
  'Iceberg spotting (seasonal)': 'Ocean view iceberg spotting',
  'White-Glove Steward Service': 'White-glove steward service',
  'Advanced Maritime Confidence™': 'Advanced ship maritime confidence',
  'Priority Promenade Access': 'Priority promenade deck access',
  'Crystal chandeliers': 'Crystal chandelier decor',
  "Ship's orchestra": 'Ship music orchestra',
  'Fine linens': 'Fine linen furnishings',
  'Feather pillows': 'Feather pillow furnishings',
  'Life jackets': 'Life jacket safety',
  'Brandy service': 'Brandy service',
  'Champagne service': 'Champagne service',
  'Deck walks': 'Ocean deck walks',
  'Edwardian engineering': 'Edwardian engineering technology',
  'Ocean-facing suite': 'Ocean wave facing suite',
  'Luxury accommodations': 'Luxury star accommodations',
  'Society elite amenities': 'Society elite first-class amenities',
  'Maritime safety features': 'Maritime ship safety features',
  'Southampton departure': 'Southampton ship departure',
  'Atlantic crossing': 'Atlantic ocean crossing',
  'RMS Titanic experience': 'RMS Titanic ship experience',
  'Electric lighting (very modern)': 'Electric lighting system',

  // WWII Safehouse
  'Hidden compartments': 'Hidden compartments',
  'Authentic 1940s decor': 'Authentic 1940s decor', // Already updated
  'Covert door entry system': 'Covert door entry system', // Already updated
  'Historical artifacts': 'Historical artifacts',
  'Educational book materials': 'Educational book materials', // Already updated
  'Authentic safehouse experience': 'Authentic safehouse experience',

  // Pandora
  'Bioluminescent glow views': 'Bioluminescent glow views', // Already updated
  'Pandoran energy power systems': 'Pandoran energy power systems', // Already updated
  'Native flora plant access': 'Native flora plant access', // Already updated
  'Floating structure technology': 'Floating structure technology', // Already updated
  'Eco-friendly leaf systems': 'Eco-friendly leaf systems', // Already updated
  'Mountain horizon views': 'Mountain horizon views', // Already updated
  'Alien wildlife observation': 'Alien wildlife observation',
  "Na'vi bow and arrow artifacts": "Na'vi bow and arrow artifacts", // Already updated

  // Egyptian
  'Nile river access': 'Nile river access', // Already updated
  'Ancient pyramid artifacts': 'Ancient pyramid artifacts', // Already updated
  'Hieroglyphic text decorations': 'Hieroglyphic text decorations', // Already updated
  'Courtyard garden access': 'Courtyard garden access', // Already updated
  'Cultural immersion experience': 'Cultural immersion experience', // Already updated
  'Guided tour access': 'Guided tour access',
  'Guided historical tours': 'Guided historical tour access',

  // Alexander's Tent
  'Military camp atmosphere': 'Military camp atmosphere',
  'Persian rug decor': 'Persian rug decor', // Already updated
  'Campfire experience': 'Campfire experience', // Already updated
  'Authentic tent structure': 'Authentic tent structure',
  'Panoramic views of the encampment': 'Panoramic mountain views of encampment',
  'Strategic map table': 'Strategic map table',
  'Portable writing desk': 'Portable writing desk',
  'Oil-lamp illumination': 'Oil lamp illumination lighting',
  'Climate-adaptive canvas walls': 'Climate-adaptive canvas walls',
  'Weapons rack (decorative & functional)': 'Military sword weapons rack',
  'Night watch protection': 'Night watch perimeter protection',
  'Immediate access to cavalry and infantry lines': 'Cavalry and military infantry access',
  'Portable wash basin': 'Portable wash basin',
  'Campfire proximity': 'Campfire proximity',
  'Signal horn access': 'Signal horn access',
  'Rapid Relocation Readiness': 'Rapid relocation tent readiness',
  'Command-Only Access': 'Command-only military access',
  'Elite Hypaspists guard': 'Elite military guard perimeter',
  'Bronze armor display': 'Bronze military armor display',
  'Scroll collection': 'Scroll book collection',
  'War room': 'Military war room',
  'Campaign maps': 'Campaign map collection',
  'Furs and linen coverings': 'Furs and linen furnishings',
  'Personal effects storage': 'Personal effects storage',
  'Cavalry access': 'Military cavalry access',
  'Infantry lines access': 'Military infantry access',

  // 1990s Manhattan
  'Retro tv technology': 'Retro tv technology', // Already updated
  'Vintage cassette entertainment': 'Vintage cassette entertainment', // Already updated
  '1990s period decor': '1990s period decor', // Already updated
  'Pre-internet phone experience': 'Pre-internet phone experience', // Already updated
  '1990s furnishings': '1990s furnishings',
  'Retro game electronics': 'Retro game electronics', // Already updated
  'Vintage vinyl record player': 'Vintage vinyl record player', // Already updated
  'Classic NYC city building atmosphere': 'Classic NYC city building atmosphere', // Already updated

  // Shah Jahan specific
  'Authentic Mughal palace architecture': 'Authentic Mughal palace architecture', // Already updated
  'Marble craftsmanship': 'Marble craftsmanship',
  'Private courtyard garden': 'Private courtyard garden', // Already updated
  'Hand-carved marble interiors': 'Hand-carved marble interiors',
  'Daily Marble Cooling Rituals': 'Daily marble cooling rituals',
  'Makrana marble': 'Makrana marble craftsmanship',
  'Private courtyard access': 'Private courtyard garden access',
  'Yamuna River views': 'Yamuna river views',
  'Taj Mahal garden access': 'Taj Mahal garden access',
  'Natural cooling architecture': 'Natural cooling climate architecture',
  'Royal hammam (steam bath)': 'Royal hammam bath spa',
  'Incense and oil aromatics': 'Incense and oil aromatics',
  'Persian carpet flooring': 'Persian carpet rug flooring',
  'Calligraphy-adorned walls': 'Calligraphy-adorned text walls',
  'Nighttime candle illumination': 'Nighttime candle lamp illumination',
  'Security by imperial guards': 'Security by imperial military guards',
  'Imperial Privacy Protocols': 'Imperial privacy protocols',
  'Royal Entry': 'Royal door entry',
  'Pietra dura inlays': 'Pietra dura marble inlays',
  'Silk cushions': 'Silk cushion furnishings',
  'Embroidered canopies': 'Embroidered canopy furnishings',
  'Palace gardens': 'Palace garden access',
  'Mughal imperial complex': 'Mughal palace imperial complex',
  'Indo-Islamic architecture': 'Indo-Islamic palace architecture',
  'Semi-precious stone inlays': 'Semi-precious stone crystal inlays',
  'Garden views': 'Garden views',
  'Bird watching': 'Bird wildlife watching',
  'Sunrise views': 'Sunrise horizon views',
  'Royal experience': 'Royal first-class experience',
};

async function main() {
  console.log('🚀 Updating amenity names to sentence casing with icon-matching keywords\n');

  // First, get all existing amenities
  const { data: existingAmenities, error: fetchError } = await supabase
    .from('amenities')
    .select('id, name');

  if (fetchError) {
    console.error('❌ Error fetching amenities:', fetchError.message);
    return;
  }

  console.log(`📋 Found ${existingAmenities?.length || 0} amenities in database\n`);

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const amenity of existingAmenities || []) {
    const newName = amenityRenames[amenity.name];

    if (!newName) {
      console.log(`⚪ No mapping for: "${amenity.name}"`);
      notFound++;
      continue;
    }

    if (newName === amenity.name) {
      console.log(`⏭️  Unchanged: "${amenity.name}"`);
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('amenities')
      .update({ name: newName })
      .eq('id', amenity.id);

    if (updateError) {
      console.error(`❌ Error updating "${amenity.name}": ${updateError.message}`);
    } else {
      console.log(`✅ "${amenity.name}" → "${newName}"`);
      updated++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped (unchanged): ${skipped}`);
  console.log(`⚪ Not in mapping: ${notFound}`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(console.error);
