import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Select({ label, hint, value, onChange, options = [], disabled, id, style }) {
  const rid = id || React.useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label ? (
        <label htmlFor={rid} style={{
          font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>{label}</label>
      ) : null}
      <div style={{
        position: 'relative', background: disabled ? 'var(--ink-100)' : 'var(--paper-000)',
        border: 'var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--pop-1)',
      }}>
        <select
          id={rid} value={value} disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{
            appearance: 'none', width: '100%', border: 0, outline: 'none', background: 'transparent',
            font: '600 16px/1 var(--font-body)', color: 'var(--text-strong)',
            padding: '19px 48px 19px 16px', cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lab = typeof o === 'string' ? o : o.label;
            return <option key={val} value={val}>{lab}</option>;
          })}
        </select>
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <Icon name="chevron-down" size={20} />
        </span>
      </div>
      {hint ? <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{hint}</span> : null}
    </div>
  );
}
