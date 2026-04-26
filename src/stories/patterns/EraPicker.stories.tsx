import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EraPicker, type EraPickerItem } from '@/design-system/patterns';

const sampleItems: EraPickerItem[] = [
  {
    id: 'origins',
    title: 'Origins',
    subtitle: 'Pre-civilization',
    imageUrl: '/images/eras/origins.png',
    imageAlt: 'Origins era',
  },
  {
    id: 'classical',
    title: 'Classical',
    subtitle: 'Empires, kingdoms, early societies',
    imageUrl: '/images/eras/classical.png',
    imageAlt: 'Classical era',
  },
  {
    id: 'recent-past',
    title: 'Recent Past',
    subtitle: 'Familiar world, different rules',
    imageUrl: '/images/eras/recent_past.png',
    imageAlt: 'Recent Past era',
  },
  {
    id: 'future',
    title: 'Future',
    subtitle: 'Post-present and speculative',
    imageUrl: '/images/eras/future.png',
    imageAlt: 'Future era',
  },
];

const meta = {
  title: 'Patterns/EraPicker',
  component: EraPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A card listing time-travel eras. Each row shows an illustration, title, and subtitle. Rows are clickable with a rounded hover highlight and support a selected state.',
      },
    },
  },
  argTypes: {
    selectedId: {
      control: 'select',
      options: [undefined, 'origins', 'classical', 'recent-past', 'future'],
      description: 'Currently selected era id',
    },
    onSelect: { action: 'selected' },
  },
} satisfies Meta<typeof EraPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- Default (no selection) ---- */
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

/* ---- With pre-selected era ---- */
export const WithSelection: Story = {
  args: {
    items: sampleItems,
    selectedId: 'classical',
  },
};

/* ---- Interactive (click to select) ---- */
export const Interactive: Story = {
  args: {
    items: sampleItems,
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | undefined>(undefined);
    return (
      <EraPicker
        {...args}
        selectedId={selected}
        onSelect={(id) => {
          setSelected(id);
          args.onSelect?.(id);
        }}
      />
    );
  },
};

/* ---- Two items only ---- */
export const TwoItems: Story = {
  args: {
    items: sampleItems.slice(0, 2),
  },
};

/* ---- Single item ---- */
export const SingleItem: Story = {
  args: {
    items: sampleItems.slice(0, 1),
  },
};
