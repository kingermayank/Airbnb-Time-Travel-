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

// All hosts data
const hosts = [
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2446',
    name: 'Emperor Shah Jahan',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 100,
    response_time: 'within a day',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 18,
    description: 'Fifth Mughal Emperor and architecture enthusiast. I built the Taj Mahal for my beloved wife Mumtaz, and honestly, the property values around here have never been better. When I am not commissioning world wonders or managing an empire spanning millions, I enjoy calligraphy, poetry, and reviewing guest feedback. My hosting philosophy: if it is not inlaid with precious stones, it is not finished.',
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2447',
    name: 'Lord Poseidon',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 95,
    response_time: 'within an hour',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 12,
    description: 'God of the Sea, Earthquakes, and Horses. Founder of Atlantis back when the continent was still above water (long story, do not ask my brother about it). I have been hosting visitors to my underwater realm for millennia. My crystal villas are powered by ancient technology that your scientists still cannot explain, which brings me great satisfaction. Fair warning: I take reviews personally. Very personally.',
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2448',
    name: 'Captain Edward Smith',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 98,
    response_time: 'within an hour',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 15,
    description: 'Commodore of the White Star Line with over 40 years of maritime experience. This was supposed to be my final voyage before retirement, and I have to say, it is going splendidly. The Titanic is the finest ship ever built - absolutely unsinkable, as the engineers keep assuring me. I pride myself on providing guests with a smooth, uneventful crossing. Nothing could possibly go wrong. Weather looks clear ahead.',
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2449',
    name: 'Hans & Sophie Hoffmann',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 92,
    response_time: 'within a few hours',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 8,
    description: 'University students by day, resistance members by night. We believe in a free Germany and have converted our family loft into a safehouse for those who share our vision. The location is discreet, the neighbors are trustworthy, and the hidden compartments have never failed an inspection. We cannot tell you more for your own safety. Check-in instructions will be delivered via dead drop. Knock three times, pause, then twice more.',
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2450',
    name: "Neytiri te Tskaha Mo'at'ite",
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 97,
    response_time: 'within an hour',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 22,
    description: "Daughter of the Omaticaya clan leaders and skilled hunter. I did not want to host sky people at first - you come here and do not See. But my mate Jake convinced me that some of you can learn. This bungalow floats among the Hallelujah Mountains where Eywa's presence is strongest. I will teach you to See if you are willing, or at least not to fall off the mountain. The ikran are not included but we can negotiate. Oel ngati kameie - I See you.",
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2451',
    name: 'Imhotep',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 99,
    response_time: 'within an hour',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 10,
    description: 'Chancellor to Pharaoh Djoser, architect of the Step Pyramid, high priest of Ra, and physician. Basically, I invented stone architecture. You are welcome. This villa showcases the finest Old Kingdom craftsmanship - I designed it myself during a quiet weekend. The Nile views are exceptional, the pyramid construction is visible from the terrace, and the hieroglyphic murals tell stories you cannot read but look impressive. I have also included my own medical remedies for common travel ailments. Do not worry, I was eventually deified. I know what I am doing.',
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2452',
    name: 'Alexander the Great',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 100,
    response_time: 'immediately',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 7,
    description: 'King of Macedonia, Pharaoh of Egypt, King of Persia, and Lord of Asia. Undefeated in battle. I conquered the known world by 30 and still had time to plan this listing. My campaign tent has hosted strategy sessions that shaped history. The Persian treasures are authentic - I took them personally. Aristotle was my tutor, so expect intellectual conversation. Currently planning to conquer India but taking a brief hosting break. The only thing I have not conquered is bad reviews.',
  },
  {
    id: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453',
    name: 'Derek & Monica Chen',
    profile_picture_url: null,
    join_date: '2024-01-01',
    response_rate: 94,
    response_time: 'within a few hours',
    is_superhost: true,
    is_identity_verified: true,
    total_reviews: 14,
    description: "Mixed media artists living the SoHo dream. We moved here when the rent was almost reasonable and have witnessed the neighborhood transform from industrial wasteland to cultural epicenter. Our loft doubles as gallery and living space - every wall tells a story. The answering machine is temperamental, the VHS collection is extensive, and the vinyl selection is chef's kiss. No internet because it does not really exist yet and honestly, we do not miss what we have never had. Leave a message after the beep.",
  },
];

