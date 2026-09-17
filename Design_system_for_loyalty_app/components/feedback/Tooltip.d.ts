import * as React from 'react';
/** Hover hint for icon-only controls in the business and admin panels. Never load-bearing on mobile. */
export interface TooltipProps {
  label: string;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom';
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
