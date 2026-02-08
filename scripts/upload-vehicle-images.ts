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
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Listing IDs
const NYC_90S_ID = 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93';

// Vehicle images to upload
const vehicleImages = [
  {
    localPath: path.join(__dirname, '..', 'images', 'vehicle class', '2025-12-13-gemini-image-2.png'),
    storagePath: 'vehicles/tardis.png',
    name: 'TARDIS',
    description: 'Classic British Police Box time machine'
  },
  {
    localPath: path.join(__dirname, '..', 'images', 'vehicle class', 'screenshot-uuid-2.png'),
    storagePath: 'vehicles/eye-of-agamotto.png',
    name: 'Eye of Agamotto',
    description: 'Mystical time manipulation artifact'
  },
  {
    localPath: path.join(__dirname, '..', 'images', 'vehicle class', 'unnamed (1).jpg'),
    storagePath: 'vehicles/delorean.jpg',
    name: 'DeLorean DMC-12',
    description: 'Flux capacitor-equipped time machine (1.21 gigawatts required)'
  }
];

async function uploadImage(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const contentType = localPath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      console.error(`❌ Error uploading ${storagePath}:`, uploadError.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    console.log(`✅ Uploaded: ${storagePath}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Error reading/uploading ${localPath}:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Uploading vehicle images and updating listings\n');

  // Upload all vehicle images
  const uploadedImages: { name: string; description: string; url: string }[] = [];

  for (const vehicle of vehicleImages) {
    const url = await uploadImage(vehicle.localPath, vehicle.storagePath);
    if (url) {
      uploadedImages.push({
        name: vehicle.name,
        description: vehicle.description,
        url
      });
    }
  }

  console.log(`\n📦 Uploaded ${uploadedImages.length} vehicle images\n`);

  // Update the 1990s Manhattan Loft listing with transportation methods
  if (uploadedImages.length > 0) {
    // Create transportation methods JSON
    const transportationMethods = uploadedImages.map(img => ({
      name: img.name,
      description: img.description,
      image_url: img.url
    }));

    const { error: updateError } = await supabase
      .from('listings')
      .update({
        transportation_methods: JSON.stringify(transportationMethods)
      })
      .eq('id', NYC_90S_ID);

    if (updateError) {
      console.error('❌ Error updating listing:', updateError.message);
    } else {
      console.log('✅ Updated 1990s Manhattan Loft with transportation methods:');
      transportationMethods.forEach(t => {
        console.log(`   - ${t.name}: ${t.description}`);
      });
    }
  }

  console.log('\n✅ Done!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
