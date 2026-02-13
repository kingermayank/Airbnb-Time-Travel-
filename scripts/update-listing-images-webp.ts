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

// Image type mapping for ordering
const IMAGE_TYPE_ORDER: Record<string, number> = {
  'cover': 1,
  'main': 1,
  'living room': 2,
  'living-room': 2,
  'bedroom': 3,
  'kitchen': 4,
  'washroom': 5,
  'bathroom': 5,
  'restroom': 5,
  'host': 6,
  'outdoor': 7,
  'rooftop': 8,
  'exterior': 9,
  'desk': 10,
  'workspace': 10,
  'corridor': 11,
  'dining': 12,
  'window': 13,
};

// WebP quality setting (85 is a good balance of quality and file size)
const WEBP_QUALITY = 85;

// Thumbnail settings for homepage cards
const THUMBNAIL_WIDTH = 1500; // High resolution for crisp display on large screens and retina displays
const THUMBNAIL_QUALITY = 90; // Very high quality to eliminate pixelation

/**
 * Query Supabase to find listing ID by matching folder name to listing title
 */
async function findListingIdFromSupabase(folderName: string): Promise<string | null> {
  try {
    // Fetch all listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select('id, title');

    if (error) {
      console.error(`❌ Error fetching listings:`, error.message);
      return null;
    }

    if (!listings || listings.length === 0) {
      console.warn(`⚠️  No listings found in database`);
      return null;
    }

    // Normalize folder name for matching
    const normalizedFolderName = folderName.toLowerCase()
      .replace(/[—–-]/g, '-') // Normalize different dash types
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Try to find best match
    let bestMatch: { id: string; title: string; score: number } | null = null;

    for (const listing of listings) {
      const normalizedTitle = listing.title.toLowerCase()
        .replace(/[—–-]/g, '-')
        .replace(/\s+/g, ' ')
        .trim();

      // Calculate similarity score
      let score = 0;

      // Exact match
      if (normalizedFolderName === normalizedTitle) {
        score = 100;
      }
      // Folder name contains listing title
      else if (normalizedFolderName.includes(normalizedTitle)) {
        score = 80;
      }
      // Listing title contains folder name
      else if (normalizedTitle.includes(normalizedFolderName)) {
        score = 70;
      }
      // Check for key words match
      else {
        const folderWords = normalizedFolderName.split(/\s+/);
        const titleWords = normalizedTitle.split(/\s+/);
        const matchingWords = folderWords.filter(word => 
          titleWords.some(titleWord => titleWord.includes(word) || word.includes(titleWord))
        );
        score = (matchingWords.length / Math.max(folderWords.length, titleWords.length)) * 60;
      }

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { id: listing.id, title: listing.title, score };
      }
    }

    if (bestMatch && bestMatch.score >= 40) {
      console.log(`   ✅ Matched: "${bestMatch.title}" (score: ${bestMatch.score.toFixed(1)})`);
      return bestMatch.id;
    }

    return null;
  } catch (error) {
    console.error(`❌ Exception finding listing ID:`, error);
    return null;
  }
}

/**
 * Convert image to WebP format
 */
async function convertToWebP(inputPath: string, outputPath: string): Promise<void> {
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`   📐 Original: ${metadata.width}x${metadata.height} (${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} MB)`);

    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    const outputSize = fs.statSync(outputPath).size / 1024 / 1024;
    const compressionRatio = ((1 - outputSize / (fs.statSync(inputPath).size / 1024 / 1024)) * 100).toFixed(1);
    console.log(`   ✅ Converted to WebP: ${outputSize.toFixed(2)} MB (${compressionRatio}% reduction)`);
  } catch (error) {
    console.error(`   ❌ Error converting to WebP:`, error);
    throw error;
  }
}

/**
 * Create thumbnail version of image for homepage cards
 */
async function createThumbnail(inputPath: string, outputPath: string): Promise<void> {
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = fs.statSync(inputPath).size / 1024;

    await sharp(inputPath)
      .resize(THUMBNAIL_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: THUMBNAIL_QUALITY })
      .toFile(outputPath);

    const thumbnailSize = fs.statSync(outputPath).size / 1024;
    const compressionRatio = ((1 - thumbnailSize / originalSize) * 100).toFixed(1);
    console.log(`   🖼️  Thumbnail: ${THUMBNAIL_WIDTH}px width, ${thumbnailSize.toFixed(2)} KB (${compressionRatio}% reduction)`);
  } catch (error) {
    console.error(`   ❌ Error creating thumbnail:`, error);
    throw error;
  }
}

