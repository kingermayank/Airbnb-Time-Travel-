/**
 * Create the listing-images bucket and upload picker images.
 * Run: npx tsx scripts/setup-storage-bucket.ts
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { config } from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'listing-images';
const SIZE = 80;

const THEMES = [
  { id: 'grandeur', letter: 'G' },
  { id: 'sci-fi', letter: 'S' },
  { id: 'myth', letter: 'M' },
  { id: 'conflict', letter: 'C' },
  { id: 'classified', letter: 'X' },
];

const ERAS = [
  { id: 'origins', letter: 'O' },
  { id: 'classical', letter: 'C' },
  { id: 'recent-past', letter: 'R' },
  { id: 'future', letter: 'F' },
];

async function createPngBuffer(letter: string): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="32" font-family="system-ui,sans-serif">${letter}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function ensureBucket() {
  console.log(`🪣 Checking if bucket "${BUCKET}" exists...`);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('❌ Error listing buckets:', listError);
    throw listError;
  }

  const exists = buckets?.some(b => b.name === BUCKET);

  if (exists) {
    console.log(`✅ Bucket "${BUCKET}" already exists`);

    // Check if it's public
    const bucket = buckets?.find(b => b.name === BUCKET);
    if (bucket && !bucket.public) {
      console.log(`📢 Making bucket "${BUCKET}" public...`);
      const { error: updateError } = await supabase.storage.updateBucket(BUCKET, {
        public: true,
      });

      if (updateError) {
        console.error('❌ Error making bucket public:', updateError);
        console.log('\n⚠️  Please make the bucket public manually:');
        console.log('   1. Go to Supabase Dashboard → Storage');
        console.log(`   2. Click on "${BUCKET}"`);
        console.log('   3. Settings → Make public');
      } else {
        console.log(`✅ Bucket "${BUCKET}" is now public`);
      }
    }
    return;
  }

  console.log(`📦 Creating bucket "${BUCKET}"...`);

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
  });

  if (createError) {
    console.error('❌ Error creating bucket:', createError);
    throw createError;
  }

  console.log(`✅ Created bucket "${BUCKET}" (public)`);
}

async function uploadPng(storagePath: string, letter: string): Promise<void> {
  const buffer = await createPngBuffer(letter);

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: 'image/png',
    upsert: true,
  });

  if (error) {
    console.error(`❌ ${storagePath}:`, error.message);
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(`✅ ${storagePath}`);
  console.log(`   ${data.publicUrl}`);
}

async function main() {
  console.log('🚀 Setting up Supabase Storage for picker images...\n');

  // Step 1: Ensure bucket exists and is public
  await ensureBucket();

  console.log('\n📤 Uploading picker images...\n');

  // Step 2: Upload theme images
  console.log('🎨 Uploading theme images...');
  for (const t of THEMES) {
    await uploadPng(`picker/themes/${t.id}.png`, t.letter);
  }

  // Step 3: Upload era images
  console.log('\n📅 Uploading era images...');
  for (const e of ERAS) {
    await uploadPng(`picker/eras/${e.id}.png`, e.letter);
  }

  console.log('\n✅ Setup complete!');
  console.log('\n🔗 Test a URL:');
  console.log(`   ${supabaseUrl}/storage/v1/object/public/${BUCKET}/picker/themes/grandeur.png`);
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err);
  process.exit(1);
});
