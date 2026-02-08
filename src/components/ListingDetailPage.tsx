import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { fetchListingDetails } from '../lib/supabase-queries';
import type { ListingDetails, Amenity, HostBadge, ThingsToKnow } from '../types/database';

// Duration options for teleportation
const DURATION_OPTIONS = [
  { value: 4, label: '4 hours', multiplier: 1 },
  { value: 6, label: '6 hours', multiplier: 1.4 },
  { value: 12, label: '12 hours', multiplier: 2.5 },
  { value: 24, label: '24 hours', multiplier: 4 },
  { value: 48, label: '2 days', multiplier: 7 },
  { value: 72, label: '3 days', multiplier: 9 },
];
import { Header, Button } from '../design-system';
import { TIME_TRAVEL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import { PhotoViewer } from './PhotoViewer';
import { motion } from 'framer-motion';
import { HeroGridSkeleton } from './HeroGridSkeleton';
import { TransactionLoader } from './TransactionLoader';
import { Modal } from './Modal';
import {
  Wifi,
  UtensilsCrossed,
  Mountain,
  Activity,
  Wind,
  Car,
  Recycle,
  Droplets,
  Shield,
  Package,
  Users,
  Bed,
  Eye,
  Gauge,
  Settings,
  ChefHat,
  Heart,
  Refrigerator,
  Thermometer,
  AirVent,
  Circle,
  Gem,
  Waves,
  RotateCcw,
  Fish,
  DoorOpen,
  Lightbulb,
  Building2,
  BookOpen,
  Sparkles,
  Star,
  Lock,
  Zap,
  Clock,
  Globe,
  Tent,
  Leaf,
  Phone,
  Music,
  Building,
  Lamp,
  CheckCircle,
  User,
  GaugeCircle,
  Wine,
  GlassWater,
  ConciergeBell,
  Bath,
  Dumbbell,
  Shirt,
  PenLine,
  Armchair,
  Anchor,
  Footprints,
  ShieldCheck,
  XCircle,
  BadgeCheck,
  Timer,
  Compass,
  MessageCircle,
  AlertTriangle,
  Info,
  Sun,
  Moon,
  Camera,
  Bird,
  Hand,
  Network,
  Scroll,
  Sword,
  Rewind,
  Ban,
  DoorClosed,
  VolumeX,
  Flame,
  TreePine,
  Radio,
  Binoculars,
  Rocket,
  Cpu,
  Bot,
  HelpCircle,
  Menu,
  type LucideIcon
} from 'lucide-react';

const FIGMA_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: TIME_TRAVEL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

const headerRightSlot = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-12)' }}>
    <Button variant="ghost" size="md" style={{ color: 'var(--ds-navbar-active)' }}>
      Become a host
    </Button>
    <button type="button" className="ds-header-right-icon-btn" aria-label="Help" style={{ border: 'none' }}>
      <HelpCircle size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
    </button>
    <button type="button" className="ds-header-right-icon-btn" aria-label="Menu" style={{ border: 'none' }}>
      <Menu size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
    </button>
  </div>
);

// ============================================================================
// HOST BADGE COMPONENTS (Airbnb-style)
// ============================================================================

// Temporal Guardian badge icon
function TemporalGuardianIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FF385C"/>
      <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="#FF385C" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Cross-Dimensional Host badge icon
function CrossDimensionalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#FF385C"/>
      <circle cx="8" cy="10" r="2" fill="white"/>
      <circle cx="16" cy="10" r="2" fill="white"/>
      <circle cx="12" cy="16" r="2" fill="white"/>
      <path d="M8 10L12 16L16 10" stroke="white" strokeWidth="1.5"/>
    </svg>
  );
}

// Host badge pill component
function HostBadgePill({ badge }: { badge: HostBadge }) {
  const getBadgeIcon = () => {
    switch (badge.type) {
      case 'temporal_guardian':
        return <TemporalGuardianIcon />;
      case 'cross_dimensional_host':
        return <CrossDimensionalIcon />;
      case 'superhost':
        return <Star size={14} fill="#FF385C" color="#FF385C" />;
      case 'identity_verified':
        return <ShieldCheck size={14} color="#FF385C" />;
      default:
        return <BadgeCheck size={14} color="#FF385C" />;
    }
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      backgroundColor: '#FFF0F3',
      borderRadius: '16px',
      border: '1px solid #FFD9E0',
    }}>
      {getBadgeIcon()}
      <span style={{
        fontFamily: '"Figtree", sans-serif',
        fontSize: '12px',
        fontWeight: 500,
        color: '#FF385C',
      }}>
        {badge.label}
      </span>
    </div>
  );
}

