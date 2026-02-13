import React, { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Header, Button, UserMenu } from '@/design-system';
import type { NavItem } from '@/design-system/patterns';
import { PORTAL_VIDEO_URL, PORTAL_POSTER_URL, MINDSCAPES_ICON_URL } from '@/design-system/patterns/Header/header-nav-assets';
import { HelpCircle, Menu } from 'lucide-react';

/** Exact match to Figma 307-4788: only Time Travel (active) and Mindscapes (coming soon). */
const FIGMA_NAV_ITEMS: NavItem[] = [
  { label: 'Time Travel', iconVideoUrl: PORTAL_VIDEO_URL, iconPosterUrl: PORTAL_POSTER_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

function RightSlotWithUserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}
    >
      <Button variant="ghost" size="md" style={{ color: 'var(--ds-navbar-active)' }}>
        Become a host
      </Button>
      <button type="button" className="ds-header-right-icon-btn" aria-label="Help">
        <HelpCircle size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
      </button>
      <button
        type="button"
        className="ds-header-right-icon-btn"
        aria-label="Menu"
        onClick={() => setIsOpen(prev => !prev)}
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

const meta = {
  title: 'Patterns/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Header navigation from Figma 307-4788 (pixel-accurate). Brand: warpbnb. Nav: Time Travel (active), Mindscapes (coming soon). Right: Become a host, Help, Menu.',
      },
    },
  },
  argTypes: {
    brandName: { control: 'text' },
    activeNavLabel: {
      control: 'select',
      options: ['Time Travel', undefined],
    },
    onNavClick: { action: 'navClicked' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logoUrl: '/images/warp.svg',
    brandName: 'warpbnb',
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Time Travel',
    rightSlot: <RightSlotWithUserMenu />,
  },
};

export const NoActiveTab: Story = {
  args: {
    logoUrl: '/images/warp.svg',
    brandName: 'warpbnb',
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: undefined,
    rightSlot: <RightSlotWithUserMenu />,
  },
};
