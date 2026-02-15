import React from 'react';
import { Text } from '../../foundations/Text';
import { Divider } from '../../foundations/Divider';
import { Minus, Plus } from 'lucide-react';
import './GuestPicker.css';

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
  return (
    <div
      className={`ds-guest-picker${className ? ` ${className}` : ''}`}
      style={style}
    >
      {categories.map((cat, index) => (
        <React.Fragment key={cat.id}>
          <div
            className={`ds-guest-picker__row${index === 0 ? ' ds-guest-picker__row--first' : ''}${index === categories.length - 1 ? ' ds-guest-picker__row--last' : ''}`}
          >
            <div className="ds-guest-picker__text">
              <Text variant="h4" weight="semibold" color="primary" as="div">
                {cat.label}
              </Text>
              <Text variant="body" color="secondary" as="div">
                {cat.subtitle}
              </Text>
            </div>

            <div className="ds-guest-picker__stepper">
              <button
                type="button"
                className={`ds-guest-picker__btn${cat.count <= 0 ? ' ds-guest-picker__btn--disabled' : ''}`}
                onClick={() => cat.count > 0 && onChange?.(cat.id, cat.count - 1)}
                disabled={cat.count <= 0}
                aria-label={`Decrease ${cat.label}`}
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>

              <Text
                variant="body"
                weight="medium"
                color="primary"
                as="span"
                className="ds-guest-picker__count"
              >
                {cat.count}
              </Text>

              <button
                type="button"
                className={`ds-guest-picker__btn${cat.max != null && cat.count >= cat.max ? ' ds-guest-picker__btn--disabled' : ''}`}
                onClick={() => {
                  if (cat.max == null || cat.count < cat.max) {
                    onChange?.(cat.id, cat.count + 1);
                  }
                }}
                disabled={cat.max != null && cat.count >= cat.max}
                aria-label={`Increase ${cat.label}`}
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {index < categories.length - 1 && (
            <Divider orientation="horizontal" className="ds-guest-picker__divider" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
