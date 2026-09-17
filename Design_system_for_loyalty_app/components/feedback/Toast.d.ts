import * as React from 'react';
/** Transient confirmation. Never used for milestone unlocks — those get the Celebration overlay. */
export interface ToastProps {
  children?: React.ReactNode;
  tone?: 'success' | 'danger' | 'info' | 'reward';
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
