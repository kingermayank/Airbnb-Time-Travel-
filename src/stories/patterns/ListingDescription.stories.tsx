import type { Meta, StoryObj } from '@storybook/react';
import { ListingDescription } from '@/design-system/patterns';

const longContent =
  'Come and stay at the SpaceX Mars Colony Pod at Olympus Mons Base. Experience life in a fully pressurized habitat with stunning surface views, Starlink connectivity, and optional rover excursions. The pod includes a compact galley, climate control, and 24/7 base security.';

const meta = {
  title: 'Patterns/ListingDescription',
  component: ListingDescription,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Description paragraph + "Show more" CTA. Clicking "Show more" opens a modal with the full description. No expanded state or "Show less".',
      },
    },
  },
} satisfies Meta<typeof ListingDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Short: Story = {
  args: {
    content: 'A cozy loft in the heart of the city. No truncation or button.',
  },
};

export const WithShowMore: Story = {
  args: {
    content: longContent,
    maxVisibleLength: 120,
  },
};
