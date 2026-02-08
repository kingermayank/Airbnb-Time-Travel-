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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Listing IDs for reference
const LISTING_IDS = {
  SHAH_JAHAN: 'bdf429ac-9274-44e1-9986-b43dcffe87e9',
  ATLANTIS: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
  TITANIC: '0580d737-156f-49ea-abcb-621797f493cf',
  WWII: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
  PANDORA: '41f8401a-e8a8-42fa-9809-10604c91d274',
  EGYPT: '32bb68c5-f89a-4a83-a8f3-90b712482575',
  ALEXANDER: '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
  NYC_90S: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
};

// Things to Know WITHOUT icons
const thingsToKnowNoIcons: Record<string, any> = {
  [LISTING_IDS.SHAH_JAHAN]: {
    house_rules: [
      { rule: 'Respect the marble - no shoes on inlaid surfaces' },
      { rule: 'Peacocks have right of way' },
      { rule: 'Photography permitted, but no touching the pietra dura' },
      { rule: 'Traditional dress appreciated but not required' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: false, note: 'Not invented yet' },
      { item: 'First aid kit', available: true, note: 'Mughal-era herbal remedies included' },
      { item: 'Fire extinguisher', available: false, note: 'Water buckets provided' },
      { item: 'Carbon monoxide detector', available: false, note: 'Open-air courtyards provide ventilation' },
    ],
    cancellation_highlight: 'Free cancellation up to 5 days before your journey through time',
  },
  [LISTING_IDS.ATLANTIS]: {
    house_rules: [
      { rule: 'Please do not feed the kraken' },
      { rule: 'Crystal energy is complimentary - do not attempt to harvest' },
      { rule: 'Quiet hours enforced by the ocean itself after midnight' },
      { rule: 'Swimming certification not required but strongly recommended' },
    ],
    safety_and_property: [
      { item: 'Pressure regulation', available: true, note: 'Automatic adjustment' },
      { item: 'Emergency surfacing protocol', available: true, note: 'Takes 3 minutes' },
      { item: 'Underwater escape routes', available: true, note: 'Clearly marked in bioluminescent paint' },
      { item: 'First aid kit', available: true, note: 'Includes anti-jellyfish ointment' },
    ],
    cancellation_highlight: 'Free cancellation up to 7 days before descent',
  },
  [LISTING_IDS.TITANIC]: {
    house_rules: [
      { rule: 'Life jacket orientation: Deck 7 (attendance optional but... recommended)' },
      { rule: 'Dress code enforced for first-class dining' },
      { rule: 'Third-class areas accessible but frowned upon by staff' },
      { rule: 'The bow is available for romantic moments before 10pm' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: false, note: 'Not standard in 1912' },
      { item: 'Life jackets', available: true, note: 'Under your bed' },
      { item: 'Sufficient lifeboats', available: false, note: 'Management is confident this is fine' },
      { item: 'First aid kit', available: true, note: 'Ships surgeon on call' },
    ],
    cancellation_highlight: 'Free cancellation up to 3 days before departure. No refunds after April 14th.',
  },
  [LISTING_IDS.WWII]: {
    house_rules: [
      { rule: 'Do not answer the door. Ever. For anyone. We mean it.' },
      { rule: 'Keep voices low at all times' },
      { rule: 'Blackout curtains must remain closed after dark' },
      { rule: 'If anyone asks, you are visiting your cousin Werner' },
    ],
    safety_and_property: [
      { item: 'Escape routes', available: true, note: 'Three documented, one secret' },
      { item: 'Hidden compartments', available: true, note: 'Do not store snacks in these' },
      { item: 'First aid kit', available: true, note: 'Concealed behind false bookshelf' },
      { item: 'Emergency contacts', available: true, note: 'Memorize and destroy' },
    ],
    cancellation_highlight: 'Cancellation possible but the less paperwork the better',
  },
  [LISTING_IDS.PANDORA]: {
    house_rules: [
      { rule: 'Do not touch anything until Neytiri says okay' },
      { rule: 'Exopack must be worn outside the pressurized areas' },
      { rule: 'Bonding with local wildlife is at your own risk' },
      { rule: 'Respect the neural network - it is not wifi' },
    ],
    safety_and_property: [
      { item: 'Breathable air', available: false, note: 'Exopack provided' },
      { item: 'Predator deterrent system', available: true, note: 'Mostly effective' },
      { item: 'Emergency beacon', available: true, note: 'Range: 4.37 light-years' },
      { item: 'First aid kit', available: true, note: 'Pandoran flora remedies included' },
    ],
    cancellation_highlight: 'Free cancellation up to 7 days before interstellar departure',
  },
  [LISTING_IDS.EGYPT]: {
    house_rules: [
      { rule: 'Offerings to household gods appreciated but optional' },
      { rule: 'Nile access included - crocodiles are the Niles responsibility' },
      { rule: 'Papyrus scrolls in the library are for reading, not souvenirs' },
      { rule: 'Sun protection is YOUR responsibility' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: false, note: 'Servants monitor for fires' },
      { item: 'First aid kit', available: true, note: 'Includes mummification basics' },
      { item: 'Curse protection', available: false, note: 'Not our department' },
      { item: 'Sunscreen', available: false, note: 'Bring your own or suffer' },
    ],
    cancellation_highlight: 'Free cancellation up to 5 days before your journey to antiquity',
  },
  [LISTING_IDS.ALEXANDER]: {
    house_rules: [
      { rule: 'War councils begin at 4am. Attendance optional but respected.' },
      { rule: 'Weapons must be peace-bonded within the commanders tent' },
      { rule: 'The good wine is for victories only' },
      { rule: 'Horses have priority in camp pathways' },
    ],
    safety_and_property: [
      { item: 'Guard rotation', available: true, note: '24/7 perimeter security' },
      { item: 'Medical tent', available: true, note: 'Battlefield surgeons on staff' },
      { item: 'Fire suppression', available: false, note: 'Its a tent. Be careful.' },
      { item: 'Escape route', available: true, note: 'Alexander does not retreat, but guests may' },
    ],
    cancellation_highlight: 'Free cancellation up to 3 days before campaign departure',
  },
  [LISTING_IDS.NYC_90S]: {
    house_rules: [
      { rule: 'Coasters are NOT optional' },
      { rule: 'The guest towels are decorative. DO NOT USE THEM.' },
      { rule: 'VHS tapes must be rewound before returning' },
      { rule: 'Long distance calls will be billed - and yes, I check' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: true, note: '9-volt battery (included)' },
      { item: 'Fire extinguisher', available: true, note: 'Under the kitchen sink' },
      { item: 'First aid kit', available: true, note: 'Organized by injury type, alphabetically' },
      { item: 'Carbon monoxide detector', available: true, note: 'State of the art for 1994' },
    ],
    cancellation_highlight: 'Free cancellation up to 2 days before your trip to the pre-internet era',
  },
};

