// Database type definitions matching Supabase schema

export interface Host {
  id: string;
  name: string;
  profile_picture_url: string | null;
  join_date: string | null;
  response_rate: number | null;
  response_time: string | null;
  is_superhost: boolean;
  is_identity_verified: boolean;
  total_reviews: number;
  description: string | null;
  created_at: string;
  updated_at: string;
  // Optional badges JSON (string or parsed array) used by ListingDetailPage
  badges?: HostBadge[] | string | null;
}

// Host badge used for "Meet your host" section in ListingDetailPage
export interface HostBadge {
  type: string;
  label: string;
}

// Generic review badge structure (used for parsing host badges safely)
export interface ReviewBadge {
  type: string;
  label: string;
}

// Structured "things to know" block used by ListingDetailPage
export interface ThingsToKnow {
  house_rules?: Array<string | { rule: string }>;
  safety_and_property?: Array<{ item: string; note?: string | null }>;
  cancellation_highlight?: string | null;
}

export interface KeyFeature {
  title: string;
  description: string;
}

export interface SleepingArrangement {
  room: string;
  beds: string;
}

export interface Listing {
  id: string;
  host_id: string | null;
  title: string;
  main_image: string;
  property_type: string | null;
  guest_capacity: number | null;
  bedrooms: number | null;
  beds: number | null;
  baths: number | null;
  price_per_night: number;
  price_display: string | null;
  overall_rating: number | null;
  total_reviews: number;
  is_guest_favorite: boolean;
  date: string | null;
  location_description: string | null;
  short_description: string | null;
  full_description: string | null;
  // May be stored as JSON string in the DB; UI code parses strings at runtime
  key_features: KeyFeature[] | string | null;
  cancellation_policy: string | null;
  weekly_discount_percent: number | null;
  cleaning_fee: number | null;
  service_fee_percent: number | null;
  occupancy_tax_percent: number | null;
  // May be stored as JSON string in the DB; UI code parses strings at runtime
  sleeping_arrangements: SleepingArrangement[] | string | null;
  // "Things to know" section – string when coming directly from Supabase JSON column
  things_to_know?: ThingsToKnow | string | null;
  /** Theme slug for homepage filtering: grandeur, sci-fi, myth, conflict, classified */
  theme?: string | null;
  /** Era slug for homepage filtering: origins, classical, recent-past, future */
  era?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  image_url: string;
  image_order: number;
  caption: string | null;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon_url: string | null;
  created_at: string;
}

export interface ListingAmenity {
  id: string;
  listing_id: string;
  amenity_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer_name: string;
  reviewer_avatar_url: string | null;
  review_date: string;
  rating_overall: number | null;
  comment: string | null;
  created_at: string;
  reviewer_city?: string | null;
  reviewer_era?: string | null;
  response_to_reviewer?: string | null;
  response_comment?: string | null;
}

// Extended types for queries with joins
export interface ListingWithHost extends Listing {
  hosts: Host | null;
}

export interface ListingDetails extends Listing {
  hosts: Host | null;
  listing_images: ListingImage[];
  amenities: Amenity[];
  reviews: Review[];
}

// Type for listing card display (simplified)
export interface ListingCard {
  id: string;
  title: string;
  image: string;
  /** Optional; omitted on homepage so price is not shown there */
  price?: string;
  rating?: string;
  date?: string;
  isGuestFavorite?: boolean;
  theme?: string | null;
  era?: string | null;
}

// Booking type for storing confirmed bookings
export interface Booking {
  id: string;
  listing_id: string;
  listing_title: string;
  price_usd: number;
  base_fare_usd: number;
  service_fee_usd: number;
  cleaning_fee_usd: number;
  occupancy_tax_usd: number;
  guest_count: number;
  status: string;
  created_at: string;
  updated_at: string;
}

