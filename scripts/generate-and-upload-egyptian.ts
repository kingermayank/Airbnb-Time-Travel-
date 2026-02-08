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
// Try to use service role key if available for storage operations
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey!); 

const MODEL_VERSION = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

const BASE_STYLE_PROMPT = "Ultra-hyper-realistic Airbnb listing photograph of an Ancient Egyptian Nile-side villa during the Old Kingdom (circa 2500 BCE). Photographed like a real Airbnb listing by a professional architectural photographer — documentary realism. Architecture: limestone villa with carved stone columns, open courtyard layout, flat roof. Materials: pale limestone, carved reliefs, linen fabrics, wood furniture, bronze and alabaster details. Environment: Nile River nearby, palm trees, desert air, distant pyramids visible. Mood: calm, elegant, sun-washed, grounded and believable. ATMOSPHERE: Infused with a subtle mystical atmosphere inspired by ancient legend: warm golden light filtering through palm leaves, soft mist rising from water, gentle reflections, faint particles of light in the air (dust motes), timeless, sacred, quietly magical but HYPER-REALISTIC. Real camera look: full-frame DSLR, 24–35mm lens, f/8, ISO 100, natural perspective, subtle film grain. No modern objects.";

const IMAGES_TO_GENERATE = [
  {
    type: 'exterior_cover',
    prompt: `${BASE_STYLE_PROMPT} Image 1 — Exterior / Cover Photo. Wide-angle exterior cover photo of the Nile villa. Limestone façade, carved columns, palm trees, calm Nile water nearby. Desert landscape with pyramids faintly visible in the background. Early morning golden sunlight with soft mist over the water. Clean Airbnb hero composition.`,
    order: 1,
    caption: 'Villa Facade at Golden Hour'
  },
  {
    type: 'bedroom',
    prompt: `${BASE_STYLE_PROMPT} Image 2 — Bedroom. Ancient Egyptian bedroom inside the villa. Low stone-framed bed with white linen sheets, woven blankets. Carved limestone walls, open window letting in Nile breeze. Soft natural daylight with dust motes dancing in the light rays. Calm, minimal, Airbnb bedroom framing.`,
    order: 2,
    caption: 'Master Bedroom with Nile Breeze'
  },
  {
    type: 'bathroom',
    prompt: `${BASE_STYLE_PROMPT} Image 3 — Bathroom / Washing Area. Ancient Egyptian bathroom / washing area. Stone basin, bronze water vessels, linen towels, alabaster oil jars. Carved limestone walls. Soft indirect daylight creating gentle shadows. Clean, simple, functional — Airbnb bathroom vibe.`,
    order: 3,
    caption: 'Limestone Bathing Area'
  },
  {
    type: 'living_room',
    prompt: `${BASE_STYLE_PROMPT} Image 4 — Living Room / Courtyard Space. Living room area within an open courtyard. Stone columns, woven seating, linen cushions, brass oil lamps. Sunlight entering from above creating cinematic volumetric lighting. Airy, peaceful, realistic Airbnb living space.`,
    order: 4,
    caption: 'Open Courtyard Living Space'
  },
  {
    type: 'kitchen',
    prompt: `${BASE_STYLE_PROMPT} Image 5 — Dining + Kitchen Area. Open dining and kitchen area inside the villa. Simple stone counters, clay bowls, bread, fruit, ceramic vessels. Small wooden dining table with low stools. Natural daylight from open arches. No modern appliances. Functional and lived-in.`,
    order: 5,
    caption: 'Traditional Kitchen & Dining'
  },
  {
    type: 'garden',
    prompt: `${BASE_STYLE_PROMPT} Image 6 — Lawn / Garden / Outdoor Area. Outdoor garden and lawn area near the villa by the Nile. Palm trees, grass patches, stone pathways, calm river nearby. Villa visible in the background. Soft sunlight, peaceful atmosphere, slightly mystical garden feel. Airbnb outdoor context photo.`,
    order: 6,
    caption: 'Riverside Garden'
  }
];

