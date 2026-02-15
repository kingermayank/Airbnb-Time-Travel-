import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFolders() {
  console.log('📁 Listing folders in listing-images bucket...\n');

  // List top level
  const { data: topLevel, error } = await supabase.storage
    .from('listing-images')
    .list('', { limit: 100 });

  if (error) {
    console.error('Error:', error);
    return;
  }

  for (const item of topLevel || []) {
    console.log(`📂 ${item.name}`);

    // If it's a folder, list its contents
    if (item.id === null) {
      const { data: subItems } = await supabase.storage
        .from('listing-images')
        .list(item.name, { limit: 20 });

      if (subItems) {
        subItems.forEach(sub => {
          console.log(`   - ${sub.name}`);
        });
      }
    }
  }
}

listFolders();
