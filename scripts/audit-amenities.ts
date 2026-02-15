import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsloiphxznbbwfntuxmu.supabase.co';
const supabaseKey = 'sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB';

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditAmenities() {
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title')
    .order('title');

  if (listingsError) {
    console.error('Error:', listingsError);
    return;
  }

  for (const listing of listings || []) {
    const { data: amenities, error: amenitiesError } = await supabase
      .from('listing_amenities')
      .select(`
        amenity_id,
        amenities (name)
      `)
      .eq('listing_id', listing.id);

    if (!amenitiesError && amenities) {
      console.log(`\n=== ${listing.title} ===`);
      amenities.forEach((a: any) => console.log(`  - ${a.amenities.name}`));
    }
  }
}

auditAmenities();
