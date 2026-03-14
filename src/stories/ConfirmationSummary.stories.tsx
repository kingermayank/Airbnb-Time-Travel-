import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationSummary } from '../design-system/patterns/ConfirmationSummary';

const meta: Meta<typeof ConfirmationSummary> = {
  title: 'Patterns/ConfirmationSummary',
  component: ConfirmationSummary,
  parameters: {
    layout: 'centered',
  },
  args: {
    statusMessage: "You're all set for your jump",
    listingTitle: 'Hidden Roman Bathhouse beneath the Colosseum',
    listingImageUrl: '/images/listings/roman-bathhouse.jpg',
    durationLabel: '3-day timeline access',
    guestCount: 3,
    vehicleName: "Doctor Strange's Time Stone",
    totalDisplay: 'Ξ4.2 total',
    bookingId: 'AX9-42-OMEGA',
  },
};

export default meta;

type Story = StoryObj<typeof ConfirmationSummary>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    statusMessage: "We're securing your arrival window",
    listingTitle: 'Cliffside Portal Overlooking the Event Horizon',
    listingImageUrl: '/images/listings/portal-cliffside.jpg',
    durationLabel: undefined,
    guestCount: undefined,
    vehicleName: undefined,
    totalDisplay: undefined,
    bookingId: undefined,
  },
};

