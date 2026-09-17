import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ checked = false, onChange, label, hint, disabled, style }) {
  return (
    <label style={{
      display: 'flex', gap: 12, alignItems: 'flex-start', minHeight: 48,
      cursor: disabled ? 'not-allowed' : 'pointer', ...style,
    }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 30, height: 30, flex: '0 0 auto', display: 'grid', placeItems: 'center',
          background: checked ? 'var(--grape-500)' : 'var(--paper-000)',
          color: 'var(--paper-000)',
          border: 'var(--border)', borderRadius: 'var(--radius-xs)',
          boxShadow: checked ? 'var(--pop-pressed)' : 'var(--pop-1)',
          transform: checked ? 'translate(2px,2px)' : 'none',
          transition: 'all var(--dur-fast) var(--ease-pop)',
          marginTop: 2,
        }}
      >
        {checked ? <Icon name="check" size={18} /> : null}
      </span>
      <span>
        <span style={{ font: '600 15px/1.4 var(--font-body)', color: 'var(--text-strong)' }}>{label}</span>
        {hint ? <span style={{ display: 'block', font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{hint}</span> : null}
      </span>
    </label>
  );
}
