import React from 'react';
import { Avatar } from '../../foundations/Avatar';
import { Text } from '../../foundations/Text';

export interface ReviewCardProps {
  reviewerName: string;
  reviewerAvatarUrl?: string | null;
  bookingContext: string;
  snippet: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Single review card: avatar + name + booking context + snippet.
 * Uses outline card treatment when wrapped in a bordered container; typography per design rules.
 */
export function ReviewCard({
  reviewerName,
  reviewerAvatarUrl,
  bookingContext,
  snippet,
  className,
  style,
}: ReviewCardProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-content-gap-sm)',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--ds-spacing-12)',
        }}
      >
        <Avatar
          src={reviewerAvatarUrl ?? null}
          alt={reviewerName}
          size="lg"
        />
        <div>
          <Text variant="h4" color="primary" as="div">
            {reviewerName}
          </Text>
          <Text variant="bodySmall" color="secondary" as="div">
            {bookingContext}
          </Text>
        </div>
      </div>
      <Text variant="body" color="primary" as="p">
        {snippet}
      </Text>
    </div>
  );
}
