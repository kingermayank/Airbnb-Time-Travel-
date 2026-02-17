import React, { useEffect, useRef } from 'react';
import { Text } from '../../foundations/Text';
import { useDeviceType } from '../../../hooks/use-mobile';
import './Header.css';

/** Header pattern aligned to Figma 307-4788 (Header navigation). */

export interface NavItem {
  label: string;
  iconUrl?: string;
  /** Video URL for hover-to-play icon (e.g. Time Travel portal). Shows first frame by default. */
  iconVideoUrl?: string;
  /** Optional poster image URL when using iconVideoUrl (first frame). */
  iconPosterUrl?: string;
  /** When true, tab is non-clickable and shown as "Coming soon". */
  disabled?: boolean;
}

export interface HeaderProps {
  logoUrl?: string;
  /** Optional wordmark image URL; when omitted, brandName is shown as text. */
  logoTextUrl?: string;
  /** Brand name shown next to logo when logoTextUrl is not provided (e.g. "Warp BNB"). */
  brandName?: string;
  navItems: NavItem[];
  activeNavLabel?: string;
  onNavClick?: (label: string) => void;
  /** Optional callback when the logo/brand area is clicked (e.g. navigate home). */
  onLogoClick?: () => void;
  rightSlot?: React.ReactNode;
  /** When true, renders a 1px divider line below the header (e.g. for Listing Details page). */
  showDivider?: boolean;
  /** When true, renders a divider at the bottom of the sticky header when search bar area has scrolled past. */
  showDividerOnScroll?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const iconBoxStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  overflow: 'hidden',
  position: 'relative',
};

function NavIconVideo({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string;
  posterUrl?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <div
      className="ds-header-nav-icon-video"
      style={iconBoxStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        preload="auto"
        muted
        loop
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (v.currentTime !== 0) v.currentTime = 0;
        }}
      />
    </div>
  );
}

const headerBaseStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'var(--ds-surface-header)',
  boxSizing: 'border-box',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const headerWrapperWithDividerStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 10,
  backgroundColor: 'var(--ds-surface-header)',
};

const headerDividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  backgroundColor: 'var(--ds-divider)',
};

const headerScrollDividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  backgroundColor: 'var(--ds-border-light)',
};

