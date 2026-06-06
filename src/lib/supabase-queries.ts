import { supabase, isSupabaseConfigured } from './supabase';
import { hasDedicatedAmenityIcon } from './amenity-icons';
import { getListingHoverVideo } from './listing-hover-videos';
import { slugifyListingTitle } from './listing-slug';
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

export interface FetchListingsOptions {
  theme?: string;
  era?: string;
}

/**
 * Fetch all listings with host information for card display.
 * Optional theme/era filter; applied only when provided (e.g. when user clicks Search).
 */
const isDev = import.meta.env.DEV;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function fetchListings(options?: FetchListingsOptions): Promise<ListingCard[]> {
  if (!isSupabaseConfigured()) {
    if (isDev) console.warn('⚠️ fetchListings: Supabase not configured');
    // Return empty array instead of throwing - let component handle fallback
    return [];
  }

  if (isDev) console.log('🔄 fetchListings: Querying Supabase for listings...', options ?? {});
  let query = supabase
    .from('listings')
    .select(`
      id,
      title,
      main_image,
      thumbnail_image,
      overall_rating,
      date,
      is_guest_favorite,
      theme,
      era
    `)
    .order('created_at', { ascending: false });

  if (options?.theme) {
    query = query.eq('theme', options.theme);
  }
  if (options?.era) {
    query = query.eq('era', options.era);
  }

  const { data, error } = await query;

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

  if (isDev) console.log(`✅ fetchListings: Received ${data?.length || 0} listings from Supabase`);

  // Exclude removed listings so they never show even if re-inserted
  const EXCLUDED_LISTING_IDS = new Set([
    'a1b2c3d4-e5f6-7890-abcd-111111111111', // The Last Beachfront Property — Miami, 2089
    'a1b2c3d4-e5f6-7890-abcd-222222222222', // Amazon Rainforest Biodome — Brazil, 2203
    'a1b2c3d4-e5f6-7890-abcd-444444444444', // Floating City Apartment — Neo-Pacific, 2178
  ]);
  const filtered = (data || []).filter((listing) => !EXCLUDED_LISTING_IDS.has(listing.id));

  // Only these specific listings should show the "frequently revisited" pill
  const FREQUENTLY_REVISITED_LISTINGS = [
    'Mars Colony Pod', // Mars Colony Pod, Olympus Mons
    'Crystal Villa', // Crystal Villa, Atlantis
    'Floating Mountain Bungalow', // Floating Mountain Bungalow, Pandora
    'Lunar Hilton Penthouse', // Lunar Hilton Penthouse, Moon
    'Neo-Showa Capsule Pod', // Neo-Showa Capsule Pod, Parallel Tokyo
  ];

  // Helper function to check if a listing should show the frequently revisited badge
  const shouldShowFrequentlyRevisited = (title: string): boolean => {
    return FREQUENTLY_REVISITED_LISTINGS.some(keyword => 
      title.includes(keyword)
    );
  };

  // Transform to ListingCard format (no price on homepage)
  const transformed = filtered.map((listing) => ({
    id: listing.id,
    title: listing.title,
    image: listing.thumbnail_image || listing.main_image, // Use thumbnail for homepage, fallback to main_image
    hoverVideo: getListingHoverVideo(listing.title),
    rating: listing.overall_rating ? listing.overall_rating.toString() : undefined,
    date: listing.date || undefined,
    // Only show frequently revisited pill for specific listings, regardless of database value
    isGuestFavorite: shouldShowFrequentlyRevisited(listing.title),
    theme: listing.theme ?? undefined,
    era: listing.era ?? undefined,
  }));

  // Custom sort order for homepage display
  const SORT_ORDER_KEYWORDS = [
    'Crystal Villa', // 1. Crystal Villa, Atlantis
    'Manhattan', // 2. Manhattan Loft, New York
    'Alexander', // 3. Alexander's Campaign Tent, Persia
    'Shah Jahan', // 4. Shah Jahan's Marble Suite, Agra
    'Mars Colony Pod', // 5. Mars Colony Pod, Olympus Mons
    'First-Class Suite', // 6. First-Class Suite, RMS Titanic
    'Floating Mountain', // 7. Floating Mountain Bungalow, Pandora
    'Nile Villa', // 8. Nile Villa, Ancient Egypt
    'Lunar Hilton', // 9. Lunar Hilton Penthouse, Moon
    'Neo-Showa', // 10. Neo-Showa Capsule Pod, Parallel Tokyo
    'Area 51', // 11. Classified Barracks, Area 51
    'Bermuda Triangle', // 12. Research Platform, Bermuda Triangle
    'Federation', // 13. Federation Ambassador Suite, Earth
    'Cave', // 14. Cave Dwelling, Lascaux
    'Resistance Safehouse', // 15. Resistance Safehouse Loft, Berlin
  ];

  // Helper function to get sort priority (lower number = appears first)
  const getSortPriority = (title: string): number => {
    const lowerTitle = title.toLowerCase();
    for (let i = 0; i < SORT_ORDER_KEYWORDS.length; i++) {
      if (lowerTitle.includes(SORT_ORDER_KEYWORDS[i].toLowerCase())) {
        return i;
      }
    }
    // If no match, put at the end
    return SORT_ORDER_KEYWORDS.length;
  };

  // Sort listings according to custom order
  const sorted = transformed.sort((a, b) => {
    const priorityA = getSortPriority(a.title);
    const priorityB = getSortPriority(b.title);
    return priorityA - priorityB;
  });
  
  if (isDev) console.log('📋 fetchListings: Transformed listings:', sorted.map(l => ({ id: l.id, title: l.title })));

  return sorted;
}

