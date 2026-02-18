import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchListingDetails } from '../lib/supabase-queries';
import { formatEraAppropriateDuration } from '../lib/era-time-measurements';
import type {
  ListingDetails,
  Amenity,
  ThingsToKnow,
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
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { HeroGridSkeleton } from './HeroGridSkeleton';
import { TransactionLoader } from './TransactionLoader';
import { Modal } from './Modal';
import { useDeviceType } from '../hooks/use-mobile';
import { getAmenityIcon } from '../lib/amenity-icons';
import {
  Package,
  Users,
  Lamp,
  CheckCircle,
  Check,
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
  Mail,
  Link2,
  Linkedin,
  Twitter,
  Code2,
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

export function ListingDetailPage({ hideHeader = false }: { hideHeader?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [guestCount, setGuestCount] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<string, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [photoViewerLayoutId, setPhotoViewerLayoutId] = useState<string | undefined>(undefined);
  const [hoveredHeroImageKey, setHoveredHeroImageKey] = useState<string | null>(null);
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [guestCountPulseTick, setGuestCountPulseTick] = useState(0);
  const [guestLimitNudgeTick, setGuestLimitNudgeTick] = useState(0);
  const [isBookingCardStuck, setIsBookingCardStuck] = useState(false);
  const [hasEnteredBookingCard, setHasEnteredBookingCard] = useState(false);
  const [visibleReviewCount, setVisibleReviewCount] = useState(6);
  const [isHostCardHovered, setIsHostCardHovered] = useState(false);
  const [hostCardTilt, setHostCardTilt] = useState({ x: 0, y: 0 });
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const durationDropdownRef = useRef<HTMLDivElement>(null);
  const bookingCardRef = useRef<HTMLDivElement>(null);
  const appliedInitialGuestCountRef = useRef(false);
  const { isMobile, isTablet } = useDeviceType();
  const isCompactLayout = isMobile || isTablet;
  const shouldReduceMotion = useReducedMotion();
  const shouldPlayGenieEntry =
    Boolean((location.state as { fromGenieTransition?: boolean } | null)?.fromGenieTransition) &&
    !shouldReduceMotion;

  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;

  // Pre-fill guest count from homepage when navigating with state
  useEffect(() => {
    if (listing && !appliedInitialGuestCountRef.current && typeof (location.state as { guestCount?: number })?.guestCount === 'number') {
      const initial = (location.state as { guestCount: number }).guestCount;
      const cap = listing.guest_capacity ?? 10;
      const val = Math.min(cap, Math.max(1, initial));
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

  useEffect(() => {
    setVisibleReviewCount(6);
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

  useEffect(() => {
    if (isCompactLayout) {
      setIsBookingCardStuck(false);
      return;
    }
    const STICKY_TOP = 125;
    const handleScroll = () => {
      const card = bookingCardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const stuck = rect.top <= STICKY_TOP + 1;
      setIsBookingCardStuck(stuck);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCompactLayout]);

  const handleImageClick = (index: number, layoutId?: string) => {
    setPhotoViewerIndex(index);
    setPhotoViewerLayoutId(layoutId);
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

  const showTemporaryShareFeedback = useCallback((label: string) => {
    setShareFeedback(label);
    window.setTimeout(() => setShareFeedback(null), 1400);
  }, []);

  const getShareUrl = useCallback(() => window.location.href, []);

  const copyToClipboard = useCallback(async (text: string, feedbackLabel: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showTemporaryShareFeedback(feedbackLabel);
    } catch {
      showTemporaryShareFeedback('Could not copy');
    }
  }, [showTemporaryShareFeedback]);

  const openShareWindow = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const changeGuestCount = useCallback((delta: number) => {
    const minGuests = 1;
    const maxGuests = listing?.guest_capacity || 10;
    const nextCount = guestCount + delta;
    if (nextCount < minGuests || nextCount > maxGuests) {
      setGuestLimitNudgeTick((prev) => prev + 1);
      return;
    }
    setGuestCount(nextCount);
    setGuestCountPulseTick((prev) => prev + 1);
  }, [guestCount, listing]);

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
  const reviewCount = listing?.reviews.length ?? 0;
  const hasMoreReviews = reviewCount > visibleReviewCount;
  const reviewsToRender = listing?.reviews.slice(0, visibleReviewCount) ?? [];

  const revealMoreReviews = useCallback(() => {
    setVisibleReviewCount((prev) => Math.min(prev + 6, reviewCount));
  }, [reviewCount]);

  useEffect(() => {
    if (loading || error || !listing) return;
    const frame = requestAnimationFrame(() => setHasEnteredBookingCard(true));
    return () => cancelAnimationFrame(frame);
  }, [loading, error, listing]);

  const sectionContainerVariants = shouldReduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.06,
        },
      },
    };

  const sectionItemVariants = shouldReduceMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
      hidden: { opacity: 0, y: 14 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
      },
    };

  const dropdownTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  if (loading) {
    return (
      <div style={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {!hideHeader && (
            <Header
              brandName="warpbnb"
              navItems={FIGMA_NAV_ITEMS}
              activeNavLabel="Time Travel"
              onNavClick={() => {}}
              onLogoClick={() => navigate('/')}
              rightSlot={<HeaderRightSlotWithUserMenu />}
              showDivider
            />
          )}
          <div style={{ flex: 1, padding: '32px 24px 64px 24px' }}>
            <div style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}>
              {/* Title row placeholder: mirrors the real title/action row footprint so hero Y-position matches loaded state */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                  gap: '16px',
                  flexWrap: isCompactLayout ? 'wrap' : 'nowrap',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: isCompactLayout ? 32 : 40,
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isCompactLayout ? '16px' : '24px',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ width: 56, height: 18 }} />
                  <div style={{ width: 56, height: 18 }} />
                </div>
              </div>
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
  const shareUrl = getShareUrl();
  const shareTitle = listing.title;
  const enableArea51Spotlight = /classified barracks, area 51|area 51 classified barracks/i.test(listing.title);
  const shareSummary = `${listing.property_type ?? 'Stay'} · ★${listing.overall_rating?.toFixed(2) ?? '—'} · ${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? 's' : ''} · ${listing.beds} bed${listing.beds !== 1 ? 's' : ''} · ${listing.baths} bath${listing.baths !== 1 ? 's' : ''}`;
  const shareWarmIntro = `Check out this place I found on WarpBnB: ${shareTitle}`;

  const handleShareOption = (optionId: 'copy' | 'email' | 'messages' | 'linkedin' | 'twitter' | 'embed') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedWarmIntro = encodeURIComponent(shareWarmIntro);
    const encodedBody = encodeURIComponent(`${shareWarmIntro}\n${shareUrl}`);

    switch (optionId) {
      case 'copy':
        copyToClipboard(shareUrl, 'Link copied');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodedWarmIntro}&body=${encodedBody}`;
        break;
      case 'messages':
        window.location.href = `sms:&body=${encodedBody}`;
        break;
      case 'linkedin':
        openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedBody}`);
        break;
      case 'twitter':
        openShareWindow(`https://twitter.com/intent/tweet?text=${encodedWarmIntro}&url=${encodedUrl}`);
        break;
      case 'embed': {
        const embedCode = `<iframe src="${shareUrl}" width="640" height="420" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        copyToClipboard(embedCode, 'Embed code copied');
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      {/* Transaction Loader */}
      {isBooking && <TransactionLoader />}

      {/* Photo Viewer Modal */}
      {showPhotoViewer && (
        <PhotoViewer
          images={allImages}
          initialIndex={photoViewerIndex}
          layoutId={photoViewerLayoutId}
          enableSpotlight={enableArea51Spotlight}
          onShareClick={() => {
            setShowPhotoViewer(false);
            window.setTimeout(() => setShowShareModal(true), 0);
          }}
          onClose={() => setShowPhotoViewer(false)}
        />
      )}

      <motion.div
        initial={shouldPlayGenieEntry ? { opacity: 0.94 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldPlayGenieEntry ? 0.24 : 0.3 }}
        style={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!hideHeader && (
          <Header
            brandName="warpbnb"
            navItems={FIGMA_NAV_ITEMS}
            activeNavLabel="Time Travel"
            onNavClick={() => {}}
            onLogoClick={() => navigate('/')}
            rightSlot={<HeaderRightSlotWithUserMenu />}
            showDivider
          />
        )}
        <div
          style={{
            flex: 1,
            padding: isMobile
              ? '24px 16px 120px 16px'
              : isTablet
                ? '28px 20px 64px 20px'
                : '32px 24px 64px 24px',
          }}
        >
        <motion.div
          initial={shouldPlayGenieEntry ? { y: 24, opacity: 0 } : { y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={shouldPlayGenieEntry ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
        >
        <motion.div
          style={{ maxWidth: 1120, width: '100%', margin: '0 auto' }}
          variants={sectionContainerVariants}
          initial="hidden"
          animate="visible"
        >
        {/* Title with Share and Save buttons */}
        <motion.div
          variants={sectionItemVariants}
          style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          gap: '16px',
          flexWrap: isCompactLayout ? 'wrap' : 'nowrap',
        }}
        >
          <h1 style={{
            fontFamily: '"Figtree", sans-serif',
            fontSize: isMobile ? '26px' : isTablet ? '28px' : '30px',
            fontWeight: 500,
            color: '#000000',
            lineHeight: isMobile ? '32px' : isTablet ? '36px' : '40px',
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
            gap: isCompactLayout ? '16px' : '24px',
            flexShrink: 0,
          }}>
            {/* Share Button */}
            <button
              type="button"
              onMouseEnter={() => setIsShareHovered(true)}
              onMouseLeave={() => setIsShareHovered(false)}
              onClick={() => setShowShareModal(true)}
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
                transition: 'background-color 0.2s ease, transform 0.1s ease',
                backgroundColor: isShareHovered ? '#f0f0f0' : 'transparent',
                borderRadius: '8px',
                padding: '4px 8px',
                margin: '-4px -8px',
              }}
            >
              <Share size={18} strokeWidth={1.5} style={{ color: '#000000' }} />
              <span>Share</span>
            </button>
            {/* Save Button */}
            <button
              type="button"
              onMouseEnter={() => setIsSaveHovered(true)}
              onMouseLeave={() => setIsSaveHovered(false)}
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
                transition: 'background-color 0.2s ease, transform 0.1s ease',
                backgroundColor: isSaveHovered ? '#f0f0f0' : 'transparent',
                borderRadius: '8px',
                padding: '4px 8px',
                margin: '-4px -8px',
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
        </motion.div>

        {/* Hero Image Grid */}
        <motion.div
          variants={sectionItemVariants}
          style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
          gridTemplateRows: isMobile ? 'auto' : '1fr 1fr',
          gap: '8px',
          height: isMobile ? 'auto' : isTablet ? '340px' : '400px',
          marginBottom: '24px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}
        >
          {/* Main Image */}
          <div
            onClick={() => handleImageClick(0, `listing-hero-image-0`)}
            onMouseEnter={() => setHoveredHeroImageKey('main')}
            onMouseLeave={() => setHoveredHeroImageKey((prev) => (prev === 'main' ? null : prev))}
            style={{
              gridRow: isMobile ? 'auto' : 'span 2',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
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
                opacity: isImageLoaded('main') ? 0 : 1,
                transition: 'opacity 0.38s ease',
                pointerEvents: 'none',
              }}
            />
            <motion.img
              layoutId="listing-hero-image-0"
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
                transition: 'transform 0.3s ease, opacity 0.38s ease, filter 0.38s ease',
                opacity: isImageLoaded('main') ? 1 : 0,
                filter: isImageLoaded('main') ? 'blur(0px)' : 'blur(8px)',
                zIndex: 2,
                margin: 0,
                padding: 0,
                display: 'block',
                transform: hoveredHeroImageKey === 'main' ? 'scale(1.04)' : 'scale(1)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.12)',
                opacity: hoveredHeroImageKey === 'main' ? 1 : 0,
                transition: 'opacity 0.22s ease',
                pointerEvents: 'none',
                zIndex: 3,
              }}
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
                onClick={() => handleImageClick(idx + 1, `listing-hero-image-${idx + 1}`)}
                onMouseEnter={() => setHoveredHeroImageKey(imageKey)}
                onMouseLeave={() => setHoveredHeroImageKey((prev) => (prev === imageKey ? null : prev))}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
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
                    opacity: isImageLoaded(imageKey) ? 0 : 1,
                    transition: 'opacity 0.38s ease',
                    pointerEvents: 'none',
                  }}
                />
                <motion.img
                  layoutId={`listing-hero-image-${idx + 1}`}
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
                    transition: 'transform 0.3s ease, opacity 0.38s ease, filter 0.38s ease',
                    opacity: isImageLoaded(imageKey) ? 1 : 0,
                    filter: isImageLoaded(imageKey) ? 'blur(0px)' : 'blur(8px)',
                    zIndex: 2,
                    margin: 0,
                    padding: 0,
                    display: 'block',
                    transform: hoveredHeroImageKey === imageKey ? 'scale(1.04)' : 'scale(1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.12)',
                    opacity: hoveredHeroImageKey === imageKey ? 1 : 0,
                    transition: 'opacity 0.22s ease',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => handleImageClick(0, 'listing-hero-image-0')}
            style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              zIndex: 4,
              border: '1px solid #DDDDDD',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 10,
              padding: '10px 14px',
              fontFamily: '"Figtree", sans-serif',
              fontSize: 14,
              fontWeight: 500,
              color: '#222',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
          >
            Show all photos
          </button>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={sectionItemVariants}
          style={{
          display: 'grid',
          gridTemplateColumns: isCompactLayout ? '1fr' : '1fr 370px',
          gap: isMobile ? '32px' : isTablet ? '40px' : '80px',
          marginBottom: '32px',
        }}
        >
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
              <motion.div
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
                  },
                }}
                style={{
                padding: '24px',
                width: '720px',
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: '85vh',
                overflow: 'auto',
                boxSizing: 'border-box',
              }}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                  }}
                  style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <motion.button
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
                  </motion.button>
                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                    }}
                    style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#222',
                    margin: 0,
                    lineHeight: 1.25,
                    textAlign: 'left',
                  }}>
                    About this space
                  </motion.h2>
                </motion.div>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.24 } },
                  }}
                  style={{
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#222',
                  whiteSpace: 'pre-line',
                  margin: 0,
                }}>
                  {listing.full_description || listing.short_description}
                </motion.p>
              </motion.div>
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
                  gridTemplateColumns: isCompactLayout ? '1fr' : '1fr 1fr',
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
              <motion.div
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
                  },
                }}
                style={{
                padding: '24px',
                width: '720px',
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: '85vh',
                overflow: 'auto',
                boxSizing: 'border-box',
              }}>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                  }}
                  style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <motion.button
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
                  </motion.button>
                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                    }}
                    style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#222',
                    margin: 0,
                    lineHeight: 1.25,
                    textAlign: 'left',
                  }}>
                    What this place offers
                  </motion.h2>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                  }}
                  style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {listing.amenities
                    .filter((amenity) => getAmenityIcon(amenity.name).isDedicated)
                    .map((amenity, idx) => {
                    const { Icon: IconComponent } = getAmenityIcon(amenity.name);
                    return (
                      <motion.div
                        key={amenity.id}
                        variants={{
                          hidden: { opacity: 0, y: 6 },
                          visible: { opacity: 1, y: 0, transition: { duration: 0.18 } },
                        }}
                      >
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
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </Modal>

            {/* Share modal */}
            <Modal
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
            >
              <motion.div
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.04, delayChildren: 0.02 },
                  },
                }}
                style={{
                  padding: '24px',
                  width: '760px',
                  maxWidth: 'calc(100vw - 48px)',
                  maxHeight: '85vh',
                  overflow: 'auto',
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: '"Figtree", sans-serif',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: '#222',
                      margin: 0,
                      lineHeight: 1.25,
                      textAlign: 'left',
                    }}
                  >
                    Share this place
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    aria-label="Close"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      lineHeight: 1,
                      color: '#222',
                      marginTop: '2px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginBottom: '22px',
                  }}
                >
                  <img
                    src={listing.main_image}
                    alt={listing.title}
                    style={{
                      width: 86,
                      height: 86,
                      borderRadius: 14,
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '18px',
                        fontWeight: 500,
                        color: '#222',
                        lineHeight: '24px',
                        marginBottom: '4px',
                      }}
                    >
                      {shareTitle}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '15px',
                        color: '#4b4b4b',
                        lineHeight: '21px',
                      }}
                    >
                      {shareSummary}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.24 } },
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isCompactLayout ? '1fr' : '1fr 1fr',
                    gap: '14px',
                  }}
                >
                  {[
                    { id: 'copy' as const, label: 'Copy link', Icon: Link2 },
                    { id: 'email' as const, label: 'Email', Icon: Mail },
                    { id: 'messages' as const, label: 'Messages', Icon: MessageCircle },
                    { id: 'linkedin' as const, label: 'LinkedIn', Icon: Linkedin },
                    { id: 'twitter' as const, label: 'Twitter', Icon: Twitter },
                    { id: 'embed' as const, label: 'Embed', Icon: Code2 },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.12 }}
                      onClick={() => handleShareOption(item.id)}
                      style={{
                        width: '100%',
                        border: '1px solid #d5d5d5',
                        borderRadius: '18px',
                        background: '#fff',
                        minHeight: '74px',
                        padding: '0 22px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: '"Figtree", sans-serif',
                        fontSize: '18px',
                        fontWeight: 500,
                        color: '#222',
                      }}
                    >
                      <item.Icon size={24} strokeWidth={1.9} />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </motion.div>

                <AnimatePresence>
                  {shareFeedback && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '20px',
                        transform: 'translateX(-50%)',
                        zIndex: 5,
                        pointerEvents: 'none',
                      }}
                    >
                      <motion.div
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '11px 20px',
                          borderRadius: '20px',
                          border: '1px solid #E6E6E6',
                          background: '#FFFFFF',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '14px',
                          color: '#222',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '999px',
                            backgroundColor: '#16A34A',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={14} color="#FFFFFF" strokeWidth={3} />
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.1 }}>
                          {shareFeedback}
                        </span>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Modal>

          </div>

          {/* Right Column - Booking Card */}
          <div style={{ position: 'relative' }}>
            <motion.div
              ref={bookingCardRef}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.985 }}
              animate={hasEnteredBookingCard
                ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  boxShadow: isBookingCardStuck
                    ? '0px 12px 28px rgba(0, 0, 0, 0.18)'
                    : '0px 6px 20px rgba(0, 0, 0, 0.2)',
                  borderColor: isBookingCardStuck ? '#cfcfcf' : '#DDDDDD',
                }
                : { opacity: 1, y: 0, scale: 1 }
              }
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{
              position: isCompactLayout ? 'static' : 'sticky',
              top: isCompactLayout ? undefined : '125px',
              padding: '24px',
              border: '1px solid #DDDDDD',
              borderRadius: '16px',
              boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.2)',
              backgroundColor: isBookingCardStuck ? '#FFFFFF' : 'transparent',
            }}
            >
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
                    border: showDurationDropdown ? '1px solid #222' : '1px solid #B0B0B0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: showDurationDropdown ? '0 0 0 3px rgba(34,34,34,0.08)' : 'none',
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
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    animate={{ rotate: showDurationDropdown ? 180 : 0 }}
                    transition={dropdownTransition}
                  >
                    <path d="M4 6L8 10L12 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                </div>

                <AnimatePresence>
                  {showDurationDropdown && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                    transition={dropdownTransition}
                    style={{
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
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Guest Selector */}
              <div ref={guestDropdownRef} style={{ marginBottom: '16px', position: 'relative' }}>
                <div
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  style={{
                    padding: '12px',
                    border: showGuestDropdown ? '1px solid #222' : '1px solid #B0B0B0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                    boxShadow: showGuestDropdown ? '0 0 0 3px rgba(34,34,34,0.08)' : 'none',
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
                  <motion.svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    animate={{ rotate: showGuestDropdown ? 180 : 0 }}
                    transition={dropdownTransition}
                  >
                    <path d="M4 6L8 10L12 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </motion.svg>
                </div>

                <AnimatePresence>
                  {showGuestDropdown && (
                  <motion.div
                    key={`guest-dropdown-${guestLimitNudgeTick}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      x: guestLimitNudgeTick > 0 ? [0, -3, 3, -2, 0] : 0,
                    }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                    transition={dropdownTransition}
                    style={{
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
                          onClick={(e) => { e.stopPropagation(); changeGuestCount(-1); }}
                          aria-disabled={guestCount <= 1}
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
                        <motion.span
                          key={`guest-count-${guestCountPulseTick}`}
                          animate={shouldReduceMotion ? undefined : { scale: [1, 1.14, 1] }}
                          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                          style={{
                          fontFamily: '"Figtree", sans-serif',
                          fontSize: '16px',
                          color: '#222',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}>
                          {guestCount}
                        </motion.span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); changeGuestCount(1); }}
                          aria-disabled={guestCount >= (listing.guest_capacity || 10)}
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
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Reserve Button */}
              <motion.button
                onClick={handleReserve}
                disabled={isBooking || guestCount < 1}
                whileHover={isBooking ? undefined : { scale: 1.01, filter: 'brightness(1.03)' }}
                whileTap={isBooking ? undefined : { scale: 0.98 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.14 }}
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
                  transition: 'transform 0.12s ease, filter 0.2s ease, opacity 0.2s ease',
                }}
              >
                {isBooking ? 'Processing...' : 'Reserve'}
              </motion.button>

              <p style={{
                fontFamily: '"Figtree", sans-serif',
                fontSize: '14px',
                color: '#717171',
                textAlign: 'center',
                margin: 0,
              }}>
                You won't be charged yet
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Full-width divider between grid and lower sections */}
        <motion.div variants={sectionItemVariants} style={{ width: '100%', borderTop: '1px solid #EBEBEB' }} />

        {/* Full-width sections: Reviews, Meet your host, Things to know */}
        <motion.div variants={sectionItemVariants} style={{ width: '100%' }}>
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
                  gridTemplateColumns: isCompactLayout ? '1fr' : '1fr 1fr',
                  columnGap: isCompactLayout ? '0' : '28px',
                  rowGap: '28px',
                }}>
                  <AnimatePresence initial={false}>
                  {reviewsToRender.map((review, idx) => (
                    <motion.div
                      key={review.id}
                      layout
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        borderTop: idx >= 2 || isCompactLayout ? '1px solid #F1F1F1' : 'none',
                        paddingTop: idx >= 2 || isCompactLayout ? '18px' : 0,
                      }}
                    >
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
                            fontSize: '13px',
                            color: '#8A8A8A',
                            letterSpacing: '-0.01em',
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
                        lineHeight: '24px',
                        color: '#222',
                        margin: 0,
                        maxWidth: '56ch',
                      }}>
                        {review.comment}
                      </p>

                      {review.response_to_reviewer && review.response_comment && (
                        <div style={{
                          marginTop: '14px',
                          padding: '12px 14px',
                          backgroundColor: '#FAFAFA',
                          borderRadius: '10px',
                          borderLeft: '3px solid #FF385C',
                        }}>
                          <div style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#717171',
                            marginBottom: '6px',
                          }}>
                            Response to {review.response_to_reviewer}:
                          </div>
                          <p style={{
                            fontFamily: '"Figtree", sans-serif',
                            fontSize: '14px',
                            lineHeight: '21px',
                            color: '#222',
                            margin: 0,
                            fontStyle: 'italic',
                          }}>
                            {review.response_comment}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>

                {hasMoreReviews && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={revealMoreReviews}
                    style={{ marginTop: '24px' }}
                  >
                    Show more reviews ({reviewsToRender.length}/{listing.reviews.length})
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
                  flexDirection: isCompactLayout ? 'column' : 'row',
                }}>
                  <motion.div
                  onHoverStart={() => setIsHostCardHovered(true)}
                  onHoverEnd={() => {
                    setIsHostCardHovered(false);
                    setHostCardTilt({ x: 0, y: 0 });
                  }}
                  onMouseMove={(e) => {
                    if (isCompactLayout || shouldReduceMotion || !supportsHover) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const dx = (e.clientX - rect.left - cx) / cx;
                    const dy = (e.clientY - rect.top - cy) / cy;
                    setHostCardTilt({ x: -dy * 4, y: dx * 5 });
                  }}
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                  width: isCompactLayout ? '100%' : '400px',
                  flexShrink: 0,
                  padding: '24px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: isCompactLayout ? 'column' : 'row',
                  alignItems: 'stretch',
                  transform: isCompactLayout || shouldReduceMotion || !supportsHover
                    ? undefined
                    : `perspective(900px) rotateX(${hostCardTilt.x}deg) rotateY(${hostCardTilt.y}deg) translateZ(0)`,
                  willChange: isCompactLayout || shouldReduceMotion || !supportsHover ? undefined : 'transform',
                }}>
                    {/* Left: avatar, name, Host — column width sized so 24px card padding gives equal space left/right of avatar */}
                    <div style={{
                      width: isCompactLayout ? '100%' : '218px',
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
                      width: isCompactLayout ? '100%' : '134px',
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
                        paddingLeft: isCompactLayout ? '0' : '24px',
                        paddingRight: '0',
                        paddingTop: isCompactLayout ? '16px' : '12px',
                        borderTop: isCompactLayout ? '1px solid #EBEBEB' : 'none',
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
                  </motion.div>

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
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
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
                      <Key size={18} color="#222" strokeWidth={2} style={{ flexShrink: 0 }} />
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
                      <Shield size={18} color="#222" strokeWidth={2} style={{ flexShrink: 0 }} />
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
                      <FileText size={18} color="#222" strokeWidth={2} style={{ flexShrink: 0 }} />
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
        </motion.div>
        {isMobile && (
          <motion.div
            initial={shouldReduceMotion ? false : { y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid #EBEBEB',
              padding: '10px 16px calc(10px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div
              style={{
                maxWidth: 1120,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#222',
                  }}
                >
                  ₿{btcBase}
                  <span style={{ fontWeight: 400 }}> / {selectedDuration.label}</span>
                </div>
                <div
                  style={{
                    fontFamily: '"Figtree", sans-serif',
                    fontSize: '12px',
                    color: '#717171',
                  }}
                >
                  {guestCount} guest{guestCount !== 1 ? 's' : ''} · You won't be charged yet
                </div>
              </div>
              <motion.button
                onClick={handleReserve}
                disabled={isBooking || guestCount < 1}
                whileTap={isBooking ? undefined : { scale: 0.98 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.12 }}
                style={{
                  border: 'none',
                  borderRadius: 9999,
                  padding: '12px 20px',
                  background: 'linear-gradient(90deg, #E61E4D 0%, #E31C5F 50%, #D70466 100%)',
                  color: '#fff',
                  fontFamily: '"Figtree", sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: isBooking ? 'not-allowed' : 'pointer',
                  opacity: isBooking ? 0.7 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {isBooking ? 'Processing...' : 'Reserve'}
              </motion.button>
            </div>
          </motion.div>
        )}
        </motion.div>
        </motion.div>
        </div>
      </motion.div>
    </>
  );
}
