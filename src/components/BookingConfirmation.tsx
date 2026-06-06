import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDeviceType } from '../hooks/use-mobile';

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
  sharedLayoutIds?: {
    image?: string;
  };
  onShareClick?: () => void;
  /** Queue position for this listing (e.g. "You're number 747 on the waiting list") — shown in title area when > 0 */
  queuePosition?: number | null;
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
  sharedLayoutIds,
  onShareClick,
  queuePosition = null,
}) => {
  const [isShareHovered, setIsShareHovered] = useState(false);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [cardEntranceComplete, setCardEntranceComplete] = useState(false);
  const [confirmationImageGlare, setConfirmationImageGlare] = useState({ x: 50, y: 50, active: false });
  const shouldReduceMotion = !!useReducedMotion();
  const { isMobile, isTablet } = useDeviceType();
  const disableTilt = shouldReduceMotion || isMobile || isTablet;
  const supportsHover =
    typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches;
  const enableImageGlare = supportsHover && !shouldReduceMotion;
  const cardTiltDisabled = disableTilt || !cardEntranceComplete;
  const glareBackground =
    'radial-gradient(circle 44px at var(--listing-glare-x, 50%) var(--listing-glare-y, 50%), hsla(2, 88%, 62%, 0.38) 0%, hsla(44, 95%, 62%, 0.34) 28%, hsla(190, 92%, 64%, 0.30) 56%, hsla(318, 92%, 66%, 0.32) 78%, hsla(318, 92%, 66%, 0) 100%)';

  const maxTiltDeg = 6;
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (cardTiltDisabled) return;
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
  const handleCardMouseLeave = () => {
    if (cardTiltDisabled) return;
    setCardTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      setCardEntranceComplete(true);
    }
  }, [shouldReduceMotion]);

  const updateConfirmationImageGlare = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableImageGlare) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    const percentX = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    const percentY = Math.max(0, Math.min(100, (relativeY / rect.height) * 100));
    setConfirmationImageGlare({ x: percentX, y: percentY, active: true });
  };

  const handleShare = () => {
    if (onShareClick) {
      onShareClick();
      return;
    }
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

  // Responsive scale so card fits without overlapping logo; smaller on mobile to avoid scroll
  const s = isMobile ? 0.52 : isTablet ? 0.62 : 0.72;
  const px = (n: number) => `${Math.round(n * s)}px`;
  const buttonRadiusPx = `${Math.round(9 * s) + 4}px`;
  const topPaddingPx = Math.max(80, Math.round(80 * s));

  return (
    <div
      className={`booking-confirmation ${className}`}
      style={{
        width: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: 'rgba(243, 239, 236, 1)',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"Figtree", sans-serif',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={onLogoClick}
        aria-label="WarpBnB home"
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          border: 'none',
          background: 'transparent',
          padding: 4,
          cursor: onLogoClick ? 'pointer' : 'default',
        }}
      >
        <img src="/images/warp_black_logo.svg" alt="WarpBnB logo" style={{ width: 44, height: 44 }} />
      </button>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 12% 22%, rgba(255,255,255,0.7), transparent 44%), radial-gradient(circle at 88% 78%, rgba(236,225,212,0.7), transparent 42%)',
          zIndex: 0,
        }}
      />
      <motion.div
        aria-hidden
        animate={disableTilt ? undefined : { x: [0, 14, 0], y: [0, -10, 0] }}
        transition={disableTilt ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '14%',
          right: '-5%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(215,4,102,0.16) 0%, rgba(215,4,102,0.02) 65%, transparent 100%)',
          filter: 'blur(6px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.05,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)',
          zIndex: 0,
        }}
      />

      {topBanner}

      {/* Main – top padding clears logo; scaled card fits in viewport */}
      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: px(112),
          padding: `${topPaddingPx}px ${px(40)}`,
          width: '100%',
          maxWidth: px(1512),
          margin: '0 auto',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* The entrance wrapper owns translate/scale; the inner card owns pointer tilt. */}
        <motion.div
          initial={shouldReduceMotion ? false : {
            opacity: 0,
            y: isMobile ? 12 : 24,
            scale: isMobile ? 1 : 0.985,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={() => setCardEntranceComplete(true)}
          style={{
            width: '100%',
            maxWidth: px(450),
            flexShrink: 0,
          }}
        >
          <section
            className="confirmation-listing-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              width: '100%',
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
              transition: cardTiltDisabled
                ? 'box-shadow 0.25s ease'
                : 'transform 0.15s ease-out, box-shadow 0.2s ease',
              transform: cardTiltDisabled
                ? 'translateY(0)'
                : `perspective(900px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg) translateZ(${cardTilt.x !== 0 || cardTilt.y !== 0 ? 16 : 0}px)`,
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
              <motion.div
                layoutId={sharedLayoutIds?.image}
                onMouseEnter={updateConfirmationImageGlare}
                onMouseMove={updateConfirmationImageGlare}
                onMouseLeave={() => setConfirmationImageGlare((prev) => ({ ...prev, active: false }))}
                style={{
                  height: px(381),
                  backgroundColor: 'rgba(200, 200, 200, 1)',
                  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: px(18),
                  overflow: 'hidden',
                  width: '100%',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: glareBackground,
                    opacity: confirmationImageGlare.active ? 0.5 : 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                    mixBlendMode: 'screen',
                    filter: 'blur(4px) saturate(1.05)',
                    ['--listing-glare-x' as string]: `${confirmationImageGlare.x}%`,
                    ['--listing-glare-y' as string]: `${confirmationImageGlare.y}%`,
                  }}
                />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: px(6) }}>
                <h2
                  style={{
                    margin: 0,
                    color: 'rgba(34, 34, 34, 1)',
                    fontSize: px(24),
                    fontWeight: 500,
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
        </motion.div>

        {/* Confirmation hierarchy follows the card with a short restrained stagger. */}
        <motion.section
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                delayChildren: shouldReduceMotion ? 0 : 0.07,
                staggerChildren: shouldReduceMotion ? 0 : 0.07,
              },
            },
          }}
          style={{
            width: '100%',
            maxWidth: `${Math.round(389.25 * 0.72) + 100}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: '42px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '17px' }}>
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              style={{
                margin: 0,
                color: 'rgba(0, 0, 0, 1)',
                fontSize: '43px',
                fontWeight: 500,
                lineHeight: 1.125,
                letterSpacing: '-0.5px',
              }}
            >
              Securing arrival window
            </motion.h1>
            <motion.p
              variants={{
                hidden: {
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 10,
                  filter: shouldReduceMotion ? 'none' : 'blur(3px)',
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              style={{
                margin: 0,
                color: 'rgba(30, 28, 24, 1)',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {queuePosition != null && queuePosition > 0
                ? `You're number ${queuePosition} on the waiting list.`
                : 'You\'re on the waiting list.'}
            </motion.p>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              style={{
                margin: 0,
                color: 'rgba(30, 28, 24, 1)',
                fontSize: '18px',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              We're sending your time coordinates to the host and securing your arrival window. We'll email you when everything lines up.
            </motion.p>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
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
                borderRadius: buttonRadiusPx,
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              aria-label="Share booking"
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 1)',
                  fontSize: '17px',
                  fontWeight: 400,
                  lineHeight: px(24),
                  letterSpacing: '-0.2px',
                }}
              >
                Share
              </span>
            </button>
          </motion.div>
        </motion.section>
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .booking-confirmation main {
            gap: 48px !important;
            padding: 80px 20px 40px 20px !important;
          }
          .booking-confirmation main > section:last-child {
            margin-top: 0 !important;
            max-width: 450px !important;
          }
        }
        @media (max-width: 480px) {
          .booking-confirmation main {
            gap: 20px !important;
            padding: 72px 16px 24px 16px !important;
          }
          .booking-confirmation main > section:last-child {
            gap: 20px !important;
          }
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