/**
 * Upload image to Supabase storage
 */
async function uploadToSupabase(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const fileName = path.basename(localPath);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/webp',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error(`   ❌ Error uploading ${fileName}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`   ❌ Exception uploading:`, error);
    return null;
  }
}

/**
 * Get image order based on filename
 */
function getImageOrder(fileName: string): number {
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();

  // Check for matches
  for (const [type, order] of Object.entries(IMAGE_TYPE_ORDER)) {
    if (baseName.includes(type)) {
      return order;
    }
  }

  // Default order for unknown types
  return 100;
}

/**
 * Check if image is a cover image
 */
function isCoverImage(fileName: string): boolean {
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
  return baseName.includes('cover');
}

/**
 * Create caption from filename
 */
function createCaption(fileName: string): string {
  const baseName = path.basename(fileName, path.extname(fileName));
  return baseName
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Clear existing images for a listing
 */
async function clearExistingImages(listingId: string): Promise<void> {
  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('listing_id', listingId);

  if (error) {
    console.error(`   ❌ Error clearing existing images:`, error.message);
  } else {
    console.log(`   🗑️  Cleared existing images`);
  }
}

/**
 * Insert image record into database
 */
async function insertImageRecord(
  listingId: string,
  imageUrl: string,
  imageOrder: number,
  caption: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('listing_images')
      .insert({
        listing_id: listingId,
        image_url: imageUrl,
        image_order: imageOrder,
        caption: caption,
      });

    if (error) {
      console.error(`   ❌ Error inserting image record:`, error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Exception inserting image record:`, error);
    return false;
  }
}

/**
 * Update main_image in listings table
 */
async function updateMainImage(listingId: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('listings')
    .update({ main_image: imageUrl })
    .eq('id', listingId);

  if (error) {
    console.error(`   ❌ Error updating main image:`, error.message);
  } else {
    console.log(`   ✅ Updated main_image for listing`);
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
    console.error(`   ❌ Error updating thumbnail image:`, error.message);
  } else {
    console.log(`   ✅ Updated thumbnail_image for listing`);
  }
}

/**
 * Process a single listing folder
 */
async function processListingFolder(folderPath: string, folderName: string): Promise<void> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📁 Processing: ${folderName}`);
  console.log('='.repeat(60));

  // Find listing ID from Supabase
  const listingId = await findListingIdFromSupabase(folderName);

  if (!listingId) {
    console.warn(`⚠️  No listing ID found for folder: ${folderName}. Skipping...`);
    return;
  }

  console.log(`   🆔 Listing ID: ${listingId}`);

  // Get all image files
  const files = fs.readdirSync(folderPath).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.warn(`   ⚠️  No image files found in ${folderName}`);
    return;
  }

  // Sort files by type order
  const sortedFiles = files.sort((a, b) => {
    return getImageOrder(a) - getImageOrder(b);
  });

  console.log(`   📸 Found ${sortedFiles.length} images`);

  // Create temp directory for WebP conversions
  const tempDir = path.join(__dirname, '..', 'temp-webp-conversions');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Clear existing images
  await clearExistingImages(listingId);

  let mainImageUrl: string | null = null;
  let thumbnailImageUrl: string | null = null;
  const imageRecords: Array<{ url: string; order: number; caption: string }> = [];

  // Process each image
  for (let i = 0; i < sortedFiles.length; i++) {
    const file = sortedFiles[i];
    const filePath = path.join(folderPath, file);
    const fileName = path.basename(file, path.extname(file));
    const webpFileName = `${fileName}.webp`;
    const tempWebpPath = path.join(tempDir, webpFileName);
    const storagePath = `${listingId}/${webpFileName}`;

    console.log(`\n   🖼️  Processing: ${file}`);

    try {
      // Convert to WebP
      await convertToWebP(filePath, tempWebpPath);

      // Upload to Supabase
      const imageUrl = await uploadToSupabase(tempWebpPath, storagePath);

      if (!imageUrl) {
        console.warn(`   ⚠️  Skipping database record for ${file} due to upload failure`);
        continue;
      }

      // Determine image order
      const imageOrder = getImageOrder(file);
      const caption = createCaption(file);

      imageRecords.push({
        url: imageUrl,
        order: imageOrder,
        caption: caption,
      });

      // Check if this is a cover image - generate thumbnail
      if (isCoverImage(file) && !mainImageUrl) {
        mainImageUrl = imageUrl;
        console.log(`   🎯 Identified as cover image`);
        
        // Create thumbnail for homepage
        const thumbFileName = `${fileName}_thumb.webp`;
        const tempThumbPath = path.join(tempDir, thumbFileName);
        const thumbStoragePath = `${listingId}/${thumbFileName}`;
        
        try {
          await createThumbnail(tempWebpPath, tempThumbPath);
          const thumbUrl = await uploadToSupabase(tempThumbPath, thumbStoragePath);
          
          if (thumbUrl) {
            thumbnailImageUrl = thumbUrl;
            console.log(`   ✅ Created thumbnail for homepage`);
          } else {
            console.warn(`   ⚠️  Thumbnail upload failed, will skip thumbnail_image update`);
          }
        } catch (error) {
          console.error(`   ⚠️  Error creating thumbnail:`, error);
          // Continue even if thumbnail creation fails
        }
      }

      console.log(`   ✅ Processed: ${caption} (order: ${imageOrder})`);
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error);
      continue;
    }
  }

  // Insert all image records
  console.log(`\n   💾 Inserting ${imageRecords.length} image records...`);
  for (const record of imageRecords) {
    await insertImageRecord(listingId, record.url, record.order, record.caption);
  }

  // Update main image if cover was found
  if (mainImageUrl) {
    console.log(`\n   🏠 Updating main_image...`);
    await updateMainImage(listingId, mainImageUrl);
    
    // Update thumbnail_image if thumbnail was created
    if (thumbnailImageUrl) {
      console.log(`   🏠 Updating thumbnail_image...`);
      await updateThumbnailImage(listingId, thumbnailImageUrl);
    }
  } else {
    // Use first image as main_image if no cover found
    if (imageRecords.length > 0) {
      console.log(`\n   🏠 No cover image found, using first image as main_image...`);
      await updateMainImage(listingId, imageRecords[0].url);
      
      // Also create thumbnail for first image if no cover found
      try {
        const firstFile = sortedFiles[0];
        const firstFilePath = path.join(folderPath, firstFile);
        const firstFileName = path.basename(firstFile, path.extname(firstFile));
        const firstWebpFileName = `${firstFileName}.webp`;
        const firstTempWebpPath = path.join(tempDir, firstWebpFileName);
        const thumbFileName = `${firstFileName}_thumb.webp`;
        const tempThumbPath = path.join(tempDir, thumbFileName);
        const thumbStoragePath = `${listingId}/${thumbFileName}`;
        
        await createThumbnail(firstTempWebpPath, tempThumbPath);
        const thumbUrl = await uploadToSupabase(tempThumbPath, thumbStoragePath);
        
        if (thumbUrl) {
          await updateThumbnailImage(listingId, thumbUrl);
          console.log(`   ✅ Created thumbnail for first image`);
        }
      } catch (error) {
        console.warn(`   ⚠️  Could not create thumbnail for first image:`, error);
      }
    }
  }

  // Cleanup temp files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore cleanup errors
  }

  console.log(`\n   ✅ Completed: ${folderName}`);
}

