import { createClient } from '@supabase/supabase-js';
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

// Mapping of reviewer names to their time-origin (city and era)
const reviewerTimeOrigin: Record<string, { city: string; era: string }> = {
  // Historical figures
  'Marco Polo': { city: 'Venice', era: '1271 AD' },
  'Cleopatra VII': { city: 'Alexandria', era: '30 BC' },
  'Julius Caesar': { city: 'Rome', era: '44 BC' },
  'Genghis Khan': { city: 'Karakorum', era: '1227 AD' },
  'Napoleon Bonaparte': { city: 'Paris', era: '1815 AD' },
  'Queen Victoria': { city: 'London', era: '1871' },
  'Leonardo da Vinci': { city: 'Florence', era: '1519 AD' },
  'Oskar Schindler': { city: 'Kraków', era: '1945' },
  'Howard Carter': { city: 'London', era: '1922' },
  'Moses': { city: 'Memphis', era: '1300 BC' },
  'Diogenes': { city: 'Athens', era: '323 BC' },
  
  // Fictional characters - Titanic
  'Jack Dawson': { city: 'Chippewa Falls', era: '1912' },
  'Rose DeWitt Bukater': { city: 'Philadelphia', era: '1912' },
  'Molly Brown': { city: 'Denver', era: '1912' },
  'Benjamin Guggenheim': { city: 'New York', era: '1912' },
  'Leonardo DiCaprio': { city: 'Los Angeles', era: '1997' },
  
  // Fictional characters - Atlantean
  'Aquaman': { city: 'Atlantis', era: 'Present' },
  'Jacques Cousteau': { city: 'Marseille', era: '1970' },
  'Ariel': { city: 'Atlantica', era: 'Classical Era' },
  'Captain Nemo': { city: 'Mysterious Island', era: '1870' },
  'SpongeBob SquarePants': { city: 'Bikini Bottom', era: '1999' },
  
  // Fictional characters - Pandora
  'Jake Sully': { city: 'Pandora', era: '2154' },
  'Dr. Grace Augustine': { city: 'Earth', era: '2154' },
  'Avatar Aang': { city: 'Southern Air Temple', era: '100 AG' },
  'David Attenborough': { city: 'London', era: '2020' },
  'Colonel Miles Quaritch': { city: 'Earth', era: '2154' },
  
  // Fictional characters - Other
  'Indiana Jones': { city: 'New Haven', era: '1936' },
  'Captain America': { city: 'Brooklyn', era: '1945' },
  'Inglourious Brad': { city: 'Aldershot', era: '1944' },
  'Aladdin': { city: 'Agrabah', era: 'Classical Era' },
  'Wonder Woman': { city: 'Themyscira', era: '1918' },
  'Brendan Fraser': { city: 'Cairo', era: '1926' },
  'Asterix': { city: 'Armorica', era: '50 BC' },
  
  // 1990s characters
  'Jerry Seinfeld': { city: 'New York', era: '1995' },
  'Rachel Green': { city: 'New York', era: '1995' },
  'Will Smith': { city: 'Philadelphia', era: '1990' },
  'Carrie Bradshaw': { city: 'New York', era: '1998' },
  'Doc Brown': { city: 'Hill Valley', era: '1985' },
  
  // Mars Colony reviewers
  'Neil Armstrong': { city: 'Houston', era: '1969' },
  'Han Solo': { city: 'Corellia', era: '0 ABY' },
  'Neil deGrasse Tyson': { city: 'New York', era: '2020' },

  // "Fish out of water" reviewers
  'Germaphobe Gary': { city: 'Scottsdale', era: '2024' },
  'Nervous Nancy': { city: 'Des Moines', era: '2024' },
  'Timothy Teetotaler': { city: 'Salt Lake City', era: '2024' },
  'Harold History-Denier': { city: 'Portland', era: '2024' },
  'Allergic Allison': { city: 'Seattle', era: '2024' },
  'Vegan Victor': { city: 'Austin', era: '2024' },
  'Helicopter Mom Helen': { city: 'Suburban Chicago', era: '2024' },
  'Modernist Mike': { city: 'San Francisco', era: '2024' },
  'Minimalist Maya': { city: 'Brooklyn', era: '2024' },
  'Decorum Deborah': { city: 'Boston', era: '1952' },
  'Skeptical Steve': { city: 'Phoenix', era: '2024' },
  'Historian Harold': { city: 'Cambridge', era: '2024' },
  'Loud Larry': { city: 'Las Vegas', era: '2024' },
  'Tech Bro Tyler': { city: 'San Francisco', era: '2024' },
  'Pale Paul from Portland': { city: 'Portland', era: '2024' },
  'Peaceful Pete': { city: 'Boulder', era: '2024' },
  'Zoomer Zoe': { city: 'Los Angeles', era: '2024' },
};

async function main() {
  console.log('🚀 Populating reviewer time-origin data\n');

  // Fetch all reviews
  const { data: reviews, error: fetchError } = await supabase
    .from('reviews')
    .select('id, reviewer_name');

  if (fetchError) {
    console.error('❌ Error fetching reviews:', fetchError.message);
    process.exit(1);
  }

  if (!reviews || reviews.length === 0) {
    console.log('⚠️  No reviews found');
    return;
  }

  console.log(`📝 Found ${reviews.length} reviews to update\n`);

  let updated = 0;
  let skipped = 0;

  // Update each review with time-origin data
  for (const review of reviews) {
    const timeOrigin = reviewerTimeOrigin[review.reviewer_name];

    if (!timeOrigin) {
      console.log(`⚠️  No time-origin mapping found for: ${review.reviewer_name}`);
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('reviews')
      .update({
        reviewer_city: timeOrigin.city,
        reviewer_era: timeOrigin.era,
      })
      .eq('id', review.id);

    if (updateError) {
      console.error(`❌ Error updating review ${review.id}:`, updateError.message);
    } else {
      console.log(`✅ ${review.reviewer_name}: ${timeOrigin.city} · ${timeOrigin.era}`);
      updated++;
    }
  }

  console.log(`\n✅ Update complete!`);
  console.log(`   - Updated: ${updated}`);
  console.log(`   - Skipped: ${skipped}`);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

