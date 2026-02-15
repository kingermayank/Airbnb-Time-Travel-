import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFolder(folder: string) {
  const { data, error } = await supabase.storage
    .from('listing-images')
    .list(folder, { limit: 100 });

  if (error) {
    console.error(`Error listing ${folder}:`, error);
    return;
  }

  console.log(`\n📂 ${folder}/`);
  data?.forEach(item => {
    console.log(`   ${item.name}`);
  });
}

async function main() {
  console.log('🔍 Checking Filter folder contents...');

  await listFolder('Filter');
  await listFolder('Filter/Era');
  await listFolder('Filter/Themes');
}

main();
