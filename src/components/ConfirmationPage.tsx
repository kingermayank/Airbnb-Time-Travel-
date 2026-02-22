import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchListingDetails, createBooking } from '../lib/supabase-queries';
import type { ListingDetails } from '../types/database';
import { Button, IconButton, Text, Divider, Footer } from '../design-system';
import { BookingConfirmation } from './BookingConfirmation';
import ParticleEffectButton from 'react-particle-effect-button';
import { DEFAULT_PARTICLE_TWEAK } from './ConfirmWarpParticleButton';
import { getConfirmationBackgroundColor } from '../lib/warp-loading-messages';
import { playSound } from '../lib/sound-effects';
import { useDeviceType } from '../hooks/use-mobile';
import { Modal } from './Modal';
import { ChevronLeft, Minus, Plus, X, Link2, Mail, MessageCircle, Linkedin, Twitter, Code2 } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useSetHideHeader } from '../contexts/HideHeaderContext';

// Teleportation method options – video only from public/images/vehicles/ (paused on first frame by default; play once at 2x on select)
const TELEPORTATION_METHODS = [
  {
    id: 'delorean',
    name: 'Back to the Future DeLorean',
    description: 'Hit 88 miles per hour and break the space-time continuum, just like Marty and Doc Brown. Roads required. Lightning optional.',
    icon: '/images/vehicles/delorean.png',
    video: '/images/vehicles/delorean.mp4'
  },
  {
    id: 'tardis',
    name: 'TARDIS Unit',
    description: 'Bigger on the inside. Interdimensional police box piloted across space and time by The Doctor. Expect surprising landings and British charm.',
    icon: '/images/vehicles/tardis.png',
    video: '/images/vehicles/tardis.mp4'
  },
  {
    id: 'time-stone',
    name: 'Doctor Strange\'s Time Stone',
    description: 'Manipulate time itself using the Eye of Agamotto. Loop, rewind, or fast-forward to your destination with sorcerer-level precision.',
    icon: '/images/vehicles/timestone.png',
    video: '/images/vehicles/timestone.mp4'
  }
];

// Payment method options – images from public/images/coins/ (PNG filenames as in folder)
const PAYMENT_METHODS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    address: 'bc1qk8f...ghjkl',
    icon: '/images/coins/10%20Bitcoin.png',
    symbol: '₿',
    iconSize: 32
  },
  {
    id: 'ethereum-classic',
    name: 'Ethereum Classic',
    address: '0x742d...f44e',
    icon: '/images/coins/24%20Ethereum%20Classic.png',
    symbol: 'Ξ',
    iconSize: 32
  },
  {
    id: 'usdc',
    name: 'USDC',
    address: '0xAbc1...789F',
    icon: '/images/coins/12%20USDC.png',
    symbol: '$',
    iconSize: 32
  },
  {
    id: 'stellar',
    name: 'Stellar',
    address: 'GDRK...xYz9',
    icon: '/images/coins/7%20Stellar.png',
    symbol: 'XLM',
    iconSize: 32
  }
];

