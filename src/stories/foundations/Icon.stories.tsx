import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '@/design-system/foundations';
import { Heart, Star, Search } from 'lucide-react';

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'radio',
      options: ['primary', 'muted', 'accent', 'white'],
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    color: 'muted',
    children: <Heart />,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    color: 'muted',
    children: <Star size={16} />,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    color: 'muted',
    children: <Search size={32} />,
  },
};

export const PrimaryColor: Story = {
  args: {
    size: 'md',
    color: 'primary',
    children: <Heart />,
  },
};

export const AccentColor: Story = {
  args: {
    size: 'md',
    color: 'accent',
    children: <Heart fill="currentColor" />,
  },
};

export const WhiteColor: Story = {
  args: {
    size: 'md',
    color: 'white',
    children: <Heart fill="none" stroke="currentColor" strokeWidth={2} />,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: '#333' }}>
        <Story />
      </div>
    ),
  ],
};

export const AllSizesAndColors: Story = {
  render: () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    const colors = ['primary', 'muted', 'accent', 'white'] as const;
    const iconSizeMap = { sm: 16, md: 24, lg: 32 };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {colors.map((color) => (
          <div
            key={color}
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              background: color === 'white' ? '#333' : undefined,
              padding: color === 'white' ? 8 : 0,
              borderRadius: 4,
            }}
          >
            <span style={{ width: 60, fontSize: 12, color: color === 'white' ? '#fff' : '#717171' }}>
              {color}
            </span>
            {sizes.map((size) => (
              <Icon key={size} size={size} color={color}>
                <Heart size={iconSizeMap[size]} stroke="currentColor" strokeWidth={2} />
              </Icon>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
