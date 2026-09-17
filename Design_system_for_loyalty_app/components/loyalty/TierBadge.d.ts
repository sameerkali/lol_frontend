import * as React from 'react';
/** Tier marker, used when a business moves customers up a tier instead of resetting the card. */
export interface TierBadgeProps {
  tier?: string;
  /** Override the disc colour for a business-defined tier name. */
  color?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function TierBadge(props: TierBadgeProps): JSX.Element;
