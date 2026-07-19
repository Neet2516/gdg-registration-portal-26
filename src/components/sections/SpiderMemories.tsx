import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pastEvents, type PastEvent } from '../../data/pastEvents';

interface ComicTheme {
  bgClass: string;
}

const COMIC_THEMES: Record<string, ComicTheme> = {
  'ML STUDY JAM': {
    bgClass: 'bg-[#581C87]' // Deep purple
  },
  'FLUTTER FUSION': {
    bgClass: 'bg-[#1e1b4b]' // Deep indigo
  },
  'DISCOVER': {
    bgClass: 'bg-[#991B1B]' // Comic red
  },
  'COMMIT CON': {
    bgClass: 'bg-[#047857]' // Comic green
  },
  'CODE THEFT AUTO': {
    bgClass: 'bg-[#C2410C]' // Comic orange
  }
};

const DEFAULT_THEME: ComicTheme = {
  bgClass: 'bg-zinc-800'
};

const ComicWaveBorderTop: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-[24px] -translate-y-[1px] z-30 pointer-events-none select-none">
      <svg className="w-full h-full" viewBox="0 0 1440 24" preserveAspectRatio="none">
        {/* Mask area above the curve with the section background color #020202 */}
        <path 
          d="M0,0 L1440,0 L1440,12 C1080,2 720,22 0,12 Z" 
          fill="#020202"
        />
        {/* Wavy black border stroke */}
        <path 
          d="M0,12 C360,2 720,22 1080,2 1440,12" 
          stroke="black" 
          strokeWidth="6" 
          fill="none"
        />
      </svg>
    </div>
  );
};

const ComicWaveBorderBottom: React.FC = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[24px] translate-y-[1px] z-30 pointer-events-none select-none">
      <svg className="w-full h-full" viewBox="0 0 1440 24" preserveAspectRatio="none">
        {/* Mask area below the curve with the section background color #020202 */}
        <path 
          d="M0,24 L1440,24 L1440,12 C1080,22 720,2 0,12 Z" 
          fill="#020202"
        />
        {/* Wavy black border stroke */}
        <path 
          d="M0,12 C360,22 720,2 1080,22 1440,12" 
          stroke="black" 
          strokeWidth="6" 
          fill="none"
        />
      </svg>
    </div>
  );
};

