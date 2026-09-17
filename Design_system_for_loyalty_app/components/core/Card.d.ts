import * as React from 'react';
/**
 * The default container: white fill, 3px ink border, 24px radius, hard offset shadow.
 * @startingPoint section="Core" subtitle="Card tones, elevations and tilt" viewport="700x300"
 */
export interface CardProps {
  children?: React.ReactNode;
  /** Fill tone. `sunk` drops the shadow for nested/inset regions. */
  tone?: 'paper' | 'sunk' | 'grape' | 'mint' | 'sun' | 'coral' | 'invert';
  pad?: number;
  /** Small rotation in degrees for the sticker/scrapbook effect. Keep under 3. */
  tilt?: number;
  elevation?: 0 | 1 | 2 | 3;
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
