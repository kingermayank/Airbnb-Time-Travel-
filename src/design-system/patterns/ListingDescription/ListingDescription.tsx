import React, { useState, useEffect } from 'react';
import { Text } from '../../foundations/Text';
import { Button } from '../../foundations/Button';

export interface ListingDescriptionProps {
  content: string;
  /** Max characters to show inline; if not set, no truncation and no "Show more". */
  maxVisibleLength?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Description paragraph + "Show more" CTA. Clicking "Show more" opens a modal with the full description.
 * Uses Button variant="secondary" per design rules. No expanded state or "Show less".
 */
export function ListingDescription({
  content,
  maxVisibleLength,
  className,
  style,
}: ListingDescriptionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const shouldTruncate = maxVisibleLength != null && content.length > maxVisibleLength;
  const displayContent = shouldTruncate ? content.slice(0, maxVisibleLength).trim() + '...' : content;
  const showButton = shouldTruncate;

  useEffect(() => {
    if (!modalOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modalOpen]);

  return (
    <>
      <div
        className={className}
        style={{
          paddingBottom: 'var(--ds-section-padding-y)',
          borderBottom: 'var(--ds-section-divider)',
          marginBottom: 'var(--ds-section-padding-y)',
          ...style,
        }}
      >
        <Text variant="body" color="primary" as="p" style={{ whiteSpace: 'pre-line', marginBottom: showButton ? 'var(--ds-content-gap-md)' : 0 }}>
          {displayContent}
        </Text>
        {showButton && (
          <Button variant="secondary" size="lg" onClick={() => setModalOpen(true)}>
            Show more
          </Button>
        )}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full description"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--ds-spacing-24)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'var(--ds-overlay)',
            }}
            onClick={() => setModalOpen(false)}
          />
          <div
            style={{
              position: 'relative',
              backgroundColor: 'var(--ds-surface)',
              borderRadius: 'var(--ds-radius-lg)',
              boxShadow: 'var(--ds-shadow-card)',
              maxWidth: 560,
              maxHeight: '80vh',
              overflow: 'auto',
              padding: 'var(--ds-spacing-24)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--ds-spacing-16)' }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--ds-radius-full)',
                  border: 'none',
                  background: 'var(--ds-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--ds-font-family)',
                  fontSize: 'var(--ds-text-18)',
                  color: 'var(--ds-text-primary)',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <Text variant="body" color="primary" as="p" style={{ whiteSpace: 'pre-line' }}>
              {content}
            </Text>
          </div>
        </div>
      )}
    </>
  );
}
