import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchListings } from '../../lib/supabase-queries';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { ListingCard as ListingCardType } from '../../types/database';
import {
  Header,
  SearchField,
  ListingCard,
  Button,
  Footer,
  ThemePicker,
  EraPicker,
  GuestPicker,
} from '../../design-system';
import type { SearchFieldHoverSection } from '../../design-system';
import {
  getThemeOptions,
  getEraOptions,
  getThemeLabel,
  getEraLabel,
} from '../../lib/homepage-filters';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../../design-system/patterns/Header/header-nav-assets';
import { HeaderRightSlotWithUserMenu } from '../HeaderRightSlotWithUserMenu';
import { ListingCardSkeleton } from '../ListingCardSkeleton';
import { useIsMobile } from '../../hooks/use-mobile';

// Mock data - fallback until Supabase is populated (prices in Bitcoin)
// Ordered according to homepage display order
const MOCK_LISTINGS: ListingCardType[] = [
  {
    id: 'mock-3',
    title: "The Lost Atlantean Crystal Villa",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/bbe5b882-690a-4661-836a-08f66193c3f1.jpg",
    price: "₿0.012540 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-9',
    title: "1990s Manhattan Loft in Pre-Internet NYC",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1e517539-a473-4b2a-b992-a49cc7dbbe8e.jpg",
    price: "₿0.002748 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-8',
    title: "Alexander the Great's Campaign Tent — Persia, 330 BCE",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/31951292-b7a3-4d4e-9d00-944e3fd01f43.jpg",
    price: "₿0.008244 / hour",
    date: "330 BCE",
  },
  {
    id: 'mock-1',
    title: "Shah Jahan's Marble Suite — Agra, 1650",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg",
    price: "₿0.019032 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-2',
    title: "SpaceX Mars Colony Pod at Olympus Mons",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
    price: "₿0.008244 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-4',
    title: "Titanic First-Class Suite — April 1912",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg",
    price: "₿0.006768 / hour",
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
    id: 'mock-5',
    title: "WWII German Resistance Safehouse Loft",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/b2e96b48-0491-4bea-a1df-887341cc53d5.jpg",
    price: "₿0.003576 / hour",
    rating: "4.82",
  },
];

const FIGMA_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

