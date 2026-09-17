import * as React from 'react';
/** Segmented in-page switch. For top-level product areas use SideNav or BottomBar. */
export interface TabsProps {
  tabs?: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
