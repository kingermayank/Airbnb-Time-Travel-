import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HelpCircle, Menu } from 'lucide-react';
import { Header, Button, UserMenu, SectionTitle, Text } from '../design-system';
import { PORTAL_VIDEO_URL, PORTAL_POSTER_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';

const FAQ_NAV_ITEMS = [
  { label: 'Time Travel', iconVideoUrl: PORTAL_VIDEO_URL, iconPosterUrl: PORTAL_POSTER_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'How does time travel booking work?',
    answer:
      'Select your destination era, choose a listing, pick your travel duration and teleportation method, and complete the booking. You’ll receive a confirmation and timeline coordinates before departure.',
  },
  {
    question: 'What if I need to cancel or change my trip?',
    answer:
      'You can modify or cancel your reservation from your account up to 24 hours before your scheduled departure. Refunds are processed in the same currency you used at booking.',
  },
  {
    question: 'Are there any age or eligibility requirements?',
    answer:
      'Travelers must be at least 18 years old and hold a valid Temporal Pass. Some eras may have additional restrictions; check the listing details before booking.',
  },
  {
    question: 'How do I get help during my trip?',
    answer:
      'Each listing has an in-era support contact. You can also reach our 24/7 support team through the Help center or the app’s emergency timeline beacon.',
  },
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
        <HelpCircle size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
      </button>
      <button
        type="button"
        className="ds-header-right-icon-btn"
        aria-label="Menu"
        style={{ border: 'none' }}
        onClick={() => setIsOpen((prev) => !prev)}
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

export function FaqPage() {
  const navigate = useNavigate();

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
        navItems={FAQ_NAV_ITEMS}
        activeNavLabel="Time Travel"
        onNavClick={(label) => (label === 'Time Travel' ? navigate('/') : undefined)}
        onLogoClick={() => navigate('/')}
        rightSlot={<HeaderRightSlotWithUserMenu />}
        showDivider
      />

      <main
        style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          padding: 'var(--ds-spacing-24) var(--ds-spacing-16) var(--ds-spacing-32)',
          boxSizing: 'border-box',
        }}
      >
        <SectionTitle>Frequently asked questions</SectionTitle>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-spacing-20)',
          }}
        >
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                paddingBottom: 'var(--ds-spacing-20)',
                borderBottom:
                  i < FAQ_ITEMS.length - 1 ? `1px solid var(--ds-border-light)` : undefined,
              }}
            >
              <Text
                variant="h4"
                color="primary"
                as="p"
                style={{ marginBottom: 'var(--ds-spacing-8)' }}
              >
                {item.question}
              </Text>
              <Text variant="body" color="secondary" as="p">
                {item.answer}
              </Text>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
