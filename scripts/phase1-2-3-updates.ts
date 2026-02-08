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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Listing IDs for reference
const LISTING_IDS = {
  SHAH_JAHAN: 'bdf429ac-9274-44e1-9986-b43dcffe87e9',
  ATLANTIS: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b',
  TITANIC: '0580d737-156f-49ea-abcb-621797f493cf',
  WWII: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5',
  PANDORA: '41f8401a-e8a8-42fa-9809-10604c91d274',
  EGYPT: '32bb68c5-f89a-4a83-a8f3-90b712482575',
  ALEXANDER: '385e8c54-9458-4fc4-8482-4b2efe7efc2b',
  NYC_90S: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93',
  MARS: '4b3ef07d-7b6c-4a8e-9f5d-2c1a8e3b9d4f', // Need to find actual ID
};

// ============================================================================
// PHASE 1: REVIEW SYSTEM EXPANSION
// ============================================================================

// All reviews with cross-timeline responses, badges, and "fish out of water" negative reviews
const allReviews = [
  // ============================================================================
  // Shah Jahan's Marble Suite
  // ============================================================================
  {
    listing_id: LISTING_IDS.SHAH_JAHAN,
    reviewer_name: 'Marco Polo',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I have traveled from Venice to China and back. I have seen palaces, temples, and wonders beyond description. But this marble suite? The inlay work alone took my breath away. I tried to describe it in my journal but gave up after three pages. Some things you just have to experience.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.SHAH_JAHAN,
    reviewer_name: 'Cleopatra VII',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'The pietra dura rivals Alexandria. Peacocks too loud at dawn. Brought my own asp.',
    badges: JSON.stringify([{ type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Marco Polo',
    response_comment: 'Marco speaks true about the craftsmanship. Though Venice has nothing on Egypt.',
  },
  {
    listing_id: LISTING_IDS.SHAH_JAHAN,
    reviewer_name: 'Indiana Jones',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Came for research. Did NOT steal anything, despite what the guards say. The hidden compartments are fascinating from a purely academic perspective.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.SHAH_JAHAN,
    reviewer_name: 'Queen Victoria',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 4.7, rating_cleanliness: 5.0, rating_accuracy: 4.5,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'We were amused.',
    badges: JSON.stringify([{ type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.SHAH_JAHAN,
    reviewer_name: 'Aladdin',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Way better than my lamp. 10/10.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: 'Indiana Jones',
    response_comment: 'Dr. Jones is right about the hidden rooms. I found three he missed. Not saying where.',
  },
  // "Fish out of water" negative review
  {
    listing_id: LISTING_IDS.SHAH_JAHAN,
    reviewer_name: 'Germaphobe Gary',
    reviewer_avatar_url: null,
    review_date: '2024-11-28',
    rating_overall: 2.5, rating_cleanliness: 1.5, rating_accuracy: 4.0,
    rating_communication: 3.0, rating_location: 4.0, rating_checkin: 3.0, rating_value: 2.0,
    comment: 'No hand sanitizer ANYWHERE. Asked about the cleaning schedule and they looked at me like I was speaking another language. The peacocks are NOT hygienic. Do you know how much bacteria is in a peacock feather? I DO.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // Atlantean Crystal Villa
  // ============================================================================
  {
    listing_id: LISTING_IDS.ATLANTIS,
    reviewer_name: 'Aquaman',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Finally, a listing that gets underwater living. The crystal tech puts Atlantis Prime to shame. Spent three days talking to the local fish - the gossip down here is WILD.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.ATLANTIS,
    reviewer_name: 'Jacques Cousteau',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I have explored every ocean on Earth. Nothing prepared me for this. The marine life is extraordinary - species I have never documented, behaving in ways that defy biology. I filled seventeen notebooks. My camera kept malfunctioning near the power core. Mysterious.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: 'Aquaman',
    response_comment: 'Arthur is right about the fish gossip. The anglerfish know EVERYTHING.',
  },
  {
    listing_id: LISTING_IDS.ATLANTIS,
    reviewer_name: 'Ariel',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'Like my grotto but BETTER. So many human things! Do not tell Sebastian.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.ATLANTIS,
    reviewer_name: 'Captain Nemo',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'The engineering is centuries ahead. I have taken extensive notes.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Jacques Cousteau',
    response_comment: 'Cousteau - the camera malfunctions are intentional. Trust me.',
  },
  {
    listing_id: LISTING_IDS.ATLANTIS,
    reviewer_name: 'SpongeBob SquarePants',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I am ready! I am ready! Best vacation ever!',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  // "Fish out of water" - someone afraid of water
  {
    listing_id: LISTING_IDS.ATLANTIS,
    reviewer_name: 'Nervous Nancy',
    reviewer_avatar_url: null,
    review_date: '2024-11-25',
    rating_overall: 2.0, rating_cleanliness: 5.0, rating_accuracy: 2.0,
    rating_communication: 3.0, rating_location: 1.0, rating_checkin: 3.0, rating_value: 2.0,
    comment: 'Listing said "underwater views." I thought it meant through glass FROM LAND. I cannot swim. Spent the entire stay hyperventilating. The pressure gauge in my room did NOT help my anxiety. Beautiful though.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // Titanic First-Class Suite
  // ============================================================================
  {
    listing_id: LISTING_IDS.TITANIC,
    reviewer_name: 'Jack Dawson',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Best four days of my life. The ending was a bit rough but would definitely book again. King of the world vibes.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.TITANIC,
    reviewer_name: 'Rose DeWitt Bukater',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 4.9, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'The grand staircase is truly magnificent. I learned to spit properly off the bow, danced in steerage, and had my portrait drawn. Lost a priceless diamond but honestly, worth it. My heart will go on.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Jack Dawson',
    response_comment: 'Jack, there WAS room on that door. I have measured.',
  },
  {
    listing_id: LISTING_IDS.TITANIC,
    reviewer_name: 'Molly Brown',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Unsinkable, just like me! What could go wrong?',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.TITANIC,
    reviewer_name: 'Benjamin Guggenheim',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Civilization at its peak. I have dressed in my finest evening wear every night. If anything were to happen, I am prepared to go down as a gentleman. But nothing will happen. Obviously.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: 'Molly Brown',
    response_comment: 'Margaret, your optimism is... bold.',
  },
  {
    listing_id: LISTING_IDS.TITANIC,
    reviewer_name: 'Leonardo DiCaprio',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 4.7, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'The door is definitely big enough for two people. Just saying.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: 'Rose DeWitt Bukater',
    response_comment: 'THANK YOU.',
  },
  // "Fish out of water" - spoiler-knowing guest
  {
    listing_id: LISTING_IDS.TITANIC,
    reviewer_name: 'Historian Harold',
    reviewer_avatar_url: null,
    review_date: '2024-11-20',
    rating_overall: 3.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 4.0, rating_location: 5.0, rating_checkin: 4.0, rating_value: 2.0,
    comment: 'Absolutely stunning ship, but I could not enjoy ANYTHING knowing what was coming. Kept trying to warn the crew. They thought I was seasick. Counted the lifeboats obsessively. There are not enough. DID NOT SLEEP.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // WWII Resistance Safehouse
  // ============================================================================
  {
    listing_id: LISTING_IDS.WWII,
    reviewer_name: 'Oskar Schindler',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'The hidden compartments are ingeniously designed. I took notes for my factory. Discreet, dignified, necessary.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.WWII,
    reviewer_name: 'Leonardo da Vinci',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 4.5, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Magnifico! The engineering of these hidden compartments rivals my own designs. I sketched the mechanisms for hours - the counterweights, the pivot points, bellissimo! The hosts showed true Renaissance spirit. I left them detailed blueprints for improvements, including a flying escape machine they politely declined.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: 'Oskar Schindler',
    response_comment: 'Herr Schindler - I see you appreciate fine engineering. We would have much to discuss.',
  },
  {
    listing_id: LISTING_IDS.WWII,
    reviewer_name: 'Indiana Jones',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 4.8, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Perfect for laying low. Found interesting documents in the wall safe. For academic purposes only.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.WWII,
    reviewer_name: 'Captain America',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'These are the real heroes.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Indiana Jones',
    response_comment: 'Dr. Jones, those documents belong in a museum.',
  },
  {
    listing_id: LISTING_IDS.WWII,
    reviewer_name: 'Inglourious Brad',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 4.7, rating_cleanliness: 4.0, rating_accuracy: 4.5,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Bonjourno. Left them a carved wooden bear.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  // "Fish out of water" - loud modern tourist
  {
    listing_id: LISTING_IDS.WWII,
    reviewer_name: 'Loud Larry',
    reviewer_avatar_url: null,
    review_date: '2024-11-22',
    rating_overall: 2.5, rating_cleanliness: 4.0, rating_accuracy: 3.0,
    rating_communication: 2.0, rating_location: 3.0, rating_checkin: 2.0, rating_value: 3.0,
    comment: 'Everyone kept shushing me?? I was just asking for the wifi password. The "discreet entrance" is very confusing. I knocked on the wrong door THREE times. Some guy in a trench coat kept following me. 2/5 stars, very stressful.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // Pandora Floating Mountain Bungalow
  // ============================================================================
  {
    listing_id: LISTING_IDS.PANDORA,
    reviewer_name: 'Jake Sully',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I live here now, but objectively - most incredible place in the known universe. Do not touch anything until Neytiri says okay. Trust me.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.PANDORA,
    reviewer_name: 'Dr. Grace Augustine',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Unprecedented access to Pandoran flora. The neural network between the trees is visible from the deck. Spent nights talking to Eywa. Not sure she answered but the forest listens. Cigarettes not recommended at this altitude.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Jake Sully',
    response_comment: 'Jake is right. I touched something. Spent three days unable to feel my left arm.',
  },
  {
    listing_id: LISTING_IDS.PANDORA,
    reviewer_name: 'Avatar Aang',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'The spiritual energy rivals the Spirit World. Appa loved it here.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.PANDORA,
    reviewer_name: 'David Attenborough',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I wept openly on several occasions.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: 'Avatar Aang',
    response_comment: 'Your flying bison is remarkable. The ikran were fascinated.',
  },
  {
    listing_id: LISTING_IDS.PANDORA,
    reviewer_name: 'Colonel Miles Quaritch',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 3.5, rating_cleanliness: 3.0, rating_accuracy: 4.0,
    rating_communication: 2.0, rating_location: 5.0, rating_checkin: 3.0, rating_value: 3.0,
    comment: 'Hostile territory. Wildlife tried to kill me three times. Bed was comfortable though. Will return with reinforcements.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  // "Fish out of water" - tech addict
  {
    listing_id: LISTING_IDS.PANDORA,
    reviewer_name: 'Tech Bro Tyler',
    reviewer_avatar_url: null,
    review_date: '2024-11-18',
    rating_overall: 2.0, rating_cleanliness: 4.0, rating_accuracy: 3.0,
    rating_communication: 2.0, rating_location: 4.0, rating_checkin: 3.0, rating_value: 2.0,
    comment: 'Zero cell service. ZERO. The "neural network" is not wifi, I checked. Tried to charge my phone using the crystal energy and it exploded. Had to talk to TREES for entertainment. Absolutely gorgeous but this is not a viable workspace for remote employees.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // Ancient Egyptian Nile Villa
  // ============================================================================
  {
    listing_id: LISTING_IDS.EGYPT,
    reviewer_name: 'Cleopatra VII',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'This Old Kingdom villa reminded me of our glorious heritage. The Nile access was perfect for my barge. Imhotep is a legend. The pyramid views at sunrise brought tears to my kohl-lined eyes.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.EGYPT,
    reviewer_name: 'Howard Carter',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Wonderful things! For the record, I feel perfectly healthy.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Cleopatra VII',
    response_comment: 'Your Majesty, the Old Kingdom architecture predates even your magnificent era. Truly humbling.',
  },
  {
    listing_id: LISTING_IDS.EGYPT,
    reviewer_name: 'Moses',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Complicated feelings about Egypt. But this villa predates all of that. Did not need to perform any miracles during my stay, which was refreshing.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.EGYPT,
    reviewer_name: 'Brendan Fraser',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 4.5, rating_cleanliness: 4.5, rating_accuracy: 4.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Nothing came alive. Disappointed but also relieved?',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }, { type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: 'Moses',
    response_comment: 'Your restraint with the miracles is noted and appreciated.',
  },
  {
    listing_id: LISTING_IDS.EGYPT,
    reviewer_name: 'Asterix',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'These Egyptians are crazy! But in a good way. Did not need magic potion even once.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  // "Fish out of water" - sunburn victim
  {
    listing_id: LISTING_IDS.EGYPT,
    reviewer_name: 'Pale Paul from Portland',
    reviewer_avatar_url: null,
    review_date: '2024-11-15',
    rating_overall: 2.5, rating_cleanliness: 5.0, rating_accuracy: 4.0,
    rating_communication: 3.0, rating_location: 4.0, rating_checkin: 4.0, rating_value: 3.0,
    comment: 'Nobody warned me about the sun. SPF 50 lasted approximately 11 minutes. The locals kept calling me "the red one." Spent most of my trip hiding in the villa. Beautiful interior though. Would recommend bringing an umbrella. Or several.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // Alexander's Campaign Tent
  // ============================================================================
  {
    listing_id: LISTING_IDS.ALEXANDER,
    reviewer_name: 'Julius Caesar',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'I wept. Not because of the accommodation - which is excellent - but because Alexander achieved so much by my age while I had barely started. Veni, vidi, booked again.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.ALEXANDER,
    reviewer_name: 'Genghis Khan',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 4.8, rating_cleanliness: 4.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0,
    comment: 'Decent tent. I conquered more land but he did it with style. Good host, drinks too much.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: 'Julius Caesar',
    response_comment: 'Caesar, do not be so hard on yourself. You will do fine. Trust me.',
  },
  {
    listing_id: LISTING_IDS.ALEXANDER,
    reviewer_name: 'Napoleon Bonaparte',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Magnifique! He was taller than I expected. His horse is better than mine, which I find vexing.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.ALEXANDER,
    reviewer_name: 'Wonder Woman',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 4.7, rating_cleanliness: 4.5, rating_accuracy: 4.5,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'We sparred at dawn. He fights well for a mortal. Needs to listen to his generals more.',
    badges: JSON.stringify([{ type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Napoleon Bonaparte',
    response_comment: 'The horse, Bucephalus, is indeed magnificent. Do not feel bad about the height.',
  },
  {
    listing_id: LISTING_IDS.ALEXANDER,
    reviewer_name: 'Diogenes',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 3.5, rating_cleanliness: 3.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 4.0, rating_checkin: 3.5, rating_value: 2.5,
    comment: 'Too many possessions. I slept in my barrel outside.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  // "Fish out of water" - pacifist
  {
    listing_id: LISTING_IDS.ALEXANDER,
    reviewer_name: 'Peaceful Pete',
    reviewer_avatar_url: null,
    review_date: '2024-11-12',
    rating_overall: 2.0, rating_cleanliness: 3.0, rating_accuracy: 5.0,
    rating_communication: 3.0, rating_location: 3.0, rating_checkin: 4.0, rating_value: 2.0,
    comment: 'Everyone is SO aggressive here. They kept offering me swords. I said I was a vegetarian and they looked confused. The morning war councils wake you up at 4am. Not a relaxing getaway.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }]),
    response_to_reviewer: null,
    response_comment: null,
  },

  // ============================================================================
  // 1990s Manhattan Loft
  // ============================================================================
  {
    listing_id: LISTING_IDS.NYC_90S,
    reviewer_name: 'Jerry Seinfeld',
    reviewer_avatar_url: null,
    review_date: '2024-12-20',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'What IS the deal with time travel listings? The answering machine messages alone are comedy gold. Kramer stopped by and somehow already knew the host. Not that there is anything wrong with that.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.NYC_90S,
    reviewer_name: 'Rachel Green',
    reviewer_avatar_url: null,
    review_date: '2024-12-15',
    rating_overall: 4.9, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5,
    comment: 'Oh. My. God. The vintage clothing! Could this BE any more 90s?',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }]),
    response_to_reviewer: 'Jerry Seinfeld',
    response_comment: 'Jerry, the answering machine bit? Genius. We should write that down.',
  },
  {
    listing_id: LISTING_IDS.NYC_90S,
    reviewer_name: 'Will Smith',
    reviewer_avatar_url: null,
    review_date: '2024-12-10',
    rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0,
    comment: 'Fresh Prince vibes everywhere. Carlton would hate it here. 10/10.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  {
    listing_id: LISTING_IDS.NYC_90S,
    reviewer_name: 'Carrie Bradshaw',
    reviewer_avatar_url: null,
    review_date: '2024-12-05',
    rating_overall: 4.8, rating_cleanliness: 4.5, rating_accuracy: 5.0,
    rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'I could not help but wonder... is pre-internet dating better? After a week in this loft, I have my answer: absolutely. No swiping, no apps, just meeting people at gallery openings.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }]),
    response_to_reviewer: 'Will Smith',
    response_comment: 'Will, Carlton would DEFINITELY hate it here. That is what makes it perfect.',
  },
  {
    listing_id: LISTING_IDS.NYC_90S,
    reviewer_name: 'Doc Brown',
    reviewer_avatar_url: null,
    review_date: '2024-12-01',
    rating_overall: 4.7, rating_cleanliness: 4.0, rating_accuracy: 5.0,
    rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5,
    comment: 'Great Scott! A time travel listing where I am the guest! 1.21 gigawatts not required.',
    badges: JSON.stringify([{ type: 'verified_time_traveler', label: 'Verified Time Traveler' }, { type: 'temporal_regular', label: 'Temporal Regular' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
  // "Fish out of water" - Gen Z visitor
  {
    listing_id: LISTING_IDS.NYC_90S,
    reviewer_name: 'Zoomer Zoe',
    reviewer_avatar_url: null,
    review_date: '2024-11-10',
    rating_overall: 3.0, rating_cleanliness: 5.0, rating_accuracy: 5.0,
    rating_communication: 2.0, rating_location: 5.0, rating_checkin: 4.0, rating_value: 3.0,
    comment: 'No wifi??? The phone is ATTACHED TO THE WALL??? I had to use a PAPER MAP to find a coffee shop. The TV has like 30 channels and NONE of them are streaming services. The host kept telling me to "just be present" whatever that means. Aesthetic is fire though ngl.',
    badges: JSON.stringify([{ type: 'survived_the_trip', label: 'Survived the Trip' }, { type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }]),
    response_to_reviewer: null,
    response_comment: null,
  },
];

// ============================================================================
// PHASE 2: HOST UPDATES
// ============================================================================

// Updated hosts with unique personas (not historical figures, not Elon)
const hostUpdates = [
  {
    name: 'Monica Geller',
    description: 'Head chef, cleaning enthusiast, and proud owner of the most organized apartment in Manhattan. I know what you are thinking - yes, the categories in the bathroom closet ARE color-coded. This SoHo loft has been cleaned to my exacting standards, which means you could eat off any surface. Literally. I have tested this. The kitchen is fully stocked, the towels are folded into swans, and if you move anything, I will know. I WILL KNOW.',
    house_rules_quirks: JSON.stringify([
      'Coasters are NOT optional',
      'The guest towels are decorative. DO NOT USE THEM.',
      'Shoes off at the door. Yes, this includes your socks if they look dirty.',
      'The labeled containers in the fridge? Those labels are there for a reason.',
    ]),
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'identity_verified', label: 'Identity Verified' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
    ]),
    is_temporal_guardian: true,
  },
  {
    name: 'Cosmos Vance',
    description: 'Interplanetary hospitality consultant and former SpaceX habitat designer. I have spent fifteen years perfecting the art of making hostile environments feel like home. My Mars colony pod has hosted over 200 temporal visitors, zero fatalities, and only three minor depressurization incidents (all resolved within seconds). I believe every guest deserves a view of the stars - even if those stars are from a different planet.',
    house_rules_quirks: JSON.stringify([
      'Airlock procedures must be followed exactly. This is not a suggestion.',
      'The emergency oxygen is for emergencies only. If you are breathing fine, do not touch it.',
      'Rover keys are on the hook. Please return them with at least 20% charge.',
      'If the red light flashes, remain calm and consult the laminated card.',
    ]),
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'identity_verified', label: 'Identity Verified' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
    ]),
    is_temporal_guardian: true,
  },
  {
    name: 'Zephyr Meridian',
    description: 'Dimension-hopping curator of impossible spaces. My portfolio includes underwater palaces, floating mountain retreats, and the occasional pocket universe. I specialize in properties that technically should not exist. Every listing I manage has been personally vetted across at least three timelines to ensure maximum comfort and minimal paradoxes. Former archaeologist. Current guardian of the weird and wonderful.',
    house_rules_quirks: JSON.stringify([
      'Do not feed the local fauna unless they introduce themselves first',
      'Crystal energy is complimentary but please do not lick the power sources',
      'The bioluminescence dims at midnight. This is intentional.',
      'If something glows unexpectedly, notify me immediately',
    ]),
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'identity_verified', label: 'Identity Verified' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
      { type: 'cross_dimensional_host', label: 'Cross-Dimensional Host' },
    ]),
    is_temporal_guardian: true,
  },
  {
    name: 'Thaddeus Chronwell',
    description: 'Historian, preservationist, and temporal real estate specialist with 30 years experience in heritage accommodations. I maintain properties across twelve centuries, from Mughal palaces to medieval strongholds. Every stay in my listings is a carefully preserved moment in time. I personally verify historical accuracy down to the thread count. Yes, the beds are period-appropriate. No, I will not add modern mattresses. Authenticity matters.',
    house_rules_quirks: JSON.stringify([
      'Photography is permitted but flash may attract unwanted attention in certain eras',
      'Period-appropriate behavior is appreciated but not required',
      'Modern items must remain in your quarters. Do not leave your phone in 1650.',
      'The secret passages are for emergencies only. I know where they all lead.',
    ]),
    badges: JSON.stringify([
      { type: 'superhost', label: 'Superhost' },
      { type: 'identity_verified', label: 'Identity Verified' },
      { type: 'temporal_guardian', label: 'Temporal Guardian' },
    ]),
    is_temporal_guardian: true,
  },
];

// ============================================================================
// PHASE 3: THINGS TO KNOW (per listing)
// ============================================================================

const thingsToKnow: Record<string, any> = {
  [LISTING_IDS.SHAH_JAHAN]: {
    house_rules: [
      { rule: 'Respect the marble - no shoes on inlaid surfaces', icon: 'footprints' },
      { rule: 'Peacocks have right of way', icon: 'bird' },
      { rule: 'Photography permitted, but no touching the pietra dura', icon: 'camera' },
      { rule: 'Traditional dress appreciated but not required', icon: 'shirt' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: false, note: 'Not invented yet' },
      { item: 'First aid kit', available: true, note: 'Mughal-era herbal remedies included' },
      { item: 'Fire extinguisher', available: false, note: 'Water buckets provided' },
      { item: 'Carbon monoxide detector', available: false, note: 'Open-air courtyards provide ventilation' },
    ],
    cancellation_highlight: 'Free cancellation up to 5 days before your journey through time',
  },
  [LISTING_IDS.ATLANTIS]: {
    house_rules: [
      { rule: 'Please do not feed the kraken', icon: 'fish' },
      { rule: 'Crystal energy is complimentary - do not attempt to harvest', icon: 'gem' },
      { rule: 'Quiet hours enforced by the ocean itself after midnight', icon: 'moon' },
      { rule: 'Swimming certification not required but strongly recommended', icon: 'waves' },
    ],
    safety_and_property: [
      { item: 'Pressure regulation', available: true, note: 'Automatic adjustment' },
      { item: 'Emergency surfacing protocol', available: true, note: 'Takes 3 minutes' },
      { item: 'Underwater escape routes', available: true, note: 'Clearly marked in bioluminescent paint' },
      { item: 'First aid kit', available: true, note: 'Includes anti-jellyfish ointment' },
    ],
    cancellation_highlight: 'Free cancellation up to 7 days before descent',
  },
  [LISTING_IDS.TITANIC]: {
    house_rules: [
      { rule: 'Life jacket orientation: Deck 7 (attendance optional but... recommended)', icon: 'shield' },
      { rule: 'Dress code enforced for first-class dining', icon: 'shirt' },
      { rule: 'Third-class areas accessible but frowned upon by staff', icon: 'users' },
      { rule: 'The bow is available for romantic moments before 10pm', icon: 'heart' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: false, note: 'Not standard in 1912' },
      { item: 'Life jackets', available: true, note: 'Under your bed' },
      { item: 'Sufficient lifeboats', available: false, note: 'Management is confident this is fine' },
      { item: 'First aid kit', available: true, note: 'Ships surgeon on call' },
    ],
    cancellation_highlight: 'Free cancellation up to 3 days before departure. No refunds after April 14th.',
  },
  [LISTING_IDS.WWII]: {
    house_rules: [
      { rule: 'Do not answer the door. Ever. For anyone. We mean it.', icon: 'door-closed' },
      { rule: 'Keep voices low at all times', icon: 'volume-x' },
      { rule: 'Blackout curtains must remain closed after dark', icon: 'moon' },
      { rule: 'If anyone asks, you are visiting your cousin Werner', icon: 'user' },
    ],
    safety_and_property: [
      { item: 'Escape routes', available: true, note: 'Three documented, one secret' },
      { item: 'Hidden compartments', available: true, note: 'Do not store snacks in these' },
      { item: 'First aid kit', available: true, note: 'Concealed behind false bookshelf' },
      { item: 'Emergency contacts', available: true, note: 'Memorize and destroy' },
    ],
    cancellation_highlight: 'Cancellation possible but the less paperwork the better',
  },
  [LISTING_IDS.PANDORA]: {
    house_rules: [
      { rule: 'Do not touch anything until Neytiri says okay', icon: 'hand' },
      { rule: 'Exopack must be worn outside the pressurized areas', icon: 'wind' },
      { rule: 'Bonding with local wildlife is at your own risk', icon: 'paw-print' },
      { rule: 'Respect the neural network - it is not wifi', icon: 'network' },
    ],
    safety_and_property: [
      { item: 'Breathable air', available: false, note: 'Exopack provided' },
      { item: 'Predator deterrent system', available: true, note: 'Mostly effective' },
      { item: 'Emergency beacon', available: true, note: 'Range: 4.37 light-years' },
      { item: 'First aid kit', available: true, note: 'Pandoran flora remedies included' },
    ],
    cancellation_highlight: 'Free cancellation up to 7 days before interstellar departure',
  },
  [LISTING_IDS.EGYPT]: {
    house_rules: [
      { rule: 'Offerings to household gods appreciated but optional', icon: 'sparkles' },
      { rule: 'Nile access included - crocodiles are the Niles responsibility', icon: 'waves' },
      { rule: 'Papyrus scrolls in the library are for reading, not souvenirs', icon: 'scroll' },
      { rule: 'Sun protection is YOUR responsibility', icon: 'sun' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: false, note: 'Servants monitor for fires' },
      { item: 'First aid kit', available: true, note: 'Includes mummification basics' },
      { item: 'Curse protection', available: false, note: 'Not our department' },
      { item: 'Sunscreen', available: false, note: 'Bring your own or suffer' },
    ],
    cancellation_highlight: 'Free cancellation up to 5 days before your journey to antiquity',
  },
  [LISTING_IDS.ALEXANDER]: {
    house_rules: [
      { rule: 'War councils begin at 4am. Attendance optional but respected.', icon: 'sun' },
      { rule: 'Weapons must be peace-bonded within the commanders tent', icon: 'sword' },
      { rule: 'The good wine is for victories only', icon: 'wine' },
      { rule: 'Horses have priority in camp pathways', icon: 'horse' },
    ],
    safety_and_property: [
      { item: 'Guard rotation', available: true, note: '24/7 perimeter security' },
      { item: 'Medical tent', available: true, note: 'Battlefield surgeons on staff' },
      { item: 'Fire suppression', available: false, note: 'Its a tent. Be careful.' },
      { item: 'Escape route', available: true, note: 'Alexander does not retreat, but guests may' },
    ],
    cancellation_highlight: 'Free cancellation up to 3 days before campaign departure',
  },
  [LISTING_IDS.NYC_90S]: {
    house_rules: [
      { rule: 'Coasters are NOT optional', icon: 'circle' },
      { rule: 'The guest towels are decorative. DO NOT USE THEM.', icon: 'ban' },
      { rule: 'VHS tapes must be rewound before returning', icon: 'rewind' },
      { rule: 'Long distance calls will be billed - and yes, I check', icon: 'phone' },
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: true, note: '9-volt battery (included)' },
      { item: 'Fire extinguisher', available: true, note: 'Under the kitchen sink' },
      { item: 'First aid kit', available: true, note: 'Organized by injury type, alphabetically' },
      { item: 'Carbon monoxide detector', available: true, note: 'State of the art for 1994' },
    ],
    cancellation_highlight: 'Free cancellation up to 2 days before your trip to the pre-internet era',
  },
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('Starting Phase 1, 2, 3 Updates...\n');

  // ============================================================================
  // PHASE 1: Update Reviews
  // ============================================================================
  console.log('PHASE 1: Updating Reviews with cross-timeline responses and badges\n');

  // First, delete existing reviews
  const listingIds = Object.values(LISTING_IDS).filter(id => id !== LISTING_IDS.MARS);

  for (const listingId of listingIds) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('listing_id', listingId);

    if (error && !error.message.includes('0 rows')) {
      console.error(`Error deleting reviews for ${listingId}:`, error.message);
    }
  }
  console.log('Deleted existing reviews\n');

  // Insert new reviews
  let reviewCount = 0;
  for (const review of allReviews) {
    const { error } = await supabase
      .from('reviews')
      .insert(review);

    if (error) {
      console.error(`Error inserting review by ${review.reviewer_name}:`, error.message);
    } else {
      reviewCount++;
    }
  }
  console.log(`Inserted ${reviewCount} reviews with badges and cross-timeline responses\n`);

  // ============================================================================
  // PHASE 2: Update Hosts
  // ============================================================================
  console.log('PHASE 2: Updating Host Profiles\n');

  // Get existing hosts
  const { data: existingHosts } = await supabase
    .from('hosts')
    .select('*');

  if (existingHosts) {
    for (const host of existingHosts) {
      // Find matching update based on role/listing assignment
      let update: any = null;

      if (host.name === 'Monica Geller') {
        update = hostUpdates.find(h => h.name === 'Monica Geller');
      } else if (host.name === 'Elon' || host.name.includes('Mars') || host.name.includes('Space')) {
        update = hostUpdates.find(h => h.name === 'Cosmos Vance');
      } else if (host.name === 'Adventure Host' || host.name.includes('Adventure')) {
        update = hostUpdates.find(h => h.name === 'Zephyr Meridian');
      } else if (host.name === 'Historical Host' || host.name.includes('Historical')) {
        update = hostUpdates.find(h => h.name === 'Thaddeus Chronwell');
      }

      if (update) {
        const { error } = await supabase
          .from('hosts')
          .update({
            name: update.name,
            description: update.description,
            house_rules_quirks: update.house_rules_quirks,
            badges: update.badges,
            is_temporal_guardian: update.is_temporal_guardian,
          })
          .eq('id', host.id);

        if (error) {
          console.error(`Error updating host ${host.name}:`, error.message);
        } else {
          console.log(`Updated host: ${host.name} -> ${update.name}`);
        }
      }
    }
  }
  console.log('');

  // ============================================================================
  // PHASE 3: Update Listings with Things to Know
  // ============================================================================
  console.log('PHASE 3: Adding Things to Know sections\n');

  for (const [listingId, data] of Object.entries(thingsToKnow)) {
    const { error } = await supabase
      .from('listings')
      .update({
        things_to_know: data,
      })
      .eq('id', listingId);

    if (error) {
      console.error(`Error updating listing ${listingId}:`, error.message);
    } else {
      console.log(`Updated Things to Know for listing ${listingId.slice(0, 8)}...`);
    }
  }

  console.log('\n All phases completed!');
  console.log('\nSummary:');
  console.log(`  - ${reviewCount} reviews with badges and cross-timeline responses`);
  console.log('  - 4 host profiles updated with unique personas');
  console.log('  - 8 listings updated with Things to Know sections');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
