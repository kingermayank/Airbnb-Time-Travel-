import * as React from 'react';

// Breakpoints aligned with modern mobile/tablet/desktop ranges.
// - mobile: < 640px
// - tablet: 640px–1279px
// - desktop: >= 1280px
const MOBILE_MAX = 639;
const TABLET_MAX = 1279;

export type DeviceType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export function useDeviceType(): DeviceType {
  const [width, setWidth] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Initialize on mount
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const w = width;

  if (w == null) {
    // Default to desktop layout during first render / SSR
    return { isMobile: false, isTablet: false, isDesktop: true };
  }

  if (w <= MOBILE_MAX) {
    return { isMobile: true, isTablet: false, isDesktop: false };
  }

  if (w <= TABLET_MAX) {
    return { isMobile: false, isTablet: true, isDesktop: false };
  }

  return { isMobile: false, isTablet: false, isDesktop: true };
}

// Backwards-compatible helper used in several components.
// Now maps to the narrower "phone" breakpoint (< 640px).
export function useIsMobile() {
  const { isMobile } = useDeviceType();
  return isMobile;
}
