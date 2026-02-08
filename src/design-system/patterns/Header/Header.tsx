import React from 'react';
import { Text } from '../../foundations/Text';
import './Header.css';

/** Header pattern aligned to Figma 307-4788 (Header navigation). */

export interface NavItem {
  label: string;
  iconUrl?: string;
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
  rightSlot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const headerStyle: React.CSSProperties = {
  width: '100%',
  height: 101,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 var(--ds-spacing-40)',
  backgroundColor: 'var(--ds-surface-header)',
  boxSizing: 'border-box',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

export function Header({
  logoUrl = 'https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/c976b0ad-ec40-4b9b-92cf-fc5026868616.svg',
  logoTextUrl,
  brandName = 'warpbnb',
  navItems,
  activeNavLabel,
  onNavClick,
  rightSlot,
  className,
  style,
}: HeaderProps) {
  return (
    <header className={className} style={{ ...headerStyle, ...style }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          flex: 1,
        }}
      >
        <img src={logoUrl} alt={brandName} style={{ width: 40, height: 40 }} />
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
          gap: 'var(--ds-spacing-32)',
          height: '100%',
          alignItems: 'center',
        }}
      >
        {navItems.map((item) => {
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
                padding: 'var(--ds-spacing-8) 0 0 0',
                height: 80,
                justifyContent: 'center',
                transition: 'opacity 0.2s',
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
                {item.iconUrl && (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.iconUrl}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
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
          flex: 1,
        }}
      >
        {rightSlot}
      </div>
    </header>
  );
}
