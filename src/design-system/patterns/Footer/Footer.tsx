import React from 'react';
import { Globe } from 'lucide-react';
import { Text } from '../../foundations/Text';

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterSocialLink {
  platform: 'twitter' | 'linkedin' | 'github';
  href: string;
  ariaLabel?: string;
}

export interface FooterProps {
  copyrightText: string;
  links?: FooterLink[];
  languageLabel?: string;
  socialLinks?: FooterSocialLink[];
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
  socialLinks = [],
  className,
  style,
}: FooterProps) {
  const leftItems: FooterLink[] = [{ label: copyrightText }, ...links];
  const hasRightContent = Boolean(languageLabel) || socialLinks.length > 0;

  const iconSize = 14;
  const socialIconSize = 16;
  const linkedInIconSize = socialIconSize + 2;

  const renderSocialIcon = (platform: FooterSocialLink['platform']) => {
    if (platform === 'linkedin') {
      return (
        <svg width={linkedInIconSize} height={linkedInIconSize} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.56V14.9c0-1.32-.03-3.02-1.84-3.02-1.85 0-2.13 1.44-2.13 2.93v5.64H9.37V9h3.42v1.56h.05c.48-.9 1.64-1.84 3.37-1.84 3.6 0 4.26 2.37 4.26 5.45v6.28ZM5.35 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.13 20.45H3.57V9h3.56v11.45Z"
          />
        </svg>
      );
    }

    if (platform === 'github') {
      return (
        <svg width={socialIconSize} height={socialIconSize} viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M12 .5C5.65.5.5 5.67.5 12.05c0 5.1 3.3 9.44 7.88 10.97.58.1.79-.25.79-.56 0-.28-.01-1.2-.02-2.18-3.2.7-3.88-1.38-3.88-1.38-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.15.08 1.76 1.2 1.76 1.2 1.03 1.77 2.7 1.26 3.35.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a10.92 10.92 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.77.12 3.06.73.81 1.17 1.83 1.17 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.77 1.06.77 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55A11.56 11.56 0 0 0 23.5 12.05C23.5 5.67 18.35.5 12 .5Z"
          />
        </svg>
      );
    }

    return (
      <svg width={socialIconSize} height={socialIconSize} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M18.9 2h3.68l-8.05 9.2L24 22h-7.4l-5.8-7.6L4.06 22H.37l8.62-9.85L0 2h7.6l5.24 6.9L18.9 2Zm-1.3 17.8h2.04L6.48 4.1H4.3L17.6 19.8Z"
        />
      </svg>
    );
  };

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--ds-spacing-16)',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--ds-spacing-8)',
          }}
        >
          {leftItems.map((link, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <Text variant="caption" color="secondary" as="span">
                  {' '}
                  ·{' '}
                </Text>
              )}
              {link.href ? (
                <a
                  href={link.href}
                  style={{
                    fontFamily: 'var(--ds-font-family)',
                    fontSize: 'var(--ds-text-11)',
                    color: 'var(--ds-text-secondary)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Text variant="caption" color="secondary" as="span">
                  {link.label}
                </Text>
              )}
            </React.Fragment>
          ))}
        </div>

        {hasRightContent && (
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--ds-spacing-16)',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {languageLabel && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--ds-spacing-8)',
                  color: 'var(--ds-text-secondary)',
                }}
              >
                <Globe size={iconSize} strokeWidth={2} />
                <Text
                  variant="caption"
                  color="secondary"
                  as="span"
                  style={{ fontWeight: 'var(--ds-font-semibold)' }}
                >
                  {languageLabel}
                </Text>
              </div>
            )}

            {socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.ariaLabel ?? social.platform}
                style={{
                  color: 'var(--ds-text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                {renderSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
