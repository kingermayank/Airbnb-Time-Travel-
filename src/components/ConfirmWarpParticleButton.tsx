/**
 * Confirm and Warp button with left-to-right particle wipe on click.
 * Button "wears off" from left toward right over 3 seconds.
 * When reduced motion is preferred, skips effect and calls onComplete immediately.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_PARTICLE_COLS = 16;
const DEFAULT_PARTICLE_ROWS = 6;
const DEFAULT_WIPE_DURATION_S = 0.5;
const DEFAULT_PARTICLE_ANIM_DURATION_S = 0.55;
const DEFAULT_PARTICLE_MOVE_X = 120;
const DEFAULT_PARTICLE_COLOR = '#FF0257';

export interface ConfirmWarpParticleTweakConfig {
  particleCols: number;
  particleRows: number;
  wipeDurationS: number;
  particleAnimDurationS: number;
  particleMoveX: number;
  particleColor: string;
}

export const DEFAULT_PARTICLE_TWEAK: ConfirmWarpParticleTweakConfig = {
  particleCols: DEFAULT_PARTICLE_COLS,
  particleRows: DEFAULT_PARTICLE_ROWS,
  wipeDurationS: DEFAULT_WIPE_DURATION_S,
  particleAnimDurationS: DEFAULT_PARTICLE_ANIM_DURATION_S,
  particleMoveX: DEFAULT_PARTICLE_MOVE_X,
  particleColor: DEFAULT_PARTICLE_COLOR,
};

export interface ConfirmWarpParticleButtonProps {
  disabled?: boolean;
  onComplete: () => void;
  /** Called when user clicks (e.g. play sound) before wipe starts */
  onClick?: () => void;
  reducedMotion: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Optional overrides for particle effect (e.g. from tweak panel) */
  particleTweak?: Partial<ConfirmWarpParticleTweakConfig>;
  /** When set (e.g. timestamp), start the effect without a click (for preview) */
  triggerEffect?: number;
}

export function ConfirmWarpParticleButton({
  disabled,
  onComplete,
  onClick: onClickProp,
  reducedMotion,
  children,
  className,
  style,
  particleTweak: tweak,
  triggerEffect,
}: ConfirmWarpParticleButtonProps) {
  const particleCols = tweak?.particleCols ?? DEFAULT_PARTICLE_COLS;
  const particleRows = tweak?.particleRows ?? DEFAULT_PARTICLE_ROWS;
  const wipeDurationS = tweak?.wipeDurationS ?? DEFAULT_WIPE_DURATION_S;
  const particleAnimDurationS = tweak?.particleAnimDurationS ?? DEFAULT_PARTICLE_ANIM_DURATION_S;
  const particleMoveX = tweak?.particleMoveX ?? DEFAULT_PARTICLE_MOVE_X;
  const particleColor = tweak?.particleColor ?? DEFAULT_PARTICLE_COLOR;

  const particleCount = particleCols * particleRows;
  const staggerPerColumnS = particleCols > 0 ? wipeDurationS / particleCols : 0;
  const totalWipeMs = (wipeDurationS + particleAnimDurationS) * 1000;

  const [isWiping, setIsWiping] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const triggerRef = useRef(0);

  useEffect(() => {
    if (triggerEffect != null && triggerEffect > 0 && triggerEffect !== triggerRef.current && !reducedMotion) {
      triggerRef.current = triggerEffect;
      setHasTriggered(true);
      setIsWiping(true);
    }
  }, [triggerEffect, reducedMotion]);

  const handleClick = useCallback(() => {
    if (disabled || hasTriggered) return;
    setHasTriggered(true);
    onClickProp?.();
    if (reducedMotion) {
      onComplete();
      return;
    }
    setIsWiping(true);
  }, [disabled, hasTriggered, reducedMotion, onComplete, onClickProp]);

  const completedRef = useRef(false);
  useEffect(() => {
    if (!isWiping || reducedMotion) return;
    const t = setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    }, totalWipeMs);
    return () => clearTimeout(t);
  }, [isWiping, reducedMotion, onComplete, totalWipeMs]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        marginBottom: 16,
        ...style,
      }}
    >
      <AnimatePresence mode="wait">
        {!isWiping ? (
          <motion.button
            key="button"
            type="button"
            disabled={disabled || hasTriggered}
            onClick={handleClick}
            initial={false}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(90deg, #FF0257 0%, #FF0257 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: disabled || hasTriggered ? 'not-allowed' : 'pointer',
              fontFamily: '"Figtree", sans-serif',
              opacity: disabled ? 0.7 : 1,
            }}
          >
            {children}
          </motion.button>
        ) : (
          <motion.div
            key="particles"
            style={{
              position: 'relative',
              width: '100%',
              height: 48,
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
          >
            {Array.from({ length: particleCount }, (_, i) => {
              const col = i % particleCols;
              const row = Math.floor(i / particleCols);
              const leftPct = (col / particleCols) * 100;
              const topPct = (row / particleRows) * 100;
              const delay = col * staggerPerColumnS;
              return (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    width: `${100 / particleCols + 2}%`,
                    height: `${100 / particleRows + 4}%`,
                    borderRadius: '50%',
                    backgroundColor: particleColor,
                  }}
                  initial={{ opacity: 1, x: 0 }}
                  animate={{
                    opacity: 0,
                    x: particleMoveX,
                  }}
                  transition={{
                    duration: particleAnimDurationS,
                    delay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
