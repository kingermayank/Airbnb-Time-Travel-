import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PHASE4_LISTING_IDS = [
  'a1b2c3d4-e5f6-7890-abcd-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-555555555555',
  'a1b2c3d4-e5f6-7890-abcd-666666666666',
  'a1b2c3d4-e5f6-7890-abcd-777777777777',
  'a1b2c3d4-e5f6-7890-abcd-888888888888',
];

const PHASE4_HOST_IDS = [
  'b1c2d3e4-f5a6-7890-bcde-333333333333',
  'b1c2d3e4-f5a6-7890-bcde-555555555555',
  'b1c2d3e4-f5a6-7890-bcde-666666666666',
  'b1c2d3e4-f5a6-7890-bcde-777777777777',
  'b1c2d3e4-f5a6-7890-bcde-888888888888',
];

async function fixJsonFields() {
  console.log('🔧 Fixing double-stringified JSON fields in Phase 4 listings...\n');

  // Fix listings
  for (const listingId of PHASE4_LISTING_IDS) {
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('id, title, key_features, things_to_know, sleeping_arrangements')
      .eq('id', listingId)
      .single();

    if (fetchError || !listing) {
      console.log(`⚠️ Listing ${listingId} not found or error:`, fetchError?.message);
      continue;
    }

    console.log(`\n📝 Fixing: ${listing.title}`);

    // Parse the double-stringified JSON fields
    let keyFeatures = listing.key_features;
    let thingsToKnow = listing.things_to_know;
    let sleepingArrangements = listing.sleeping_arrangements;

    // If they're strings (double-encoded), parse them
    if (typeof keyFeatures === 'string') {
      try {
        keyFeatures = JSON.parse(keyFeatures);
        console.log('   ✅ Parsed key_features');
      } catch (e) {
        console.log('   ⚠️ key_features already parsed or invalid');
      }
    }

    if (typeof thingsToKnow === 'string') {
      try {
        thingsToKnow = JSON.parse(thingsToKnow);
        console.log('   ✅ Parsed things_to_know');
      } catch (e) {
        console.log('   ⚠️ things_to_know already parsed or invalid');
      }
    }

    if (typeof sleepingArrangements === 'string') {
      try {
        sleepingArrangements = JSON.parse(sleepingArrangements);
        console.log('   ✅ Parsed sleeping_arrangements');
      } catch (e) {
        console.log('   ⚠️ sleeping_arrangements already parsed or invalid');
      }
    }

    // Update with properly parsed JSON
    const { error: updateError } = await supabase
      .from('listings')
      .update({
        key_features: keyFeatures,
        things_to_know: thingsToKnow,
        sleeping_arrangements: sleepingArrangements,
      })
      .eq('id', listingId);

    if (updateError) {
      console.log(`   ❌ Error updating listing:`, updateError.message);
    } else {
      console.log(`   ✅ Updated listing successfully`);
    }
  }

  // Fix hosts (badges and house_rules_quirks)
  console.log('\n\n🔧 Fixing double-stringified JSON fields in Phase 4 hosts...\n');

  for (const hostId of PHASE4_HOST_IDS) {
    const { data: host, error: fetchError } = await supabase
      .from('hosts')
      .select('id, name, badges, house_rules_quirks')
      .eq('id', hostId)
      .single();

    if (fetchError || !host) {
      console.log(`⚠️ Host ${hostId} not found or error:`, fetchError?.message);
      continue;
    }

    console.log(`\n👤 Fixing: ${host.name}`);

    let badges = host.badges;
    let houseRulesQuirks = host.house_rules_quirks;

    if (typeof badges === 'string') {
      try {
        badges = JSON.parse(badges);
        console.log('   ✅ Parsed badges');
      } catch (e) {
        console.log('   ⚠️ badges already parsed or invalid');
      }
    }

    if (typeof houseRulesQuirks === 'string') {
      try {
        houseRulesQuirks = JSON.parse(houseRulesQuirks);
        console.log('   ✅ Parsed house_rules_quirks');
      } catch (e) {
        console.log('   ⚠️ house_rules_quirks already parsed or invalid');
      }
    }

    const { error: updateError } = await supabase
      .from('hosts')
      .update({
        badges: badges,
        house_rules_quirks: houseRulesQuirks,
      })
      .eq('id', hostId);

    if (updateError) {
      console.log(`   ❌ Error updating host:`, updateError.message);
    } else {
      console.log(`   ✅ Updated host successfully`);
    }
  }

  // Fix reviews (badges)
  console.log('\n\n🔧 Fixing double-stringified JSON fields in Phase 4 reviews...\n');

  for (const listingId of PHASE4_LISTING_IDS) {
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, reviewer_name, badges')
      .eq('listing_id', listingId);

    if (fetchError || !reviews) {
      console.log(`⚠️ No reviews found for listing ${listingId}`);
      continue;
    }

    for (const review of reviews) {
      let badges = review.badges;

      if (typeof badges === 'string') {
        try {
          badges = JSON.parse(badges);

          const { error: updateError } = await supabase
            .from('reviews')
            .update({ badges: badges })
            .eq('id', review.id);

          if (updateError) {
            console.log(`   ❌ Error updating review by ${review.reviewer_name}:`, updateError.message);
          } else {
            console.log(`   ✅ Fixed badges for review by: ${review.reviewer_name}`);
          }
        } catch (e) {
          // Already parsed or null
        }
      }
    }
  }

  console.log('\n\n✅ JSON field fixes complete!');
  console.log('\n💡 The listings should now display correctly in the app.');
}

fixJsonFields().catch(console.error);
