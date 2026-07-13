import React, { useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface SpiderWebProps {
  active: boolean;
  width?: number;
  height?: number;
  seed: number;
  isHovered?: boolean;
}

export const SpiderWeb: React.FC<SpiderWebProps> = ({
  active,
  width = 650,
  height = 450,
  seed,
  isHovered = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const webGroupRef = useRef<SVGGElement>(null);

  // Generate a distinct procedural web based on the seed
  const webData = useMemo(() => {
    let s = seed;
    // LCG pseudo-random number generator for deterministic randomness per card
    const random = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };

    // Center hub of the web (randomized near the card center)
    const cx = width * (0.4 + random() * 0.2);
    const cy = height * (0.4 + random() * 0.2);

    // Anchor points along the frame boundary
    const anchors: { x: number; y: number }[] = [];
    const numRadials = 8 + Math.floor(random() * 4); // 8 to 11 strands

    for (let i = 0; i < numRadials; i++) {
      const angle = (i / numRadials) * Math.PI * 2 + (random() - 0.5) * 0.15;
      
      // Project the angle to the rectangle boundary
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const tX = cos > 0 ? (width - cx) / cos : -cx / cos;
      const tY = sin > 0 ? (height - cy) / sin : -cy / sin;
      const t = Math.min(tX, tY);

      const x = cx + cos * t;
      const y = cy + sin * t;

      anchors.push({ x, y });
    }

    // Radial paths stretching from center to borders
    const radials = anchors.map((anchor) => ({
      x1: cx,
      y1: cy,
      x2: anchor.x,
      y2: anchor.y,
      length: Math.hypot(anchor.x - cx, anchor.y - cy),
    }));

    // Concentric spiral rings connecting the radial paths
    const numRings = 5 + Math.floor(random() * 3); // 5 to 7 rings
    const rings: { d: string; length: number }[] = [];

    for (let r = 1; r <= numRings; r++) {
      const t = r / (numRings + 1); // Radial spacing ratio
      let pathD = '';
      let totalSegmentLength = 0;

      for (let i = 0; i <= numRadials; i++) {
        const idx = i % numRadials;
        const nextIdx = (i + 1) % numRadials;

        const p1 = {
          x: cx + (anchors[idx].x - cx) * t,
          y: cy + (anchors[idx].y - cy) * t,
        };
        const p2 = {
          x: cx + (anchors[nextIdx].x - cx) * t,
          y: cy + (anchors[nextIdx].y - cy) * t,
        };

        // Midpoint and control point pulled towards the hub to simulate gravitational sag (catenary curve)
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const sagFactor = 0.12 + random() * 0.08;
        const ctrlX = midX + (cx - midX) * sagFactor;
        const ctrlY = midY + (cy - midY) * sagFactor;

        if (i === 0) {
          pathD += `M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`;
        } else {
          pathD += ` Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`;
        }

        totalSegmentLength += Math.hypot(p2.x - p1.x, p2.y - p1.y);
      }
      
      rings.push({
        d: pathD,
        length: totalSegmentLength,
      });
    }

    return {
      cx,
      cy,
      radials,
      rings,
      strokeWidth: 0.6 + random() * 0.8,
    };
  }, [width, height, seed]);

  // Handle draw-in animation when active becomes true
  useEffect(() => {
    if (!active || !svgRef.current) return;

    const radials = svgRef.current.querySelectorAll('.web-radial');
    const rings = svgRef.current.querySelectorAll('.web-ring');

    const tl = gsap.timeline();

    // Reset styles for drawing
    gsap.set(radials, { strokeDashoffset: (i) => webData.radials[i].length, opacity: 0 });
    gsap.set(rings, { strokeDashoffset: (i) => webData.rings[i].length, opacity: 0 });

    // 1. Draw radial strands from center outward
    tl.to(radials, {
      strokeDashoffset: 0,
      opacity: 0.7,
      duration: 0.5,
      stagger: 0.04,
      ease: 'power2.out',
    });

    // 2. Draw rings starting slightly after radial strands
    tl.to(rings, {
      strokeDashoffset: 0,
      opacity: 0.5,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power1.out',
    }, '-=0.2');

    // 3. Web impact glow shine
    tl.to(svgRef.current, {
      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.85)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))',
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    }, '-=0.3');

  }, [active, webData]);

  // Handle hover tightening effect (desktop only)
  useEffect(() => {
    if (!active || !webGroupRef.current) return;

    if (isHovered) {
      // Pull the web hub slightly tighter (scale down toward center + shift)
      gsap.to(webGroupRef.current, {
        scale: 0.96,
        transformOrigin: `${webData.cx}px ${webData.cy}px`,
        opacity: 0.9,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      gsap.to(webGroupRef.current, {
        scale: 1,
        transformOrigin: `${webData.cx}px ${webData.cy}px`,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  }, [isHovered, active, webData]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-20"
      style={{
        filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.15))',
        willChange: 'filter',
      }}
    >
      <g ref={webGroupRef}>
        {/* Radial Strands */}
        {webData.radials.map((r, idx) => (
          <line
            key={`radial-${idx}`}
            className="web-radial"
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth={webData.strokeWidth}
            strokeDasharray={r.length}
            strokeDashoffset={r.length}
            strokeLinecap="round"
          />
        ))}

        {/* Concentric Rings */}
        {webData.rings.map((ring, idx) => (
          <path
            key={`ring-${idx}`}
            className="web-ring"
            d={ring.d}
            fill="none"
            stroke="rgba(255, 255, 255, 0.55)"
            strokeWidth={webData.strokeWidth * 0.75}
            strokeDasharray={ring.length}
            strokeDashoffset={ring.length}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
};
