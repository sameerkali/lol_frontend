import React from 'react';

export function Tabs({ tabs = [], value, onChange, style }) {
  return (
    <div style={{
      display: 'inline-flex', gap: 4, padding: 4,
      background: 'var(--surface-sunk)', border: 'var(--border)',
      borderRadius: 'var(--radius-pill)', ...style,
    }}>
      {tabs.map((t) => {
        const val = typeof t === 'string' ? t : t.value;
        const lab = typeof t === 'string' ? t : t.label;
        const on = val === value;
        return (
          <button key={val} onClick={() => onChange && onChange(val)} style={{
            padding: '11px 20px', minHeight: 44, border: on ? 'var(--border)' : '3px solid transparent',
            borderRadius: 'var(--radius-pill)',
            background: on ? 'var(--paper-000)' : 'transparent',
            boxShadow: on ? 'var(--pop-1)' : 'none',
            font: 'var(--type-button)', color: on ? 'var(--text-strong)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all var(--dur-fast) var(--ease-out)',
          }}>{lab}</button>
        );
      })}
    </div>
  );
}
