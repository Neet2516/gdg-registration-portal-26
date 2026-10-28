import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  life: number;
  decay: number;
  shape: 'star4' | 'diamond' | 'cross';
}

const PALETTE = [
  '#F2C35B', // Warm Yellow
  '#DE432C', // Coral Red
  '#55A8A8', // Mint Teal
  '#387A5B', // Forest Green
  '#3168E0', // Electric Blue
  '#FFFFFF', // Pure White
];

// Draw a 4-point concave star (classic ✦ sparkle)
function drawConcaveStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  rotation: number,
  color: string,
  shadow = true
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  if (shadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowOffsetX = 1.5;
    ctx.shadowOffsetY = 1.5;
    ctx.shadowBlur = 3;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const nextAngle = ((i + 1) * Math.PI) / 2;
    if (i === 0) {
      ctx.moveTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
    } else {
      ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
    }
    // Pull the mid curves toward center (0,0) with high concavity
    ctx.quadraticCurveTo(0, 0, Math.cos(nextAngle) * outerR, Math.sin(nextAngle) * outerR);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw a diamond 4-point star (✧)
function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rotation: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.lineTo(size * 0.35, 0);
  ctx.lineTo(0, size);
  ctx.lineTo(-size * 0.35, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Draw a cross spark (+)
function drawCross(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  rotation: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.25);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-size, 0);
  ctx.lineTo(size, 0);
  ctx.moveTo(0, -size);
  ctx.lineTo(0, size);
  ctx.stroke();
  ctx.restore();
}

export function SparkleCursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on devices with fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply custom cursor class to body
    document.body.classList.add('sparkle-cursor-active');

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: -100,
      y: -100,
      prevX: -100,
      prevY: -100,
      visible: false,
      isHovering: false,
      leadRotation: 0,
      targetLeadRotation: 0,
    };

    const particles: Particle[] = [];

    const spawnSparkle = (x: number, y: number, burst = false) => {
      const shapes: Particle['shape'][] = ['star4', 'star4', 'diamond', 'cross'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      
      const speed = burst ? Math.random() * 4 + 1.5 : Math.random() * 1.5 + 0.3;
      const angle = Math.random() * Math.PI * 2;

      particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 0.5 : 0.8), // subtle upward buoyancy
        size: burst ? Math.random() * 10 + 6 : Math.random() * 7 + 4,
        color,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.15,
        life: 1,
        decay: burst ? Math.random() * 0.03 + 0.02 : Math.random() * 0.04 + 0.025,
        shape,
      });

      // Cap particles for peak 60fps performance
      if (particles.length > 90) {
        particles.shift();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.visible = true;
      const newX = e.clientX;
      const newY = e.clientY;

      if (mouse.x > 0 && mouse.y > 0) {
        const dist = Math.hypot(newX - mouse.x, newY - mouse.y);
        // Spawn 1-2 sparkles when moving fast enough
        if (dist >= 6) {
          const count = Math.min(3, Math.floor(dist / 8) + 1);
          for (let i = 0; i < count; i++) {
            spawnSparkle(
              mouse.x + (newX - mouse.x) * (i / count),
              mouse.y + (newY - mouse.y) * (i / count)
            );
          }
        }
      }

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = newX;
      mouse.y = newY;

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer')
        );
        mouse.isHovering = isClickable;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Click burst: 12 radiant sparkles
      for (let i = 0; i < 12; i++) {
        spawnSparkle(e.clientX, e.clientY, true);
      }
    };

    const handleMouseLeave = () => {
      mouse.visible = false;
    };

    const handleMouseEnter = () => {
      mouse.visible = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and render trail particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // subtle gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = Math.max(0, p.life);
        const currentSize = p.size * p.life;

        if (p.shape === 'star4') {
          drawConcaveStar(ctx, p.x, p.y, currentSize, p.rotation, p.color, false);
        } else if (p.shape === 'diamond') {
          drawDiamond(ctx, p.x, p.y, currentSize, p.rotation, p.color);
        } else {
          drawCross(ctx, p.x, p.y, currentSize, p.rotation, p.color);
        }
      }

      ctx.globalAlpha = 1;

      // Draw the main lead cursor sparkle
      if (mouse.visible && mouse.x >= 0 && mouse.y >= 0) {
        // Spin speed depends on hover
        mouse.leadRotation += mouse.isHovering ? 0.08 : 0.025;
        const leadSize = mouse.isHovering ? 15 : 11;
        const leadColor = mouse.isHovering ? '#F2C35B' : '#FFFFFF';

        // Outer glow on hover
        if (mouse.isHovering) {
          ctx.save();
          ctx.shadowColor = '#F2C35B';
          ctx.shadowBlur = 12;
          drawConcaveStar(ctx, mouse.x, mouse.y, leadSize * 1.3, -mouse.leadRotation * 0.7, '#DE432C', false);
          ctx.restore();
        }

        // Main Sparkle Cursor
        drawConcaveStar(ctx, mouse.x, mouse.y, leadSize, mouse.leadRotation, leadColor, true);

        // Core tiny center diamond
        drawDiamond(ctx, mouse.x, mouse.y, leadSize * 0.35, -mouse.leadRotation * 2, '#DE432C');
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      document.body.classList.remove('sparkle-cursor-active');
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <style>{`
        /* Hide default arrow cursor when sparkle cursor is active */
        body.sparkle-cursor-active,
        body.sparkle-cursor-active * {
          cursor: none !important;
        }
      `}</style>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[99999] select-none"
      />
    </>
  );
}