// ============================================================================
// AMENITY ICON MAPPING
// ============================================================================

function getAmenityIcon(amenityName: string): LucideIcon {
  const name = amenityName.toLowerCase();

  // WiFi and connectivity
  if (name.includes('wifi') || name.includes('wi-fi') || name.includes('starlink')) return Wifi;
  if (name.includes('radio') || name.includes('communication')) return Radio;

  // Kitchen and food
  if (name.includes('kitchen') || name.includes('galley')) return UtensilsCrossed;
  if (name.includes('refrigerator') || name.includes('cold') || name.includes('storage')) return Refrigerator;
  if (name.includes('chef') || name.includes('cooking')) return ChefHat;

  // Climate and environment
  if (name.includes('air conditioning') || name.includes('climate') || name.includes('heating')) return Thermometer;
  if (name.includes('life support')) return Activity;
  if (name.includes('habitat')) return Building2;
  if (name.includes('pressure')) return Gauge;

  // Views and nature
  if (name.includes('view') || name.includes('observation')) return Eye;
  if (name.includes('mountain') || name.includes('floating')) return Mountain;
  if (name.includes('underwater') || name.includes('ocean') || name.includes('marine')) return Waves;
  if (name.includes('crystal') || name.includes('gem')) return Gem;
  if (name.includes('bioluminescent') || name.includes('glow')) return Sparkles;
  if (name.includes('flora') || name.includes('native') || name.includes('plant') || name.includes('tree')) return TreePine;
  if (name.includes('wildlife') || name.includes('bird')) return Bird;

  // Space and technology
  if (name.includes('rover') || name.includes('exploration')) return Car;
  if (name.includes('monitoring') || name.includes('perimeter')) return Eye;
  if (name.includes('recycler') || name.includes('fabric')) return Recycle;
  if (name.includes('drying') || name.includes('thermal')) return Sun;
  if (name.includes('replicator')) return Cpu;
  if (name.includes('holodeck')) return Sparkles;
  if (name.includes('transporter')) return Zap;
  if (name.includes('robot') || name.includes('butler')) return Bot;
  if (name.includes('radiation') || name.includes('shielding')) return Shield;
  if (name.includes('evacuation') || name.includes('emergency') || name.includes('escape')) return Rocket;

  // Historical and cultural
  if (name.includes('historical') || name.includes('preservation') || name.includes('authentic')) return BookOpen;
  if (name.includes('artifact') || name.includes('cultural')) return Scroll;
  if (name.includes('period') || name.includes('furnishing')) return Armchair;
  if (name.includes('hieroglyphic') || name.includes('painting') || name.includes('art')) return PenLine;
  if (name.includes('nile') || name.includes('river')) return Anchor;
  if (name.includes('courtyard') || name.includes('garden')) return Leaf;
  if (name.includes('tour') || name.includes('guide')) return Compass;
  if (name.includes('military') || name.includes('camp')) return Tent;
  if (name.includes('hidden') || name.includes('compartment') || name.includes('secret')) return Lock;
  if (name.includes('covert') || name.includes('entry')) return DoorClosed;

  // Comfort and amenities
  if (name.includes('bed') || name.includes('sleeping')) return Bed;
  if (name.includes('bath') || name.includes('spa')) return Bath;
  if (name.includes('gym') || name.includes('fitness')) return Dumbbell;
  if (name.includes('pool') || name.includes('jacuzzi')) return Droplets;
  if (name.includes('parking')) return Car;
  if (name.includes('concierge') || name.includes('service')) return ConciergeBell;

  // Stone age / primitive
  if (name.includes('fire') || name.includes('pit')) return Flame;
  if (name.includes('fur') || name.includes('bedding')) return Bed;
  if (name.includes('cave') || name.includes('entrance')) return DoorOpen;
  if (name.includes('hunting') || name.includes('grok')) return Binoculars;
  if (name.includes('berry') || name.includes('foraging')) return Leaf;
  if (name.includes('mammoth') || name.includes('comfort')) return Heart;
  if (name.includes('smoke') || name.includes('ventilation')) return Wind;
  if (name.includes('rock') || name.includes('seating')) return Circle;
  if (name.includes('predator') || name.includes('protection')) return Shield;
  if (name.includes('spirit') || name.includes('journey')) return Sparkles;

  // Bermuda / Mystery
  if (name.includes('temporal') || name.includes('anomaly')) return Clock;
  if (name.includes('compass') || name.includes('unreliable')) return Compass;
  if (name.includes('calendar') || name.includes('subjective')) return Clock;
  if (name.includes('research') || name.includes('equipment')) return Settings;
  if (name.includes('mystery') || name.includes('atmosphere')) return Eye;
  if (name.includes('bunk') || name.includes('mess')) return Bed;
  if (name.includes('log') || name.includes('record')) return BookOpen;
  if (name.includes('dread') || name.includes('existential')) return AlertTriangle;
  if (name.includes('raft') || name.includes('life')) return Anchor;

  // Area 51 / Classified
  if (name.includes('classified') || name.includes('cafeteria')) return UtensilsCrossed;
  if (name.includes('unusual') || name.includes('housekeeping')) return Users;
  if (name.includes('monitored') || name.includes('communications')) return Radio;
  if (name.includes('hangar') || name.includes('restricted')) return Ban;
  if (name.includes('first aid')) return Heart;
  if (name.includes('night sky')) return Moon;
  if (name.includes('redacted')) return XCircle;

  // Floating city
  if (name.includes('window') || name.includes('fishing')) return Fish;
  if (name.includes('gimbal') || name.includes('furniture')) return Settings;
  if (name.includes('seasickness') || name.includes('remedies')) return Heart;
  if (name.includes('life jacket')) return Shield;
  if (name.includes('boat') || name.includes('parking')) return Anchor;
  if (name.includes('market') || name.includes('local')) return Building;
  if (name.includes('stability') || name.includes('rating')) return GaugeCircle;
  if (name.includes('flotation')) return Waves;
  if (name.includes('desalination')) return Droplets;

  // Star Trek
  if (name.includes('vulcan') || name.includes('neighbor')) return Users;
  if (name.includes('merit') || name.includes('cultural')) return Star;
  if (name.includes('educational') || name.includes('program')) return BookOpen;
  if (name.includes('translator') || name.includes('universal')) return Globe;
  if (name.includes('post-scarcity')) return Sparkles;
  if (name.includes('transport')) return Zap;

  // Default
  return Circle;
}

