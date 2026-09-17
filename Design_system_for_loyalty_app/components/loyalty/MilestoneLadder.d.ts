import * as React from 'react';
export interface Milestone {
  /** Visit or point count at which this reward unlocks. */
  count: number;
  /** Business-authored label, e.g. "Free coffee" or "20% off". */
  label: string;
  type?: 'free-item' | 'percent-off' | 'flat-off' | 'custom';
}
/**
 * The full reward ladder. Businesses add any number of milestones; the customer
 * always sees the whole ladder, not just the next step.
 * @startingPoint section="Loyalty" subtitle="Reward ladder with earned / next states" viewport="700x400"
 */
export interface MilestoneLadderProps {
  milestones?: Milestone[];
  /** Current visit or point count. */
  current?: number;
  compact?: boolean;
}
export declare function MilestoneLadder(props: MilestoneLadderProps): JSX.Element;
