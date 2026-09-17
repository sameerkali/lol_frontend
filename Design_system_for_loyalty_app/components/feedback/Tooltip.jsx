import React from 'react';

export function Tooltip({ label, children, placement = 'top' }) {
  const [show, setShow] = React.useState(false);
  const pos = placement === 'top'
    ? { bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }
    : { top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' };
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}
      onPointerEnter={() => setShow(true)} onPointerLeave={() => setShow(false)}>
      {children}
      {show ? (
        <span style={{
          position: 'absolute', ...pos, zIndex: 20, whiteSpace: 'nowrap',
          background: 'var(--ink-900)', color: 'var(--paper-000)',
          border: 'var(--border-hair)', borderRadius: 'var(--radius-sm)',
          padding: '8px 12px', font: '600 13px/1 var(--font-body)',
          boxShadow: 'var(--pop-1)', animation: 'lol-rise var(--dur-fast) var(--ease-out) both',
        }}>{label}</span>
      ) : null}
    </span>
  );
}
