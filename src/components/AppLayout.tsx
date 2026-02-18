import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../design-system';
import { HeaderRightSlotWithUserMenu } from './HeaderRightSlotWithUserMenu';
import { PORTAL_ICON_URL, MINDSCAPES_ICON_URL } from '../design-system/patterns/Header/header-nav-assets';
import { DistortTransitionOutlet } from './DistortTransitionOutlet';

const APP_NAV_ITEMS = [
  { label: 'Time Travel', iconUrl: PORTAL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [showHomeScrollDivider, setShowHomeScrollDivider] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setShowHomeScrollDivider(false);
      return;
    }

    const handleScroll = () => {
      const searchArea = document.getElementById('home-search-area');
      if (!searchArea) {
        setShowHomeScrollDivider(false);
        return;
      }
      const rect = searchArea.getBoundingClientRect();
      setShowHomeScrollDivider(rect.top <= 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ds-background)',
      }}
    >
      <Header
        brandName="warpbnb"
        navItems={APP_NAV_ITEMS}
        activeNavLabel="Time Travel"
        onNavClick={(label) => {
          if (label === 'Time Travel') navigate('/');
        }}
        onLogoClick={() => navigate('/')}
        rightSlot={<HeaderRightSlotWithUserMenu />}
        showDivider={!isHome}
        showDividerOnScroll={isHome && showHomeScrollDivider}
      />

      <main
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 0,
          isolation: 'isolate',
        }}
      >
        <DistortTransitionOutlet />
      </main>
    </div>
  );
}
