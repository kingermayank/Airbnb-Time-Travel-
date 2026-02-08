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

// Revised Key Features for each listing (excluding Mars, Pandora, Shah Jahan which are references)
// Tone: Utilitarian, benefits-focused, slight wit - matching reference examples
// Titles use sentence casing and keywords that match frontend icon detection in getAmenityIconFallback()
const listingFeatures = [
  // ============================================================================
  // The Lost Atlantean Crystal Villa
  // Icons: crystal→Gem, bioluminescent→Glow SVG, marine→Fish
  // ============================================================================
  {
    listingId: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
    features: [
      {
        title: 'Pressurized crystal dome',
        description: 'Full atmospheric control with panoramic ocean views through ancient crystal walls.',
      },
      {
        title: 'Bioluminescent lighting',
        description: 'Natural deep-sea organisms provide ambient lighting throughout the villa.',
      },
      {
        title: 'Marine life viewing',
        description: 'Manta rays, giant squid, and rare deep-sea creatures pass daily.',
      },
    ],
  },

  // ============================================================================
  // WWII German Resistance Safehouse Loft
  // Icons: hidden→Eye-slash SVG, radio→default, door→DoorOpen
  // ============================================================================
  {
    listingId: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
    features: [
      {
        title: 'Hidden compartments',
        description: 'Original concealed spaces preserved from the resistance era.',
      },
      {
        title: 'Authentic period artifacts',
        description: 'Working 1940s wireless radio with BBC shortwave reception.',
      },
      {
        title: 'Covert door entry',
        description: 'Discreet entrance through the bookshop below, as originally designed.',
      },
    ],
  },

  // ============================================================================
  // Ancient Egyptian Nile Villa (Old Kingdom)
  // Icons: nile/river→River SVG, pyramid→Pyramid SVG, climate→Wind, hieroglyphic→Text SVG
  // ============================================================================
  {
    listingId: '32bb68c5-f89a-4a83-a8f3-90b712482575',
    features: [
      {
        title: 'Private Nile river access',
        description: 'Personal dock with traditional felucca boat for river excursions.',
      },
      {
        title: 'Pyramid construction views',
        description: 'Watch the Great Pyramid rise from your terrace during the Old Kingdom.',
      },
      {
        title: 'Climate-controlled interiors',
        description: 'Thick limestone walls and shaded courtyards keep rooms comfortable.',
      },
      {
        title: 'Hieroglyphic wall murals',
        description: 'Original wall paintings by royal artisans throughout the villa.',
      },
    ],
  },

  // ============================================================================
  // 1990s Manhattan Loft in Pre-Internet NYC
  // Icons: building/city→Building, furnish→Sofa SVG, entertainment→Cassette SVG
  // ============================================================================
  {
    listingId: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
    features: [
      {
        title: 'SoHo gallery building',
        description: 'Walking distance to over 200 contemporary art galleries.',
      },
      {
        title: 'Industrial loft furnishings',
        description: '2,400 square feet with 14-foot ceilings and original hardwood floors.',
      },
      {
        title: 'Period entertainment system',
        description: 'Extensive VHS collection, vintage stereo system, and working answering machine.',
      },
    ],
  },

  // ============================================================================
  // Alexander's Campaign Tent
  // Icons: persian→Carpet SVG, mountain/horizon→Mountain, perimeter/monitoring→Shield
  // ============================================================================
  {
    listingId: '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
    features: [
      {
        title: 'Persian silk furnishings',
        description: 'Luxurious textiles and carpets acquired during the eastern campaign.',
      },
      {
        title: 'Mountain horizon views',
        description: 'Positioned at the heart of the Macedonian camp with panoramic vistas.',
      },
      {
        title: 'Perimeter monitoring',
        description: 'Protected encampment with the Companion cavalry stationed nearby.',
      },
    ],
  },

  // ============================================================================
  // Titanic First-Class Suite
  // Icons: first-class→Star, galley→UtensilsCrossed, ocean/wave→Waves, historical→Museum SVG
  // ============================================================================
  {
    listingId: '0580d737-156f-49ea-abcb-621797f493cf',
    features: [
      {
        title: 'First-class staircase access',
        description: 'Private entry to the iconic oak-paneled grand staircase with glass dome.',
      },
      {
        title: 'Ship galley dining',
        description: 'Ten-course meals prepared by Ritz-trained chefs in the first-class restaurant.',
      },
      {
        title: 'Ocean wave promenade',
        description: 'Reserved deck space for morning walks with unobstructed Atlantic views.',
      },
      {
        title: 'Historical spa preservation',
        description: 'Turkish bath and gymnasium with original steam rooms and exercise equipment.',
      },
    ],
  },
];

async function main() {
  console.log('🚀 Updating Key Features for listings\n');

  for (const listing of listingFeatures) {
    console.log(`\n📝 Updating: ${listing.listingId}`);

    const { error } = await supabase
      .from('listings')
      .update({ key_features: listing.features })
      .eq('id', listing.listingId);

    if (error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.log(`✅ Updated with ${listing.features.length} features:`);
      for (const f of listing.features) {
        console.log(`   • ${f.title}`);
      }
    }
  }

  console.log('\n✅ All Key Features updated!');
}

main().catch(console.error);
