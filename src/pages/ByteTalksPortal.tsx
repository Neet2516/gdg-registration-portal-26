import { useState, useEffect } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  EventHeader,
  EventHero,
  EventInfoBar,
  StatsBar,
  AboutSection,
  SpeakersSection,
  VoicesSection,
  FAQSection,
  RegistrationSection,
  EventFooter,
  FloatingSparkles,
  ByteTalksLoader,
} from '../components/byte-talks';

export function ByteTalksPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion || isLoading) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global interceptor for smooth anchor jumps
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetId = href.slice(1);
        const targetEl =
          targetId === 'register'
            ? (document.getElementById('registration-form') || document.getElementById('register'))
            : (document.getElementById(targetId) || (targetId === 'voices' ? document.getElementById('community') : null));

        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -40, duration: 1.15 });

          try {
            window.history.pushState(null, '', href);
          } catch {
            // ignore in sandboxed environments
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, [shouldReduceMotion, isLoading]);

  // Fallback anchor click handler when motion is reduced (Lenis disabled)
  useEffect(() => {
    if (!shouldReduceMotion || isLoading) return;

    const handleFallbackAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const targetId = href.slice(1);
        const targetEl =
          targetId === 'register'
            ? (document.getElementById('registration-form') || document.getElementById('register'))
            : (document.getElementById(targetId) || (targetId === 'voices' ? document.getElementById('community') : null));

        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          try {
            window.history.pushState(null, '', href);
          } catch {
            // ignore
          }
        }
      }
    };

    document.addEventListener('click', handleFallbackAnchorClick);
    return () => {
      document.removeEventListener('click', handleFallbackAnchorClick);
    };
  }, [shouldReduceMotion, isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <ByteTalksLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <main className="min-h-screen overflow-hidden bg-[#1B1F27] font-mono text-white selection:bg-[#de432c] selection:text-white relative">
        {/* Ambient Random Top-to-Bottom Floating Sparkles */}
        <FloatingSparkles />

      <a className="fixed left-3 top-3 z-[100] -translate-y-[160%] bg-[#1c242b] px-4 py-3 text-white focus:translate-y-0" href="#main-content">
        Skip to content
      </a>
      
      {/* Top Hero & Header Container with Mint Teal Grid */}
      <div className="relative overflow-x-clip bg-[#B4DDD7]">
        {/* Continuous Graph Grid across the entire upper section */}
        <div 
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(#1c242b1a_1px,transparent_1px),linear-gradient(90deg,#1c242b1a_1px,transparent_1px)] bg-[size:38px_38px]" 
          aria-hidden="true" 
        />
        
        <EventHeader />
        <EventHero />
      </div>

      {/* Event Info Bar & Stats Strip */}
      <EventInfoBar />
      <StatsBar />

      <div id="main-content">
        <AboutSection />
        <SpeakersSection />
        <VoicesSection />
        <FAQSection />
        <RegistrationSection />
      </div>
      <EventFooter />
    </main>
  </>
  );
}
