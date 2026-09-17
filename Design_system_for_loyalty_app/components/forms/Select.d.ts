import * as React from 'react';
/** Dropdown for settings with fixed choices (earning mode, reward type, template). */
export interface SelectProps {
  label?: string;
  /** One-line consequence of the choice, shown under the control. */
  hint?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<string | { value: string; label: string }>;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
