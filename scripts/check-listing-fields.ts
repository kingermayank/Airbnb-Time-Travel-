import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function check() {
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, key_features, things_to_know, sleeping_arrangements')
    .eq('id', 'a1b2c3d4-e5f6-7890-abcd-111111111111')
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Listing:', data.title);
  console.log('\nkey_features type:', typeof data.key_features);
  console.log('key_features value:', JSON.stringify(data.key_features, null, 2));
  console.log('\nthings_to_know type:', typeof data.things_to_know);
  console.log('things_to_know value:', JSON.stringify(data.things_to_know, null, 2));
  console.log('\nsleeping_arrangements type:', typeof data.sleeping_arrangements);
  console.log('sleeping_arrangements value:', JSON.stringify(data.sleeping_arrangements, null, 2));
}

check();
