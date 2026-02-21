import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CircleHelp, LifeBuoy, Circle, type LucideIcon } from 'lucide-react';
import userPng from './user.png';
import './UserMenu.css';

/** Icon key for menu items. Use semantic icons per icon-design skill. */
export type UserMenuItemIcon = 'messageSquare' | 'circleHelp' | 'lifeBuoy' | 'circle';

export interface UserMenuItem {
  label: string;
  /** Semantic icon for this item. Defaults to circle if omitted. */
  icon?: UserMenuItemIcon;
  /** Path to navigate to when clicked (uses React Router Link). When set, onClick is still called after navigation if provided. */
  to?: string;
  onClick?: () => void;
}

const MENU_ICON_MAP: Record<UserMenuItemIcon, LucideIcon> = {
  messageSquare: MessageSquare,
  circleHelp: CircleHelp,
  lifeBuoy: LifeBuoy,
  circle: Circle,
};

export interface UserMenuProps {
  /** Main menu items (Share & support and Frequently asked questions by default) with semantic icons. */
  menuItems?: UserMenuItem[];
  /** "Become a host" block: title. */
  becomeAHostTitle?: string;
  /** "Become a host" block: description. */
  becomeAHostDescription?: string;
  /** Optional image URL for the CTA; when omitted, a placeholder area is shown (for you to add asset later). */
  becomeAHostImageSrc?: string;
  /** Called when the "Become a host" block is clicked. */
  onBecomeAHostClick?: () => void;
  /** Label for the log out action. */
  logOutLabel?: string;
  /** Called when "Log out" is clicked. */
  onLogOutClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_MENU_ITEMS: UserMenuItem[] = [
  { label: 'Share & support', icon: 'lifeBuoy', to: '/support' },
  { label: 'Frequently asked questions', icon: 'circleHelp', to: '/faq' },
];

/**
 * User account dropdown menu (Figma 283-4167).
 * Sections: menu items (with semantic icons), optional "Become a host" CTA, and Log out.
 * Image asset for the CTA can be left blank and added later.
 */
export function UserMenu({
  menuItems = DEFAULT_MENU_ITEMS,
  becomeAHostTitle = 'Become a host',
  becomeAHostDescription = "Start hosting. Only if you're okay with guests from other timelines.",
  becomeAHostImageSrc = userPng,
  onBecomeAHostClick,
  logOutLabel = 'Log out',
  onLogOutClick,
  className,
  style,
}: UserMenuProps) {
  return (
    <div
      className={`ds-user-menu ${className ?? ''}`.trim()}
      style={style}
      role="menu"
      aria-label="Account menu"
    >
      <div className="ds-user-menu__section">
        {menuItems.map((item) => {
          const IconComponent = MENU_ICON_MAP[item.icon ?? 'circle'];
          const content = (
            <>
              <span className="ds-user-menu__item-icon" aria-hidden>
                <IconComponent size={16} strokeWidth={2.5} stroke="currentColor" fill="none" />
              </span>
              {item.label}
            </>
          );
          if (item.to) {
            return (
              <Link
                key={item.label}
                to={item.to}
                className="ds-user-menu__item ds-user-menu__item--link"
                role="menuitem"
                onClick={item.onClick}
              >
                {content}
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              type="button"
              className="ds-user-menu__item"
              role="menuitem"
              onClick={item.onClick}
            >
              {content}
            </button>
          );
        })}
      </div>

      {(becomeAHostTitle || becomeAHostDescription) && (
        <>
          <hr className="ds-user-menu__divider" />
          <div className="ds-user-menu__section">
            <button
              type="button"
              className="ds-user-menu__cta"
              role="menuitem"
              onClick={onBecomeAHostClick}
            >
              <div className="ds-user-menu__cta-content">
                {becomeAHostTitle && <p className="ds-user-menu__cta-title">{becomeAHostTitle}</p>}
                {becomeAHostDescription && (
                  <p className="ds-user-menu__cta-description">{becomeAHostDescription}</p>
                )}
              </div>
              {becomeAHostImageSrc ? (
                <img
                  src={becomeAHostImageSrc}
                  alt=""
                  className="ds-user-menu__cta-image"
                  width={48}
                  height={48}
                />
              ) : (
                <div className="ds-user-menu__cta-image ds-user-menu__cta-image--placeholder" aria-hidden />
              )}
            </button>
          </div>
        </>
      )}

      <hr className="ds-user-menu__divider" />

      <button
        type="button"
        className="ds-user-menu__logout"
        role="menuitem"
        onClick={onLogOutClick}
      >
        {logOutLabel}
      </button>
    </div>
  );
}
