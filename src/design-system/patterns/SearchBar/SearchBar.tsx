import React from 'react';
import { Text } from '../../foundations/Text';
import { Button } from '../../foundations/Button';
import { Divider } from '../../foundations/Divider';

export type EraOption = 'all' | 'past' | 'future';

export interface SearchBarProps {
  era: EraOption;
  onEraChange: (era: EraOption) => void;
  geographyLabel?: string;
  onGeographyClick?: () => void;
  guestCount?: number;
  onGuestsChange?: (count: number) => void;
  onSearch?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  padding: 'var(--ds-spacing-12) 0 var(--ds-spacing-32) 0',
  backgroundColor: 'rgba(251, 251, 251, 1)',
  display: 'flex',
  justifyContent: 'center',
  borderBottom: '1px solid var(--ds-border-light)',
};

const barStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 851,
  height: 64,
  backgroundColor: 'var(--ds-surface)',
  borderRadius: 40,
  boxShadow: '0px 0px 10px var(--ds-border), 0px 1px 2px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid var(--ds-border)',
};

const sectionButtonStyle: React.CSSProperties = {
  flex: 1,
  height: '100%',
  borderRadius: 40,
  backgroundColor: 'transparent',
  border: 'none',
  padding: '0 var(--ds-spacing-40)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
};

export function SearchBar({
  era,
  onEraChange,
  geographyLabel = 'Search destinations',
  onGeographyClick,
  guestCount = 1,
  onGuestsChange,
  onSearch,
  className,
  style,
}: SearchBarProps) {
  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      <div style={barStyle}>
        <button
          type="button"
          style={sectionButtonStyle}
          onClick={onGeographyClick}
        >
          <Text variant="label" color="primary">
            Where
          </Text>
          <Text variant="body" color="secondary">
            {geographyLabel}
          </Text>
        </button>

        <Divider orientation="vertical" />

        <button
          type="button"
          style={{ ...sectionButtonStyle, padding: '0 var(--ds-spacing-32)' }}
        >
          <Text variant="label" color="primary">
            Era
          </Text>
          <div style={{ display: 'flex', gap: 'var(--ds-spacing-8)', marginTop: 'var(--ds-spacing-4)' }}>
            {(['all', 'past', 'future'] as const).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => onEraChange(e)}
                style={{
                  padding: 'var(--ds-spacing-4) var(--ds-spacing-8)',
                  borderRadius: 'var(--ds-radius-full)',
                  border: era === e ? '1px solid var(--ds-primary)' : '1px solid var(--ds-border)',
                  background: era === e ? 'var(--ds-primary)' : 'transparent',
                  color: era === e ? 'var(--ds-primary-foreground)' : 'var(--ds-text-primary)',
                  fontSize: 'var(--ds-text-12)',
                  fontFamily: 'var(--ds-font-family)',
                  cursor: 'pointer',
                }}
              >
                {e === 'all' ? 'All' : e === 'past' ? 'Past' : 'Future'}
              </button>
            ))}
          </div>
        </button>

        <Divider orientation="vertical" />

        <button
          type="button"
          style={sectionButtonStyle}
          onClick={() => onGuestsChange?.(guestCount)}
        >
          <Text variant="label" color="primary">
            Guests
          </Text>
          <Text variant="body" color="secondary">
            {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </Text>
        </button>

        <div style={{ padding: 'var(--ds-spacing-8)' }}>
          <Button
            variant="primary"
            size="md"
            onClick={onSearch}
            style={{
              borderRadius: 'var(--ds-radius-full)',
              padding: 'var(--ds-spacing-10) var(--ds-spacing-20)',
            }}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
