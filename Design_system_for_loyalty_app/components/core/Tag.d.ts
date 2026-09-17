import * as React from 'react';
/** Selectable / removable chip. Selected state presses INTO the page (inverted + pop-pressed). */
export interface TagProps {
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
