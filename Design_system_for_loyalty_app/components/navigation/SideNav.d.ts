import * as React from 'react';
export interface SideNavItem { value: string; label: string; icon: string; }
/** Ink-filled 240px rail for the business and admin panels. Active item is a grape pill with a white outline. */
export interface SideNavProps {
  items?: SideNavItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** Wordmark text — no logo asset exists, so this renders as type. */
  brand?: string;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SideNav(props: SideNavProps): JSX.Element;