/**
 * Main function
 */
async function main() {
  const imagesDir = path.join(__dirname, '..', 'images', 'listing_images');

  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Images directory not found: ${imagesDir}`);
    process.exit(1);
  }

  // Verify storage bucket access
  console.log('📦 Verifying storage bucket access...');
  const { data: testList, error: testError } = await supabase.storage
    .from('listing-images')
    .list('', { limit: 1 });

  if (testError && testError.message.includes('not found')) {
    console.error('❌ Storage bucket "listing-images" not found.');
    console.log('💡 Please run the SQL script in scripts/create-storage-bucket.sql first!');
    process.exit(1);
  } else if (testError) {
    console.warn('⚠️  Could not verify bucket (this is okay, will attempt upload):', testError.message);
  } else {
    console.log('✅ Storage bucket access verified\n');
  }

  // Get all listing folders
  const folders = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (folders.length === 0) {
    console.error(`❌ No folders found in ${imagesDir}`);
    process.exit(1);
  }

  console.log(`🚀 Starting WebP conversion and upload process for ${folders.length} listing(s)...\n`);

  // Process each folder
  for (const folderName of folders) {
    const folderPath = path.join(imagesDir, folderName);
    await processListingFolder(folderPath, folderName);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Upload process complete!');
  console.log('='.repeat(60));
  console.log('\n📝 Next steps:');
  console.log('   1. Check Supabase Dashboard → Storage → listing-images');
  console.log('   2. Check Supabase Dashboard → Table Editor → listing_images');
  console.log('   3. Check Supabase Dashboard → Table Editor → listings (main_image field)');
  console.log('   4. Refresh your listing detail pages to see the new images');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
