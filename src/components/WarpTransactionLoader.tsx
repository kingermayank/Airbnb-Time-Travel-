import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWarpLoadingMessages } from '../lib/warp-loading-messages';
import './TransactionLoader.css';

interface WarpTransactionLoaderProps {
  /** The listing title — used to pick contextual loading messages */
  listingTitle: string;
  /** How fast to cycle messages in ms (default 2800) */
  interval?: number;
  /** Whether to reduce continuous animated effects */
  reducedMotion?: boolean;
}

export function WarpTransactionLoader({
  listingTitle,
  interval = 2800,
  reducedMotion = false,
}: WarpTransactionLoaderProps) {
  const messages = useMemo(
    () => getWarpLoadingMessages(listingTitle),
    [listingTitle],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages.length, interval]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        width: '100%',
        minHeight: 200,
      }}
    >
      {/* Timeline visualization */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          width: '100%',
          maxWidth: 280,
          position: 'relative',
          height: 24,
        }}
      >
        {/* Track */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(217, 217, 217, 1)',
            transform: 'translateY(-50%)',
            borderRadius: 1,
          }}
        />
        {/* Animated progress fill */}
        <motion.div
          animate={reducedMotion ? { width: '100%' } : { width: ['0%', '100%'] }}
          transition={{
            duration: reducedMotion ? 0.2 : messages.length * (interval / 1000),
            ease: 'linear',
            repeat: reducedMotion ? 0 : Infinity,
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            height: 2,
            backgroundColor: 'rgba(34, 34, 34, 1)',
            transform: 'translateY(-50%)',
            borderRadius: 1,
          }}
        />
        {/* Era markers */}
        {['Past', 'Present', 'Destination'].map((label, i) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: i === 0 ? 0 : i === 1 ? '50%' : '100%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <div
              style={{
                width: i === 1 ? 8 : 6,
                height: i === 1 ? 8 : 6,
                borderRadius: '50%',
                backgroundColor:
                  i === 1
                    ? 'rgba(34, 34, 34, 1)'
                    : 'rgba(180, 180, 180, 1)',
                border: i === 1 ? '2px solid rgba(34, 34, 34, 1)' : 'none',
              }}
            />
          </div>
        ))}

        {/* Animated traveler dot */}
        <motion.div
          animate={reducedMotion ? { left: '50%' } : { left: ['0%', '100%'] }}
          transition={{
            duration: reducedMotion ? 0.2 : 2.4,
            ease: [0.4, 0, 0.2, 1],
            repeat: reducedMotion ? 0 : Infinity,
            repeatDelay: reducedMotion ? 0 : 0.6,
          }}
          style={{
            position: 'absolute',
            top: '50%',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'linear-gradient(90deg, #FF0257, #FF0257)',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 8px rgba(230, 30, 77, 0.4)',
            zIndex: 2,
          }}
        />
      </div>

      {/* Cycling status messages */}
      <div
        style={{
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 360,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.35,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              fontFamily: 'var(--ds-font-family, "Figtree", sans-serif)',
              fontSize: 14,
              lineHeight: '20px',
              letterSpacing: '-0.28px',
              color: 'rgba(113, 113, 113, 1)',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {messages[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bouncing dots (existing pattern) */}
      {reducedMotion ? (
        <div style={{ color: 'rgba(113, 113, 113, 1)', fontSize: 14, lineHeight: '20px' }}>
          Processing temporal routing...
        </div>
      ) : (
        <div className="bouncing-dots-container">
          <div className="bouncing-dot bouncing-dot-1 transaction-dot" />
          <div className="bouncing-dot bouncing-dot-2 transaction-dot" />
          <div className="bouncing-dot bouncing-dot-3 transaction-dot" />
        </div>
      )}
    </div>
  );
}
