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

// Atlantean Crystal Villa listing ID
const ATLANTEAN_LISTING_ID = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';

// Delay between API requests to avoid rate limiting (in ms)
const API_DELAY = 12000; // 12 seconds

// Helper function to add delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Image configurations with detailed prompts
const imageConfigs = [
  {
    filename: 'exterior-dome.webp',
    caption: 'Exterior Dome View Underwater',
    order: 1,
    prompt: `Ultra-realistic underwater photography of a massive shimmering crystal dome holding back the ocean, containing an ancient Atlantean villa. Schools of colorful fish and manta rays swim around the dome. Faint silhouettes of giant sea creatures in the distance. The villa is visible through the glowing blue-purple crystal walls. Soft rainbow refractions scatter from the crystal structures. Deep ocean blue water with rays of sunlight filtering down. Epic fantasy-meets-realistic underwater Airbnb listing photograph, photorealistic, high detail, cinematic lighting`,
  },
  {
    filename: 'living-room.webp',
    caption: 'Main Living Space',
    order: 2,
    prompt: `Ultra-realistic interior photograph of an ancient Atlantean crystal villa living room. Crystal walls glowing in soft blues and purples. Floating crystal lamps with gentle ethereal light. Atlantean symbols etched into elegant stone furniture. Seamless water channels built into the polished flooring. Advanced ancient technology - crystal screens and glowing orbs. Rainbow light from sunbeam refractors. Mysterious, serene, ethereal atmosphere. Airbnb listing style photograph, photorealistic, high detail`,
  },
  {
    filename: 'bedroom.webp',
    caption: 'Ocean-View Bedroom',
    order: 3,
    prompt: `Ultra-realistic interior photograph of an Atlantean crystal villa bedroom. Crystal energy bedframe that appears semi-floating and luminous with soft blue glow. Soft translucent drapes moving gently. Large crystal window showing ocean creatures - fish and jellyfish drifting past outside. Ancient stone carvings on walls with futuristic Atlantean technology. Soft bioluminescent lighting. Mysterious and serene underwater bedroom. Airbnb listing style photograph, photorealistic, high detail`,
  },
  {
    filename: 'bathroom.webp',
    caption: 'Atlantean Bathroom',
    order: 4,
    prompt: `Ultra-realistic interior photograph of an Atlantean crystal villa bathroom. Self-purifying water channels flowing through the space. Coral basins glowing from internal bioluminescence in soft pinks and blues. Crystal mirrors with ornate Atlantean frame designs. Flowing waterfalls inside a sealed air-filled chamber. Light refracting in soft blues and golds. Ancient yet advanced plumbing technology. Luxurious underwater spa atmosphere. Airbnb listing style photograph, photorealistic, high detail`,
  },
  {
    filename: 'water-tunnel.webp',
    caption: 'Private Water Tunnel to Coral Garden',
    order: 5,
    prompt: `Ultra-realistic photograph of a tube-like tunnel made of transparent crystal connecting the Atlantean villa to a coral garden. Bright vibrant coral forest visible outside the tunnel in reds, oranges, and purples. Colorful tropical fish swimming alongside. Soft drifting particles in the water catching the light. Magical underwater lighting with sunbeams filtering through. Walking path inside the crystal tunnel. Airbnb listing style photograph, photorealistic, high detail`,
  },
  {
    filename: 'control-chamber.webp',
    caption: 'Crystal Control Chamber',
    order: 6,
    prompt: `Ultra-realistic interior photograph of an Atlantean crystal control chamber. Ancient Atlantean tablet device that looks advanced yet ancient, glowing with symbols. Aquatic creature translation orb floating on a stone pedestal. Large central glowing crystal emanating soft energy. Runic inscriptions carved into walls and floor, some glowing softly. Blue and purple ambient lighting. No people in the image. Mysterious ancient technology room. Airbnb listing style photograph, photorealistic, high detail`,
  },
  {
    filename: 'city-view.webp',
    caption: 'Underwater City Around the Villa',
    order: 7,
    prompt: `Ultra-realistic underwater photograph showing the ancient ruins of Atlantis surrounding the crystal villa. Giant stone columns and temples partially overgrown with colorful coral and sea plants. Mysterious beams of golden sunlight filtering downward through the deep blue water. Faint outlines of other crystal domes in the distance. Schools of fish swimming between the ruins. Epic scale, ancient civilization underwater. Airbnb listing style photograph, photorealistic, high detail, cinematic`,
  },
];

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    console.log(`🎨 Generating image with Flux Schnell...`);

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

    // Handle ReadableStream output (newer Replicate SDK behavior)
    if (Array.isArray(output) && output.length > 0) {
      const firstItem = output[0];

      // If it's a ReadableStream, collect the data
      if (firstItem && typeof firstItem === 'object' && 'getReader' in firstItem) {
        console.log('📥 Receiving image stream...');
        const reader = (firstItem as ReadableStream<Uint8Array>).getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }

        console.log(`✅ Received ${totalLength} bytes`);
        return Buffer.from(result);
      }

      // If it's a URL string
      if (typeof firstItem === 'string' && firstItem.startsWith('http')) {
        console.log('📥 Downloading from URL...');
        const response = await fetch(firstItem);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }

    console.error('❌ Unexpected output format:', typeof output);
    return null;
  } catch (error) {
    console.error('❌ Error generating image:', error);
    return null;
  }
}

