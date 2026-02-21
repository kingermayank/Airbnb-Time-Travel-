import React from 'react';
import { X } from 'lucide-react';
import { Text } from '../../foundations/Text';
import '../EraPicker/EraPicker.css';

export interface ThemePickerItem {
  /** Unique identifier for the theme */
  id: string;
  /** Theme display name (e.g. "Grandeur") */
  title: string;
  /** Short subtitle description */
  subtitle: string;
  /** URL or import path for the theme illustration */
  imageUrl: string;
  /** Alt text for the illustration */
  imageAlt?: string;
}

export interface ThemePickerProps {
  /** List of theme items to display */
  items: ThemePickerItem[];
  /** Currently selected theme id */
  selectedId?: string;
  /** Callback when a theme row is clicked */
  onSelect?: (id: string) => void;
  /** Additional class name */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

/**
 * ThemePicker — a card listing time-travel themes with illustration, title, and subtitle.
 * Each row is clickable with a rounded hover highlight.
 * Shares visual design with EraPicker.
 */
export function ThemePicker({
  items,
  selectedId,
  onSelect,
  className,
  style,
}: ThemePickerProps) {
  return (
    <div
      className={`ds-era-picker${className ? ` ${className}` : ''}`}
      style={style}
    >
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
          </button>
        );
      })}
    </div>
  );
}
