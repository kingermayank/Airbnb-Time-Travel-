import React from 'react';
import { Text } from '../../foundations/Text';

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterProps {
  copyrightText: string;
  links?: FooterLink[];
  languageLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Page footer: copyright, link row, optional language selector.
 */
export function Footer({
  copyrightText,
  links = [],
  languageLabel,
  className,
  style,
}: FooterProps) {
  return (
    <footer
      className={className}
      style={{
        paddingTop: 'var(--ds-section-padding-y)',
        paddingBottom: 'var(--ds-section-padding-y)',
        borderTop: 'var(--ds-section-divider)',
        ...style,
      }}
    >
      <Text variant="caption" color="secondary" as="div" style={{ marginBottom: 'var(--ds-spacing-8)' }}>
        {copyrightText}
      </Text>
      {links.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--ds-spacing-8)',
            marginBottom: languageLabel ? 'var(--ds-spacing-8)' : 0,
          }}
        >
          {links.map((link, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <Text variant="caption" color="secondary" as="span"> · </Text>
              )}
              {link.href ? (
                <a
                  href={link.href}
                  style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: 'var(--ds-text-11)',
                    color: 'var(--ds-text-secondary)',
                    textDecoration: 'underline',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Text variant="caption" color="secondary" as="span">{link.label}</Text>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      {languageLabel && (
        <Text variant="caption" color="secondary" as="div">
          {languageLabel}
        </Text>
      )}
    </footer>
  );
}
