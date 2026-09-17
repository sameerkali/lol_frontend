import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function SideNav({ items = [], value, onChange, brand = 'lol', footer, style }) {
  return (
    <nav style={{
      width: 240, flex: '0 0 auto', display: 'flex', flexDirection: 'column',
      gap: 6, padding: 20, boxSizing: 'border-box',
      background: 'var(--ink-900)', borderRight: 'var(--border)', ...style,
    }}>
      <div style={{ font: '900 44px/0.8 var(--font-display)', letterSpacing: '-0.03em', color: 'var(--paper-000)', marginBottom: 20 }}>
        {brand}<span style={{ color: 'var(--coral-500)' }}>.</span>
      </div>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button key={it.value} onClick={() => onChange && onChange(it.value)} style={{
            display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            padding: '12px 14px', minHeight: 48, textAlign: 'left', cursor: 'pointer',
            background: on ? 'var(--grape-500)' : 'transparent',
            color: on ? 'var(--paper-000)' : 'var(--ink-300)',
            border: on ? '3px solid var(--paper-000)' : '3px solid transparent',
            borderRadius: 'var(--radius-pill)',
            font: 'var(--type-button)',
            transition: 'all var(--dur-fast) var(--ease-out)',
          }}>
            <Icon name={it.icon} size={20} />
            {it.label}
          </button>
        );
      })}
      <div style={{ marginTop: 'auto' }}>{footer}</div>
    </nav>
  );
}
