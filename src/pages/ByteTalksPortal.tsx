import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
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
  LazySection,
} from '../components/byte-talks';

export function ByteTalksPortal() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Global interceptor for smooth anchor jumps with lazy loading support
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const targetId = href.slice(1);

        // Notify lazy sections to hydrate immediately before scrolling
        window.dispatchEvent(new CustomEvent('lazy-load-target', { detail: href }));

        const scrollToTarget = () => {
          const element = document.getElementById(targetId);
          if (element) {
            lenis.scrollTo(element, { offset: -30, duration: 1.2 });
          }
        };

        requestAnimationFrame(() => {
          scrollToTarget();
          setTimeout(scrollToTarget, 50);
        });
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#1B1F27] font-mono text-white selection:bg-[#de432c] selection:text-white">
      <a className="fixed left-3 top-3 z-[100] -translate-y-[160%] bg-[#1c242b] px-4 py-3 text-white focus:translate-y-0" href="#main-content">
        Skip to content
      </a>
      
      {/* Top Hero & Header Container with Mint Teal Grid & Bottom Dark Divide */}
      <div className="relative overflow-hidden bg-[#B4DDD7]">
        {/* Continuous Graph Grid across the entire upper section */}
        <div 
          className="pointer-events-none absolute inset-x-0 top-0 bottom-[200px] md:bottom-[260px] lg:bottom-[320px] bg-[linear-gradient(#1c242b1a_1px,transparent_1px),linear-gradient(90deg,#1c242b1a_1px,transparent_1px)] bg-[size:38px_38px]" 
          aria-hidden="true" 
        />
        {/* Crisp Dark Canvas starting right behind the campus sticker */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] md:h-[260px] lg:h-[320px] bg-[#1B1F27] border-t border-white/10" 
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
        <LazySection id="speakers" minHeight="580px">
          <SpeakersSection />
        </LazySection>
        <LazySection id="voices" minHeight="450px">
          <VoicesSection />
        </LazySection>
        <LazySection id="faq" minHeight="450px">
          <FAQSection />
        </LazySection>
        <LazySection id="register" minHeight="650px">
          <RegistrationSection />
        </LazySection>
      </div>
      <EventFooter />
    </main>
  );
}
