import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import campusIllustration from '../../assets/images/byte-talks/raw-05.png';
import compassIllustration from '../../assets/images/byte-talks/compass.svg';
import { getEventCountdown, useLiveCountdown } from './types';

export function EventHero() {
  const countdown = useMemo(getEventCountdown, []);
  const timeLeft = useLiveCountdown();
  const shouldReduceMotion = useReducedMotion();

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' as const },
    },
  };

  return (
    <section 
      className="relative isolate overflow-hidden text-[#1c242b]" 
      id="home" 
      aria-labelledby="bt-title"
    >
      <div className="relative mx-auto w-[min(1320px,calc(100%-48px))] pt-5 md:pt-9 max-sm:w-[calc(100%-32px)]">
        {/* Two-column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] items-start gap-8 lg:gap-10">
          {/* Left Column */}
          <motion.div 
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20"
          >
            {/* Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5">
              <span className="badge-3d-red px-2.5 py-0.5 font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-wider text-white inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                REGISTRATION OPEN
              </span>
              <span className="badge-3d-blue px-2.5 py-0.5 font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-wider text-white">
                AKGEC • GHAZIABAD
              </span>
            </motion.div>

            {/* Giant 3D Typography */}
            <h1 id="bt-title" className="mt-4 mb-2 flex flex-col font-display font-black leading-[0.82] uppercase select-none">
              <motion.span 
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="hero-3d-red text-[clamp(4.8rem,11.2vw,9.4rem)] tracking-tight block"
              >
                BYTE
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hero-3d-yellow text-[clamp(4.8rem,11.2vw,9.4rem)] tracking-tight -mt-2 md:-mt-3 block"
              >
                TALKS
              </motion.span>
              <motion.div 
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28, type: 'spring', stiffness: 200, damping: 16 }}
                className="hero-2026-box px-6 py-1.5 md:px-7 md:py-2 mt-3 md:mt-4 w-fit"
              >
                <span className="text-white text-[clamp(2.8rem,6.8vw,5.5rem)] font-display font-black leading-none tracking-tight block">
                  2026
                </span>
              </motion.div>
            </h1>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="my-5 font-mono font-bold text-[1.25rem] md:text-[1.4rem] text-[#1c242b] leading-snug">
              <p className="m-0">Learn · Connect · Inspire</p>
              <p className="m-0 mt-0.5 text-xs font-semibold tracking-wider uppercase text-[#1c242b]/70">The premier technical forum at AKGEC Ghaziabad.</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="relative z-30 flex flex-wrap items-center gap-4 pt-1 mb-8 pointer-events-auto">
              <motion.a 
                id="hero-register-btn"
                href="#register" 
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                className="btn-3d-red inline-flex items-center gap-3 px-6 py-3.5 font-mono text-[0.84rem] font-bold uppercase tracking-wider no-underline cursor-pointer select-none"
              >
                <span>REGISTER NOW</span>
                <span className="text-base leading-none" aria-hidden="true">→</span>
              </motion.a>
              <motion.a 
                href="#about" 
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                className="btn-3d-white inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[0.84rem] font-bold uppercase tracking-wider no-underline cursor-pointer select-none"
              >
                SEE DETAILS
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Compass Dial Clock Artwork */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:z-10 flex justify-center lg:justify-end -mt-2 lg:-mt-10 max-lg:absolute max-lg:top-12 xs:max-lg:top-10 sm:max-lg:top-8 max-lg:-right-36 xs:max-lg:-right-32 sm:max-lg:-right-24 max-lg:z-10 max-lg:pointer-events-none"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative w-[min(100%,540px)] max-lg:w-[280px] xs:max-lg:w-[320px] sm:max-lg:w-[380px] aspect-square"
            >
              <motion.img
                src={compassIllustration}
                alt={`BYTE TALKS countdown clock: ${countdown}`}
                className="w-full h-full object-contain select-none drop-shadow-[8px_8px_0px_rgba(28,36,43,0.18)]"
                loading="eager"
                decoding="async"
                style={{ transformOrigin: '50.1% 48.9%' }}
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
              />
              {/* Event Countdown Display inside Compass Dark Center Circle */}
              <div 
                className="absolute top-[48.9%] left-[50.1%] max-lg:left-[46%] -translate-x-1/2 -translate-y-1/2 flex items-baseline justify-center font-display font-black text-[clamp(0.85rem,2.8vw,1.95rem)] sm:text-[clamp(1.05rem,2.8vw,1.95rem)] leading-none select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-tight whitespace-nowrap"
                aria-label={`Registration closes in ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes`}
              >
                <span className="text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[#de432c] text-[0.72em] font-black ml-0.5 mr-1 sm:mr-2">D</span>
                <span className="text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[#de432c] text-[0.72em] font-black ml-0.5 mr-1 sm:mr-2">H</span>
                <span className="text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[#de432c] text-[0.72em] font-black ml-0.5">M</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Campus Sticker Illustration positioned at bottom left-to-center with bottom half tucked behind EventInfoBar */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 pointer-events-none select-none -mt-8 sm:-mt-16 md:-mt-24 lg:-mt-36 w-[min(98%,880px)] lg:w-[68%] -ml-1 sm:-ml-3 lg:-ml-6 -mb-16 sm:-mb-24 md:-mb-36 lg:-mb-44 xl:-mb-52"
        >
          <img
            src={campusIllustration}
            alt="Illustrated AKGEC Campus Sticker"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[8px_14px_0px_rgba(28,36,43,0.25)]"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  );
}
