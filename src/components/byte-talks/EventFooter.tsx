import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const letterColors = [
  '#de432c', // B - Red-Orange
  '#f2c35b', // Y - Warm Gold
  '#55a8a8', // T - Mint Teal
  '#387A5B', // E - Forest Green
  'transparent', // space
  '#3168e0', // T - Blue
  '#de432c', // A - Red-Orange
  '#f2c35b', // L - Yellow
  '#55a8a8', // K - Teal
  '#e75842', // S - Coral
];

interface InteractiveFooterLetterProps {
  char: string;
  index: number;
}

function InteractiveFooterLetter({ char, index }: InteractiveFooterLetterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [colorCycle, setColorCycle] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  if (char === ' ') {
    return <span className="inline-block w-[0.25em]">&nbsp;</span>;
  }

  const palette = ['#de432c', '#f2c35b', '#55a8a8', '#387A5B', '#3168e0', '#e75842', '#ffffff'];
  const baseColor = letterColors[index] || '#de432c';
  const activeColor = colorCycle === 0 ? baseColor : palette[(index + colorCycle) % palette.length];

  return (
    <motion.span
      onMouseEnter={() => {
        setIsHovered(true);
        setColorCycle((prev) => prev + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
      animate={
        shouldReduceMotion
          ? {}
          : {
              y: isHovered ? -14 : 0,
              scale: isHovered ? 1.08 : 1,
              rotate: isHovered ? (index % 2 === 0 ? -2.5 : 2.5) : 0,
            }
      }
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 17,
      }}
      style={{
        color: isHovered ? activeColor : 'transparent',
        WebkitTextStroke: isHovered ? '2.5px #1c242b' : '2px #404b5c',
        textShadow: isHovered
          ? `6px 8px 0px #000000, 0 0 25px ${activeColor}44`
          : 'none',
      }}
      className="inline-block cursor-pointer select-none transition-[color,text-stroke] duration-150"
    >
      {char}
    </motion.span>
  );
}

export function EventFooter() {
  return (
    <footer className="relative w-full bg-[#1B1F27] text-white pt-16 overflow-hidden border-t border-white/10">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Top Footer Grid */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 pb-14 border-b border-white/10">
          {/* Brand & info */}
          <div className="space-y-4 max-w-md">
            <div className="inline-flex items-center gap-3">
              <span 
                className="block size-6 shrink-0 border-[1.5px] border-white/40 bg-[#de432c] shadow-[2px_2px_0_#ffffff]" 
                aria-hidden="true" 
              />
              <span className="font-display text-2xl font-black text-white tracking-tight">
                BYTE TALKS 2026
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#1c242b] bg-[#fed766] px-2 py-0.5 border border-[#1c242b] shadow-[1.5px_1.5px_0_#ffffff]">
                AKGEC GHAZIABAD
              </span>
              <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-white bg-white/10 px-2 py-0.5 border border-white/20">
                CSIT SEMINAR HALL
              </span>
            </div>

            <p className="font-mono text-[0.82rem] leading-relaxed text-white/70">
              One campus. Many perspectives.<br />
              Ajay Kumar Garg Engineering College, Ghaziabad.<br />
              See you on 30 October 2026.
            </p>
          </div>

          {/* Social - Instagram Card */}
          <div className="border-2 border-white/20 bg-white/5 p-5 sm:p-6 shadow-[5px_5px_0_#000000] max-w-sm w-full">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
                OFFICIAL INSTAGRAM
              </span>
              <span className="size-2 rounded-full bg-[#de432c] animate-pulse" />
            </div>
            <p className="font-mono text-xs text-white/70 leading-relaxed mb-4">
              Catch speaker spotlights, backstage moments &amp; official community updates.
            </p>
            <motion.a
              whileHover={{ x: -2, y: -2 }}
              whileTap={{ x: 2, y: 2 }}
              href="https://www.instagram.com/bytetalks.akgec"
              target="_blank"
              rel="noreferrer"
              className="btn-3d-red flex items-center justify-center gap-2.5 w-full py-3 font-mono text-[0.82rem] font-bold uppercase tracking-wider text-white no-underline shadow-[3px_3px_0_#000000] cursor-pointer"
              aria-label="Follow @bytetalks.akgec on Instagram"
            >
              <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>@bytetalks.akgec</span>
              <span className="text-sm leading-none" aria-hidden="true">→</span>
            </motion.a>
          </div>
        </div>

        {/* Massive Outlined Retro Typography with Individual Letter Hover Animation */}
        <div className="pt-14 pb-8 text-center select-none overflow-hidden">
          <div className="font-display text-[clamp(3.8rem,14.5vw,12rem)] font-black leading-none whitespace-nowrap tracking-wide flex justify-center items-center">
            {'BYTE TALKS'.split('').map((char, index) => (
              <InteractiveFooterLetter 
                key={`${char}-${index}`} 
                char={char} 
                index={index} 
              />
            ))}
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-4 pb-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-white/50 text-center sm:text-left">
          <p className="m-0">
            © 2026 BYTE TALKS. ALL RIGHTS RESERVED.
          </p>
          <p className="m-0 text-[#f2c35b]/80">
            OCTOBER 30, 2026 • CSIT SEMINAR HALL
          </p>
        </div>
      </div>

      {/* Red accent bottom bar */}
      <div className="h-3 w-full bg-[#de432c]" />
    </footer>
  );
}
