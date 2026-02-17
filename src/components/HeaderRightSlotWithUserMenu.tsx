import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HelpCircle, Menu } from 'lucide-react';
import { Button, UserMenu } from '../design-system';
import { useDeviceType } from '../hooks/use-mobile';

/**
 * Shared header right slot: "Become a host", Help (FAQ), and hamburger menu with UserMenu dropdown.
 * Used by main app, listing detail, confirmation, FAQ, and feedback pages.
 * Closes dropdown only when route changes (prevPathnameRef) and uses a short close animation.
 */
export function HeaderRightSlotWithUserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDeviceType();
  const prevPathnameRef = useRef(location.pathname);

  const showPrimaryActions = !isMobile && !isTablet;
  const showHamburger = !isMobile;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      if (isOpen) handleClose();
    }
  }, [location.pathname, isOpen, handleClose]);

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
      {showPrimaryActions && (
        <>
          <Button variant="ghost" size="md" style={{ color: 'var(--ds-navbar-active)' }} onClick={() => navigate('/')}>
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
        </>
      )}
      {showHamburger && (
        <button
          type="button"
          className="ds-header-right-icon-btn"
          aria-label="Menu"
          style={{ border: 'none' }}
          onClick={() => {
            if (isOpen) {
              handleClose();
            } else {
              setIsOpen(true);
              setIsClosing(false);
            }
          }}
        >
          <Menu size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
        </button>
      )}
      {isOpen && (
        <div
          className={`ds-user-menu-wrapper ${isClosing ? 'ds-user-menu-wrapper--closing' : ''}`}
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
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
