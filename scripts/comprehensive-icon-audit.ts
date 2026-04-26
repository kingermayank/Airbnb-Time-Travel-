import { createClient } from '@supabase/supabase-js';
import { getAmenityIcon } from '../src/lib/amenity-icons';

const supabaseUrl = 'https://bsloiphxznbbwfntuxmu.supabase.co';
const supabaseKey = 'sb_publishable_i_X_v5v_loyrYkMphwIoPQ_5TNdcvNB';

const supabase = createClient(supabaseUrl, supabaseKey);

async function comprehensiveIconAudit() {
  console.log('🔍 COMPREHENSIVE ICON AUDIT\n');
  console.log('='*60);

  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title')
    .order('title');

  if (listingsError) {
    console.error('❌ Error fetching listings:', listingsError);
    return;
  }

  let totalIssues = 0;

  for (const listing of listings || []) {
    const { data: amenities, error: amenitiesError } = await supabase
      .from('listing_amenities')
      .select(`
        amenity_id,
        amenities (name)
      `)
      .eq('listing_id', listing.id);

    if (amenitiesError || !amenities) continue;

    const amenityList = amenities.map((a: any) => a.amenities.name);

    // Map each amenity to its icon
    const iconMap: Record<string, string[]> = {};

    for (const amenity of amenityList) {
      const { Icon } = getAmenityIcon(amenity);
      const iconName = Icon.name || 'Unknown';

      if (!iconMap[iconName]) {
        iconMap[iconName] = [];
      }
      iconMap[iconName].push(amenity);
    }

    // Find duplicates
    const duplicates = Object.entries(iconMap).filter(([icon, amenities]) => amenities.length > 1);

    if (duplicates.length > 0) {
      console.log(`\n❌ ${listing.title}`);
      console.log('-'.repeat(60));
      totalIssues++;

      for (const [icon, amenities] of duplicates) {
        console.log(`  ${icon} icon used by ${amenities.length} amenities:`);
        amenities.forEach(a => console.log(`    - ${a}`));
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  if (totalIssues === 0) {
    console.log('✅ NO DUPLICATE ICONS FOUND! All amenities have unique icons.');
  } else {
    console.log(`\n⚠️  Found ${totalIssues} listings with duplicate icon issues.`);
  }
}

comprehensiveIconAudit();
