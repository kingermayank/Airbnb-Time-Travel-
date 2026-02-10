import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { fetchListingDetails, createBooking } from '../lib/supabase-queries';
import type { ListingDetails } from '../types/database';
import { Header, Button, UserMenu } from '../design-system';
import { BookingConfirmation } from './BookingConfirmation';
import { PORTAL_VIDEO_URL, PORTAL_POSTER_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';

// Teleportation method options – video only from public/images/vehicles/ (paused on first frame by default; play once at 2x on select)
const TELEPORTATION_METHODS = [
  {
    id: 'delorean',
    name: 'Back to the Future DeLorean',
    description: 'Hit 88 miles per hour and break the space-time continuum—just like Marty and Doc Brown. Roads required. Lightning optional.',
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

const CONFIRMATION_NAV_ITEMS = [
  { label: 'Time Travel', iconVideoUrl: PORTAL_VIDEO_URL, iconPosterUrl: PORTAL_POSTER_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

function HeaderRightSlotWithUserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navigate = useNavigate();

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--ds-spacing-12)',
      }}
    >
      <Button
        variant="ghost"
        size="md"
        style={{ color: 'var(--ds-navbar-active)' }}
        onClick={() => navigate('/')}
      >
        Become a host
      </Button>
      <button
        type="button"
        className="ds-header-right-icon-btn"
        aria-label="Help"
        style={{ border: 'none' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--ds-navbar-active)' }}
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>
      <button
        type="button"
        className="ds-header-right-icon-btn"
        aria-label="Menu"
        style={{ border: 'none' }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--ds-navbar-active)' }}
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 30,
          }}
        >
          <UserMenu />
        </div>
      )}
    </div>
  );
}

