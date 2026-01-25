import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Verify if listing content has been populated from populate-full-listing-content.sql
 */
export async function verifyListingContent(): Promise<{
  success: boolean;
  message: string;
  data?: {
    listingsWithContent?: number;
    listingsWithHosts?: number;
    sampleListing?: {
      id: string;
      title: string;
      hasFullDescription: boolean;
      hasKeyFeatures: boolean;
      hasSleepingArrangements: boolean;
      hasHost: boolean;
    };
  };
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: '❌ Supabase not configured',
    };
  }

  try {
    // Check if listings have the new content fields
    const { data: listingsData, error: listingsError } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        full_description,
        key_features,
        sleeping_arrangements,
        host_id,
        location_description,
        short_description
      `)
      .limit(10);

    if (listingsError) {
      return {
        success: false,
        message: `❌ Error checking listings: ${listingsError.message}`,
      };
    }

    const listingsWithContent = (listingsData || []).filter(
      (listing) =>
        listing.full_description &&
        listing.key_features &&
        listing.sleeping_arrangements &&
        listing.host_id
    ).length;

    const listingsWithHosts = (listingsData || []).filter(
      (listing) => listing.host_id
    ).length;

    const sampleListing = listingsData?.[0]
      ? {
          id: listingsData[0].id,
          title: listingsData[0].title,
          hasFullDescription: !!listingsData[0].full_description,
          hasKeyFeatures: !!listingsData[0].key_features,
          hasSleepingArrangements: !!listingsData[0].sleeping_arrangements,
          hasHost: !!listingsData[0].host_id,
        }
      : undefined;

    return {
      success: true,
      message: `✅ Found ${listingsWithContent} listings with full content out of ${listingsData?.length || 0} total`,
      data: {
        listingsWithContent,
        listingsWithHosts,
        sampleListing,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Test Supabase connection and verify database setup
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  configured: boolean;
  message: string;
  data?: {
    hostsCount?: number;
    listingsCount?: number;
    imagesCount?: number;
    amenitiesCount?: number;
    reviewsCount?: number;
  };
}> {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      configured: false,
      message: '❌ Supabase not configured - check .env.local file',
    };
  }

  try {
    // Test basic connection by querying listings
    const { data: listingsData, error: listingsError } = await supabase
      .from('listings')
      .select('id')
      .limit(1);

    if (listingsError) {
      console.error('❌ Supabase connection error:', listingsError);
      return {
        success: false,
        configured: true,
        message: `❌ Connection error: ${listingsError.message}`,
      };
    }

    // Get counts for all tables
    const [hostsResult, listingsResult, imagesResult, amenitiesResult, reviewsResult] = await Promise.all([
      supabase.from('hosts').select('id', { count: 'exact', head: true }),
      supabase.from('listings').select('id', { count: 'exact', head: true }),
      supabase.from('listing_images').select('id', { count: 'exact', head: true }),
      supabase.from('amenities').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
    ]);

    const data = {
      hostsCount: hostsResult.count ?? 0,
      listingsCount: listingsResult.count ?? 0,
      imagesCount: imagesResult.count ?? 0,
      amenitiesCount: amenitiesResult.count ?? 0,
      reviewsCount: reviewsResult.count ?? 0,
    };

    console.log('✅ Supabase connected successfully!');
    console.log('📊 Database statistics:', data);

    return {
      success: true,
      configured: true,
      message: '✅ Supabase connected successfully!',
      data,
    };
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return {
      success: false,
      configured: true,
      message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

