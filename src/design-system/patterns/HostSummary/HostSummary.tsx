import React from 'react';
import { Avatar } from '../../foundations/Avatar';
import { Text } from '../../foundations/Text';

export interface HostSummaryProps {
  hostName: string;
  hostAvatarUrl?: string | null;
  badges?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Extracts the first name(s) from a full name.
 * Handles couple names (e.g., "Hans & Sophie Hoffmann" -> "Hans & Sophie")
 * and single names (e.g., "Neytiri te Tskaha Mo'at'ite" -> "Neytiri")
 */
function getFirstName(fullName: string): string {
  if (!fullName) return '';
  
  // If name contains "&", extract first names before the last name
  if (fullName.includes(' & ')) {
    const parts = fullName.split(' & ');
    const firstParts = parts.map(part => {
      const words = part.trim().split(/\s+/);
      return words[0]; // Get first word of each part
    });
    return firstParts.join(' & ');
  }
  
  // For single names, return the first word
  const words = fullName.trim().split(/\s+/);
  return words[0] || fullName;
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
  const firstName = getFirstName(hostName);
  
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
