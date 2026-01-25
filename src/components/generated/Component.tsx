import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchListings } from '../../lib/supabase-queries';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { ListingCard } from '../../types/database';

// Mock data - fallback until Supabase is populated
const MOCK_LISTINGS: ListingCard[] = [
  {
    id: 'mock-1',
    title: "Shah Jahan's Marble Suite in Agra",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg",
    price: "$1,586 for 1 night",
    rating: "4.82",
    isGuestFavorite: true
  },
  {
    id: 'mock-2',
    title: "SpaceX Mars Colony Pod at Olympus Mons",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
    price: "$687 for 1 night",
    rating: "4.82"
  },
  {
    id: 'mock-3',
    title: "The Lost Atlantean Crystal Villa",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/bbe5b882-690a-4661-836a-08f66193c3f1.jpg",
    price: "$1,045 for 1 night",
    rating: "4.82"
  },
  {
    id: 'mock-4',
    title: "First-Class Suite in Titanic April 1912",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg",
    price: "$564 for 1 night",
    rating: "4.82"
  },
  {
    id: 'mock-5',
    title: "WWII German Resistance Safehouse Loft",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/b2e96b48-0491-4bea-a1df-887341cc53d5.jpg",
    price: "$298 for 1 night",
    rating: "4.82"
  },
  {
    id: 'mock-6',
    title: "Pandora Floating Mountain Bungalow",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1221494e-450b-4112-b3ec-6845b91292d6.png",
    price: "$2,265 for 1 night",
    rating: "4.82",
    isGuestFavorite: true
  },
  {
    id: 'mock-7',
    title: "Ancient Egyptian Nile Villa (Old Kingdom)",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/04c1ff57-425d-4847-8646-178516b6c4f3.png",
    price: "$782 for 1 night",
    date: "330 BCE"
  },
  {
    id: 'mock-8',
    title: "Alexander the Great's Campaign Tent",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/31951292-b7a3-4d4e-9d00-944e3fd01f43.jpg",
    price: "$687 for 1 night",
    date: "330 BCE"
  },
  {
    id: 'mock-9',
    title: "1990s Manhattan Loft in Pre-Internet NYC",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1e517539-a473-4b2a-b992-a49cc7dbbe8e.jpg",
    price: "$229 for 1 night",
    rating: "4.82"
  },
  {
    id: 'mock-10',
    title: "Shah Jahan's Marble Suite in Agra",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg",
    price: "$1,586 for 1 night",
    rating: "4.82",
    isGuestFavorite: true
  },
  {
    id: 'mock-11',
    title: "First-Class Suite in Titanic April 1912",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg",
    price: "$564 for 1 night",
    rating: "4.82"
  },
  {
    id: 'mock-12',
    title: "SpaceX Mars Colony Pod at Olympus Mons",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
    price: "$687 for 1 night",
    rating: "4.82"
  }
];
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
const VerticalDivider = () => <div style={{
  width: '1px',
  height: '32px',
  backgroundColor: 'rgba(217, 217, 217, 1)',
  alignSelf: 'center'
}} />;
const GuestFavBadge = () => <div style={{
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '6px 12px 5px 12px',
  gap: '10px',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.16)',
  borderRadius: '3000px',
  position: 'absolute',
  top: '12px',
  left: '12px',
  zIndex: 2
}}>
    <span style={{
    color: 'rgba(34, 34, 34, 1)',
    fontSize: '11px',
    fontFamily: '"Graphik Web", sans-serif',
    fontWeight: 500,
    lineHeight: '10px',
    letterSpacing: '-0.2px'
  }}>
      Guest favorite
    </span>
  </div>;
