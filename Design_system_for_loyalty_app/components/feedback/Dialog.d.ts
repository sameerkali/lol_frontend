import * as React from 'react';
/** Modal. Positioned absolutely inside its nearest positioned ancestor, so it works inside a phone frame. */
export interface DialogProps {
  open?: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
  width?: number;
  /** Action row, right-aligned. */
  footer?: React.ReactNode;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
