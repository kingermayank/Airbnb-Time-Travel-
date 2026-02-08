import React from 'react';
import { Text } from '../Text';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  className?: string;
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'var(--ds-font-family)',
  fontSize: 'var(--ds-text-14)',
  lineHeight: 'var(--ds-leading-18)',
  color: 'var(--ds-text-primary)',
  backgroundColor: 'var(--ds-surface)',
  border: '1px solid var(--ds-border)',
  borderRadius: 'var(--ds-radius-md)',
  padding: 'var(--ds-spacing-10) var(--ds-spacing-12)',
  width: '100%',
  boxSizing: 'border-box',
};

export function Input({
  label,
  error,
  className,
  style,
  id: idProp,
  ...rest
}: InputProps) {
  const id = idProp ?? `input-${Math.random().toString(36).slice(2, 9)}`;
  const hasError = Boolean(error);
  return (
    <div className={className} style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{ display: 'block', marginBottom: 'var(--ds-spacing-4)' }}
        >
          <Text variant="label" color="primary">
            {label}
          </Text>
        </label>
      )}
      <input
        id={id}
        style={{
          ...inputStyle,
          borderColor: hasError ? 'var(--ds-accent)' : undefined,
          ...style,
        }}
        aria-invalid={hasError}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <div
          id={`${id}-error`}
          role="alert"
          style={{
            marginTop: 'var(--ds-spacing-4)',
            fontSize: 'var(--ds-text-12)',
            color: 'var(--ds-accent)',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
