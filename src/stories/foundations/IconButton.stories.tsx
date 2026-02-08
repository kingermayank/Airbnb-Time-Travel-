import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '@/design-system/foundations';
import { Globe } from 'lucide-react';

const meta = {
  title: 'Foundations/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '40×40px only. Hover: 8% black overlay. No press state. No accent variant.',
      },
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ariaLabel: 'Language',
    icon: <Globe size={20} strokeWidth={2} />,
  },
};

export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hover over the button to see the hover state (8% black overlay).',
      },
    },
  },
  args: {
    ariaLabel: 'Language',
    icon: <Globe size={20} strokeWidth={2} />,
  },
};
