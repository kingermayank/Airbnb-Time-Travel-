import React from 'react';
import { Text } from '../../foundations/Text';

export interface SleepArrangementCardProps {
  imageUrl: string;
  imageAlt?: string;
  roomName: string;
  bedsDescription: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Outline card for a sleep arrangement: image + room name + beds text.
 */
export function SleepArrangementCard({
  imageUrl,
  imageAlt,
  roomName,
  bedsDescription,
  className,
  style,
}: SleepArrangementCardProps) {
  const wrapperStyle: React.CSSProperties = {
    backgroundColor: 'var(--ds-surface)',
    borderRadius: 'var(--ds-radius-lg)',
    border: '1px solid var(--ds-border-light)',
    padding: 'var(--ds-spacing-24)',
    ...style,
  };
  return (
    <div className={className} style={wrapperStyle}>
      <img
        src={imageUrl}
        alt={imageAlt ?? roomName}
        style={{
          width: '100%',
          aspectRatio: '4/3',
          objectFit: 'cover',
          borderRadius: 'var(--ds-radius-md)',
          marginBottom: 'var(--ds-content-gap-sm)',
        }}
      />
      <Text variant="h4" color="primary" as="div" style={{ marginBottom: 'var(--ds-spacing-8)' }}>
        {roomName}
      </Text>
      <Text variant="body" color="secondary" as="div">
        {bedsDescription}
      </Text>
    </div>
  );
}
