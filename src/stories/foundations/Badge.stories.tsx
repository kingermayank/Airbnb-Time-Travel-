import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/design-system/foundations';

const meta = {
  title: 'Foundations/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Frequently revisited',
  },
};
