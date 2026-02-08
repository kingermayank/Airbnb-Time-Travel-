import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('🔍 Checking listing images...\n');

  // Get all listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title, main_image');

  if (listingsError) {
    console.error('❌ Error fetching listings:', listingsError.message);
    return;
  }

  console.log('📋 LISTINGS MAIN IMAGES:');
  console.log('='.repeat(80));
  for (const listing of listings || []) {
    console.log(`\n${listing.title}`);
    console.log(`  ID: ${listing.id}`);
    console.log(`  Main Image: ${listing.main_image ? listing.main_image.substring(0, 80) + '...' : 'NULL'}`);
  }

  // Get all listing images
  console.log('\n\n📸 LISTING_IMAGES TABLE:');
  console.log('='.repeat(80));

  const { data: images, error: imagesError } = await supabase
    .from('listing_images')
    .select('listing_id, image_url, caption, image_order')
    .order('listing_id')
    .order('image_order');

  if (imagesError) {
    console.error('❌ Error fetching images:', imagesError.message);
    return;
  }

  // Group by listing
  const imagesByListing: Record<string, any[]> = {};
  for (const img of images || []) {
    if (!imagesByListing[img.listing_id]) {
      imagesByListing[img.listing_id] = [];
    }
    imagesByListing[img.listing_id].push(img);
  }

  for (const [listingId, imgs] of Object.entries(imagesByListing)) {
    const listing = listings?.find(l => l.id === listingId);
    console.log(`\n${listing?.title || listingId}`);
    console.log(`  Images: ${imgs.length}`);
    for (const img of imgs) {
      console.log(`    ${img.image_order}. ${img.caption || 'No caption'}`);
      console.log(`       URL: ${img.image_url ? img.image_url.substring(0, 60) + '...' : 'NULL'}`);
    }
  }

  // Check for listings with no images
  console.log('\n\n⚠️  LISTINGS WITHOUT IMAGES:');
  console.log('='.repeat(80));
  for (const listing of listings || []) {
    if (!imagesByListing[listing.id]) {
      console.log(`  - ${listing.title} (${listing.id})`);
    }
  }

  // Check reviews for avatars
  console.log('\n\n👤 REVIEWER AVATARS:');
  console.log('='.repeat(80));

  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('listing_id, reviewer_name, reviewer_avatar_url')
    .order('listing_id');

  if (reviewsError) {
    console.error('❌ Error fetching reviews:', reviewsError.message);
    return;
  }

  let withAvatar = 0;
  let withoutAvatar = 0;
  for (const review of reviews || []) {
    if (review.reviewer_avatar_url) {
      withAvatar++;
    } else {
      withoutAvatar++;
      console.log(`  Missing: ${review.reviewer_name}`);
    }
  }
  console.log(`\n  With avatar: ${withAvatar}`);
  console.log(`  Without avatar: ${withoutAvatar}`);

  // Check hosts
  console.log('\n\n👑 HOST PROFILE PICTURES:');
  console.log('='.repeat(80));

  const { data: hosts, error: hostsError } = await supabase
    .from('hosts')
    .select('id, name, profile_picture_url');

  if (hostsError) {
    console.error('❌ Error fetching hosts:', hostsError.message);
    return;
  }

  for (const host of hosts || []) {
    console.log(`\n${host.name}`);
    console.log(`  Profile Picture: ${host.profile_picture_url ? host.profile_picture_url.substring(0, 60) + '...' : 'NULL'}`);
  }
}

main().catch(console.error);
