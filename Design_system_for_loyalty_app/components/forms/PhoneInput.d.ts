import * as React from 'react';
/** Phone entry — the ONLY way a customer is looked up. Never offer name search. */
export interface PhoneInputProps {
  value?: string;
  onChange?: (digits: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  dialCode?: string;
}
export declare function PhoneInput(props: PhoneInputProps): JSX.Element;