export function Header({
  logoUrl = '/images/warp.svg',
  logoTextUrl,
  brandName = 'warpbnb',
  navItems,
  activeNavLabel,
  onNavClick,
  onLogoClick,
  rightSlot,
  showDivider = false,
  showDividerOnScroll = false,
  className,
  style,
}: HeaderProps) {
  const { isMobile } = useDeviceType();

  // Preload nav icon images so they appear instantly (same as other header assets)
  useEffect(() => {
    navItems.forEach((item) => {
      const url = item.iconUrl;
      if (url && !document.querySelector(`link[rel="preload"][href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, [navItems]);

  const headerStyle: React.CSSProperties = {
    ...headerBaseStyle,
    // Mobile-first: column layout, auto height, compact horizontal padding
    flexDirection: isMobile ? 'column' : 'row',
    height: isMobile ? 'auto' : 101,
    padding: isMobile ? '0 var(--ds-spacing-16)' : '0 var(--ds-spacing-40)',
    paddingTop: isMobile ? 8 : 0,
    gap: isMobile ? 'var(--ds-spacing-8)' : 0,
  };

  const headerEl = (
    <header
      className={className}
      style={{
        ...headerStyle,
        ...(showDivider ? { position: 'relative' as const, top: 'auto', zIndex: 'auto' } : {}),
        ...style,
      }}
    >
      <div
        role={onLogoClick ? 'button' : undefined}
        onClick={onLogoClick}
        onKeyDown={onLogoClick ? (e) => e.key === 'Enter' && onLogoClick() : undefined}
        tabIndex={onLogoClick ? 0 : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: onLogoClick ? 'pointer' : 'default',
          flex: 1,
        }}
      >
        <img src={logoUrl} alt={brandName} style={{ width: 44, height: 44 }} />
        {logoTextUrl ? (
          <img
            src={logoTextUrl}
            alt=""
            style={{ width: 65.6, height: 17.5, marginLeft: 'var(--ds-spacing-4)' }}
          />
        ) : (
          <span className="ds-header-brand-name" style={{ marginLeft: 'var(--ds-spacing-4)' }}>
            {brandName}
          </span>
        )}
      </div>

      <nav
        style={{
          display: 'flex',
          gap: isMobile ? 'var(--ds-spacing-16)' : 'var(--ds-spacing-32)',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : undefined,
          // On mobile, make the nav horizontally scrollable so tabs don't overflow
          width: isMobile ? '100%' : 'auto',
          overflowX: isMobile ? 'auto' : 'visible',
          padding: isMobile ? '0 0 var(--ds-spacing-8)' : 0,
        }}
      >
{navItems.map((item, index) => {
            const isActive = activeNavLabel === item.label && !item.disabled;
            const isDisabled = item.disabled === true;
            return (
            <button
              key={item.label}
              type="button"
              className="ds-header-nav-tab"
              onClick={() => !isDisabled && onNavClick?.(item.label)}
              disabled={isDisabled}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--ds-spacing-2)',
                background: 'none',
                border: 'none',
                cursor: isDisabled ? 'default' : 'pointer',
                padding: isMobile ? 'var(--ds-spacing-4) 0 0 0' : 'var(--ds-spacing-8) 0 0 0',
                height: isMobile ? 72 : 80,
                justifyContent: 'center',
                transition: 'opacity 0.2s ease, transform 0.1s ease',
                flex: isMobile ? '0 0 auto' : undefined,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--ds-spacing-4)',
                  position: 'relative',
                }}
              >
                {item.iconVideoUrl ? (
                  <NavIconVideo
                    videoUrl={item.iconVideoUrl}
                    posterUrl={item.iconPosterUrl}
                  />
                ) : item.iconUrl ? (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.iconUrl}
                      alt=""
                      width={52}
                      height={52}
                      fetchPriority={index === 0 ? 'high' : undefined}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : null}
                <div className="ds-header-nav-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
                  {isDisabled && (
                    <span className="ds-header-coming-soon-badge ds-header-coming-soon-badge--above-label">COMING SOON</span>
                  )}
                  <Text
                    variant="body"
                    weight={isActive ? 'medium' : 'regular'}
                    color={isActive ? 'primary' : 'secondary'}
                    style={
                      isDisabled
                        ? { color: 'var(--ds-text-muted)', cursor: 'default' }
                        : isActive
                          ? { color: 'var(--ds-navbar-active)' }
                          : { color: 'var(--ds-text-nav-inactive)' }
                    }
                  >
                    {item.label}
                  </Text>
                </div>
              </div>
              <div
                style={{
                  height: 3,
                  backgroundColor: isActive ? 'var(--ds-navbar-active)' : 'transparent',
                  width: '100%',
                  borderRadius: 30,
                  marginTop: 'auto',
                  marginBottom: 'var(--ds-spacing-6)',
                }}
              />
            </button>
          );
        })}
      </nav>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 'var(--ds-spacing-12)',
          flex: isMobile ? '0 0 auto' : 1,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        {rightSlot}
      </div>
    </header>
  );

  // Handle static divider (showDivider prop)
  if (showDivider) {
    return (
      <div style={headerWrapperWithDividerStyle}>
        {headerEl}
        <div className="ds-header-divider" style={headerDividerStyle} aria-hidden />
      </div>
    );
  }

  // Handle scroll-based divider (showDividerOnScroll prop)
  if (showDividerOnScroll) {
    return (
      <div style={headerWrapperWithDividerStyle}>
        {headerEl}
        <div className="ds-header-divider" style={headerScrollDividerStyle} aria-hidden />
      </div>
    );
  }

  return headerEl;
}
