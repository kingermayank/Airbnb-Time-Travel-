/**
 * One-off: Upload new cover image for Mars Olympus listing and update DB.
 * Run: npx tsx scripts/update-mars-olympus-cover.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !(supabaseServiceKey || supabaseAnonKey)) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey!
);

const MARS_LISTING_ID = '10b2efa4-819b-4a10-99a0-1f5dc580b080';
const COVER_PATH = path.join(__dirname, '..', 'images', 'mars-olympus-cover.png');
const STORAGE_PATH = `${MARS_LISTING_ID}/cover.png`;

async function main() {
  console.log('🪐 Updating Mars Olympus listing cover image\n');

  if (!fs.existsSync(COVER_PATH)) {
    console.error(`❌ Cover image not found: ${COVER_PATH}`);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(COVER_PATH);
  console.log(`📤 Uploading to Supabase storage: ${STORAGE_PATH}`);

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(STORAGE_PATH, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('❌ Upload failed:', uploadError.message);
    process.exit(1);
  }

  const { data: urlData } = supabase.storage
    .from('listing-images')
    .getPublicUrl(STORAGE_PATH);

  const newCoverUrl = urlData.publicUrl;
  console.log(`✅ Uploaded: ${newCoverUrl}`);

  console.log('\n📝 Updating listings.main_image and thumbnail_image...');
  const { error: listingError } = await supabase
    .from('listings')
    .update({
      main_image: newCoverUrl,
      thumbnail_image: newCoverUrl,
    })
    .eq('id', MARS_LISTING_ID);

  if (listingError) {
    console.error('❌ Failed to update listing:', listingError.message);
    process.exit(1);
  }
  console.log('✅ Listing main_image and thumbnail_image updated.');

  console.log('\n📝 Updating listing_images (cover row)...');
  const { error: imgError } = await supabase
    .from('listing_images')
    .update({ image_url: newCoverUrl })
    .eq('listing_id', MARS_LISTING_ID)
    .eq('image_order', 1);

  if (imgError) {
    console.error('❌ Failed to update listing_images:', imgError.message);
    process.exit(1);
  }
  console.log('✅ Cover row in listing_images updated.');

  console.log('\n🎉 Mars Olympus cover image replaced successfully.');
}

main();
