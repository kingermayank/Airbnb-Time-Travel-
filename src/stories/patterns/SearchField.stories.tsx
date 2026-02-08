import type { Meta, StoryObj } from '@storybook/react';
import { SearchField } from '@/design-system/patterns';

const meta = {
  title: 'Patterns/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Search field from Figma 303-4652. Default: no section hovered; dividers visible. Hover states: hovering Where, Era, or Who shows 8% black overlay and hides the adjacent divider(s). Use pinnedHoverSection in Storybook to show each hover state.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--ds-spacing-12) 0 var(--ds-spacing-32)', width: 851 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    pinnedHoverSection: {
      control: 'radio',
      options: [undefined, 'where', 'era', 'who'],
    },
    onWhereClick: { action: 'whereClicked' },
    onEraClick: { action: 'eraClicked' },
    onWhoClick: { action: 'whoClicked' },
    onSearch: { action: 'searchClicked' },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default: no section hovered; both dividers visible. Hover over a section to see overlay and divider hide.',
      },
    },
  },
};

export const WhereHover: Story = {
  args: {
    pinnedHoverSection: 'where',
  },
  parameters: {
    docs: {
      description: {
        story: 'Where hover state: overlay on Where, divider after Where hidden.',
      },
    },
  },
};

export const EraHover: Story = {
  args: {
    pinnedHoverSection: 'era',
  },
  parameters: {
    docs: {
      description: {
        story: 'Era hover state: overlay on Era, both dividers hidden.',
      },
    },
  },
};

export const WhoHover: Story = {
  args: {
    pinnedHoverSection: 'who',
  },
  parameters: {
    docs: {
      description: {
        story: 'Who hover state: overlay on Who, divider before Who hidden.',
      },
    },
  },
};
