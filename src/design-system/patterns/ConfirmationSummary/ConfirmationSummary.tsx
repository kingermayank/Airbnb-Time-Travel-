import React from 'react';
import { Text } from '../../foundations/Text';
import { Button } from '../../foundations/Button';

export interface ConfirmationSummaryProps {
  statusMessage?: string;
  listingTitle: string;
  listingImageUrl: string;
  durationLabel?: string;
  guestCount?: number;
  vehicleName?: string;
  totalDisplay?: string;
  bookingId?: string;
  onShare?: () => void;
  onFeedback?: () => void;
  onGoHome?: () => void;
  onViewListing?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const defaultStatusMessage = "We're securing your arrival window";

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--ds-spacing-24)',
  padding: 'var(--ds-spacing-32)',
  maxWidth: 560,
  margin: '0 auto',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: 280,
  objectFit: 'cover',
  borderRadius: 'var(--ds-radius-lg)',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--ds-spacing-12)',
  justifyContent: 'center',
};

export function ConfirmationSummary({
  statusMessage = defaultStatusMessage,
  listingTitle,
  listingImageUrl,
  durationLabel,
  guestCount,
  vehicleName,
  totalDisplay,
  bookingId,
  onShare,
  onFeedback,
  onGoHome,
  onViewListing,
  className,
  style,
}: ConfirmationSummaryProps) {
  return (
    <div className={className} style={{ ...containerStyle, ...style }}>
      <Text variant="h2" color="primary" style={{ textAlign: 'center' }}>
        {statusMessage}
      </Text>

      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          backgroundColor: 'var(--ds-surface)',
          borderRadius: 'var(--ds-radius-lg)',
          boxShadow: 'var(--ds-shadow-card)',
        }}
      >
        <img src={listingImageUrl} alt={listingTitle} style={imageStyle} />
        <div style={{ padding: 'var(--ds-spacing-16)' }}>
          <Text variant="h4" color="primary" style={{ marginBottom: 'var(--ds-spacing-8)' }}>
            {listingTitle}
          </Text>
          {durationLabel != null && (
            <Text variant="body" color="secondary" style={{ marginBottom: 'var(--ds-spacing-4)' }}>
              {durationLabel}
              {guestCount != null && ` · ${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`}
            </Text>
          )}
          {vehicleName != null && (
            <Text variant="bodySmall" color="secondary" style={{ marginBottom: 'var(--ds-spacing-4)' }}>
              Vehicle: {vehicleName}
            </Text>
          )}
          {totalDisplay != null && (
            <Text variant="body" weight="medium" color="primary" style={{ marginTop: 'var(--ds-spacing-8)' }}>
              Total: {totalDisplay}
            </Text>
          )}
          {bookingId != null && (
            <Text variant="bodySmall" color="muted" style={{ marginTop: 'var(--ds-spacing-8)' }}>
              Booking ID: {bookingId}
            </Text>
          )}
        </div>
      </div>

      <div style={actionsStyle}>
        {onShare && (
          <Button variant="secondary" size="md" onClick={onShare}>
            Share
          </Button>
        )}
        {onFeedback && (
          <Button variant="secondary" size="md" onClick={onFeedback}>
            Give feedback
          </Button>
        )}
        {onGoHome && (
          <Button variant="primary" size="md" onClick={onGoHome}>
            Go to homepage
          </Button>
        )}
        {onViewListing && (
          <Button variant="ghost" size="md" onClick={onViewListing}>
            View listing
          </Button>
        )}
      </div>
    </div>
  );
}