// Monica's updated description WITH house rules integrated
const monicaDescription = `Head chef, cleaning enthusiast, and proud owner of the most organized apartment in Manhattan. I know what you are thinking - yes, the categories in the bathroom closet ARE color-coded. This SoHo loft has been cleaned to my exacting standards, which means you could eat off any surface. Literally. I have tested this. The kitchen is fully stocked, the towels are folded into swans, and if you move anything, I will know. I WILL KNOW.

A few things to know about staying here: Coasters are NOT optional. The guest towels are decorative - DO NOT USE THEM. Shoes off at the door, and yes, this includes your socks if they look dirty. The labeled containers in the fridge? Those labels are there for a reason.`;

async function main() {
  console.log('Starting fixes...\n');

  // ============================================================================
  // FIX 1: Update Things to Know (remove icons)
  // ============================================================================
  console.log('FIX 1: Removing icons from Things to Know sections\n');

  for (const [listingId, data] of Object.entries(thingsToKnowNoIcons)) {
    const { error } = await supabase
      .from('listings')
      .update({
        things_to_know: data,
      })
      .eq('id', listingId);

    if (error) {
      console.error(`Error updating listing ${listingId}:`, error.message);
    } else {
      console.log(`Updated Things to Know for listing ${listingId.slice(0, 8)}...`);
    }
  }

  // ============================================================================
  // FIX 2: Update Monica's description and remove house_rules_quirks
  // ============================================================================
  console.log('\nFIX 2: Updating Monica Geller host description\n');

  const { error: monicaError } = await supabase
    .from('hosts')
    .update({
      description: monicaDescription,
      house_rules_quirks: null, // Remove the separate quirks
    })
    .eq('name', 'Monica Geller');

  if (monicaError) {
    console.error('Error updating Monica:', monicaError.message);
  } else {
    console.log('Updated Monica Geller description (house rules now in description)');
  }

  // Also clear house_rules_quirks for all other hosts
  const { error: clearQuirksError } = await supabase
    .from('hosts')
    .update({
      house_rules_quirks: null,
    })
    .neq('name', 'Monica Geller');

  if (clearQuirksError) {
    console.error('Error clearing quirks for other hosts:', clearQuirksError.message);
  } else {
    console.log('Cleared house_rules_quirks for all other hosts');
  }

  console.log('\nAll fixes completed!');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
