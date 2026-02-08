import React, { useState } from 'react';

interface BookingConfirmationProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  location?: string;
  date?: string;
  guests?: string;
  price?: string;
  imageUrl?: string;
  onLogoClick?: () => void;
  /** Optional banner message (e.g. save-failed warning) shown above main content */
  topBanner?: React.ReactNode;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  className = '',
  style = {},
  title = 'Sample list title here',
  location = '1734 CE',
  date = '1734 CE',
  guests = '1 guest',
  price = '₿2,345 total',
  imageUrl = '',
  onLogoClick,
  topBanner,
}) => {
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [isFeedbackHovered, setIsFeedbackHovered] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  const maxTiltDeg = 6;
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;
    setCardTilt({
      x: -normY * maxTiltDeg,
      y: normX * maxTiltDeg,
    });
  };
  const handleCardMouseLeave = () => setCardTilt({ x: 0, y: 0 });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Booking Confirmation',
        text: `Check out my booking at ${title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        alert('Share link copied to clipboard!');
      }).catch(() => alert('Share link copied to clipboard!'));
    }
  };

  const handleFeedback = () => {
    console.log('Feedback clicked');
  };

  // Uniform scale so original layout/structure is preserved but fits in viewport (no scroll)
  const s = 0.72;
  const px = (n: number) => `${Math.round(n * s)}px`;

  const logo = (
    <img
      src="https://storage.googleapis.com/storage.magicpath.ai/user/331391857395396608/figma-assets/c1e56ec2-9212-47a7-9bda-89298f7f301e.svg"
      alt="Airbnb"
      style={{
        width: px(40),
        height: px(40),
        cursor: onLogoClick ? 'pointer' : 'default',
      }}
    />
  );

  return (
    <div
      className={`booking-confirmation ${className}`}
      style={{
        width: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: 'rgba(243, 239, 236, 1)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Figtree", sans-serif',
        ...style,
      }}
    >
      {/* Header / Logo – original structure, scaled */}
      <nav
        style={{
          padding: `${px(30.5)} ${px(40)}`,
          width: '100%',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            style={{
              padding: 0,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
            aria-label="Go to homepage"
          >
            {logo}
          </button>
        ) : (
          logo
        )}
      </nav>

      {topBanner}

      {/* Main – original padding/gap, scaled */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: px(112),
          padding: `${px(80)} ${px(40)}`,
          width: '100%',
          maxWidth: px(1512),
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Booking Card – original structure, scaled; 3D tilt follows mouse */}
        <section
          className="confirmation-listing-card"
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            width: '100%',
            maxWidth: px(450),
            height: px(654),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: px(24),
            backgroundColor: 'rgba(255, 255, 255, 1)',
            border: '0.75px solid rgba(229, 231, 235, 1)',
            boxSizing: 'border-box',
            boxShadow: cardTilt.x !== 0 || cardTilt.y !== 0
              ? '0px 16px 32px rgba(31, 41, 55, 0.08), 0px 32px 48px rgba(31, 41, 55, 0.12)'
              : '0px 7.5px 7.5px rgba(31, 41, 55, 0.04), 0px 15px 18.75px rgba(31, 41, 55, 0.1)',
            borderRadius: px(27),
            transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
            transform: `perspective(900px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateZ(${cardTilt.x !== 0 || cardTilt.y !== 0 ? 16 : 0}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: px(16),
              width: '100%',
            }}
          >
            <div
              style={{
                height: px(381),
                backgroundColor: 'rgba(200, 200, 200, 1)',
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: px(18),
                overflow: 'hidden',
                width: '100%',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: px(6) }}>
              <h2
                style={{
                  margin: 0,
                  color: 'rgba(34, 34, 34, 1)',
                  fontSize: px(24),
                  fontWeight: 600,
                  lineHeight: px(28.8),
                }}
              >
                {title}
              </h2>
              <span
                style={{
                  color: 'rgba(82, 82, 82, 1)',
                  fontSize: px(18),
                  fontWeight: 400,
                  lineHeight: px(21.6),
                }}
              >
                {location}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: px(4),
              width: '100%',
            }}
          >
            <span
              style={{
                color: 'rgba(88, 88, 88, 1)',
                fontSize: px(18),
                fontWeight: 400,
                lineHeight: px(21.6),
              }}
            >
              {guests}
            </span>
            <span
              style={{
                color: 'rgba(88, 88, 88, 1)',
                fontSize: px(18),
                fontWeight: 400,
                lineHeight: px(21.6),
              }}
            >
              {price}
            </span>
          </div>
        </section>

        {/* Confirmation Message – original structure, scaled */}
        <section
          style={{
            width: '100%',
            maxWidth: `${Math.round(389.25 * 0.72) + 100}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: '42px',
            marginTop: px(100),
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '17px' }}>
            <h1
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 1)',
                fontSize: '43px',
                fontWeight: 600,
                lineHeight: 1.125,
                letterSpacing: '-0.5px',
              }}
            >
              Securing arrival window
            </h1>
            <p
              style={{
                margin: 0,
                color: 'rgba(30, 28, 24, 1)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              We're sending your time coordinates to the host and securing your arrival window. We'll email you when everything lines up.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: px(16),
              flexWrap: 'nowrap',
            }}
          >
            <button
              onClick={handleShare}
              onMouseEnter={() => setIsShareHovered(true)}
              onMouseLeave={() => setIsShareHovered(false)}
              style={{
                cursor: 'pointer',
                flex: '0 0 auto',
                height: px(54),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '25px 37px',
                backgroundColor: isShareHovered ? 'rgba(50, 50, 50, 1)' : 'rgba(30, 30, 30, 1)',
                border: 'none',
                boxShadow: '0px 0.75px 1.5px rgba(31, 41, 55, 0.08)',
                borderRadius: px(9),
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              aria-label="Share booking"
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  fontSize: '17px',
                  fontWeight: 500,
                  lineHeight: px(24),
                  letterSpacing: '-0.2px',
                }}
              >
                Share
              </span>
            </button>

            <button
              onClick={handleFeedback}
              onMouseEnter={() => setIsFeedbackHovered(true)}
              onMouseLeave={() => setIsFeedbackHovered(false)}
              style={{
                cursor: 'pointer',
                flex: '0 0 auto',
                height: px(54),
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '25px 39px',
                backgroundColor: isFeedbackHovered ? 'rgba(245, 245, 245, 1)' : 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderStyle: 'solid',
                borderWidth: '1.5px',
                boxShadow: '0px 0.75px 1.5px rgba(31, 41, 55, 0.08)',
                borderRadius: px(9),
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              aria-label="Give feedback"
            >
              <span
                style={{
                  color: 'rgba(34, 34, 34, 1)',
                  fontSize: '17px',
                  fontWeight: 500,
                  lineHeight: px(24),
                  letterSpacing: '-0.2px',
                }}
              >
                Give Feedback
              </span>
            </button>
          </div>
        </section>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .booking-confirmation main {
            gap: 48px !important;
            padding: 40px 20px !important;
          }
          .booking-confirmation main section:last-child {
            margin-top: 0 !important;
            max-width: 450px !important;
          }
        }
        @media (max-width: 480px) {
          .booking-confirmation h1 {
            font-size: 32px !important;
            line-height: 38px !important;
          }
          .booking-confirmation button {
            flex: 1 1 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
