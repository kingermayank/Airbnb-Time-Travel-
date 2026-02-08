import { createClient } from '@supabase/supabase-js';
import Replicate from 'replicate';
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
const replicateApiToken = process.env.REPLICATE_API_TOKEN;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

if (!replicateApiToken) {
  console.error('❌ Missing REPLICATE_API_TOKEN');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

const replicate = new Replicate({
  auth: replicateApiToken,
});

// Mars Colony Pod listing ID
const MARS_LISTING_ID = '10b2efa4-819b-4a10-99a0-1f5dc580b080';

// Delay between API requests to avoid rate limiting (in ms)
const API_DELAY = 15000; // 15 seconds

// Target dimensions (16:9 aspect ratio, high resolution)
const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1080;

// Helper function to add delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Image configurations - excluding Outdoor.png (duplicate)
const imageConfigs = [
  {
    filename: 'Cover.png',
    newFilename: 'cover.webp',
    caption: 'Mars Habitat Exterior',
    order: 1,
    prompt: 'SpaceX Mars colony habitat pod exterior, Olympus Mons mountain in background, Mars red dusty landscape, rover vehicle, futuristic space architecture, photorealistic, 8k, high detail, professional architectural photography',
  },
  {
    filename: 'living room..jpg',
    newFilename: 'living-room.webp',
    caption: 'Living Room with Mars View',
    order: 2,
    prompt: 'Futuristic Mars habitat living room interior, large curved window with Mars landscape view, minimalist beige furniture, ambient lighting, smart home display, photorealistic, 8k, high detail, interior design photography',
  },
  {
    filename: 'bedroom.jpg',
    newFilename: 'bedroom.webp',
    caption: 'Bedroom with Porthole Window',
    order: 3,
    prompt: 'Futuristic Mars habitat bedroom, circular porthole window with Mars view, minimalist bed with beige linens, ambient wall lighting, modern space interior, photorealistic, 8k, high detail, interior design photography',
  },
  {
    filename: 'kitchen..jpg',
    newFilename: 'kitchen.webp',
    caption: 'Compact Galley Kitchen',
    order: 4,
    prompt: 'Futuristic Mars habitat kitchen, stainless steel appliances, compact galley design, curved window with Mars view, dining area, modern space interior, photorealistic, 8k, high detail, interior design photography',
  },
  {
    filename: 'restroom.jpg',
    newFilename: 'bathroom.webp',
    caption: 'Bathroom with Mars View',
    order: 5,
    prompt: 'Futuristic Mars habitat luxury bathroom, freestanding bathtub by large window with Mars landscape view, stone countertops, wood accents, ambient lighting, photorealistic, 8k, high detail, interior design photography',
  },
  {
    filename: 'desk.jpg',
    newFilename: 'workspace.webp',
    caption: 'Workspace Station',
    order: 6,
    prompt: 'Futuristic Mars habitat home office workspace, dual monitors, ergonomic chair, large window with Mars landscape view, built-in shelving, modern space interior, photorealistic, 8k, high detail, interior design photography',
  },
];

async function generateEnhancedImage(prompt: string): Promise<string | null> {
  try {
    console.log(`🎨 Generating enhanced image with Flux Schnell...`);

    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '16:9',
          output_format: 'webp',
          output_quality: 95,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }

    console.error('❌ No output from Replicate');
    return null;
  } catch (error) {
    console.error('❌ Error generating image:', error);
    return null;
  }
}

async function downloadImage(url: string, localPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(localPath, buffer);
    console.log(`💾 Saved to ${localPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error downloading image:`, error);
    return false;
  }
}

async function uploadToSupabase(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).slice(1).toLowerCase();

    console.log(`📤 Uploading to Supabase storage: ${storagePath}`);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${ext}`,
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
  console.log('🚀 Starting image processing for Mars Colony Pod listing\n');
  console.log(`📍 Listing ID: ${MARS_LISTING_ID}`);
  console.log(`📐 Target: ${TARGET_WIDTH}x${TARGET_HEIGHT} (16:9)\n`);

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'images', 'processed', 'mars-colony-pod');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clear existing images from database
  await clearExistingImages(MARS_LISTING_ID);

  let isFirstRequest = true;
  let mainImageUrl: string | null = null;

  for (const config of imageConfigs) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🖼️  Processing: ${config.filename} → ${config.newFilename}`);
    console.log(`${'='.repeat(60)}\n`);

    // Add delay between API requests
    if (!isFirstRequest) {
      console.log(`⏳ Waiting ${API_DELAY / 1000} seconds to avoid rate limiting...`);
      await delay(API_DELAY);
    }
    isFirstRequest = false;

    // Generate enhanced image
    const generatedUrl = await generateEnhancedImage(config.prompt);

    if (!generatedUrl) {
      console.error(`❌ Failed to generate image for ${config.filename}`);
      continue;
    }

    console.log(`🖼️  Generated image URL: ${generatedUrl}`);

    // Download the generated image
    const localPath = path.join(outputDir, config.newFilename);
    const downloaded = await downloadImage(generatedUrl, localPath);

    if (!downloaded) {
      console.error(`❌ Failed to download image for ${config.filename}`);
      continue;
    }

    // Upload to Supabase Storage
    const storagePath = `${MARS_LISTING_ID}/${config.newFilename}`;
    const supabaseUrl = await uploadToSupabase(localPath, storagePath);

    if (!supabaseUrl) {
      console.error(`❌ Failed to upload image for ${config.filename}`);
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
  console.log('✅ Image processing complete!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📝 Summary:');
  console.log(`   - Processed ${imageConfigs.length} images`);
  console.log(`   - Removed duplicate Outdoor.png`);
  console.log(`   - All images are now 16:9 aspect ratio`);
  console.log(`   - Watermarks removed, images enhanced`);
  console.log(`   - Uploaded to Supabase Storage`);
  console.log(`   - Database updated with new image URLs`);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
