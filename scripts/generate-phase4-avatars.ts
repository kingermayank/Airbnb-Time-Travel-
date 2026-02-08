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

// ============================================================================
// LISTING AND HOST IDS
// ============================================================================

const LISTING_IDS = {
  MIAMI_UNDERWATER: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
  AMAZON_BIODOME: 'a1b2c3d4-e5f6-7890-abcd-222222222222',
  LUNAR_HILTON: 'a1b2c3d4-e5f6-7890-abcd-333333333333',
  FLOATING_CITY: 'a1b2c3d4-e5f6-7890-abcd-444444444444',
  STAR_TREK_SUITE: 'a1b2c3d4-e5f6-7890-abcd-555555555555',
  BERMUDA_PLATFORM: 'a1b2c3d4-e5f6-7890-abcd-666666666666',
  AREA_51_BARRACKS: 'a1b2c3d4-e5f6-7890-abcd-777777777777',
  STONE_AGE_CAVE: 'a1b2c3d4-e5f6-7890-abcd-888888888888',
};

const HOST_IDS = {
  CAPTAIN_ROSA: 'b1c2d3e4-f5a6-7890-bcde-111111111111',
  GAIA_12: 'b1c2d3e4-f5a6-7890-bcde-222222222222',
  CHARLOTTE_HILTON_MUSK: 'b1c2d3e4-f5a6-7890-bcde-333333333333',
  KAI_NAKAMURA_CHEN: 'b1c2d3e4-f5a6-7890-bcde-444444444444',
  ADMIRAL_CHEN_HOLOGRAM: 'b1c2d3e4-f5a6-7890-bcde-555555555555',
  UNKNOWN_BERMUDA: 'b1c2d3e4-f5a6-7890-bcde-666666666666',
  REDACTED_AREA51: 'b1c2d3e4-f5a6-7890-bcde-777777777777',
  GROK_RIVER_CLAN: 'b1c2d3e4-f5a6-7890-bcde-888888888888',
};

// ============================================================================
// AVATAR CONFIGURATIONS
// ============================================================================

interface AvatarConfig {
  listing_id: string | null;
  host_id: string | null;
  type: 'host' | 'reviewer';
  name: string;
  prompt: string;
}

