import * as React from 'react';
/** On/off setting row. Mint when on. Every switch carries a `hint` stating what changes. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  /** One line describing the consequence, e.g. "Staff will be asked for a bill total." */
  hint?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
