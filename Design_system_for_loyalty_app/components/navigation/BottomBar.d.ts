import * as React from 'react';
export interface BottomBarItem { value: string; label: string; icon: string; }
/** Mobile bottom navigation for the customer page. Icons always carry a label. */
export interface BottomBarProps {
  items?: BottomBarItem[];
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}
export declare function BottomBar(props: BottomBarProps): JSX.Element;
