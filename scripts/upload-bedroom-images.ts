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
const LISTING_IDS = {
  SHAH_JAHAN: 'bdf429ac-9274-44e1-9986-b43dcffe87e9',
  ATLANTIS: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
  TITANIC: '0580d737-156f-49ea-abcb-621797f493cf',
  WWII: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
  PANDORA: '41f8401a-e8a8-42fa-9809-10604c91d274',
  EGYPT: '32bb68c5-f89a-4a83-a8f3-90b712482575',
  ALEXANDER: '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
  NYC_90S: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
  MARS: '4b3ef07d-7b6c-4a8e-9f5d-2c1a8e3b9d4f',
};

// Bedroom images for each listing
const bedroomImages: { listingId: string; localPath: string; storagePath: string; room: string; beds: string }[] = [
  {
    listingId: LISTING_IDS.SHAH_JAHAN,
    localPath: path.join(__dirname, '..', 'images', "Shah Jahan's Marble Suite — Agra, 1650", 'bedroom.jpg'),
    storagePath: 'bedrooms/shah-jahan-bedroom.jpg',
    room: 'Royal Bedchamber',
    beds: '1 king bed with silk canopy'
  },
  {
    listingId: LISTING_IDS.ATLANTIS,
    localPath: path.join(__dirname, '..', 'images', 'atlantean-crystal-villa', 'bedroom.webp'),
    storagePath: 'bedrooms/atlantis-bedroom.webp',
    room: 'Underwater Suite',
    beds: '1 floating crystal bed'
  },
  {
    listingId: LISTING_IDS.TITANIC,
    localPath: path.join(__dirname, '..', 'images', "Titanic First-Class Suite — April 1912 (Alternate Timeline Where It Doesn't Sink)", 'bedroom.jpg'),
    storagePath: 'bedrooms/titanic-bedroom.jpg',
    room: 'First-Class Stateroom',
    beds: '1 queen bed with mahogany frame'
  },
  {
    listingId: LISTING_IDS.PANDORA,
    localPath: path.join(__dirname, '..', 'images', 'Pandora avatar', 'Bedroom.png'),
    storagePath: 'bedrooms/pandora-bedroom.png',
    room: 'Bioluminescent Nest',
    beds: '1 woven hammock bed'
  },
  {
    listingId: LISTING_IDS.ALEXANDER,
    localPath: path.join(__dirname, '..', 'images', "Alexander the Great's tent", 'bedroom.jpg'),
    storagePath: 'bedrooms/alexander-bedroom.jpg',
    room: 'Commander\'s Quarters',
    beds: '1 campaign bed with Persian rugs'
  },
  {
    listingId: LISTING_IDS.MARS,
    localPath: path.join(__dirname, '..', 'images', 'processed-mars-final', 'bedroom.jpg'),
    storagePath: 'bedrooms/mars-bedroom.jpg',
    room: 'Zero-G Sleep Pod',
    beds: '1 pressurized sleeping capsule'
  },
];

async function uploadImage(localPath: string, storagePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  File not found: ${localPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.webp') contentType = 'image/webp';

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
  console.log('🚀 Uploading bedroom images and updating listings\n');

  for (const bedroom of bedroomImages) {
    console.log(`\n📦 Processing: ${bedroom.room}`);

    const imageUrl = await uploadImage(bedroom.localPath, bedroom.storagePath);

    if (imageUrl) {
      // Update the listing with sleeping arrangements
      const sleepingArrangements = [{
        room: bedroom.room,
        beds: bedroom.beds,
        image_url: imageUrl
      }];

      const { error: updateError } = await supabase
        .from('listings')
        .update({
          sleeping_arrangements: JSON.stringify(sleepingArrangements)
        })
        .eq('id', bedroom.listingId);

      if (updateError) {
        console.error(`❌ Error updating listing ${bedroom.listingId}:`, updateError.message);
      } else {
        console.log(`✅ Updated listing with bedroom: ${bedroom.room}`);
      }
    }
  }

  console.log('\n✅ Done!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
