import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ThemePicker, type ThemePickerItem } from '@/design-system/patterns';

const sampleItems: ThemePickerItem[] = [
  {
    id: 'grandeur',
    title: 'Grandeur',
    subtitle: 'Opulent palaces and royal courts',
    imageUrl: '/images/themes/grand.png',
    imageAlt: 'Grandeur theme',
  },
  {
    id: 'mythic',
    title: 'Mythic',
    subtitle: 'Legends, gods, and ancient mysteries',
    imageUrl: '/images/themes/mythic.png',
    imageAlt: 'Mythic theme',
  },
  {
    id: 'conflict',
    title: 'Conflict',
    subtitle: 'Battlefields and turning points',
    imageUrl: '/images/themes/conflict.png',
    imageAlt: 'Conflict theme',
  },
  {
    id: 'classified',
    title: 'Classified',
    subtitle: 'Covert operations and hidden histories',
    imageUrl: '/images/themes/classified.png',
    imageAlt: 'Classified theme',
  },
  {
    id: 'sci-fi',
    title: 'Sci-Fi',
    subtitle: 'Advanced tech and alien worlds',
    imageUrl: '/images/themes/sci_fi.png',
    imageAlt: 'Sci-Fi theme',
  },
];

const meta = {
  title: 'Patterns/ThemePicker',
  component: ThemePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A card listing time-travel themes. Each row shows an illustration, title, and subtitle. Rows are clickable with a rounded hover highlight and support a selected state.',
      },
    },
  },
  argTypes: {
    selectedId: {
      control: 'select',
      options: [undefined, 'grandeur', 'mythic', 'conflict', 'classified', 'sci-fi'],
      description: 'Currently selected theme id',
    },
    onSelect: { action: 'selected' },
  },
} satisfies Meta<typeof ThemePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---- Default (no selection) ---- */
export const Default: Story = {
  args: {
    items: sampleItems,
  },
};

/* ---- With pre-selected theme ---- */
export const WithSelection: Story = {
  args: {
    items: sampleItems,
    selectedId: 'mythic',
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
      <ThemePicker
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
