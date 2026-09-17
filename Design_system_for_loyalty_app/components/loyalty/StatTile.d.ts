import * as React from 'react';
/**
 * A dashboard figure. Numerals are mono — this is what keeps the business panel
 * feeling like data rather than a poster.
 * @startingPoint section="Loyalty" subtitle="Dashboard stat tiles" viewport="700x180"
 */
export interface StatTileProps {
  label: string;
  value: string | number;
  /** Signed change string, e.g. "+18% vs last month". Leading + renders mint, - renders coral. */
  delta?: string;
  icon?: string;
  tone?: 'paper' | 'grape' | 'mint' | 'sun' | 'coral' | 'sky';
  style?: React.CSSProperties;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
