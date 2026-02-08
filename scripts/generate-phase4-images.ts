import Replicate from 'replicate';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey!);

// Using Flux Schnell as it's fast and already tested in the project
const MODEL = "black-forest-labs/flux-schnell";

const LISTING_DATA = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    name: 'Miami Underwater 2089',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a luxury underwater apartment in submerged Miami, 2089. Professional architectural photography, wide angle, natural lighting through water, cinematic, detailed textures. High-end interior design with bioluminescent accents. Schools of tropical fish visible through floor-to-ceiling reinforced glass walls. Submerged Art Deco architecture.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-222222222222',
    name: 'Amazon Biodome 2203',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a sustainable luxury cabin inside a massive Amazon rainforest biodome, 2203. Lush tropical vegetation, high-tech glass dome structure, warm humid atmosphere, professional architectural photography. Natural jungle sunlight filtering through leaves. Modern eco-minimalist furniture.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-333333333333',
    name: 'Lunar Hilton Penthouse',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a luxury penthouse suite on the Moon, 2156. Sleek futuristic interior, large observation window with a stunning view of the Earth in the black starry sky. Professional architectural photography, soft ambient lighting, high-end materials like brushed aluminum and white leather. 1/6 gravity aesthetic.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-444444444444',
    name: 'Floating City Apartment',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a modern apartment in a floating city on the Pacific Ocean, 2178. Sleek maritime-inspired interior, large windows showing the city of platforms and boats, turquoise ocean water, professional architectural photography. Bright natural sunlight, breezy feel, high-tech modular furniture.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-555555555555',
    name: 'Federation Ambassador Suite',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a Starfleet-style diplomatic suite in San Francisco, 2364. Sleek Federation aesthetic, soft panel lighting, LCARS interface consoles, view of the Golden Gate Bridge with futuristic Starfleet buildings. Professional architectural photography, clean utopian design, comfortable futuristic furniture.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-666666666666',
    name: 'Bermuda Triangle Platform',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a 1950s ocean research platform in the Bermuda Triangle. Vintage maritime equipment, slightly weathered but cozy interior, eerie but beautiful turquoise water, professional architectural photography. Soft morning mist, 1950s color film aesthetic, nostalgic but high-quality.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-777777777777',
    name: 'Area 51 Classified Barracks',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a secret military barracks unit inside Area 51, 1962. Mid-century modern military aesthetic, olive drab and brushed steel, desert landscape visible through high small windows, professional architectural photography. Warm Nevada sunlight, mysterious but clean atmosphere, high-quality vintage look.',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-888888888888',
    name: 'Stone Age Cave Dwelling',
    base_prompt: 'Ultra-hyper-realistic Airbnb photography of a premium Stone Age cave interior, 15,000 BCE. Authentic cave paintings on smooth rock walls, soft warm firelight, thick mammoth-fur bedding, professional architectural photography. Wide cavern opening showing a lush prehistoric valley. Primal, cozy, and high-quality.',
  },
];

const IMAGE_TYPES = [
  { type: 'cover', label: 'Cover Photo', prompt_suffix: 'Exterior wide shot, hero image, stunning perspective, professional lighting.' },
  { type: 'bedroom', label: 'Bedroom', prompt_suffix: 'Cozy and luxurious bedroom area, focus on the bed and bedding, soft lighting, inviting atmosphere.' },
  { type: 'living_room', label: 'Living Room', prompt_suffix: 'Spacious living area, comfortable seating, beautiful decor, wide-angle interior shot.' },
  { type: 'kitchen', label: 'Kitchen Area', prompt_suffix: 'Functional and stylish kitchen or dining area, unique period-accurate or futuristic appliances, clean and bright.' },
  { type: 'restroom', label: 'Restroom', prompt_suffix: 'Modern and clean bathroom or washing area, high-end fixtures, beautiful materials, professional framing.' },
  { type: 'outdoor', label: 'Outdoor Shot', prompt_suffix: 'View from the property or the immediate outdoor surroundings, emphasizing the unique location and environment.' },
];

const HOST_DATA = [
  { id: 'b1c2d3e4-f5a6-7890-bcde-111111111111', name: 'Captain Rosa Delgado', prompt: 'Professional headshot portrait of a confident Latina woman in her 50s, former real estate agent turned submarine captain, weathered but warm face, wearing a nautical captain\'s jacket, underwater habitat background, realistic photograph.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-222222222222', name: 'GAIA-12', prompt: 'Artistic representation of an AI conservation system, glowing green holographic female face emerging from a tree trunk, bioluminescent particles, rainforest background, ethereal lighting, digital art.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-333333333333', name: 'Charlotte Hilton-Musk VIII', prompt: 'Professional headshot portrait of an extremely wealthy young woman in her 30s, platinum blonde hair, designer space-age outfit, moon surface visible through window, luxury lunar hotel setting, realistic photograph.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-444444444444', name: 'Kai Nakamura-Chen', prompt: 'Professional headshot portrait of a friendly mixed-race Asian man in his 40s, wearing a practical waterproof jacket, warm smile, floating city and ocean background, natural lighting, realistic photograph.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-555555555555', name: 'Admiral Chen\'s Hologram', prompt: 'Professional headshot portrait of a distinguished Asian man in his 60s as a blue shimmering hologram, wearing Starfleet admiral uniform, starship interior background, soft lighting, digital art.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-666666666666', name: '[Signal Lost]', prompt: 'Mysterious corrupted vintage photograph, human silhouette standing on research platform at sea, heavy static and image fragmentation, eerie green glow, intentionally corrupted image effect.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-777777777777', name: '[REDACTED]', prompt: 'Deliberately obscured portrait photograph, figure in dark suit with face blacked out by censorship bar, Area 51 desert background, 1962 grainy black and white photograph style.' },
  { id: 'b1c2d3e4-f5a6-7890-bcde-888888888888', name: 'Grok of the River Clan', prompt: 'Portrait of a friendly Cro-Magnon caveman, animal furs, long tangled hair and beard, warm firelight, cave paintings background, proud expression, high-quality digital art.' },
];

