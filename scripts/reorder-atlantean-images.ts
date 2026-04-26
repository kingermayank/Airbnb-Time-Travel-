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

const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

// Atlantean Crystal Villa listing ID
const ATLANTEAN_LISTING_ID = 'cf84c7ff-aea0-49f3-ad12-3bc09a52326b';

async function main() {
  console.log('🔄 Swapping courtyard and dining room image orders\n');
  console.log(`📍 Listing ID: ${ATLANTEAN_LISTING_ID}\n`);

  // Fetch all images for this listing
  const { data: images, error: fetchError } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', ATLANTEAN_LISTING_ID)
    .order('image_order', { ascending: true });

  if (fetchError) {
    console.error('❌ Error fetching images:', fetchError.message);
    return;
  }

  if (!images || images.length === 0) {
    console.error('❌ No images found for this listing');
    return;
  }

  console.log('📸 Current images:');
  images.forEach((img, idx) => {
    console.log(`  ${idx + 1}. Order ${img.image_order}: ${img.caption || 'No caption'}`);
  });

  // Find the indoor courtyard image
  const courtyardImage = images.find(
    (img) =>
      img.caption?.toLowerCase().includes('courtyard') ||
      img.caption?.toLowerCase().includes('indoor courtyard') ||
      img.image_url.toLowerCase().includes('courtyard')
  );

  // Find the dining room image
  const diningRoomImage = images.find(
    (img) =>
      img.caption?.toLowerCase().includes('dining') ||
      img.image_url.toLowerCase().includes('dining')
  );

  if (!courtyardImage) {
    console.error('❌ Could not find indoor courtyard image');
    console.log('Available captions:', images.map((img) => img.caption).join(', '));
    return;
  }

  if (!diningRoomImage) {
    console.error('❌ Could not find dining room image');
    console.log('Available captions:', images.map((img) => img.caption).join(', '));
    return;
  }

  console.log(`\n✅ Found courtyard image: ${courtyardImage.caption} (current order: ${courtyardImage.image_order})`);
  console.log(`✅ Found dining room image: ${diningRoomImage.caption} (current order: ${diningRoomImage.image_order})`);

  // Set the desired order:
  // 1. Cover Exterior Waterfront
  // 2. Bedroom
  // 3. Spa Bathroom
  // 4. Entrance Hall
  // 5. Indoor Courtyard (swap with dining room)
  // 6. Dining Room (swap with courtyard)

  const imageOrderMap: Record<string, number> = {
    'Cover Exterior Waterfront': 1,
    'Bedroom': 2,
    'Spa Bathroom': 3,
    'Entrance Hall': 4,
    'Indoor Courtyard': 5,
    'Dining Room': 6,
  };

  console.log('\n🔄 Updating image orders...');

  // Update all images to their new orders
  for (const img of images) {
    const newOrder = imageOrderMap[img.caption || ''];
    if (newOrder !== undefined) {
      const { error } = await supabase
        .from('listing_images')
        .update({ image_order: newOrder })
        .eq('id', img.id);

      if (error) {
        console.error(`❌ Error updating image ${img.caption}:`, error.message);
        return;
      }
      console.log(`   ✅ ${img.caption}: order ${img.image_order} → ${newOrder}`);
    }
  }

  // Update main listing image to the first image (Cover Exterior Waterfront)
  const coverImage = images.find((img) => img.caption === 'Cover Exterior Waterfront');
  if (coverImage) {
    console.log('\n🖼️  Updating main listing image to Cover Exterior Waterfront...');
    const { error: mainImageError } = await supabase
      .from('listings')
      .update({ main_image: coverImage.image_url })
      .eq('id', ATLANTEAN_LISTING_ID);

    if (mainImageError) {
      console.error('❌ Error updating main image:', mainImageError.message);
      return;
    }
  }

  console.log('\n✅ Successfully swapped courtyard and dining room positions!');
  
  // Show final order
  const { data: finalImages } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', ATLANTEAN_LISTING_ID)
    .order('image_order', { ascending: true });

  console.log('\n📸 Final image order:');
  finalImages?.forEach((img, idx) => {
    console.log(`  ${idx + 1}. Order ${img.image_order}: ${img.caption || 'No caption'}`);
  });
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
