import * as React from 'react';
/**
 * The stamp card itself. Filled stamps are grape; milestone stamps are sun;
 * the next slot is mint; unearned slots are dashed and numbered.
 * @startingPoint section="Loyalty" subtitle="The digital stamp card" viewport="700x260"
 */
export interface StampGridProps {
  /** Total stamps on the current card (the business's target). */
  total?: number;
  /** How many are earned. */
  filled?: number;
  /** 1-based positions that carry a reward, e.g. [5, 10]. */
  milestones?: number[];
  /** Lucide glyph inside a filled stamp — the business's choice. */
  glyph?: string;
  columns?: number;
  size?: number;
  /** Previous filled count; stamps above it play the lol-pop-in landing. */
  animateFrom?: number | null;
}
export declare function StampGrid(props: StampGridProps): JSX.Element;
