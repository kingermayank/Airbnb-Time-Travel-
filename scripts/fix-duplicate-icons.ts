import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsloiphxznbbwfntuxmu.supabase.co';
const supabaseKey = 'sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB';

const supabase = createClient(supabaseUrl, supabaseKey);

// Corrected amenities - removing duplicates and ensuring unique icons
const LISTING_AMENITIES: Record<string, string[]> = {
  'WWII German Resistance Safehouse Loft': [
    'Covert entry system',
    'Historical artifacts', // Keep this (Scroll icon)
    // REMOVED: 'Authentic safehouse experience' - redundant with the listing itself
    'Heating system',
    // REMOVED: 'Historical preservation' - redundant with 'Historical artifacts'
    'Kitchen facilities',
    'Hidden compartments',
    'Air conditioning',
    'Educational materials',
    'Authentic 1940s decor',
    'Period-accurate furnishings',
  ],

  'Pandora Floating Mountain Bungalow': [
    'Heating system',
    'Bioluminescent views',
    'Kitchen facilities',
    'Native flora access',
    'Air conditioning',
    // REMOVED: 'Wifi connection' - no Wi-Fi on Pandora!
    "Na'vi artifacts",
    'Alien wildlife observation',
    'Floating structure technology',
    'Mountain horizon views',
  ],

  'Ancient Egyptian Nile Villa (Old Kingdom)': [
    'Nile River access',
    'Guided historical tour', // Keep this (Compass icon)
    'Heating system',
    // REMOVED: 'Historical preservation' - redundant with 'Guided historical tour'
    'Kitchen facilities',
    'Hieroglyphic decorations',
    'Air conditioning',
    'Period-accurate furnishings',
    'Ancient pyramid artifacts',
    'Courtyard garden',
  ],

  'Federation Ambassador Suite — Earth, 2364': [
    'Cultural merit system',
    'Post-scarcity living',
    'Universal translator',
    'Air conditioning',
    'Vulcan neighbors',
    'Transporter access', // Keep this (Zap icon)
    'Educational programs',
    'Replicator access', // This will get Cpu icon (different from Transporter's Zap)
    'Kitchen',
    'Holodeck privileges',
    'Wi-Fi',
    'Emergency transport', // This will get Rocket icon (evacuation)
  ],
};

async function fixDuplicateIcons() {
  console.log('🔍 Fixing duplicate icon issues...\n');

  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title');

  if (listingsError) {
    console.error('❌ Error fetching listings:', listingsError);
    return;
  }

  for (const listing of listings || []) {
    const correctedAmenities = LISTING_AMENITIES[listing.title];

    if (!correctedAmenities) {
      continue; // Skip listings we're not updating
    }

    console.log(`\n📝 Updating: ${listing.title}`);
    console.log(`   New amenity count: ${correctedAmenities.length}`);

    // Delete all existing amenities for this listing
    const { error: deleteError } = await supabase
      .from('listing_amenities')
      .delete()
      .eq('listing_id', listing.id);

    if (deleteError) {
      console.error(`   ❌ Error deleting old amenities:`, deleteError);
      continue;
    }

    // Add new amenities
    for (const amenityName of correctedAmenities) {
      let { data: existingAmenity, error: fetchError } = await supabase
        .from('amenities')
        .select('id')
        .eq('name', amenityName)
        .single();

      let amenityId: string;

      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: newAmenity, error: createError } = await supabase
          .from('amenities')
          .insert({ name: amenityName })
          .select('id')
          .single();

        if (createError || !newAmenity) {
          console.error(`   ❌ Error creating amenity "${amenityName}":`, createError);
          continue;
        }
        amenityId = newAmenity.id;
      } else if (existingAmenity) {
        amenityId = existingAmenity.id;
      } else {
        console.error(`   ❌ Error fetching amenity "${amenityName}":`, fetchError);
        continue;
      }

      const { error: linkError } = await supabase
        .from('listing_amenities')
        .insert({
          listing_id: listing.id,
          amenity_id: amenityId,
        });

      if (linkError) {
        console.error(`   ❌ Error linking amenity "${amenityName}":`, linkError);
      }
    }

    console.log(`   ✅ Updated ${listing.title}`);
  }

  console.log('\n✅ Duplicate icon fixes complete!');
}

fixDuplicateIcons();
