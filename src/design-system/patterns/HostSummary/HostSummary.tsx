import React from 'react';
import { Avatar } from '../../foundations/Avatar';
import { Text } from '../../foundations/Text';
import { getHostDisplayName } from '../../../lib/host-display-name';

export interface HostSummaryProps {
  hostName: string;
  hostAvatarUrl?: string | null;
  badges?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Host block: avatar + "Hosted by **Name**" + optional badges (e.g. "Superhost • 7-month hosting").
 */
export function HostSummary({
  hostName,
  hostAvatarUrl,
  badges,
  className,
  style,
}: HostSummaryProps) {
  const firstName = getHostDisplayName(hostName);
  
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--ds-content-gap-sm)',
        ...style,
      }}
    >
      <Avatar src={hostAvatarUrl ?? null} alt={hostName} size="lg" />
      <div>
        <Text variant="body" color="primary" as="div">
          Hosted by <Text variant="body" weight="semibold" color="primary" as="span">{firstName}</Text>
        </Text>
        {badges && (
          <Text variant="body" color="secondary" as="div" style={{ marginTop: 'var(--ds-spacing-4)' }}>
            {badges}
          </Text>
        )}
      </div>
    </div>
  );
}
