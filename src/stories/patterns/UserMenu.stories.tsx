import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu } from '@/design-system/patterns';
import type { UserMenuItem } from '@/design-system/patterns';

/**
 * User account dropdown menu (Figma 283-4167).
 * Pixel-perfect: white card, 12px radius, 16px horizontal padding, list items with circle icon,
 * "Become a host" CTA block (image placeholder left for you to add), and Log out.
 */
const meta = {
  title: 'Patterns/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Account dropdown with menu items (circle icon + label), optional "Become a host" CTA with title/description and image placeholder, and Log out. Image asset for the CTA is left blank by default; you can pass `becomeAHostImageSrc` or add an image later.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    menuItems: { control: false },
    becomeAHostTitle: { control: 'text' },
    becomeAHostDescription: { control: 'text' },
    becomeAHostImageSrc: { control: 'text' },
    logOutLabel: { control: 'text' },
    onBecomeAHostClick: { action: 'becomeAHost' },
    onLogOutClick: { action: 'logOut' },
  },
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: UserMenuItem[] = [
  { label: 'Wishlists' },
  { label: 'What is this?' },
  { label: 'How did I build this?' },
  { label: 'Share' },
];

export const Default: Story = {
  args: {
    menuItems: defaultItems,
    becomeAHostTitle: 'Become a host',
    becomeAHostDescription: "Start hosting and earn extra income if you're okay.",
    logOutLabel: 'Log out',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default menu with Figma copy. Image placeholder is blank for you to add an asset.',
      },
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    menuItems: defaultItems.map((item, i) => ({
      ...item,
      onClick: () => console.log(`Clicked: ${item.label}`),
    })),
    becomeAHostTitle: 'Become a host',
    becomeAHostDescription: "Start hosting and earn extra income if you're okay.",
    onBecomeAHostClick: () => console.log('Become a host clicked'),
    onLogOutClick: () => console.log('Log out clicked'),
    logOutLabel: 'Log out',
  },
  parameters: {
    docs: {
      description: {
        story: 'All menu items and actions wired to callbacks (see Actions panel).',
      },
    },
  },
};

export const CustomMenuItems: Story = {
  args: {
    menuItems: [
      { label: 'Trips' },
      { label: 'Wishlists' },
      { label: 'Account' },
    ],
    becomeAHostTitle: 'Become a host',
    becomeAHostDescription: 'Share your space and earn.',
    logOutLabel: 'Log out',
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom set of menu items.',
      },
    },
  },
};

export const WithoutBecomeAHost: Story = {
  args: {
    menuItems: defaultItems,
    becomeAHostTitle: '',
    becomeAHostDescription: '',
    logOutLabel: 'Log out',
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu without the "Become a host" block (empty title/description).',
      },
    },
  },
};
