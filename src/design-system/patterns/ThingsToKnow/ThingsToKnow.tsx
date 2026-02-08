import React from 'react';
import { SectionTitle } from '../../foundations/SectionTitle';
import { PolicyBlock } from '../PolicyBlock';

export interface ThingsToKnowBlock {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

export interface ThingsToKnowProps {
  policyBlocks: ThingsToKnowBlock[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * "Things to know" section: SectionTitle + list of PolicyBlocks.
 */
export function ThingsToKnow({
  policyBlocks,
  className,
  style,
}: ThingsToKnowProps) {
  return (
    <div
      className={className}
      style={{
        paddingBottom: 'var(--ds-section-padding-y)',
        borderBottom: 'var(--ds-section-divider)',
        marginBottom: 'var(--ds-section-padding-y)',
        ...style,
      }}
    >
      <SectionTitle>Things to know</SectionTitle>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--ds-content-gap-md)',
        }}
      >
        {policyBlocks.map((block, i) => (
          <PolicyBlock
            key={i}
            icon={block.icon}
            title={block.title}
            items={block.items}
          />
        ))}
      </div>
    </div>
  );
}