function AnimatedSwapText({
  value,
  shouldReduceMotion,
  layoutId,
}: {
  value: string;
  shouldReduceMotion: boolean;
  layoutId?: string;
}) {
  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={value}
          layoutId={layoutId}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(3px)' }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function ConfirmationPage({ hideHeader: _hideHeader = false }: { hideHeader?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Front-end only state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]); // Default to Bitcoin
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [tempSelectedPayment, setTempSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [selectedTeleportation, setSelectedTeleportation] = useState('tardis');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const vehicleVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [shimmerPulse, setShimmerPulse] = useState<Record<string, number>>({});
  const [insuranceCheckboxHovered, setInsuranceCheckboxHovered] = useState(false);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [tempAdultsCount, setTempAdultsCount] = useState(1);
  const [tempChildrenCount, setTempChildrenCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // When playingVideoId is set, start that video at 2x; pause others at first frame
  useEffect(() => {
    TELEPORTATION_METHODS.forEach((m) => {
      const el = vehicleVideoRefs.current[m.id];
      if (!el) return;
      if (m.id === playingVideoId) {
        el.playbackRate = 2;
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }, [playingVideoId]);
  const guestCount = adultsCount + childrenCount;
  const guestCapacity = listing?.guest_capacity || 10;
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [showWarpLoader, setShowWarpLoader] = useState(false);
  const [bookingSaveFailed, setBookingSaveFailed] = useState(false);
  const particleTweak = DEFAULT_PARTICLE_TWEAK;
  const [warpButtonHidden, setWarpButtonHidden] = useState(false);
  const { isMobile, isTablet } = useDeviceType();
  const isCompactLayout = isMobile || isTablet;
  const shouldReduceMotion = !!useReducedMotion();

  // Cancellation deadline: 24 hours from now (user's local time)
  const cancellationDeadlineLabel = (() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  })();

  // Match confirmation page background to listing era when confirmation view is shown
  const confirmationBgColor = listing ? getConfirmationBackgroundColor(listing.title) : 'rgba(243, 239, 236, 1)';
  useEffect(() => {
    if ((!bookingConfirmed && !showWarpLoader) || !listing) return;
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = confirmationBgColor;
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, [bookingConfirmed, showWarpLoader, listing, confirmationBgColor]);

  const fetchListingForConfirm = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchListingDetails(id);
      if (!data) {
        setError('Listing not found. Please check the console for details.');
      } else {
        setListing(data);
      }
    } catch (err) {
      console.error('Error loading listing:', err);
      setError(`Failed to load listing details: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError('Listing ID is required');
      setIsLoading(false);
      return;
    }

    const routeState = (location as {
      state?: { listing?: ListingDetails; booking?: { guests?: number } };
    }).state;
    const bookingGuests = routeState?.booking?.guests;
    if (typeof bookingGuests === 'number' && bookingGuests >= 1) {
      setAdultsCount(bookingGuests);
      setChildrenCount(0);
      setTempAdultsCount(bookingGuests);
      setTempChildrenCount(0);
    }

    const stateListing = routeState?.listing;
    if (stateListing && stateListing.id === id && stateListing.price_per_night != null) {
      setListing(stateListing);
      setIsLoading(false);
      return;
    }

    fetchListingForConfirm();
  }, [id, (location as { state?: unknown }).state, fetchListingForConfirm]);

  // Calculate pricing breakdown - convert to Bitcoin for display
  const calculatePricing = () => {
    if (!listing) return null;

    const pricePerNight = listing.price_per_night || 0;
    const nights = 1;
    const basePrice = pricePerNight * nights;
    
    const weeklyDiscount = listing.weekly_discount_percent 
      ? basePrice * (listing.weekly_discount_percent / 100)
      : 0;
    
    const subtotal = basePrice - weeklyDiscount;
    const cleaningFee = listing.cleaning_fee || 0;
    const serviceFee = listing.service_fee_percent
      ? subtotal * (listing.service_fee_percent / 100)
      : 0;
    const occupancyTax = listing.occupancy_tax_percent
      ? subtotal * (listing.occupancy_tax_percent / 100)
      : 0;
    
    // Vehicle class fee (from design: 200₿)
    const vehicleClassFee = 200;
    
    // Base fare (from design: 2160₿) - using base price converted
    const baseFare = Math.round(subtotal);
    
    const total = baseFare + vehicleClassFee + serviceFee;
    const insuranceFee = insuranceSelected ? 40 : 0;
    const finalTotal = total + insuranceFee;

    return {
      baseFare,
      vehicleClassFee,
      serviceFee,
      insuranceFee,
      total: finalTotal,
      // Keep USD values for backend
      usdBasePrice: basePrice,
      usdSubtotal: subtotal,
      usdCleaningFee: cleaningFee,
      usdServiceFee: serviceFee,
      usdOccupancyTax: occupancyTax,
      usdTotal: subtotal + cleaningFee + serviceFee + occupancyTax
    };
  };

  const handlePaymentMethodChange = () => {
    setTempSelectedPayment(selectedPaymentMethod);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodDone = () => {
    setSelectedPaymentMethod(tempSelectedPayment);
    setShowPaymentModal(false);
  };

  const handleGuestChangeOpen = () => {
    setTempAdultsCount(adultsCount);
    setTempChildrenCount(childrenCount);
    setShowGuestModal(true);
  };

  const handleGuestsDone = () => {
    setAdultsCount(tempAdultsCount);
    setChildrenCount(tempChildrenCount);
    setShowGuestModal(false);
  };

  const updateTempAdults = (delta: number) => {
    setTempAdultsCount((prev) => {
      const next = prev + delta;
      if (next < 1) return prev;
      if (next + tempChildrenCount > guestCapacity) return prev;
      return next;
    });
  };

  const updateTempChildren = (delta: number) => {
    setTempChildrenCount((prev) => {
      const next = prev + delta;
      if (next < 0) return prev;
      if (tempAdultsCount + next > guestCapacity) return prev;
      return next;
    });
  };

  const showTemporaryShareFeedback = useCallback((label: string) => {
    setShareFeedback(label);
    window.setTimeout(() => setShareFeedback(null), 1400);
  }, []);

  const getShareUrl = useCallback(() => {
    const path = `/listing/${listing?.id ?? id}`;
    return `${window.location.origin}${path}`;
  }, [listing?.id, id]);

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

  const setHideHeader = useSetHideHeader();
  useEffect(() => {
    setHideHeader(!showWarpLoader && bookingConfirmed);
    return () => setHideHeader(false);
  }, [showWarpLoader, bookingConfirmed, setHideHeader]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '16px',
        fontFamily: 'var(--ds-font-family)',
        color: 'rgba(113, 113, 113, 1)'
      }}>
        Loading confirmation...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '18px',
          fontFamily: 'var(--ds-font-family)',
          fontWeight: 400,
          color: 'rgba(34, 34, 34, 1)',
          marginBottom: '12px'
        }}>
          {error || 'Listing not found'}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
          <Button variant="primary" size="md" onClick={() => fetchListingForConfirm()}>
            Retry
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigate('/')}>
            Back to Listings
          </Button>
        </div>
      </div>
    );
  }

  const pricing = calculatePricing();
  if (!pricing) return null;

  const viewState = showWarpLoader ? 'warp' : bookingConfirmed ? 'confirmed' : 'form';
  const confirmationTotal = `${selectedPaymentMethod.symbol}${pricing.total.toLocaleString()} total`;
  const eraOrDate = listing.date || '1734 CE';
  const shareUrl = getShareUrl();
  const shareTitle = listing.title;
  const shareSummary = `${listing.property_type ?? 'Stay'} · ★${listing.overall_rating?.toFixed(2) ?? '—'} · ${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? 's' : ''} · ${listing.beds} bed${listing.beds !== 1 ? 's' : ''} · ${listing.baths} bath${listing.baths !== 1 ? 's' : ''}`;
  const shareWarmIntro = `Check out this place I found on WarpBnB: ${shareTitle}`;

  const handleShareOption = (option: 'copy' | 'email' | 'messages' | 'linkedin' | 'twitter' | 'embed') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedWarmIntro = encodeURIComponent(shareWarmIntro);
    const encodedBody = encodeURIComponent(`${shareWarmIntro}\n${shareUrl}`);

    switch (option) {
      case 'copy':
        copyToClipboard(shareUrl, 'Link copied');
        return;
      case 'email':
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedBody}`;
        return;
      case 'messages':
        window.location.href = `sms:?&body=${encodedWarmIntro}%20${encodedUrl}`;
        return;
      case 'linkedin':
        openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedBody}`);
        return;
      case 'twitter':
        openShareWindow(`https://twitter.com/intent/tweet?text=${encodedWarmIntro}&url=${encodedUrl}`);
        return;
      case 'embed': {
        const embedCode = `<iframe src="${shareUrl}" width="640" height="420" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        copyToClipboard(embedCode, 'Embed code copied');
        return;
      }
      default:
        return;
    }
  };

  const easeSmooth = [0.22, 1, 0.36, 1] as const;

  /** Form: slide up on enter; exit with quick fade + slight scale down (portal warp away) */
  const formPageVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.35, ease: easeSmooth },
    },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.96,
          transition: { duration: 0.3, ease: easeSmooth },
        },
  } as const;

  /** Confirmed: enter with scale-up (0.98 → 1) + fade so it feels like it "lands" */
  const confirmedPageVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.35, ease: easeSmooth },
    },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.995 },
  } as const;

  const stagedContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.06,
      },
    },
  } as const;

  const stagedItem = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.01 : 0.32, ease: [0.22, 1, 0.36, 1] },
    },
  } as const;

  const teleportCardsVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
      },
    },
  } as const;

  return (
      <LayoutGroup id={`confirmation-flow-${listing.id}`}>
        <AnimatePresence mode="sync" initial={false}>
        {viewState === 'confirmed' && (
          <motion.div
            key="confirmed"
            variants={confirmedPageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <BookingConfirmation
              title={listing.title}
              location={eraOrDate}
              date={eraOrDate}
              guests={`${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`}
              price={confirmationTotal}
              imageUrl={listing.main_image}
              onLogoClick={() => navigate('/')}
              onShareClick={() => setShowShareModal(true)}
              style={{ backgroundColor: confirmationBgColor }}
            />
          </motion.div>
        )}

        {viewState === 'form' && (
          <motion.div
            key="form"
            variants={formPageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              width: '100%',
              minHeight: '100vh',
              backgroundColor: 'var(--ds-background)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
      {/* Main Content */}
      <motion.div
        variants={stagedContainer}
        initial="hidden"
        animate="visible"
        style={{
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: isMobile ? '48px' : '64px',
        paddingTop: isMobile ? '24px' : '32px',
        paddingLeft: isMobile ? 16 : isTablet ? 40 : 260,
        paddingRight: isMobile ? 16 : isTablet ? 40 : 260,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Back Button and Title */}
        <motion.div
          variants={stagedItem}
          style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
          width: '100%'
        }}>
          <IconButton
            icon={<ChevronLeft size={24} strokeWidth={2} style={{ color: 'var(--ds-text-primary)' }} />}
            ariaLabel="Back to listing"
            onClick={() => navigate(`/listing/${id}`)}
            style={{ minWidth: 44, minHeight: 44, width: 44, height: 44, flexShrink: 0 }}
          />
          <div style={{
            fontFamily: 'var(--ds-font-family)',
            fontWeight: 500,
            fontSize: '30px',
            lineHeight: '40px',
            letterSpacing: '-0.6px',
            color: 'rgba(0, 0, 0, 1)'
          }}>
            Confirm and pay
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          variants={stagedItem}
          style={{
          display: 'flex',
          gap: isMobile ? 32 : isTablet ? 40 : 64,
          alignItems: 'flex-start',
          width: '100%',
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          {/* Left Column */}
          <motion.div
            variants={stagedContainer}
            style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 0',
            gap: '24px',
            alignItems: 'flex-start'
          }}>
            {/* Payment Method */}
            <motion.div variants={stagedItem} style={{
              border: '1px solid rgba(221, 221, 221, 1)',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              backgroundColor: 'white'
            }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 0',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontWeight: 500,
                    fontSize: '20px',
                    lineHeight: '28px',
                    letterSpacing: '-0.4px',
                    color: 'rgba(0, 0, 0, 1)',
                    width: '100%'
                  }}>
                    Payment method
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <img src={selectedPaymentMethod.icon} alt={selectedPaymentMethod.name} style={{
                      width: '20px',
                      height: '20px'
                    }} />
                    <div style={{
                      fontFamily: 'var(--ds-font-family)',
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: 'rgba(34, 34, 34, 1)'
                    }}>
                      {selectedPaymentMethod.address}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handlePaymentMethodChange}
                  style={{
                    backgroundColor: 'rgba(242, 242, 242, 1)',
                    padding: '8px 2px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--ds-font-family)',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(34, 34, 34, 1)',
                    width: '96px',
                    textAlign: 'center'
                  }}
                >
                  Change
                </button>
              </div>
            </motion.div>

            {/* Teleportation Method Selection */}
            <motion.div variants={stagedItem} style={{
              border: '1px solid rgba(221, 221, 221, 1)',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              backgroundColor: 'white'
            }}>
              <div style={{
                fontFamily: 'var(--ds-font-family)',
                fontWeight: 500,
                fontSize: '20px',
                lineHeight: '28px',
                letterSpacing: '-0.4px',
                color: 'rgba(0, 0, 0, 1)',
                marginBottom: '16px'
              }}>
                Select teleportation method
              </div>
              <motion.div
                variants={teleportCardsVariants}
                style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {TELEPORTATION_METHODS.map((method) => {
                  const isSelected = selectedTeleportation === method.id;
                  const isHovered = hoveredCardId === method.id;
                  const shimmerKey = shimmerPulse[method.id] ?? 0;
                  const handleClick = () => {
                    setSelectedTeleportation(method.id);
                    setPlayingVideoId(method.id);
                  };
                  const handleHoverStart = () => {
                    setHoveredCardId(method.id);
                    if (!shouldReduceMotion) {
                      setShimmerPulse((prev) => ({
                        ...prev,
                        [method.id]: (prev[method.id] ?? 0) + 1,
                      }));
                    }
                  };
                  return (
                    <motion.div
                      key={method.id}
                      variants={stagedItem}
                      onClick={handleClick}
                      onHoverStart={handleHoverStart}
                      onHoverEnd={() => setHoveredCardId(null)}
                      whileHover={shouldReduceMotion ? undefined : {
                        scale: 1.02,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : 0.3,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      style={{
                        position: 'relative',
                        border: isSelected ? '2px solid rgba(34, 34, 34, 1)' : '1px solid rgba(217, 217, 217, 1)',
                        borderRadius: '16px',
                        padding: '16px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      {/* One-pass shimmer on hover enter */}
                      {!shouldReduceMotion && shimmerKey > 0 && (
                        <motion.div
                          key={`${method.id}-${shimmerKey}`}
                          initial={{ x: '-130%' }}
                          animate={{ x: '220%' }}
                          transition={{
                            duration: 0.75,
                            ease: 'easeInOut',
                          }}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '45%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.34), transparent)',
                            pointerEvents: 'none',
                            zIndex: 1,
                          }}
                        />
                      )}

                      <div
                        style={{
                          width: '72px',
                          height: '72px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        <video
                          ref={(el) => { vehicleVideoRefs.current[method.id] = el; }}
                          src={method.video}
                          poster={method.icon}
                          preload="metadata"
                          playsInline
                          muted
                          onLoadedMetadata={(e) => {
                            const v = e.currentTarget;
                            if (playingVideoId !== method.id) {
                              v.currentTime = 0;
                              v.pause();
                            }
                          }}
                          onEnded={() => {
                            const video = vehicleVideoRefs.current[method.id];
                            if (video) {
                              video.currentTime = 0;
                              video.pause();
                            }
                            setPlayingVideoId(null);
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1 0 0',
                        gap: '2px',
                        alignItems: 'flex-start',
                        position: 'relative',
                        zIndex: 2,
                      }}>
                        <div style={{
                          fontFamily: 'var(--ds-font-family)',
                          fontWeight: 500,
                          fontSize: '16px',
                          lineHeight: '24px',
                          letterSpacing: '-0.32px',
                          color: 'rgba(0, 0, 0, 1)'
                        }}>
                          {method.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--ds-font-family)',
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '-0.28px',
                          color: 'rgba(107, 114, 128, 1)'
                        }}>
                          {method.description}
                        </div>
                      </div>

                      {/* Radio button with spring physics */}
                      <motion.div
                        animate={{
                          scale: isSelected ? 1 : 0.95,
                          borderColor: isSelected || isHovered ? 'rgba(34, 34, 34, 1)' : 'rgba(140, 140, 140, 1)',
                        }}
                        transition={{
                          type: shouldReduceMotion ? 'tween' : 'spring',
                          duration: shouldReduceMotion ? 0.01 : undefined,
                          stiffness: 500,
                          damping: 30,
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          borderWidth: isSelected ? 2 : 1,
                          borderStyle: 'solid',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'relative',
                          zIndex: 2,
                        }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={shouldReduceMotion ? false : { scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: shouldReduceMotion ? 'tween' : 'spring',
                              duration: shouldReduceMotion ? 0.01 : undefined,
                              stiffness: 500,
                              damping: 25,
                            }}
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(34, 34, 34, 1)'
                            }}
                          />
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Emergency Extraction Insurance */}
            <motion.div variants={stagedItem} style={{
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              backgroundColor: 'rgba(247, 247, 247, 1)'
            }}>
              <div style={{
                fontFamily: 'var(--ds-font-family)',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.32px',
                color: 'rgba(0, 0, 0, 1)',
                marginBottom: '8px'
              }}>
                Add emergency extraction insurance?
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: 'rgba(34, 34, 34, 1)'
                }}>
                  Yes, add peace of mind for 40{selectedPaymentMethod.symbol}.
                </div>
                <motion.div
                  onClick={() => setInsuranceSelected(!insuranceSelected)}
                  onMouseEnter={() => setInsuranceCheckboxHovered(true)}
                  onMouseLeave={() => setInsuranceCheckboxHovered(false)}
                  animate={{
                    borderColor: insuranceSelected ? 'rgba(34, 34, 34, 1)' : (insuranceCheckboxHovered ? 'rgba(34, 34, 34, 1)' : 'rgba(140, 140, 140, 1)'),
                  }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.88 }}
                  transition={{
                    type: shouldReduceMotion ? 'tween' : 'spring',
                    duration: shouldReduceMotion ? 0.01 : undefined,
                    stiffness: 500,
                    damping: 30,
                  }}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    borderWidth: insuranceSelected ? 2 : 1,
                    borderStyle: 'solid',
                    backgroundColor: insuranceSelected ? 'rgba(34, 34, 34, 1)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {insuranceSelected && (
                    <motion.svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      initial={shouldReduceMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: shouldReduceMotion ? 'tween' : 'spring',
                        duration: shouldReduceMotion ? 0.01 : undefined,
                        stiffness: 500,
                        damping: 25,
                      }}
                    >
                      <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  )}
                </motion.div>
              </div>
              <div style={{
                fontFamily: 'var(--ds-font-family)',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.28px',
                color: 'rgba(34, 34, 34, 1)',
                marginBottom: '16px'
              }}>
                Covers paradoxes, hostile timelines, and butterfly effects.
              </div>
              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'rgba(217, 217, 217, 1)',
                marginBottom: '16px'
              }} />
              <div style={{
                fontFamily: 'var(--ds-font-family)',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.28px',
                color: 'rgba(34, 34, 34, 1)'
              }}>
                Automatic recall if you exceed safe roaming distance or cause timeline instability. Includes medical bio-scan, memory stabilization, and priority return support.
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Booking Summary */}
          <motion.div
            variants={stagedContainer}
            style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: isMobile ? '100%' : isTablet ? 320 : 380,
            flexShrink: 0
          }}>
            <motion.div variants={stagedItem} style={{
              border: '1px solid rgba(221, 221, 221, 1)',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              backgroundColor: 'white'
            }}>
              {/* Listing Image and Info */}
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <img src={listing.main_image} alt={listing.title} style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  flexShrink: 0
                }} />
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 0',
                  gap: '2px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '26px',
                    letterSpacing: '-0.36px',
                    color: 'rgba(34, 34, 34, 1)',
                    marginBottom: '2px'
                  }}>
                    {listing.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#000"/>
                    </svg>
                    <div style={{
                      fontFamily: 'var(--ds-font-family)',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: 'rgba(0, 0, 0, 1)'
                    }}>
                      {listing.overall_rating?.toFixed(1) || '4.8'} ({listing.total_reviews || 57})
                    </div>
                    <div style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: 'rgba(0, 0, 0, 1)',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontFamily: 'var(--ds-font-family)',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: 'rgba(0, 0, 0, 1)'
                    }}>
                      Superhost
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div style={{
                marginBottom: '16px'
              }}>
                <div style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: 'rgba(0, 0, 0, 1)',
                  marginBottom: '2px'
                }}>
                  Free cancellation
                </div>
                <div style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: 'rgba(0, 0, 0, 1)'
                }}>
                  Cancel anytime before {cancellationDeadlineLabel} for a full refund.
                </div>
              </div>

              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'rgba(217, 217, 217, 1)',
                marginBottom: '16px'
              }} />

              {/* Guests */}
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 0',
                  gap: '4px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Guests
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    <AnimatedSwapText
                      shouldReduceMotion={shouldReduceMotion}
                      value={childrenCount > 0
                        ? `${adultsCount} ${adultsCount === 1 ? 'adult' : 'adults'}, ${childrenCount} ${childrenCount === 1 ? 'child' : 'children'}`
                        : `${adultsCount} ${adultsCount === 1 ? 'adult' : 'adults'}`}
                    />
                  </div>
                </div>
                <button
                  onClick={handleGuestChangeOpen}
                  style={{
                    backgroundColor: 'rgba(242, 242, 242, 1)',
                    padding: '8px 2px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--ds-font-family)',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(34, 34, 34, 1)',
                    width: '96px',
                    textAlign: 'center'
                  }}
                >
                  Change
                </button>
              </div>

              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'rgba(217, 217, 217, 1)',
                marginBottom: '16px'
              }} />

              {/* Price Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: 'rgba(0, 0, 0, 1)',
                  marginBottom: '8px'
                }}>
                  Price detail
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Base Fare
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    <AnimatedSwapText
                      shouldReduceMotion={shouldReduceMotion}
                      value={`${pricing.baseFare}${selectedPaymentMethod.symbol}`}
                    />
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Vehicle Class
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    <AnimatedSwapText
                      shouldReduceMotion={shouldReduceMotion}
                      value={`${pricing.vehicleClassFee}${selectedPaymentMethod.symbol}`}
                    />
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Service Fee
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    <AnimatedSwapText
                      shouldReduceMotion={shouldReduceMotion}
                      value={`${pricing.serviceFee}${selectedPaymentMethod.symbol}`}
                    />
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {insuranceSelected && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { opacity: 0, height: 0, y: 8 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        fontFamily: 'var(--ds-font-family)',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: 'rgba(0, 0, 0, 1)'
                      }}>
                        Insurance
                      </div>
                      <div style={{
                        fontFamily: 'var(--ds-font-family)',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: 'rgba(0, 0, 0, 1)'
                      }}>
                        <AnimatedSwapText
                          shouldReduceMotion={shouldReduceMotion}
                          value={`${pricing.insuranceFee}${selectedPaymentMethod.symbol}`}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: 'rgba(217, 217, 217, 1)',
                marginBottom: '16px'
              }} />

              {/* Total */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.32px',
                  color: 'rgba(0, 0, 0, 1)'
                }}>
                  Total
                </div>
                <div style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.32px',
                  color: 'rgba(34, 34, 34, 1)'
                }}>
                  <AnimatedSwapText
                    shouldReduceMotion={shouldReduceMotion}
                    value={`${pricing.total.toLocaleString()}${selectedPaymentMethod.symbol}`}
                  />
                </div>
              </div>

              {/* Confirm and Warp Button – Codrops-style particle burst then confirmation */}
              {shouldReduceMotion ? (
                <button
                  type="button"
                  disabled={isBookingSubmitting}
                  onClick={() => {
                    if (isBookingSubmitting) return;
                    playSound('warpWhoosh', 0.3);
                    setIsBookingSubmitting(true);
                    setBookingConfirmed(true);
                    setShowWarpLoader(false);
                    setIsBookingSubmitting(false);
                    const bookingData = {
                      listing_id: listing.id,
                      listing_title: listing.title,
                      price_usd: pricing.usdTotal,
                      base_fare_usd: pricing.usdBasePrice,
                      service_fee_usd: pricing.usdServiceFee,
                      cleaning_fee_usd: pricing.usdCleaningFee,
                      occupancy_tax_usd: pricing.usdOccupancyTax,
                      guest_count: guestCount,
                    };
                    void createBooking(bookingData).catch((saveError) => {
                      console.error('Error creating booking:', saveError);
                      setBookingSaveFailed(true);
                    });
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(90deg, #FF0257 0%, #FF0257 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '9999px',
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: isBookingSubmitting ? 'not-allowed' : 'pointer',
                    fontFamily: '"Figtree", sans-serif',
                    opacity: isBookingSubmitting ? 0.7 : 1,
                    marginBottom: 16,
                    textAlign: 'center',
                  }}
                >
                  {isBookingSubmitting ? 'Processing...' : 'Confirm and Warp'}
                </button>
              ) : (
                <div style={{ width: '100%', marginBottom: 16 }}>
                  <ParticleEffectButton
                    className="confirm-warp-particle-button"
                    color={particleTweak.particleColor || '#FF0257'}
                    hidden={warpButtonHidden}
                    duration={Math.round((particleTweak.wipeDurationS ?? 3) * 1000)}
                    direction="right"
                    type="rectangle"
                    onComplete={() => {
                      setBookingConfirmed(true);
                      setShowWarpLoader(false);
                      setIsBookingSubmitting(false);
                      const bookingData = {
                        listing_id: listing.id,
                        listing_title: listing.title,
                        price_usd: pricing.usdTotal,
                        base_fare_usd: pricing.usdBasePrice,
                        service_fee_usd: pricing.usdServiceFee,
                        cleaning_fee_usd: pricing.usdCleaningFee,
                        occupancy_tax_usd: pricing.usdOccupancyTax,
                        guest_count: guestCount,
                      };
                      void createBooking(bookingData).catch((saveError) => {
                        console.error('Error creating booking:', saveError);
                        setBookingSaveFailed(true);
                      });
                    }}
                  >
                    <button
                      type="button"
                      disabled={isBookingSubmitting}
                      onClick={() => {
                        if (isBookingSubmitting) return;
                        playSound('warpWhoosh', 0.3);
                        setWarpButtonHidden(true);
                        setIsBookingSubmitting(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(90deg, #FF0257 0%, #FF0257 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '9999px',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: isBookingSubmitting ? 'not-allowed' : 'pointer',
                        fontFamily: '"Figtree", sans-serif',
                        opacity: isBookingSubmitting ? 0.7 : 1,
                        textAlign: 'center',
                      }}
                    >
                      {isBookingSubmitting ? 'Processing...' : 'Confirm and Warp'}
                    </button>
                  </ParticleEffectButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Guests Selection Modal */}
      <Modal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
      >
        <div style={{
          padding: 'var(--ds-spacing-24)',
          width: '500px',
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: '85vh',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--ds-spacing-24)',
          }}>
            <Text variant="h1" weight="medium">
              Change guests
            </Text>
            <button
              onClick={() => setShowGuestModal(false)}
              aria-label="Close guest modal"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
                color: 'var(--ds-text-primary)',
                lineHeight: 0,
              }}
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 'var(--ds-spacing-20)',
          }}>
            <div>
              <Text as="div" variant="h3" weight="medium" style={{ marginBottom: 4 }}>
                Adults
              </Text>
              <Text as="div" variant="body" color="secondary">
                Age 13+
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconButton
                onClick={() => updateTempAdults(-1)}
                ariaLabel="Decrease adults"
                disabled={tempAdultsCount <= 1}
                icon={<Minus size={18} strokeWidth={2.25} />}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--ds-border-light)',
                  backgroundColor: 'var(--ds-surface)',
                }}
              />
              <Text
                as="div"
                variant="h3"
                weight="medium"
                style={{ minWidth: 24, textAlign: 'center' }}
              >
                {tempAdultsCount}
              </Text>
              <IconButton
                onClick={() => updateTempAdults(1)}
                ariaLabel="Increase adults"
                disabled={tempAdultsCount + tempChildrenCount >= guestCapacity}
                icon={<Plus size={18} strokeWidth={2.25} />}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--ds-border-light)',
                  backgroundColor: 'var(--ds-surface)',
                }}
              />
            </div>
          </div>

          <Divider orientation="horizontal" style={{ marginBottom: 'var(--ds-spacing-20)' }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 'var(--ds-spacing-24)',
          }}>
            <div>
              <Text as="div" variant="h3" weight="medium" style={{ marginBottom: 4 }}>
                Children
              </Text>
              <Text as="div" variant="body" color="secondary">
                Ages 2-12
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconButton
                onClick={() => updateTempChildren(-1)}
                ariaLabel="Decrease children"
                disabled={tempChildrenCount <= 0}
                icon={<Minus size={18} strokeWidth={2.25} />}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--ds-border-light)',
                  backgroundColor: 'var(--ds-surface)',
                }}
              />
              <Text
                as="div"
                variant="h3"
                weight="medium"
                style={{ minWidth: 24, textAlign: 'center' }}
              >
                {tempChildrenCount}
              </Text>
              <IconButton
                onClick={() => updateTempChildren(1)}
                ariaLabel="Increase children"
                disabled={tempAdultsCount + tempChildrenCount >= guestCapacity}
                icon={<Plus size={18} strokeWidth={2.25} />}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1px solid var(--ds-border-light)',
                  backgroundColor: 'var(--ds-surface)',
                }}
              />
            </div>
          </div>

          <Divider orientation="horizontal" />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--ds-spacing-20)',
          }}>
            <Button
              onClick={() => setShowGuestModal(false)}
              variant="ghost"
              size="lg"
              style={{
                paddingLeft: 0,
                paddingRight: 0,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGuestsDone}
              variant="primary"
              size="lg"
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Method Selection Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      >
        <div style={{
          padding: '24px',
          width: '520px',
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: '85vh',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}>
            <Text as="div" variant="h1" weight="medium">
              Payment method
            </Text>
            <button
              onClick={() => setShowPaymentModal(false)}
              aria-label="Close payment modal"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
                color: 'var(--ds-text-primary)',
                lineHeight: 0,
              }}
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* Show all payment methods with the first one as selected by default */}
            {PAYMENT_METHODS.map((method, index) => {
              const isSelected = tempSelectedPayment.id === method.id;
              const isFirst = index === 0;

              return (
                <div key={method.id}>
                  {!isFirst && index === 1 && (
                    <div style={{
                      fontFamily: 'var(--ds-font-family)',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: 'rgba(0, 0, 0, 1)',
                      marginBottom: '16px'
                    }}>
                      Or pay with
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '0',
                    cursor: 'pointer'
                  }} onClick={() => setTempSelectedPayment(method)}>
                    <div style={{
                      display: 'flex',
                      flex: '1 0 0',
                      gap: '12px',
                      alignItems: 'center'
                    }}>
                      <img src={method.icon} alt={method.name} style={{
                        width: '32px',
                        height: '32px',
                        objectFit: 'contain',
                        flexShrink: 0
                      }} />
                      <div style={{
                        fontFamily: 'var(--ds-font-family)',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px',
                        color: 'rgba(34, 34, 34, 1)'
                      }}>
                        {method.address}
                      </div>
                    </div>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '2px solid rgba(34, 34, 34, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor: isSelected ? 'transparent' : 'white'
                    }}>
                      {isSelected && (
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(34, 34, 34, 1)'
                        }} />
                      )}
                    </div>
                  </div>
                  <div style={{
                    height: '1px',
                    width: '100%',
                    backgroundColor: 'rgba(229, 231, 235, 1)',
                    marginTop: '16px'
                  }} />
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '16px'
          }}>
            <button
              onClick={handlePaymentMethodDone}
              style={{
                backgroundColor: 'rgba(34, 34, 34, 1)',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--ds-font-family)',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.32px',
                color: 'white',
                width: '96px',
                textAlign: 'center'
              }}
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
          <Footer
            copyrightText="© 2026 Warpbnb Inc."
            links={[
              { label: 'Built with vibes' },
              { label: 'Help', href: '/support' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Support', href: '/support' },
            ]}
            languageLabel="English (US)"
            socialLinks={[
              { platform: 'twitter', href: 'https://x.com/kingermayank', ariaLabel: 'Twitter' },
              { platform: 'linkedin', href: 'https://www.linkedin.com/in/kingermayank', ariaLabel: 'LinkedIn' },
              { platform: 'github', href: 'https://github.com/kingermayank', ariaLabel: 'GitHub' },
            ]}
            style={{
              width: '100%',
              maxWidth: 1280,
              margin: '0 auto',
              boxSizing: 'border-box',
              paddingLeft: isMobile ? 'var(--ds-spacing-16)' : 'var(--ds-spacing-80)',
              paddingRight: isMobile ? 'var(--ds-spacing-16)' : 'var(--ds-spacing-80)',
              paddingTop: 'var(--ds-section-padding-y)',
              paddingBottom: 'var(--ds-section-padding-y)',
            }}
          />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal - outside viewState so it opens from Securing arrival window too */}
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
                fontWeight: 500,
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
              <X size={20} strokeWidth={2} />
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
                  fontWeight: 400,
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
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#22c55e',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    ✓
                  </span>
                  <span>{shareFeedback}</span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </Modal>
      </LayoutGroup>
  );
}
