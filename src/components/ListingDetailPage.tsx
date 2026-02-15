import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchListingDetails } from '../lib/supabase-queries';
import { formatEraAppropriateDuration } from '../lib/era-time-measurements';
import type {
  ListingDetails,
  Amenity,
  HostBadge,
  ThingsToKnow,
  ReviewBadge,
} from '../types/database';

// Duration options for teleportation
const DURATION_OPTIONS = [
  { value: 4, label: '4 hours', multiplier: 1 },
  { value: 6, label: '6 hours', multiplier: 1.4 },
  { value: 12, label: '12 hours', multiplier: 2.5 },
  { value: 24, label: '24 hours', multiplier: 4 },
  { value: 48, label: '2 days', multiplier: 7 },
  { value: 72, label: '3 days', multiplier: 9 },
];

/**
 * Extracts the first name(s) from a full name.
 * Handles couple names (e.g., "Hans & Sophie Hoffmann" -> "Hans & Sophie")
 * and single names (e.g., "Neytiri te Tskaha Mo'at'ite" -> "Neytiri")
 */
function getFirstName(fullName: string): string {
  if (!fullName) return '';
  
  // If name contains "&", extract first names before the last name
  if (fullName.includes(' & ')) {
    const parts = fullName.split(' & ');
    const firstParts = parts.map(part => {
      const words = part.trim().split(/\s+/);
      return words[0]; // Get first word of each part
    });
    return firstParts.join(' & ');
  }
  
  // For single names, return the first word
  const words = fullName.trim().split(/\s+/);
  return words[0] || fullName;
}

import { Header, Button } from '../design-system';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PhotoViewer } from './PhotoViewer';
import { motion } from 'framer-motion';
import { HeroGridSkeleton } from './HeroGridSkeleton';
import { TransactionLoader } from './TransactionLoader';
import { Modal } from './Modal';
import { useDeviceType, useIsMobile } from '../hooks/use-mobile';
import { getAmenityIcon } from '../lib/amenity-icons';
import {
  Package,
  Users,
  Lamp,
  CheckCircle,
  User,
  Wine,
  GlassWater,
  Shirt,
  Footprints,
  ShieldCheck,
  BadgeCheck,
  Timer,
  MessageCircle,
  Info,
  Camera,
  Hand,
  Network,
  Sword,
  Rewind,
  VolumeX,
  Key,
  FileText,
  Share,
  Heart,
  Star,
  Clock,
  Sparkles,
  Shield,
  Ban,
  AlertTriangle,
  Leaf,
  Lock,
  Eye,
  Flame,
  Fish,
  Compass,
  Rocket,
  DoorOpen,
  Bed,
  type LucideIcon,
} from 'lucide-react';

const FIGMA_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

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

