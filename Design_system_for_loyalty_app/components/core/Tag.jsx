import React from 'react';
import { Icon } from './Icon.jsx';

export function Tag({ children, selected = false, onClick, onRemove, style }) {
  const clickable = !!onClick;
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '9px 14px', minHeight: 40, boxSizing: 'border-box',
        font: 'var(--type-button)',
        background: selected ? 'var(--ink-900)' : 'var(--paper-000)',
        color: selected ? 'var(--paper-000)' : 'var(--ink-900)',
        border: 'var(--border)', borderRadius: 'var(--radius-pill)',
        boxShadow: selected ? 'var(--pop-pressed)' : 'var(--pop-1)',
        transform: selected ? 'translate(2px,2px)' : 'none',
        transition: 'all var(--dur-fast) var(--ease-out)',
        cursor: clickable ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
      {onRemove ? (
        <span onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ display: 'inline-flex', cursor: 'pointer' }}>
          <Icon name="x" size={14} />
        </span>
      ) : null}
    </span>
  );
}