// ============================================================================
// THINGS TO KNOW ICON MAPPING
// ============================================================================

function getThingsToKnowIcon(iconName: string | undefined): LucideIcon {
  if (!iconName) return Info;

  const name = iconName.toLowerCase();

  switch (name) {
    case 'clock': return Clock;
    case 'volume-off': return VolumeX;
    case 'dollar': return Sparkles;
    case 'shield': return Shield;
    case 'ban': return Ban;
    case 'warning': return AlertTriangle;
    case 'heart': return Heart;
    case 'leaf': return Leaf;
    case 'lock': return Lock;
    case 'eye': return Eye;
    case 'fire': return Flame;
    case 'fish': return Fish;
    case 'help': return Info;
    case 'navigation': return Compass;
    case 'camera-off': return Camera;
    case 'plane': return Rocket;
    default: return Info;
  }
}

/** Format host join_date to "X month(s)" or "X year(s)" for "X months hosting" / "X years hosting". */
function formatHostingDuration(joinDate: string): string {
  const join = new Date(joinDate);
  const now = new Date();
  const months = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? 's' : ''}`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [guestCount, setGuestCount] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const durationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadListing() {
      if (!id) {
        setError('No listing ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchListingDetails(id);
        if (data) {
          setListing(data);
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error loading listing:', err);
        setError('Failed to load listing');
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
        setShowGuestDropdown(false);
      }
      if (durationDropdownRef.current && !durationDropdownRef.current.contains(event.target as Node)) {
        setShowDurationDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageClick = (index: number) => {
    setPhotoViewerIndex(index);
    setShowPhotoViewer(true);
  };

  const handleReserve = async () => {
    if (!listing) return;

    setIsBooking(true);

    // Calculate prices
    const baseFare = listing.price_per_night * selectedDuration.multiplier;
    const serviceFee = baseFare * (listing.service_fee_percent || 12) / 100;
    const cleaningFee = listing.cleaning_fee || 50;
    const occupancyTax = baseFare * (listing.occupancy_tax_percent || 8) / 100;
    const totalPrice = baseFare + serviceFee + cleaningFee + occupancyTax;

    // Simulate booking delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsBooking(false);

    // Navigate to confirmation (payment + vehicle selection) page
    navigate(`/listing/${listing.id}/confirm`, {
      state: {
        listing: {
          id: listing.id,
          title: listing.title,
          image: listing.main_image,
          host: listing.hosts?.name,
        },
        booking: {
          duration: selectedDuration.label,
          guests: guestCount,
          baseFare,
          serviceFee,
          cleaningFee,
          occupancyTax,
          totalPrice,
        },
      },
    });
  };

  // Get all images for the photo viewer (just URLs)
  const allImages = listing ? [
    listing.main_image,
    ...listing.listing_images.map(img => img.image_url)
  ] : [];

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Header
          brandName="warpbnb"
          navItems={FIGMA_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={() => {}}
          onLogoClick={() => navigate('/')}
          rightSlot={headerRightSlot}
        />
        <div style={{ flex: 1, padding: '32px 24px 64px 24px' }}>
          <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}>
            <HeroGridSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <h2 style={{ fontFamily: '"Figtree", sans-serif', fontSize: '24px', color: '#222' }}>
          {error || 'Listing not found'}
        </h2>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#FF385C',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            fontFamily: '"Figtree", sans-serif',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Parse things_to_know if it's a string
  const thingsToKnow: ThingsToKnow | null = typeof listing.things_to_know === 'string'
    ? JSON.parse(listing.things_to_know)
    : listing.things_to_know;

  // Parse key_features if it's a string
  const keyFeatures = typeof listing.key_features === 'string'
    ? JSON.parse(listing.key_features)
    : listing.key_features;

  // Parse sleeping_arrangements if it's a string
  const sleepingArrangements = typeof listing.sleeping_arrangements === 'string'
    ? JSON.parse(listing.sleeping_arrangements)
    : listing.sleeping_arrangements;

  // Helper function to safely parse badges (handles double-encoded JSON)
  const parseBadges = (badges: any): ReviewBadge[] | null => {
    if (!badges) return null;
    if (Array.isArray(badges)) return badges;
    if (typeof badges === 'string') {
      try {
        const parsed = JSON.parse(badges);
        return Array.isArray(parsed) ? parsed : null;
      } catch {
        return null;
      }
    }
    return null;
  };

  // Parse host badges if they're a string
  const hostBadges = listing.hosts?.badges
    ? parseBadges(listing.hosts.badges) as HostBadge[] | null
    : null;

  // Calculate prices
  const baseFare = listing.price_per_night * selectedDuration.multiplier;
  const serviceFee = baseFare * (listing.service_fee_percent || 12) / 100;
  const cleaningFee = listing.cleaning_fee || 50;
  const occupancyTax = baseFare * (listing.occupancy_tax_percent || 8) / 100;
  const totalPrice = baseFare + serviceFee + cleaningFee + occupancyTax;

  // Convert to Bitcoin for display
  const btcRate = 0.000012;
  const btcTotal = (totalPrice * btcRate).toFixed(6);
  const btcBase = (baseFare * btcRate).toFixed(6);

  return (
    <>
      {/* Transaction Loader */}
      {isBooking && <TransactionLoader />}

      {/* Photo Viewer Modal */}
      {showPhotoViewer && (
        <PhotoViewer
          images={allImages}
          initialIndex={photoViewerIndex}
          onClose={() => setShowPhotoViewer(false)}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header
          brandName="warpbnb"
          navItems={FIGMA_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={() => {}}
          onLogoClick={() => navigate('/')}
          rightSlot={headerRightSlot}
        />
        <div style={{ flex: 1, padding: '32px 24px 64px 24px' }}>
        <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}>
        {/* Title */}
        <h1 style={{
          fontFamily: '"Figtree", sans-serif',
          fontSize: '30px',
          fontWeight: 500,
          color: '#000000',
          marginBottom: '24px',
          lineHeight: '40px',
          letterSpacing: '-0.6px',
        }}>
          {listing.title}
        </h1>

        {/* Hero Image Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '8px',
          height: '400px',
          marginBottom: '24px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Main Image */}
          <div
            onClick={() => handleImageClick(0)}
            style={{
              gridRow: 'span 2',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={listing.main_image}
              alt={listing.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* Secondary Images */}
          {listing.listing_images.slice(0, 4).map((img, idx) => (
            <div
              key={img.id}
              onClick={() => handleImageClick(idx + 1)}
              style={{
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <img
                src={img.image_url}
                alt={img.caption || `Image ${idx + 2}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 370px',
          gap: '80px',
        }}>
          {/* Left Column - Details */}
          <div>
            {/* Property Info */}
            <div style={{
              paddingBottom: '24px',
              borderBottom: '1px solid #EBEBEB',
              marginBottom: '24px',
            }}>
              <h2 style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '22px',
                fontWeight: 600,
                color: '#222',
                marginBottom: '4px',
              }}>
                {listing.property_type}
              </h2>
              <div style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '16px',
                color: '#222',
              }}>
                {listing.guest_capacity} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''} · {listing.beds} bed{listing.beds !== 1 ? 's' : ''} · {listing.baths} bath{listing.baths !== 1 ? 's' : ''}
              </div>
              {listing.overall_rating != null && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                }}>
                  <Star size={16} fill="#222" color="#222" />
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#222',
                  }}>
                    {listing.overall_rating.toFixed(2)}
                  </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    color: '#222',
                  }}> · </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    color: '#222',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }} onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                    {listing.total_reviews ?? listing.reviews?.length ?? 0} reviews
                  </span>
                </div>
              )}
            </div>

            {/* Host Section */}
            {listing.hosts && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingBottom: '24px',
                borderBottom: '1px solid #EBEBEB',
                marginBottom: '24px',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  {listing.hosts.profile_picture_url ? (
                    <img
                      src={listing.hosts.profile_picture_url}
                      alt={listing.hosts.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 600,
                    }}>
                      {listing.hosts.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#222',
                    marginBottom: '2px',
                  }}>
                    Hosted by {listing.hosts.name}
                  </div>
                  {listing.hosts.join_date && (
                    <div style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '14px',
                      color: '#717171',
                    }}>
                      {formatHostingDuration(listing.hosts.join_date)} hosting
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Features */}
            {keyFeatures && keyFeatures.length > 0 && (
              <div style={{
                paddingBottom: '24px',
                borderBottom: '1px solid #EBEBEB',
                marginBottom: '24px',
              }}>
                {keyFeatures.map((feature: any, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '16px',
                    marginBottom: idx < keyFeatures.length - 1 ? '24px' : 0,
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {idx === 0 && <DoorOpen size={24} color="#222" />}
                      {idx === 1 && <Star size={24} color="#222" />}
                      {idx === 2 && <Clock size={24} color="#222" />}
                      {idx === 3 && <Shield size={24} color="#222" />}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#222',
                        marginBottom: '4px',
                      }}>
                        {feature.title}
                      </div>
                      <div style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '14px',
                        color: '#717171',
                      }}>
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {(listing.full_description || listing.short_description) && (
            <div style={{
              paddingBottom: '24px',
              borderBottom: '1px solid #EBEBEB',
              marginBottom: '24px',
            }}>
              <p style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                color: '#222',
                whiteSpace: 'pre-line',
                display: '-webkit-box',
                WebkitLineClamp: 8,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {listing.full_description || listing.short_description}
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowDescriptionModal(true)}
                style={{ marginTop: '16px' }}
              >
                Show more
              </Button>
            </div>
            )}

            {/* Description modal (full text) */}
            <Modal
              isOpen={showDescriptionModal}
              onClose={() => setShowDescriptionModal(false)}
            >
              <div style={{
                padding: '24px',
                maxWidth: '640px',
                maxHeight: '85vh',
                overflow: 'auto',
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <button
                    type="button"
                    onClick={() => setShowDescriptionModal(false)}
                    aria-label="Close"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                      color: '#222',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#222',
                    margin: 0,
                    lineHeight: 1.25,
                    textAlign: 'left',
                  }}>
                    About this space
                  </h2>
                </div>
                <p style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#222',
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}>
                  {listing.full_description || listing.short_description}
                </p>
              </div>
            </Modal>

            {/* Sleeping Arrangements */}
            {sleepingArrangements && sleepingArrangements.length > 0 && (
              <div style={{
                paddingBottom: '24px',
                borderBottom: '1px solid #EBEBEB',
                marginBottom: '24px',
              }}>
                <h3 style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#222',
                  marginBottom: '24px',
                }}>
                  Where you'll sleep
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                }}>
                  {sleepingArrangements.map((arr: any, idx: number) => (
                    <div key={idx} style={{
                      minWidth: '200px',
                      padding: '24px',
                      border: '1px solid #EBEBEB',
                      borderRadius: '12px',
                    }}>
                      <Bed size={24} color="#222" style={{ marginBottom: '16px' }} />
                      <div style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#222',
                        marginBottom: '8px',
                      }}>
                        {arr.room}
                      </div>
                      <div style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '14px',
                        color: '#717171',
                      }}>
                        {arr.beds}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div style={{
              paddingBottom: '24px',
              borderBottom: '1px solid #EBEBEB',
              marginBottom: '24px',
            }}>
              <h3 style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '22px',
                fontWeight: 600,
                color: '#222',
                marginBottom: '24px',
              }}>
                What this place offers
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                {listing.amenities.slice(0, showAllAmenities ? undefined : 10).map((amenity) => {
                  const IconComponent = getAmenityIcon(amenity.name);
                  return (
                    <div key={amenity.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}>
                      <IconComponent size={24} color="#222" />
                      <span style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '16px',
                        color: '#222',
                      }}>
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
              {listing.amenities.length > 10 && !showAllAmenities && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setShowAllAmenities(true)}
                  style={{ marginTop: '24px' }}
                >
                  Show all {listing.amenities.length} amenities
                </Button>
              )}
            </div>

            {/* Reviews Section */}
            {listing.reviews.length > 0 && (
              <div id="reviews-section" style={{
                paddingBottom: '24px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                }}>
                  <Star size={20} fill="#222" color="#222" />
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#222',
                  }}>
                    {listing.overall_rating?.toFixed(2)} · {listing.reviews.length} reviews
                  </span>
                </div>

                {/* Reviews Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '40px',
                }}>
                  {listing.reviews.slice(0, showAllReviews ? undefined : 6).map((review) => (
                    <div key={review.id}>
                      {/* Reviewer Info */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                      }}>
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          backgroundColor: '#E0E0E0',
                        }}>
                          {review.reviewer_avatar_url ? (
                            <img
                              src={review.reviewer_avatar_url}
                              alt={review.reviewer_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#222',
                              color: 'white',
                              fontSize: '20px',
                              fontWeight: 600,
                            }}>
                              {review.reviewer_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#222',
                          }}>
                            {review.reviewer_name}
                          </div>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '14px',
                            color: '#717171',
                          }}>
                            {review.reviewer_city && review.reviewer_era
                              ? `${review.reviewer_city}, ${review.reviewer_era}`
                              : new Date(review.review_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      {/* Review Comment */}
                      <p style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#222',
                        margin: 0,
                      }}>
                        {review.comment}
                      </p>

                      {/* Cross-timeline response */}
                      {review.response_to_reviewer && review.response_comment && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          backgroundColor: '#F7F7F7',
                          borderRadius: '8px',
                          borderLeft: '3px solid #FF385C',
                        }}>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '13px',
                            fontWeight: 500,
                            color: '#717171',
                            marginBottom: '4px',
                          }}>
                            Response to {review.response_to_reviewer}:
                          </div>
                          <p style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#222',
                            margin: 0,
                            fontStyle: 'italic',
                          }}>
                            {review.response_comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {listing.reviews.length > 6 && !showAllReviews && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowAllReviews(true)}
                    style={{ marginTop: '24px' }}
                  >
                    Show all {listing.reviews.length} reviews
                  </Button>
                )}
              </div>
            )}

            {/* Meet your host - Card Style */}
            {listing.hosts && (
              <div style={{
                paddingTop: '24px',
                paddingBottom: '24px',
                borderTop: '1px solid #EBEBEB',
              }}>
                <h2 style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#222',
                  marginBottom: '24px',
                }}>
                  Meet your host
                </h2>

                <div style={{
                  display: 'flex',
                  gap: '80px',
                  alignItems: 'flex-start',
                }}>
                  {/* Left: Host Card */}
                  <div style={{
                    width: '220px',
                    flexShrink: 0,
                    padding: '24px 32px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}>
                    {/* Host Avatar */}
                    <div style={{
                      width: '104px',
                      height: '104px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    }}>
                      {listing.hosts.profile_picture_url ? (
                        <img
                          src={listing.hosts.profile_picture_url}
                          alt={listing.hosts.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#222',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '36px',
                          fontWeight: 600,
                        }}>
                          {listing.hosts.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Host Name */}
                    <h3 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#222',
                      marginBottom: '4px',
                      lineHeight: '32px',
                    }}>
                      {listing.hosts.name}
                    </h3>

                    {/* Superhost indicator */}
                    {listing.hosts.is_superhost && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '8px',
                      }}>
                        <Star size={12} fill="#222" color="#222" />
                        <span style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#222',
                        }}>
                          Superhost
                        </span>
                      </div>
                    )}

                    {/* Host Stats Row */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '16px',
                      width: '100%',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #EBEBEB',
                    }}>
                      {/* Reviews */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#222',
                        }}>
                          {listing.hosts.total_reviews || 0}
                        </div>
                        <div style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '10px',
                          color: '#717171',
                          fontWeight: 400,
                        }}>
                          Reviews
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{
                        width: '1px',
                        backgroundColor: '#EBEBEB',
                        alignSelf: 'stretch',
                      }} />

                      {/* Rating */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#222',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                        }}>
                          {listing.overall_rating?.toFixed(2) || '—'}
                          <Star size={12} fill="#222" color="#222" />
                        </div>
                        <div style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '10px',
                          color: '#717171',
                          fontWeight: 400,
                        }}>
                          Rating
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{
                        width: '1px',
                        backgroundColor: '#EBEBEB',
                        alignSelf: 'stretch',
                      }} />

                      {/* Years Hosting */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#222',
                        }}>
                          {listing.hosts.join_date
                            ? Math.max(1, new Date().getFullYear() - new Date(listing.hosts.join_date).getFullYear())
                            : 1}
                        </div>
                        <div style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '10px',
                          color: '#717171',
                          fontWeight: 400,
                        }}>
                          {(listing.hosts.join_date
                            ? Math.max(1, new Date().getFullYear() - new Date(listing.hosts.join_date).getFullYear())
                            : 1) === 1 ? 'Year' : 'Years'} hosting
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Host Info */}
                  <div style={{ flex: 1, paddingTop: '8px' }}>
                    {/* Host Description */}
                    {listing.hosts.description ? (
                      <p style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#222',
                        margin: 0,
                      }}>
                        {listing.hosts.description}
                      </p>
                    ) : (
                      <p style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#222',
                        margin: 0,
                      }}>
                        {listing.full_description || listing.short_description}
                      </p>
                    )}

                    {/* Host Badges */}
                    {hostBadges && hostBadges.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginTop: '24px',
                      }}>
                        {hostBadges.map((badge, idx) => (
                          <HostBadgePill key={idx} badge={badge} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Things to Know */}
            {thingsToKnow && (
              <div style={{ paddingTop: '48px', borderTop: '1px solid #EBEBEB', paddingBottom: '48px' }}>
                <h3 style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#222',
                  marginBottom: '24px',
                }}>
                  Things to know
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '24px',
                }}>
                  {/* House Rules */}
                  <div>
                    <h4 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#222',
                      marginBottom: '16px',
                    }}>
                      House rules
                    </h4>
                    {(thingsToKnow.house_rules || []).map((rule, idx) => {
                      const IconComponent = getThingsToKnowIcon(rule.icon);
                      return (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          marginBottom: '12px',
                        }}>
                          <IconComponent size={18} color="#222" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '14px',
                            color: '#222',
                            lineHeight: '20px',
                          }}>
                            {rule.rule}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Safety */}
                  <div>
                    <h4 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#222',
                      marginBottom: '16px',
                    }}>
                      Safety & property
                    </h4>
                    {(thingsToKnow.safety_and_property || []).map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px',
                      }}>
                        {item.available ? (
                          <CheckCircle size={18} color="#008A05" style={{ flexShrink: 0, marginTop: '2px' }} />
                        ) : (
                          <XCircle size={18} color="#C13515" style={{ flexShrink: 0, marginTop: '2px' }} />
                        )}
                        <div>
                          <span style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '14px',
                            color: '#222',
                            lineHeight: '20px',
                          }}>
                            {item.item}
                          </span>
                          {item.note && (
                            <div style={{
                              fontFamily: '"Figtree", sans-serif',
                              fontSize: '12px',
                              color: '#717171',
                              marginTop: '2px',
                            }}>
                              {item.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation */}
                  <div>
                    <h4 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#222',
                      marginBottom: '16px',
                    }}>
                      Cancellation policy
                    </h4>
                    <p style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '14px',
                      color: '#222',
                      lineHeight: '20px',
                      margin: 0,
                    }}>
                      {thingsToKnow.cancellation_highlight || listing.cancellation_policy || 'Free cancellation available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'sticky',
              top: '24px',
              padding: '24px',
              border: '1px solid #DDDDDD',
              borderRadius: '16px',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
            }}>
              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#222',
                }}>
                  ₿{btcBase}
                </span>
                <span style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '16px',
                  color: '#222',
                }}>
                  {' '}/ {selectedDuration.label}
                </span>
              </div>

              {/* Duration Selector */}
              <div ref={durationDropdownRef} style={{ marginBottom: '16px', position: 'relative' }}>
                <div
                  onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                  style={{
                    padding: '12px',
                    border: '1px solid #B0B0B0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#222',
                      textTransform: 'uppercase',
                    }}>
                      Duration
                    </div>
                    <div style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '14px',
                      color: '#222',
                    }}>
                      {selectedDuration.label}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {showDurationDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #DDDDDD',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    marginTop: '4px',
                  }}>
                    {DURATION_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSelectedDuration(option);
                          setShowDurationDropdown(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          backgroundColor: selectedDuration.value === option.value ? '#F7F7F7' : 'white',
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '14px',
                          color: '#222',
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Guest Selector */}
              <div ref={guestDropdownRef} style={{ marginBottom: '16px', position: 'relative' }}>
                <div
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  style={{
                    padding: '12px',
                    border: '1px solid #B0B0B0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#222',
                      textTransform: 'uppercase',
                    }}>
                      Guests
                    </div>
                    <div style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '14px',
                      color: '#222',
                    }}>
                      {guestCount} guest{guestCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {showGuestDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #DDDDDD',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    marginTop: '4px',
                    padding: '16px',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '14px',
                        color: '#222',
                      }}>
                        Guests
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          disabled={guestCount <= 1}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid #B0B0B0',
                            background: 'white',
                            cursor: guestCount <= 1 ? 'not-allowed' : 'pointer',
                            opacity: guestCount <= 1 ? 0.5 : 1,
                          }}
                        >
                          -
                        </button>
                        <span style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '16px',
                          color: '#222',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}>
                          {guestCount}
                        </span>
                        <button
                          onClick={() => setGuestCount(Math.min(listing.guest_capacity || 10, guestCount + 1))}
                          disabled={guestCount >= (listing.guest_capacity || 10)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid #B0B0B0',
                            background: 'white',
                            cursor: guestCount >= (listing.guest_capacity || 10) ? 'not-allowed' : 'pointer',
                            opacity: guestCount >= (listing.guest_capacity || 10) ? 0.5 : 1,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                disabled={isBooking}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #E61E4D 0%, #E31C5F 50%, #D70466 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isBooking ? 'not-allowed' : 'pointer',
                  fontFamily: '"Figtree", sans-serif',
                  marginBottom: '16px',
                  opacity: isBooking ? 0.7 : 1,
                }}
              >
                {isBooking ? 'Processing...' : 'Reserve'}
              </button>

              <p style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '14px',
                color: '#717171',
                textAlign: 'center',
                marginBottom: '24px',
              }}>
                You won't be charged yet
              </p>

              {/* Price Breakdown */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #DDDDDD',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '14px',
                    color: '#222',
                    textDecoration: 'underline',
                  }}>
                    ₿{(listing.price_per_night * btcRate).toFixed(6)} × {selectedDuration.label}
                  </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '14px',
                    color: '#222',
                  }}>
                    ₿{btcBase}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '14px',
                    color: '#222',
                    textDecoration: 'underline',
                  }}>
                    Temporal service fee
                  </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '14px',
                    color: '#222',
                  }}>
                    ₿{(serviceFee * btcRate).toFixed(6)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '14px',
                    color: '#222',
                    textDecoration: 'underline',
                  }}>
                    Timeline cleaning fee
                  </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '14px',
                    color: '#222',
                  }}>
                    ₿{(cleaningFee * btcRate).toFixed(6)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #DDDDDD',
                }}>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#222',
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#222',
                  }}>
                    ₿{btcTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </motion.div>
    </>
  );
}
