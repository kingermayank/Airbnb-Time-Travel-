import type { Meta, StoryObj } from '@storybook/react';
import { HostCard } from '../HostCard';

const meta: Meta<typeof HostCard> = {
  title: 'Patterns/HostCard',
  component: HostCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    name: 'Monica',
    roleLabel: 'Host',
    avatarUrl: '/images/hosts/monica.jpg',
    reviews: 14,
    rating: 4.57,
    yearsHosting: 31,
  },
};

export default meta;

type Story = StoryObj<typeof HostCard>;

export const Default: Story = {};

