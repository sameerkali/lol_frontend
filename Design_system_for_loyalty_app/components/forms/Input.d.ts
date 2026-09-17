import * as React from 'react';
/**
 * Text field. Focus presses the field into the page rather than glowing.
 * @startingPoint section="Forms" subtitle="Inputs, phone entry, selects, toggles" viewport="700x340"
 */
export interface InputProps {
  /** Uppercase eyebrow label above the field. */
  label?: string;
  hint?: string;
  /** Error text; also turns the border coral. */
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** When set to "password", an eye/eye-off toggle to reveal the value is rendered automatically. */
  type?: string;
  /** Static prefix inside the field, e.g. "+91" or "₹". */
  prefix?: string;
  icon?: string;
  /** Set for anything that behaves like data — phone numbers, PINs, amounts. */
  mono?: boolean;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
