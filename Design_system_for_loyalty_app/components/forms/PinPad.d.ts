import * as React from 'react';
/**
 * Business PIN entry. Required for every redemption, and for check-in when the
 * business runs in PIN mode. There is one PIN per business — never staff accounts.
 * @startingPoint section="Loyalty" subtitle="Business PIN confirmation pad" viewport="700x520"
 */
export interface PinPadProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  title?: string;
  subtitle?: string;
}
export declare function PinPad(props: PinPadProps): JSX.Element;
