import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function PinPad({ length = 4, value = '', onChange, onComplete, error, title = 'Hand the phone to staff', subtitle = 'Enter the business PIN to confirm.' }) {
  const push = (d) => {
    if (value.length >= length) return;
    const next = value + d;
    onChange && onChange(next);
    if (next.length === length && onComplete) onComplete(next);
  };
  const back = () => onChange && onChange(value.slice(0, -1));
  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ font: 'var(--type-title)', letterSpacing: 'var(--tracking-display)', color: 'var(--text-strong)' }}>{title}</div>
        <div style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {Array.from({ length }).map((_, i) => (
          <span key={i} style={{
            width: 52, height: 62, display: 'grid', placeItems: 'center',
            background: 'var(--paper-000)',
            border: `3px solid ${error ? 'var(--coral-500)' : 'var(--line)'}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: i < value.length ? 'var(--pop-pressed)' : 'var(--pop-1)',
            transform: i < value.length ? 'translate(2px,2px)' : 'none',
            font: '700 26px/1 var(--font-mono)', color: 'var(--text-strong)',
            transition: 'all var(--dur-fast) var(--ease-pop)',
          }}>{i < value.length ? '•' : ''}</span>
        ))}
      </div>

      {error ? <div style={{ font: '600 14px/1.4 var(--font-body)', color: 'var(--danger-ink)' }}>{error}</div> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 76px)', gap: 12 }}>
        {keys.map((k, i) => k === '' ? <span key={i} /> : (
          <button key={i}
            onClick={() => (k === 'del' ? back() : push(k))}
            style={{
              height: 64, display: 'grid', placeItems: 'center',
              background: k === 'del' ? 'var(--paper-200)' : 'var(--paper-000)',
              border: 'var(--border)', borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--pop-1)', cursor: 'pointer',
              font: '700 24px/1 var(--font-mono)', color: 'var(--text-strong)',
              transition: 'all var(--dur-fast) var(--ease-out)',
            }}
            onPointerDown={(e) => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = 'var(--pop-pressed)'; }}
            onPointerUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--pop-1)'; }}
            onPointerLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--pop-1)'; }}
          >
            {k === 'del' ? <Icon name="delete" size={22} /> : k}
          </button>
        ))}
      </div>
    </div>
  );
}
