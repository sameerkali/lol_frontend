import React from 'react';
import { Icon } from './Icon.jsx';

const FILLS = {
  primary:   { background: 'var(--grape-500)', color: 'var(--paper-000)' },
  secondary: { background: 'var(--paper-000)', color: 'var(--ink-900)' },
  danger:    { background: 'var(--coral-500)', color: 'var(--ink-900)' },
  ghost:     { background: 'transparent', color: 'var(--ink-900)' },
};
const SIZES = { sm: 38, md: 48, lg: 60 };

export function IconButton({ icon, label, variant = 'secondary', size = 'md', disabled, onClick, style }) {
  const [down, setDown] = React.useState(false);
  const [over, setOver] = React.useState(false);
  const px = SIZES[size] || SIZES.md;
  const flat = variant === 'ghost';
  const shift = disabled || flat ? 0 : down ? 3 : over ? -2 : 0;
  return (
    <button
      aria-label={label} title={label} disabled={disabled} onClick={onClick}
      onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)}
      onPointerEnter={() => setOver(true)} onPointerLeave={() => { setDown(false); setOver(false); }}
      style={{
        width: px, height: px, display: 'grid', placeItems: 'center',
        borderRadius: 'var(--radius-pill)',
        border: flat ? '3px solid transparent' : 'var(--border)',
        boxShadow: flat || disabled ? 'none' : down ? 'var(--pop-pressed)' : over ? 'var(--pop-2)' : 'var(--pop-1)',
        transform: `translate(${shift}px, ${shift}px)`,
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...(disabled ? { background: 'var(--ink-100)', color: 'var(--ink-500)' } : FILLS[variant]),
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(px * 0.44)} />
    </button>
  );
}
