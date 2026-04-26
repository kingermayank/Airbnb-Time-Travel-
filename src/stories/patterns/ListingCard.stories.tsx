import type { Meta, StoryObj } from '@storybook/react';
import { ListingCard } from '@/design-system/patterns';

/**
 * Listing card: image, title (up to 2 lines), sub line = era · ★ rating, heart, optional Frequently revisited chip.
 */
const meta = {
  title: 'Patterns/ListingCard',
  component: ListingCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Structure: image, title (no year in title), sub line with era/time (e.g. 306 BC) and ★ rating. Heart toggles red. Optional Frequently revisited chip. Variants: default, two-line title, frequently revisited, heart saved.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    year: { control: 'text' },
    price: { control: 'text' },
    rating: { control: 'text' },
    date: { control: 'text' },
    isGuestFavorite: { control: 'boolean' },
    defaultLiked: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof ListingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'card-1',
    image: 'https://placehold.co/320x248',
    title: "Cleopatra's Palace Suite — Alexandria",
    year: '30 BC',
    price: '$600 / hour',
    rating: '4.92',
  },
};

export const TwoLineTitle: Story = {
  args: {
    id: 'card-two-line',
    image: 'https://placehold.co/320x248',
    title: "Alexander's Campaign Tent, Persia",
    year: '306 BC',
    price: '$600 / hour',
    rating: '4.88',
  },
  parameters: {
    docs: {
      description: {
        story: 'Title wraps to two lines; sub line shows era (306 BC) and star rating.',
      },
    },
  },
};

export const WithGuestFavorite: Story = {
  args: {
    id: 'card-2',
    image: 'https://placehold.co/320x248',
    title: 'Ancient Rome Villa',
    year: '44 BC',
    price: '$800 / hour',
    rating: '4.97',
    isGuestFavorite: true,
  },
};

export const HeartSaved: Story = {
  args: {
    id: 'card-3',
    image: 'https://placehold.co/320x248',
    title: 'Ancient Rome Villa',
    year: '44 BC',
    price: '$800 / hour',
    rating: '4.97',
    defaultLiked: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Heart in saved (red) state.',
      },
    },
  },
};