/**
 * Mock listing details for development/testing
 */
function getMockListingDetails(listingKey: string): ListingDetails | null {
  const mockData: Record<string, ListingDetails> = {
    'mock-2': {
      id: 'mock-2',
      host_id: 'mock-host-1',
      title: "Mars Colony Pod, Olympus Mons",
      main_image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
      property_type: "Space Pod",
      guest_capacity: 10,
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
      short_description: "Experience life on the Red Planet in this state-of-the-art Mars colony pod",
      full_description: "Welcome to the future of space travel! This cutting-edge Mars Colony Pod offers an unparalleled experience on the Red Planet. Located at the base of Olympus Mons, the solar system's largest volcano, you'll enjoy breathtaking views of the Martian landscape.\n\nFeatures include:\n- Fully pressurized living quarters\n- Life support systems\n- Panoramic dome views\n- Zero-gravity sleeping pods\n- Mars rover access\n- Communication array for Earth contact\n\nPerfect for space enthusiasts, scientists, or anyone looking for the ultimate adventure. Book your stay and become one of the first humans to experience life on Mars!",
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

  const byKey = mockData[listingKey];
  if (byKey) return byKey;
  const normalized = slugifyListingTitle(listingKey);
  return Object.values(mockData).find((listing) => slugifyListingTitle(listing.title) === normalized) || null;
}

/**
 * Fetch a single listing with all related data (host, images, amenities, reviews)
 */
async function fetchListingDetailsById(listingId: string): Promise<ListingDetails | null> {
  try {
    const { data: listingData, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        hosts (*)
      `)
      .eq('id', listingId)
      .single();

    if (listingError || !listingData) {
      if (listingError && isDev) {
        console.warn('⚠️ Listing lookup by ID failed:', listingError.message);
      }
      return null;
    }

    let hostData: Host | null = null;
    if (listingData.hosts) {
      hostData = Array.isArray(listingData.hosts)
        ? (listingData.hosts[0] as Host | null)
        : (listingData.hosts as Host);
    }

    const [imagesResult, amenitiesResult, reviewsResult] = await Promise.all([
      supabase
        .from('listing_images')
        .select('*')
        .eq('listing_id', listingId)
        .order('image_order', { ascending: true }),
      supabase
        .from('listing_amenities')
        .select(`
          amenity_id,
          amenities (*)
        `)
        .eq('listing_id', listingId),
      supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .order('review_date', { ascending: false }),
    ]);

    const { data: imagesData, error: imagesError } = imagesResult;
    const { data: amenitiesData, error: amenitiesError } = amenitiesResult;
    const { data: reviewsData, error: reviewsError } = reviewsResult;

    if (imagesError) {
      console.error('Error fetching listing images:', imagesError);
    }

    if (amenitiesError) {
      console.error('Error fetching listing amenities:', amenitiesError);
    }

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
    }

    const amenitiesRows = (amenitiesData || []) as Array<{
      amenities: Amenity | Amenity[] | null;
    }>;
    const amenities = amenitiesRows
      .flatMap((item) => {
        if (Array.isArray(item.amenities)) return item.amenities;
        return item.amenities ? [item.amenities] : [];
      })
      .filter((amenity): amenity is Amenity => hasDedicatedAmenityIcon(amenity.name));

    const seen = new Set<string>();
    const uniqueReviews = (reviewsData || []).filter((r: Review) => {
      const key = `${r.listing_id}|${r.reviewer_name}|${r.review_date}|${r.comment ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }) as Review[];

    const { hosts: _, ...listingDataWithoutHosts } = listingData as ListingDetails;
    return {
      ...listingDataWithoutHosts,
      hosts: hostData,
      listing_images: (imagesData || []) as ListingImage[],
      amenities,
      reviews: uniqueReviews,
    };
  } catch (error) {
    console.error('❌ Exception in fetchListingDetailsById:', error);
    return null;
  }
}

export async function fetchListingDetails(listingId: string): Promise<ListingDetails | null> {
  if (listingId && listingId.startsWith('mock-')) {
    const mockData = getMockListingDetails(listingId);
    if (mockData) return mockData;
  }

  if (!isSupabaseConfigured()) {
    return getMockListingDetails(listingId);
  }

  if (UUID_REGEX.test(listingId)) {
    const direct = await fetchListingDetailsById(listingId);
    if (direct) return direct;
  }

  try {
    const normalizedKey = slugifyListingTitle(listingId);
    const { data: listingIndex, error: listingIndexError } = await supabase
      .from('listings')
      .select('id, title')
      .order('created_at', { ascending: false });

    if (listingIndexError) {
      console.error('❌ Error resolving listing slug from Supabase:', listingIndexError);
      return null;
    }

    const resolvedListing = (listingIndex || []).find((listing) => (
      listing.id === listingId || slugifyListingTitle(listing.title) === normalizedKey
    ));

    if (!resolvedListing) return null;
    return await fetchListingDetailsById(resolvedListing.id);
  } catch (error) {
    console.error('❌ Exception in fetchListingDetails:', error);
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

  return ((data || []) as ListingWithHost[]).map((item) => ({
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
 * Fetch reviews for a specific listing (deduplicated by reviewer + date + comment)
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

  const seen = new Set<string>();
  return (data || []).filter((r: Review) => {
    const key = `${r.listing_id}|${r.reviewer_name}|${r.review_date}|${r.comment ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get the number of confirmed bookings for a listing (for queue position on confirmation page).
 */
export async function getBookingCountForListing(listingId: string): Promise<number> {
  if (!isSupabaseConfigured()) {
    if (isDev) console.warn('⚠️ getBookingCountForListing: Supabase not configured');
    return 0;
  }

  try {
    const { count, error } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('listing_id', listingId);

    if (error) {
      console.error('❌ Error fetching booking count:', error);
      return 0;
    }
    return typeof count === 'number' ? count : 0;
  } catch (err) {
    console.error('❌ Exception in getBookingCountForListing:', err);
    return 0;
  }
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
    if (isDev) console.warn('⚠️ createBooking: Supabase not configured');
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

    if (isDev) console.log('✅ Booking created successfully:', data.id);
    return data as Booking;
  } catch (error) {
    console.error('❌ Exception creating booking:', error);
    throw error;
  }
}
