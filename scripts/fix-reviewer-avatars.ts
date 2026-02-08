import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Mapping of reviewer names to their avatar filenames (shared across listings)
const reviewerAvatarFiles: Record<string, string> = {
  'Marco Polo': 'reviewer-marco-polo.webp',
  'Cleopatra VII': 'reviewer-cleopatra-vii.webp',
  'Indiana Jones': 'reviewer-indiana-jones.webp',
  'Queen Victoria': 'reviewer-queen-victoria.webp',
  'Aladdin': 'reviewer-aladdin.webp',
  'Aquaman': 'reviewer-aquaman.webp',
  'Jacques Cousteau': 'reviewer-jacques-cousteau.webp',
  'Ariel': 'reviewer-ariel.webp',
  'Captain Nemo': 'reviewer-captain-nemo.webp',
  'SpongeBob SquarePants': 'reviewer-spongebob-squarepants.webp',
  'Jack Dawson': 'reviewer-jack-dawson.webp',
  'Rose DeWitt Bukater': 'reviewer-rose-dewitt-bukater.webp',
  'Molly Brown': 'reviewer-molly-brown.webp',
  'Benjamin Guggenheim': 'reviewer-benjamin-guggenheim.webp',
  'Leonardo DiCaprio': 'reviewer-leonardo-dicaprio.webp',
  'Oskar Schindler': 'reviewer-oskar-schindler.webp',
  'Leonardo da Vinci': 'reviewer-leonardo-da-vinci.webp',
  'Captain America': 'reviewer-captain-america.webp',
  'Inglourious Brad': 'reviewer-inglourious-brad.webp',
  'Jake Sully': 'reviewer-jake-sully.webp',
  'Dr. Grace Augustine': 'reviewer-dr-grace-augustine.webp',
  'Avatar Aang': 'reviewer-avatar-aang.webp',
  'David Attenborough': 'reviewer-david-attenborough.webp',
  'Colonel Miles Quaritch': 'reviewer-colonel-miles-quaritch.webp',
  'Howard Carter': 'reviewer-howard-carter.webp',
  'Moses': 'reviewer-moses.webp',
  'Brendan Fraser': 'reviewer-brendan-fraser.webp',
  'Asterix': 'reviewer-asterix.webp',
  'Julius Caesar': 'reviewer-julius-caesar.webp',
  'Genghis Khan': 'reviewer-genghis-khan.webp',
  'Napoleon Bonaparte': 'reviewer-napoleon-bonaparte.webp',
  'Wonder Woman': 'reviewer-wonder-woman.webp',
  'Diogenes': 'reviewer-diogenes.webp',
  'Jerry Seinfeld': 'reviewer-jerry-seinfeld.webp',
  'Rachel Green': 'reviewer-rachel-green.webp',
  'Will Smith': 'reviewer-will-smith.webp',
  'Carrie Bradshaw': 'reviewer-carrie-bradshaw.webp',
  'Doc Brown': 'reviewer-doc-brown.webp',
};

async function main() {
  console.log('🔧 Fixing reviewer avatar URLs...\n');

  const baseUrl = `${supabaseUrl}/storage/v1/object/public/listing-images/avatars`;

  // Get all reviews
  const { data: reviews, error: fetchError } = await supabase
    .from('reviews')
    .select('id, reviewer_name, listing_id');

  if (fetchError) {
    console.error('❌ Failed to fetch reviews:', fetchError.message);
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const review of reviews || []) {
    const avatarFile = reviewerAvatarFiles[review.reviewer_name];

    if (!avatarFile) {
      console.log(`⏭️  ${review.reviewer_name} - no avatar file mapped`);
      skipped++;
      continue;
    }

    const avatarUrl = `${baseUrl}/${review.listing_id}/${avatarFile}?v=${Date.now()}`;

    const { error } = await supabase
      .from('reviews')
      .update({ reviewer_avatar_url: avatarUrl })
      .eq('id', review.id);

    if (error) {
      console.error(`❌ ${review.reviewer_name}: ${error.message}`);
    } else {
      console.log(`✅ ${review.reviewer_name}`);
      updated++;
    }
  }

  console.log(`\n✅ Updated: ${updated}`);
  console.log(`⏭️  Skipped (no avatar): ${skipped}`);
}

main().catch(console.error);
