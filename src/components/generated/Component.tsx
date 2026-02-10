import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchListings } from '../../lib/supabase-queries';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { ListingCard as ListingCardType } from '../../types/database';
import { Header, SearchField, ListingCard, Button, Footer, UserMenu } from '../../design-system';
import { PORTAL_VIDEO_URL, PORTAL_POSTER_URL, MINDSCAPES_ICON_URL } from '../../design-system/patterns/Header/header-nav-assets';
import { HelpCircle, Menu } from 'lucide-react';
import { ListingCardSkeleton } from '../ListingCardSkeleton';

// Mock data - fallback until Supabase is populated (prices in Bitcoin)
const MOCK_LISTINGS: ListingCardType[] = [
  {
    id: 'mock-1',
    title: "Shah Jahan's Marble Suite in Agra",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg",
    price: "₿0.019032 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-2',
    title: "SpaceX Mars Colony Pod at Olympus Mons",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
    price: "₿0.008244 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-3',
    title: "The Lost Atlantean Crystal Villa",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/bbe5b882-690a-4661-836a-08f66193c3f1.jpg",
    price: "₿0.012540 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-4',
    title: "First-Class Suite in Titanic April 1912",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg",
    price: "₿0.006768 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-5',
    title: "WWII German Resistance Safehouse Loft",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/b2e96b48-0491-4bea-a1df-887341cc53d5.jpg",
    price: "₿0.003576 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-6',
    title: "Pandora Floating Mountain Bungalow",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1221494e-450b-4112-b3ec-6845b91292d6.png",
    price: "₿0.027180 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-7',
    title: "Ancient Egyptian Nile Villa (Old Kingdom)",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/04c1ff57-425d-4847-8646-178516b6c4f3.png",
    price: "₿0.009384 / hour",
    date: "330 BCE",
  },
  {
    id: 'mock-8',
    title: "Alexander the Great's Campaign Tent",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/31951292-b7a3-4d4e-9d00-944e3fd01f43.jpg",
    price: "₿0.008244 / hour",
    date: "330 BCE",
  },
  {
    id: 'mock-9',
    title: "1990s Manhattan Loft in Pre-Internet NYC",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1e517539-a473-4b2a-b992-a49cc7dbbe8e.jpg",
    price: "₿0.002748 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-10',
    title: "Shah Jahan's Marble Suite in Agra",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg",
    price: "₿0.019032 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-11',
    title: "First-Class Suite in Titanic April 1912",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg",
    price: "₿0.006768 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-12',
    title: "SpaceX Mars Colony Pod at Olympus Mons",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
    price: "₿0.008244 / hour",
    rating: "4.82",
  },
];

const FIGMA_NAV_ITEMS = [
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
      <Button variant="ghost" size="md" style={{ color: 'var(--ds-navbar-active)' }}>
        Become a host
      </Button>
      <button type="button" className="ds-header-right-icon-btn" aria-label="Help">
        <HelpCircle size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
      </button>
      <button
        type="button"
        className="ds-header-right-icon-btn"
        aria-label="Menu"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <Menu size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
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

export const AirbnbUi = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingCardType[]>(MOCK_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadListings() {
      if (!isSupabaseConfigured()) {
        // Keep showing MOCK_LISTINGS; no fetch attempted
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchListings();
        if (data && data.length > 0) {
          setListings(data);
        }
        // If configured but no data returned, keep current state (mock or empty)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    }
    loadListings();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--ds-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        brandName="warpbnb"
        navItems={FIGMA_NAV_ITEMS}
        activeNavLabel="Time Travel"
        onNavClick={() => {}}
        rightSlot={<HeaderRightSlotWithUserMenu />}
      />

      <div
        style={{
          width: '100%',
          padding: 'var(--ds-spacing-12) 0 var(--ds-spacing-32) 0',
          backgroundColor: 'var(--ds-surface-header)',
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '1px solid var(--ds-border-light)',
        }}
      >
        <SearchField
          onSearch={() => {}}
          where={{ label: 'Where', placeholder: 'Search destinations' }}
          era={{ label: 'Era', placeholder: 'Select Timeline' }}
          who={{ label: 'Who', placeholder: 'Add guests' }}
        />
      </div>

      {!isSupabaseConfigured() && (
        <div
          style={{
            padding: 'var(--ds-spacing-12) var(--ds-spacing-80)',
            backgroundColor: 'var(--ds-surface-header)',
            borderBottom: '1px solid var(--ds-border-light)',
            fontSize: 'var(--ds-text-14)',
            color: 'var(--ds-text-secondary)',
          }}
          role="status"
        >
          Using demo data. To load from Supabase: add{' '}
          <code style={{ background: 'var(--ds-border-light)', padding: '2px 6px', borderRadius: 4 }}>
            VITE_SUPABASE_URL
          </code>{' '}
          and{' '}
          <code style={{ background: 'var(--ds-border-light)', padding: '2px 6px', borderRadius: 4 }}>
            VITE_SUPABASE_ANON_KEY
          </code>{' '}
          to <code style={{ background: 'var(--ds-border-light)', padding: '2px 6px', borderRadius: 4 }}>.env.local</code> (see{' '}
          <code>.env.example</code>), then restart the dev server.
        </div>
      )}

      <main
        style={{
          flex: 1,
          padding: 'var(--ds-spacing-40) var(--ds-spacing-80)',
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: 'var(--ds-spacing-16)',
              rowGap: 'var(--ds-spacing-40)',
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              padding: 'var(--ds-spacing-40)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 'var(--ds-text-18)',
                fontWeight: 'var(--ds-font-medium)',
                color: 'var(--ds-text-primary)',
                marginBottom: 'var(--ds-spacing-12)',
              }}
            >
              {error}
            </div>
            <div
              style={{
                fontSize: 'var(--ds-text-14)',
                color: 'var(--ds-text-secondary)',
                marginBottom: 'var(--ds-spacing-20)',
              }}
            >
              Please check your Supabase configuration in .env.local
            </div>
            <Button variant="primary" size="md" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : listings.length === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              fontSize: 'var(--ds-text-16)',
              color: 'var(--ds-text-secondary)',
            }}
          >
            No listings found. Add listings via the Supabase dashboard.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              columnGap: 'var(--ds-spacing-16)',
              rowGap: 'var(--ds-spacing-40)',
            }}
          >
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                image={listing.image}
                title={listing.title}
                year={listing.date}
                price={listing.price}
                rating={listing.rating}
                isGuestFavorite={listing.isGuestFavorite}
                onClick={() => navigate(`/listing/${listing.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer
        copyrightText="© 2026 Warpbnb, Inc."
        links={[
          { label: 'Built with Vibes' },
          { label: 'Help' },
          { label: 'FAQ' },
          { label: 'Contact' },
        ]}
        languageLabel="English (US)"
        style={{
          paddingLeft: 'var(--ds-spacing-80)',
          paddingRight: 'var(--ds-spacing-80)',
        }}
      />
    </div>
  );
};