/** Format host join_date with era-appropriate time measurement (e.g., "624 full moons hosting", "112 Nile flood cycles hosting"). */
function formatHostingDuration(joinDate: string | null, listing: ListingDetails): string {
  const result = formatEraAppropriateDuration(joinDate, listing);
  return result.fullText;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [guestCount, setGuestCount] = useState(0);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const durationDropdownRef = useRef<HTMLDivElement>(null);
  const appliedInitialGuestCountRef = useRef(false);
  const isMobile = useIsMobile();

  // Pre-fill guest count from homepage when navigating with state
  useEffect(() => {
    if (listing && !appliedInitialGuestCountRef.current && typeof (location.state as { guestCount?: number })?.guestCount === 'number') {
      const initial = (location.state as { guestCount: number }).guestCount;
      const cap = listing.guest_capacity ?? 10;
      const val = Math.min(cap, Math.max(0, initial));
      setGuestCount(val);
      appliedInitialGuestCountRef.current = true;
    }
  }, [listing, location.state]);

  const loadListing = useCallback(async () => {
    if (!id) {
      setError('No listing ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImageLoadingStates({});
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
  }, [id]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

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

  const handleImageLoad = (imageKey: string) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  const isImageLoaded = (imageKey: string) => {
    return imageLoadingStates[imageKey] === true;
  };

  const handleReserve = () => {
    if (!listing || guestCount < 1) return;

    const baseFare = listing.price_per_night * selectedDuration.multiplier;
    const serviceFee = baseFare * (listing.service_fee_percent || 12) / 100;
    const cleaningFee = listing.cleaning_fee || 50;
    const occupancyTax = baseFare * (listing.occupancy_tax_percent || 8) / 100;
    const totalPrice = baseFare + serviceFee + cleaningFee + occupancyTax;

    navigate(`/listing/${listing.id}/confirm`, {
      state: {
        listing, // full listing so confirm page can render immediately without refetch
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

  // Filter out any images that duplicate the main image so we don't
  // show the cover photo twice in the hero grid or gallery.
  const galleryImages = listing
    ? listing.listing_images.filter((img) => img.image_url !== listing.main_image)
    : [];

  // Get all images for the photo viewer (just URLs), with the main image first
  // followed by the remaining unique gallery images.
  const allImages = listing
    ? [listing.main_image, ...galleryImages.map((img) => img.image_url)]
    : [];

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
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
        <div style={{ flex: 1, padding: '32px 24px 64px 24px' }}>
          <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}>
            {/* Title placeholder - same height as real title (lineHeight 40px + marginBottom 24px) so hero skeleton aligns */}
            <div style={{ height: 64, marginBottom: '24px' }} />
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
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" size="md" onClick={() => loadListing()}>
            Retry
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
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
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDivider
        />
        <div
          style={{
            flex: 1,
            padding: isMobile ? '24px 16px 48px 16px' : '32px 24px 64px 24px',
          }}
        >
        <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}>
        {/* Title with Share and Save buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}>
          <h1 style={{
            fontFamily: '"Figtree", sans-serif',
            fontSize: isMobile ? '26px' : '30px',
            fontWeight: 500,
            color: '#000000',
            lineHeight: isMobile ? '32px' : '40px',
            letterSpacing: '-0.6px',
            margin: 0,
            flex: 1,
            minWidth: 0,
          }}>
            {listing.title}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '16px' : '24px',
            flexShrink: 0,
          }}>
            {/* Share Button */}
            <button
              type="button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.borderRadius = '8px';
                e.currentTarget.style.padding = '4px 8px';
                e.currentTarget.style.margin = '-4px -8px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.padding = '0';
                e.currentTarget.style.margin = '0';
              }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: listing.title,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href).then(() => {
                    // Could show a toast notification here
                  });
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Figtree", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000',
                textDecoration: 'underline',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Share size={18} strokeWidth={1.5} style={{ color: '#000000' }} />
              <span>Share</span>
            </button>
            {/* Save Button */}
            <button
              type="button"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.borderRadius = '8px';
                e.currentTarget.style.padding = '4px 8px';
                e.currentTarget.style.margin = '-4px -8px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.padding = '0';
                e.currentTarget.style.margin = '0';
              }}
              onClick={() => {
                setIsSaved((prev) => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: '"Figtree", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: '#000000',
                textDecoration: 'underline',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                fill={isSaved ? 'var(--ds-accent)' : 'transparent'}
                stroke={isSaved ? 'var(--ds-accent)' : '#000000'}
                style={{
                  transition: 'fill 0.28s ease, stroke 0.28s ease',
                }}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Hero Image Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
          gridTemplateRows: isMobile ? 'auto' : '1fr 1fr',
          gap: '8px',
          height: isMobile ? 'auto' : '400px',
          marginBottom: '24px',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Main Image */}
          <div
            onClick={() => handleImageClick(0)}
            style={{
              gridRow: isMobile ? 'auto' : 'span 2',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {!isImageLoaded('main') && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                  borderRadius: isMobile ? '16px' : '16px 0 0 16px',
                  zIndex: 1,
                  margin: 0,
                  padding: 0,
                }}
              />
            )}
            <img
              src={listing.main_image}
              alt={listing.title}
              onLoad={() => handleImageLoad('main')}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                opacity: isImageLoaded('main') ? 1 : 0,
                zIndex: 2,
                margin: 0,
                padding: 0,
                display: 'block',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* Secondary Images (exclude main image to avoid duplication) */}
          {galleryImages.slice(0, 4).map((img, idx) => {
            const imageKey = `gallery-${idx}`;
            const isTopLeft = idx === 0;
            const isTopRight = idx === 1;
            const isBottomLeft = idx === 2;
            const isBottomRight = idx === 3;
            
            let borderRadius = '0';
            if (isMobile) {
              borderRadius = idx === 0 ? '16px 16px 0 0' : idx === galleryImages.slice(0, 4).length - 1 ? '0 0 16px 16px' : '0';
            } else {
              if (isTopRight) borderRadius = '0 16px 0 0';
              else if (isBottomRight) borderRadius = '0 0 16px 0';
            }

            return (
              <div
                key={img.id}
                onClick={() => handleImageClick(idx + 1)}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                {!isImageLoaded(imageKey) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #e5e7eb 0%, #d1d5db 50%, #e5e7eb 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s ease-in-out infinite',
                      borderRadius,
                      zIndex: 1,
                      margin: 0,
                      padding: 0,
                    }}
                  />
                )}
                <img
                  src={img.image_url}
                  alt={img.caption || `Image ${idx + 2}`}
                  onLoad={() => handleImageLoad(imageKey)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    opacity: isImageLoaded(imageKey) ? 1 : 0,
                    zIndex: 2,
                    margin: 0,
                    padding: 0,
                    display: 'block',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 370px',
          gap: isMobile ? '32px' : '80px',
          marginBottom: '32px',
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
                    {listing.overall_rating.toFixed(1)}
                  </span>
                  <span style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    color: '#222',
                  }}> · </span>
                  <span
                    style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      color: '#222',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
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
                      {formatHostingDuration(listing.hosts.join_date, listing)}
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
                      {idx === 0 && (
                        <DoorOpen size={24} color="#222" strokeWidth={1.5} />
                      )}
                      {idx === 1 && (
                        <Star size={24} color="#222" strokeWidth={1.5} />
                      )}
                      {idx === 2 && (
                        <Clock size={24} color="#222" strokeWidth={1.5} />
                      )}
                      {idx === 3 && (
                        <Shield size={24} color="#222" strokeWidth={1.5} />
                      )}
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
                width: '560px',
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: '85vh',
                overflow: 'auto',
                boxSizing: 'border-box',
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
          <Bed size={24} color="#222" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
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

            {/* Amenities — only show when at least one amenity has a dedicated icon */}
            {listing.amenities.some((a) => getAmenityIcon(a.name).isDedicated) && (
              <div style={{
                paddingBottom: '24px',
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
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '16px',
                }}>
                  {listing.amenities
                    .filter((amenity) => getAmenityIcon(amenity.name).isDedicated)
                    .slice(0, 10)
                    .map((amenity) => {
                      const { Icon: IconComponent } = getAmenityIcon(amenity.name);
                      return (
                        <div key={amenity.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}>
                          <IconComponent
                            size={24}
                            color="#222"
                            strokeWidth={1.5}
                            style={{ flexShrink: 0 }}
                          />
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
                {(listing.amenities.filter((a) => getAmenityIcon(a.name).isDedicated).length > 10) && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowAmenitiesModal(true)}
                    style={{ marginTop: '24px' }}
                  >
                    Show all {listing.amenities.filter((a) => getAmenityIcon(a.name).isDedicated).length} amenities
                  </Button>
                )}
              </div>
            )}

            {/* Amenities modal (all amenities) */}
            <Modal
              isOpen={showAmenitiesModal}
              onClose={() => setShowAmenitiesModal(false)}
            >
              <div style={{
                padding: '24px',
                width: '560px',
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: '85vh',
                overflow: 'auto',
                boxSizing: 'border-box',
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
                    onClick={() => setShowAmenitiesModal(false)}
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
                    What this place offers
                  </h2>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {listing.amenities
                    .filter((amenity) => getAmenityIcon(amenity.name).isDedicated)
                    .map((amenity, idx) => {
                    const { Icon: IconComponent } = getAmenityIcon(amenity.name);
                    return (
                      <div key={amenity.id}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          paddingTop: '16px',
                          paddingBottom: '16px',
                        }}>
                          <IconComponent
                            size={24}
                            color="#222"
                            strokeWidth={1.5}
                            style={{ flexShrink: 0 }}
                          />
                          <span style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '16px',
                            color: '#222',
                          }}>
                            {amenity.name}
                          </span>
                        </div>
                        {idx < listing.amenities.filter((a) => getAmenityIcon(a.name).isDedicated).length - 1 && (
                          <div style={{
                            height: '1px',
                            backgroundColor: '#EBEBEB',
                            width: '100%',
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Modal>

          </div>

          {/* Right Column - Booking Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: isMobile ? 'static' : 'sticky',
              top: isMobile ? undefined : '125px',
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
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setGuestCount(Math.max(0, guestCount - 1)); }}
                          disabled={guestCount <= 0}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            border: '1px solid #B0B0B0',
                            background: 'white',
                            cursor: guestCount <= 0 ? 'not-allowed' : 'pointer',
                            opacity: guestCount <= 0 ? 0.5 : 1,
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
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setGuestCount(Math.min(listing.guest_capacity || 10, guestCount + 1)); }}
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
                disabled={isBooking || guestCount < 1}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #E61E4D 0%, #E31C5F 50%, #D70466 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
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
                margin: 0,
              }}>
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>

        {/* Full-width divider between grid and lower sections */}
        <div style={{ width: '100%', borderTop: '1px solid #EBEBEB' }} />

        {/* Full-width sections: Reviews, Meet your host, Things to know */}
        <div style={{ width: '100%' }}>
            {/* Reviews Section */}
            {listing.reviews.length > 0 && (
              <div id="reviews-section" style={{
                paddingTop: '24px',
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

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: '40px',
                }}>
                  {listing.reviews.slice(0, showAllReviews ? undefined : 6).map((review) => (
                    <div key={review.id}>
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

                      <p style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#222',
                        margin: 0,
                      }}>
                        {review.comment}
                      </p>

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
                  gap: '32px',
                  alignItems: 'flex-start',
                  flexDirection: isMobile ? 'column' : 'row',
                }}>
                  <div style={{
                  width: isMobile ? '100%' : '400px',
                  flexShrink: 0,
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'stretch',
                }}>
                    {/* Left: avatar, name, Host — column width sized so 24px card padding gives equal space left/right of avatar */}
                    <div style={{
                      width: '218px',
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}>
                      <div style={{
                        width: '96px',
                        height: '96px',
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
                            fontSize: '32px',
                            fontWeight: 600,
                          }}>
                            {listing.hosts.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <h3 style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '22px',
                        fontWeight: 600,
                        color: '#222',
                        marginBottom: '4px',
                        lineHeight: '28px',
                      }}>
                        {getFirstName(listing.hosts.name)}
                      </h3>
                      <span style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '14px',
                        color: '#717171',
                        fontWeight: 400,
                      }}>
                        Host
                      </span>
                    </div>

                    {/* Right: Reviews, Rating, Years hosting (stacked, with dividers) */}
                    <div style={{
                      width: '134px',
                      flexShrink: 0,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                      <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        paddingLeft: '24px',
                        paddingRight: '0',
                        paddingTop: '12px',
                      }}>
                        <div style={{
                          paddingBottom: '12px',
                        }}>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#222',
                          }}>
                            {listing.hosts.total_reviews ?? 0}
                          </div>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '12px',
                            color: '#717171',
                            fontWeight: 400,
                          }}>
                            Reviews
                          </div>
                        </div>
                        <div style={{
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderTop: '1px solid #EBEBEB',
                        }}>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#222',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            {listing.overall_rating?.toFixed(2) ?? '—'}
                            <Star size={14} fill="#222" color="#222" />
                          </div>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '12px',
                            color: '#717171',
                            fontWeight: 400,
                          }}>
                            Rating
                          </div>
                        </div>
                        <div style={{
                          paddingTop: '12px',
                          paddingBottom: '12px',
                          borderTop: '1px solid #EBEBEB',
                        }}>
                          {(() => {
                            const duration = formatEraAppropriateDuration(listing.hosts.join_date, listing);
                            return (
                              <>
                                <div style={{
                                  fontFamily: '"Figtree", sans-serif',
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: '#222',
                                }}>
                                  {duration.count}
                                </div>
                                <div style={{
                                  fontFamily: '"Figtree", sans-serif',
                                  fontSize: '12px',
                                  color: '#717171',
                                  fontWeight: 400,
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                  lineHeight: 1.4,
                                }}>
                                  {duration.text}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1, paddingTop: '8px' }}>
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
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
                  gap: '24px',
                }}>
                  <div>
                    <h4 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#222',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Key size={18} color="#222" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      House rules
                    </h4>
                    {(thingsToKnow.house_rules || []).map((rule, idx) => (
                      <div key={idx} style={{
                        marginBottom: '2px',
                      }}>
                        <span style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '14px',
                          color: 'var(--ds-text-secondary)',
                          lineHeight: '20px',
                        }}>
                          {typeof rule === 'object' && rule !== null && 'rule' in rule ? rule.rule : String(rule)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#222',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <Shield size={18} color="#222" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      Safety
                    </h4>
                    {(thingsToKnow.safety_and_property || []).map((item, idx) => (
                      <div key={idx} style={{
                        marginBottom: '2px',
                      }}>
                        <span style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '14px',
                          color: 'var(--ds-text-secondary)',
                          lineHeight: '20px',
                        }}>
                          {item.item}
                        </span>
                        {item.note && (
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '12px',
                            color: 'var(--ds-text-secondary)',
                            marginTop: '2px',
                          }}>
                            {item.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: '#222',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <FileText size={18} color="#222" strokeWidth={1.5} style={{ flexShrink: 0 }} />
                      Cancellation Policy
                    </h4>
                    <p style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '14px',
                      color: 'var(--ds-text-secondary)',
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
        </div>
        </div>
      </motion.div>
    </>
  );
}
