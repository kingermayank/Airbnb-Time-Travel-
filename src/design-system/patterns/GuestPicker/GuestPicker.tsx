import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Text } from '../../foundations/Text';
import { Divider } from '../../foundations/Divider';
import { Minus, Plus } from 'lucide-react';
import './GuestPicker.css';

const pickerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.025, delayChildren: 0 },
  },
};

const pickerRowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 720, damping: 32, mass: 0.45 },
  },
};

export interface GuestCategory {
  /** Unique identifier (e.g. "adults") */
  id: string;
  /** Display label (e.g. "Adults") */
  label: string;
  /** Subtitle description (e.g. "Ages 13 or above") */
  subtitle: string;
  /** Current count */
  count: number;
  /** Maximum allowed count (optional) */
  max?: number;
}

export interface GuestPickerProps {
  /** List of guest categories */
  categories: GuestCategory[];
  /** Callback when a category count changes */
  onChange?: (id: string, newCount: number) => void;
  /** Additional class name */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

/**
 * GuestPicker — a card with guest category rows, each with a label,
 * subtitle, and a minus/plus stepper. Rows are separated by dividers.
 * Matches Figma node 504:2421.
 */
export function GuestPicker({
  categories,
  onChange,
  className,
  style,
}: GuestPickerProps) {
  const [countPulseById, setCountPulseById] = React.useState<Record<string, number>>({});
  const [limitNudgeById, setLimitNudgeById] = React.useState<Record<string, number>>({});
  const previousCountsRef = React.useRef<Record<string, number>>({});

  React.useEffect(() => {
    const previousCounts = previousCountsRef.current;
    const changedIds: string[] = [];

    categories.forEach((cat) => {
      if (previousCounts[cat.id] != null && previousCounts[cat.id] !== cat.count) {
        changedIds.push(cat.id);
      }
      previousCounts[cat.id] = cat.count;
    });

    if (changedIds.length > 0) {
      setCountPulseById((prev) => {
        const next = { ...prev };
        changedIds.forEach((id) => {
          next[id] = (next[id] ?? 0) + 1;
        });
        return next;
      });
    }
  }, [categories]);

  const triggerLimitNudge = React.useCallback((categoryId: string) => {
    setLimitNudgeById((prev) => ({
      ...prev,
      [categoryId]: (prev[categoryId] ?? 0) + 1,
    }));
  }, []);

  const shouldReduceMotion = useReducedMotion();
  const containerClass = `ds-guest-picker${className ? ` ${className}` : ''}`;

  const rowContent = (cat: GuestCategory, index: number) => {
    const canDecrement = cat.count > 0;
    const canIncrement = cat.max == null || cat.count < cat.max;
    const countPulseKey = countPulseById[cat.id] ?? 0;
    const limitNudgeKey = limitNudgeById[cat.id] ?? 0;

    return (
      <>
        <div
          className={`ds-guest-picker__row${index === 0 ? ' ds-guest-picker__row--first' : ''}${index === categories.length - 1 ? ' ds-guest-picker__row--last' : ''}`}
        >
          <div className="ds-guest-picker__text">
            <Text variant="h4" weight="medium" color="primary" as="div" style={{ fontWeight: 500 }}>
              {cat.label}
            </Text>
            <Text variant="body" color="secondary" as="div">
              {cat.subtitle}
            </Text>
          </div>

          <div
            key={`${cat.id}-stepper-${limitNudgeKey}`}
            className={`ds-guest-picker__stepper${limitNudgeKey > 0 ? ' ds-guest-picker__stepper--limit-nudge' : ''}`}
          >
            <button
              type="button"
              className={`ds-guest-picker__btn${!canDecrement ? ' ds-guest-picker__btn--disabled' : ''}`}
              onClick={() => {
                if (!canDecrement) {
                  triggerLimitNudge(cat.id);
                  return;
                }
                onChange?.(cat.id, cat.count - 1);
              }}
              aria-disabled={!canDecrement}
              tabIndex={!canDecrement ? -1 : 0}
              aria-label={`Decrease ${cat.label}`}
            >
              <Minus size={16} strokeWidth={1.5} />
            </button>

            <Text
              key={`${cat.id}-count-${countPulseKey}`}
              variant="body"
              weight="medium"
              color="primary"
              as="span"
              className={`ds-guest-picker__count${countPulseKey > 0 ? ' ds-guest-picker__count--bump' : ''}`}
            >
              {cat.count}
            </Text>

            <button
              type="button"
              className={`ds-guest-picker__btn${!canIncrement ? ' ds-guest-picker__btn--disabled' : ''}`}
              onClick={() => {
                if (!canIncrement) {
                  triggerLimitNudge(cat.id);
                  return;
                }
                onChange?.(cat.id, cat.count + 1);
              }}
              aria-disabled={!canIncrement}
              tabIndex={!canIncrement ? -1 : 0}
              aria-label={`Increase ${cat.label}`}
            >
              <Plus size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {index < categories.length - 1 && (
          <Divider orientation="horizontal" className="ds-guest-picker__divider" />
        )}
      </>
    );
  };

  if (shouldReduceMotion) {
    return (
      <div className={containerClass} style={style}>
        {categories.map((cat, index) => (
          <React.Fragment key={cat.id}>{rowContent(cat, index)}</React.Fragment>
        ))}
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
      {categories.map((cat, index) => (
        <motion.div key={cat.id} variants={pickerRowVariants}>
          {rowContent(cat, index)}
        </motion.div>
      ))}
    </motion.div>
  );
}
