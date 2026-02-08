
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateEgyptianVilla() {
  console.log('🔍 Finding "Ancient Egyptian Nile Villa (Old Kingdom)"...');

  // 1. Find the listing
  const { data: listings, error: findError } = await supabase
    .from('listings')
    .select('id, title')
    .eq('title', 'Ancient Egyptian Nile Villa (Old Kingdom)')
    .limit(1);

  if (findError) {
    console.error('❌ Error finding listing:', findError);
    return;
  }

  if (!listings || listings.length === 0) {
    console.error('❌ Listing not found!');
    return;
  }

  const listing = listings[0];
  console.log(`✅ Found listing: ${listing.title} (${listing.id})`);

  // Define new images (Hyper-realistic placeholders)
  const newImages = [
    {
      url: 'https://images.unsplash.com/photo-1572252009289-9d53c639c3da?q=80&w=2000&auto=format&fit=crop',
      caption: 'Main Villa Entrance & Columns',
      order: 1
    },
    {
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2000&auto=format&fit=crop',
      caption: 'Royal Bedroom with Desert Views',
      order: 2
    },
    {
      url: 'https://images.unsplash.com/photo-1620626011761-4f511e5f8b13?q=80&w=2000&auto=format&fit=crop',
      caption: 'Luxurious Marble Restroom',
      order: 3
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000&auto=format&fit=crop',
      caption: 'Grand Living Hall',
      order: 4
    },
    {
      url: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop',
      caption: 'Ancient Stone Kitchen & Dining',
      order: 5
    },
    {
      url: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=2000&auto=format&fit=crop',
      caption: 'Nile River View',
      order: 6
    }
  ];

  // 2. Update main listing image
  console.log('🔄 Updating main listing image...');
  const { error: updateError } = await supabase
    .from('listings')
    .update({ main_image: newImages[0].url })
    .eq('id', listing.id);

  if (updateError) {
    console.error('❌ Error updating main image:', updateError);
    return;
  }
  console.log('✅ Main image updated.');

  // 3. Delete existing images
  console.log('🗑️  Removing old images...');
  const { error: deleteError } = await supabase
    .from('listing_images')
    .delete()
    .eq('listing_id', listing.id);

  if (deleteError) {
    console.error('❌ Error deleting old images:', deleteError);
    return;
  }
  console.log('✅ Old images removed.');

  // 4. Insert new images
  console.log('📸 Inserting 6 new hyper-realistic images...');
  const imageInserts = newImages.map(img => ({
    listing_id: listing.id,
    image_url: img.url,
    caption: img.caption,
    image_order: img.order
  }));

  const { error: insertError } = await supabase
    .from('listing_images')
    .insert(imageInserts);

  if (insertError) {
    console.error('❌ Error inserting new images:', insertError);
    return;
  }

  console.log('🎉 Successfully generated and updated images for Ancient Egyptian Nile Villa!');
}

updateEgyptianVilla();
