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
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'a1b2c3d4-e5f6-7890-abcd-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-333333333333',
  'a1b2c3d4-e5f6-7890-abcd-444444444444',
  'a1b2c3d4-e5f6-7890-abcd-555555555555',
  'a1b2c3d4-e5f6-7890-abcd-666666666666',
  'a1b2c3d4-e5f6-7890-abcd-777777777777',
  'a1b2c3d4-e5f6-7890-abcd-888888888888',
];

async function verify() {
  console.log('\n📋 Verifying Phase 4 Listings in Database\n');
  console.log('='.repeat(60));

  // Check listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title, host_id, overall_rating, total_reviews')
    .in('id', PHASE4_LISTING_IDS);

  if (listingsError) {
    console.error('Error fetching listings:', listingsError);
    return;
  }

  console.log(`\n✅ Found ${listings?.length || 0} listings:\n`);

  for (const listing of listings || []) {
    // Get host name
    const { data: host } = await supabase
      .from('hosts')
      .select('name')
      .eq('id', listing.host_id)
      .single();

    // Count actual reviews
    const { count: reviewCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listing.id);

    console.log(`📍 ${listing.title}`);
    console.log(`   Host: ${host?.name || 'Unknown'}`);
    console.log(`   Rating: ${listing.overall_rating} | Reviews: ${reviewCount}`);
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('\n💡 Next: Run generate-phase4-avatars.ts to generate host/reviewer images');
}

verify().catch(console.error);
