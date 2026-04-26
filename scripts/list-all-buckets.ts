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

async function listBuckets() {
  console.log('📦 Listing all Supabase Storage buckets...\n');

  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!buckets || buckets.length === 0) {
    console.log('No buckets found (or permission denied)');
    return;
  }

  console.log(`Found ${buckets.length} bucket(s):\n`);

  for (const bucket of buckets) {
    console.log(`📁 ${bucket.name}`);
    console.log(`   Public: ${bucket.public}`);
    console.log(`   ID: ${bucket.id}`);
    console.log(`   Created: ${bucket.created_at}`);

    // Try to list some files
    const { data: files } = await supabase.storage
      .from(bucket.name)
      .list('', { limit: 5 });

    if (files && files.length > 0) {
      console.log(`   Files: ${files.length} (showing first 5):`);
      files.forEach(f => console.log(`     - ${f.name}`));
    }
    console.log();
  }
}

listBuckets();
