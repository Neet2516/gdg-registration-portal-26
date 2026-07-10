import { Globe, Link, Camera, Code, Heart } from 'lucide-react';
import gdgLogo from '../assets/images/gdg-logo.png';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`relative py-16 bg-black text-zinc-400 font-sans z-10 ${className}`}>
      
      {/* Horizontal web divider line for the footer */}
      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#E11D48]/30 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        
        {/* Brand Column (5 cols) */}
        <div className="md:col-span-5 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <img src={gdgLogo} alt="GDG Logo" className="w-10 h-10 object-contain animate-pulse" />
            <div className="space-y-0.5">
              <h3 className="font-comic text-2xl text-white tracking-wider uppercase leading-none">
                GDG AKGEC
              </h3>
              <p className="font-mono text-xs text-[#E11D48] tracking-widest uppercase font-bold">
                Google Developer Groups
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
            Google Developer Groups AKGEC is a university community of developers, designers, and creators. We shape the builders of the multiverse through open-source software, design sprints, and systems engineering.
          </p>
          {/* Social Links */}
          <div className="flex items-center gap-4 text-zinc-500">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors duration-150" title="LinkedIn">
              <Link size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E11D48] transition-colors duration-150" title="Instagram">
              <Camera size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150" title="GitHub">
              <Code size={20} />
            </a>
            <a href="https://gdg.community.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150" title="GDG Portal">
              <Globe size={20} />
            </a>
          </div>
        </div>

        {/* Links Column 1: Coordinates (3 cols) */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="font-comic text-base text-white tracking-widest uppercase pb-2 border-b border-zinc-800">
            COORDINATES
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <a href="#hero" className="hover:text-[#E11D48] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                // Home
              </a>
            </li>
            <li>
              <a href="#domains" className="hover:text-[#2563EB] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                // Guilds
              </a>
            </li>
            <li>
              <a href="#evaluation-path" className="hover:text-[#7C3AED] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                // Evaluation Path
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[#FACC15] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                // Intel FAQ
              </a>
            </li>
            <li>
              <a href="#registration-terminal" className="hover:text-[#10B981] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                // Gateway Register
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Legal & Info (4 cols) */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h4 className="font-comic text-base text-white tracking-widest uppercase pb-2 border-b border-zinc-800">
            COMMUNITY STATEMENT
          </h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Google Developer Groups (GDG) are program-supported independent communities. GDG AKGEC operates independently under Ajay Kumar Garg Engineering College, Ghaziabad. Google is a registered trademark of Google LLC.
          </p>
          <div className="pt-2">
            <span className="inline-block bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono py-1.5 px-3 uppercase tracking-widest">
              STATUS // ACTIVE NODE
            </span>
          </div>
        </div>

      </div>

      {/* Copyright row */}
      <div className="max-w-6xl mx-auto px-8 mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
        <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
          © {new Date().getFullYear()} GDG AKGEC. ALL RIGHTS RESERVED.
        </div>
        <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest flex items-center gap-1.5 justify-center">
          ENGINEERED WITH <Heart size={10} className="text-[#E11D48] fill-[#E11D48] animate-pulse" /> FOR THE WEB SPIDER BY GDG TECH TEAM
        </div>
      </div>

    </footer>
  );
};
