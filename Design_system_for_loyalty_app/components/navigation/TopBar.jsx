import React from 'react';

export function TopBar({ title, subtitle, logo, right, tone = 'var(--grape-500)', style }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 20px', background: tone,
      borderBottom: 'var(--border)', color: 'var(--paper-000)', ...style,
    }}>
      {logo ? (
        <span style={{
          width: 46, height: 46, flex: '0 0 auto', borderRadius: 'var(--radius-sm)',
          border: 'var(--border)', overflow: 'hidden', background: 'var(--paper-000)',
          display: 'grid', placeItems: 'center',
        }}>{logo}</span>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--type-subtitle)', letterSpacing: 'var(--tracking-display)', color: 'inherit' }}>{title}</div>
        {subtitle ? <div style={{ font: 'var(--type-body-sm)', color: 'inherit', opacity: 0.92 }}>{subtitle}</div> : null}
      </div>
      {right}
    </header>
  );
}
