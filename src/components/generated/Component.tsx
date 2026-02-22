import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import { fetchListings } from '../../lib/supabase-queries';
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
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../../design-system/patterns/Header/header-nav-assets';
import { HeaderRightSlotWithUserMenu } from '../HeaderRightSlotWithUserMenu';
import { ListingCardSkeleton } from '../ListingCardSkeleton';
import { useIsMobile } from '../../hooks/use-mobile';

// Mock data - fallback until Supabase is populated (prices in Bitcoin)
// Ordered according to homepage display order
const MOCK_LISTINGS: ListingCardType[] = [
  {
    id: 'mock-3',
    title: "Crystal Villa, Atlantis",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/bbe5b882-690a-4661-836a-08f66193c3f1.jpg",
    price: "₿0.012540 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-9',
    title: "Manhattan Loft, New York",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1e517539-a473-4b2a-b992-a49cc7dbbe8e.jpg",
    price: "₿0.002748 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-8',
    title: "Alexander's Campaign Tent, Persia",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/31951292-b7a3-4d4e-9d00-944e3fd01f43.jpg",
    price: "₿0.008244 / hour",
    date: "330 BCE",
  },
  {
    id: 'mock-1',
    title: "Shah Jahan's Marble Suite, Agra",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/4d4e615e-dcce-4f7e-a73c-18add1151842.jpg",
    price: "₿0.019032 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-2',
    title: "Mars Colony Pod, Olympus Mons",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/7e511fa2-8f7a-4b6f-82d0-e82efff3c406.jpg",
    price: "₿0.008244 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-4',
    title: "First-Class Suite, RMS Titanic",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/ab970d7e-74d0-4a74-8e5c-4ca8f2a64ad0.jpg",
    price: "₿0.006768 / hour",
    rating: "4.82",
  },
  {
    id: 'mock-6',
    title: "Floating Mountain Bungalow, Pandora",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/1221494e-450b-4112-b3ec-6845b91292d6.png",
    price: "₿0.027180 / hour",
    rating: "4.82",
    isGuestFavorite: true,
  },
  {
    id: 'mock-7',
    title: "Nile Villa, Ancient Egypt",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/04c1ff57-425d-4847-8646-178516b6c4f3.png",
    price: "₿0.009384 / hour",
    date: "330 BCE",
  },
  {
    id: 'mock-5',
    title: "Resistance Safehouse Loft, Berlin",
    image: "https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/b2e96b48-0491-4bea-a1df-887341cc53d5.jpg",
    price: "₿0.003576 / hour",
    rating: "4.82",
  },
];

const FIGMA_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

// ── Picker transition animation constants ──────────────────────────────
const OPEN_FROM_BOTTOM = 0;

const enterTransition = {
  type: 'spring' as const,
  stiffness: 560,
  damping: 26,
  mass: 0.85,
};

const exitTransition = {
  type: 'tween' as const,
  duration: 0.24,
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

interface TransitionSnapshot {
  listing: TransitionListing;
  cardRect: { left: number; top: number; width: number; height: number };
}

interface CardProps {
  listing: ListingCardType;
  variants: Variants;
  shouldReduceMotion: boolean;
  onOpen: (listing: ListingCardType, element: HTMLDivElement) => void;
}

function Card({ listing, variants, shouldReduceMotion, onOpen }: CardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <motion.div
      variants={variants}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 560, damping: 40, mass: 0.55 }}
    >
      <div ref={wrapperRef}>
        <ListingCardPattern
          id={listing.id}
          image={listing.image}
          title={listing.title}
          year={listing.date}
          rating={listing.rating}
          isGuestFavorite={listing.isGuestFavorite}
          onClick={() => {
            const el = wrapperRef.current;
            if (el) onOpen(listing, el);
          }}
        />
      </div>
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
  onOpen: (listing: ListingCardType, element: HTMLDivElement) => void;
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
      {listings.map((listing) => (
        <Card
          key={listing.id}
          listing={listing}
          variants={listingItemVariants}
          shouldReduceMotion={shouldReduceMotion}
          onOpen={onOpen}
        />
      ))}
    </motion.div>
  );
}

interface GenieTransitionLayerProps {
  snapshot: TransitionSnapshot | null;
  shouldReduceMotion: boolean;
  onComplete: () => void;
}

