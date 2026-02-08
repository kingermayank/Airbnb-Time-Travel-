import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Correct listing IDs from database
const LISTING_IDS = {
  EGYPT: '32bb68c5-f89a-4a83-a8f3-90b712482575',
  ATLANTIS: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
  MARS: '10b2efa4-819b-4a10-99a0-1f5dc580b080',
  PANDORA: '41f8401a-e8a8-42fa-9809-10604c91d274',
  SHAH_JAHAN: 'bdf429ac-9274-44e1-9986-b43dcffe87e9',
  TITANIC: '0580d737-156f-49ea-abcb-621797f493cf',
  WWII: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
  NYC_90S: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
  TOKYO: 'a7c3e8f1-5b2d-4a9e-8c6f-3d1e7b4a2c5f',
  ALEXANDER: '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
};

const imagesDir = path.join(__dirname, '..', 'images');

function findFolder(partialName: string): string | null {
  try {
    const folders = readdirSync(imagesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    const match = folders.find(f => f.toLowerCase().includes(partialName.toLowerCase()));
    return match ? path.join(imagesDir, match) : null;
  } catch {
    return null;
  }
}

function findBedroomImage(folderPath: string): string | null {
  try {
    const files = readdirSync(folderPath);
    const bedroomFile = files.find(f => f.toLowerCase().includes('bedroom'));
    return bedroomFile ? path.join(folderPath, bedroomFile) : null;
  } catch {
    return null;
  }
}

async function uploadImage(localPath: string, storagePath: string): Promise<string | null> {
  try {
    if (!fs.existsSync(localPath)) {
      console.log(`   ⚠️  File not found: ${localPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.webp') contentType = 'image/webp';

    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (uploadError) {
      console.error(`   ❌ Upload error:`, uploadError.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    return publicUrl;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return null;
  }
}

// All bedroom configurations
const bedroomConfigs = [
  {
    listingId: LISTING_IDS.SHAH_JAHAN,
    folderSearch: 'shah jahan',
    storageName: 'shah-jahan',
    room: 'Royal Bedchamber',
    beds: '1 king bed with silk canopy'
  },
  {
    listingId: LISTING_IDS.ATLANTIS,
    folderSearch: 'atlantean',
    storageName: 'atlantis',
    room: 'Underwater Suite',
    beds: '1 floating crystal bed'
  },
  {
    listingId: LISTING_IDS.TITANIC,
    folderSearch: 'titanic',
    storageName: 'titanic',
    room: 'First-Class Stateroom',
    beds: '1 queen bed with mahogany frame'
  },
  {
    listingId: LISTING_IDS.PANDORA,
    folderSearch: 'pandora',
    storageName: 'pandora',
    room: 'Bioluminescent Nest',
    beds: '1 woven hammock bed'
  },
  {
    listingId: LISTING_IDS.ALEXANDER,
    folderSearch: 'alexander',
    storageName: 'alexander',
    room: "Commander's Quarters",
    beds: '1 campaign bed with Persian rugs'
  },
  {
    listingId: LISTING_IDS.MARS,
    folderSearch: 'spacex mars',
    storageName: 'mars',
    room: 'Zero-G Sleep Pod',
    beds: '2 zero-gravity suspension pods'
  },
  {
    listingId: LISTING_IDS.EGYPT,
    folderSearch: 'egypt',
    storageName: 'egypt',
    room: "Pharaoh's Suite",
    beds: '1 king wooden platform bed'
  },
  {
    listingId: LISTING_IDS.WWII,
    folderSearch: 'wwii',
    storageName: 'wwii',
    room: 'Main Loft',
    beds: '1 double bed, 2 cots (resistance-style)'
  },
  {
    listingId: LISTING_IDS.NYC_90S,
    folderSearch: '1990',
    storageName: 'nyc-90s',
    room: 'Sleeping Loft',
    beds: '1 queen mattress on platform, 1 futon'
  },
  {
    listingId: LISTING_IDS.TOKYO,
    folderSearch: 'japan',
    storageName: 'tokyo',
    room: 'Capsule Pod',
    beds: '1 Neo-Showa sleeping platform'
  },
];

async function main() {
  console.log('🚀 Fixing all bedroom images\n');

  // List folders
  console.log('📂 Available folders:');
  const folders = readdirSync(imagesDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  folders.forEach(f => console.log(`   - ${f}`));
  console.log('');

  for (const config of bedroomConfigs) {
    console.log(`\n📦 ${config.room} (${config.folderSearch})`);

    const folder = findFolder(config.folderSearch);
    if (!folder) {
      // Try alternate search for Mars
      if (config.folderSearch === 'spacex mars') {
        const altFolder = findFolder('processed-mars-final');
        if (altFolder) {
          console.log(`   Found alternate folder: processed-mars-final`);
          const bedroomPath = findBedroomImage(altFolder);
          if (bedroomPath) {
            const ext = path.extname(bedroomPath).toLowerCase();
            const storagePath = `bedrooms/${config.storageName}-bedroom${ext}`;
            console.log(`   Found: ${path.basename(bedroomPath)}`);

            const imageUrl = await uploadImage(bedroomPath, storagePath);
            if (imageUrl) {
              console.log(`   ✅ Uploaded: ${storagePath}`);

              const { error } = await supabase
                .from('listings')
                .update({
                  sleeping_arrangements: [{
                    room: config.room,
                    beds: config.beds,
                    image_url: imageUrl
                  }]
                })
                .eq('id', config.listingId);

              if (error) console.error(`   ❌ DB error:`, error.message);
              else console.log(`   ✅ Updated listing`);
            }
          }
        }
      }
      continue;
    }

    console.log(`   Found folder: ${path.basename(folder)}`);
    const bedroomPath = findBedroomImage(folder);

    if (!bedroomPath) {
      console.log(`   ⚠️  No bedroom image found`);
      continue;
    }

    const ext = path.extname(bedroomPath).toLowerCase();
    const storagePath = `bedrooms/${config.storageName}-bedroom${ext}`;
    console.log(`   Found: ${path.basename(bedroomPath)}`);

    const imageUrl = await uploadImage(bedroomPath, storagePath);
    if (imageUrl) {
      console.log(`   ✅ Uploaded: ${storagePath}`);

      const { error } = await supabase
        .from('listings')
        .update({
          sleeping_arrangements: [{
            room: config.room,
            beds: config.beds,
            image_url: imageUrl
          }]
        })
        .eq('id', config.listingId);

      if (error) console.error(`   ❌ DB error:`, error.message);
      else console.log(`   ✅ Updated listing`);
    }
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
