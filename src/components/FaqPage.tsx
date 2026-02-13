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
    question: 'Is any of this real?',
    answer:
      'No. Warpbnb is a fictional side project. Time travel is not real. All listings, hosts, and images shown here are AI-generated and speculative. They’re used to explore visual consistency, storytelling, and design–engineering.',
  },
  {
    question: 'Can I host my own listing?',
    answer: 'Host applications will open soon. Waiting on a minor temporal realignment.',
  },
  {
    question: 'Is this affiliated with Airbnb?',
    answer:
      'This project is not affiliated with, endorsed by, or connected to Airbnb in any way. It’s a speculative reinterpretation inspired by familiar patterns, nothing more.',
  },
  {
    question: 'How long did this take to build?',
    answer:
      'About two weeks, mostly at night, with a mix of curiosity, caffeine, and questionable sleep decisions.',
  },
  {
    question: 'How did you build this?',
    answer:
      'A mix of tools, experimentation, and iteration. Primarily Figma for planning and UI design; Cursor plus Claude Code for building; multiple AI models (Nano Banana Pro, Flux Schnell, Luma Photon) for image generation; Supabase for backend; and various tools for motion, image refinement, and layout exploration. A full breakdown of the process is planned for an upcoming newsletter post.',
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
        onClick={() => navigate('/faq')}
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
          className="ds-user-menu-wrapper"
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
          maxWidth: 600,
          margin: '0 auto',
          padding: '44px var(--ds-spacing-16) var(--ds-spacing-32)',
          boxSizing: 'border-box',
        }}
      >
        <SectionTitle
          style={{
            textAlign: 'center',
            fontSize: '30px',
            marginBottom: '40px',
          }}
        >
          Frequently asked questions
        </SectionTitle>
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
                style={{ marginBottom: 'var(--ds-spacing-8)', fontSize: '18px' }}
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