export const AirbnbUi = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingCardType[]>(MOCK_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const searchBarAreaRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const [showHeaderDivider, setShowHeaderDivider] = useState(false);

  // Filter state: applied only when user clicks Search
  const [activeSection, setActiveSection] = useState<SearchFieldHoverSection>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [adultsCount, setAdultsCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const totalGuestCount = adultsCount + childrenCount;

  const pickerStorageBaseUrl = useMemo(() => {
    const url = (import.meta as { env?: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL;
    console.log('🔍 [Picker Debug] VITE_SUPABASE_URL:', url);
    if (!url || typeof url !== 'string') {
      console.warn('⚠️ [Picker Debug] VITE_SUPABASE_URL not found or invalid, returning null');
      return null;
    }
    const base = url.replace(/\/$/, '');
    const fullUrl = `${base}/storage/v1/object/public/listing-images/picker`;
    console.log('✅ [Picker Debug] Picker base URL:', fullUrl);
    return fullUrl;
  }, []);
  const themeOptions = useMemo(() => {
    const options = getThemeOptions(pickerStorageBaseUrl);
    console.log('🎨 [Picker Debug] Theme options:', options.map(o => ({ id: o.id, url: o.imageUrl })));
    return options;
  }, [pickerStorageBaseUrl]);
  const eraOptions = useMemo(() => {
    const options = getEraOptions(pickerStorageBaseUrl);
    console.log('📅 [Picker Debug] Era options:', options.map(o => ({ id: o.id, url: o.imageUrl })));
    return options;
  }, [pickerStorageBaseUrl]);

  const loadListings = useCallback(
    async (theme?: string, era?: string) => {
      if (!isSupabaseConfigured()) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchListings({ theme, era });
        if (data && data.length > 0) {
          setListings(data);
        } else {
          setListings([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // Dismiss picker when tapping/clicking outside the search bar and open card
  useEffect(() => {
    const handlePointerDownOutside = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        activeSection != null &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(target)
      ) {
        setActiveSection(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [activeSection]);

  const handleSearch = useCallback(() => {
    setActiveSection(null);
    if (isSupabaseConfigured()) {
      loadListings(selectedTheme ?? undefined, selectedEra ?? undefined);
    }
  }, [selectedTheme, selectedEra, loadListings]);

  // Scroll listener to detect when search bar area moves behind the sticky header
  useEffect(() => {
    const handleScroll = () => {
      const searchBarArea = searchBarAreaRef.current;
      if (!searchBarArea) return;

      const rect = searchBarArea.getBoundingClientRect();
      // As soon as the top of the search area goes above the viewport top,
      // it is effectively behind the sticky header, so we show the divider.
      setShowHeaderDivider(rect.top <= 0);
    };

    // Run once on mount to ensure correct initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
        showDividerOnScroll={showHeaderDivider}
      />

      <div
        ref={searchBarAreaRef}
        style={{
          width: '100%',
          padding: 'var(--ds-spacing-12) 0 var(--ds-spacing-32) 0',
          backgroundColor: 'var(--ds-surface-header)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid var(--ds-border-light)',
          position: 'relative',
        }}
      >
        <div ref={searchDropdownRef} style={{ position: 'relative', width: '100%', maxWidth: 851, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SearchField
            activeSection={activeSection}
            onSearch={handleSearch}
            onWhereClick={() => setActiveSection((s) => (s === 'where' ? null : 'where'))}
            onEraClick={() => setActiveSection((s) => (s === 'era' ? null : 'era'))}
            onWhoClick={() => setActiveSection((s) => (s === 'who' ? null : 'who'))}
            where={{
              label: 'Where',
              placeholder: getThemeLabel(selectedTheme) ?? 'Search destinations',
            }}
            era={{
              label: 'Era',
              placeholder: getEraLabel(selectedEra) ?? 'Select Timeline',
            }}
            who={{
              label: 'Who',
              placeholder: totalGuestCount > 0 ? `${totalGuestCount} guest${totalGuestCount !== 1 ? 's' : ''}` : 'Add guests',
            }}
          />
          {activeSection === 'where' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                zIndex: 20,
              }}
              aria-label="Theme picker"
            >
              <ThemePicker
                items={themeOptions}
                selectedId={selectedTheme ?? undefined}
                onSelect={(id) => setSelectedTheme((current) => (current === id ? null : id))}
              />
            </div>
          )}
          {activeSection === 'era' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: 4,
                zIndex: 20,
              }}
              aria-label="Era picker"
            >
              <EraPicker
                items={eraOptions}
                selectedId={selectedEra ?? undefined}
                onSelect={(id) => setSelectedEra((current) => (current === id ? null : id))}
              />
            </div>
          )}
          {activeSection === 'who' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                left: 'auto',
                marginTop: 4,
                zIndex: 20,
              }}
              aria-label="Guest picker"
            >
              <GuestPicker
                categories={[
                  {
                    id: 'adults',
                    label: 'Adults',
                    subtitle: 'Ages 13 or above',
                    count: adultsCount,
                    max: 10,
                  },
                  {
                    id: 'children',
                    label: 'Children',
                    subtitle: 'Ages 2 – 12',
                    count: childrenCount,
                    max: 10,
                  },
                ]}
                onChange={(id, newCount) => {
                  if (id === 'adults') setAdultsCount(newCount);
                  else if (id === 'children') setChildrenCount(newCount);
                }}
              />
            </div>
          )}
        </div>
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
          padding: isMobile
            ? 'var(--ds-spacing-24) var(--ds-spacing-16)'
            : 'var(--ds-spacing-40) var(--ds-spacing-80)',
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
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
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
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
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
                rating={listing.rating}
                isGuestFavorite={listing.isGuestFavorite}
                onClick={() => navigate(`/listing/${listing.id}`, { state: { guestCount: totalGuestCount } })}
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
