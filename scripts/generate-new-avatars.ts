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

const API_DELAY = 12000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// New avatars to generate
const newAvatars = [
  {
    type: 'host',
    listingId: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453',
    name: 'Monica Geller',
    folder: '1990s-manhattan-loft',
    prompt: 'Professional portrait of Monica Geller from Friends TV show played by Courteney Cox, beautiful woman with dark hair, wearing 90s fashion, perfectionist neat appearance, warm but intense smile, chef who loves cleaning, neutral background, high quality photograph, realistic, detailed face',
  },
  {
    type: 'reviewer',
    listingId: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
    name: 'Leonardo da Vinci',
    folder: 'wwii-resistance-safehouse',
    prompt: 'Professional portrait of Leonardo da Vinci, the famous Renaissance Italian polymath artist and inventor, elderly man with long gray beard and hair, wearing Renaissance-era Italian clothing and cap, wise observant eyes, thoughtful genius expression, neutral background, high quality photograph, realistic, detailed face',
  },
];

async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    console.log(`🎨 Generating avatar with Flux Schnell...`);

    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt: prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 90,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      const firstItem = output[0];

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

      if (typeof firstItem === 'string' && firstItem.startsWith('http')) {
        console.log('📥 Downloading from URL...');
        const response = await fetch(firstItem);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
      }
    }

    console.error('❌ Unexpected output format');
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
    console.log(`📤 Uploading to Supabase: ${storagePath}`);

    const { error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, buffer, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (error) {
      console.error(`❌ Error uploading:`, error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    const urlWithCacheBust = `${urlData.publicUrl}?v=${Date.now()}`;
    console.log(`✅ Uploaded successfully`);
    return urlWithCacheBust;
  } catch (error) {
    console.error(`❌ Exception uploading:`, error);
    return null;
  }
}

async function updateHostProfilePicture(hostId: string, imageUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('hosts')
    .update({ profile_picture_url: imageUrl })
    .eq('id', hostId);

  if (error) {
    console.error(`❌ Error updating host:`, error.message);
    return false;
  }
  console.log(`✅ Updated host profile picture`);
  return true;
}

async function updateReviewerAvatar(reviewerName: string, listingId: string, imageUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('reviews')
    .update({ reviewer_avatar_url: imageUrl })
    .eq('listing_id', listingId)
    .eq('reviewer_name', reviewerName);

  if (error) {
    console.error(`❌ Error updating reviewer:`, error.message);
    return false;
  }
  console.log(`✅ Updated reviewer avatar for ${reviewerName}`);
  return true;
}

async function main() {
  console.log('🚀 Generating new avatars for Monica Geller and Leonardo da Vinci\n');

  let isFirstRequest = true;

  for (const avatar of newAvatars) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`👤 Generating: ${avatar.name} (${avatar.type})`);
    console.log(`${'='.repeat(60)}\n`);

    if (!isFirstRequest) {
      console.log(`⏳ Waiting ${API_DELAY / 1000} seconds...`);
      await delay(API_DELAY);
    }
    isFirstRequest = false;

    const buffer = await generateImage(avatar.prompt);

    if (!buffer) {
      console.error(`❌ Failed to generate avatar for ${avatar.name}`);
      continue;
    }

    const safeName = avatar.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const prefix = avatar.type === 'host' ? 'host' : 'reviewer';
    const outputDir = path.join(__dirname, '..', 'images', 'avatars', avatar.folder);
    const localPath = path.join(outputDir, `${prefix}-${safeName}.webp`);

    await saveImage(buffer, localPath);

    const storagePath = `avatars/${avatar.listingId}/${prefix}-${safeName}.webp`;
    const supabaseImageUrl = await uploadToSupabase(buffer, storagePath);

    if (supabaseImageUrl) {
      if (avatar.type === 'host' && avatar.hostId) {
        await updateHostProfilePicture(avatar.hostId, supabaseImageUrl);
      } else {
        await updateReviewerAvatar(avatar.name, avatar.listingId, supabaseImageUrl);
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ New avatar generation complete!');
  console.log(`${'='.repeat(60)}\n`);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
