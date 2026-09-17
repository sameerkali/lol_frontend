import React from 'react';

const TONES = {
  paper:  { background: 'var(--surface-card)' },
  sunk:   { background: 'var(--surface-sunk)', boxShadow: 'none' },
  grape:  { background: 'var(--grape-100)' },
  mint:   { background: 'var(--mint-100)' },
  sun:    { background: 'var(--sun-100)' },
  coral:  { background: 'var(--coral-100)' },
  invert: { background: 'var(--ink-900)', color: 'var(--paper-000)' },
};

export function Card({ children, tone = 'paper', pad = 24, tilt = 0, elevation = 2, interactive = false, onClick, style }) {
  const [over, setOver] = React.useState(false);
  const pop = { 0: 'none', 1: 'var(--pop-1)', 2: 'var(--pop-2)', 3: 'var(--pop-3)' };
  return (
    <div
      onClick={onClick}
      onPointerEnter={() => setOver(true)}
      onPointerLeave={() => setOver(false)}
      style={{
        background: 'var(--surface-card)',
        border: 'var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: pop[elevation],
        padding: pad,
        boxSizing: 'border-box',
        transform: `rotate(${tilt}deg) translate(${interactive && over ? '-2px, -2px' : '0, 0'})`,
        transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
        cursor: interactive ? 'pointer' : undefined,
        ...TONES[tone],
        ...(interactive && over ? { boxShadow: 'var(--pop-3)' } : null),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
