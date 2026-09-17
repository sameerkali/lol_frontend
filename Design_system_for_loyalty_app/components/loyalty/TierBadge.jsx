import React from 'react';
import { Icon } from '../core/Icon.jsx';

const TIERS = {
  Bronze: 'var(--tier-bronze)',
  Silver: 'var(--tier-silver)',
  Gold: 'var(--tier-gold)',
};

export function TierBadge({ tier = 'Silver', color, size = 'md', style }) {
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sm ? 7 : 10,
      padding: sm ? '5px 12px 5px 5px' : '7px 18px 7px 7px',
      background: 'var(--paper-000)', border: 'var(--border)',
      borderRadius: 'var(--radius-pill)', boxShadow: 'var(--pop-1)', ...style,
    }}>
      <span style={{
        width: sm ? 24 : 32, height: sm ? 24 : 32, display: 'grid', placeItems: 'center',
        background: color || TIERS[tier] || 'var(--ink-300)',
        border: 'var(--border-hair)', borderRadius: '50%',
      }}>
        <Icon name="award" size={sm ? 13 : 17} />
      </span>
      <span style={{ font: `800 ${sm ? 17 : 22}px/1 var(--font-display)`, color: 'var(--text-strong)' }}>{tier}</span>
    </span>
  );
}
