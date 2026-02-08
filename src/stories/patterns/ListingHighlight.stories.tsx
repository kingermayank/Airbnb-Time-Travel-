import type { Meta, StoryObj } from '@storybook/react';
import { ListingHighlight } from '@/design-system/patterns';
import { DoorOpen, Star, Lock } from 'lucide-react';

const meta = {
  title: 'Patterns/ListingHighlight',
  component: ListingHighlight,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Single key highlight: icon + title + description. Use in a list with --ds-content-gap-sm between items.',
      },
    },
  },
} satisfies Meta<typeof ListingHighlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <DoorOpen size={24} color="var(--ds-text-primary)" />,
    title: 'Entire Colony Pod',
    description:
      "A private fully pressurized Mars habitat with no shared modules, complete autonomy.",
  },
};

export const Multiple: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-content-gap-md)' }}>
      <ListingHighlight
        icon={<DoorOpen size={24} color="var(--ds-text-primary)" />}
        title="Entire Colony Pod"
        description="A private fully pressurized Mars habitat with no shared modules, complete autonomy."
      />
      <ListingHighlight
        icon={<Star size={24} color="var(--ds-text-primary)" />}
        title="Enhanced Decontamination"
        description="Colony Spacers's multi-step planetary air filtration protocol to keep Martian dust outside."
      />
      <ListingHighlight
        icon={<Lock size={24} color="var(--ds-text-primary)" />}
        title="Autonomous Entry"
        description="Self check-in via secure passcode and keycard with automatic pressurized equalization."
      />
    </div>
  ),
};
