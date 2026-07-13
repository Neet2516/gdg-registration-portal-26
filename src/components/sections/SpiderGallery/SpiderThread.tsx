import { forwardRef, useMemo } from 'react';

interface SpiderThreadProps {
  spiderX: number; // Spider X offset from center line
  spiderY: number; // Spider Y coordinate relative to viewport
  centerX?: number; // Center coordinate of thread (default 0)
}

export const SpiderThread = forwardRef<SVGSVGElement, SpiderThreadProps>(({
  spiderX,
  spiderY,
  centerX = 0,
}, ref) => {
  // Compute the organic trailing Bezier curve coordinates
  const pathD = useMemo(() => {
    const startX = centerX;
    const startY = 0;
    const endX = centerX + spiderX;
    const endY = spiderY;

    // Smooth control point for physics sag
    const controlX = centerX + spiderX * 0.45;
    const controlY = startY + (endY - startY) * 0.65;

    return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  }, [spiderX, spiderY, centerX]);

  return (
    <svg
      ref={ref}
      className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-20"
      style={{
        overflow: 'visible',
      }}
    >
      <defs>
        {/* Glow filter for premium silk material finish */}
        <filter id="silk-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main silk thread path */}
      <path
        className="thread-path"
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="1.2"
        strokeDasharray="2, 1" // Gives a subtle fiber texture
        filter="url(#silk-glow)"
        style={{
          willChange: 'd',
        }}
      />

      {/* Secondary stronger core thread path */}
      <path
        className="thread-core"
        d={pathD}
        fill="none"
        stroke="rgba(255, 255, 255, 0.75)"
        strokeWidth="0.6"
        style={{
          willChange: 'd',
        }}
      />
    </svg>
  );
});

SpiderThread.displayName = 'SpiderThread';
