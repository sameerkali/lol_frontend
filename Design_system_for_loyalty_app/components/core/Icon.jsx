import React from 'react';

/* Lucide via CDN. Renders a placeholder <i> that lucide.createIcons() swaps for an SVG. */
export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 2.25, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const draw = () => window.lucide && window.lucide.createIcons({ nameAttr: 'data-lucide' });
    draw();
    const t = setTimeout(draw, 250);
    return () => clearTimeout(t);
  }, [name]);
  return (
    <i
      ref={ref}
      data-lucide={name}
      style={{
        display: 'inline-flex', width: size, height: size, color,
        flex: '0 0 auto', ...style,
      }}
      data-stroke={strokeWidth}
    />
  );
}