const HeartIcon = ({
  active,
  onClick
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => <button onClick={onClick} style={{
  position: 'absolute',
  right: '12px',
  top: '12px',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
    <svg width="24" height="24" viewBox="0 0 32 32" style={{
    fill: active ? '#FF385C' : 'rgba(0, 0, 0, 0.5)',
    stroke: 'white',
    strokeWidth: 2,
    transition: 'transform 0.2s ease'
  }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0 6.98 6.98 0 0 0 0 9.9C4 18 11 23.27 16 28z" />
    </svg>
  </button>;
interface ListingProps {
  id: string;
  image: string;
  title: string;
  price: string;
  rating?: string;
  date?: string;
  isGuestFavorite?: boolean;
}
const ListingCard = ({
  id,
  image,
  title,
  price,
  rating,
  date,
  isGuestFavorite
}: ListingProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    navigate(`/listing/${id}`);
  };
  
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    width: '100%'
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handleClick}>
      <div style={{
      height: '248px',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f3f3f3'
    }}>
        <img src={image} alt={title} style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'filter 0.3s ease',
        filter: isHovered ? 'brightness(0.95)' : 'none'
      }} />
        {isGuestFavorite && <GuestFavBadge />}
        <HeartIcon active={isLiked} onClick={e => {
        e.stopPropagation();
        setIsLiked(!isLiked);
      }} />
      </div>
      <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      paddingLeft: '4px'
    }}>
        <span style={{
        fontSize: '14px',
        fontFamily: '"Graphik Web", sans-serif',
        fontWeight: 500,
        lineHeight: '18px',
        letterSpacing: '-0.28px',
        color: 'rgba(34, 34, 34, 1)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
          {title}
        </span>
        <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '4px',
        color: 'rgba(113, 113, 113, 1)',
        fontSize: '12px',
        fontFamily: '"Graphik Web", sans-serif'
      }}>
          <span>{price}</span>
          <span style={{
          fontSize: '12px',
          fontWeight: 800
        }}>·</span>
          {rating ? <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px'
        }}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/0bc13d9c-d0a5-45f5-8075-bdc94a12af24.svg" alt="star" style={{
            width: '12px',
            height: '12px'
          }} />
              <span>{rating}</span>
            </div> : <span>{date}</span>}
        </div>
      </div>
    </div>;
};
export const AirbnbUi = () => {
  const [activeTab, setActiveTab] = useState('Time Travel');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  // Initialize with mock data immediately to prevent blank screen
  const [listings, setListings] = useState<ListingCard[]>(MOCK_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListings() {
      // If Supabase is not configured, use mock data (already set as initial state)
      if (!isSupabaseConfigured()) {
        console.warn('⚠️ Supabase not configured. Please create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
        console.log('Using mock data (only mock-2 has data)');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('🔄 Loading listings from Supabase...');
        const data = await fetchListings();
        // Only use Supabase data if we got results, otherwise keep mock data
        if (data && data.length > 0) {
          console.log(`✅ Loaded ${data.length} listings from Supabase`);
          setListings(data);
        } else {
          console.warn('⚠️ No listings from Supabase, keeping mock data');
        }
      } catch (err) {
        console.error('❌ Failed to load listings from Supabase:', err);
        // Keep mock data if Supabase fails
        setError(null); // Don't show error, just use mock data
      } finally {
        setIsLoading(false);
      }
    }

    loadListings();
  }, []);

  const navItems = [{
    label: 'Homes',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/049c1522-ce42-4a6a-9fe2-74ddbee53971.png'
  }, {
    label: 'Experiences',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ec4befb5-f8d2-460c-bd98-9e3d5a3e16e8.png'
  }, {
    label: 'Services',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/3e65e158-8c5e-4f56-9efa-9a9faa7db084.png'
  }, {
    label: 'Time Travel',
    icon: 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/9be8222d-7ffa-4c1a-a97f-6b3ed6400a37.png'
  }] as any[];
  return <div style={{
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    display: 'flex',
    flexDirection: 'column'
  }}>
      {/* Header */}
      <header style={{
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
      zIndex: 10
    }}>
        {/* Logo */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        flex: 1
      }}>
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
          {navItems.map(item => <button key={item.label} onClick={() => setActiveTab(item.label)} style={{
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
              fontWeight: activeTab === item.label ? 500 : 400,
              color: activeTab === item.label ? 'rgba(34, 34, 34, 1)' : 'rgba(106, 106, 106, 1)'
            }}>
                  {item.label}
                </span>
              </div>
              <div style={{
            height: '3px',
            backgroundColor: activeTab === item.label ? 'rgba(34, 34, 34, 1)' : 'transparent',
            width: '100%',
            borderRadius: '30px',
            marginTop: 'auto',
            marginBottom: '6px'
          }} />
            </button>)}
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
      </header>

      {/* Filter Bar */}
      <div style={{
      width: '100%',
      padding: '12px 0 32px 0',
      backgroundColor: 'rgba(251, 251, 251, 1)',
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(235, 235, 235, 1)',
      overflow: 'visible'
    }}>
        <div style={{
        width: '851px',
        height: '64px',
        backgroundColor: 'white',
        borderRadius: '40px',
        boxShadow: '0px 0px 10px rgba(217, 217, 217, 1), 0px 1px 2px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid rgba(217, 217, 217, 1)'
      }}>
          {/* Where */}
          <button style={{
          flex: 1,
          height: '100%',
          borderRadius: '40px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }} onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
          setHoveredSection('where');
        }} onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          setHoveredSection(null);
        }}>
            <span style={{
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: '"Graphik Web", sans-serif'
          }}>Where</span>
            <span style={{
            fontSize: '14px',
            color: 'rgba(117, 117, 117, 1)',
            fontFamily: '"Graphik Web", sans-serif'
          }}>Search destinations</span>
          </button>
          
          {hoveredSection !== 'where' && hoveredSection !== 'era' && <VerticalDivider />}

          {/* Era */}
          <button style={{
          flex: 1,
          height: '100%',
          borderRadius: '40px',
          backgroundColor: 'transparent',
          border: 'none',
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }} onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
          setHoveredSection('era');
        }} onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          setHoveredSection(null);
        }}>
            <span style={{
            fontSize: '12px',
            fontWeight: 500,
            fontFamily: '"Graphik Web", sans-serif'
          }}>Era</span>
            <span style={{
            fontSize: '14px',
            color: 'rgba(117, 117, 117, 1)',
            fontFamily: '"Graphik Web", sans-serif'
          }}>Select Timeline</span>
          </button>

          {hoveredSection !== 'era' && hoveredSection !== 'who' && <VerticalDivider />}

          {/* Who */}
          <div style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingRight: '8px',
          borderRadius: '40px'
        }}>
            <button style={{
            flex: 1,
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '40px',
            transition: 'background-color 0.2s ease'
          }} onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
            setHoveredSection('who');
          }} onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            setHoveredSection(null);
          }}>
              <span style={{
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: '"Graphik Web", sans-serif'
            }}>Who</span>
              <span style={{
              fontSize: '14px',
              color: 'rgba(117, 117, 117, 1)',
              fontFamily: '"Graphik Web", sans-serif'
            }}>Add guests</span>
            </button>
            <button style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#FF395C',
            borderRadius: '40px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E31C5F'} onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF395C'}>
              <img src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/f975c59b-04fd-4808-a40e-760aa2e52f5a.svg" alt="Search" style={{
              width: '24px',
              height: '24px'
            }} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main style={{
      flex: 1,
      padding: '40px 80px',
      maxWidth: '1280px',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '16px',
            fontFamily: '"Graphik Web", sans-serif',
            color: 'rgba(113, 113, 113, 1)'
          }}>
            Loading listings...
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
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
              {error}
            </div>
            <div style={{
              fontSize: '14px',
              fontFamily: '"Graphik Web", sans-serif',
              color: 'rgba(113, 113, 113, 1)',
              marginBottom: '20px'
            }}>
              Please check your Supabase configuration in .env.local
            </div>
            <button onClick={() => window.location.reload()} style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#FF395C',
              color: 'white',
              fontSize: '14px',
              fontFamily: '"Graphik Web", sans-serif',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              Retry
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '16px',
            fontFamily: '"Graphik Web", sans-serif',
            color: 'rgba(113, 113, 113, 1)'
          }}>
            No listings found. Add listings via the Supabase dashboard.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            columnGap: '16px',
            rowGap: '40px'
          }}>
            {listings.map((listing) => <ListingCard key={listing.id} {...listing} />)}
          </div>
        )}
      </main>
    </div>;
};