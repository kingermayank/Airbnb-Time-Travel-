import React, { useState } from 'react';
import { Text } from '../../foundations/Text';
import { Badge } from '../../foundations/Badge';
import { Icon } from '../../foundations/Icon';
import { Heart } from 'lucide-react';
import './ListingCard.css';

export interface ListingCardProps {
  id: string;
  image: string;
  title: string;
  /** Optional year or era (e.g. "30 BC", "2187") shown with title. */
  year?: string;
  price: string;
  rating?: string;
  date?: string;
  isGuestFavorite?: boolean;
  /** Initial liked state for the heart (e.g. for Storybook). */
  defaultLiked?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const cardWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ds-spacing-12)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  width: '100%',
};

const imageContainerStyle: React.CSSProperties = {
  height: 248,
  borderRadius: 'var(--ds-radius-lg)',
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: '#f3f3f3',
};

/* Min 44px tap target for touch/a11y (Emil's design engineering) */
const heartButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: 'var(--ds-spacing-12)',
  top: 'var(--ds-spacing-12)',
  minWidth: 44,
  minHeight: 44,
  padding: 10,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const badgeWrapperStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'var(--ds-listing-card-badge-inset-top)',
  left: 'var(--ds-listing-card-badge-inset-left)',
  zIndex: 2,
};

const infoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ds-spacing-4)',
  paddingLeft: 'var(--ds-spacing-4)',
};

const priceRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'var(--ds-spacing-4)',
};

export function ListingCard({
  id,
  image,
  title,
  year,
  price,
  rating,
  date,
  isGuestFavorite,
  defaultLiked = false,
  onClick,
  className,
  style,
}: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(defaultLiked);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <div
      className={className}
      style={{ ...cardWrapperStyle, ...style }}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
    >
      <div style={imageContainerStyle}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {isGuestFavorite && (
          <div style={badgeWrapperStyle}>
            <Badge>Frequently revisited</Badge>
          </div>
        )}
        <button
          type="button"
          className={`ds-listing-card-heart-btn${isLiked ? ' is-liked' : ''}`}
          style={heartButtonStyle}
          onClick={handleHeartClick}
          aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Icon size="md" color="white" className="ds-listing-card-heart-icon">
            <Heart
              size={24}
              fill={isLiked ? 'var(--ds-accent)' : 'var(--ds-heart-interior-unfilled)'}
              stroke={isLiked ? 'var(--ds-accent)' : 'currentColor'}
              strokeWidth={2}
            />
          </Icon>
        </button>
      </div>
      <div style={infoStyle}>
        <Text
          variant="body"
          weight="medium"
          color="primary"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Text>
        <div style={priceRowStyle}>
          <Text variant="bodySmall" color="primary" weight="medium">
            {price}
          </Text>
          {[year != null && year !== '' ? year : null, rating != null ? `★ ${rating}` : null]
            .filter(Boolean)
            .map((segment, index) => (
              <React.Fragment key={index}>
                <Text variant="bodySmall" color="secondary" style={{ fontWeight: 800 }}>
                  ·
                </Text>
                <Text variant="bodySmall" color="secondary">
                  {segment}
                </Text>
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
