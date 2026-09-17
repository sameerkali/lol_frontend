import * as React from 'react';
/**
 * Lucide icon wrapper. Icons are ink by default and 24px; 20px in dense rows.
 */
export interface IconProps {
  /** Lucide icon name, e.g. "coffee", "qr-code", "check". */
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
