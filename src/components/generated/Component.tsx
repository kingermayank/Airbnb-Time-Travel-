import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { Search } from 'lucide-react';
import { fetchListings } from '../../lib/supabase-queries';
import { getListingPath } from '../../lib/listing-slug';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { ListingCard as ListingCardType } from '../../types/database';
import {
  Header,
  SearchField,
  ListingCard as ListingCardPattern,
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
import { getListingHoverVideo } from '../../lib/listing-hover-videos';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../../design-system/patterns/Header/header-nav-assets';
import { HeaderRightSlotWithUserMenu } from '../HeaderRightSlotWithUserMenu';
import { ListingCardSkeleton } from '../ListingCardSkeleton';
import { useIsMobile } from '../../hooks/use-mobile';
import { HOMEPAGE_LISTINGS } from '../../data/homepage-listings';

const FIGMA_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

// ── Picker transition animation constants ──────────────────────────────
const OPEN_FROM_BOTTOM = 0;

const enterTransition = {
  type: 'spring' as const,
  stiffness: 760,
  damping: 32,
  mass: 0.45,
};

const exitTransition = {
  type: 'tween' as const,
  duration: 0.12,
  ease: [0.25, 1, 0.5, 1] as const,
};

const slideVariants = {
  enter: () => ({
    x: 0,
    y: 8,
    scale: 0.98,
    opacity: 0,
  }),
  center: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: enterTransition,
  },
  exit: () => ({
    x: 0,
    y: 6,
    scale: 0.998,
    opacity: 0,
    transition: exitTransition,
  }),
};

const instantTransition = { duration: 0 };
const reducedMotionVariants = {
  enter: { opacity: 0, scale: 1 },
  center: { opacity: 1, transition: instantTransition },
  exit: { opacity: 0, scale: 1, transition: instantTransition },
};

interface TransitionListing {
  id: string;
  image: string;
  title: string;
  year?: string;
  rating?: string;
  isGuestFavorite?: boolean;
}

interface CardProps {
  listing: ListingCardType;
  priority: boolean;
  variants: Variants;
  shouldReduceMotion: boolean;
  onOpen: (listing: ListingCardType) => void;
}

function Card({ listing, priority, variants, shouldReduceMotion, onOpen }: CardProps) {
  return (
    <motion.div
      variants={variants}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 560, damping: 40, mass: 0.55 }}
    >
      <ListingCardPattern
        id={listing.id}
        image={listing.image}
        imageLoading={priority ? 'eager' : 'lazy'}
        imageFetchPriority={priority ? 'high' : 'auto'}
        hoverVideo={listing.hoverVideo}
        title={listing.title}
        year={listing.date}
        rating={listing.rating}
        isGuestFavorite={listing.isGuestFavorite}
        imageLayoutId={`listing-card-image-${listing.id}`}
        onClick={() => {
          onOpen(listing);
        }}
      />
    </motion.div>
  );
}

interface CardGridProps {
  listings: ListingCardType[];
  listingResultsKey: string;
  listingGridVariants: Variants;
  listingItemVariants: Variants;
  isMobile: boolean;
  shouldReduceMotion: boolean;
  onOpen: (listing: ListingCardType) => void;
}

function CardGrid({
  listings,
  listingResultsKey,
  listingGridVariants,
  listingItemVariants,
  isMobile,
  shouldReduceMotion,
  onOpen,
}: CardGridProps) {
  return (
    <motion.div
      key={listingResultsKey}
      initial="hidden"
      animate="show"
      variants={listingGridVariants}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        columnGap: 'var(--ds-spacing-16)',
        rowGap: 'var(--ds-spacing-40)',
      }}
    >
      {listings.map((listing, index) => (
        <Card
          key={listing.id}
          listing={listing}
          priority={index < (isMobile ? 1 : 3)}
          variants={listingItemVariants}
          shouldReduceMotion={shouldReduceMotion}
          onOpen={onOpen}
        />
      ))}
    </motion.div>
  );
}

