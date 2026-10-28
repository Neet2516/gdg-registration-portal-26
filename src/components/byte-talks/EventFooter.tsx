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
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-16 border-b border-white/10">
          {/* Brand & info */}
          <div>
            <div className="inline-flex items-center gap-3">
              <span 
                className="block size-6 shrink-0 border-[1.5px] border-white/40 bg-[#de432c] shadow-[2px_2px_0_#ffffff]" 
                aria-hidden="true" 
              />
              <span className="font-display text-xl font-black text-white tracking-tight">
                BYTE TALKS
              </span>
            </div>
            <p className="mt-4 font-mono text-[0.8rem] leading-relaxed text-white/70 max-w-sm">
              One campus. Many perspectives.<br />
              Ajay Kumar Garg Engineering College, Ghaziabad.<br />
              See you on 30 October 2026.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8] block mb-4">
              QUICK LINKS
            </span>
            <div className="flex flex-col space-y-2.5 font-mono text-[0.82rem]">
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#about">About The Event</a>
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#speakers">Speakers &amp; Mentors</a>
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#faq">Frequently Asked Questions</a>
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#register">Register Now</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8] block mb-4">
              CONNECT
            </span>
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://www.instagram.com/bytetalks.akgec"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://in.linkedin.com/company/google-developer-groups-on-campus-akgec"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://github.com/dsc-akgec"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="GitHub"
              >
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="Twitter / X"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
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
      </div>

      {/* Red accent bottom bar */}
      <div className="h-3 w-full bg-[#de432c]" />
    </footer>
  );
}
