import React from 'react';
import { Star } from 'lucide-react';

export interface HostCardProps {
  name: string;
  roleLabel?: string;
  avatarUrl: string;
  reviews: number;
  rating: number;
  yearsHosting: number;
  className?: string;
  style?: React.CSSProperties;
}

const cardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'space-between',
  gap: 40,
  padding: 32,
  borderRadius: 32,
  backgroundColor: '#FFFFFF',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.12)',
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  minWidth: 180,
};

const avatarWrapperStyle: React.CSSProperties = {
  width: 112,
  height: 112,
  borderRadius: '50%',
  overflow: 'hidden',
  marginBottom: 16,
};

const avatarStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

const nameStyle: React.CSSProperties = {
  fontFamily: '"Figtree", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 22,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: '#222222',
  margin: 0,
};

const roleStyle: React.CSSProperties = {
  fontFamily: '"Figtree", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 14,
  fontWeight: 400,
  color: '#717171',
  marginTop: 4,
};

const metricsColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 24,
  minWidth: 120,
};

const metricBlockStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const metricValueStyle: React.CSSProperties = {
  fontFamily: '"Figtree", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 18,
  fontWeight: 500,
  color: '#222222',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: '"Figtree", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: 14,
  fontWeight: 400,
  color: '#717171',
};

const dividerStyle: React.CSSProperties = {
  width: '100%',
  height: 1,
  backgroundColor: '#E5E7EB',
};

export function HostCard({
  name,
  roleLabel = 'Host',
  avatarUrl,
  reviews,
  rating,
  yearsHosting,
  className,
  style,
}: HostCardProps) {
  return (
    <article
      className={className}
      style={{ ...cardStyle, ...style }}
      aria-label={`Host card for ${name}`}
    >
      <div style={leftColumnStyle}>
        <div style={avatarWrapperStyle}>
          <img src={avatarUrl} alt={name} style={avatarStyle} />
        </div>
        <h3 style={nameStyle}>{name}</h3>
        <span style={roleStyle}>{roleLabel}</span>
      </div>

      <div style={metricsColumnStyle} aria-label="Host metrics">
        <div style={metricBlockStyle}>
          <span style={metricValueStyle}>{reviews}</span>
          <span style={metricLabelStyle}>Reviews</span>
        </div>

        <div style={dividerStyle} />

        <div style={metricBlockStyle}>
          <span style={metricValueStyle}>
            {rating.toFixed(2)}
            <Star size={16} fill="#222222" color="#222222" />
          </span>
          <span style={metricLabelStyle}>Rating</span>
        </div>

        <div style={dividerStyle} />

        <div style={metricBlockStyle}>
          <span style={metricValueStyle}>{yearsHosting}</span>
          <span style={metricLabelStyle}>Years hosting</span>
        </div>
      </div>
    </article>
  );
}

