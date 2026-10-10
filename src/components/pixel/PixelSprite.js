import React, { memo } from "react";

// Renders a sprite from sprites.js as crisp SVG squares. `scale` is the size
// in CSS pixels of one sprite pixel. `classes` maps a palette key to a CSS
// class, so parts of a sprite can be animated (e.g. glowing eyes).
function PixelSprite({ sprite, scale = 4, classes = {}, className, title }) {
  const width = sprite.rows[0].length;
  const height = sprite.rows.length;
  return (
    <svg
      className={className}
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {sprite.rows.flatMap((row, y) =>
        [...row].map((key, x) =>
          key === "." ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={sprite.palette[key]} className={classes[key]} />
          )
        )
      )}
    </svg>
  );
}

export default memo(PixelSprite);
