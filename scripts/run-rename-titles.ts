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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

const RENAMES: Array<{ oldPattern: string; newTitle: string }> = [
  { oldPattern: 'The Lost Atlantean Crystal Villa', newTitle: 'Crystal Villa, Atlantis' },
  { oldPattern: '1990s Manhattan Loft in Pre-Internet NYC', newTitle: 'Manhattan Loft, New York' },
  { oldPattern: "Alexander the Great's Campaign Tent", newTitle: "Alexander's Campaign Tent, Persia" },
  { oldPattern: "Shah Jahan's Marble Suite", newTitle: "Shah Jahan's Marble Suite, Agra" },
  { oldPattern: 'SpaceX Mars Colony Pod at Olympus Mons', newTitle: 'Mars Colony Pod, Olympus Mons' },
  { oldPattern: 'Titanic First-Class Suite', newTitle: 'First-Class Suite, RMS Titanic' },
  { oldPattern: 'Pandora Floating Mountain Bungalow', newTitle: 'Floating Mountain Bungalow, Pandora' },
  { oldPattern: 'Ancient Egyptian Nile Villa', newTitle: 'Nile Villa, Ancient Egypt' },
  { oldPattern: 'WWII German Resistance Safehouse Loft', newTitle: 'Resistance Safehouse Loft, Berlin' },
  { oldPattern: 'Lunar Hilton Penthouse', newTitle: 'Lunar Hilton Penthouse, Moon' },
  { oldPattern: 'Federation Ambassador Suite', newTitle: 'Federation Ambassador Suite, Earth' },
  { oldPattern: 'Bermuda Triangle Research Platform', newTitle: 'Research Platform, Bermuda Triangle' },
  { oldPattern: 'Area 51 Classified Barracks', newTitle: 'Classified Barracks, Area 51' },
  { oldPattern: 'Premium Cave Dwelling', newTitle: 'Cave Dwelling, Lascaux' },
  { oldPattern: 'Neo-Showa Capsule Pod', newTitle: 'Neo-Showa Capsule Pod, Parallel Tokyo' },
];

async function main() {
  console.log('Renaming listing titles in Supabase...\n');

  for (const { oldPattern, newTitle } of RENAMES) {
    const { data, error } = await supabase
      .from('listings')
      .update({ title: newTitle })
      .ilike('title', `${oldPattern}%`)
      .select('id, title');

    if (error) {
      console.error(`  FAILED: ${oldPattern} -> ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`  Renamed: "${oldPattern}%" -> "${newTitle}" (${data.length} row)`);
    } else {
      console.log(`  Skipped: "${oldPattern}%" (no matching row found)`);
    }
  }

  console.log('\nDone! Verifying final titles:\n');

  const { data: all } = await supabase
    .from('listings')
    .select('title')
    .order('title');

  if (all) {
    all.forEach((l, i) => console.log(`  ${i + 1}. ${l.title}`));
  }
}

main().catch(console.error);
