import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../components/sections/Hero';
import { Domains } from '../components/sections/Domains';
import { EvaluationPath } from '../components/sections/EvaluationPath';
import { FAQ } from '../components/sections/FAQ';
import { SpiderMemories } from '../components/sections/SpiderMemories';
import { RegistrationGateway } from '../components/sections/RegistrationGateway';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import { Loader } from '../components/Loader';
import { AnimatePresence, motion } from 'framer-motion';
import heroBackground from '../assets/images/hero-background.png';
import webRope from '../assets/images/web rope.png';
import gdgLogo from '../assets/images/gdg-logo.png';
import topLeftWeb from '../assets/images/top-left-web.png';
import topRightWeb from '../assets/images/top-right.png';

export const RecruitmentPortal = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = '';

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', () => {
      // Sync GSAP ScrollTrigger with Lenis scroll calculations
      ScrollTrigger.update();
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -80,
              transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 z-[9999]"
          >
            <Loader onComplete={() => setIsLoading(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full bg-[#000000] min-h-screen text-white font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
      {/* Viewport Corner Spiderwebs */}
      <div className="fixed -top-16 -left-12 w-24 h-24 sm:-top-24 sm:-left-18 sm:w-36 sm:h-36 md:-top-40 md:-left-30 md:w-124 md:h-124 rotate-270 pointer-events-none z-50">
        <img src={topLeftWeb} alt="Top Left Web" className="w-full h-full object-contain animate-web-glow-red" />
      </div>
      <div className="fixed -top-0 -right-8 w-24 h-24 sm:-top-0 sm:-right-12 sm:w-36 sm:h-36 md:-top-0 md:-right-20 md:w-124 md:h-124 rotate-270 pointer-events-none z-50">
        <img src={topRightWeb} alt="Top Right Web" className="w-full h-full object-contain animate-web-glow-blue" />
      </div>

      {/* Absolute background patterns */}
      <div className="absolute inset-0 dither-bg opacity-15 pointer-events-none z-0"></div>
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none z-0"></div>

      {/* Left and Right Margin Web Ropes running top-to-bottom */}
      <div 
        className="hidden sm:block absolute inset-y-0 left-2 md:left-6 w-4 pointer-events-none z-30 select-none opacity-25 bg-repeat-y bg-contain"
        style={{ backgroundImage: `url(${webRope})` }}
      ></div>
      <div 
        className="hidden sm:block absolute inset-y-0 right-2 md:right-6 w-4 pointer-events-none z-30 select-none opacity-25 bg-repeat-y bg-contain"
        style={{ backgroundImage: `url(${webRope})` }}
      ></div>

      {/* Hero Background Image with fade-out */}
      <div 
        className="absolute top-0 left-0 right-0 h-[100vh] bg-cover bg-center bg-norepeat opacity-90 pointer-events-none z-0"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black"></div>
      </div>

      {/* Retro CRT edge curvature overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-50"></div>

      {/* Sticky Glassmorphism Floating Header */}
      <header className="nav sticky top-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-5xl border border-[#71717A]/25 bg-black/75 backdrop-blur-md rounded-nav shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 select-none">
            <img src={gdgLogo} alt="GDG Logo" className="w-20 h-20 object-contain" />
            <span className="font-mono text-sm md:text-base font-bold tracking-widest text-white">
              GDG AKGEC
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-6 lg:gap-8 font-sans text-xs lg:text-sm tracking-widest uppercase">
            <a href="#hero" className="text-zinc-400 hover:text-white transition-colors duration-150">Home</a>
            <a href="#domains" className="text-zinc-400 hover:text-white transition-colors duration-150">Domains</a>
            <a href="#evaluation-path" className="text-zinc-400 hover:text-white transition-colors duration-150">Path</a>
            <a href="#spider-memories" className="text-zinc-400 hover:text-white transition-colors duration-150">Memories</a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors duration-150">FAQ</a>
            <a href="#registration-terminal" className="text-zinc-400 hover:text-white transition-colors duration-150">Register</a>
          </nav>

          <div>
            <a href="#registration-terminal">
              <Button
                variant="outline"
                className="py-2 px-5 text-xs md:text-sm tracking-widest border-zinc-700 hover:border-[#E11D48] text-white font-sans"
              >
                Apply Now
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 space-y-24 relative z-10">
        <Hero />
        <Domains />
        <EvaluationPath />
      </div>

      <SpiderMemories />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 space-y-24 relative z-10">
        <FAQ />
        <RegistrationGateway />
      </div>

      <Footer />
    </div>
    </>
  );
};
