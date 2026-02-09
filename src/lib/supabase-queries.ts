import { supabase, isSupabaseConfigured } from './supabase';
import type {
  Listing,
  ListingWithHost,
  ListingDetails,
  ListingCard,
  Host,
  ListingImage,
  Amenity,
  Review,
  Booking,
} from '../types/database';

/**
 * Fetch all listings with host information for card display
 */
export async function fetchListings(): Promise<ListingCard[]> {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ fetchListings: Supabase not configured');
    // Return empty array instead of throwing - let component handle fallback
    return [];
  }
  
  console.log('🔄 fetchListings: Querying Supabase for listings...');
  const { data, error } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      main_image,
      price_display,
      price_per_night,
      overall_rating,
      date,
      is_guest_favorite
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching listings from Supabase:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }

  console.log(`✅ fetchListings: Received ${data?.length || 0} listings from Supabase`);
  
  // Transform to ListingCard format
  const transformed = (data || []).map((listing) => ({
    id: listing.id,
    title: listing.title,
    image: listing.main_image,
    price: listing.price_display || `$${listing.price_per_night}/night`,
    rating: listing.overall_rating ? listing.overall_rating.toString() : undefined,
    date: listing.date || undefined,
    isGuestFavorite: listing.is_guest_favorite || false,
  }));
  
  console.log('📋 fetchListings: Transformed listings:', transformed.map(l => ({ id: l.id, title: l.title })));
  
  return transformed;
}

/**
 * Mock listing details for development/testing
 */