async function downloadImage(url: string, filepath: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Starting Phase 4 Image Generation & Upload (with Rate Limiting)...\n');

  const tempDir = path.resolve(process.cwd(), 'temp_phase4_images');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // --- PART 1: HOST PROFILE PICTURES ---
  console.log('👤 Generating Host Profile Pictures...');
  for (const host of HOST_DATA) {
    // Check if host already has a profile picture
    const { data: hostData } = await supabase
      .from('hosts')
      .select('profile_picture_url')
      .eq('id', host.id)
      .single();

    if (hostData?.profile_picture_url) {
      console.log(`⏭️  Skipping host ${host.name} (already exists)`);
      continue;
    }

    console.log(`🎨 Generating profile for ${host.name}...`);
    try {
      const output = await replicate.run(MODEL, {
        input: {
          prompt: host.prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 90,
        },
      });

      const imageUrl = Array.isArray(output) ? output[0] : output;
      const fileName = `host_${host.id}.webp`;
      const localPath = path.join(tempDir, fileName);
      await downloadImage(imageUrl as string, localPath);

      const storagePath = `hosts/${host.id}/profile.webp`;
      const fileBuffer = fs.readFileSync(localPath);

      await supabase.storage
        .from('listing-images')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(storagePath);

      await supabase
        .from('hosts')
        .update({ profile_picture_url: publicUrlData.publicUrl })
        .eq('id', host.id);

      console.log(`   ✅ Success: ${host.name}`);
      await sleep(12000);
    } catch (error: any) {
      console.error(`   ❌ Error for ${host.name}:`, error.message);
    }
  }

  // --- PART 2: LISTING IMAGES ---
  for (const listing of LISTING_DATA) {
    console.log(`\n🏠 Processing: ${listing.name}`);
    console.log('=' .repeat(40));

    for (const imgType of IMAGE_TYPES) {
      const order = IMAGE_TYPES.indexOf(imgType) + 1;
      
      // Check if image already exists
      const { data: existing } = await supabase
        .from('listing_images')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('image_order', order)
        .single();

      if (existing) {
        console.log(`⏭️  Skipping ${imgType.label} (already exists)`);
        continue;
      }

      const fileName = `${imgType.type}.webp`;
      const fullPrompt = `${listing.base_prompt} ${imgType.prompt_suffix} Photorealistic, 8k resolution, architectural digest style.`;
      
      console.log(`🎨 Generating ${imgType.label}...`);

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const output = await replicate.run(MODEL, {
            input: {
              prompt: fullPrompt,
              num_outputs: 1,
              aspect_ratio: '16:9',
              output_format: 'webp',
              output_quality: 90,
            },
          });

          const imageUrl = Array.isArray(output) ? output[0] : output;
          
          // Download locally
          const localPath = path.join(tempDir, `${listing.id}_${fileName}`);
          await downloadImage(imageUrl as string, localPath);

          // Upload to Supabase
          const storagePath = `${listing.id}/${fileName}`;
          const fileBuffer = fs.readFileSync(localPath);

          const { error: uploadError } = await supabase.storage
            .from('listing-images')
            .upload(storagePath, fileBuffer, {
              contentType: 'image/webp',
              upsert: true,
            });

          if (uploadError) {
            console.error(`   ❌ Upload failed: ${uploadError.message}`);
            break;
          }

          const { data: publicUrlData } = supabase.storage
            .from('listing-images')
            .getPublicUrl(storagePath);

          const publicUrl = publicUrlData.publicUrl;
          
          // Update database
          if (order === 1) {
            await supabase
              .from('listings')
              .update({ main_image: publicUrl })
              .eq('id', listing.id);
          }

          await supabase
            .from('listing_images')
            .insert({
              listing_id: listing.id,
              image_url: publicUrl,
              image_order: order,
              caption: imgType.label
            });

          console.log(`   ✅ Success: ${imgType.label}`);
          
          // Wait to avoid rate limits (Replicate limit is 6 per minute for low credit accounts)
          console.log('   💤 Waiting 12s for rate limit...');
          await sleep(12000);
          break; // Success, exit retry loop

        } catch (error: any) {
          const isRateLimit = error.status === 429 || 
                            (error.message && error.message.includes('429')) ||
                            (error.detail && error.detail.includes('throttled'));
          
          if (isRateLimit) {
            console.warn(`   ⚠️  Rate limited. Retrying in 20s... (Attempt ${retryCount + 1}/${maxRetries})`);
            await sleep(20000);
            retryCount++;
          } else {
            console.error(`   ❌ Error:`, error.message || error);
            break;
          }
        }
      }
    }
  }

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log('\n🎉 All Phase 4 images generated and uploaded successfully!');
}

main().catch(console.error);