// Listing to host mapping
const listingHostMap = [
  { listingId: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2446' },
  { listingId: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2447' },
  { listingId: '0580d737-156f-49ea-abcb-621797f493cf', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2448' },
  { listingId: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2449' },
  { listingId: '41f8401a-e8a8-42fa-9809-10604c91d274', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2450' },
  { listingId: '32bb68c5-f89a-4a83-a8f3-90b712482575', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2451' },
  { listingId: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2452' },
  { listingId: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', hostId: '5eb1303a-fa1a-44e2-ab18-e3c5b6fd2453' },
];

// All reviews data
const allReviews = [
  // Shah Jahan's Marble Suite
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Marco Polo', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'I have traveled from Venice to China and back. I have seen palaces, temples, and wonders beyond description. But this marble suite? The inlay work alone took my breath away. I tried to describe it in my journal but gave up after three pages. Some things you just have to experience. The morning chai service was exceptional, and the view of the Taj Mahal construction site is genuinely moving. Worth every ducat.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Cleopatra VII', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5, comment: 'As someone who knows a thing or two about opulent living, I was impressed. The pietra dura work rivals anything in Alexandria. My only note: the peacocks outside are beautiful but LOUD at dawn. Brought my own asp for security. The host was gracious and did not mention the incident with the fountain.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Indiana Jones', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0, comment: 'Came for research. Stayed for the architecture. Did NOT steal anything, despite what the guards are saying. The hidden compartments in the walls are fascinating from a purely academic perspective. The food was incredible, and I learned three new things about Mughal engineering that will definitely appear in my next lecture. Highly recommend the moonlit Taj viewing.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Queen Victoria', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.7, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'We were amused. The suite is rather lovely, though we found the lack of proper English tea somewhat vexing. The marble work is exquisite - we have made notes for renovations at Buckingham. The host was most accommodating, though his ideas about British-Indian relations were... optimistic.' },
  { listing_id: 'bdf429ac-9274-44e1-9986-b43dcffe87e9', reviewer_name: 'Aladdin', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'Way better than my lamp. 10/10.' },

  // Atlantean Crystal Villa
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Aquaman', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'Finally, a listing that understands underwater living. The crystal tech here puts Atlantis Prime to shame, and I live there. Spent three days just talking to the local fish population - the gossip down here is WILD. The bioluminescent bathroom alone is worth the trip. Poseidon was a gracious host, though he kept making passive-aggressive comments about my movie.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Jacques Cousteau', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'I have explored every ocean on Earth, but nothing prepared me for this. The marine life is extraordinary - species I have never documented, behaving in ways that defy conventional biology. I filled seventeen notebooks. The crystal energy system deserves its own documentary. Only minor issue: my camera kept malfunctioning near the power core. Mysterious.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Ariel', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5, comment: 'It is like my grotto but BETTER. So many human things! The crystal screens show moving pictures and everything. Daddy was NOT happy I stayed here but honestly the accommodations are superior. The coral garden is beautiful and I may have accidentally adopted a flounder. Bringing him home. Do not tell Sebastian.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'Captain Nemo', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0, comment: 'The Nautilus has taken me to wonders beyond imagination, but this villa exceeds even my highest expectations. The engineering is centuries ahead of its time - I have taken extensive notes. The water tunnel to the coral garden is a masterpiece of pressure management. The host and I had productive discussions about renewable energy and the failings of surface civilization.' },
  { listing_id: 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b', reviewer_name: 'SpongeBob SquarePants', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'I am ready! I am ready! Best vacation ever! The crystal walls are so shiny and the jellyfish outside are amazing! Patrick got lost in the water tunnel for six hours but he said it was the best six hours of his life. The kitchen is way fancier than the Krusty Krab. Do not tell Mr. Krabs.' },

  // Titanic First-Class Suite
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Jack Dawson', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'Okay so I technically won my ticket in a poker game and was in steerage, but I snuck up to see the first-class suites and WOW. The carved oak, the chandeliers, the private promenade - it is like nothing I have ever seen. Met an amazing girl up there too. Best four days of my life. The ending was a bit rough but I would definitely book again. King of the world vibes.' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Rose DeWitt Bukater', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.9, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5, comment: 'The accommodations were exquisite, if somewhat stifling with all the societal expectations. The grand staircase is truly magnificent. I learned to spit properly off the bow, danced in steerage, and had my portrait drawn. Life-changing experience. Lost a priceless diamond necklace overboard but honestly, worth it. My heart will go on. And on.' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Molly Brown', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'They call me unsinkable, and so is this ship! The first-class dining is absolutely divine - twelve courses! The suite has everything a Colorado mining heiress could want. Made some snooty aristocrats uncomfortable by being loud and nouveau riche. Their problem, not mine. Captain Smith runs a tight ship. What could go wrong?' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Benjamin Guggenheim', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0, comment: 'As a man accustomed to the finest things, I can confirm this suite meets every expectation. The mahogany paneling, the electric lights, the en-suite bathroom - civilization at its peak. I have dressed in my finest evening wear for dinner every night. If anything were to happen, I am prepared to go down as a gentleman. But nothing will happen. Obviously.' },
  { listing_id: '0580d737-156f-49ea-abcb-621797f493cf', reviewer_name: 'Leonardo DiCaprio', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.7, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'Felt strangely familiar, like I had been here before. Great for method acting research. The door in our suite is definitely big enough for two people to float on, just saying. Beautiful ship, haunting in a way I cannot quite explain. The band was excellent.' },

  // WWII Resistance Safehouse
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Oskar Schindler', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'An essential listing for anyone committed to doing the right thing in difficult times. The hidden compartments are ingeniously designed - I took notes for my factory. The hosts are brave beyond measure. Stayed three nights while arranging paperwork. The 1940s radio picks up BBC World Service if you know the frequency. Discreet, dignified, necessary.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Anne Frank', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 4.5, rating_checkin: 5.0, rating_value: 5.0, comment: 'I know something about hiding, and this place is exceptional. Much more spacious than my previous accommodation. The bookshelf entrance is clever - wish we had thought of that. Spent my time writing in my diary and dreaming of better days. The hosts provided paper and hope, which are equally valuable.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Indiana Jones', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.8, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'Needed a place to lay low after a disagreement with some people who shall remain nameless. The safehouse was perfect - unassuming exterior, secure interior, excellent sightlines. The covert entry system made me feel like a real spy. Found some interesting documents in the hidden wall safe. For academic purposes only, of course.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Captain America', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'Stopped by during a mission. The hosts represent everything good about humanity - courage, conviction, and really excellent homemade strudel. The loft reminded me why we fight. I could not stay long but I left inspired. These are the real heroes.' },
  { listing_id: '903e8b2c-dc8d-4d37-98f4-b98d1b250ae5', reviewer_name: 'Inglourious Brad', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.7, rating_cleanliness: 4.0, rating_accuracy: 4.5, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'Bonjourno. Needed a place for my team to coordinate. The safehouse delivered. Hidden compartments fit our equipment perfectly. The period radio was useful for intercepting transmissions. Hosts did not ask questions, which I appreciated. Left them a nice tip and a carved wooden bear.' },

  // Pandora Floating Mountain Bungalow
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Jake Sully', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'I mean, I live here now, but I can objectively say this is the most incredible place in the known universe. Waking up among floating mountains never gets old. The bioluminescence at night is beyond description. Neytiri is an amazing host - patient with newcomers, tough when needed. Just do not touch the horses. Or the dogs. Actually, do not touch anything until she says it is okay. Trust me on this.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Dr. Grace Augustine', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'As a xenobotanist, I can confirm this location offers unprecedented access to Pandoran flora. The neural network connections between the trees are visible from the bungalow deck. Spent most nights taking samples and talking to Eywa. Not sure she answered but the forest definitely listens. The living architecture is scientifically fascinating. Cigarettes not recommended at this altitude.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Avatar Aang', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'As someone who rides a flying bison, I thought I was prepared for floating mountains. I was not. The spiritual energy here rivals the Spirit World. Spent hours in meditation connecting with Eywa - she has similar energy to Raava. The bioluminescent nights reminded me of the Northern Water Tribe. Neytiri and I had a great conversation about balance. Appa loved it here.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'David Attenborough', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'In all my years documenting life on Earth, nothing compares to what I witnessed on Pandora. The bioluminescent ecosystem, the neural connectivity of the flora, the majestic creatures soaring between floating mountains - I wept openly on several occasions. I have narrated many wonders, but I was rendered speechless. The bungalow itself is a triumph of sustainable living architecture. Absolutely essential viewing.' },
  { listing_id: '41f8401a-e8a8-42fa-9809-10604c91d274', reviewer_name: 'Colonel Miles Quaritch', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 3.5, rating_cleanliness: 3.0, rating_accuracy: 4.0, rating_communication: 2.0, rating_location: 5.0, rating_checkin: 3.0, rating_value: 3.0, comment: 'Hostile territory but strategically valuable position. The floating location is tactically interesting. The host was... uncooperative with my requests for unobtanium mining access. The local wildlife tried to kill me three times. Bioluminescence made night operations difficult. The bed was comfortable though. Will return with reinforcements.' },

  // Ancient Egyptian Nile Villa
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Cleopatra VII', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'I rule Egypt from Alexandria, but this Old Kingdom villa reminded me of our glorious heritage. The Nile access was perfect for my barge. The lotus-shaped columns are exquisite - I have commissioned similar ones for my palace. Imhotep is a legend, and his hospitality matches his architectural genius. My asp was very comfortable here. The pyramid views at sunrise brought tears to my kohl-lined eyes.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Howard Carter', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0, comment: 'Wonderful things! This villa is a treasure trove of authentic Old Kingdom design. Spent hours sketching the hieroglyphics - they tell stories of Djoser reign that my colleagues will not believe. The host was generous with historical context, though he seemed puzzled by my questions about tomb curses. For the record, I feel perfectly healthy. The courtyard gardens are peaceful and the local cats are friendly.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Moses', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 4.8, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'Complicated feelings about Egypt, as you might imagine, but this villa predates all of that. The Nile views were nostalgic - spent time contemplating the river that once carried me. Imhotep was a thoughtful host who discussed architecture and medicine with genuine passion. The accommodations were excellent. Did not need to perform any miracles during my stay, which was refreshing.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Brendan Fraser', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.5, rating_cleanliness: 4.5, rating_accuracy: 4.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'Kept expecting something to come alive but nothing did. Very disappointed in that regard but also relieved? The host was surprisingly friendly and not at all cursed as far as I could tell. Nice villa, great views, authentic hieroglyphics that I definitely did not accidentally read aloud. The Book of the Dead on the coffee table was a nice decorative touch. Would cautiously recommend.' },
  { listing_id: '32bb68c5-f89a-4a83-a8f3-90b712482575', reviewer_name: 'Asterix', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.9, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'These Egyptians are crazy! But in a good way. The architecture here makes our Gaulish huts look primitive, which Obelix found offensive. The host showed us the pyramid construction and explained how it works (no aliens involved, despite what Obelix hoped). The Nile fish was delicious. Did not need magic potion even once. Brought back some papyrus for Getafix.' },

  // Alexander's Campaign Tent
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Julius Caesar', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'I wept when I visited this tent. Not because of the accommodation - which is excellent - but because Alexander achieved so much by my age while I had barely started. The Persian treasures are magnificent, the military maps inspiring. We discussed tactics over wine until dawn. He has some interesting ideas about world domination that I plan to... adapt. Veni, vidi, booked again.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Genghis Khan', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.8, rating_cleanliness: 4.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 5.0, comment: 'Decent tent. I have conquered more land but Alexander did it with style. The Persian silk hangings are softer than my yurt felt, which is both impressive and slightly annoying. We compared conquest strategies - his phalanx is interesting but my cavalry tactics are superior. Good host, ambitious, drinks too much. The location in Persia was nice but I prefer the steppes.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Napoleon Bonaparte', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'Magnifique! I have always admired Alexander, and staying in his actual tent was profoundly moving. The military maps showed campaigns I studied at academy. We discussed Egypt - I apparently will make some interesting choices there. He was taller than I expected. The accommodations are fit for a conqueror. His horse Bucephalus is better than any of mine, which I find vexing.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Wonder Woman', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.7, rating_cleanliness: 4.5, rating_accuracy: 4.5, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'My Amazon sisters have mixed feelings about Macedonian conquerors, but I must admit Alexander was a gracious host. We sparred at dawn - he fights well for a mortal. The tent contains fascinating artifacts from cultures he... encountered. His respect for Darius and the Persian customs shows honor. The military camp atmosphere was nostalgic. Good warrior, reasonable man, needs to listen to his generals more.' },
  { listing_id: '385e8c54-9458-4fc4-8482-4b2efe7efc2b', reviewer_name: 'Diogenes', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 3.5, rating_cleanliness: 3.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 4.0, rating_checkin: 3.5, rating_value: 2.5, comment: 'Alexander visited me once and offered anything I wanted. I told him to move because he was blocking my sunlight. Now I have visited his tent. Too many possessions. Too much gold. The man has conquered the world but cannot find inner peace. Good wine though. I slept in my barrel outside - the tent was too comfortable. If I were not Diogenes, I would want to be Diogenes sleeping outside this tent.' },

  // 1990s Manhattan Loft
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Jerry Seinfeld', reviewer_avatar_url: null, review_date: '2024-12-20', rating_overall: 5.0, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'What IS the deal with time travel listings? No but seriously, this place is perfect. The answering machine messages alone are comedy gold. Kramer stopped by and somehow already knew the hosts. The diner down the street serves a decent tuna on rye. Spent an evening debating nothing with George over the rotary phone. It is the quintessential 90s NYC experience. Not that there is anything wrong with that.' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Rachel Green', reviewer_avatar_url: null, review_date: '2024-12-15', rating_overall: 4.9, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 4.5, comment: 'Oh. My. God. This loft is everything! The vintage clothing in the closet? To die for. The coffee shop nearby is not Central Perk but it will do. Spent hours with the hosts talking about fashion and art. Used their phone to leave passive-aggressive messages for Ross - very satisfying without call waiting interrupting. Monica would love the organized kitchen drawers. Could this BE any more 90s?' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Will Smith', reviewer_avatar_url: null, review_date: '2024-12-10', rating_overall: 5.0, rating_cleanliness: 5.0, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 5.0, rating_value: 5.0, comment: 'This is a story all about how my stay at this loft was wild! Fresh Prince vibes everywhere. The boombox is fully functional - had a dance party with the hosts. The neighborhood is everything West Philadelphia was not but in a good way? Watched Fresh Prince on the living room TV which was a weird experience. Carlton would hate it here. 10/10.' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Carrie Bradshaw', reviewer_avatar_url: null, review_date: '2024-12-05', rating_overall: 4.8, rating_cleanliness: 4.5, rating_accuracy: 5.0, rating_communication: 5.0, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'I could not help but wonder... is pre-internet dating better? After a week in this SoHo loft, I have my answer: absolutely. No swiping, no apps, just meeting people at gallery openings and leaving voice messages. Very romantic. The vintage typewriter was perfect for my column. The shoe closet needs expansion but the Manolos I found at a nearby consignment store made up for it. The city feels more alive without everyone staring at phones.' },
  { listing_id: 'ecd51b03-31c4-4ee6-8b82-b5e4d9ce9e93', reviewer_name: 'Doc Brown', reviewer_avatar_url: null, review_date: '2024-12-01', rating_overall: 4.7, rating_cleanliness: 4.0, rating_accuracy: 5.0, rating_communication: 4.5, rating_location: 5.0, rating_checkin: 4.5, rating_value: 4.5, comment: 'Great Scott! A time travel listing where I am the guest instead of the facilitator! The technology here is charmingly primitive but functional. The 1995 Macintosh reminded me of my early flux capacitor calculations. The hosts were curious about my DeLorean but I said it was in the shop. The lack of internet is actually peaceful. Did not accidentally alter the timeline, which is always a plus. 1.21 gigawatts not required.' },
];

async function main() {
  console.log('🚀 Updating all listings with hosts and reviews\n');

  // Step 1: Upsert all hosts
  console.log('👑 Upserting hosts...');
  for (const host of hosts) {
    const { error } = await supabase
      .from('hosts')
      .upsert(host, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Error upserting host ${host.name}:`, error.message);
    } else {
      console.log(`✅ Upserted host: ${host.name}`);
    }
  }

  // Step 2: Update listings to link to hosts
  console.log('\n🔗 Linking listings to hosts...');
  for (const mapping of listingHostMap) {
    const { error } = await supabase
      .from('listings')
      .update({ host_id: mapping.hostId })
      .eq('id', mapping.listingId);

    if (error) {
      console.error(`❌ Error linking listing ${mapping.listingId}:`, error.message);
    } else {
      console.log(`✅ Linked listing ${mapping.listingId} to host ${mapping.hostId}`);
    }
  }

  // Step 3: Delete existing reviews for these listings
  console.log('\n🗑️  Deleting existing reviews...');
  const listingIds = listingHostMap.map(m => m.listingId);
  for (const listingId of listingIds) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('listing_id', listingId);

    if (error) {
      console.error(`❌ Error deleting reviews for listing ${listingId}:`, error.message);
    } else {
      console.log(`✅ Deleted existing reviews for listing ${listingId}`);
    }
  }

  // Step 4: Insert all new reviews
  console.log('\n📝 Inserting new reviews...');
  for (const review of allReviews) {
    const { error } = await supabase
      .from('reviews')
      .insert(review);

    if (error) {
      console.error(`❌ Error inserting review by ${review.reviewer_name}:`, error.message);
    } else {
      console.log(`✅ Inserted review by ${review.reviewer_name} for listing ${review.listing_id.slice(0, 8)}...`);
    }
  }

  // Step 5: Update review counts on listings
  console.log('\n📊 Updating review counts...');
  for (const listingId of listingIds) {
    const { error } = await supabase
      .from('listings')
      .update({ total_reviews: 5 })
      .eq('id', listingId);

    if (error) {
      console.error(`❌ Error updating review count for ${listingId}:`, error.message);
    } else {
      console.log(`✅ Updated review count for listing ${listingId.slice(0, 8)}...`);
    }
  }

  console.log('\n✅ Database update complete!');
  console.log('\n📝 Summary:');
  console.log(`   - Upserted ${hosts.length} hosts`);
  console.log(`   - Linked ${listingHostMap.length} listings to hosts`);
  console.log(`   - Inserted ${allReviews.length} reviews`);
  console.log('\n💡 Next step: Run the avatar generation script');
  console.log('   npx tsx scripts/generate-all-avatars.ts');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
