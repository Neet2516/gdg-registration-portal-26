import React, { useState, useEffect, useRef } from 'react';
import { SpiderWeb } from './SpiderWeb';
import gsap from 'gsap';

interface GalleryCardProps {
  src: string;
  title: string;
  date: string;
  isLeft: boolean;
  seed: number;
  onRevealStart?: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  src,
  title,
  date,
  isLeft,
  seed,
  onRevealStart,
}) => {
  const [inView, setInView] = useState(false);
  const [webActive, setWebActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for lazy loading the image source
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px' } // Pre-load when card is 600px from entering viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Listen to custom event or class addition to trigger web activation
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const handleReveal = () => {
      setWebActive(true);
      if (onRevealStart) onRevealStart();

      // Trigger the custom card reveal GSAP animation
      const img = imageRef.current;
      const shine = shineRef.current;
      const glow = glowRef.current;
      if (!img) return;

      const tl = gsap.timeline();

      // Reset image state for reveal
      gsap.set(img, { opacity: 0, filter: 'blur(12px)', scale: 0.9 });
      gsap.set(glow, { opacity: 0 });

      // Scale 0.9 -> 1.03 -> 1, Opacity 0 -> 1, Blur 12px -> 0
      tl.to(img, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
      })
      .to(img, {
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out',
      }, 0)
      .to(img, {
        scale: 1.0,
        duration: 0.4,
        ease: 'power2.inOut',
      }, 0.4)
      .to(glow, {
        opacity: 0.35,
        duration: 0.6,
        ease: 'power2.out',
      }, 0.2);

      // Trigger shine sweep across web and frame
      if (shine) {
        gsap.set(shine, { left: '-100%', opacity: 1 });
        tl.to(shine, {
          left: '200%',
          duration: 0.9,
          ease: 'power3.inOut',
        }, 0.5);
      }
    };

    // We can trigger this reveal by adding the class 'is-revealed'
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          cardEl.classList.contains('is-revealed') &&
          !webActive
        ) {
          handleReveal();
        }
      });
    });

    observer.observe(cardEl, { attributes: true });
    return () => observer.disconnect();
  }, [webActive, onRevealStart]);

  // Hover Physics: Image lifts, glow increases, web tightens (desktop only)
  const handleMouseEnter = () => {
    // Check if device is desktop (coarse pointer means touch screen)
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsHovered(true);

    if (imageRef.current && glowRef.current && cardRef.current) {
      gsap.to(imageRef.current, {
        y: -8,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.05,
        filter: 'blur(20px)',
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(cardRef.current, {
        borderColor: 'rgba(255, 255, 255, 0.25)',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (imageRef.current && glowRef.current && cardRef.current) {
      gsap.to(imageRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });
      gsap.to(glowRef.current, {
        opacity: 0.35,
        scale: 1.0,
        filter: 'blur(15px)',
        duration: 0.5,
        ease: 'power2.inOut',
      });
      gsap.to(cardRef.current, {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full flex ${
        isLeft ? 'justify-end pr-8 md:pr-16 lg:pr-24' : 'justify-start pl-8 md:pl-16 lg:pl-24'
      } relative z-10 py-12 md:py-20`}
    >
      {/* Outer Floating Wrapper */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="gallery-card relative w-[88vw] sm:w-[70vw] md:w-[45vw] max-w-[620px] rounded-[24px] border border-white/10 bg-black/55 backdrop-blur-md p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-300 pointer-events-auto"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Ambient Back Glow */}
        <div
          ref={glowRef}
          className="absolute -inset-4 bg-radial from-white/10 to-transparent pointer-events-none opacity-0 mix-blend-screen z-0"
          style={{
            filter: 'blur(15px)',
            transition: 'opacity 0.5s ease',
            willChange: 'transform, opacity, filter',
          }}
        />

        {/* Dynamic Procedural Spider Web Layer */}
        <SpiderWeb active={webActive} seed={seed} isHovered={isHovered} />

        {/* Image Mask Frame */}
        <div className="relative w-full rounded-[18px] overflow-hidden bg-[#0a0a0c] z-10 aspect-video sm:aspect-auto">
          {inView ? (
            <img
              ref={imageRef}
              src={src}
              alt={title}
              className="card-image w-full h-full object-contain pointer-events-none opacity-0 select-none"
              style={{
                maxHeight: '420px',
                minHeight: '220px',
                filter: 'blur(12px)',
                transform: 'scale(0.9)',
                willChange: 'transform, filter, opacity',
              }}
            />
          ) : (
            <div className="w-full h-[280px] md:h-[380px] bg-zinc-950/80 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/10 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}

          {/* Shine Sweep Overlay */}
          <div
            ref={shineRef}
            className="card-shine absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-30 pointer-events-none opacity-0 z-30"
            style={{ willChange: 'left' }}
          />

          {/* Vignette Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10" />
        </div>

        {/* Caption Panel (Fades in along with Image Reveal) */}
        <div className="relative mt-4 px-2 z-10 flex justify-between items-end border-t border-white/5 pt-3">
          <div className="text-left">
            <span className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 font-mono block mb-1">GDG Memory</span>
            <h3 className="text-base md:text-lg font-bold font-oswald tracking-wide text-white uppercase text-shadow">
              {title}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs md:text-sm font-mono text-zinc-400 font-bold bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
              {date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
