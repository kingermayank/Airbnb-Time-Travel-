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
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'listing-images';

async function diagnose() {
  console.log('🔍 Diagnosing picker image storage...\n');
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Bucket: ${BUCKET}\n`);

  // Check if bucket exists and is public
  console.log('📦 Checking bucket configuration...');
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    console.error('❌ Error listing buckets:', bucketsError);
    return;
  }

  const bucket = buckets?.find(b => b.name === BUCKET);
  if (!bucket) {
    console.error(`❌ Bucket "${BUCKET}" not found!`);
    console.log('Available buckets:', buckets?.map(b => b.name).join(', '));
    return;
  }

  console.log(`✅ Bucket "${BUCKET}" exists`);
  console.log(`   Public: ${bucket.public}`);
  console.log(`   Created: ${bucket.created_at}\n`);

  if (!bucket.public) {
    console.warn('⚠️  WARNING: Bucket is NOT public! Images will not load without authentication.\n');
  }

  // Check theme images
  console.log('🎨 Checking theme images...');
  const themes = ['grandeur', 'sci-fi', 'myth', 'conflict', 'classified'];

  for (const themeId of themes) {
    const path = `picker/themes/${themeId}.png`;
    const { data: exists } = await supabase.storage
      .from(BUCKET)
      .list('picker/themes', {
        search: `${themeId}.png`,
      });

    if (exists && exists.length > 0) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      console.log(`   ✅ ${themeId}.png`);
      console.log(`      ${data.publicUrl}`);

      // Try to fetch it
      try {
        const response = await fetch(data.publicUrl);
        if (!response.ok) {
          console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.log(`      ❌ Fetch failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      console.log(`   ❌ ${themeId}.png NOT FOUND`);
    }
  }

  // Check era images
  console.log('\n📅 Checking era images...');
  const eras = ['origins', 'classical', 'recent-past', 'future'];

  for (const eraId of eras) {
    const path = `picker/eras/${eraId}.png`;
    const { data: exists } = await supabase.storage
      .from(BUCKET)
      .list('picker/eras', {
        search: `${eraId}.png`,
      });

    if (exists && exists.length > 0) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      console.log(`   ✅ ${eraId}.png`);
      console.log(`      ${data.publicUrl}`);

      // Try to fetch it
      try {
        const response = await fetch(data.publicUrl);
        if (!response.ok) {
          console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (err) {
        console.log(`      ❌ Fetch failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      console.log(`   ❌ ${eraId}.png NOT FOUND`);
    }
  }

  console.log('\n📋 Summary:');
  console.log('If images exist but return HTTP 400/403/404, the bucket may need to be made public.');
  console.log('To make bucket public, go to Supabase Dashboard → Storage → listing-images → Settings → Make public');
}

diagnose().catch(console.error);
