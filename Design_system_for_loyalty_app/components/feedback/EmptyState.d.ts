import * as React from 'react';
/** Dashed-border empty region. Copy states what to do next, never "No data available". */
export interface EmptyStateProps {
  icon?: string;
  title?: string;
  body?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
