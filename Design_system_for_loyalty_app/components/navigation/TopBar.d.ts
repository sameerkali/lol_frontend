import * as React from 'react';
/**
 * Branded header on the customer page. `tone` is the ONLY place the business's
 * chosen accent colour is applied at full bleed.
 */
export interface TopBarProps {
  title?: string;
  subtitle?: string;
  /** Business logo node (they upload it; max 2 MB). Falls back to nothing — never a drawn mark. */
  logo?: React.ReactNode;
  right?: React.ReactNode;
  tone?: string;
  style?: React.CSSProperties;
}
export declare function TopBar(props: TopBarProps): JSX.Element;
