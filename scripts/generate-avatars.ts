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
  console.error('❌ Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

if (!replicateApiToken) {
  console.error('❌ Missing REPLICATE_API_TOKEN in .env.local');
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
const API_DELAY = 12000; // 12 seconds to be safe

// Helper function to add delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Avatar configurations for reviewers and host
const avatarConfigs = [
  {
    type: 'host',
    name: 'Elon Musk',
    prompt: 'Professional headshot portrait of Elon Musk, CEO of SpaceX and Tesla, neutral background, high quality photograph, realistic, detailed face, soft studio lighting, looking directly at camera',
  },
  {
    type: 'reviewer',
    name: 'Neil Armstrong',
    prompt: 'Professional headshot portrait of Neil Armstrong, the famous NASA astronaut and first man to walk on the moon, neutral background, high quality photograph, realistic, detailed face, soft studio lighting, looking directly at camera',
  },
  {
    type: 'reviewer',
    name: 'Han Solo',
    prompt: 'Professional headshot portrait of Han Solo from Star Wars, the iconic smuggler and pilot of the Millennium Falcon, neutral background, high quality photograph, realistic, detailed face, soft studio lighting, looking directly at camera',
  },
  {
    type: 'reviewer',
    name: 'Neil deGrasse Tyson',
    prompt: 'Professional headshot portrait of Neil deGrasse Tyson, the famous astrophysicist and science communicator, neutral background, high quality photograph, realistic, detailed face, soft studio lighting, looking directly at camera',
  },
];

async function generateAvatar(prompt: string): Promise<string | null> {
  try {
    console.log(`🎨 Generating avatar with Flux Schnell...`);

    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '1:1', // Square for circular avatars
          output_format: 'webp',
          output_quality: 90,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }

    console.error('❌ No output from Replicate');
    return null;
  } catch (error) {
    console.error('❌ Error generating avatar:', error);
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

    // Ensure directory exists
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

    const { data, error } = await supabase.storage
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

    console.log(`✅ Uploaded: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`❌ Exception uploading to Supabase:`, error);
    return null;
  }
}

async function getHostIdForListing(listingId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('host_id')
      .eq('id', listingId)
      .single();

    if (error || !data) {
      console.error(`❌ Error fetching host_id for listing:`, error?.message);
      return null;
    }

    return data.host_id;
  } catch (error) {
    console.error(`❌ Exception fetching host_id:`, error);
    return null;
  }
}

async function updateHostProfilePicture(hostId: string, imageUrl: string): Promise<boolean> {
  try {
    // Add cache-busting parameter
    const urlWithCacheBust = `${imageUrl}?v=${Date.now()}`;

    const { error } = await supabase
      .from('hosts')
      .update({ profile_picture_url: urlWithCacheBust })
      .eq('id', hostId);

    if (error) {
      console.error(`❌ Error updating host profile picture:`, error.message);
      return false;
    }

    console.log(`✅ Updated host profile picture in database`);
    return true;
  } catch (error) {
    console.error(`❌ Exception updating host profile picture:`, error);
    return false;
  }
}

async function updateReviewerAvatar(reviewerName: string, listingId: string, imageUrl: string): Promise<boolean> {
  try {
    // Add cache-busting parameter
    const urlWithCacheBust = `${imageUrl}?v=${Date.now()}`;

    const { error } = await supabase
      .from('reviews')
      .update({ reviewer_avatar_url: urlWithCacheBust })
      .eq('listing_id', listingId)
      .eq('reviewer_name', reviewerName);

    if (error) {
      console.error(`❌ Error updating reviewer avatar:`, error.message);
      return false;
    }

    console.log(`✅ Updated reviewer avatar in database for ${reviewerName}`);
    return true;
  } catch (error) {
    console.error(`❌ Exception updating reviewer avatar:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting avatar generation for Mars Colony Pod listing\n');
  console.log(`📍 Listing ID: ${MARS_LISTING_ID}\n`);

  // Get the host ID for this listing
  const hostId = await getHostIdForListing(MARS_LISTING_ID);
  console.log(`👤 Host ID: ${hostId || 'Not found'}\n`);

  // Create output directory for generated avatars
  const outputDir = path.join(__dirname, '..', 'images', 'avatars', 'mars-colony-pod');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let isFirstRequest = true;

  for (const config of avatarConfigs) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`👤 Processing: ${config.name} (${config.type})`);
    console.log(`${'='.repeat(60)}\n`);

    // Add delay between API requests to avoid rate limiting (skip first request)
    if (!isFirstRequest) {
      console.log(`⏳ Waiting ${API_DELAY / 1000} seconds to avoid rate limiting...`);
      await delay(API_DELAY);
    }
    isFirstRequest = false;

    // Generate avatar
    const generatedUrl = await generateAvatar(config.prompt);

    if (!generatedUrl) {
      console.error(`❌ Failed to generate avatar for ${config.name}`);
      continue;
    }

    console.log(`🖼️  Generated image URL: ${generatedUrl}`);

    // Create safe filename
    const safeFileName = config.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const localPath = path.join(outputDir, `${safeFileName}.webp`);

    // Download the generated image
    const downloaded = await downloadImage(generatedUrl, localPath);

    if (!downloaded) {
      console.error(`❌ Failed to download avatar for ${config.name}`);
      continue;
    }

    // Upload to Supabase Storage
    const storagePath = `avatars/${MARS_LISTING_ID}/${safeFileName}.webp`;
    const supabaseUrl = await uploadToSupabase(localPath, storagePath);

    if (!supabaseUrl) {
      console.error(`❌ Failed to upload avatar for ${config.name}`);
      continue;
    }

    // Update database
    if (config.type === 'host' && hostId) {
      await updateHostProfilePicture(hostId, supabaseUrl);
    } else if (config.type === 'reviewer') {
      await updateReviewerAvatar(config.name, MARS_LISTING_ID, supabaseUrl);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Avatar generation complete!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📝 Summary:');
  console.log(`   - Generated avatars saved to: ${outputDir}`);
  console.log(`   - Images uploaded to Supabase Storage`);
  console.log(`   - Database updated with avatar URLs`);
  console.log('\n💡 Next steps:');
  console.log('   1. Check Supabase Dashboard → Storage → listing-images/avatars');
  console.log('   2. Check your listing detail page to see the avatars');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
