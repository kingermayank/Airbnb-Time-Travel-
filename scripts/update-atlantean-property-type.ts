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

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Atlantean Crystal Villa listing ID
const ATLANTEAN_LISTING_ID = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';

async function main() {
  console.log('🔄 Updating property type for Lost Atlantean Crystal Villa\n');
  console.log(`📍 Listing ID: ${ATLANTEAN_LISTING_ID}\n`);

  // Update property_type from "Entire underwater villa" to "Entire Atlantean crystal villa"
  const { data, error } = await supabase
    .from('listings')
    .update({ property_type: 'Entire Atlantean crystal villa' })
    .eq('id', ATLANTEAN_LISTING_ID)
    .select('id, title, property_type')
    .single();

  if (error) {
    console.error('❌ Error updating property type:', error.message);
    return;
  }

  if (!data) {
    console.error('❌ No listing found with that ID');
    return;
  }

  console.log('✅ Successfully updated property type!');
  console.log(`   Listing: ${data.title}`);
  console.log(`   Property Type: ${data.property_type}`);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