function getMockListingDetails(listingId: string): ListingDetails | null {
  const mockData: Record<string, ListingDetails> = {
    'mock-2': {
      id: 'mock-2',
      host_id: 'mock-host-1',
      title: "SpaceX Mars Colony Pod at Olympus Mons",
      main_image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
      property_type: "Space Pod",
      guest_capacity: 4,
      bedrooms: 2,
      beds: 2,
      baths: 1,
      price_per_night: 687,
      price_display: "$687 for 1 night",
      overall_rating: 4.82,
      total_reviews: 127,
      is_guest_favorite: false,
      date: null,
      location_description: "Olympus Mons, Mars",
      short_description: "Experience life on the Red Planet in this state-of-the-art SpaceX colony pod",
      full_description: "Welcome to the future of space travel! This cutting-edge SpaceX Mars Colony Pod offers an unparalleled experience on the Red Planet. Located at the base of Olympus Mons, the solar system's largest volcano, you'll enjoy breathtaking views of the Martian landscape.\n\nFeatures include:\n- Fully pressurized living quarters\n- Life support systems\n- Panoramic dome views\n- Zero-gravity sleeping pods\n- Mars rover access\n- Communication array for Earth contact\n\nPerfect for space enthusiasts, scientists, or anyone looking for the ultimate adventure. Book your stay and become one of the first humans to experience life on Mars!",
      key_features: [
        {
          title: "Life Support Systems",
          description: "Fully automated oxygen generation and atmospheric pressure control"
        },
        {
          title: "Panoramic Views",
          description: "360-degree dome windows with stunning views of the Martian landscape"
        },
        {
          title: "Mars Rover Access",
          description: "Included rover for exploring the surrounding terrain"
        }
      ],
      cancellation_policy: "Free cancellation for 48 hours",
      weekly_discount_percent: 10,
      cleaning_fee: 50,
      service_fee_percent: 12,
      occupancy_tax_percent: 8,
      sleeping_arrangements: [
        { room: "Main Pod", beds: "1 Queen bed" },
        { room: "Secondary Pod", beds: "2 Single beds" }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      hosts: {
        id: 'mock-host-1',
        name: "Elon Musk",
        profile_picture_url: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
        join_date: "2020-01-01",
        response_rate: 100,
        response_time: "Usually responds within an hour",
        is_superhost: true,
        is_identity_verified: true,
        total_reviews: 500,
        description: "Founder of SpaceX. Passionate about making life multiplanetary.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      listing_images: [
        {
          id: 'img-1',
          listing_id: 'mock-2',
          image_url: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
          image_order: 1,
          caption: "Main living area",
          created_at: new Date().toISOString()
        }
      ],
      amenities: [
        { id: 'amenity-1', name: "WiFi", icon_url: null, created_at: new Date().toISOString() },
        { id: 'amenity-2', name: "Kitchen", icon_url: null, created_at: new Date().toISOString() },
        { id: 'amenity-3', name: "Life Support", icon_url: null, created_at: new Date().toISOString() },
        { id: 'amenity-4', name: "Mars Rover", icon_url: null, created_at: new Date().toISOString() }
      ],
      reviews: [
        {
          id: 'review-1',
          listing_id: 'mock-2',
          reviewer_name: "Neil Armstrong",
          reviewer_avatar_url: null,
          review_date: new Date().toISOString(),
          rating_overall: 5,
          comment: "Absolutely incredible experience! The views of Mars are breathtaking. The life support systems worked flawlessly. Highly recommend!",
          created_at: new Date().toISOString()
        },
        {
          id: 'review-2',
          listing_id: 'mock-2',
          reviewer_name: "Buzz Aldrin",
          reviewer_avatar_url: null,
          review_date: new Date().toISOString(),
          rating_overall: 5,
          comment: "One small step for man, one giant leap for Airbnb! The pod was exactly as described. The rover tour was amazing.",
          created_at: new Date().toISOString()
        }
      ]
    }
  };

  return mockData[listingId] || null;
}

/**
 * Fetch a single listing with all related data (host, images, amenities, reviews)
 */
export async function fetchListingDetails(listingId: string): Promise<ListingDetails | null> {
  // ALWAYS check for mock data first - this ensures mock listings work regardless of Supabase config
  // This MUST happen before any async operations or Supabase calls
  if (listingId && listingId.startsWith('mock-')) {
    const mockData = getMockListingDetails(listingId);
    if (mockData) {
      console.log('✅ Returning mock data for listing:', listingId);
      return mockData;
    }
    console.warn('⚠️ Mock listing ID provided but no mock data found:', listingId);
  }

  // If Supabase is not configured, try mock data as fallback for any ID
  if (!isSupabaseConfigured()) {
    console.log('ℹ️ Supabase not configured, trying mock data for:', listingId);
    const mockData = getMockListingDetails(listingId);
    if (mockData) {
      return mockData;
    }
    return null;
  }

  try {
    // Only try Supabase if it's configured AND it's not a mock ID
    console.log('🔍 Fetching listing details for ID:', listingId);
    
    // Fetch listing with host - explicitly include all fields from populate-full-listing-content.sql
    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        hosts (*)
      `)
      .eq('id', listingId)
      .single();

    if (listingError) {
      console.error('❌ Error fetching listing from Supabase:', listingError);
      console.error('Error details:', {
        message: listingError.message,
        details: listingError.details,
        hint: listingError.hint,
        code: listingError.code
      });
      
      // Don't throw - return null so the UI can show a proper error message
      return null;
    }

    if (!listingData) {
      console.warn('⚠️ No listing data returned for ID:', listingId);
      return null;
    }

    console.log('✅ Listing data fetched successfully:', listingData.title);
    console.log('🔍 Host data structure:', {
      hostsType: Array.isArray(listingData.hosts) ? 'array' : typeof listingData.hosts,
      hostsValue: listingData.hosts
    });

    // Handle hosts - Supabase might return it as an array or object
    // For foreign key relationships, it should be a single object, but let's be safe
    let hostData: Host | null = null;
    if (listingData.hosts) {
      if (Array.isArray(listingData.hosts)) {
        hostData = listingData.hosts[0] as Host | null;
      } else {
        hostData = listingData.hosts as Host;
      }
    }

    // Fetch images
    const { data: imagesData, error: imagesError } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', listingId)
      .order('image_order', { ascending: true });

    if (imagesError) {
      console.error('Error fetching listing images:', imagesError);
    }

    // Fetch amenities
    const { data: amenitiesData, error: amenitiesError } = await supabase
      .from('listing_amenities')
      .select(`
        amenity_id,
        amenities (*)
      `)
      .eq('listing_id', listingId);

    if (amenitiesError) {
      console.error('Error fetching listing amenities:', amenitiesError);
    }

    // Fetch reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('listing_id', listingId)
      .order('review_date', { ascending: false });

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
    }

    // Transform the data
    const amenities = (amenitiesData || [])
      .map((item: any) => item.amenities)
      .filter((amenity: Amenity | null) => amenity !== null) as Amenity[];

    // Extract listing data without hosts to avoid duplication
    const { hosts: _, ...listingDataWithoutHosts } = listingData as any;

    const result: ListingDetails = {
      ...listingDataWithoutHosts,
      hosts: hostData,
      listing_images: (imagesData || []) as ListingImage[],
      amenities: amenities,
      reviews: (reviewsData || []) as Review[],
    };

    console.log('✅ Listing details assembled successfully:', {
      title: result.title,
      host: result.hosts?.name || 'No host',
      imagesCount: result.listing_images.length,
      amenitiesCount: result.amenities.length,
      reviewsCount: result.reviews.length
    });

    return result;
  } catch (error) {
    console.error('❌ Exception in fetchListingDetails:', error);
    console.error('Exception details:', error instanceof Error ? error.message : String(error));
    // Don't throw - return null so the UI can show a proper error message
    return null;
  }
}

/**
 * Fetch listings with host information (for more detailed card views)
 */
export async function fetchListingsWithHosts(): Promise<ListingWithHost[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      hosts (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings with hosts:', error);
    throw error;
  }

  return (data || []).map((item: any) => ({
    ...item,
    hosts: item.hosts as Host | null,
  }));
}

/**
 * Fetch all amenities
 */
export async function fetchAmenities(): Promise<Amenity[]> {
  const { data, error } = await supabase
    .from('amenities')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching amenities:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch reviews for a specific listing
 */
export async function fetchListingReviews(listingId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .order('review_date', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: {
  listing_id: string;
  listing_title: string;
  price_usd: number;
  base_fare_usd: number;
  service_fee_usd: number;
  cleaning_fee_usd: number;
  occupancy_tax_usd: number;
  guest_count: number;
}): Promise<Booking | null> {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ createBooking: Supabase not configured');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        listing_id: bookingData.listing_id,
        listing_title: bookingData.listing_title,
        price_usd: bookingData.price_usd,
        base_fare_usd: bookingData.base_fare_usd,
        service_fee_usd: bookingData.service_fee_usd,
        cleaning_fee_usd: bookingData.cleaning_fee_usd,
        occupancy_tax_usd: bookingData.occupancy_tax_usd,
        guest_count: bookingData.guest_count,
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating booking:', error);
      throw error;
    }

    console.log('✅ Booking created successfully:', data.id);
    return data as Booking;
  } catch (error) {
    console.error('❌ Exception creating booking:', error);
    throw error;
  }
}