const avatarConfigs: AvatarConfig[] = [
  // ============================================================================
  // HOSTS
  // ============================================================================
  {
    listing_id: null,
    host_id: HOST_IDS.CAPTAIN_ROSA,
    type: 'host',
    name: 'Captain Rosa Delgado',
    prompt: 'Professional headshot portrait of a confident Latina woman in her 50s, former real estate agent turned submarine captain, short grey-streaked hair, weathered but warm face, wearing a nautical captain\'s jacket, underwater habitat visible through window behind her, soft studio lighting, realistic, high quality photograph',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.GAIA_12,
    type: 'host',
    name: 'GAIA-12',
    prompt: 'Artistic representation of an AI conservation system, glowing green and blue holographic female face emerging from a tree trunk, eyes made of leaves, hair flowing like vines, bioluminescent particles, rainforest background visible through transparent face, ethereal lighting, digital art style, high quality',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.CHARLOTTE_HILTON_MUSK,
    type: 'host',
    name: 'Charlotte Hilton-Musk VIII',
    prompt: 'Professional headshot portrait of an extremely wealthy young woman in her 30s, perfectly styled platinum blonde hair, designer space-age outfit, moon surface visible through window behind her, slightly bored expression, luxury lunar hotel suite setting, soft studio lighting, realistic, high quality photograph',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.KAI_NAKAMURA_CHEN,
    type: 'host',
    name: 'Kai Nakamura-Chen',
    prompt: 'Professional headshot portrait of a friendly mixed-race Asian man in his 40s, salt-and-pepper hair slightly windswept, wearing a practical waterproof jacket, warm smile, floating city visible through window behind him, ocean horizon, natural lighting, realistic, high quality photograph',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.ADMIRAL_CHEN_HOLOGRAM,
    type: 'host',
    name: 'Admiral Chen Holographic Recreation',
    prompt: 'Professional headshot portrait of a distinguished Asian man in his 60s as a hologram, wearing Star Trek-style Starfleet admiral uniform, slight blue holographic shimmer effect, transparent edges, USS Enterprise-style starship interior behind him, soft lighting, high quality digital art',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.UNKNOWN_BERMUDA,
    type: 'host',
    name: 'Signal Lost',
    prompt: 'Mysterious corrupted photograph, barely visible human silhouette standing on research platform at sea, heavy static interference, image splitting and fragmenting, 1950s photograph style degraded with temporal anomalies, eerie green glow around edges, intentionally corrupted image effect',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.REDACTED_AREA51,
    type: 'host',
    name: 'REDACTED',
    prompt: 'Deliberately obscured portrait photograph, figure in dark suit with face completely blacked out by censorship bar, Area 51 desert background visible, 1962 photograph style, grainy black and white, official government document aesthetic, TOP SECRET stamp partially visible',
  },
  {
    listing_id: null,
    host_id: HOST_IDS.GROK_RIVER_CLAN,
    type: 'host',
    name: 'Grok of the River Clan',
    prompt: 'Portrait of a friendly Cro-Magnon caveman, strong but approachable features, long tangled brown hair and beard, wearing animal furs, cave paintings visible on wall behind him, warm fire light illuminating face, proud expression, historically accurate Stone Age appearance, high quality digital art',
  },

  // ============================================================================
  // REVIEWERS - Miami Underwater
  // ============================================================================
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    host_id: null,
    type: 'reviewer',
    name: 'Jacques Cousteau',
    prompt: 'Professional headshot portrait of Jacques Cousteau, the famous French oceanographer and explorer, wearing his iconic red knit cap, weathered face from years at sea, kind intelligent eyes, ocean background, vintage photograph style, realistic, high quality',
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    host_id: null,
    type: 'reviewer',
    name: 'Aquaman',
    prompt: 'Professional headshot portrait of Aquaman, muscular blonde man with long hair, underwater kingdom aesthetic, wearing green and gold armor, confident heroic expression, underwater bubbles and light rays, comic book movie style, high quality',
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    host_id: null,
    type: 'reviewer',
    name: 'Kevin Costner',
    prompt: 'Professional headshot portrait of Kevin Costner the actor, rugged handsome features, salt and pepper hair, wearing practical waterworld-style clothing, confident weathered expression, ocean background, natural lighting, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    host_id: null,
    type: 'reviewer',
    name: 'Dory',
    prompt: 'Cute portrait of Dory the blue tang fish from Finding Nemo, friendly expressive eyes, big smile, underwater ocean background with coral reef, Pixar animation style but slightly realistic, colorful tropical fish aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.MIAMI_UNDERWATER,
    host_id: null,
    type: 'reviewer',
    name: 'Al Gore',
    prompt: 'Professional headshot portrait of Al Gore, distinguished older gentleman, silver hair neatly combed, wearing business suit, thoughtful concerned expression, environmental graphs visible in background, professional lighting, realistic, high quality photograph',
  },

  // ============================================================================
  // REVIEWERS - Amazon Biodome
  // ============================================================================
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    host_id: null,
    type: 'reviewer',
    name: 'David Attenborough',
    prompt: 'Professional headshot portrait of Sir David Attenborough, elderly British naturalist, kind wise expression, white hair, wearing safari-style shirt, rainforest leaves visible behind him, soft natural lighting, documentary style, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    host_id: null,
    type: 'reviewer',
    name: 'Greta Thunberg',
    prompt: 'Professional headshot portrait of a young Swedish environmental activist with braided hair, determined passionate expression, wearing simple clothing, forest background, natural lighting, documentary style, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    host_id: null,
    type: 'reviewer',
    name: 'The Lorax',
    prompt: 'Portrait of The Lorax, small orange fuzzy creature with large yellow mustache, standing protectively near a small tree, expressive concerned eyes, environmental guardian aesthetic, Seuss-style but slightly realistic, colorful background, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    host_id: null,
    type: 'reviewer',
    name: 'Jane Goodall',
    prompt: 'Professional headshot portrait of Jane Goodall, elderly British primatologist, silver hair in ponytail, warm wise smile, wearing practical field clothing, rainforest background with hint of wildlife, natural lighting, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.AMAZON_BIODOME,
    host_id: null,
    type: 'reviewer',
    name: 'Captain Planet',
    prompt: 'Portrait of Captain Planet, muscular superhero with green mullet hair, blue skin, red chest emblem with Earth symbol, confident heroic pose, Earth visible in background, 1990s cartoon style but slightly realistic, colorful dramatic lighting, high quality digital art',
  },

  // ============================================================================
  // REVIEWERS - Lunar Hilton
  // ============================================================================
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    host_id: null,
    type: 'reviewer',
    name: 'Buzz Aldrin',
    prompt: 'Professional headshot portrait of Buzz Aldrin the astronaut, distinguished elderly man, confident proud expression, wearing NASA flight jacket, American flag pin visible, moon surface photograph visible behind him, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    host_id: null,
    type: 'reviewer',
    name: 'Jeff Bezos',
    prompt: 'Professional headshot portrait of a wealthy bald businessman, confident slight smirk, wearing casual expensive clothing, space rocket visible through window behind him, modern tech office aesthetic, professional lighting, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    host_id: null,
    type: 'reviewer',
    name: 'Princess Luna',
    prompt: 'Portrait of Princess Luna from My Little Pony, dark blue alicorn with flowing starry mane, crescent moon cutie mark, regal serene expression, night sky with stars and moon behind her, fantasy royal aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    host_id: null,
    type: 'reviewer',
    name: 'Wallace',
    prompt: 'Portrait of Wallace from Wallace and Gromit, cheerful British man with large nose and friendly smile, wearing green sweater vest, holding cheese, quirky British cottage interior, Aardman animation style but slightly realistic, warm lighting, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.LUNAR_HILTON,
    host_id: null,
    type: 'reviewer',
    name: 'Nicole Kidman',
    prompt: 'Professional headshot portrait of a glamorous Australian actress with strawberry blonde hair, elegant ethereal expression, wearing sophisticated evening attire, soft cinematic lighting, movie star aesthetic, realistic, high quality photograph',
  },

  // ============================================================================
  // REVIEWERS - Floating City
  // ============================================================================
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    host_id: null,
    type: 'reviewer',
    name: 'Moana',
    prompt: 'Portrait of Moana, young Polynesian woman with long curly black hair adorned with flowers, warm confident smile, ocean and traditional sailing canoe behind her, Pacific Islander features, Disney-inspired but slightly realistic style, tropical lighting, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    host_id: null,
    type: 'reviewer',
    name: 'Captain Ahab',
    prompt: 'Portrait of Captain Ahab, grizzled 19th century whaling captain, intense obsessive eyes, grey beard and weathered face, wearing period-appropriate captain coat, stormy sea behind him, dramatic moody lighting, 1850s aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    host_id: null,
    type: 'reviewer',
    name: 'Ponyo',
    prompt: 'Cute portrait of Ponyo, small magical fish girl with round face and red hair, big happy smile, underwater and waves around her, Studio Ghibli animation style but slightly realistic, colorful whimsical aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.FLOATING_CITY,
    host_id: null,
    type: 'reviewer',
    name: 'Bear Grylls',
    prompt: 'Professional headshot portrait of Bear Grylls, the survival expert, rugged outdoor appearance, confident capable expression, wearing practical survival gear, wilderness ocean background, natural lighting, adventurer aesthetic, realistic, high quality photograph',
  },

  // ============================================================================
  // REVIEWERS - Star Trek Suite
  // ============================================================================
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    host_id: null,
    type: 'reviewer',
    name: 'Captain Kirk',
    prompt: 'Professional headshot portrait of Captain James T Kirk from Star Trek, confident commanding expression, wearing gold Starfleet uniform, USS Enterprise bridge visible behind him, dramatic studio lighting, classic Star Trek aesthetic, high quality',
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    host_id: null,
    type: 'reviewer',
    name: 'Spock',
    prompt: 'Professional headshot portrait of Spock from Star Trek, Vulcan features with pointed ears, raised eyebrow, calm logical expression, wearing blue Starfleet science uniform, USS Enterprise setting, dramatic studio lighting, high quality',
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    host_id: null,
    type: 'reviewer',
    name: 'Worf',
    prompt: 'Professional headshot portrait of Worf from Star Trek, Klingon warrior with pronounced forehead ridges, stern honorable expression, wearing Starfleet uniform with Klingon baldric, USS Enterprise setting, dramatic lighting, high quality',
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    host_id: null,
    type: 'reviewer',
    name: 'Data',
    prompt: 'Professional headshot portrait of Data from Star Trek, android with pale gold skin and yellow eyes, curious innocent expression, wearing Starfleet operations uniform, USS Enterprise setting, soft studio lighting, high quality',
  },
  {
    listing_id: LISTING_IDS.STAR_TREK_SUITE,
    host_id: null,
    type: 'reviewer',
    name: 'Q',
    prompt: 'Professional headshot portrait of Q from Star Trek, mischievous omnipotent being in human form, smug amused expression, wearing Starfleet captain uniform mockingly, cosmic starfield behind him, dramatic otherworldly lighting, high quality',
  },

  // ============================================================================
  // REVIEWERS - Bermuda Triangle
  // ============================================================================
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    host_id: null,
    type: 'reviewer',
    name: 'Amelia Earhart',
    prompt: 'Professional headshot portrait of Amelia Earhart, the famous female aviator, short curly hair, wearing leather flight jacket and goggles on forehead, determined adventurous expression, 1930s photograph style with slight temporal distortion effect, vintage sepia tones, high quality',
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    host_id: null,
    type: 'reviewer',
    name: 'D.B. Cooper',
    prompt: 'Mysterious portrait of a man in 1970s business suit and sunglasses, face partially obscured by shadow, holding briefcase, airplane window visible behind him, noir mystery aesthetic, intentionally ambiguous features, vintage 1971 photograph style, high quality',
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    host_id: null,
    type: 'reviewer',
    name: 'Schrodingers Cat',
    prompt: 'Surreal portrait of a cat that is both visible and invisible simultaneously, half-transparent ghost effect, sitting inside an open box, quantum physics symbols floating around, paradox aesthetic, both alive and dead vibes, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    host_id: null,
    type: 'reviewer',
    name: 'Captain Jack Sparrow',
    prompt: 'Portrait of Captain Jack Sparrow, eccentric pirate with dreadlocks and bandana, kohl-rimmed eyes, multiple beads and trinkets in hair, mischievous grin, Caribbean sea behind him, golden hour lighting, Pirates of the Caribbean aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.BERMUDA_PLATFORM,
    host_id: null,
    type: 'reviewer',
    name: 'Flight 19',
    prompt: 'Vintage 1945 group photograph of five US Navy aviators in flight suits, slightly faded and water-damaged, mysterious fog overlay, Bermuda Triangle aesthetic, haunting nostalgic quality, WWII military photograph style, high quality with intentional degradation',
  },

  // ============================================================================
  // REVIEWERS - Area 51
  // ============================================================================
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    host_id: null,
    type: 'reviewer',
    name: 'Fox Mulder',
    prompt: 'Professional headshot portrait of FBI Agent Fox Mulder, intense intelligent eyes, slight smile, wearing FBI suit and badge, I WANT TO BELIEVE poster partially visible behind him, dramatic X-Files style lighting, 1990s aesthetic, high quality',
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    host_id: null,
    type: 'reviewer',
    name: 'ET',
    prompt: 'Portrait of E.T. the Extra-Terrestrial, cute alien with wrinkled brown skin and large blue eyes, glowing red heart-finger, warm compassionate expression, dark background with distant Earth visible, Spielberg movie aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    host_id: null,
    type: 'reviewer',
    name: 'Giorgio Tsoukalos',
    prompt: 'Professional headshot portrait of Giorgio Tsoukalos, the Ancient Aliens guy, his famous wild spiky hair, enthusiastic expression, wearing dark blazer, mysterious alien-themed background, History Channel aesthetic, realistic, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    host_id: null,
    type: 'reviewer',
    name: 'Men in Black Will Smith',
    prompt: 'Professional portrait of a secret agent in black suit and sunglasses, confident cool expression, holding a silver pen-like device, government building background, noir secret agent aesthetic, Will Smith inspired, high quality',
  },
  {
    listing_id: LISTING_IDS.AREA_51_BARRACKS,
    host_id: null,
    type: 'reviewer',
    name: 'Bob Lazar',
    prompt: 'Professional headshot portrait of a middle-aged man with receding hairline, earnest slightly paranoid expression, wearing casual button-up shirt, desert Nevada background, 1980s photograph style, whistleblower aesthetic, realistic, high quality',
  },

  // ============================================================================
  // REVIEWERS - Stone Age Cave
  // ============================================================================
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    host_id: null,
    type: 'reviewer',
    name: 'Fred Flintstone',
    prompt: 'Portrait of Fred Flintstone, large friendly caveman with black hair and 5 o\'clock shadow, wearing orange animal skin tunic, big smile, prehistoric cave setting with stone furniture, Hanna-Barbera style but slightly realistic, warm torch lighting, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    host_id: null,
    type: 'reviewer',
    name: 'Encino Man',
    prompt: 'Portrait of a recently unfrozen caveman in 1990s California, confused but friendly expression, long brown hair, wearing mix of prehistoric furs and modern 90s clothing, suburban background, comedy movie aesthetic, high quality digital art',
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    host_id: null,
    type: 'reviewer',
    name: 'Paleo Pete',
    prompt: 'Portrait of an extremely fit CrossFit enthusiast in caveman-inspired workout gear, overly enthusiastic expression, holding a paleolithic-style wooden club, modern gym background, fitness influencer aesthetic, humorous, high quality photograph',
  },
  {
    listing_id: LISTING_IDS.STONE_AGE_CAVE,
    host_id: null,
    type: 'reviewer',
    name: 'A Very Lost Influencer',
    prompt: 'Portrait of a glamorous young Instagram influencer completely out of place in prehistoric setting, perfect makeup and hair but covered in mud, horrified expression, holding a dead smartphone, cave background, comedy contrast aesthetic, high quality digital art',
  },
];