export function ConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  const [guestCount, setGuestCount] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingSaveFailed, setBookingSaveFailed] = useState(false);

  // Match Magic Path BookingConfirmation page background when confirmation view is shown
  useEffect(() => {
    if (!bookingConfirmed || !listing) return;
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = 'rgba(243, 239, 236, 1)';
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, [bookingConfirmed, listing]);

  useEffect(() => {
    if (!id) {
      setError('Listing ID is required');
      setIsLoading(false);
      return;
    }

    async function loadListing() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('📄 Loading listing details for confirmation page, ID:', id);
        const data = await fetchListingDetails(id);
        if (!data) {
          console.error('❌ No data returned for listing ID:', id);
          setError('Listing not found. Please check the console for details.');
        } else {
          console.log('✅ Listing loaded successfully for confirmation:', data.title);
          setListing(data);
        }
      } catch (err) {
        console.error('❌ Exception loading listing:', err);
        setError(`Failed to load listing details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadListing();
  }, [id]);

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
          fontWeight: 500,
          color: 'rgba(34, 34, 34, 1)',
          marginBottom: '12px'
        }}>
          {error || 'Listing not found'}
        </div>
        <button onClick={() => navigate('/')} style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: '#FF395C',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'var(--ds-font-family)',
          fontWeight: 500,
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Back to Listings
        </button>
      </div>
    );
  }

  const pricing = calculatePricing();
  if (!pricing) return null;

  // Post-booking confirmation view (Figma: Securing arrival window)
  if (bookingConfirmed && listing) {
    const confirmationTotal = `${selectedPaymentMethod.symbol}${pricing.total.toLocaleString()} total`;
    const eraOrDate = listing.date || '1734 CE';

    return (
      <BookingConfirmation
        title={listing.title}
        location={eraOrDate}
        date={eraOrDate}
        guests={`${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`}
        price={confirmationTotal}
        imageUrl={listing.main_image}
        onLogoClick={() => navigate('/')}
      />
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'var(--ds-background)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ borderBottom: '1px solid var(--ds-border-light)' }}>
        <Header
          brandName="warpbnb"
          navItems={CONFIRMATION_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={(label) => (label === 'Time Travel' ? undefined : navigate('/'))}
          onLogoClick={() => navigate('/')}
          rightSlot={<HeaderRightSlotWithUserMenu />}
        />
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        paddingBottom: '64px',
        paddingTop: '32px',
        paddingLeft: '260px',
        paddingRight: '260px',
        width: '100%'
      }}>
        {/* Back Button and Title */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          alignItems: 'center',
          width: '100%'
        }}>
          <button onClick={() => navigate(`/listing/${id}`)} style={{
            width: '44px',
            height: '44px',
            borderRadius: '22px',
            border: 'none',
            backgroundColor: 'rgba(242, 242, 242, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="rgba(34, 34, 34, 1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
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
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'flex',
          gap: '64px',
          alignItems: 'flex-start',
          width: '100%'
        }}>
          {/* Left Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 0',
            gap: '24px',
            alignItems: 'flex-start'
          }}>
            {/* Payment Method */}
            <div style={{
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
            </div>

            {/* Teleportation Method Selection */}
            <div style={{
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
                Select teleporation method
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {TELEPORTATION_METHODS.map((method) => {
                  const isSelected = selectedTeleportation === method.id;
                  const handleClick = () => {
                    setSelectedTeleportation(method.id);
                    setPlayingVideoId(method.id);
                  };
                  return (
                    <div
                      key={method.id}
                      onClick={handleClick}
                      style={{
                        border: isSelected ? '2px solid rgba(34, 34, 34, 1)' : '2px solid rgba(217, 217, 217, 1)',
                        borderRadius: '16px',
                        padding: '16px',
                        backgroundColor: '#FFF',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.03)'
                      }}>
                        <video
                          ref={(el) => { vehicleVideoRefs.current[method.id] = el; }}
                          src={method.video}
                          preload="auto"
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
                            objectFit: 'cover'
                          }}
                        />
                      </div>
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
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid rgba(34, 34, 34, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
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
                  );
                })}
              </div>
            </div>

            {/* Emergency Extraction Insurance */}
            <div style={{
              border: '1px solid rgba(221, 221, 221, 1)',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              backgroundColor: 'rgba(247, 247, 247, 1)'
            }}>
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                width: '100%',
                marginBottom: '16px'
              }}>
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
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: 'rgba(0, 0, 0, 1)',
                    marginBottom: '8px'
                  }}>
                    Add emergency extraction insurance?
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(34, 34, 34, 1)',
                    marginBottom: '2px'
                  }}>
                    Yes, add peace of mind for 40{selectedPaymentMethod.symbol}.
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(34, 34, 34, 1)'
                  }}>
                    Covers paradoxes, hostile timelines, and butterfly effects.
                  </div>
                </div>
                <div
                  onClick={() => setInsuranceSelected(!insuranceSelected)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: '1px solid rgba(140, 140, 140, 1)',
                    backgroundColor: insuranceSelected ? 'rgba(34, 34, 34, 1)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {insuranceSelected && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
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
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '380px',
            flexShrink: 0
          }}>
            <div style={{
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
                  Cancel anytime before Feb 18 for a full refund.
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
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    {guestCount} {guestCount === 1 ? 'adult' : 'adults'}
                  </div>
                </div>
                <button style={{
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
                }}>
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
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Base Fare
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    {pricing.baseFare}{selectedPaymentMethod.symbol}
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
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Vehicle Class
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    {pricing.vehicleClassFee}{selectedPaymentMethod.symbol}
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
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Service Fee
                  </div>
                  <div style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    {pricing.serviceFee}{selectedPaymentMethod.symbol}
                  </div>
                </div>
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
                  {pricing.total.toLocaleString()}{selectedPaymentMethod.symbol}
                </div>
              </div>

              {/* Book Button */}
              <button
                disabled={isBookingSubmitting}
                onClick={async () => {
                  try {
                    setIsBookingSubmitting(true);
                    const bookingData = {
                      listing_id: listing.id,
                      listing_title: listing.title,
                      price_usd: pricing.usdTotal,
                      base_fare_usd: pricing.usdBasePrice,
                      service_fee_usd: pricing.usdServiceFee,
                      cleaning_fee_usd: pricing.usdCleaningFee,
                      occupancy_tax_usd: pricing.usdOccupancyTax,
                      guest_count: guestCount
                    };

                    try {
                      await createBooking(bookingData);
                    } catch (saveError) {
                      console.error('Error creating booking:', saveError);
                      setBookingSaveFailed(true);
                    }
                    // Always show confirmation page so the user sees their booking details
                    setBookingConfirmed(true);
                  } catch (error) {
                    console.error('Error in booking flow:', error);
                    alert('Something went wrong. Please try again.');
                  } finally {
                    setIsBookingSubmitting(false);
                  }
                }}
                style={{
                  backgroundColor: isBookingSubmitting ? 'rgba(222, 49, 81, 0.7)' : 'rgba(222, 49, 81, 1)',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 'var(--ds-radius-full)',
                  border: 'none',
                  cursor: isBookingSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0px 1px 2px rgba(31, 41, 55, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => !isBookingSubmitting && (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span style={{
                  fontFamily: 'var(--ds-font-family)',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: 'white'
                }}>{isBookingSubmitting ? 'Securing...' : 'Book Launch Window'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowPaymentModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              fontFamily: 'var(--ds-font-family)',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '28px',
              letterSpacing: '-0.4px',
              color: 'rgba(0, 0, 0, 1)',
              marginBottom: '16px'
            }}>
              Payment method
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
                        fontWeight: 500,
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
        </div>
      )}
    </div>
  );
}
