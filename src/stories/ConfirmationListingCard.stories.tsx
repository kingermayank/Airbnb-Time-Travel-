import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationListingCard } from '../design-system/patterns/ConfirmationListingCard';

const meta: Meta<typeof ConfirmationListingCard> = {
  title: 'Patterns/ConfirmationListingCard',
  component: ConfirmationListingCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    imageUrl: '/images/listings/portal-laboratory.jpg',
    imageAlt: 'Experimental time-portal laboratory with glowing ring',
    title: 'Experimental Portal Lab near the Event Horizon',
    eraOrDate: '2374 CE',
    guestCount: 2,
    totalDisplay: '₿2.4 total',
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmationListingCard>;

export const Default: Story = {};

export const SoloTraveler: Story = {
  args: {
    guestCount: 1,
    totalDisplay: '₿1.2 total',
    title: 'Quantum Capsule above Neo-Tokyo',
    eraOrDate: '2099 CE',
  },
};

