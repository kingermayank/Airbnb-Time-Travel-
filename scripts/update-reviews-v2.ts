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

// Updated host for 1990s Manhattan Loft - Monica Geller
const monicaGellerHost = {
  id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453',
  name: 'Monica Geller',
  profile_picture_url: null,
  join_date: '2024-01-01',
  response_rate: 100,
  response_time: 'immediately',
  is_superhost: true,
  is_identity_verified: true,
  total_reviews: 14,
  description: 'Head chef, cleaning enthusiast, and proud owner of the most organized apartment in Manhattan. I know what you are thinking - yes, the categories in the bathroom closet ARE color-coded. This SoHo loft has been cleaned to my exacting standards, which means you could eat off any surface. Literally. I have tested this. The kitchen is fully stocked, the towels are folded into swans, and if you move anything, I will know. I WILL KNOW.',
};

// All reviews with VARIABLE LENGTHS - mix of short (1 line), medium (2-3 lines), and long (4-5 lines)
const allReviews = [
  // ============================================================================
  // Shah Jahan's Marble Suite - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Marco Polo', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I have traveled from Venice to China and back. I have seen palaces, temples, and wonders beyond description. But this marble suite? The inlay work alone took my breath away. I tried to describe it in my journal but gave up after three pages. Some things you just have to experience.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Cleopatra VII', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'The pietra dura rivals Alexandria. Peacocks too loud at dawn. Brought my own asp.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Indiana Jones', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Came for research. Did NOT steal anything, despite what the guards say. The hidden compartments are fascinating from a purely academic perspective.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Queen Victoria', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.7, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'We were amused.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Aladdin', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Way better than my lamp. 10/10.' },

  // ============================================================================
  // Atlantean Crystal Villa - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Aquaman', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Finally, a listing that gets underwater living. The crystal tech puts Atlantis Prime to shame. Spent three days talking to the local fish - the gossip down here is WILD.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Jacques Cousteau', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I have explored every ocean on Earth. Nothing prepared me for this. The marine life is extraordinary - species I have never documented, behaving in ways that defy biology. I filled seventeen notebooks. My camera kept malfunctioning near the power core. Mysterious.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Ariel', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'Like my grotto but BETTER. So many human things! Do not tell Sebastian.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Captain Nemo', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'The engineering is centuries ahead. I have taken extensive notes.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'SpongeBob SquarePants', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I am ready! I am ready! Best vacation ever!' },

  // ============================================================================
  // Titanic First-Class Suite - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Jack Dawson', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Best four days of my life. The ending was a bit rough but would definitely book again. King of the world vibes.' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Rose DeWitt Bukater', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.9, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'The grand staircase is truly magnificent. I learned to spit properly off the bow, danced in steerage, and had my portrait drawn. Lost a priceless diamond but honestly, worth it. My heart will go on.' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Molly Brown', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Unsinkable, just like me! What could go wrong?' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Benjamin Guggenheim', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Civilization at its peak. I have dressed in my finest evening wear every night. If anything were to happen, I am prepared to go down as a gentleman. But nothing will happen. Obviously.' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Leonardo DiCaprio', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.7, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'The door is definitely big enough for two people. Just saying.' },

  // ============================================================================
  // WWII Resistance Safehouse - VARIABLE LENGTH REVIEWS (Leonardo da Vinci replaces Anne Frank)
  // ============================================================================
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Oskar Schindler', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'The hidden compartments are ingeniously designed. I took notes for my factory. Discreet, dignified, necessary.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Leonardo da Vinci', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 4.5, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Magnifico! The engineering of these hidden compartments rivals my own designs. I sketched the mechanisms for hours - the counterweights, the pivot points, bellissimo! The hosts showed true Renaissance spirit. I left them detailed blueprints for improvements, including a flying escape machine they politely declined.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Indiana Jones', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.8, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Perfect for laying low. Found interesting documents in the wall safe. For academic purposes only.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Captain America', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'These are the real heroes.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Inglourious Brad', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.7, rating_cleanliness: 4.0, rating_accuracy: 4.5, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Bonjourno. Left them a carved wooden bear.' },

  // ============================================================================
  // Pandora Floating Mountain Bungalow - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Jake Sully', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I live here now, but objectively - most incredible place in the known universe. Do not touch anything until Neytiri says okay. Trust me.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Dr. Grace Augustine', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Unprecedented access to Pandoran flora. The neural network between the trees is visible from the deck. Spent nights talking to Eywa. Not sure she answered but the forest listens. Cigarettes not recommended at this altitude.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Avatar Aang', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'The spiritual energy rivals the Spirit World. Appa loved it here.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'David Attenborough', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I wept openly on several occasions.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Colonel Miles Quaritch', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 3.5, rating_cleanliness: 3.0, rating_accuracy: 4.0, rating_communication: 2.0, rating_location: 5.0, rating_checkin: 3.0, rating_value: 3.0,
    comment: 'Hostile territory. Wildlife tried to kill me three times. Bed was comfortable though. Will return with reinforcements.' },

  // ============================================================================
  // Ancient Egyptian Nile Villa - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Cleopatra VII', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'This Old Kingdom villa reminded me of our glorious heritage. The Nile access was perfect for my barge. Imhotep is a legend. The pyramid views at sunrise brought tears to my kohl-lined eyes.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Howard Carter', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Wonderful things! For the record, I feel perfectly healthy.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Moses', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Complicated feelings about Egypt. But this villa predates all of that. Did not need to perform any miracles during my stay, which was refreshing.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Brendan Fraser', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.5, rating_cleanliness: 4.5, rating_accuracy: 4.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Nothing came alive. Disappointed but also relieved?' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Asterix', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'These Egyptians are crazy! But in a good way. Did not need magic potion even once.' },

  // ============================================================================
  // Alexander's Campaign Tent - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Julius Caesar', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I wept. Not because of the accommodation - which is excellent - but because Alexander achieved so much by my age while I had barely started. Veni, vidi, booked again.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Genghis Khan', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.8, rating_cleanliness: 4.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Decent tent. I conquered more land but he did it with style. Good host, drinks too much.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Napoleon Bonaparte', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Magnifique! He was taller than I expected. His horse is better than mine, which I find vexing.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Wonder Woman', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.7, rating_cleanliness: 4.5, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'We sparred at dawn. He fights well for a mortal. Needs to listen to his generals more.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Diogenes', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 3.5, rating_cleanliness: 3.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 4.0, rating_checkin: 3.5, rating_value: 2.5,
    comment: 'Too many possessions. I slept in my barrel outside.' },

  // ============================================================================
  // 1990s Manhattan Loft - VARIABLE LENGTH REVIEWS
  // ============================================================================
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Jerry Seinfeld', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'What IS the deal with time travel listings? The answering machine messages alone are comedy gold. Kramer stopped by and somehow already knew the host. Not that there is anything wrong with that.' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Rachel Green', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.9, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'Oh. My. God. The vintage clothing! Could this BE any more 90s?' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Will Smith', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Fresh Prince vibes everywhere. Carlton would hate it here. 10/10.' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Carrie Bradshaw', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.8, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'I could not help but wonder... is pre-internet dating better? After a week in this loft, I have my answer: absolutely. No swiping, no apps, just meeting people at gallery openings.' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Doc Brown', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.7, rating_cleanliness: 4.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Great Scott! A time travel listing where I am the guest! 1.21 gigawatts not required.' },
];

