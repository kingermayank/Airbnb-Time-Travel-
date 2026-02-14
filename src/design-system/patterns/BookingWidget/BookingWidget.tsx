import React from 'react';
import { Text } from '../../foundations/Text';
import { Button } from '../../foundations/Button';

export interface DurationOption {
  value: number;
  label: string;
  multiplier: number;
}

export interface BookingWidgetProps {
  durationOptions: DurationOption[];
  selectedDuration: DurationOption;
  onDurationChange: (option: DurationOption) => void;
  guestCount: number;
  onGuestCountChange?: (count: number) => void;
  priceDisplay: string;
  onBook: () => void;
  timeNote?: string;
  className?: string;
  style?: React.CSSProperties;
}

const defaultTimeNote =
  "Time doesn't change—you'll travel there and return to the same moment you left.";

const containerStyle: React.CSSProperties = {
  border: '1px solid var(--ds-border)',
  borderRadius: 'var(--ds-radius-lg)',
  padding: 'var(--ds-spacing-24)',
  boxShadow: 'var(--ds-shadow-card)',
};

export function BookingWidget({
  durationOptions,
  selectedDuration,
  onDurationChange,
  guestCount,
  onGuestCountChange,
  priceDisplay,
  onBook,
  timeNote = defaultTimeNote,
  className,
  style,
}: BookingWidgetProps) {
  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      <Text variant="h4" color="primary" style={{ marginBottom: 'var(--ds-spacing-16)' }}>
        Select your time window
      </Text>

      <div style={{ marginBottom: 'var(--ds-spacing-16)' }}>
        <Text variant="label" color="primary" style={{ marginBottom: 'var(--ds-spacing-8)' }}>
          Duration
        </Text>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--ds-spacing-8)',
          }}
        >
          {durationOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onDurationChange(opt)}
              style={{
                minHeight: 44,
                padding: 'var(--ds-spacing-8) var(--ds-spacing-16)',
                borderRadius: 'var(--ds-radius-md)',
                border:
                  selectedDuration.value === opt.value
                    ? '2px solid var(--ds-primary)'
                    : '1px solid var(--ds-border)',
                background:
                  selectedDuration.value === opt.value
                    ? 'var(--ds-secondary)'
                    : 'transparent',
                fontFamily: 'var(--ds-font-family)',
                fontSize: 'var(--ds-text-14)',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--ds-spacing-16)' }}>
        <Text variant="label" color="primary" style={{ marginBottom: 'var(--ds-spacing-8)' }}>
          Guests
        </Text>
        <Text variant="body" color="secondary">
          {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
        </Text>
        {onGuestCountChange && (
          <button
            type="button"
            onClick={() => onGuestCountChange(guestCount)}
            style={{
              marginTop: 'var(--ds-spacing-4)',
              minHeight: 44,
              padding: 'var(--ds-spacing-8) 0',
              background: 'none',
              border: 'none',
              fontFamily: 'var(--ds-font-family)',
              fontSize: 'var(--ds-text-12)',
              color: 'var(--ds-accent)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Change
          </button>
        )}
      </div>

      <div
        style={{
          padding: 'var(--ds-spacing-12)',
          backgroundColor: 'var(--ds-secondary)',
          borderRadius: 'var(--ds-radius-md)',
          marginBottom: 'var(--ds-spacing-16)',
        }}
      >
        <Text variant="bodySmall" color="secondary">
          {timeNote}
        </Text>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--ds-spacing-16)',
        }}
      >
        <Text variant="body" color="primary">
          Total
        </Text>
        <Text variant="h4" color="primary">
          {priceDisplay}
        </Text>
      </div>

      <Button variant="primary" size="lg" onClick={onBook} style={{ width: '100%' }}>
        Reserve
      </Button>
    </div>
  );
}