async function saveImage(buffer: Buffer, localPath: string): Promise<boolean> {
  try {
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(localPath, buffer);
    console.log(`💾 Saved to ${localPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving image:`, error);
    return false;
  }
}

async function uploadToSupabase(buffer: Buffer, storagePath: string): Promise<string | null> {
  try {
    const ext = path.extname(storagePath).slice(1).toLowerCase();

    console.log(`📤 Uploading to Supabase storage: ${storagePath}`);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, buffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
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
    console.log(`✅ Uploaded successfully`);
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
  console.log('🚀 Generating images for Lost Atlantean Crystal Villa\n');
  console.log(`📍 Listing ID: ${ATLANTEAN_LISTING_ID}`);
  console.log(`🎨 Using: Flux Schnell\n`);

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'images', 'atlantean-crystal-villa');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clear existing images from database
  await clearExistingImages(ATLANTEAN_LISTING_ID);

  let isFirstRequest = true;
  let mainImageUrl: string | null = null;

  for (const config of imageConfigs) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🖼️  Generating: ${config.caption}`);
    console.log(`${'='.repeat(60)}\n`);

    // Add delay between API requests
    if (!isFirstRequest) {
      console.log(`⏳ Waiting ${API_DELAY / 1000} seconds to avoid rate limiting...`);
      await delay(API_DELAY);
    }
    isFirstRequest = false;

    // Generate image
    const imageBuffer = await generateImage(config.prompt);

    if (!imageBuffer) {
      console.error(`❌ Failed to generate image for ${config.caption}`);
      continue;
    }

    // Save locally
    const localPath = path.join(outputDir, config.filename);
    await saveImage(imageBuffer, localPath);

    // Upload to Supabase Storage
    const storagePath = `${ATLANTEAN_LISTING_ID}/${config.filename}`;
    const supabaseUrl = await uploadToSupabase(imageBuffer, storagePath);

    if (!supabaseUrl) {
      console.error(`❌ Failed to upload image for ${config.caption}`);
      continue;
    }

    // Insert into database
    await insertImageRecord(ATLANTEAN_LISTING_ID, supabaseUrl, config.order, config.caption);

    // Save first image as main image
    if (config.order === 1) {
      mainImageUrl = supabaseUrl;
    }
  }

  // Update main listing image
  if (mainImageUrl) {
    await updateMainImage(ATLANTEAN_LISTING_ID, mainImageUrl);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Atlantean Crystal Villa image generation complete!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📝 Summary:');
  console.log(`   - Generated ${imageConfigs.length} images`);
  console.log(`   - Uploaded to Supabase Storage`);
  console.log(`   - Database updated with image URLs`);
  console.log(`\n📁 Local images saved to: ${outputDir}`);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
