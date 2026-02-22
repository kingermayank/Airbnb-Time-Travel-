import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { Text } from '../../foundations/Text';
import './EraPicker.css';

const pickerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0 },
  },
};

const pickerRowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 450, damping: 26 },
  },
};

export interface EraPickerItem {
  /** Unique identifier for the era */
  id: string;
  /** Era display name (e.g. "Origins") */
  title: string;
  /** Short subtitle description (e.g. "Pre-civilization") */
  subtitle: string;
  /** URL or import path for the era illustration */
  imageUrl: string;
  /** Alt text for the illustration */
  imageAlt?: string;
}

export interface EraPickerProps {
  /** List of era items to display */
  items: EraPickerItem[];
  /** Currently selected era id */
  selectedId?: string;
  /** Callback when an era row is clicked */
  onSelect?: (id: string) => void;
  /** Additional class name */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

/**
 * EraPicker — a card listing time-travel eras with illustration, title, and subtitle.
 * Each row is clickable with a rounded hover highlight.
 * Matches Figma node 377:6715.
 */
export function EraPicker({
  items,
  selectedId,
  onSelect,
  className,
  style,
}: EraPickerProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerClass = `ds-era-picker${className ? ` ${className}` : ''}`;

  if (shouldReduceMotion) {
    return (
      <div className={containerClass} style={style}>
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`ds-era-picker__row${isSelected ? ' ds-era-picker__row--selected' : ''}`}
              onClick={() => onSelect?.(item.id)}
              aria-pressed={isSelected}
            >
              <div className="ds-era-picker__image-wrapper">
                <img
                  className="ds-era-picker__image"
                  src={item.imageUrl}
                  alt={item.imageAlt ?? item.title}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    const el = e.currentTarget;
                    const letter = item.title.charAt(0);
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="32" font-family="system-ui,sans-serif">${letter}</text></svg>`;
                    el.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                  }}
                />
              </div>
              <div className="ds-era-picker__text">
                <Text variant="h4" weight="semibold" color="primary" as="div">
                  {item.title}
                </Text>
                <Text variant="body" color="secondary" as="div">
                  {item.subtitle}
                </Text>
              </div>
              {isSelected && (
                <span className="ds-era-picker__clear-indicator" aria-hidden>
                  <X size={16} strokeWidth={2.25} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <motion.div
      className={containerClass}
      style={style}
      variants={pickerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <motion.button
            key={item.id}
            type="button"
            className={`ds-era-picker__row${isSelected ? ' ds-era-picker__row--selected' : ''}`}
            onClick={() => onSelect?.(item.id)}
            aria-pressed={isSelected}
            variants={pickerRowVariants}
          >
            <div className="ds-era-picker__image-wrapper">
              <img
                className="ds-era-picker__image"
                src={item.imageUrl}
                alt={item.imageAlt ?? item.title}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const el = e.currentTarget;
                  const letter = item.title.charAt(0);
                  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#666" font-size="32" font-family="system-ui,sans-serif">${letter}</text></svg>`;
                  el.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                }}
              />
            </div>

            <div className="ds-era-picker__text">
              <Text
                variant="h4"
                weight="semibold"
                color="primary"
                as="div"
              >
                {item.title}
              </Text>
              <Text variant="body" color="secondary" as="div">
                {item.subtitle}
              </Text>
            </div>
            {isSelected && (
              <span className="ds-era-picker__clear-indicator" aria-hidden>
                <X size={16} strokeWidth={2.25} />
              </span>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
