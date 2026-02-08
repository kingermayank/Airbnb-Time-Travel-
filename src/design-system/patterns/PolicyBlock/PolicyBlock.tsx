import React from 'react';
import { Text } from '../../foundations/Text';

export interface PolicyBlockProps {
  icon: React.ReactNode;
  title: string;
  items: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * One "things to know" block: icon + category title + bullet list.
 * Uses outline card treatment and content-gap-sm for list spacing.
 */
export function PolicyBlock({
  icon,
  title,
  items,
  className,
  style,
}: PolicyBlockProps) {
  const wrapperStyle: React.CSSProperties = {
    backgroundColor: 'var(--ds-surface)',
    borderRadius: 'var(--ds-radius-lg)',
    border: '1px solid var(--ds-border-light)',
    padding: 'var(--ds-spacing-24)',
    ...style,
  };
  return (
    <div className={className} style={wrapperStyle}>
      <div
        style={{
          display: 'flex',
          gap: 'var(--ds-content-gap-sm)',
          marginBottom: 'var(--ds-content-gap-sm)',
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
        <Text variant="h4" color="primary" as="div">
          {title}
        </Text>
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 'var(--ds-spacing-20)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-spacing-8)',
        }}
      >
        {items.map((item, i) => (
          <li key={i}>
            <Text variant="body" color="primary" as="span">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
