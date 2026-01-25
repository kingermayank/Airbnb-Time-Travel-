import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchListingDetails, createBooking } from '../lib/supabase-queries';
import type { ListingDetails } from '../types/database';

// Teleportation method options
const TELEPORTATION_METHODS = [
  {
    id: 'delorean',
    name: 'Back to the Future DeLorean',
    description: 'Hit 88 miles per hour and break the space-time continuum—just like Marty and Doc Brown. Roads required. Lightning optional.',
    icon: 'http://localhost:3845/assets/912c07d150fdf2998eab5dfe9d4d5995b44479de.png'
  },
  {
    id: 'tardis',
    name: 'TARDIS Unit',
    description: 'Bigger on the inside. Interdimensional police box piloted across space and time by The Doctor. Expect surprising landings and British charm.',
    icon: 'http://localhost:3845/assets/f1a6b238a822256621dce249288edf8ecafde669.png'
  },
  {
    id: 'time-stone',
    name: 'Doctor Strange\'s Time Stone',
    description: 'Manipulate time itself using the Eye of Agamotto. Loop, rewind, or fast-forward to your destination with sorcerer-level precision.',
    icon: 'http://localhost:3845/assets/b8259fa394c3a2f192130fe67094918869a3a0cd.png'
  }
];

// Payment method options
const PAYMENT_METHODS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    address: 'bc1qk8f...ghjkl',
    icon: 'http://localhost:3845/assets/f04614b76b88cc0915f0b7e3573d06dabfd49c72.svg',
    symbol: '₿',
    iconSize: 32
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    address: '0x742d...f44e',
    icon: 'http://localhost:3845/assets/4af60bde8ac5992935144e42ef99e3ce6e822479.svg',
    symbol: 'Ξ',
    iconSize: 32
  },
  {
    id: 'usdc',
    name: 'USDC',
    address: '0xAbc1...789F',
    icon: 'http://localhost:3845/assets/aaf3d429a3bd7ac4227867248ed26832c8000354.png',
    symbol: '$',
    iconSize: 32
  }
];

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
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

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
        fontFamily: '"Graphik Web", sans-serif',
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
          fontFamily: '"Graphik Web", sans-serif',
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
          fontFamily: '"Graphik Web", sans-serif',
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

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        height: '101px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        backgroundColor: 'rgba(251, 251, 251, 1)',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid rgba(235, 235, 235, 1)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          flex: 1
        }} onClick={() => navigate('/')}>
          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/c976b0ad-ec40-4b9b-92cf-fc5026868616.svg" alt="Airbnb" style={{
            width: '40px',
            height: '40px'
          }} />
          <img src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4383b27d-8ae5-4540-a091-0635cd01d9b5.svg" alt="Vector" style={{
            width: '65.6px',
            height: '17.5px',
            marginLeft: '4px'
          }} />
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          gap: '32px',
          height: '100%',
          alignItems: 'center'
        }}>
          {[
            { label: 'Homes', icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/049c1522-ce42-4a6a-9fe2-74ddbee53971.png' },
            { label: 'Experiences', icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ec4befb5-f8d2-460c-bd98-9e3d5a3e16e8.png' },
            { label: 'Services', icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/3e65e158-8c5e-4f56-9efa-9a9faa7db084.png' },
            { label: 'Time Travel', icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/9be8222d-7ffa-4c1a-a97f-6b3ed6400a37.png' }
          ].map(item => (
            <button key={item.label} onClick={() => item.label === 'Time Travel' ? null : navigate('/')} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 0 0 0',
              height: '80px',
              justifyContent: 'center',
              transition: 'opacity 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img src={item.icon} alt={item.label} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }} />
                </div>
                <span style={{
                  fontSize: '14px',
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: item.label === 'Time Travel' ? 500 : 400,
                  color: item.label === 'Time Travel' ? 'rgba(34, 34, 34, 1)' : 'rgba(106, 106, 106, 1)'
                }}>
                  {item.label}
                </span>
              </div>
              <div style={{
                height: '3px',
                backgroundColor: item.label === 'Time Travel' ? 'rgba(34, 34, 34, 1)' : 'transparent',
                width: '100%',
                borderRadius: '30px',
                marginTop: 'auto',
                marginBottom: '6px'
              }} />
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}>
          <button style={{
            height: '40px',
            padding: '0 16px',
            borderRadius: '24px',
            border: 'none',
            background: 'none',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: '"Graphik Web", sans-serif',
            cursor: 'pointer'
          }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            Become a host
          </button>
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: 'rgba(242, 242, 242, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <img src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/495a65a7-2776-4c22-93e9-ddbbec08f861.svg" alt="Language" style={{
              width: '20px',
              height: '20px'
            }} />
          </button>
          <button style={{
            width: '40px',
            height: '40px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: 'rgba(242, 242, 242, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <img src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/517d93ae-5050-47a4-9279-35f65f33e53f.svg" alt="Menu" style={{
              width: '20px',
              height: '20px'
            }} />
          </button>
        </div>
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
            fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
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
                      fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
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
                fontFamily: '"Graphik Web", sans-serif',
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
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedTeleportation(method.id)}
                      style={{
                        border: isSelected ? '2px solid rgba(34, 34, 34, 1)' : '1px solid rgba(217, 217, 217, 1)',
                        borderRadius: '16px',
                        padding: '16px',
                        backgroundColor: isSelected ? 'rgba(247, 247, 247, 1)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center'
                      }}
                    >
                      <img src={method.icon} alt={method.name} style={{
                        width: '64px',
                        height: '64px',
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
                          fontFamily: '"Graphik Web", sans-serif',
                          fontWeight: 500,
                          fontSize: '16px',
                          lineHeight: '24px',
                          letterSpacing: '-0.32px',
                          color: 'rgba(0, 0, 0, 1)'
                        }}>
                          {method.name}
                        </div>
                        <div style={{
                          fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
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
                fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '26px',
                    letterSpacing: '-0.36px',
                    color: 'rgba(34, 34, 34, 1)',
                    marginBottom: '6px'
                  }}>
                    {listing.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center'
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FF395C"/>
                    </svg>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
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
                      fontFamily: '"Graphik Web", sans-serif',
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
                  fontFamily: '"Graphik Web", sans-serif',
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
                  fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Guests
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
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
                  fontFamily: '"Graphik Web", sans-serif',
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
                  fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Base Fare
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Vehicle Class
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
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
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'rgba(0, 0, 0, 1)'
                  }}>
                    Service Fee
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
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
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.32px',
                  color: 'rgba(0, 0, 0, 1)'
                }}>
                  Total
                </div>
                <div style={{
                  fontFamily: '"Graphik Web", sans-serif',
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
                onClick={async () => {
                  try {
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
                    
                    const booking = await createBooking(bookingData);
                    
                    if (booking) {
                      alert('Booking confirmed! Your reservation has been saved.');
                      // Optionally navigate to a success page or back to listings
                      // navigate('/bookings');
                    } else {
                      alert('Booking created locally (Supabase not configured).');
                    }
                  } catch (error) {
                    console.error('Error creating booking:', error);
                    alert('Failed to create booking. Please try again.');
                  }
                }}
                style={{
                  backgroundColor: 'rgba(222, 49, 81, 1)',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0px 1px 2px rgba(31, 41, 55, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <span style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: 'white'
                }}>Book Launch Window</span>
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
              fontFamily: '"Graphik Web", sans-serif',
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
                const isLast = index === PAYMENT_METHODS.length - 1;
                
                return (
                  <div key={method.id}>
                    {isFirst && (
                      <div style={{
                        height: '1px',
                        width: '100%',
                        backgroundColor: 'rgba(229, 231, 235, 1)',
                        marginBottom: '16px'
                      }} />
                    )}
                    {!isFirst && index === 1 && (
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
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
                          fontFamily: '"Graphik Web", sans-serif',
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
                    {!isLast && (
                      <div style={{
                        height: '1px',
                        width: '100%',
                        backgroundColor: 'rgba(229, 231, 235, 1)',
                        marginTop: '16px'
                      }} />
                    )}
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
                  fontFamily: '"Graphik Web", sans-serif',
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
