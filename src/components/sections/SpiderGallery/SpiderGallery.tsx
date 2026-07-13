import React, { useRef, useEffect } from 'react';
import { GalleryCard } from './GalleryCard';
import { Spider } from './Spider';
import { SpiderThread } from './SpiderThread';
import { useSpiderAnimation } from '../../../hooks/useSpiderAnimation';

// Import all 10 existing images from gdg-last-glimpses
import img1 from '../../../assets/images/gdg-last-glimpses/DSC04065.jpg';
import img2 from '../../../assets/images/gdg-last-glimpses/DSC04127.jpg';
import img3 from '../../../assets/images/gdg-last-glimpses/DSC04282.jpg';
import img4 from '../../../assets/images/gdg-last-glimpses/DSC04294.jpg';
import img5 from '../../../assets/images/gdg-last-glimpses/DSC04415.jpg';
import img6 from '../../../assets/images/gdg-last-glimpses/DSC04436.jpg';
import img7 from '../../../assets/images/gdg-last-glimpses/DSC04444.jpg';
import img8 from '../../../assets/images/gdg-last-glimpses/DSC04447.jpg';
import img9 from '../../../assets/images/gdg-last-glimpses/DSC04498.jpg';
import img10 from '../../../assets/images/gdg-last-glimpses/DSC04507.jpg';

interface MemoryItem {
  src: string;
  title: string;
  date: string;
}

const MEMORIES: MemoryItem[] = [
  { src: img1, title: 'DevFest Keynote Inauguration', date: 'OCT 2024' },
  { src: img2, title: 'Cloud Study Jam Session', date: 'NOV 2024' },
  { src: img3, title: 'Android Camp Build Lab', date: 'DEC 2024' },
  { src: img4, title: 'WebDev Bootcamp Challenge', date: 'JAN 2025' },
  { src: img5, title: 'Flutter Forward Hackathon', date: 'FEB 2025' },
  { src: img6, title: 'TensorFlow ML workshop', date: 'MAR 2025' },
  { src: img7, title: 'Google I/O Extended Meetup', date: 'MAY 2025' },
  { src: img8, title: 'Generative AI Sprint', date: 'JUN 2025' },
  { src: img9, title: 'UI/UX Interactive Design Sprint', date: 'JUL 2025' },
  { src: img10, title: 'Open Source Days Summit', date: 'AUG 2025' },
  { src: img1, title: 'Kubernetes Hands-on Workshop', date: 'SEP 2025' },
  { src: img2, title: 'Tech Career Mentorship Panel', date: 'OCT 2025' },
  { src: img3, title: 'Women Techmakers Meet', date: 'NOV 2025' },
  { src: img4, title: 'Solution Challenge Pitch Day', date: 'DEC 2025' },
  { src: img5, title: 'Proximity Networking Mixer', date: 'JAN 2026' },
];

export const SpiderGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const spiderRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGSVGElement>(null);
  const silkShooterRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hook handles ScrollTrigger timelines, motions paths, reveals, and shooter cords
  useSpiderAnimation({
    containerRef,
    trackRef,
    spiderRef,
    threadRef,
    silkShooterRef,
    cardsCount: MEMORIES.length,
  });

  // Canvas particle background logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dust particles definition
    const dustParticles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      angle: number;
      speed: number;
    }[] = [];

    // Create 45 dust particles
    for (let i = 0; i < 45; i++) {
      const baseAlpha = 0.15 + Math.random() * 0.25;
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.05 - Math.random() * 0.15, // Drift slowly upward
        radius: 0.7 + Math.random() * 1.3,
        alpha: baseAlpha,
        baseAlpha,
        angle: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      });
    }

    // Drifting silk fibers definition
    const silkFibers: {
      x: number;
      y: number;
      length: number;
      angle: number;
      spinSpeed: number;
      driftSpeed: number;
      amplitude: number;
      frequency: number;
    }[] = [];

    // Create 5 silk strands
    for (let i = 0; i < 5; i++) {
      silkFibers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 40 + Math.random() * 60,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.003,
        driftSpeed: 0.15 + Math.random() * 0.25,
        amplitude: 2 + Math.random() * 4,
        frequency: 0.005 + Math.random() * 0.005,
      });
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient fog haze
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      gradient.addColorStop(0, 'rgba(10, 10, 15, 0.3)');
      gradient.addColorStop(0.5, 'rgba(5, 5, 8, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Dust particles
      dustParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.speed;
        p.alpha = p.baseAlpha + Math.sin(p.angle) * 0.1; // Gentle flicker

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
      });

      // Reset shadows for lines
      ctx.shadowBlur = 0;

      // 3. Draw drifting silk strands
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 0.5;
      
      silkFibers.forEach((f) => {
        f.x -= f.driftSpeed;
        f.y += Math.sin(time * f.frequency) * 0.15;
        f.angle += f.spinSpeed;

        if (f.x < -100) f.x = width + 100;
        if (f.y < -100) f.y = height + 100;
        if (f.y > height + 100) f.y = -100;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);

        // Draw a wavy silk fiber line
        ctx.beginPath();
        ctx.moveTo(-f.length / 2, 0);
        for (let x = -f.length / 2; x <= f.length / 2; x += 5) {
          const y = Math.sin(x * 0.1 + time * 0.002) * f.amplitude;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="spider-memories"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#030305] overflow-hidden"
    >
      {/* 1. Atmospheric Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 2. Pinned Interactive Camera Wrapper */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10 select-none">
        
        {/* Gallery Section Headers (Stays pinned at top during initial transition) */}
        <div className="absolute top-20 left-0 w-full text-center z-10 select-none">
          <h2 className="title-spiderman text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider mb-2 select-none uppercase">
            SPIDER MEMORIES
          </h2>
          <p className="subtitle-spiderman text-[10px] sm:text-xs text-zinc-500 tracking-[0.35em] uppercase select-none">
            Retracing GDG AKGEC Memories & Footprints
          </p>
        </div>

        {/* Dynamic Trailing Thread (attached to spider) */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full z-20">
          <SpiderThread
            ref={threadRef}
            spiderX={0}
            spiderY={0}
          />
        </div>

        {/* Silk Shooter Web Projectiles layer */}
        <svg
          ref={silkShooterRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible"
        />

        {/* Pinned Spider Crawler */}
        <Spider ref={spiderRef} />
      </div>

      {/* 3. Scrolling Memories Track */}
      <div
        ref={trackRef}
        className="relative w-full max-w-5xl mx-auto z-20 flex flex-col pointer-events-none select-none"
        style={{
          paddingTop: '65vh', // Spacing for initial entry scroll
          paddingBottom: '80vh',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {MEMORIES.map((m, idx) => (
          <GalleryCard
            key={`memory-${idx}`}
            src={m.src}
            title={m.title}
            date={m.date}
            isLeft={idx % 2 === 0}
            seed={1337 + idx * 42} // Seed for consistent randomized webs per card
          />
        ))}
      </div>
    </section>
  );
};
