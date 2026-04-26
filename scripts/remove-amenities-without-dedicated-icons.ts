/**
 * Removes from the database all amenities that do not have a dedicated icon
 * in the frontend mapping (src/lib/amenity-icons.ts).
 *
 * Run: npx tsx scripts/remove-amenities-without-dedicated-icons.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { hasDedicatedAmenityIcon } from '../src/lib/amenity-icons';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

async function main() {
  console.log('Fetching all amenities...');
  const { data: amenities, error: fetchError } = await supabase
    .from('amenities')
    .select('id, name');

  if (fetchError) {
    console.error('❌ Error fetching amenities:', fetchError.message);
    process.exit(1);
  }

  const withoutDedicatedIcon = (amenities || []).filter(
    (a) => !hasDedicatedAmenityIcon(a.name)
  );

  if (withoutDedicatedIcon.length === 0) {
    console.log('✅ All amenities have dedicated icons. Nothing to remove.');
    return;
  }

  console.log(`Found ${withoutDedicatedIcon.length} amenities without dedicated icons (of ${amenities?.length ?? 0} total).`);
  console.log('Examples:', withoutDedicatedIcon.slice(0, 5).map((a) => a.name).join(', '));

  const idsToRemove = withoutDedicatedIcon.map((a) => a.id);

  console.log('\nRemoving from listing_amenities...');
  const { error: deleteJunctionError } = await supabase
    .from('listing_amenities')
    .delete()
    .in('amenity_id', idsToRemove);

  if (deleteJunctionError) {
    console.error('❌ Error deleting listing_amenities:', deleteJunctionError.message);
    process.exit(1);
  }
  console.log('✅ Removed listing_amenities rows.');

  console.log('Removing from amenities...');
  const { error: deleteAmenitiesError } = await supabase
    .from('amenities')
    .delete()
    .in('id', idsToRemove);

  if (deleteAmenitiesError) {
    console.error('❌ Error deleting amenities:', deleteAmenitiesError.message);
    process.exit(1);
  }
  console.log(`✅ Removed ${idsToRemove.length} amenities without dedicated icons.`);
}

main();
