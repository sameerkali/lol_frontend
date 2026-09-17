import * as React from 'react';
/** Square-footprint circular action. Always needs a `label` for screen readers and tooltip. */
export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label — required. */
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
