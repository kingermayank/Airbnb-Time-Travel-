import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Thumbnail settings
const THUMBNAIL_WIDTH = 1500; // High resolution for crisp display on large screens and retina displays
const THUMBNAIL_QUALITY = 90; // Very high quality to eliminate pixelation

/**
 * Download image from URL to local file
 */
async function downloadImage(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(arrayBuffer));
}

/**
 * Create thumbnail from image URL
 */
async function createThumbnailFromUrl(imageUrl: string, outputPath: string): Promise<void> {
  try {
    // Download the image first
    const tempPath = outputPath.replace('.webp', '_temp.webp');
    await downloadImage(imageUrl, tempPath);

    const metadata = await sharp(tempPath).metadata();
    const originalSize = fs.statSync(tempPath).size / 1024;

    await sharp(tempPath)
      .resize(THUMBNAIL_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: THUMBNAIL_QUALITY })
      .toFile(outputPath);

    const thumbnailSize = fs.statSync(outputPath).size / 1024;
    const compressionRatio = ((1 - thumbnailSize / originalSize) * 100).toFixed(1);
    console.log(`   🖼️  Thumbnail: ${THUMBNAIL_WIDTH}px width, ${thumbnailSize.toFixed(2)} KB (${compressionRatio}% reduction)`);

    // Cleanup temp file
    fs.unlinkSync(tempPath);
  } catch (error) {
    console.error(`   ❌ Error creating thumbnail:`, error);
    throw error;
  }
}

/**
 * Upload thumbnail to Supabase storage
 */
async function uploadThumbnail(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      console.error(`   ❌ Error uploading thumbnail:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`   ❌ Exception uploading thumbnail:`, error);
    return null;
  }
}

/**
 * Update thumbnail_image in listings table
 */
async function updateThumbnailImage(listingId: string, thumbnailUrl: string): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .update({ thumbnail_image: thumbnailUrl })
    .eq('id', listingId);

  if (error) {
    console.error(`   ❌ Error updating thumbnail_image:`, error.message);
  } else {
    console.log(`   ✅ Updated thumbnail_image for listing`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Generating thumbnails for existing listings...\n');

  // Fetch all listings with main_image
  const { data: listings, error } = await supabase
    .from('listings')
    .select('id, title, main_image, thumbnail_image')
    .not('main_image', 'is', null);

  if (error) {
    console.error('❌ Error fetching listings:', error.message);
    process.exit(1);
  }

  if (!listings || listings.length === 0) {
    console.log('⚠️  No listings found');
    process.exit(0);
  }

  console.log(`📋 Found ${listings.length} listings to process\n`);

  // Create temp directory
  const tempDir = path.join(__dirname, '..', 'temp-thumbnails');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const listing of listings) {

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📁 Processing: ${listing.title}`);
    console.log(`   🆔 Listing ID: ${listing.id}`);
    console.log(`   🖼️  Main image: ${listing.main_image}`);

    try {
      const thumbFileName = `thumb_${listing.id}.webp`;
      const tempThumbPath = path.join(tempDir, thumbFileName);
      const storagePath = `${listing.id}/cover_thumb.webp`;

      // Create thumbnail
      await createThumbnailFromUrl(listing.main_image, tempThumbPath);

      // Upload thumbnail
      const thumbUrl = await uploadThumbnail(tempThumbPath, storagePath);

      if (thumbUrl) {
        // Update database
        await updateThumbnailImage(listing.id, thumbUrl);
        processed++;
        console.log(`   ✅ Successfully created thumbnail`);
      } else {
        failed++;
        console.error(`   ❌ Failed to upload thumbnail`);
      }
    } catch (error) {
      failed++;
      console.error(`   ❌ Error processing listing:`, error);
    }
  }

  // Cleanup temp directory
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Thumbnail generation complete!');
  console.log('='.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Refresh your homepage to see faster loading');
  console.log('   2. Check Supabase Dashboard → Table Editor → listings (thumbnail_image field)');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
