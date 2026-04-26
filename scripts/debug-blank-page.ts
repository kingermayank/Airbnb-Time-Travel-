import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

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

async function debug() {
  console.log('🔍 Debugging Phase 4 listings data...\n');

  for (const id of PHASE4_LISTING_IDS) {
    console.log(`
Listing ID: ${id}`);
    
    // Fetch listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*, hosts(*)')
      .eq('id', id)
      .single();

    if (listingError) {
      console.error(`  ❌ Error fetching listing: ${listingError.message}`);
      continue;
    }

    console.log(`  Title: ${listing.title}`);
    console.log(`  Host: ${listing.hosts?.name || 'NULL'}`);
    if (listing.hosts) {
      console.log(`  Host house_rules_quirks type: ${typeof listing.hosts.house_rules_quirks} (Array? ${Array.isArray(listing.hosts.house_rules_quirks)})`);
      console.log(`  Host badges type: ${typeof listing.hosts.badges} (Array? ${Array.isArray(listing.hosts.badges)})`);
    }
    
    // Check JSON fields types
    console.log(`  key_features type: ${typeof listing.key_features} (Array? ${Array.isArray(listing.key_features)})`);
    console.log(`  things_to_know type: ${typeof listing.things_to_know} (Object? ${listing.things_to_know !== null && typeof listing.things_to_know === 'object'})`);
    console.log(`  sleeping_arrangements type: ${typeof listing.sleeping_arrangements} (Array? ${Array.isArray(listing.sleeping_arrangements)})`);
    if (Array.isArray(listing.sleeping_arrangements)) {
      console.log(`  sleeping_arrangements length: ${listing.sleeping_arrangements.length}`);
    }

    // Fetch amenities
    const { data: amenities, error: amenitiesError } = await supabase
      .from('listing_amenities')
      .select('amenities(*)')
      .eq('listing_id', id);

    if (amenitiesError) {
      console.error(`  ❌ Error fetching amenities: ${amenitiesError.message}`);
    } else {
      console.log(`  Amenities count: ${amenities?.length || 0}`);
      const invalidAmenities = (amenities || []).filter(a => !a.amenities || !a.amenities.name);
      if (invalidAmenities.length > 0) {
        console.error(`  ❌ Found ${invalidAmenities.length} invalid amenities (missing name or record)`);
      }
    }

    // Fetch reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', id);

    if (reviewsError) {
      console.error(`  ❌ Error fetching reviews: ${reviewsError.message}`);
    } else {
      console.log(`  Reviews count: ${reviews?.length || 0}`);
      const invalidReviews = (reviews || []).filter(r => !r.reviewer_name);
      if (invalidReviews.length > 0) {
        console.error(`  ❌ Found ${invalidReviews.length} invalid reviews (missing reviewer_name)`);
      }
    }
  }
}

debug().catch(console.error);
