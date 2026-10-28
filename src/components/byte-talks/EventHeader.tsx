import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function EventHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 w-full pt-6 pb-2"
    >
      <div className="mx-auto flex w-[min(1320px,calc(100%-48px))] items-center justify-between max-sm:w-[calc(100%-32px)]">
        {/* Brand */}
        <a 
          className="inline-flex items-center gap-3 no-underline group cursor-pointer" 
          href="#home" 
          onClick={closeMenu} 
          aria-label="BYTE TALKS home"
        >
          <motion.span 
            whileHover={{ scale: 1.15, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            className="block size-6 shrink-0 border-[1.5px] border-[#1c242b] bg-[#de432c] shadow-[2px_2px_0_#1c242b]" 
            aria-hidden="true" 
          />
          <div className="flex flex-col">
            <span className="font-display text-[1.22rem] font-black leading-none tracking-tight text-[#1c242b]">
              BYTE TALKS
            </span>
            <span className="mt-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#2c373d] leading-none">
              AKGEC CAMPUS
            </span>
          </div>
        </a>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="hidden border-2 border-[#1c242b] bg-white p-2 text-[#1c242b] shadow-[3px_3px_0_#1c242b] focus-visible:outline-2 max-md:inline-flex cursor-pointer"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>

        {/* Links */}
        <nav
          className={`${
            menuOpen ? 'max-md:flex' : 'max-md:hidden'
          } flex items-center gap-8 md:gap-10 font-mono text-[0.95rem] font-bold text-[#1c242b] max-md:absolute max-md:left-4 max-md:right-4 max-md:top-full max-md:mt-3 max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:border-2 max-md:border-[#1c242b] max-md:bg-[#B4DDD7] max-md:p-4 max-md:shadow-[5px_5px_0_#1c242b]`}
          aria-label="Main navigation"
        >
          <a 
            className="text-[#1c242b] transition-colors hover:text-[#de432c] max-md:border-b max-md:border-[#1c242b]/20 max-md:py-3" 
            href="#about" 
            onClick={closeMenu}
          >
            About
          </a>
          <a 
            className="text-[#1c242b] transition-colors hover:text-[#de432c] max-md:border-b max-md:border-[#1c242b]/20 max-md:py-3" 
            href="#faq" 
            onClick={closeMenu}
          >
            FAQs
          </a>
          <a 
            className="text-[#1c242b] transition-colors hover:text-[#de432c] max-md:border-b max-md:border-[#1c242b]/20 max-md:py-3" 
            href="#speakers" 
            onClick={closeMenu}
          >
            Mentors
          </a>
          <motion.a 
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ x: 2, y: 2 }}
            className="btn-3d-red inline-flex items-center justify-center px-4 py-1.5 font-mono text-[0.8rem] font-bold uppercase tracking-wider text-white no-underline max-md:mt-3 cursor-pointer" 
            href="#register" 
            onClick={closeMenu}
          >
            REGISTER
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
}