async function main() {
  console.log('🚀 Updating reviews with variable lengths + replacing hosts/reviewers\n');

  // Step 1: Update Monica Geller as host for 1990s Manhattan Loft
  console.log('👩‍🍳 Updating host to Monica Geller...');
  const { error: hostError } = await supabase
    .from('hosts')
    .upsert(monicaGellerHost, { onConflict: 'id' });

  if (hostError) {
    console.error(`❌ Error updating host:`, hostError.message);
  } else {
    console.log(`✅ Updated host: Monica Geller`);
  }

  // Step 2: Delete existing reviews for all listings
  console.log('\n🗑️  Deleting existing reviews...');
  const listingIds = [
    'bdf429ac-9274-44e1-9986-b43dcffe87e9', // Shah Jahan
    'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', // Atlantean
    '0580d737-156f-49ea-abcb-621797f493cf', // Titanic
    '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', // WWII
    '41f8401a-e8a8-42fa-9809-10604c91d274', // Pandora
    '32bb68c5-f89a-4a83-a8f3-90b712482575', // Egypt
    '385e8c54-9458-4fc4-8482-4b2efe7efc2b', // Alexander
    'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', // 90s NYC
  ];

  for (const listingId of listingIds) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('listing_id', listingId);

    if (error) {
      console.error(`❌ Error deleting reviews for ${listingId}:`, error.message);
    } else {
      console.log(`✅ Deleted reviews for ${listingId.slice(0, 8)}...`);
    }
  }

  // Step 3: Insert all new reviews with variable lengths
  console.log('\n📝 Inserting new reviews with variable lengths...');
  for (const review of allReviews) {
    const { error } = await supabase
      .from('reviews')
      .insert(review);

    if (error) {
      console.error(`❌ Error inserting review by ${review.reviewer_name}:`, error.message);
    } else {
      const commentLength = review.comment.length;
      const lengthLabel = commentLength < 50 ? '(SHORT)' : commentLength < 150 ? '(MEDIUM)' : '(LONG)';
      console.log(`✅ ${lengthLabel} ${review.reviewer_name}`);
    }
  }

  console.log('\n✅ Database update complete!');
  console.log('\n📝 Changes:');
  console.log('   - Monica Geller is now host of 1990s Manhattan Loft');
  console.log('   - Leonardo da Vinci replaced Anne Frank for WWII Safehouse');
  console.log('   - All reviews now have variable lengths (short/medium/long)');
  console.log('\n💡 Next: Generate new avatars for Monica Geller and Leonardo da Vinci');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
