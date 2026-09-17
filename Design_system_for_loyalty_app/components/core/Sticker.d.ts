import * as React from 'react';
/** Decorative rotated sticker for hero moments and celebration confetti. Never carries a required action. */
export interface StickerProps {
  children?: React.ReactNode;
  color?: string;
  shape?: 'circle' | 'pill' | 'squircle';
  size?: number;
  /** Rotation in degrees. Stickers are always off-axis. */
  tilt?: number;
  /** Run the lol-pop-in entrance. */
  pop?: boolean;
  style?: React.CSSProperties;
}
export declare function Sticker(props: StickerProps): JSX.Element;
