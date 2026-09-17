import * as React from 'react';
/**
 * An unlocked or redeemed reward. Redeeming ALWAYS requires the business PIN —
 * `onRedeem` should open the PinPad, never mark the reward directly.
 */
export interface RewardCardProps {
  title: string;
  /** Small print, e.g. "Unlocked 12 Aug · valid at this outlet". */
  detail?: string;
  state?: 'unlocked' | 'redeemed';
  onRedeem?: () => void;
  /** Play the one-off shine sweep — celebration moment only. */
  shine?: boolean;
  style?: React.CSSProperties;
}
export declare function RewardCard(props: RewardCardProps): JSX.Element;
