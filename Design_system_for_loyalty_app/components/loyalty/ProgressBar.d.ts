import * as React from 'react';
/** Progress toward the next milestone. Mint fill, ink outline, pill ends. */
export interface ProgressBarProps {
  value?: number;
  max?: number;
  /** Uppercase eyebrow; the value/max readout is added automatically in mono. */
  label?: string;
  height?: number;
  tone?: string;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
