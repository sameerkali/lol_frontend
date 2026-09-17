import React from 'react';

export function ProgressBar({ value = 0, max = 10, label, height = 26, tone = 'var(--mint-500)' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
          <span style={{ font: '700 15px/1 var(--font-mono)', color: 'var(--text-strong)' }}>{value}/{max}</span>
        </div>
      ) : null}
      <div style={{
        height, background: 'var(--paper-200)', border: 'var(--border)',
        borderRadius: 'var(--radius-pill)', overflow: 'hidden', padding: 0,
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: tone,
          borderRight: pct > 0 && pct < 100 ? 'var(--border)' : 'none',
          borderRadius: 'var(--radius-pill)',
          transition: 'width var(--dur-slow) var(--ease-pop)',
        }} />
      </div>
    </div>
  );
}
