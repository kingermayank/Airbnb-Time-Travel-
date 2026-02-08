import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

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

const imagesDir = path.join(__dirname, '..', 'images');

// Find folder by partial name match
function findFolder(partialName: string): string | null {
  try {
    const folders = readdirSync(imagesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const match = folders.find(f => f.toLowerCase().includes(partialName.toLowerCase()));
    return match ? path.join(imagesDir, match) : null;
  } catch (error) {
    return null;
  }
}

// Find a bedroom image in a folder
function findBedroomImage(folderPath: string): string | null {
  try {
    const files = readdirSync(folderPath);
    const bedroomFile = files.find(f => f.toLowerCase().includes('bedroom'));
    return bedroomFile ? path.join(folderPath, bedroomFile) : null;
  } catch (error) {
    return null;
  }
}

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

// Bedroom configurations
const bedroomConfigs = [
  {
    listingId: LISTING_IDS.SHAH_JAHAN,
    folderSearch: 'shah jahan',
    storagePath: 'bedrooms/shah-jahan-bedroom.jpg',
    room: 'Royal Bedchamber',
    beds: '1 king bed with silk canopy'
  },
  {
    listingId: LISTING_IDS.TITANIC,
    folderSearch: 'titanic',
    storagePath: 'bedrooms/titanic-bedroom.jpg',
    room: 'First-Class Stateroom',
    beds: '1 queen bed with mahogany frame'
  },
  {
    listingId: LISTING_IDS.NYC_90S,
    folderSearch: '1990',
    storagePath: 'bedrooms/nyc-90s-bedroom.jpg',
    room: 'The One with the Purple Bedroom',
    beds: '1 queen bed with 90s decor'
  },
  {
    listingId: LISTING_IDS.EGYPT,
    folderSearch: 'egypt',
    storagePath: 'bedrooms/egypt-bedroom.jpg',
    room: 'Pharaoh\'s Chamber',
    beds: '1 golden bed with linen canopy'
  },
  {
    listingId: LISTING_IDS.WWII,
    folderSearch: 'wwii',
    storagePath: 'bedrooms/wwii-bedroom.jpg',
    room: 'Secret Attic Room',
    beds: '2 single beds behind the bookcase'
  },
];

async function main() {
  console.log('🚀 Uploading bedroom images and updating listings\n');

  // List all image folders
  console.log('📂 Available image folders:');
  const folders = readdirSync(imagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  folders.forEach(f => console.log(`   - ${f}`));
  console.log('');

  for (const config of bedroomConfigs) {
    console.log(`\n📦 Processing: ${config.room}`);
    console.log(`   Looking for folder containing: "${config.folderSearch}"`);

    const folder = findFolder(config.folderSearch);
    if (!folder) {
      console.log(`   ⚠️  No folder found matching "${config.folderSearch}"`);
      continue;
    }

    console.log(`   Found folder: ${path.basename(folder)}`);

    const bedroomPath = findBedroomImage(folder);
    if (!bedroomPath) {
      console.log(`   ⚠️  No bedroom image found in folder`);
      continue;
    }

    console.log(`   Found bedroom image: ${path.basename(bedroomPath)}`);

    // Get the correct extension from the actual file
    const ext = path.extname(bedroomPath).toLowerCase();
    const storagePath = config.storagePath.replace(/\.[^.]+$/, ext);

    const imageUrl = await uploadImage(bedroomPath, storagePath);

    if (imageUrl) {
      // Update the listing with sleeping arrangements
      const sleepingArrangements = [{
        room: config.room,
        beds: config.beds,
        image_url: imageUrl
      }];

      const { error: updateError } = await supabase
        .from('listings')
        .update({
          sleeping_arrangements: JSON.stringify(sleepingArrangements)
        })
        .eq('id', config.listingId);

      if (updateError) {
        console.error(`   ❌ Error updating listing:`, updateError.message);
      } else {
        console.log(`   ✅ Updated listing with bedroom: ${config.room}`);
      }
    }
  }

  console.log('\n✅ Done!');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