interface EventCardProps {
  event: PastEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);
  const themeKey = event.name.toUpperCase();
  const theme = COMIC_THEMES[themeKey] || DEFAULT_THEME;
  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(event.link)}&screenshot=true&embed=screenshot.url`;

  return (
    <motion.div
      whileHover={{
        scale: 1.08,
        rotate: 0,
        skewX: 0,
        y: -6,
        boxShadow: '0px 10px 25px rgba(225, 29, 72, 0.95)',
        borderColor: '#E11D48',
        zIndex: 50,
        transition: { type: 'spring', stiffness: 380, damping: 14 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onClick={() => window.open(event.link, '_blank')}
      className="relative w-[240px] md:w-[280px] h-[130px] flex-shrink-0 border-4 border-black rounded-none p-4 flex flex-col justify-between cursor-pointer select-none overflow-hidden transition-colors duration-200"
      style={{
        boxShadow: '6px 6px 0px #000000',
        backgroundColor: isHovered ? '#000000' : undefined
      }}
    >
      {/* Background themed color */}
      <div className={`absolute inset-0 ${theme.bgClass} z-0`} />

      {/* Pop-art Halftone Dots Layer */}
      <div className="absolute inset-0 halftone-overlay opacity-[0.18] pointer-events-none z-10" />

      {/* Comic Speed Lines */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-y-12 pointer-events-none z-10" />

      {/* Year Label */}
      <div className="absolute top-2.5 left-2.5 z-20">
        <span className="font-mono text-[9px] md:text-[10px] font-black text-black bg-[#FACC15] px-2 py-0.5 border border-black uppercase tracking-wider skew-x-[-6deg] inline-block shadow-[1px_1px_0px_#000]">
          YR. {event.year}
        </span>
      </div>

      {/* Title */}
      <div className="my-auto pt-4 text-center z-20 px-2">
        <h3 className="font-sans font-black tracking-tighter uppercase text-base md:text-lg text-white leading-tight comic-text-stroke select-none">
          {event.name}
        </h3>
      </div>

      {/* Bottom overlay line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/15 pointer-events-none z-20" />

      {/* Hover Link Image Preview Overlay */}
      <AnimatePresence>
        {isHovered && event.link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black z-30 flex items-center justify-center border-2 border-black"
          >
            <img
              src={screenshotUrl}
              alt={`${event.name} instagram preview`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Comic speech sticker overlay */}
            <div className="absolute bottom-2 right-2 bg-[#FACC15] text-black border border-black font-mono text-[8px] font-extrabold px-1.5 py-0.5 tracking-wider uppercase select-none z-40 shadow-[1px_1px_0px_#000]">
              VIEW POST ↗
            </div>
            
            {/* Pop-art Halftone Dots on preview to maintain aesthetic */}
            <div className="absolute inset-0 halftone-overlay opacity-[0.12] pointer-events-none z-40" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SpiderMemories: React.FC = () => {
  // Separate events by year for the two crossing lines
  const events2025 = pastEvents.filter(e => e.year === 2025);
  const events2024 = pastEvents.filter(e => e.year === 2024);

  // Repeat items to create a seamless looping marquee track
  const track1Events = [...events2025, ...events2025, ...events2025, ...events2025];
  const track2Events = [...events2024, ...events2024, ...events2024, ...events2024, ...events2024];

  return (
    <section
      id="spider-memories"
      className="relative w-full bg-[#020202] py-20 overflow-hidden scroll-mt-24 border-y-4 border-black"
    >
      {/* Halftone & Keyframe animations */}
      <style>{`
        .halftone-overlay {
          background-image: radial-gradient(rgba(0, 0, 0, 0.95) 20%, transparent 22%);
          background-size: 5px 5px;
        }

        .comic-text-stroke {
          text-shadow: 
            2px 2px 0px #000000,
            -1px -1px 0px #000000,  
            1px -1px 0px #000000,
            -1px 1px 0px #000000,
            1px 1px 0px #000000,
            1.5px 0px 0px #000000,
            0px 1.5px 0px #000000,
            -1.5px 0px 0px #000000,
            0px -1.5px 0px #000000;
        }

        @keyframes marqueeL {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.3333%, 0, 0);
          }
        }

        @keyframes marqueeR {
          0% {
            transform: translate3d(-33.3333%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-marquee-left-loop {
          animation: marqueeL 25s linear infinite;
        }

        .animate-marquee-right-loop {
          animation: marqueeR 20s linear infinite;
        }
      `}</style>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-950 via-black to-black opacity-90 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%)] bg-[size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="w-full space-y-16 relative z-10">
        
        {/* Centered Heading */}
        <div className="text-center space-y-2 mb-6 relative z-10">
          <h2 
            className="title-spiderman text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase select-none tracking-tight text-shadow-glow"
            style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
            }}
          >
            SPIDEY ARCHIVES
          </h2>
        </div>

        {/* Overlapping, Intersecting Crossing Marquee Strips in X Shape */}
        <div className="relative w-full flex flex-col justify-center items-center py-20 overflow-visible">
          
          {/* Line 1: Rotated Upward (-3.5deg), Scrolling Right to Left */}
          <div 
            className="relative w-[120vw] -left-[10vw] py-8 bg-[#E11D48] z-10 shadow-[0_8px_20px_rgba(0,0,0,0.6)] transform-gpu overflow-visible"
            style={{ transform: 'rotate(-3.5deg)' }}
          >
            <ComicWaveBorderTop />
            <ComicWaveBorderBottom />

            
            <div 
              className="flex gap-6 animate-marquee-left-loop hover:[animation-play-state:paused] transform-gpu overflow-visible px-28"
              style={{
                display: 'inline-flex',
                width: 'max-content'
              }}
            >
              {track1Events.map((event, idx) => (
                <EventCard key={`track1-${event.id}-${idx}`} event={event} />
              ))}
            </div>
          </div>

          {/* Line 2: Rotated Downward (3.5deg), Scrolling Left to Right */}
          <div 
            className="relative w-[120vw] -left-[10vw] py-8 bg-[#1D4ED8] z-20 -mt-20 shadow-[0_8px_20px_rgba(0,0,0,0.6)] transform-gpu overflow-visible"
            style={{ transform: 'rotate(3.5deg)' }}
          >
            <ComicWaveBorderTop />
            <ComicWaveBorderBottom />

            
            <div 
              className="flex gap-6 animate-marquee-right-loop hover:[animation-play-state:paused] transform-gpu overflow-visible px-28"
              style={{
                display: 'inline-flex',
                width: 'max-content'
              }}
            >
              {track2Events.map((event, idx) => (
                <EventCard key={`track2-${event.id}-${idx}`} event={event} />
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
