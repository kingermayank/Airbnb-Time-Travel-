import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') });

// Load environment variables
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

// Mars Colony Pod listing ID
const MARS_LISTING_ID = '10b2efa4-819b-4a10-99a0-1f5dc580b080';

// Original images folder
const IMAGES_FOLDER = path.join(__dirname, '..', 'images', 'SpaceX Mars Colony Pod — Olympus Mons Base, 2150');

// Image configurations - using original files, excluding duplicate Outdoor.png
const imageConfigs = [
  {
    filename: 'Cover.png',
    caption: 'Mars Habitat Exterior',
    order: 1,
  },
  {
    filename: 'living room..jpg',
    caption: 'Living Room',
    order: 2,
  },
  {
    filename: 'bedroom.jpg',
    caption: 'Bedroom',
    order: 3,
  },
  {
    filename: 'kitchen..jpg',
    caption: 'Kitchen',
    order: 4,
  },
  {
    filename: 'restroom.jpg',
    caption: 'Bathroom',
    order: 5,
  },
  {
    filename: 'desk.jpg',
    caption: 'Workspace',
    order: 6,
  },
];

async function uploadToSupabase(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).slice(1).toLowerCase();

    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';

    console.log(`📤 Uploading to Supabase storage: ${storagePath}`);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: contentType,
        upsert: true,
      });

    if (error) {
      console.error(`❌ Error uploading to Supabase:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    // Add cache-busting parameter
    const urlWithCacheBust = `${urlData.publicUrl}?v=${Date.now()}`;
    console.log(`✅ Uploaded: ${urlWithCacheBust}`);
    return urlWithCacheBust;
  } catch (error) {
    console.error(`❌ Exception uploading to Supabase:`, error);
    return null;
  }
}

async function clearExistingImages(listingId: string): Promise<void> {
  try {
    console.log(`🗑️  Clearing existing images for listing ${listingId}...`);

    const { error } = await supabase
      .from('listing_images')
      .delete()
      .eq('listing_id', listingId);

    if (error) {
      console.error(`❌ Error clearing images:`, error.message);
    } else {
      console.log(`✅ Cleared existing images from database`);
    }
  } catch (error) {
    console.error(`❌ Exception clearing images:`, error);
  }
}

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
      console.error(`❌ Error inserting image record:`, error.message);
      return false;
    }

    console.log(`✅ Added to database: ${caption} (order: ${imageOrder})`);
    return true;
  } catch (error) {
    console.error(`❌ Exception inserting image record:`, error);
    return false;
  }
}

async function updateMainImage(listingId: string, imageUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('listings')
      .update({ main_image: imageUrl })
      .eq('id', listingId);

    if (error) {
      console.error(`❌ Error updating main image:`, error.message);
      return false;
    }

    console.log(`✅ Updated main listing image`);
    return true;
  } catch (error) {
    console.error(`❌ Exception updating main image:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Restoring original images for Mars Colony Pod listing\n');
  console.log(`📍 Listing ID: ${MARS_LISTING_ID}`);
  console.log(`📁 Source folder: ${IMAGES_FOLDER}\n`);

  // Check if folder exists
  if (!fs.existsSync(IMAGES_FOLDER)) {
    console.error(`❌ Images folder not found: ${IMAGES_FOLDER}`);
    process.exit(1);
  }

  // Clear existing images from database
  await clearExistingImages(MARS_LISTING_ID);

  let mainImageUrl: string | null = null;

  for (const config of imageConfigs) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🖼️  Uploading: ${config.filename}`);
    console.log(`${'='.repeat(60)}\n`);

    const localPath = path.join(IMAGES_FOLDER, config.filename);

    // Check if file exists
    if (!fs.existsSync(localPath)) {
      console.error(`❌ File not found: ${localPath}`);
      continue;
    }

    // Get file extension for storage path
    const ext = path.extname(config.filename).toLowerCase();
    const baseName = path.basename(config.filename, ext).toLowerCase().replace(/\s+/g, '-').replace(/\.+/g, '');
    const storagePath = `${MARS_LISTING_ID}/original-${baseName}${ext}`;

    // Upload to Supabase Storage
    const supabaseUrl = await uploadToSupabase(localPath, storagePath);

    if (!supabaseUrl) {
      console.error(`❌ Failed to upload ${config.filename}`);
      continue;
    }

    // Insert into database
    await insertImageRecord(MARS_LISTING_ID, supabaseUrl, config.order, config.caption);

    // Save first image as main image
    if (config.order === 1) {
      mainImageUrl = supabaseUrl;
    }
  }

  // Update main listing image
  if (mainImageUrl) {
    await updateMainImage(MARS_LISTING_ID, mainImageUrl);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Original images restored!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📝 Summary:');
  console.log(`   - Uploaded ${imageConfigs.length} original images`);
  console.log(`   - Excluded duplicate Outdoor.png`);
  console.log(`   - Database updated with original image URLs`);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
