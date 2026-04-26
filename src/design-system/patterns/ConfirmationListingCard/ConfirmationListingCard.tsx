import React from 'react';

/**
 * Confirmation listing card per Figma 283-3285 (Post-booking summary card).
 * White card with notably rounded corners; image ~60–65% height (taller than wide);
 * generous padding and spacing between era and guest/total block.
 */

export interface ConfirmationListingCardProps {
  /** Main listing image URL */
  imageUrl: string;
  /** Listing title (e.g. "Classified Barracks, Area 51") */
  title: string;
  /** Era or date (e.g. "1734 CE", "1962 CE") */
  eraOrDate: string;
  /** Number of guests */
  guestCount: number;
  /** Total display string including currency symbol (e.g. "฿2,345 total") */
  totalDisplay: string;
  /** Alt text for image */
  imageAlt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const CARD_RADIUS = 16;

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 380,
  backgroundColor: '#FFFFFF',
  borderRadius: CARD_RADIUS,
  overflow: 'hidden',
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
};

const imageWrapperStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '3 / 4',
  backgroundColor: '#E5E7EB',
  overflow: 'hidden',
  borderTopLeftRadius: CARD_RADIUS,
  borderTopRightRadius: CARD_RADIUS,
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const contentStyle: React.CSSProperties = {
  padding: '24px 24px 28px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 0,
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontWeight: 500,
  fontSize: 18,
  lineHeight: 1.33,
  letterSpacing: '-0.01em',
  color: '#222222',
  margin: 0,
};

const eraStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: '-0.01em',
  color: '#222222',
  margin: '8px 0 0 0',
};

const detailsBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 4,
  marginTop: 16,
};

const secondaryStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: '-0.01em',
  color: '#222222',
  margin: 0,
};

export function ConfirmationListingCard({
  imageUrl,
  title,
  eraOrDate,
  guestCount,
  totalDisplay,
  imageAlt,
  className,
  style,
}: ConfirmationListingCardProps) {
  return (
    <article
      className={className}
      style={{ ...cardStyle, ...style }}
      aria-label={`Booking confirmation for ${title}`}
    >
      <div style={imageWrapperStyle}>
        <img
          src={imageUrl}
          alt={imageAlt ?? title}
          style={imageStyle}
        />
      </div>
      <div style={contentStyle}>
        <h3 style={titleStyle}>{title}</h3>
        <p style={eraStyle}>{eraOrDate}</p>
        <div style={detailsBlockStyle}>
          <p style={secondaryStyle}>
            {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
          </p>
          <p style={secondaryStyle}>{totalDisplay}</p>
        </div>
      </div>
    </article>
  );
}
