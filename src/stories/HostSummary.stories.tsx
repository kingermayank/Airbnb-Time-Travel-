import type { Meta, StoryObj } from '@storybook/react';
import { HostSummary } from '../design-system/patterns';

const meta: Meta<typeof HostSummary> = {
  title: 'Patterns/HostSummary',
  component: HostSummary,
  args: {
    hostName: 'Dr. Elara Voss',
    hostAvatarUrl: '/images/hosts/elara-voss.jpg',
    badges: 'Temporal Guardian • 124 lunar cycles hosting',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof HostSummary>;

export const Default: Story = {};

export const WithoutBadges: Story = {
  args: {
    badges: undefined,
    hostName: 'Kai Chronos',
    hostAvatarUrl: '/images/hosts/kai-chronos.jpg',
  },
};

