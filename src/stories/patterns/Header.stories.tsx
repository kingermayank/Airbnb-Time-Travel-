import type { Meta, StoryObj } from '@storybook/react';
import { Header, Button } from '@/design-system';
import type { NavItem } from '@/design-system/patterns';
import { TIME_TRAVEL_ICON_URL, MINDSCAPES_ICON_URL } from '@/design-system/patterns/Header/header-nav-assets';
import { HelpCircle, Menu } from 'lucide-react';

/** Exact match to Figma 307-4788: only Time Travel (active) and Mindscapes (coming soon). */
const FIGMA_NAV_ITEMS: NavItem[] = [
  { label: 'Time Travel', iconUrl: TIME_TRAVEL_ICON_URL },
  { label: 'Mindscapes', iconUrl: MINDSCAPES_ICON_URL, disabled: true },
];

const defaultRightSlot = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <Button variant="ghost" size="md" style={{ color: 'var(--ds-navbar-active)' }}>
      Become a host
    </Button>
    <button type="button" className="ds-header-right-icon-btn" aria-label="Help">
      <HelpCircle size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
    </button>
    <button type="button" className="ds-header-right-icon-btn" aria-label="Menu">
      <Menu size={20} strokeWidth={2} style={{ color: 'var(--ds-navbar-active)' }} />
    </button>
  </div>
);

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
    brandName: 'warpbnb',
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: 'Time Travel',
    rightSlot: defaultRightSlot,
  },
};

export const NoActiveTab: Story = {
  args: {
    brandName: 'warpbnb',
    navItems: FIGMA_NAV_ITEMS,
    activeNavLabel: undefined,
    rightSlot: defaultRightSlot,
  },
};
