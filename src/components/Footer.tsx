import React from 'react';
import { ArrowUpRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import gdgLogo from '../assets/images/gdg-logo.png';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`relative py-16 bg-black text-zinc-400 font-sans z-10 overflow-hidden ${className}`}>
      
      {/* Horizontal glowing gradient divider line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#E11D48]/40 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12 relative z-10">
        
        {/* Main Grid: Brand + Community Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Brand & Instagram Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-3.5">
              <img 
                src={gdgLogo} 
                alt="GDG Logo" 
                loading="lazy" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_20px_rgba(225,29,72,0.25)]" 
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-oswald text-2xl sm:text-3xl text-white tracking-wider uppercase leading-none">
                    GDG AKGEC
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVE
                  </span>
                </div>
                <p className="font-mono text-xs text-[#E11D48] tracking-widest uppercase font-bold">
                  Google Developer Groups • On Campus
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-lg">
              Google Developer Groups AKGEC is a student-led university community of developers, designers, and builders. We empower the next generation of engineers through open source, workshops, hackathons, and real-world tech systems.
            </p>

            {/* Instagram Connect Card */}
            <div className="pt-2">
              <a 
                href="https://www.instagram.com/gdg_akgec/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group inline-flex items-center gap-3.5 px-4 sm:px-5 py-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-pink-500/50 text-white transition-all duration-200 shadow-md hover:shadow-pink-500/15 cursor-pointer select-none"
                title="Follow GDG AKGEC on Instagram"
              >
                <div className="size-9 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
                  <svg className="size-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-pink-400 transition-colors">
                    Official Instagram
                  </span>
                  <span className="font-mono text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                    @gdg_akgec 
                    <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Statement & Campus Info Card (6 cols) */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 p-6 sm:p-7 space-y-4 backdrop-blur-xs shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck size={16} className="text-[#E11D48]" />
                  <h4 className="font-oswald text-sm sm:text-base tracking-widest uppercase">
                    COMMUNITY &amp; AFFILIATION
                  </h4>
                </div>
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-zinc-400 px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded">
                  EST. 2019
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Google Developer Groups (GDG) are program-supported independent communities. GDG AKGEC operates independently under Ajay Kumar Garg Engineering College, Ghaziabad. Google is a registered trademark of Google LLC.
              </p>

              <div className="pt-2 flex items-start gap-2.5 text-zinc-400 font-mono text-xs">
                <MapPin size={15} className="text-[#E11D48] shrink-0 mt-0.5" />
                <span>
                  Ajay Kumar Garg Engineering College, 27th Km Milestone, Delhi-Meerut Expressway, Ghaziabad, UP 201009
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-400 text-center sm:text-left">
          <p className="m-0">
            © {new Date().getFullYear()} GDG AKGEC. All rights reserved.
          </p>
          <p className="m-0 flex items-center gap-1.5 text-zinc-400">
            <Sparkles size={13} className="text-[#E11D48]" />
            <span>Built by &amp; for the builder community</span>
          </p>
        </div>

      </div>

    </footer>
  );
};
