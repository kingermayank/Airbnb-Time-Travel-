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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// New listing data - using valid UUID format
const LISTING_ID = 'a7c3e8f1-5b2d-4a9e-8c6f-3d1e7b4a2c5f';
const HOST_ID = '8f2c4a69-e1b4-4d7c-a3f5-6b8e2d4c1a9f';

const HOST_DATA = {
  id: HOST_ID,
  name: 'Tanaka-san',
  profile_picture_url: null, // Will be updated after upload
  join_date: '2084-03-15',
  response_rate: 97,
  response_time: 'within 3 solar cycles',
  is_superhost: true,
  is_identity_verified: true,
  is_temporal_guardian: true,
  total_reviews: 89,
  description: `Greetings, temporal wanderer! I am Tanaka-san, a third-generation capsule keeper in Neo-Showa Tokyo. My family has maintained this analog sanctuary since the Great Digital Rejection of 2052, when our district chose tradition over the Neural Net.

I speak fluent Retro-Japanese (pre-emoji dialect), can repair any CRT television manufactured between 1975-2089, and make an excellent cup of vending machine coffee. My cat, Pixel-chan, has been certified paradox-free by the Temporal Bureau.

When not hosting guests from across the timestreams, I collect vintage floppy disks and practice calligraphy on recycled punch cards. I believe the best technology is the kind you can fix with a screwdriver and determination.

Warning: I may quote 1980s anime at inappropriate moments. This is considered a feature, not a bug.`,
  house_rules_quirks: [
    'Please rewind any VHS tapes before returning',
    'The CRT TV takes 30 seconds to warm up - this is normal and builds character',
    'Pixel-chan the cat is not a hologram, please do not try to walk through her',
    'Dial-up internet available upon request (patience required)'
  ],
  badges: [
    { type: 'superhost', label: 'Superhost' },
    { type: 'identity_verified', label: 'Identity verified' },
    { type: 'temporal_guardian', label: 'Temporal Guardian' }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const LISTING_DATA = {
  id: LISTING_ID,
  host_id: HOST_ID,
  title: "Neo-Showa Capsule Pod in Parallel Tokyo 2087",
  main_image: null, // Will be updated after upload
  property_type: 'Retro-Future Capsule',
  guest_capacity: 10,
  bedrooms: 1,
  beds: 1,
  baths: 1,
  price_per_night: 892, // ~₿0.010704 per hour
  price_display: '₿0.010704 / hour',
  overall_rating: 4.91,
  total_reviews: 89,
  is_guest_favorite: false,
  date: '2087 CE (Parallel)',
  location_description: 'Neo-Shinjuku District, Parallel Tokyo',
  short_description: 'Experience a Tokyo that chose nostalgia over progress. In this timeline, Japan sealed itself in 1989 and evolved sideways.',
  full_description: `Welcome to Neo-Showa Tokyo, where the bubble never burst - it just got weirder.

In this parallel timeline, Japan decided that 1989 was peak civilization and collectively agreed to stop there. Sort of. The result? A retro-futuristic wonderland where flying cars run on cassette tapes and everyone still uses fax machines (they're just really, really fast fax machines now).

Your cozy capsule pod sits in the heart of Neo-Shinjuku, a vertical maze of stacked modules where salary-men commute via pneumatic tubes and ramen shops accept payment in vintage arcade tokens. The neon signs outside your rain-streaked window advertise products that never existed in your timeline - Sony Dreamcast 7, Sega's successful console empire, and something called "New Coke Classic Turbo."

THE SPACE:
Your capsule features authentic 2087 Neo-Showa amenities:
- A sleeping alcove with memory foam from an alternate dimension (it remembers dreams you haven't had yet)
- CRT television receiving broadcasts from three different timelines (Tuesday night is "What If?" movie night)
- A compact kitchen where the microwave plays a different anime theme song for each food type
- A bathroom with a toilet that apologizes in 47 different ways
- A vintage computer terminal with green phosphor display (perfect for writing poetry or checking your temporal email)

THE VIBE:
Imagine Blade Runner, but everyone is polite and the replicants just want to discuss their favorite manga. Cyberpunk, but make it cozy. The eternal rain outside isn't acid rain - it's just very nostalgic rain.

PERFECT FOR:
- Retrofuturism enthusiasts who believe the 80s vision of the future was superior
- Writers seeking inspiration from a world that zigged when ours zagged
- Anyone who misses the sound of dial-up internet
- Temporal refugees from timelines where minimalism won

NOT RECOMMENDED FOR:
- Guests allergic to CRT screen flicker
- Anyone who can't appreciate a good fax machine joke
- Visitors expecting "smart" home features (our home is wise, not smart)

The best view is at 3 AM when the rain hits the neon signs just right, and for a moment, you'll forget which timeline you came from. That's when you know you've truly arrived in Neo-Showa Tokyo.

いらっしゃいませ、時間旅行者さん！`,
  key_features: [
    { title: 'Analog sanctuary', description: 'Fully functional retro-tech environment - every switch clicks, every dial turns' },
    { title: 'Neon rain views', description: 'Floor-to-ceiling window overlooking the eternal drizzle of Neo-Shinjuku' },
    { title: 'CRT entertainment', description: 'Vintage television receiving broadcasts from multiple parallel timelines' },
    { title: 'Capsule authenticity', description: 'Genuine Neo-Showa sleeping pod design with modern comfort systems hidden inside' }
  ],
  things_to_know: {
    house_rules: [
      { rule: 'No Wi-Fi - we have something better: LAN parties', icon: 'wifi-off' },
      { rule: 'Quiet hours after 11 PM (the building hums enough)', icon: 'volume-x' },
      { rule: 'Please be kind to the vending machines - they have feelings', icon: 'heart' },
      { rule: 'Floppy disks provided for data storage', icon: 'save' },
      { rule: 'Pixel-chan the cat has right of way at all times', icon: 'cat' }
    ],
    safety_and_property: [
      { item: 'Smoke detector', available: true, note: 'Also detects timeline anomalies' },
      { item: 'Fire extinguisher', available: true, note: 'Works on regular and temporal fires' },
      { item: 'First aid kit', available: true, note: 'Includes anti-paradox medication' },
      { item: 'Carbon monoxide detector', available: true },
      { item: 'Emergency exit', available: true, note: 'Leads to 1987 in case of emergency' }
    ],
    cancellation_highlight: 'Free cancellation up until the moment you arrive (time is relative anyway)'
  },
  cancellation_policy: 'Flexible - Full refund if cancelled 24 hours before check-in, unless you\'ve already arrived in a different timeline, in which case it gets complicated.',
  weekly_discount_percent: 15,
  cleaning_fee: 45,
  service_fee_percent: 14,
  occupancy_tax_percent: 8,
  sleeping_arrangements: [
    { room: 'Capsule Pod', beds: '1 Neo-Showa sleeping platform with memory foam from Dimension C-137' }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const REVIEWS_DATA = [
  {
    listing_id: LISTING_ID,
    reviewer_name: 'Marcus Chen',
    reviewer_avatar_url: null,
    review_date: '2087-01-15',
    reviewer_city: 'San Francisco',
    reviewer_era: '2026 CE',
    rating_overall: 5,
    rating_cleanliness: 5,
    rating_accuracy: 5,
    rating_communication: 5,
    rating_location: 5,
    rating_checkin: 5,
    rating_value: 5,
    comment: `I came here to escape a world obsessed with AI and algorithms. Found a Tokyo where people still write love letters by hand and the trains play jazz. The capsule is tiny but somehow feels infinite. Watched the rain for six hours straight. Best decision I've made across any timeline. The CRT TV picked up a broadcast of a show called "Friends" but everyone was a robot? Still processing that one.`,
    badges: [
      { type: 'verified_time_traveler', label: 'Verified Time Traveler' },
      { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }
    ],
    created_at: new Date().toISOString()
  },
  {
    listing_id: LISTING_ID,
    reviewer_name: 'Yuki Watanabe',
    reviewer_avatar_url: null,
    review_date: '2086-12-20',
    reviewer_city: 'Neo-Osaka',
    reviewer_era: '2087 CE (Local)',
    rating_overall: 5,
    rating_cleanliness: 5,
    rating_accuracy: 5,
    rating_communication: 5,
    rating_location: 5,
    rating_checkin: 5,
    rating_value: 5,
    comment: `As a local from this timeline, I can confirm this is the most authentic Neo-Showa experience available. Tanaka-san's capsule is famous throughout the district. The vintage computer terminal still has my high score in Space Invaders from 2084. The kitchen microwave played the Evangelion theme when I heated my curry. 10/10, would exist here again.`,
    badges: [
      { type: 'temporal_regular', label: 'Temporal Regular' }
    ],
    created_at: new Date().toISOString()
  },
  {
    listing_id: LISTING_ID,
    reviewer_name: 'Sarah O\'Brien',
    reviewer_avatar_url: null,
    review_date: '2086-11-08',
    reviewer_city: 'Dublin',
    reviewer_era: '2019 CE',
    rating_overall: 5,
    rating_cleanliness: 4,
    rating_accuracy: 5,
    rating_communication: 5,
    rating_location: 5,
    rating_checkin: 5,
    rating_value: 5,
    comment: `Came from 2019 expecting cyberpunk dystopia. Got cyberpunk utopia instead. Everyone is so POLITE. The toilet apologized to me seventeen times. The cat, Pixel-chan, slept on my feet and I've never felt more honored. Only giving 4 stars for cleanliness because there was dust on the floppy disk collection, but honestly that just added to the aesthetic. The fax machine made a noise I can only describe as "nostalgic screaming" and I loved it.`,
    badges: [
      { type: 'verified_time_traveler', label: 'Verified Time Traveler' },
      { type: 'first_dimensional_visitor', label: 'First Dimensional Visitor' }
    ],
    created_at: new Date().toISOString()
  },
  {
    listing_id: LISTING_ID,
    reviewer_name: 'Kenji Tanaka',
    reviewer_avatar_url: null,
    review_date: '2086-10-25',
    reviewer_city: 'Tokyo',
    reviewer_era: '1989 CE',
    rating_overall: 5,
    rating_cleanliness: 5,
    rating_accuracy: 5,
    rating_communication: 5,
    rating_location: 5,
    rating_checkin: 5,
    rating_value: 5,
    comment: `I traveled forward from 1989 to see what Japan would become. This... this is exactly what I hoped for. We did it. We actually did it. The Walkman evolved into something beautiful. There are still arcade cabinets. Sega is thriving. I wept tears of joy at the vending machine selection. Going back to my timeline now to make sure we stay on this path. Tanaka-san (no relation... I think?) was an excellent host.`,
    badges: [
      { type: 'verified_time_traveler', label: 'Verified Time Traveler' },
      { type: 'survived_the_trip', label: 'Survived The Trip' }
    ],
    created_at: new Date().toISOString()
  },
  {
    listing_id: LISTING_ID,
    reviewer_name: 'Alexandra Petrov',
    reviewer_avatar_url: null,
    review_date: '2086-09-12',
    reviewer_city: 'Moscow',
    reviewer_era: '2045 CE',
    rating_overall: 4,
    rating_cleanliness: 5,
    rating_accuracy: 4,
    rating_communication: 5,
    rating_location: 5,
    rating_checkin: 5,
    rating_value: 5,
    comment: `Beautiful capsule, incredible atmosphere. Minus one star because the listing said "no internet" but failed to mention the LAN parties that happen every Wednesday. Got pulled into a 12-hour StarCraft tournament with the neighbors. No regrets, but I did miss my temporal extraction window. The living room view at 3 AM with the rain and neon is exactly as described - transcendent. Tanaka-san's instant ramen recommendation changed my life.`,
    badges: [
      { type: 'verified_time_traveler', label: 'Verified Time Traveler' },
      { type: 'paradox_free_stay', label: 'Paradox-Free Stay' }
    ],
    created_at: new Date().toISOString()
  }
];

const AMENITIES = [
  'CRT television',
  'Retro gaming console',
  'Capsule sleeping pod',
  'Rain view window',
  'Compact kitchen',
  'Vintage computer terminal',
  'Fax machine',
  'VHS player',
  'Cassette deck',
  'Neon ambient lighting',
  'Climate control',
  'Memory foam mattress',
  'Japanese toilet',
  'Hot water',
  'Towels provided',
  'Desk workspace',
  'Analog clock collection',
  'Board games',
  'Instant ramen selection',
  'Vending machine access'
];

// Image file mappings with order and captions
const IMAGE_FILES = [
  { file: '6f878d06-fcdc-4698-a47b-d1959a662265.jpg', order: 1, caption: 'Capsule sleeping pod with neon city view' },
  { file: 'hf_20260131_065305_49dcec7c-1db9-4c85-9457-7f54855f114f.png', order: 2, caption: 'Neo-Showa building exterior' },
  { file: 'hf_20260131_065558_403d35f1-2ba7-4bf7-b7a9-b32e66a34227.png', order: 3, caption: 'Compact galley kitchen' },
  { file: 'hf_20260131_065608_070091d1-7488-4193-932f-c22dbfa7239f.png', order: 4, caption: 'Living room with CRT TV and neon views' },
  { file: 'hf_20260131_065623_5266bc87-ea10-4f92-99b1-b209a1348f7e.png', order: 5, caption: 'Industrial bathroom' },
  { file: 'hf_20260131_165727_c1d34464-d270-4ac1-ae51-ca76031a506f.png', order: 6, caption: 'Vintage computer workstation' }
];

async function uploadImage(filePath: string, storagePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();

    console.log(`  Uploading ${path.basename(filePath)}...`);

    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(storagePath, fileBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: true,
      });

    if (error) {
      console.error(`  Error uploading: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(storagePath);

    console.log(`  Uploaded: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (error) {
    console.error(`  Exception uploading:`, error);
    return null;
  }
}

async function main() {
  console.log('🚀 Creating Neo-Showa Tokyo Listing\n');
  console.log('=' .repeat(50));

  const imagesDir = path.join(__dirname, '..', 'images', 'japan futuristic');

  if (!fs.existsSync(imagesDir)) {
    console.error(`Images directory not found: ${imagesDir}`);
    process.exit(1);
  }

  // Step 1: Upload images
  console.log('\n📸 Step 1: Uploading images...\n');
  const uploadedImages: { url: string; order: number; caption: string }[] = [];

  for (const img of IMAGE_FILES) {
    const filePath = path.join(imagesDir, img.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  Image not found: ${img.file}`);
      continue;
    }

    const storagePath = `${LISTING_ID}/${img.file}`;
    const url = await uploadImage(filePath, storagePath);

    if (url) {
      uploadedImages.push({ url, order: img.order, caption: img.caption });
    }
  }

  if (uploadedImages.length === 0) {
    console.error('No images uploaded successfully');
    process.exit(1);
  }

  console.log(`\n  Uploaded ${uploadedImages.length} images`);

  // Step 2: Create host
  console.log('\n👤 Step 2: Creating host...\n');

  const { error: hostError } = await supabase
    .from('hosts')
    .upsert(HOST_DATA, { onConflict: 'id' });

  if (hostError) {
    console.error(`  Error creating host: ${hostError.message}`);
  } else {
    console.log(`  Created host: ${HOST_DATA.name}`);
  }

  // Step 3: Create listing
  console.log('\n🏠 Step 3: Creating listing...\n');

  const listingWithImage = {
    ...LISTING_DATA,
    main_image: uploadedImages[0]?.url || null
  };

  const { error: listingError } = await supabase
    .from('listings')
    .upsert(listingWithImage, { onConflict: 'id' });

  if (listingError) {
    console.error(`  Error creating listing: ${listingError.message}`);
  } else {
    console.log(`  Created listing: ${LISTING_DATA.title}`);
  }

  // Step 4: Add listing images to database
  console.log('\n🖼️  Step 4: Adding image records...\n');

  for (const img of uploadedImages) {
    // Check if image already exists
    const { data: existing } = await supabase
      .from('listing_images')
      .select('id')
      .eq('listing_id', LISTING_ID)
      .eq('image_url', img.url)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('listing_images')
        .update({ image_order: img.order, caption: img.caption })
        .eq('id', existing.id);

      if (error) {
        console.error(`  Error updating image record: ${error.message}`);
      } else {
        console.log(`  Updated: ${img.caption}`);
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from('listing_images')
        .insert({
          listing_id: LISTING_ID,
          image_url: img.url,
          image_order: img.order,
          caption: img.caption
        });

      if (error) {
        console.error(`  Error adding image record: ${error.message}`);
      } else {
        console.log(`  Added: ${img.caption}`);
      }
    }
  }

  // Step 5: Add reviews
  console.log('\n⭐ Step 5: Adding reviews...\n');

  for (const review of REVIEWS_DATA) {
    const { error } = await supabase
      .from('reviews')
      .insert(review);

    if (error && !error.message.includes('duplicate')) {
      console.error(`  Error adding review from ${review.reviewer_name}: ${error.message}`);
    } else {
      console.log(`  Added review from: ${review.reviewer_name}`);
    }
  }

  // Step 6: Add amenities (only if listing was created successfully)
  console.log('\n🛋️  Step 6: Adding amenities...\n');

  // Check if listing exists first
  const { data: listingExists } = await supabase
    .from('listings')
    .select('id')
    .eq('id', LISTING_ID)
    .single();

  if (!listingExists) {
    console.log('  Skipping amenities - listing does not exist yet');
  } else {
    let addedCount = 0;
    for (const amenityName of AMENITIES) {
      // First, ensure amenity exists in amenities table
      let { data: amenity } = await supabase
        .from('amenities')
        .select('id')
        .eq('name', amenityName)
        .single();

      if (!amenity) {
        // Create the amenity
        const { data: newAmenity, error: amenityError } = await supabase
          .from('amenities')
          .insert({ name: amenityName })
          .select('id')
          .single();

        if (amenityError) {
          console.error(`  Error creating amenity ${amenityName}: ${amenityError.message}`);
          continue;
        }
        amenity = newAmenity;
      }

      // Check if link exists
      const { data: existingLink } = await supabase
        .from('listing_amenities')
        .select('id')
        .eq('listing_id', LISTING_ID)
        .eq('amenity_id', amenity.id)
        .single();

      if (!existingLink) {
        // Link amenity to listing
        const { error: linkError } = await supabase
          .from('listing_amenities')
          .insert({
            listing_id: LISTING_ID,
            amenity_id: amenity.id
          });

        if (linkError) {
          console.error(`  Error linking amenity ${amenityName}: ${linkError.message}`);
        } else {
          addedCount++;
        }
      } else {
        addedCount++;
      }
    }
    console.log(`  Added ${addedCount} amenities`);
  }

  // Done!
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Neo-Showa Tokyo listing created successfully!');
  console.log('\n📝 Summary:');
  console.log(`   Listing ID: ${LISTING_ID}`);
  console.log(`   Host: ${HOST_DATA.name}`);
  console.log(`   Images: ${uploadedImages.length}`);
  console.log(`   Reviews: ${REVIEWS_DATA.length}`);
  console.log(`   Amenities: ${AMENITIES.length}`);
  console.log('\n🌐 View at: http://localhost:5173/listing/' + LISTING_ID);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
