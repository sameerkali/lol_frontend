import * as React from 'react';
/**
 * The system's primary action. Hover lifts, press lands — that press is the
 * single most important interaction in LOL.
 * @startingPoint section="Core" subtitle="Sticker buttons in every variant and size" viewport="700x260"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary=grape (default action), reward=sun (redeem), success=mint, danger=coral, secondary=white, ghost=no chrome. */
  variant?: 'primary' | 'reward' | 'success' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide name or a node, rendered before the label. */
  icon?: string | React.ReactNode;
  iconAfter?: string | React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  /** Idle attention wobble. At most ONE wobbling element per screen. */
  wobble?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
