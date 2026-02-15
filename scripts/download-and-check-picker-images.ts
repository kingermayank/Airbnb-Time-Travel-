/**
 * Download picker images from Supabase and check if they're placeholders or real images
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
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

const BUCKET = 'listing-images';

const IMAGES = [
  'picker/themes/grandeur.png',
  'picker/themes/sci-fi.png',
  'picker/themes/myth.png',
  'picker/themes/conflict.png',
  'picker/themes/classified.png',
  'picker/eras/origins.png',
  'picker/eras/classical.png',
  'picker/eras/recent-past.png',
  'picker/eras/future.png',
];

async function checkImage(storagePath: string) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const url = data.publicUrl;

  console.log(`\n📸 ${storagePath}`);
  console.log(`   URL: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    const size = buffer.byteLength;

    console.log(`   ✅ HTTP 200`);
    console.log(`   Size: ${(size / 1024).toFixed(2)} KB`);

    // Placeholder images are very small (around 1-2 KB)
    // Real images should be much larger (30-90 KB based on your images)
    if (size < 5000) {
      console.log(`   ⚠️  LIKELY PLACEHOLDER (too small)`);
    } else {
      console.log(`   ✅ LIKELY REAL IMAGE (good size)`);
    }

    // Save to temp directory for manual inspection
    const tempDir = path.join(__dirname, '..', 'temp-picker-downloads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filename = storagePath.replace(/\//g, '_');
    const filepath = path.join(tempDir, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`   💾 Saved to: temp-picker-downloads/${filename}`);

  } catch (err) {
    console.log(`   ❌ Fetch failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function main() {
  console.log('🔍 Checking picker images in Supabase Storage...\n');
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Supabase URL: ${supabaseUrl}\n`);

  for (const imagePath of IMAGES) {
    await checkImage(imagePath);
  }

  console.log('\n✅ Done! Check temp-picker-downloads/ folder to see the actual images.');
  console.log('   If they show letters, they are placeholders.');
  console.log('   If they show real images, Supabase has the correct files.');
}

main();