function GenieTransitionLayer({ snapshot, shouldReduceMotion, onComplete }: GenieTransitionLayerProps) {
  return (
    <AnimatePresence>
      {snapshot && (
        <>
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.16 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 14, 24, 0.30)',
              zIndex: 80,
              pointerEvents: 'none',
            }}
          />

          <motion.div
            initial={{
              left: snapshot.cardRect.left,
              top: snapshot.cardRect.top,
              width: snapshot.cardRect.width,
              height: snapshot.cardRect.height,
              borderRadius: 24,
            }}
            animate={{
              left: 0,
              top: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              borderRadius: 0,
            }}
            exit={{ opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { type: 'spring', stiffness: 205, damping: 23, mass: 0.9 }
            }
            onAnimationComplete={onComplete}
            style={{
              position: 'fixed',
              overflow: 'hidden',
              zIndex: 81,
              background: '#ffffff',
              boxShadow: '0 34px 90px rgba(0,0,0,0.30)',
              pointerEvents: 'none',
              willChange: 'transform, opacity',
            }}
          >
            <motion.div
              initial={{ scaleX: 1, scaleY: 1 }}
              animate={
                shouldReduceMotion
                  ? { scaleX: 1, scaleY: 1 }
                  : { scaleX: [1, 1.045, 0.985, 1], scaleY: [1, 0.95, 1.02, 1] }
              }
              transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: 'center',
              }}
            />

            <motion.img
              src={snapshot.listing.image}
              alt={snapshot.listing.title}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: shouldReduceMotion ? 0.16 : 0.62, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                willChange: 'transform, opacity',
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export const AirbnbUi = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ListingCardType[]>(MOCK_LISTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTransition, setActiveTransition] = useState<TransitionSnapshot | null>(null);
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

  const direction = useMemo(() => OPEN_FROM_BOTTOM, [activeSection]);

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
    (listing: ListingCardType, element: HTMLDivElement) => {
      if (pendingNavigation) return;
      if (shouldReduceMotion) {
        navigate(`/listing/${listing.id}`, { state: { guestCount: totalGuestCount } });
        return;
      }

      const rect = element.getBoundingClientRect();
      setActiveTransition({
        listing: {
          id: listing.id,
          image: listing.image,
          title: listing.title,
          year: listing.date,
          rating: listing.rating,
          isGuestFavorite: listing.isGuestFavorite,
        },
        cardRect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
      setPendingNavigation({ listingId: listing.id });
    },
    [navigate, pendingNavigation, shouldReduceMotion, totalGuestCount]
  );

  const handleTransitionComplete = useCallback(() => {
    if (!pendingNavigation) return;
    const { listingId } = pendingNavigation;
    setPendingNavigation(null);
    setActiveTransition(null);
    navigate(`/listing/${listingId}`, {
      state: {
        guestCount: totalGuestCount,
        fromGenieTransition: true,
      },
    });
  }, [navigate, pendingNavigation, totalGuestCount]);

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
            ? 'var(--ds-spacing-12) 0 var(--ds-spacing-20) 0'
            : 'var(--ds-spacing-12) 0 var(--ds-spacing-32) 0',
          backgroundColor: 'var(--ds-surface-header)',
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
                  minHeight: 52,
                  textAlign: 'left',
                  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 'var(--ds-text-12)', fontWeight: 'var(--ds-font-semibold)', color: 'var(--ds-text-primary)' }}>
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
                  minHeight: 52,
                  textAlign: 'left',
                  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 'var(--ds-text-12)', fontWeight: 'var(--ds-font-semibold)', color: 'var(--ds-text-primary)' }}>
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
                  minHeight: 52,
                  textAlign: 'left',
                  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 'var(--ds-text-12)', fontWeight: 'var(--ds-font-semibold)', color: 'var(--ds-text-primary)' }}>
                  Who
                </div>
                <div style={{ fontSize: 'var(--ds-text-14)', color: totalGuestCount > 0 ? 'var(--ds-text-primary)' : 'var(--ds-text-secondary)' }}>
                  {totalGuestCount > 0 ? `${totalGuestCount} guest${totalGuestCount !== 1 ? 's' : ''}` : 'Add guests'}
                </div>
              </button>
              <Button variant="primary" size="md" onClick={handleSearch} style={{ width: '100%', borderRadius: 999 }}>
                Search
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

      <GenieTransitionLayer
        snapshot={activeTransition}
        shouldReduceMotion={Boolean(shouldReduceMotion)}
        onComplete={handleTransitionComplete}
      />

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
