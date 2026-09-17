import * as React from 'react';
/** Uppercase status pill: UNLOCKED, REDEEMED, LAPSED, PIN REQUIRED. Status only — never a link. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'reward' | 'danger' | 'info';
  icon?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
