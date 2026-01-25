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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // For admin access

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Use service role key if available (for storage uploads), otherwise use anon key
const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Mapping of folder names (partial matches) to listing IDs
// The script will match folder names that contain these keywords
const LISTING_ID_MAP: Array<{ keywords: string[]; listingId: string }> = [
  { keywords: ['shah jahan', 'shah-jahan', 'agra'], listingId: 'bdf429ac-9274-44e1-9986-b43dcffe87e9' },
  { keywords: ['spacex', 'mars', 'olympus'], listingId: '10b2efa4-819b-4a10-99a0-1f5dc580b080' },
  { keywords: ['atlantis', 'atlantean', 'crystal'], listingId: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b' },
  { keywords: ['titanic', 'first-class'], listingId: '0580d737-156f-49ea-abcb-621797f493cf' },
  { keywords: ['wwii', 'resistance', 'safehouse', 'berlin'], listingId: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5' },
  { keywords: ['pandora', 'avatar', 'floating'], listingId: '41f8401a-e8a8-42fa-9809-10604c91d274' },
  { keywords: ['egyptian', 'nile', 'imhotep', 'memphis'], listingId: '32bb68c5-f89a-4a83-a8f3-90b712482575' },
  { keywords: ['alexander', 'tent', 'campaign'], listingId: '385e8c54-9458-4fc4-8482-4b2efe7efc2b' },
  { keywords: ['90s', 'manhattan', 'loft', 'soho'], listingId: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93' },
];

function findListingId(folderName: string): string | null {
  const normalizedFolderName = folderName.toLowerCase();
  
  for (const mapping of LISTING_ID_MAP) {
    if (mapping.keywords.some(keyword => normalizedFolderName.includes(keyword))) {
      return mapping.listingId;
    }
  }
  
  return null;
}

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
  'corridor': 11,
  'dining': 12,
};

async function uploadImageToStorage(
  filePath: string,
  storagePath: string
): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    
    console.log(`📤 Uploading ${fileName} to ${storagePath}...`);
    
    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${path.extname(filePath).slice(1).toLowerCase()}`,
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error(`❌ Error uploading ${fileName}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    console.log(`✅ Uploaded ${fileName}: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`❌ Exception uploading ${filePath}:`, error);
    return null;
  }
}

async function insertImageRecord(
  listingId: string,
  imageUrl: string,
  imageOrder: number,
  caption: string
): Promise<boolean> {
  try {
    // First, check if this image already exists for this listing
    const { data: existing } = await supabase
      .from('listing_images')
      .select('id')
      .eq('listing_id', listingId)
      .eq('image_url', imageUrl)
      .single();

    if (existing) {
      console.log(`ℹ️  Image already exists in database, updating order...`);
      const { error } = await supabase
        .from('listing_images')
        .update({
          image_order: imageOrder,
          caption: caption,
        })
        .eq('id', existing.id);

      if (error) {
        console.error(`❌ Error updating image record:`, error.message);
        return false;
      }
      return true;
    }

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

    return true;
  } catch (error) {
    console.error(`❌ Exception inserting image record:`, error);
    return false;
  }
}

function getImageOrder(fileName: string): number {
  const baseName = path.basename(fileName, path.extname(fileName)).toLowerCase();
  
  // Check for exact matches first
  for (const [type, order] of Object.entries(IMAGE_TYPE_ORDER)) {
    if (baseName.includes(type)) {
      return order;
    }
  }
  
  // Default order for unknown types
  return 100;
}

async function processListingFolder(folderPath: string, folderName: string) {
  const listingId = findListingId(folderName);
  
  if (!listingId) {
    console.warn(`⚠️  No listing ID found for folder: ${folderName}. Skipping...`);
    console.log(`💡 Available keywords: ${LISTING_ID_MAP.map(m => m.keywords[0]).join(', ')}`);
    return;
  }

  console.log(`\n📁 Processing folder: ${folderName} (Listing ID: ${listingId})`);

  // Get all image files
  const files = fs.readdirSync(folderPath).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.warn(`⚠️  No image files found in ${folderName}`);
    return;
  }

  // Sort files by type order
  const sortedFiles = files.sort((a, b) => {
    return getImageOrder(a) - getImageOrder(b);
  });

  console.log(`📸 Found ${sortedFiles.length} images`);

  // Upload each image
  for (let i = 0; i < sortedFiles.length; i++) {
    const file = sortedFiles[i];
    const filePath = path.join(folderPath, file);
    const fileName = path.basename(file, path.extname(file));
    const storagePath = `${listingId}/${file}`;
    const imageOrder = i + 1;

    // Upload to storage
    const imageUrl = await uploadImageToStorage(filePath, storagePath);
    
    if (!imageUrl) {
      console.warn(`⚠️  Skipping database record for ${file} due to upload failure`);
      continue;
    }

    // Create caption from filename
    const caption = fileName
      .split(/[-_\s]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    // Insert into database
    const success = await insertImageRecord(listingId, imageUrl, imageOrder, caption);
    
    if (success) {
      console.log(`✅ Added to database: ${caption} (order: ${imageOrder})`);
    }
  }
}

async function main() {
  const imagesDir = path.join(__dirname, '..', 'images');

  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Images directory not found: ${imagesDir}`);
    console.log(`💡 Create an 'images' folder in your project root with subfolders for each listing.`);
    process.exit(1);
  }

  // Try to verify bucket exists by attempting to list objects (anon key may not have listBuckets permission)
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
    console.log('✅ Storage bucket access verified');
  }

  // Get all listing folders
  const folders = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (folders.length === 0) {
    console.error(`❌ No folders found in ${imagesDir}`);
    console.log(`💡 Create subfolders named after listings (e.g., 'Shah Jahan's Marble Suite', 'SpaceX Mars Colony Pod')`);
    process.exit(1);
  }

  console.log(`\n🚀 Starting upload process for ${folders.length} listing(s)...\n`);

  // Process each folder
  for (const folderName of folders) {
    const folderPath = path.join(imagesDir, folderName);
    await processListingFolder(folderPath, folderName);
  }

  console.log('\n✅ Upload process complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Check Supabase Dashboard → Storage → listing-images');
  console.log('   2. Check Supabase Dashboard → Table Editor → listing_images');
  console.log('   3. Refresh your listing detail pages to see the new images');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

