import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function BottomBar({ items = [], value, onChange, style }) {
  return (
    <nav style={{
      display: 'flex', gap: 4, padding: '10px 12px 16px',
      background: 'var(--paper-000)', borderTop: 'var(--border)', ...style,
    }}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button key={it.value} onClick={() => onChange && onChange(it.value)} style={{
            flex: 1, minHeight: 56, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer',
            background: on ? 'var(--grape-100)' : 'transparent',
            border: on ? 'var(--border)' : '3px solid transparent',
            borderRadius: 'var(--radius-md)',
            color: on ? 'var(--grape-700)' : 'var(--ink-500)',
            font: '700 11px/1 var(--font-body)', letterSpacing: '0.04em',
          }}>
            <Icon name={it.icon} size={22} />
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}