async function downloadImage(url: string, filepath: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
  await pipeline(response.body as any, createWriteStream(filepath));
}

async function main() {
  console.log('🚀 Starting AI Image Generation (Batch 3 - Mystical Realism) for Egyptian Villa...');

  // 1. Find Listing
  console.log('🔍 Finding listing...');
  const { data: listings } = await supabase
    .from('listings')
    .select('id, title')
    .eq('title', 'Ancient Egyptian Nile Villa (Old Kingdom)')
    .limit(1);

  if (!listings || listings.length === 0) {
    console.error('❌ Listing not found!');
    return;
  }
  const listing = listings[0];
  console.log(`✅ Found listing: ${listing.title} (${listing.id})`);

  // 2. Generate and Upload Images
  const uploadedImages = [];

  // Create a temp directory for downloads
  const tempDir = path.resolve(process.cwd(), 'temp_images_v3');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  for (const item of IMAGES_TO_GENERATE) {
    console.log(`\n🎨 Generating ${item.type} image...`);
    // We trim to ~2000 chars just in case, though SDXL is robust.
    const prompt = item.prompt.substring(0, 2000); 
    
    try {
      const output = await replicate.run(MODEL_VERSION, {
        input: {
          prompt: prompt,
          negative_prompt: "cartoon, illustration, drawing, painting, low quality, blurry, distorted, modern appliances, electricity, plastic, cars, text, watermark, logo, hdr, saturation, high contrast",
          num_outputs: 1,
          width: 1344, // 16:9 Aspect Ratio
          height: 768
        }
      });

      const imageUrl = Array.isArray(output) ? output[0] : output;
      console.log(`   ✅ Generated: ${imageUrl}`);

      // Download locally
      const localPath = path.join(tempDir, `${item.type}.png`);
      await downloadImage(imageUrl as string, localPath);
      console.log(`   ⬇️  Downloaded to ${localPath}`);

      // Upload to Supabase Storage
      const storagePath = `${listing.id}/${item.type}-v3-${Date.now()}.png`;
      const fileBuffer = fs.readFileSync(localPath);

      console.log(`   📤 Uploading to Supabase Storage: ${storagePath}...`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error(`   ❌ Upload failed: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(storagePath);

      const publicUrl = publicUrlData.publicUrl;
      console.log(`   ✅ Public URL: ${publicUrl}`);

      uploadedImages.push({
        ...item,
        publicUrl
      });

    } catch (error) {
      console.error(`   ❌ Error processing ${item.type}:`, error);
    }
  }

  // Cleanup temp dir
  fs.rmSync(tempDir, { recursive: true, force: true });

  if (uploadedImages.length === 0) {
    console.error('❌ No images were successfully generated and uploaded.');
    return;
  }

  // 3. Update Database
  console.log('\n💾 Updating database records...');

  // Update Main Image (Image 1 - Exterior Cover)
  const mainImage = uploadedImages.find(img => img.type === 'exterior_cover') || uploadedImages[0];
  await supabase
    .from('listings')
    .update({ main_image: mainImage.publicUrl })
    .eq('id', listing.id);
  console.log('   ✅ Updated main_image');

  // Delete old images
  await supabase
    .from('listing_images')
    .delete()
    .eq('listing_id', listing.id);
  console.log('   ✅ Deleted old listing_images');

  // Insert new images
  const dbInserts = uploadedImages.map(img => ({
    listing_id: listing.id,
    image_url: img.publicUrl,
    image_order: img.order,
    caption: img.caption
  }));

  const { error: insertError } = await supabase
    .from('listing_images')
    .insert(dbInserts);

  if (insertError) {
    console.error('   ❌ Error inserting new image records:', insertError);
  } else {
    console.log(`   ✅ Inserted ${dbInserts.length} new image records`);
  }

  console.log('\n🎉 Mission Accomplished: Egyptian Villa updated with MYSTICAL HYPER-REALISM (Batch 3)!');
}

main();
