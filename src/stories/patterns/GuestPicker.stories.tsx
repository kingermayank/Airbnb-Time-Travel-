import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { GuestPicker, type GuestCategory } from '@/design-system/patterns';

const defaultCategories: GuestCategory[] = [
  {
    id: 'adults',
    label: 'Adults',
    subtitle: 'Ages 13 or above',
    count: 0,
  },
  {
    id: 'children',
    label: 'Children',
    subtitle: 'Ages 2 – 12',
    count: 0,
  },
];

const meta = {
  title: 'Patterns/GuestPicker',
  component: GuestPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A card with guest category rows. Each row has a label, subtitle, and a minus/plus stepper separated by dividers. The minus button is disabled at zero.',
      },
    },
  },
  argTypes: {
    onChange: { action: 'changed' },
  },
} satisfies Meta<typeof GuestPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- Default (counts at zero) ---- */
export const Default: Story = {
  args: {
    categories: defaultCategories,
  },
};

/* ---- With initial counts ---- */
export const WithCounts: Story = {
  args: {
    categories: [
      { id: 'adults', label: 'Adults', subtitle: 'Ages 13 or above', count: 2 },
      { id: 'children', label: 'Children', subtitle: 'Ages 2 – 12', count: 1 },
    ],
  },
};

/* ---- Interactive ---- */
export const Interactive: Story = {
  args: {
    categories: defaultCategories,
  },
  render: (args) => {
    const [cats, setCats] = useState<GuestCategory[]>(args.categories);
    return (
      <GuestPicker
        categories={cats}
        onChange={(id, newCount) => {
          setCats((prev) =>
            prev.map((c) => (c.id === id ? { ...c, count: newCount } : c)),
          );
          args.onChange?.(id, newCount);
        }}
      />
    );
  },
};

/* ---- With max limits ---- */
export const WithMaxLimits: Story = {
  args: {
    categories: [
      { id: 'adults', label: 'Adults', subtitle: 'Ages 13 or above', count: 0, max: 4 },
      { id: 'children', label: 'Children', subtitle: 'Ages 2 – 12', count: 0, max: 3 },
    ],
  },
  render: (args) => {
    const [cats, setCats] = useState<GuestCategory[]>(args.categories);
    return (
      <GuestPicker
        categories={cats}
        onChange={(id, newCount) => {
          setCats((prev) =>
            prev.map((c) => (c.id === id ? { ...c, count: newCount } : c)),
          );
          args.onChange?.(id, newCount);
        }}
      />
    );
  },
};

/* ---- Three categories ---- */
export const ThreeCategories: Story = {
  args: {
    categories: [
      { id: 'adults', label: 'Adults', subtitle: 'Ages 13 or above', count: 1 },
      { id: 'children', label: 'Children', subtitle: 'Ages 2 – 12', count: 0 },
      { id: 'infants', label: 'Infants', subtitle: 'Under 2', count: 0 },
    ],
  },
  render: (args) => {
    const [cats, setCats] = useState<GuestCategory[]>(args.categories);
    return (
      <GuestPicker
        categories={cats}
        onChange={(id, newCount) => {
          setCats((prev) =>
            prev.map((c) => (c.id === id ? { ...c, count: newCount } : c)),
          );
          args.onChange?.(id, newCount);
        }}
      />
    );
  },
};
