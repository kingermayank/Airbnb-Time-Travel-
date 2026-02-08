import React from 'react';
import { Text } from '../../foundations/Text';

export interface ListingHighlightProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Single key highlight block: icon + title + description.
 * Used in a list with consistent gap (--ds-content-gap-sm) between items.
 */
export function ListingHighlight({
  icon,
  title,
  description,
  className,
  style,
}: ListingHighlightProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap: 'var(--ds-content-gap-sm)',
        ...style,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <Text
          variant="h4"
          color="primary"
          as="div"
          style={{ marginBottom: 'var(--ds-spacing-4)' }}
        >
          {title}
        </Text>
        <Text variant="body" color="secondary" as="div">
          {description}
        </Text>
      </div>
    </div>
  );
}
