/**
 * Upload theme and era picker placeholder images (PNGs) to Supabase Storage.
 * Run: npm run upload-picker-images
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local.
 */

import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env.local');
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

/** Generate 80x80 PNG: gray background with centered letter (Supabase often restricts SVG). */
async function createPngBuffer(letter: string): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="32" font-family="system-ui,sans-serif">${letter}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function uploadPng(storagePath: string, letter: string): Promise<string | null> {
  const buffer = await createPngBuffer(letter);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: 'image/png',
    upsert: true,
  });
  if (error) {
    console.error(`❌ ${storagePath}:`, error.message);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(`✅ ${storagePath}`);
  return data.publicUrl;
}

async function main() {
  console.log('📤 Uploading picker images (PNG) to Supabase Storage...\n');

  for (const t of THEMES) {
    await uploadPng(`picker/themes/${t.id}.png`, t.letter);
  }
  for (const e of ERAS) {
    await uploadPng(`picker/eras/${e.id}.png`, e.letter);
  }

  console.log('\n✅ Done. App will load these when VITE_SUPABASE_URL is set.');
  console.log(`   Example: ${supabaseUrl}/storage/v1/object/public/${BUCKET}/picker/themes/grandeur.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
