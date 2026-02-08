import React from 'react';
import './IconButton.css';

const ICON_BUTTON_SIZE = 40;

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
}

export function IconButton({
  icon,
  ariaLabel,
  disabled,
  className,
  style,
  ...rest
}: IconButtonProps) {
  const combinedStyle: React.CSSProperties = {
    width: ICON_BUTTON_SIZE,
    height: ICON_BUTTON_SIZE,
    padding: 0,
    border: 'none',
    borderRadius: ICON_BUTTON_SIZE / 2,
    backgroundColor: 'var(--ds-surface-icon-button)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    flexShrink: 0,
    ...style,
  };
  return (
    <button
      type="button"
      className={[className, 'ds-icon-button'].filter(Boolean).join(' ')}
      style={combinedStyle}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon}
    </button>
  );
}
