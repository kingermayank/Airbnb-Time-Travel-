import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from '@/design-system/foundations';

const meta = {
  title: 'Foundations/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Section heading for listing detail sections. Uses h2 typography and consistent margin-bottom (--ds-content-gap-md).',
      },
    },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Where you'll sleep",
  },
};

export const WhatThisPlaceOffers: Story = {
  args: {
    children: 'What this place offers',
  },
};

export const ThingsToKnow: Story = {
  args: {
    children: 'Things to know',
  },
};
