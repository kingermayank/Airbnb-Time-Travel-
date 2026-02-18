import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import './DistortTransitionOutlet.css';

const DISTORT_DURATION_MS = 650;
const REDUCED_DURATION_MS = 150;
const SCALE_START = 35;
const SCALE_END = 0;
const FREQ_START = 0.02;
const FREQ_END = 0.008;

function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function smoothStep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function easeWhooshSettle(value: number): number {
  const t = clamp01(value);
  const accel = 1 - Math.pow(1 - t, 3.4);
  const settleBump = Math.sin(Math.min(1, t * 1.14) * Math.PI) * 0.065;
  return clamp01(accel + settleBump * (1 - t));
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return reduced;
}

export function DistortTransitionOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const reducedMotion = useReducedMotion();

  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const fromLayerRef = useRef<HTMLDivElement | null>(null);
  const toLayerRef = useRef<HTMLDivElement | null>(null);
  const streakRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const animationTokenRef = useRef(0);
  const activeContentRef = useRef(outlet);
  const previousLocationKeyRef = useRef(location.key);

  const [fromContent, setFromContent] = useState<React.ReactNode | null>(null);
  const [toContent, setToContent] = useState<React.ReactNode>(outlet);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const layerFilter = useMemo(
    () => (isTransitioning && !reducedMotion ? 'url(#time-warp-distortion-filter)' : 'none'),
    [isTransitioning, reducedMotion],
  );

  const cancelCurrentAnimation = useCallback(() => {
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    animationTokenRef.current += 1;
  }, []);

  const resetFilter = useCallback(() => {
    turbulenceRef.current?.setAttribute('baseFrequency', `${FREQ_END}`);
    displacementRef.current?.setAttribute('scale', `${SCALE_END}`);
  }, []);

  const resetLayerStyles = useCallback(() => {
    const fromLayer = fromLayerRef.current;
    const toLayer = toLayerRef.current;
    const streak = streakRef.current;

    if (fromLayer) {
      fromLayer.style.opacity = '0';
      fromLayer.style.transform = 'translate3d(0,0,0)';
      fromLayer.style.filter = 'none';
    }
    if (toLayer) {
      toLayer.style.opacity = '1';
      toLayer.style.transform = 'translate3d(0,0,0)';
      toLayer.style.filter = 'none';
    }
    if (streak) streak.style.opacity = '0';
  }, []);

  const runTransition = useCallback(
    (durationMs: number) => {
      cancelCurrentAnimation();
      const token = animationTokenRef.current;
      const start = performance.now();
      setIsTransitioning(true);

      const frame = (now: number) => {
        if (token !== animationTokenRef.current) return;
        const raw = clamp01((now - start) / durationMs);
        const eased = reducedMotion ? smoothStep(raw) : easeWhooshSettle(raw);

        const fromLayer = fromLayerRef.current;
        const toLayer = toLayerRef.current;
        const streak = streakRef.current;
        const turbulence = turbulenceRef.current;
        const displacement = displacementRef.current;

        if (fromLayer && toLayer) {
          if (reducedMotion) {
            fromLayer.style.opacity = `${1 - eased}`;
            toLayer.style.opacity = `${eased}`;
            fromLayer.style.transform = 'translate3d(0,0,0)';
            toLayer.style.transform = 'translate3d(0,0,0)';
          } else {
            const fromOpacity = 1 - smoothStep((eased - 0.2) / 0.65);
            const toOpacity = smoothStep((eased - 0.14) / 0.5);
            fromLayer.style.opacity = `${clamp01(fromOpacity)}`;
            toLayer.style.opacity = `${clamp01(toOpacity)}`;
            fromLayer.style.transform = `translate3d(${(-5 * (1 - eased)).toFixed(3)}px, 0, 0)`;
            toLayer.style.transform = `translate3d(${(3.5 * (1 - eased)).toFixed(3)}px, 0, 0)`;
          }
        }

        if (!reducedMotion && turbulence && displacement) {
          const scale = SCALE_END + (SCALE_START - SCALE_END) * Math.pow(1 - eased, 1.45);
          const freq = FREQ_END + (FREQ_START - FREQ_END) * Math.pow(1 - eased, 1.1);
          turbulence.setAttribute('baseFrequency', `${freq.toFixed(5)}`);
          displacement.setAttribute('scale', `${scale.toFixed(3)}`);
        }

        if (streak) {
          const streakIn = smoothStep(eased / 0.22);
          const streakOut = 1 - smoothStep((eased - 0.28) / 0.72);
          streak.style.opacity = `${clamp01(streakIn * streakOut * 0.62)}`;
        }

        if (raw >= 1) {
          setFromContent(null);
          setIsTransitioning(false);
          resetFilter();
          resetLayerStyles();
          rafRef.current = null;
          return;
        }

        rafRef.current = window.requestAnimationFrame(frame);
      };

      rafRef.current = window.requestAnimationFrame(frame);
    },
    [cancelCurrentAnimation, reducedMotion, resetFilter, resetLayerStyles],
  );

  useEffect(() => {
    resetFilter();
    resetLayerStyles();
  }, [resetFilter, resetLayerStyles]);

  useEffect(() => {
    if (location.key === previousLocationKeyRef.current) return;

    const previousContent = activeContentRef.current;
    previousLocationKeyRef.current = location.key;
    activeContentRef.current = outlet;

    setFromContent(previousContent);
    setToContent(outlet);
    runTransition(reducedMotion ? REDUCED_DURATION_MS : DISTORT_DURATION_MS);
  }, [location.key, outlet, reducedMotion, runTransition]);

  useEffect(() => {
    return () => {
      cancelCurrentAnimation();
    };
  }, [cancelCurrentAnimation]);

  return (
    <div className="distort-transition-root" aria-live="polite">
      <svg className="distort-filter-svg" aria-hidden width="0" height="0">
        <defs>
          <filter id="time-warp-distortion-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency={FREQ_END}
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale={SCALE_END}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {!isTransitioning || !fromContent ? (
        <div className="distort-static-layer">{toContent}</div>
      ) : (
        <div className="distort-layer-stack">
          <div
            ref={fromLayerRef}
            className="distort-layer distort-layer-from"
            style={{
              filter: layerFilter,
              pointerEvents: 'none',
            }}
          >
            {fromContent}
          </div>

          <div
            ref={toLayerRef}
            className="distort-layer distort-layer-to"
            style={{
              filter: layerFilter,
              pointerEvents: 'none',
            }}
          >
            {toContent}
          </div>

          <div ref={streakRef} className="distort-warp-streak" aria-hidden />
        </div>
      )}
    </div>
  );
}
