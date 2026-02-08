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

// Delay between API requests to avoid rate limiting (in ms)
const API_DELAY = 12000; // 12 seconds to be safe

// Helper function to add delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// All listings with their hosts and reviewers
interface AvatarConfig {
  listingId: string;
  listingName: string;
  hostId: string;
  host: {
    name: string;
    prompt: string;
  };
  reviewers: Array<{
    name: string;
    prompt: string;
  }>;
}

const allListings: AvatarConfig[] = [
  // 1. Shah Jahan's Marble Suite
  {
    listingId: 'bdf429ac-9274-44e1-9986-b43dcffe87e9',
    listingName: 'Shah Jahan Marble Suite',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2446',
    host: {
      name: 'Emperor Shah Jahan',
      prompt: 'Professional portrait of Emperor Shah Jahan, the 5th Mughal Emperor of India who built the Taj Mahal, wearing ornate Mughal royal attire with jeweled turban, regal bearing, dignified expression, soft studio lighting, neutral background, high quality photograph, realistic, detailed face',
    },
    reviewers: [
      {
        name: 'Marco Polo',
        prompt: 'Professional portrait of Marco Polo, the famous Venetian merchant and explorer from the 13th century, wearing medieval Italian merchant clothing, weathered traveler appearance, wise eyes, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Cleopatra VII',
        prompt: 'Professional portrait of Cleopatra VII, the last pharaoh of Ancient Egypt, wearing Egyptian royal headdress and jewelry, kohl-lined eyes, regal and intelligent expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Indiana Jones',
        prompt: 'Professional portrait of Indiana Jones, the fictional archaeologist and adventurer played by Harrison Ford, wearing his iconic fedora hat and leather jacket, rugged academic appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Queen Victoria',
        prompt: 'Professional portrait of Queen Victoria of the United Kingdom, elderly dignified woman in black mourning dress with white lace cap, stern but noble expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Aladdin',
        prompt: 'Professional portrait of Aladdin, the charming street-smart young man from Arabian Nights, Middle Eastern features, purple vest and red fez cap, friendly mischievous smile, neutral background, high quality photograph, realistic, detailed face',
      },
    ],
  },
  // 2. Lost Atlantean Crystal Villa
  {
    listingId: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
    listingName: 'Atlantean Crystal Villa',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2447',
    host: {
      name: 'Lord Poseidon',
      prompt: 'Professional portrait of Poseidon, the Greek god of the sea, powerful man with flowing white hair and beard like ocean waves, wearing crown of coral and pearls, trident visible, intense blue eyes, regal oceanic deity appearance, neutral background, high quality photograph, realistic, detailed face',
    },
    reviewers: [
      {
        name: 'Aquaman',
        prompt: 'Professional portrait of Aquaman, the DC superhero king of Atlantis played by Jason Momoa, long hair, beard, wearing golden and green Atlantean armor, powerful oceanic warrior appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Jacques Cousteau',
        prompt: 'Professional portrait of Jacques Cousteau, the famous French oceanographer and explorer, wearing his iconic red beanie cap, weathered seafarer face, kind intelligent eyes, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Ariel',
        prompt: 'Professional portrait of Ariel, the Disney mermaid princess with iconic red hair, young woman with bright curious eyes, sea-green eyes, playful innocent expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Captain Nemo',
        prompt: 'Professional portrait of Captain Nemo from Twenty Thousand Leagues Under the Sea, sophisticated Indian prince turned submarine captain, dark beard, intense intellectual gaze, Victorian-era naval attire, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'SpongeBob SquarePants',
        prompt: 'Professional portrait of SpongeBob SquarePants reimagined as a realistic cheerful yellow sea sponge creature, big blue eyes, gap-toothed smile, enthusiastic friendly expression, underwater creature appearance, neutral background, high quality photograph, creative realistic interpretation',
      },
    ],
  },
  // 3. Titanic First-Class Suite
  {
    listingId: '0580d737-156f-49ea-abcb-621797f493cf',
    listingName: 'Titanic First Class Suite',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2448',
    host: {
      name: 'Captain Edward Smith',
      prompt: 'Professional portrait of Captain Edward John Smith, commander of the RMS Titanic, distinguished elderly British naval officer with white beard and mustache, wearing naval captain uniform with medals, dignified confident expression, neutral background, high quality photograph, realistic, detailed face',
    },
    reviewers: [
      {
        name: 'Jack Dawson',
        prompt: 'Professional portrait of Jack Dawson from Titanic played by Leonardo DiCaprio as a young man, charming working-class artist, tousled blonde hair, bright hopeful eyes, warm genuine smile, early 1900s attire, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Rose DeWitt Bukater',
        prompt: 'Professional portrait of Rose DeWitt Bukater from Titanic played by Kate Winslet, elegant young Edwardian woman, red hair, refined features, spirited intelligent expression, pearl earrings, early 1900s high society appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Molly Brown',
        prompt: 'Professional portrait of Molly Brown, the Unsinkable Molly Brown from Titanic, warm friendly wealthy American woman, elaborate Edwardian hat and dress, confident approachable smile, nouveau riche charm, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Benjamin Guggenheim',
        prompt: 'Professional portrait of Benjamin Guggenheim, wealthy American businessman from the Titanic era, distinguished gentleman in formal evening attire, well-groomed mustache, dignified refined appearance, early 1900s high society man, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Leonardo DiCaprio',
        prompt: 'Professional portrait of Leonardo DiCaprio the actor, modern day, handsome man with blonde hair, blue eyes, Hollywood star appearance, wearing formal attire, charming smile, neutral background, high quality photograph, realistic, detailed face',
      },
    ],
  },
  // 4. WWII Resistance Safehouse
  {
    listingId: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
    listingName: 'WWII Resistance Safehouse',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2449',
    host: {
      name: 'Hans & Sophie Hoffmann',
      prompt: 'Professional portrait of a young German couple from the 1940s resistance movement, man and woman in their twenties, wearing modest 1940s civilian clothing, determined brave expressions, simple dignified appearance, neutral background, high quality photograph, realistic, detailed faces',
    },
    reviewers: [
      {
        name: 'Oskar Schindler',
        prompt: 'Professional portrait of Oskar Schindler, the German industrialist who saved Jews during the Holocaust, middle-aged man wearing 1940s business suit, compassionate intelligent eyes, Nazi party pin visible on lapel, complex moral expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Anne Frank',
        prompt: 'Professional portrait of Anne Frank, the young Jewish girl who wrote the famous diary, teenage girl with dark hair, intelligent hopeful eyes, innocent yet wise expression, 1940s simple clothing, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Indiana Jones',
        prompt: 'Professional portrait of Indiana Jones, the fictional archaeologist and adventurer played by Harrison Ford, wearing his iconic fedora hat and leather jacket, rugged academic appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Captain America',
        prompt: 'Professional portrait of Captain America Steve Rogers played by Chris Evans, heroic blonde American soldier from WWII era, strong jaw, determined righteous expression, wearing military uniform, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Inglourious Brad',
        prompt: 'Professional portrait of Lieutenant Aldo Raine from Inglourious Basterds played by Brad Pitt, rugged American soldier with Southern charm, small mustache, confident smirk, WWII military uniform, neutral background, high quality photograph, realistic, detailed face',
      },
    ],
  },
  // 5. Pandora Floating Mountain Bungalow
  {
    listingId: '41f8401a-e8a8-42fa-9809-10604c91d274',
    listingName: 'Pandora Floating Bungalow',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2450',
    host: {
      name: "Neytiri te Tskaha Mo'at'ite",
      prompt: "Professional portrait of Neytiri from Avatar, blue-skinned Na'vi alien female, large golden cat-like eyes, flat broad nose, pointed ears, tribal beads and feathers in dark hair, fierce yet graceful warrior appearance, bioluminescent dots on skin, neutral background, high quality photograph, realistic, detailed face",
    },
    reviewers: [
      {
        name: 'Jake Sully',
        prompt: "Professional portrait of Jake Sully from Avatar in his Na'vi avatar form, blue-skinned male Na'vi, large amber eyes, strong features, warrior appearance with tribal markings, former marine turned Na'vi, determined compassionate expression, neutral background, high quality photograph, realistic, detailed face",
      },
      {
        name: 'Dr. Grace Augustine',
        prompt: 'Professional portrait of Dr. Grace Augustine from Avatar played by Sigourney Weaver, middle-aged female scientist, graying hair, intelligent sharp eyes, wearing research field clothing, no-nonsense academic appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Avatar Aang',
        prompt: 'Professional portrait of Avatar Aang from Avatar: The Last Airbender as a young bald monk, arrow tattoo on head, large gray eyes, peaceful wise expression despite young age, wearing orange and yellow Air Nomad robes, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'David Attenborough',
        prompt: 'Professional portrait of Sir David Attenborough, the famous British naturalist and broadcaster, elderly gentleman with white hair, kind intelligent eyes, wearing field expedition clothing, warm grandfatherly appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Colonel Miles Quaritch',
        prompt: 'Professional portrait of Colonel Miles Quaritch from Avatar played by Stephen Lang, battle-scarred military commander, severe buzz cut, prominent scars on face, intense intimidating expression, military uniform, neutral background, high quality photograph, realistic, detailed face',
      },
    ],
  },
  // 6. Ancient Egyptian Nile Villa
  {
    listingId: '32bb68c5-f89a-4a83-a8f3-90b712482575',
    listingName: 'Egyptian Nile Villa',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2451',
    host: {
      name: 'Imhotep',
      prompt: 'Professional portrait of Imhotep, the ancient Egyptian architect and physician who designed the Step Pyramid, bald head, clean-shaven, wearing white linen robes and gold collar necklace, intelligent dignified expression, ancient Egyptian high priest appearance, neutral background, high quality photograph, realistic, detailed face',
    },
    reviewers: [
      {
        name: 'Cleopatra VII',
        prompt: 'Professional portrait of Cleopatra VII, the last pharaoh of Ancient Egypt, wearing Egyptian royal headdress and jewelry, kohl-lined eyes, regal and intelligent expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Howard Carter',
        prompt: 'Professional portrait of Howard Carter, the British archaeologist who discovered Tutankhamun tomb, wearing 1920s expedition clothing with pith helmet, mustache, determined scholarly appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Moses',
        prompt: 'Professional portrait of Moses the biblical prophet, elderly bearded man with long white hair and beard, wearing simple ancient Hebrew robes, wise weathered face, commanding yet humble expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Brendan Fraser',
        prompt: 'Professional portrait of Brendan Fraser the actor known for The Mummy films, handsome man with dark hair, charming friendly smile, adventurous appearance, modern clothing, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Asterix',
        prompt: 'Professional portrait of Asterix the Gaul reimagined realistically, small but fierce Gaulish warrior, large blonde mustache, winged helmet, intelligent mischievous eyes, ancient Celtic appearance, neutral background, high quality photograph, creative realistic interpretation',
      },
    ],
  },
  // 7. Alexander's Campaign Tent
  {
    listingId: '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
    listingName: 'Alexander Campaign Tent',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2452',
    host: {
      name: 'Alexander the Great',
      prompt: 'Professional portrait of Alexander the Great, young Macedonian king and conqueror, curly blonde hair, clean-shaven, intense determined eyes, wearing Greek military armor and red cloak, handsome heroic appearance, neutral background, high quality photograph, realistic, detailed face',
    },
    reviewers: [
      {
        name: 'Julius Caesar',
        prompt: 'Professional portrait of Julius Caesar, Roman dictator and military general, middle-aged man with receding hair wearing laurel wreath, Roman toga, strong commanding features, intelligent ambitious expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Genghis Khan',
        prompt: 'Professional portrait of Genghis Khan, Mongol Empire founder, Asian man with long beard and traditional Mongol warrior appearance, wearing fur-lined armor and helmet, fierce conquering expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Napoleon Bonaparte',
        prompt: 'Professional portrait of Napoleon Bonaparte, French Emperor, short stature man with distinctive hairstyle, wearing French military uniform with medals, hand tucked in jacket, confident ambitious expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Wonder Woman',
        prompt: 'Professional portrait of Wonder Woman Diana Prince played by Gal Gadot, beautiful Amazonian warrior princess, dark hair, wearing golden tiara with red star, strong regal features, determined heroic expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Diogenes',
        prompt: 'Professional portrait of Diogenes the Cynic philosopher, elderly disheveled Greek man with long unkempt beard, wearing simple ragged robes, cynical amused expression, minimalist appearance, neutral background, high quality photograph, realistic, detailed face',
      },
    ],
  },
  // 8. 1990s Manhattan Loft
  {
    listingId: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
    listingName: '1990s Manhattan Loft',
    hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453',
    host: {
      name: 'Derek & Monica Chen',
      prompt: 'Professional portrait of a trendy Asian-American couple from 1990s New York, man and woman in their thirties, wearing 90s fashion - flannel shirts and high-waisted jeans, artistic bohemian appearance, warm creative expressions, neutral background, high quality photograph, realistic, detailed faces',
    },
    reviewers: [
      {
        name: 'Jerry Seinfeld',
        prompt: 'Professional portrait of Jerry Seinfeld the comedian, wearing his signature puffy shirt or casual 90s attire, curly dark hair, observational humor expression, confident New York comedian appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Rachel Green',
        prompt: 'Professional portrait of Rachel Green from Friends played by Jennifer Aniston, beautiful woman with signature 90s layered haircut, wearing trendy 90s fashion, friendly fashionable appearance, warm smile, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Will Smith',
        prompt: 'Professional portrait of Will Smith from the Fresh Prince era 1990s, young charismatic African-American man, wearing colorful 90s hip-hop fashion, bright infectious smile, cool confident expression, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Carrie Bradshaw',
        prompt: 'Professional portrait of Carrie Bradshaw from Sex and the City played by Sarah Jessica Parker, stylish woman with curly blonde hair, wearing fashionable outfit, thoughtful writer expression, chic NYC appearance, neutral background, high quality photograph, realistic, detailed face',
      },
      {
        name: 'Doc Brown',
        prompt: 'Professional portrait of Doc Brown from Back to the Future played by Christopher Lloyd, eccentric scientist with wild white hair sticking up, wearing lab coat, wide enthusiastic eyes, mad scientist genius appearance, neutral background, high quality photograph, realistic, detailed face',
      },
    ],
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
          aspect_ratio: '1:1', // Square for circular avatars
          output_format: 'webp',
          output_quality: 90,
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

      // If it's a URL string (older behavior)
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

async function updateHostProfilePicture(hostId: string, imageUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('hosts')
      .update({ profile_picture_url: imageUrl })
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
    const { error } = await supabase
      .from('reviews')
      .update({ reviewer_avatar_url: imageUrl })
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

// Get command line args to specify which listing(s) to process
const args = process.argv.slice(2);
const listingIndex = args.length > 0 ? parseInt(args[0], 10) : -1;

async function main() {
  console.log('🚀 Starting avatar generation for all listings\n');

  // Determine which listings to process
  const listingsToProcess = listingIndex >= 0 && listingIndex < allListings.length
    ? [allListings[listingIndex]]
    : allListings;

  if (listingIndex >= 0) {
    console.log(`📍 Processing only listing ${listingIndex + 1}: ${listingsToProcess[0].listingName}\n`);
  } else {
    console.log(`📍 Processing all ${allListings.length} listings\n`);
  }

  let totalGenerated = 0;
  let totalFailed = 0;
  let isFirstRequest = true;

  for (const listing of listingsToProcess) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📍 LISTING: ${listing.listingName}`);
    console.log(`   ID: ${listing.listingId}`);
    console.log(`${'='.repeat(70)}`);

    // Create output directory for this listing
    const safeListingName = listing.listingName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const outputDir = path.join(__dirname, '..', 'images', 'avatars', safeListingName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate host avatar
    console.log(`\n👑 Generating HOST avatar: ${listing.host.name}`);
    console.log(`${'─'.repeat(50)}`);

    if (!isFirstRequest) {
      console.log(`⏳ Waiting ${API_DELAY / 1000} seconds to avoid rate limiting...`);
      await delay(API_DELAY);
    }
    isFirstRequest = false;

    const hostBuffer = await generateImage(listing.host.prompt);

    if (hostBuffer) {
      const safeHostName = listing.host.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const localPath = path.join(outputDir, `host-${safeHostName}.webp`);
      await saveImage(hostBuffer, localPath);

      const storagePath = `avatars/${listing.listingId}/host-${safeHostName}.webp`;
      const supabaseImageUrl = await uploadToSupabase(hostBuffer, storagePath);

      if (supabaseImageUrl) {
        await updateHostProfilePicture(listing.hostId, supabaseImageUrl);
        totalGenerated++;
      } else {
        totalFailed++;
      }
    } else {
      console.error(`❌ Failed to generate host avatar for ${listing.host.name}`);
      totalFailed++;
    }

    // Generate reviewer avatars
    for (const reviewer of listing.reviewers) {
      console.log(`\n👤 Generating REVIEWER avatar: ${reviewer.name}`);
      console.log(`${'─'.repeat(50)}`);

      console.log(`⏳ Waiting ${API_DELAY / 1000} seconds to avoid rate limiting...`);
      await delay(API_DELAY);

      const reviewerBuffer = await generateImage(reviewer.prompt);

      if (reviewerBuffer) {
        const safeReviewerName = reviewer.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const localPath = path.join(outputDir, `reviewer-${safeReviewerName}.webp`);
        await saveImage(reviewerBuffer, localPath);

        const storagePath = `avatars/${listing.listingId}/reviewer-${safeReviewerName}.webp`;
        const supabaseImageUrl = await uploadToSupabase(reviewerBuffer, storagePath);

        if (supabaseImageUrl) {
          await updateReviewerAvatar(reviewer.name, listing.listingId, supabaseImageUrl);
          totalGenerated++;
        } else {
          totalFailed++;
        }
      } else {
        console.error(`❌ Failed to generate reviewer avatar for ${reviewer.name}`);
        totalFailed++;
      }
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ Avatar generation complete!');
  console.log(`${'='.repeat(70)}\n`);
  console.log('📝 Summary:');
  console.log(`   ✅ Successfully generated: ${totalGenerated} avatars`);
  console.log(`   ❌ Failed: ${totalFailed} avatars`);
  console.log('\n💡 Next steps:');
  console.log('   1. Run the SQL script to update hosts and reviews: scripts/update-all-listings-content.sql');
  console.log('   2. Check Supabase Dashboard → Storage → listing-images/avatars');
  console.log('   3. Refresh your listing detail pages to see the avatars');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