export const AirbnbUi = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingCardType[]>(HOMEPAGE_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingNavigation, setPendingNavigation] = useState<{ listingId: string } | null>(null);
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

  // ── Picker transition direction tracking ──────────────────────────────
  const prevSectionRef = useRef<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const direction = OPEN_FROM_BOTTOM;

  // Update ref AFTER direction is computed; clear on close so next open uses bottom-entry.
  useEffect(() => {
    if (activeSection) {
      prevSectionRef.current = activeSection;
      return;
    }
    prevSectionRef.current = null;
  }, [activeSection]);

  // Era button center offset relative to searchDropdownRef (measured in onEraClick before state change)
  const [eraTabCenterLeft, setEraTabCenterLeft] = useState<number | null>(null);

  const pickerStorageBaseUrl = useMemo(() => {
    const url = (import.meta as { env?: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL;
    if (!url || typeof url !== 'string') return null;
    const base = url.replace(/\/$/, '');
    return `${base}/storage/v1/object/public/listing-images/Filter`;
  }, []);
  const themeOptions = useMemo(() => getThemeOptions(pickerStorageBaseUrl), [pickerStorageBaseUrl]);
  const eraOptions = useMemo(() => getEraOptions(pickerStorageBaseUrl), [pickerStorageBaseUrl]);

  // Warm picker image cache so the first picker open has no visible lag.
  useEffect(() => {
    const urls = [...themeOptions, ...eraOptions].map((item) => item.imageUrl);
    const preloaded = urls.map((url) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      return img;
    });

    return () => {
      preloaded.forEach((img) => {
        img.src = '';
      });
    };
  }, [themeOptions, eraOptions]);

  const listingGridVariants = useMemo(
    () => (
      shouldReduceMotion
        ? {
          hidden: { opacity: 1 },
          show: { opacity: 1 },
        }
        : {
          hidden: { opacity: 1 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.04,
            },
          },
        }
    ),
    [shouldReduceMotion]
  );

  const listingItemVariants = useMemo(
    () => (
      shouldReduceMotion
        ? {
          hidden: { opacity: 1, y: 0, scale: 1 },
          show: { opacity: 1, y: 0, scale: 1 },
        }
        : {
          hidden: { opacity: 0, y: 14, scale: 0.985 },
          show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring' as const,
              stiffness: 380,
              damping: 30,
              mass: 0.7,
            },
          },
        }
    ),
    [shouldReduceMotion]
  );

  const listingResultsKey = useMemo(
    () => listings.map((l) => l.id).join('|'),
    [listings]
  );

  const openListing = useCallback(
    (listing: ListingCardType) => {
      if (pendingNavigation) return;
      setPendingNavigation({ listingId: listing.id });
      navigate(getListingPath(listing.title), {
        state: {
          guestCount: totalGuestCount,
          listingId: listing.id,
        },
      });
    },
    [navigate, pendingNavigation, totalGuestCount]
  );

  const measureEraTabCenter = useCallback(() => {
    if (!searchDropdownRef.current) return;
    const buttons = searchDropdownRef.current.querySelectorAll('button[aria-expanded]');
    const eraButton = buttons[1] as HTMLElement | undefined;
    if (!eraButton) return;
    const containerRect = searchDropdownRef.current.getBoundingClientRect();
    const eraRect = eraButton.getBoundingClientRect();
    setEraTabCenterLeft(eraRect.left + eraRect.width / 2 - containerRect.left);
  }, []);

  const loadListings = useCallback(
    async (theme?: string, era?: string, background = false) => {
      if (!isSupabaseConfigured()) return;
      try {
        if (!background) {
          setIsLoading(true);
          setError(null);
        }
        const data = await fetchListings({ theme, era });
        if (data && data.length > 0) {
          setListings(data);
        } else if (!background) {
          setListings([]);
        }
      } catch (err) {
        if (!background) {
          setError(err instanceof Error ? err.message : 'Failed to load listings');
        }
      } finally {
        if (!background) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadListings(undefined, undefined, true);
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

  // Dismiss open picker as soon as the user starts scrolling away from search.
  useEffect(() => {
    if (activeSection == null) return;

    const scrollYAtOpen = window.scrollY;
    const DISMISS_SCROLL_THRESHOLD_PX = 6;

    const handleDismissOnScroll = () => {
      if (Math.abs(window.scrollY - scrollYAtOpen) < DISMISS_SCROLL_THRESHOLD_PX) return;
      setActiveSection(null);
    };

    window.addEventListener('scroll', handleDismissOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleDismissOnScroll);
    };
  }, [activeSection]);

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
      {!hideHeader && (
        <Header
          brandName="WarpBnB"
          navItems={FIGMA_NAV_ITEMS}
          activeNavLabel="Time Travel"
          onNavClick={() => {}}
          rightSlot={<HeaderRightSlotWithUserMenu />}
          showDividerOnScroll={showHeaderDivider}
        />
      )}

      <div
        id="home-search-area"
        ref={searchBarAreaRef}
        style={{
          width: '100%',
          padding: isMobile
            ? '8px 0 var(--ds-spacing-20) 0'
            : '8px 0 var(--ds-spacing-32) 0',
          background: 'linear-gradient(to bottom, #FBFBFB 0%, #F7F7F7 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid var(--ds-border-light)',
          position: 'relative',
        }}
      >
        <div
          ref={searchDropdownRef}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? 560 : 851,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: isMobile ? '0 var(--ds-spacing-16)' : 0,
          }}
        >
          {isMobile ? (
            <div
              style={{
                width: '100%',
                backgroundColor: 'var(--ds-surface)',
                borderRadius: 24,
                border: '1px solid var(--ds-border)',
                boxShadow: '0px 0px 10px var(--ds-border), 0px 1px 2px rgba(0, 0, 0, 0.08)',
                padding: 'var(--ds-spacing-8)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-spacing-8)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveSection((s) => (s === 'where' ? null : 'where'))}
                style={{
                  border: '1px solid var(--ds-border-light)',
                  borderRadius: 16,
                  background: activeSection === 'where' ? 'var(--ds-surface-icon-button)' : 'transparent',
                  minHeight: 46,
                  textAlign: 'left',
                  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 'var(--ds-text-12)', fontWeight: 500, color: 'var(--ds-text-primary)' }}>
                  Theme
                </div>
                <div style={{ fontSize: 'var(--ds-text-14)', color: selectedTheme ? 'var(--ds-text-primary)' : 'var(--ds-text-secondary)' }}>
                  {getThemeLabel(selectedTheme) ?? 'Select theme'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection((s) => (s === 'era' ? null : 'era'))}
                style={{
                  border: '1px solid var(--ds-border-light)',
                  borderRadius: 16,
                  background: activeSection === 'era' ? 'var(--ds-surface-icon-button)' : 'transparent',
                  minHeight: 46,
                  textAlign: 'left',
                  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 'var(--ds-text-12)', fontWeight: 500, color: 'var(--ds-text-primary)' }}>
                  Era
                </div>
                <div style={{ fontSize: 'var(--ds-text-14)', color: selectedEra ? 'var(--ds-text-primary)' : 'var(--ds-text-secondary)' }}>
                  {getEraLabel(selectedEra) ?? 'Select timeline'}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection((s) => (s === 'who' ? null : 'who'))}
                style={{
                  border: '1px solid var(--ds-border-light)',
                  borderRadius: 16,
                  background: activeSection === 'who' ? 'var(--ds-surface-icon-button)' : 'transparent',
                  minHeight: 46,
                  textAlign: 'left',
                  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 'var(--ds-text-12)', fontWeight: 500, color: 'var(--ds-text-primary)' }}>
                  Who
                </div>
                <div style={{ fontSize: 'var(--ds-text-14)', color: totalGuestCount > 0 ? 'var(--ds-text-primary)' : 'var(--ds-text-secondary)' }}>
                  {totalGuestCount > 0 ? `${totalGuestCount} guest${totalGuestCount !== 1 ? 's' : ''}` : 'Add guests'}
                </div>
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSearch}
                style={{
                  width: '100%',
                  borderRadius: 999,
                  backgroundColor: 'var(--ds-accent)',
                  borderColor: 'var(--ds-accent)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <span>Search</span>
                <Search size={12} strokeWidth={3} />
              </Button>
            </div>
          ) : (
            <SearchField
              activeSection={activeSection}
              onSearch={handleSearch}
              onWhereClick={() => setActiveSection((s) => (s === 'where' ? null : 'where'))}
              onEraClick={() => {
                // Measure era button center before toggling, so the picker is positioned correctly on first render
                measureEraTabCenter();
                setActiveSection((s) => (s === 'era' ? null : 'era'));
              }}
              onWhoClick={() => setActiveSection((s) => (s === 'who' ? null : 'who'))}
              where={{
                label: 'Theme',
                placeholder: getThemeLabel(selectedTheme) ?? 'Select theme',
                isValueSelected: selectedTheme != null,
              }}
              era={{
                label: 'Era',
                placeholder: getEraLabel(selectedEra) ?? 'Select timeline',
                isValueSelected: selectedEra != null,
              }}
              who={{
                label: 'Who',
                placeholder: totalGuestCount > 0 ? `${totalGuestCount} guest${totalGuestCount !== 1 ? 's' : ''}` : 'Add guests',
                isValueSelected: totalGuestCount > 0,
              }}
            />
          )}
          <AnimatePresence mode="wait" custom={direction}>
            {activeSection && (
              <motion.div
                key={activeSection}
                custom={direction}
                variants={shouldReduceMotion ? reducedMotionVariants : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  top: isMobile ? 'auto' : '100%',
                  marginTop: isMobile ? 12 : 4,
                  zIndex: 20,
                  width: isMobile ? '100%' : undefined,
                  transformOrigin: isMobile
                    ? '50% top'
                    : activeSection === 'where'
                      ? '20% top'
                      : activeSection === 'era'
                        ? '50% top'
                        : '80% top',
                  ...(isMobile
                    ? { left: 0, right: 0 }
                    : activeSection === 'where'
                      ? { left: 0 }
                      : activeSection === 'era'
                        ? { left: eraTabCenterLeft != null ? eraTabCenterLeft - 210 : 0 }
                        : { right: 0, left: 'auto' }),
                }}
                aria-label={
                  activeSection === 'where'
                    ? 'Theme picker'
                    : activeSection === 'era'
                      ? 'Era picker'
                      : 'Guest picker'
                }
              >
                {activeSection === 'where' && (
                  <ThemePicker
                    style={isMobile ? { width: '100%' } : undefined}
                    items={themeOptions}
                    selectedId={selectedTheme ?? undefined}
                    onSelect={(id) => {
                      const isDeselect = selectedTheme === id;
                      setSelectedTheme(isDeselect ? null : id);
                      if (isDeselect) {
                        setActiveSection(isMobile ? null : 'where');
                        return;
                      }
                      if (isMobile) {
                        setActiveSection(null);
                        return;
                      }
                      measureEraTabCenter();
                      setActiveSection('era');
                    }}
                  />
                )}
                {activeSection === 'era' && (
                  <EraPicker
                    style={isMobile ? { width: '100%' } : undefined}
                    items={eraOptions}
                    selectedId={selectedEra ?? undefined}
                    onSelect={(id) => {
                      const isDeselect = selectedEra === id;
                      setSelectedEra(isDeselect ? null : id);
                      setActiveSection(isMobile ? null : isDeselect ? 'era' : 'who');
                    }}
                  />
                )}
                {activeSection === 'who' && (
                  <GuestPicker
                    style={isMobile ? { width: '100%' } : undefined}
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
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <div
          style={{
            padding: 'var(--ds-spacing-12) var(--ds-spacing-80)',
            backgroundColor: '#F7F7F7',
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
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400,
              gap: 'var(--ds-spacing-20)',
              textAlign: 'center',
            }}
          >
            <img
              src="/images/wood.png"
              alt=""
              style={{
                width: '100%',
                maxWidth: 107,
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
            <p
              style={{
                fontFamily: '"Figtree", sans-serif',
                fontWeight: 400,
                fontSize: 'var(--ds-text-16)',
                color: 'var(--ds-text-secondary)',
                maxWidth: 360,
                lineHeight: 1.5,
              }}
            >
              This era may be unavailable or outside safe temporal limits. Try expanding your time range.
            </p>
          </div>
        ) : (
          <CardGrid
            listings={listings}
            listingResultsKey={listingResultsKey}
            listingGridVariants={listingGridVariants}
            listingItemVariants={listingItemVariants}
            isMobile={isMobile}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
            onOpen={openListing}
          />
        )}
      </main>

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

    </div>
  );
};
