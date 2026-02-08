import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

const MARS_LISTING_ID = '10b2efa4-819b-4a10-99a0-1f5dc580b080';
const SOURCE_FOLDER = path.join(__dirname, '..', 'images', 'SpaceX Mars Colony Pod — Olympus Mons Base, 2150');
const OUTPUT_FOLDER = path.join(__dirname, '..', 'images', 'processed-mars-final');

// Target dimensions - all images will be resized to this width
const TARGET_WIDTH = 1024;
// How much to crop from bottom to remove watermark
const BOTTOM_CROP = 40;

const imageConfigs = [
  { filename: 'Cover.png', newFilename: 'cover.jpg', caption: 'Mars Habitat Exterior', order: 1 },
  { filename: 'living room..jpg', newFilename: 'living-room.jpg', caption: 'Living Room', order: 2 },
  { filename: 'bedroom.jpg', newFilename: 'bedroom.jpg', caption: 'Bedroom', order: 3 },
  { filename: 'kitchen..jpg', newFilename: 'kitchen.jpg', caption: 'Kitchen', order: 4 },
  { filename: 'restroom.jpg', newFilename: 'restroom.jpg', caption: 'Bathroom', order: 5 },
  { filename: 'desk.jpg', newFilename: 'desk.jpg', caption: 'Workspace', order: 6 },
];

async function processImage(inputPath: string, outputPath: string): Promise<void> {
  // Get image metadata
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  console.log(`   Original: ${width}x${height}`);

  // Calculate new dimensions after resize
  const scale = TARGET_WIDTH / width;
  const newHeight = Math.round(height * scale);

  // Crop from bottom to remove watermark
  const finalHeight = newHeight - BOTTOM_CROP;

  console.log(`   Resizing to: ${TARGET_WIDTH}x${newHeight}`);
  console.log(`   Cropping bottom ${BOTTOM_CROP}px -> Final: ${TARGET_WIDTH}x${finalHeight}`);

  await sharp(inputPath)
    .resize(TARGET_WIDTH, newHeight)
    .extract({ left: 0, top: 0, width: TARGET_WIDTH, height: finalHeight })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}

async function uploadToSupabase(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);

    console.log(`   📤 Uploading to: ${storagePath}`);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error(`   ❌ Upload error:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    const urlWithCacheBust = `${urlData.publicUrl}?v=${Date.now()}`;
    console.log(`   ✅ Uploaded`);
    return urlWithCacheBust;
  } catch (error) {
    console.error(`   ❌ Exception:`, error);
    return null;
  }
}

async function clearExistingImages(listingId: string): Promise<void> {
  console.log(`🗑️  Clearing existing images...`);
  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('listing_id', listingId);

  if (error) {
    console.error(`❌ Error clearing:`, error.message);
  } else {
    console.log(`✅ Cleared existing images\n`);
  }
}

async function insertImageRecord(listingId: string, imageUrl: string, order: number, caption: string): Promise<void> {
  const { error } = await supabase
    .from('listing_images')
    .insert({
      listing_id: listingId,
      image_url: imageUrl,
      image_order: order,
      caption: caption,
    });

  if (error) {
    console.error(`   ❌ DB insert error:`, error.message);
  } else {
    console.log(`   ✅ Added to database`);
  }
}

async function updateMainImage(listingId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .update({ main_image: imageUrl })
    .eq('id', listingId);

  if (error) {
    console.error(`❌ Error updating main image:`, error.message);
  } else {
    console.log(`✅ Updated main listing image\n`);
  }
}

async function main() {
  console.log('🚀 Processing Mars Colony Pod images\n');
  console.log(`📁 Source: ${SOURCE_FOLDER}`);
  console.log(`📁 Output: ${OUTPUT_FOLDER}\n`);

  // Create output folder
  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
  }

  // Clear existing images
  await clearExistingImages(MARS_LISTING_ID);

  let mainImageUrl: string | null = null;

  for (const config of imageConfigs) {
    console.log(`${'='.repeat(50)}`);
    console.log(`🖼️  ${config.filename} → ${config.newFilename}`);
    console.log(`${'='.repeat(50)}`);

    const inputPath = path.join(SOURCE_FOLDER, config.filename);
    const outputPath = path.join(OUTPUT_FOLDER, config.newFilename);

    if (!fs.existsSync(inputPath)) {
      console.error(`   ❌ File not found: ${inputPath}`);
      continue;
    }

    // Process image (resize + crop watermark)
    await processImage(inputPath, outputPath);

    // Upload to Supabase
    const storagePath = `${MARS_LISTING_ID}/processed-${config.newFilename}`;
    const supabaseUrl = await uploadToSupabase(outputPath, storagePath);

    if (!supabaseUrl) continue;

    // Insert into database
    await insertImageRecord(MARS_LISTING_ID, supabaseUrl, config.order, config.caption);

    if (config.order === 1) {
      mainImageUrl = supabaseUrl;
    }

    console.log('');
  }

  // Update main image
  if (mainImageUrl) {
    await updateMainImage(MARS_LISTING_ID, mainImageUrl);
  }

  console.log('✅ All images processed and uploaded!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
