import React from 'react';
import { Icon } from './Icon.jsx';

const FILLS = {
  primary:   { background: 'var(--grape-500)', color: 'var(--paper-000)' },
  reward:    { background: 'var(--sun-500)',   color: 'var(--ink-900)' },
  success:   { background: 'var(--mint-500)',  color: 'var(--ink-900)' },
  danger:    { background: 'var(--coral-500)', color: 'var(--ink-900)' },
  secondary: { background: 'var(--paper-000)', color: 'var(--ink-900)' },
  ghost:     { background: 'transparent',      color: 'var(--ink-900)', border: '3px solid transparent', boxShadow: 'none' },
};
const SIZES = {
  sm: { padding: '9px 16px', fontSize: 13, minHeight: 38, gap: 6 },
  md: { padding: '13px 24px', fontSize: 15, minHeight: 48, gap: 8 },
  lg: { padding: '18px 32px', fontSize: 18, minHeight: 60, gap: 10 },
};

export function Button({
  children, variant = 'primary', size = 'md', icon, iconAfter,
  fullWidth = false, disabled = false, wobble = false, onClick, type = 'button', style, ...rest
}) {
  const [down, setDown] = React.useState(false);
  const [over, setOver] = React.useState(false);
  const fill = FILLS[variant] || FILLS.primary;
  const s = SIZES[size] || SIZES.md;
  const flat = variant === 'ghost';
  const shift = disabled || flat ? 0 : down ? 3 : over ? -2 : 0;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => { setDown(false); setOver(false); }}
      onPointerEnter={() => setOver(true)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap, padding: s.padding, minHeight: s.minHeight,
        width: fullWidth ? '100%' : undefined,
        font: `700 ${s.fontSize}px/1 var(--font-body)`,
        borderRadius: 'var(--radius-pill)',
        border: flat ? '3px solid transparent' : 'var(--border)',
        boxShadow: flat || disabled ? 'none' : down ? 'var(--pop-pressed)' : over ? 'var(--pop-3)' : 'var(--pop-2)',
        transform: `translate(${shift}px, ${shift}px)`,
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        animation: wobble && !disabled ? 'lol-wobble 2.5s var(--ease-out) infinite' : undefined,
        ...(disabled
          ? { background: 'var(--ink-100)', color: 'var(--ink-500)', border: '3px solid var(--ink-300)' }
          : fill),
        ...style,
      }}
      {...rest}
    >
      {icon ? (typeof icon === 'string' ? <Icon name={icon} size={s.fontSize + 3} /> : icon) : null}
      {children}
      {iconAfter ? (typeof iconAfter === 'string' ? <Icon name={iconAfter} size={s.fontSize + 3} /> : iconAfter) : null}
    </button>
  );
}