// ============================================================================
// AVATAR GENERATION FUNCTIONS
// ============================================================================

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

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Starting Phase 4 Avatar Generation\n');
  console.log('='.repeat(60));
  console.log(`📋 Total avatars to generate: ${avatarConfigs.length}`);
  console.log(`   - Hosts: ${avatarConfigs.filter(c => c.type === 'host').length}`);
  console.log(`   - Reviewers: ${avatarConfigs.filter(c => c.type === 'reviewer').length}`);
  console.log('='.repeat(60));

  // Create output directory for generated avatars
  const outputDir = path.join(__dirname, '..', 'images', 'avatars', 'phase4');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let isFirstRequest = true;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < avatarConfigs.length; i++) {
    const config = avatarConfigs[i];

    console.log(`\n${'='.repeat(60)}`);
    console.log(`👤 [${i + 1}/${avatarConfigs.length}] Processing: ${config.name} (${config.type})`);
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
      failCount++;
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
      failCount++;
      continue;
    }

    // Upload to Supabase Storage
    const storagePath = `avatars/phase4/${safeFileName}.webp`;
    const supabaseImageUrl = await uploadToSupabase(localPath, storagePath);

    if (!supabaseImageUrl) {
      console.error(`❌ Failed to upload avatar for ${config.name}`);
      failCount++;
      continue;
    }

    // Update database
    if (config.type === 'host' && config.host_id) {
      await updateHostProfilePicture(config.host_id, supabaseImageUrl);
    } else if (config.type === 'reviewer' && config.listing_id) {
      await updateReviewerAvatar(config.name, config.listing_id, supabaseImageUrl);
    }

    successCount++;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ Phase 4 Avatar Generation Complete!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📝 Summary:');
  console.log(`   - Successful: ${successCount}`);
  console.log(`   - Failed: ${failCount}`);
  console.log(`   - Generated avatars saved to: ${outputDir}`);
  console.log(`   - Images uploaded to Supabase Storage`);
  console.log(`   - Database updated with avatar URLs`);
  console.log('\n💡 Next steps:');
  console.log('   1. Check Supabase Dashboard → Storage → listing-images/avatars/phase4');
  console.log('   2. Check your listing detail pages to see the avatars');
  console.log('   3. Upload listing images (main images for each property)');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
