import React from 'react';
import { Text } from '../../foundations/Text';

export interface VehicleCardProps {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  priceModifier?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const cardInnerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ds-spacing-12)',
  cursor: 'pointer',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: 120,
  objectFit: 'cover',
  borderRadius: 'var(--ds-radius-md)',
  backgroundColor: 'var(--ds-border-light)',
};

export function VehicleCard({
  id,
  name,
  description,
  iconUrl,
  priceModifier,
  selected,
  onSelect,
  className,
  style,
}: VehicleCardProps) {
  const wrapperStyle: React.CSSProperties = {
    backgroundColor: 'var(--ds-surface)',
    borderRadius: 'var(--ds-radius-lg)',
    boxShadow: 'var(--ds-shadow-card)',
    padding: 'var(--ds-spacing-16)',
    border: selected ? '2px solid var(--ds-primary)' : '1px solid var(--ds-border)',
    ...style,
  };
  return (
    <div className={className} style={wrapperStyle}>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === 'Enter' && onSelect?.()}
        style={cardInnerStyle}
      >
        {iconUrl && (
          <img src={iconUrl} alt="" style={imageStyle} />
        )}
        <Text variant="h4" color="primary">
          {name}
        </Text>
        <Text variant="bodySmall" color="secondary">
          {description}
        </Text>
        {priceModifier != null && (
          <Text variant="body" weight="medium" color="primary">
            {priceModifier}
          </Text>
        )}
      </div>
    </div>
  );
}
