import * as React from 'react';
/**
 * The milestone moment. Full-screen scrim, sun card popping in, falling confetti
 * shapes. One per unlock; it waits to be dismissed rather than auto-hiding.
 * @startingPoint section="Loyalty" subtitle="Milestone unlocked celebration" viewport="420x720"
 */
export interface CelebrationProps {
  open?: boolean;
  title?: string;
  subtitle?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
}
export declare function Celebration(props: CelebrationProps): JSX.Element | null;
