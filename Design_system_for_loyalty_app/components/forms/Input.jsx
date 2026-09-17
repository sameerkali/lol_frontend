import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Input({
  label, hint, error, value, onChange, placeholder, type = 'text',
  prefix, icon, mono = false, disabled = false, id, style,
}) {
  const [focus, setFocus] = React.useState(false);
  const [reveal, setReveal] = React.useState(false);
  const rid = id || React.useId();
  const errorId = `${rid}-error`;
  const hintId = `${rid}-hint`;
  const isPassword = type === 'password';
  const inputType = isPassword && reveal ? 'text' : type;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label ? (
        <label htmlFor={rid} style={{
          font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)',
          textTransform: 'uppercase', color: 'var(--text-muted)',
        }}>{label}</label>
      ) : null}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: disabled ? 'var(--ink-100)' : 'var(--paper-000)',
        border: `3px solid ${error ? 'var(--coral-500)' : 'var(--line)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--pop-pressed)' : 'var(--pop-1)',
        transform: focus ? 'translate(2px,2px)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)',
        padding: '0 16px', minHeight: 56,
      }}>
        {icon ? <Icon name={icon} size={20} color="var(--ink-500)" /> : null}
        {prefix ? <span style={{ font: 'var(--type-mono)', color: 'var(--text-muted)' }}>{prefix}</span> : null}
        <input
          id={rid} type={inputType} value={value} placeholder={placeholder} disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          style={{
            flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent',
            font: mono ? '700 18px/1 var(--font-mono)' : '500 16px/1 var(--font-body)',
            letterSpacing: mono ? 'var(--tracking-mono)' : 0,
            color: 'var(--text-strong)', padding: '17px 0',
          }}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            aria-pressed={reveal}
            tabIndex={-1}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flex: '0 0 auto', background: 'transparent', border: 0, padding: 4, margin: 0,
              cursor: 'pointer', color: 'var(--ink-500)',
            }}
          >
            <Icon name={reveal ? 'eye-off' : 'eye'} size={20} />
          </button>
        ) : null}
      </div>
      {error ? (
        <span id={errorId} role="alert" style={{ font: 'var(--type-body-sm)', color: 'var(--danger-ink)', fontWeight: 600 }}>{error}</span>
      ) : hint ? (
        <span id={hintId} style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </div>
  );
}
