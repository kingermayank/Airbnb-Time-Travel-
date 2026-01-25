import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { fetchListingDetails } from '../lib/supabase-queries';
import type { ListingDetails } from '../types/database';

// Helper function to get amenity icon based on name
function getAmenityIcon(amenityName: string) {
  const name = amenityName.toLowerCase();
  
  // Create circular icon containers with appropriate icons
  if (name.includes('wifi') || name.includes('wi-fi') || name.includes('starlink')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <path d="M16 10C19.866 10 23 13.134 23 17M16 14C17.6569 14 19 15.3431 19 17M16 18C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16C15.4477 16 15 16.4477 15 17C15 17.5523 15.4477 18 16 18Z" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name.includes('kitchen') || name.includes('galley')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <path d="M10 12H22M10 16H22M10 20H22M14 10V22M18 10V22" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name.includes('life support') || name.includes('life-support') || name.includes('support')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <path d="M16 10V22M10 16H22" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="4" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
      </svg>
    );
  }
  if (name.includes('rover') || name.includes('exploration')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <rect x="9" y="14" width="14" height="6" rx="1" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
        <circle cx="12" cy="20" r="2" fill="rgba(0, 0, 0, 1)"/>
        <circle cx="20" cy="20" r="2" fill="rgba(0, 0, 0, 1)"/>
        <path d="M12 14V12C12 10.8954 12.8954 10 14 10H18C19.1046 10 20 10.8954 20 12V14" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name.includes('climate') || name.includes('habitat')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <path d="M16 10L20 14H18V20H14V14H12L16 10Z" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M16 22V18" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name.includes('monitoring') || name.includes('perimeter')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <circle cx="16" cy="16" r="6" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
        <path d="M16 10V8M16 24V22M10 16H8M24 16H22M12.343 12.343L10.929 10.929M21.071 21.071L19.657 19.657M12.343 19.657L10.929 21.071M21.071 10.929L19.657 12.343" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name.includes('storage') || name.includes('cold')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <rect x="10" y="12" width="12" height="10" rx="1" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
        <path d="M14 12V10C14 9.44772 14.4477 9 15 9H17C17.5523 9 18 9.44772 18 10V12" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name.includes('recycler') || name.includes('fabric')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <path d="M10 16L16 10L22 16M16 10V22" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20L16 16L20 20" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (name.includes('drying') || name.includes('thermal')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <circle cx="16" cy="16" r="4" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
        <path d="M16 8V6M16 26V24M8 16H6M26 16H24M10.343 10.343L9.171 9.171M22.829 22.829L21.657 21.657M10.343 21.657L9.171 22.829M22.829 9.171L21.657 10.343" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (name.includes('companion') || name.includes('friendly')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <circle cx="12" cy="14" r="2" fill="rgba(0, 0, 0, 1)"/>
        <circle cx="20" cy="14" r="2" fill="rgba(0, 0, 0, 1)"/>
        <path d="M12 18C12 19.1046 13.3431 20 15 20H17C18.6569 20 20 19.1046 20 18" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 12C10 10.8954 10.8954 10 12 10H20C21.1046 10 22 10.8954 22 12V22C22 23.1046 21.1046 24 20 24H12C10.8954 24 10 23.1046 10 22V12Z" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
      </svg>
    );
  }
  if (name.includes('view') || name.includes('mars surface')) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
        <path d="M16 10C20.4183 10 24 13.5817 24 18C24 22.4183 20.4183 26 16 26C11.5817 26 8 22.4183 8 18C8 13.5817 11.5817 10 16 10Z" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
        <circle cx="16" cy="18" r="3" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="none"/>
        <circle cx="16" cy="18" r="1" fill="rgba(0, 0, 0, 1)"/>
      </svg>
    );
  }
  
  // Default circular icon
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
      <circle cx="16" cy="16" r="4" fill="rgba(0, 0, 0, 1)"/>
    </svg>
  );
}

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ListingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stickyTop, setStickyTop] = useState(120);
  const reviewSectionRef = useRef<HTMLDivElement>(null);
  const amenitiesSectionRef = useRef<HTMLDivElement>(null);

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
        console.log('📄 Loading listing details for ID:', id);
        const data = await fetchListingDetails(id);
        if (!data) {
          console.error('❌ No data returned for listing ID:', id);
          setError('Listing not found. Please check the console for details.');
        } else {
          console.log('✅ Listing loaded successfully:', data.title);
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

  // Handle sticky positioning based on scroll position
  useEffect(() => {
    if (!listing || !reviewSectionRef.current) return;

    const handleScroll = () => {
      if (!reviewSectionRef.current) return;
      
      const reviewSectionTop = reviewSectionRef.current.getBoundingClientRect().top;
      const headerHeight = 101; // Header height
      
      // If review section has been reached (is at or above the header)
      if (reviewSectionTop <= headerHeight) {
        // Stick at top after header
        setStickyTop(headerHeight + 20);
      } else {
        // Normal sticky position
        setStickyTop(120);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [listing]);

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
        Loading listing...
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

  const images = listing.listing_images && listing.listing_images.length > 0
    ? listing.listing_images.map(img => img.image_url)
    : [listing.main_image];

  // Ensure we have at least 5 images for the grid layout
  const displayImages = images.length >= 5 ? images.slice(0, 5) : [
    ...images,
    ...Array(5 - images.length).fill(listing.main_image)
  ];

  const mainImage = displayImages[0];
  const gridImages = displayImages.slice(1, 5);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      paddingBottom: '64px',
      paddingTop: '32px',
      paddingLeft: '160px',
      paddingRight: '160px'
    }}>
      {/* Header - Reuse from AirbnbUi */}
      <div style={{
        width: 'calc(100% + 320px)',
        height: '101px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#fbfbfb',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: '1px solid #ebebeb',
        marginLeft: '-160px',
        marginRight: '-160px',
        marginTop: '-32px'
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
                  color: item.label === 'Time Travel' ? '#222' : '#6a6a6a',
                  letterSpacing: '-0.28px',
                  lineHeight: '20px'
                }}>
                  {item.label}
                </span>
              </div>
              <div style={{
                height: '3px',
                backgroundColor: item.label === 'Time Travel' ? '#222' : 'transparent',
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

      {/* Title */}
        <div style={{
          fontFamily: '"Graphik Web", sans-serif',
          fontWeight: 500,
          fontSize: '30px',
          lineHeight: '40px',
          letterSpacing: '-0.6px',
          color: '#000000',
          width: '100%'
        }}>
          {listing.title}
        </div>

        {/* Image Grid */}
        <div style={{
          display: 'flex',
          gap: '8px',
          height: '400px',
          overflow: 'hidden',
          borderRadius: '16px',
          width: '100%'
        }}>
          {/* Main Image */}
          <div style={{
            flex: '1 0 0',
            height: '100%',
            position: 'relative'
          }}>
            <img src={mainImage} alt={listing.title} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }} />
          </div>
          {/* Grid Images */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 0',
            gap: '8px',
            height: '100%'
          }}>
            {/* Top Row */}
            <div style={{
              display: 'flex',
              flex: '1 0 0',
              gap: '8px',
              width: '100%'
            }}>
              <div style={{
                flex: '1 0 0',
                height: '100%',
                position: 'relative'
              }}>
                <img src={gridImages[0] || mainImage} alt={`${listing.title} 2`} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
              <div style={{
                flex: '1 0 0',
                height: '100%',
                position: 'relative'
              }}>
                <img src={gridImages[1] || mainImage} alt={`${listing.title} 3`} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
            </div>
            {/* Bottom Row */}
            <div style={{
              display: 'flex',
              flex: '1 0 0',
              gap: '8px',
              width: '100%'
            }}>
              <div style={{
                flex: '1 0 0',
                height: '100%',
                position: 'relative'
              }}>
                <img src={gridImages[2] || mainImage} alt={`${listing.title} 4`} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
              </div>
              <div style={{
                flex: '1 0 0',
                height: '100%',
                position: 'relative'
              }}>
                <img src={gridImages[3] || mainImage} alt={`${listing.title} 5`} style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} />
                {images.length > 5 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '36px'
                  }}>
                    <button style={{
                      backgroundColor: 'white',
                      border: '1px solid black',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      boxShadow: '0px 1px 2px rgba(31, 41, 55, 0.08)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="6" cy="6" r="2" fill="currentColor"/>
                        <circle cx="12" cy="6" r="2" fill="currentColor"/>
                        <circle cx="18" cy="6" r="2" fill="currentColor"/>
                        <circle cx="6" cy="12" r="2" fill="currentColor"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        <circle cx="18" cy="12" r="2" fill="currentColor"/>
                        <circle cx="6" cy="18" r="2" fill="currentColor"/>
                        <circle cx="12" cy="18" r="2" fill="currentColor"/>
                        <circle cx="18" cy="18" r="2" fill="currentColor"/>
                      </svg>
                      <span style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: 'black',
                        whiteSpace: 'nowrap'
                      }}>Show all photos</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content - Two Columns */}
        <div style={{
          display: 'flex',
          gap: '80px',
          alignItems: 'flex-start',
          width: '100%'
        }}>
          {/* Left Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 0 0',
            gap: '32px',
            alignItems: 'flex-start'
          }}>
            {/* Top Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              alignItems: 'flex-start',
              width: '100%'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%'
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
                    fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '-0.48px',
                    color: '#000000',
                    width: '100%'
                  }}>
                    {listing.property_type || 'Entire rental unit'}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#000000'
                    }}>
                      {listing.guest_capacity || 2} {listing.guest_capacity === 1 ? 'guest' : 'guests'}
                    </div>
                    <div style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: '#000000',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#000000'
                    }}>
                      {listing.bedrooms || 1} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                    </div>
                    <div style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: '#000000',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#000000'
                    }}>
                      {listing.beds || 2} {listing.beds === 1 ? 'bed' : 'beds'}
                    </div>
                    <div style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: '#000000',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#000000'
                    }}>
                      {listing.baths || 1} {listing.baths === 1 ? 'bath' : 'baths'}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '2px',
                      alignItems: 'center'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#de3151" stroke="#de3151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontWeight: 500,
                        fontSize: '15px',
                        lineHeight: '22px',
                        letterSpacing: '-0.3px',
                        color: '#000000'
                      }}>
                        {listing.overall_rating?.toFixed(1) || '4.8'}
                      </div>
                    </div>
                    <div style={{
                      width: '2px',
                      height: '2px',
                      backgroundColor: '#000000',
                      borderRadius: '50%'
                    }} />
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '15px',
                      lineHeight: '22px',
                      letterSpacing: '-0.3px',
                      color: '#000000',
                      textDecoration: 'underline'
                    }}>
                      {listing.total_reviews || 18} {listing.total_reviews === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: '#e5e7eb'
              }} />

              {/* Host Section */}
              <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                width: '100%'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  overflow: 'hidden',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {listing.hosts?.profile_picture_url && listing.hosts.profile_picture_url.trim() !== '' ? (
                    <img 
                      src={listing.hosts.profile_picture_url} 
                      alt={listing.hosts.name} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.host-fallback') as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }} 
                    />
                  ) : null}
                  <div 
                    className="host-fallback"
                    style={{
                      display: listing.hosts?.profile_picture_url ? 'none' : 'flex',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f9fafb'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 0',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#000000',
                    width: '100%'
                  }}>
                    Hosted by {listing.hosts?.name || 'Host'}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    {listing.hosts?.is_superhost && (
                      <>
                        <div style={{
                          fontFamily: '"Graphik Web", sans-serif',
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '-0.28px',
                          color: '#6b7280'
                        }}>
                          Superhost
                        </div>
                        <div style={{
                          width: '2px',
                          height: '2px',
                          backgroundColor: '#000000',
                          borderRadius: '50%'
                        }} />
                      </>
                    )}
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#6b7280'
                    }}>
                      1 month hosting
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: '#e5e7eb'
              }} />
            </div>

            {/* Details Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start'
            }}>
              {listing.key_features && listing.key_features.map((feature, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  width: '670px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getAmenityIcon(feature.title)}
                  </div>
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
                      color: '#000000',
                      width: '100%'
                    }}>
                      {feature.title}
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#6b7280',
                      width: '100%'
                    }}>
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
              {listing.cancellation_policy && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  width: '670px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" fill="white"/>
                      <path d="M10 12H22M10 16H22M10 20H22" stroke="rgba(0, 0, 0, 1)" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 0 0',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: '#000000',
                      width: '100%'
                    }}>
                      {listing.cancellation_policy}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              width: '100%',
              backgroundColor: 'rgba(229, 231, 235, 1)'
            }} />

            {/* Description */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                fontFamily: '"Graphik Web", sans-serif',
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.32px',
                color: '#000000',
                width: '670px'
              }}>
                {listing.full_description || listing.short_description || 'No description available.'}
              </div>
              <button style={{
                backgroundColor: '#f2f2f2',
                display: 'flex',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}>
                <span style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: '#222',
                  textAlign: 'center',
                  width: '96px'
                }}>Show more</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              width: '100%',
              backgroundColor: 'rgba(229, 231, 235, 1)'
            }} />

            {/* Where you'll sleep */}
            {listing.sleeping_arrangements && listing.sleeping_arrangements.length > 0 && (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '-0.48px',
                    color: '#000000',
                    width: '670px'
                  }}>
                    Where you'll sleep
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'flex-start',
                    width: '320px'
                  }}>
                    <div style={{
                      height: '196px',
                      borderRadius: '8px',
                      width: '100%',
                      overflow: 'hidden'
                    }}>
                      <img src="http://localhost:3845/assets/6bd77392b47f49bd648d7043a139fecc8bb2eff2.png" alt="Bedroom" style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }} />
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      width: '100%'
                    }}>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px',
                        color: '#000000',
                        width: '100%'
                      }}>
                        {listing.sleeping_arrangements[0].room}
                      </div>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: '#000000',
                        width: '100%'
                      }}>
                        {listing.sleeping_arrangements[0].beds}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <div style={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: 'rgba(229, 231, 235, 1)'
                }} />
              </>
            )}

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '-0.48px',
                    color: '#000000',
                    width: '670px'
                  }}>
                    What this place offers
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '24px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    {/* Left Column */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '1 0 0',
                      gap: '16px',
                      alignItems: 'flex-start'
                    }}>
                      {listing.amenities.slice(0, Math.ceil(listing.amenities.length / 2)).map((amenity) => (
                        <div key={amenity.id} style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getAmenityIcon(amenity.name)}
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1 0 0',
                            alignItems: 'flex-start'
                          }}>
                            <div style={{
                              fontFamily: '"Graphik Web", sans-serif',
                              fontSize: '16px',
                              lineHeight: '24px',
                              letterSpacing: '-0.32px',
                              color: '#000000',
                              width: '100%'
                            }}>
                              {amenity.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Right Column */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '1 0 0',
                      gap: '16px',
                      alignItems: 'flex-start'
                    }}>
                      {listing.amenities.slice(Math.ceil(listing.amenities.length / 2)).map((amenity) => (
                        <div key={amenity.id} style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getAmenityIcon(amenity.name)}
                          </div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1 0 0',
                            alignItems: 'flex-start'
                          }}>
                            <div style={{
                              fontFamily: '"Graphik Web", sans-serif',
                              fontSize: '16px',
                              lineHeight: '24px',
                              letterSpacing: '-0.32px',
                              color: '#000000',
                              width: '100%'
                            }}>
                              {amenity.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {listing.amenities.length > 10 && (
                    <button style={{
                      backgroundColor: 'white',
                      border: '1px solid black',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      boxShadow: '0px 1px 2px rgba(31, 41, 55, 0.08)',
                      cursor: 'pointer'
                    }}>
                      <span style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: 'black'
                      }}>Show all {listing.amenities.length} amenities</span>
                    </button>
                  )}
                </div>
                {/* Divider */}
                <div style={{
                  height: '1px',
                  width: '100%',
                  backgroundColor: 'rgba(229, 231, 235, 1)'
                }} />
              </>
            )}
          </div>

          {/* Right Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
            width: '370px',
            flexShrink: 0,
            position: 'sticky',
            top: `${stickyTop}px`,
            alignSelf: 'flex-start'
          }}>
            {/* Booking Box */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0px 20px 25px rgba(31, 41, 55, 0.1), 0px 10px 10px rgba(31, 41, 55, 0.04)',
              width: '100%'
            }}>
              {/* Price Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  flex: '1 0 0',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '20px',
                    lineHeight: '32px',
                    letterSpacing: '-0.4px',
                    color: '#000000'
                  }}>
                    ${listing.price_per_night || 75}
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#000000',
                    width: '6px'
                  }}>
                    /
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#000000',
                    width: '39px'
                  }}>
                    night
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                overflow: 'hidden',
                borderRadius: '8px',
                width: '100%'
              }}>
                {/* Check-in/Check-out Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  width: '100%',
                  position: 'relative'
                }}>
                  {/* Check-in */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flex: '1 0 0',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '10px',
                      lineHeight: '16px',
                      color: '#000000',
                      width: '100%'
                    }}>
                      CHECK-IN
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#6b7280',
                      width: '100%'
                    }}>
                      1/18/2026
                    </div>
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      backgroundColor: '#d1d5db'
                    }} />
                  </div>
                  {/* Check-out */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flex: '1 0 0',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px',
                    position: 'relative'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '10px',
                      lineHeight: '16px',
                      color: '#000000',
                      width: '100%'
                    }}>
                      CHECKOUT
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#6b7280',
                      width: '100%'
                    }}>
                      1/25/2026
                    </div>
                  </div>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '1px',
                    backgroundColor: '#d1d5db'
                  }} />
                </div>
                {/* Guests Row */}
                <div style={{
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  gap: '16px',
                  height: '52px',
                  alignItems: 'center',
                  padding: '8px',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 0 0',
                    height: '100%',
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '10px',
                      lineHeight: '16px',
                      color: '#000000',
                      width: '100%'
                    }}>
                      GUESTS
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#6b7280',
                      width: '100%'
                    }}>
                      {listing.guest_capacity || 2} guests
                    </div>
                  </div>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Reserve Button */}
              <button 
                onClick={() => {
                  if (id) {
                    navigate(`/listing/${id}/confirm`);
                  }
                }}
                style={{
                  backgroundColor: '#de3151',
                  display: 'flex',
                  flex: '1 0 0',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  boxShadow: '0px 1px 2px rgba(31, 41, 55, 0.08)',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
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
                }}>Reserve</span>
              </button>

              {/* You won't be charged yet */}
              <div style={{
                fontFamily: '"Graphik Web", sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.28px',
                color: '#6b7280',
                textAlign: 'center',
                width: '100%'
              }}>
                You won't be charged yet
              </div>

              {/* Price Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'flex-start',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    flex: '1 0 0',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: '#000000'
                    }}>
                      ${listing.price_per_night || 79} x 7 nights
                    </div>
                  </div>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#000000',
                    textAlign: 'right'
                  }}>
                    ${((listing.price_per_night || 79) * 7).toFixed(0)}
                  </div>
                </div>
                {listing.weekly_discount_percent && (
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      flex: '1 0 0',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      color: '#000000'
                    }}>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px'
                      }}>
                        Weekly discount
                      </div>
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: '#10b981',
                      textAlign: 'right'
                    }}>
                      -${Math.round((listing.price_per_night || 79) * 7 * (listing.weekly_discount_percent / 100)).toFixed(0)}
                    </div>
                  </div>
                )}
                {listing.cleaning_fee && (
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      flex: '1 0 0',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      color: '#000000'
                    }}>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px'
                      }}>
                        Cleaning fee
                      </div>
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: '#000000',
                      textAlign: 'right'
                    }}>
                      ${listing.cleaning_fee}
                    </div>
                  </div>
                )}
                {listing.service_fee_percent && (
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      flex: '1 0 0',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      color: '#000000'
                    }}>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px'
                      }}>
                        Service fee
                      </div>
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: '#000000',
                      textAlign: 'right'
                    }}>
                      ${Math.round((listing.price_per_night || 79) * 7 * (listing.service_fee_percent / 100)).toFixed(0)}
                    </div>
                  </div>
                )}
                {listing.occupancy_tax_percent && (
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    <div style={{
                      display: 'flex',
                      flex: '1 0 0',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      color: '#000000'
                    }}>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px'
                      }}>
                        Occupancy taxes and fees
                      </div>
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '24px',
                      letterSpacing: '-0.32px',
                      color: '#000000',
                      textAlign: 'right'
                    }}>
                      ${Math.round((listing.price_per_night || 79) * 7 * (listing.occupancy_tax_percent / 100)).toFixed(0)}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div style={{
                height: '1px',
                width: '100%',
                backgroundColor: '#dbdbdb'
              }} />

              {/* Total */}
              <div style={{
                display: 'flex',
                fontFamily: '"Graphik Web", sans-serif',
                gap: '16px',
                alignItems: 'flex-start',
                width: '100%',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.32px',
                color: '#000000'
              }}>
                <div style={{
                  display: 'flex',
                  flex: '1 0 0',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div>Total</div>
                </div>
                <div style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.32px',
                  color: '#000000',
                  textAlign: 'right'
                }}>
                  ${(() => {
                    const base = (listing.price_per_night || 79) * 7;
                    const discount = listing.weekly_discount_percent ? base * (listing.weekly_discount_percent / 100) : 0;
                    const cleaning = listing.cleaning_fee || 0;
                    const service = listing.service_fee_percent ? base * (listing.service_fee_percent / 100) : 0;
                    const tax = listing.occupancy_tax_percent ? base * (listing.occupancy_tax_percent / 100) : 0;
                    return Math.round(base - discount + cleaning + service + tax);
                  })()}
                </div>
              </div>
            </div>

            {/* Report this listing */}
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{
                fontFamily: '"Graphik Web", sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                letterSpacing: '-0.28px',
                color: '#6b7280'
              }}>
                Report this listing
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {listing.reviews && listing.reviews.length > 0 && (
          <>
            <div ref={reviewSectionRef} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              alignItems: 'flex-start',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#de3151" stroke="#de3151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '-0.48px',
                    color: '#000000'
                  }}>
                    {listing.overall_rating?.toFixed(1) || '5.0'}
                  </div>
                </div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#000000',
                  borderRadius: '50%'
                }} />
                <div style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '24px',
                  lineHeight: '32px',
                  letterSpacing: '-0.48px',
                  color: '#000000'
                }}>
                  {listing.reviews.length} {listing.reviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Rating Breakdown */}
              <div style={{
                display: 'flex',
                gap: '80px',
                alignItems: 'flex-start',
                width: '100%'
              }}>
                {/* Left Column */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 0',
                  gap: '16px',
                  alignItems: 'flex-start',
                  paddingRight: '80px'
                }}>
                  {['Cleanliness', 'Communication', 'Check-in'].map((category) => (
                    <div key={category} style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      width: '100%'
                    }}>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px',
                        color: '#000000',
                        flex: '1 0 0'
                      }}>
                        {category}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        <div style={{
                          backgroundColor: '#e5e7eb',
                          height: '4px',
                          borderRadius: '1px',
                          width: '120px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            backgroundColor: '#000000',
                            height: '100%',
                            width: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0
                          }} />
                        </div>
                        <div style={{
                          fontFamily: '"Graphik Web", sans-serif',
                          fontSize: '12px',
                          lineHeight: '16px',
                          color: '#000000',
                          fontWeight: 400
                        }}>
                          5.0
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Right Column */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '1 0 0',
                  gap: '16px',
                  alignItems: 'flex-start',
                  paddingRight: '80px'
                }}>
                  {['Accuracy', 'Location', 'Value'].map((category, idx) => {
                    const ratings = ['5.0', '4.9', '4.7'];
                    const widths = ['100%', '98%', '94%'];
                    return (
                      <div key={category} style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        width: '100%'
                      }}>
                        <div style={{
                          fontFamily: '"Graphik Web", sans-serif',
                          fontSize: '16px',
                          lineHeight: '24px',
                          letterSpacing: '-0.32px',
                          color: '#000000',
                          flex: '1 0 0'
                        }}>
                          {category}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center'
                        }}>
                          <div style={{
                            backgroundColor: '#e5e7eb',
                            height: '4px',
                            borderRadius: '1px',
                            width: '120px',
                            position: 'relative',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              backgroundColor: '#000000',
                              height: '100%',
                              width: widths[idx],
                              position: 'absolute',
                              left: 0,
                              top: 0
                            }} />
                          </div>
                          <div style={{
                            fontFamily: '"Graphik Web", sans-serif',
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: '#000000',
                            fontWeight: 400
                          }}>
                            {ratings[idx]}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews Grid */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                alignItems: 'flex-start',
                width: '100%'
              }}>
                {/* Review Rows */}
                {[0, 2].map((startIdx) => (
                  <div key={startIdx} style={{
                    display: 'flex',
                    gap: '80px',
                    alignItems: 'flex-start',
                    width: '100%'
                  }}>
                    {listing.reviews.slice(startIdx, startIdx + 2).map((review) => (
                      <div key={review.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1 0 0',
                        gap: '16px',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          {/* Always show circular avatar frame */}
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            flexShrink: 0,
                            backgroundColor: '#f2f2f2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {review.reviewer_avatar_url ? (
                              <img src={review.reviewer_avatar_url} alt={review.reviewer_name} style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }} />
                            ) : (
                              <div style={{
                                fontFamily: '"Graphik Web", sans-serif',
                                fontWeight: 500,
                                fontSize: '20px',
                                lineHeight: '24px',
                                color: '#6b7280',
                                textTransform: 'uppercase'
                              }}>
                                {review.reviewer_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                            )}
                          </div>
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
                              color: '#000000',
                              width: '100%'
                            }}>
                              {review.reviewer_name}
                            </div>
                            <div style={{
                              fontFamily: '"Graphik Web", sans-serif',
                              fontSize: '14px',
                              lineHeight: '20px',
                              letterSpacing: '-0.28px',
                              color: '#6b7280',
                              width: '100%'
                            }}>
                              {new Date(review.review_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <div style={{
                            fontFamily: '"Graphik Web", sans-serif',
                            fontSize: '16px',
                            lineHeight: '24px',
                            letterSpacing: '-0.32px',
                            color: '#000000',
                            width: '100%'
                          }}>
                            {review.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {listing.reviews.length > 4 && (
                <button style={{
                  backgroundColor: 'white',
                  border: '1px solid black',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  boxShadow: '0px 1px 2px rgba(31, 41, 55, 0.08)',
                  cursor: 'pointer'
                }}>
                  <span style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '-0.28px',
                    color: 'black'
                  }}>Show all {listing.reviews.length} reviews</span>
                </button>
              )}
            </div>
            {/* Divider */}
            <div style={{
              height: '1px',
              width: '100%',
              backgroundColor: '#dbdbdb'
            }} />
          </>
        )}

        {/* About the Host */}
        {listing.hosts && (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              alignItems: 'flex-start',
              width: '100%'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'flex-start',
                width: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div style={{
                    position: 'relative',
                    width: '56px',
                    height: '56px',
                    flexShrink: 0,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {listing.hosts.profile_picture_url ? (
                      <img src={listing.hosts.profile_picture_url} alt={listing.hosts.name} style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }} onError={(e) => {
                        const target = e.currentTarget;
                        const fallbackSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E`;
                        target.src = fallbackSvg;
                        target.classList.add('broken-image-fallback');
                        target.style.objectFit = 'none';
                        target.style.objectPosition = 'center';
                      }} />
                    ) : (
                      <img 
                        src={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E`}
                        alt={listing.hosts.name || 'Host'}
                        className="broken-image-fallback"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'none',
                          objectPosition: 'center'
                        }}
                      />
                    )}
                    {listing.hosts.is_superhost && (
                      <div style={{
                        position: 'absolute',
                        height: '28px',
                        left: '40px',
                        top: '28px',
                        width: '15.898px'
                      }}>
                        {/* Superhost badge placeholder */}
                      </div>
                    )}
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: '1 0 0',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontWeight: 500,
                      fontSize: '24px',
                      lineHeight: '32px',
                      letterSpacing: '-0.48px',
                      color: '#000000',
                      width: '100%'
                    }}>
                      Hosted by {listing.hosts.name}
                    </div>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#6b7280',
                      width: '100%'
                    }}>
                      Joined {listing.hosts.join_date ? new Date(listing.hosts.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2025'}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#de3151" stroke="#de3151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div style={{
                      fontFamily: '"Graphik Web", sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.28px',
                      color: '#000000'
                    }}>
                      {listing.hosts.total_reviews || 8} Reviews
                    </div>
                  </div>
                  {listing.hosts.is_identity_verified && (
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#de3151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12l2 2 4-4" stroke="#de3151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: '#000000'
                      }}>
                        Identity verified
                      </div>
                    </div>
                  )}
                  {listing.hosts.is_superhost && (
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#de3151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#de3151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div style={{
                        fontFamily: '"Graphik Web", sans-serif',
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '-0.28px',
                        color: '#000000'
                      }}>
                        Superhost
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                alignItems: 'flex-start',
                paddingRight: '680px',
                width: '100%'
              }}>
                <div style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.32px',
                  color: '#000000',
                  width: '100%'
                }}>
                  {listing.hosts.name} is a Superhost
                </div>
                <div style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '-0.32px',
                  color: '#6b7280',
                  width: '100%'
                }}>
                  Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
                </div>
                {listing.hosts.response_rate && (
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#6b7280',
                    width: '100%'
                  }}>
                    Response rate: {listing.hosts.response_rate}%
                  </div>
                )}
                {listing.hosts.response_time && (
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#6b7280',
                    width: '100%'
                  }}>
                    Response time: {listing.hosts.response_time}
                  </div>
                )}
                {listing.hosts.description && (
                  <div style={{
                    fontFamily: '"Graphik Web", sans-serif',
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '-0.32px',
                    color: '#6b7280',
                    width: '100%',
                    marginTop: '8px'
                  }}>
                    {listing.hosts.description}
                  </div>
                )}
              </div>
              <button style={{
                backgroundColor: '#f2f2f2',
                display: 'flex',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer'
              }}>
                <span style={{
                  fontFamily: '"Graphik Web", sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '-0.28px',
                  color: '#222',
                  textAlign: 'center',
                  width: '96px'
                }}>Message Host</span>
              </button>
            </div>
          </>
        )}
    </div>
  );
}
