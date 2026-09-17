import React from 'react';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

const CONFETTI = ['var(--sun-500)', 'var(--mint-500)', 'var(--coral-500)', 'var(--sky-500)', 'var(--grape-500)'];

export function Celebration({ open = true, title = 'Free coffee unlocked!', subtitle, onDismiss, dismissLabel = 'See my reward' }) {
  if (!open) return null;
  const bits = Array.from({ length: 18 }).map((_, i) => ({
    left: `${(i * 5.6 + (i % 3) * 7) % 96}%`,
    delay: `${(i % 6) * 90}ms`,
    color: CONFETTI[i % CONFETTI.length],
    size: 10 + (i % 4) * 6,
    round: i % 3 === 0,
  }));
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50, overflow: 'hidden',
      background: 'rgba(27,21,38,0.72)', backdropFilter: 'blur(3px)',
      display: 'grid', placeItems: 'center', padding: 24,
    }}>
      {bits.map((b, i) => (
        <span key={i} style={{
          position: 'absolute', top: -30, left: b.left, width: b.size, height: b.size,
          background: b.color, border: '2px solid var(--ink-900)',
          borderRadius: b.round ? '50%' : 3,
          animation: `lol-rise var(--dur-celebrate) var(--ease-out) ${b.delay} both`,
          transform: 'translateY(38vh)',
        }} />
      ))}
      <div style={{
        position: 'relative', textAlign: 'center', maxWidth: 340, width: '100%',
        background: 'var(--sun-500)', border: 'var(--border)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--pop-3)', padding: 32,
        animation: 'lol-pop-in var(--dur-slow) var(--ease-pop) both',
      }}>
        <span style={{
          width: 76, height: 76, margin: '0 auto 16px', display: 'grid', placeItems: 'center',
          background: 'var(--paper-000)', border: 'var(--border)', borderRadius: '50%',
        }}><Icon name="gift" size={36} /></span>
        <div style={{ font: 'var(--type-display)', fontSize: 46, letterSpacing: 'var(--tracking-display)', color: 'var(--ink-900)' }}>{title}</div>
        {subtitle ? <div style={{ font: 'var(--type-body)', color: 'var(--ink-900)', marginTop: 8 }}>{subtitle}</div> : null}
        <Button variant="secondary" size="md" fullWidth style={{ marginTop: 24 }} onClick={onDismiss}>{dismissLabel}</Button>
      </div>
    </div>
  );
}
