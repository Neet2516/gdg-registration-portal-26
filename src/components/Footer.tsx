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
            <img src={gdgLogo} alt="GDG Logo" loading="lazy" className="w-20 h-20 object-contain animate-pulse" />
            <div className="space-y-0.5">
              <h3 className="font-oswald text-2xl text-white tracking-wider uppercase leading-none">
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
          <div className="flex flex-col md:flex-row flex-wrap items-start md:items-center gap-x-6 gap-y-3 text-zinc-500">
            <a href="https://www.linkedin.com/company/google-developer-groups-on-campus-akgec/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors duration-150 font-mono text-xs uppercase font-bold tracking-wider" title="LinkedIn">
              <span>LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/gdg_akgec/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E11D48] transition-colors duration-150 font-mono text-xs uppercase font-bold tracking-wider" title="Instagram">
              <span>Instagram</span>
            </a>
            <a href="https://github.com/dsc-akgec" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150 font-mono text-xs uppercase font-bold tracking-wider" title="GitHub">
              <span>GitHub</span>
            </a>
            <a href="https://gdgakgec.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-150 font-mono text-xs uppercase font-bold tracking-wider" title="GDG Portal">
              <span>GDG Portal</span>
            </a>
          </div>
        </div>

        {/* Links Column 1: Coordinates (3 cols) */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="font-oswald text-base text-white tracking-widest uppercase pb-2 border-b border-zinc-800">
            COORDINATES
          </h4>
          <ul className="space-y-3.5 text-sm">
            <li>
              <a href="#hero" className="hover:text-[#E11D48] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                HOME
              </a>
            </li>
            <li>
              <a href="#domains" className="hover:text-[#2563EB] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                GUILD
              </a>
            </li>
            <li>
              <a href="#evaluation-path" className="hover:text-[#7C3AED] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                EVALUATION PATH
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-[#FACC15] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                INTEL FAQ
              </a>
            </li>
            <li>
              <a href="#registration-terminal" className="hover:text-[#10B981] transition-colors duration-150 uppercase tracking-wider font-mono text-xs block">
                GATEWAY REGISTER
              </a>
            </li>
          </ul>
        </div>

        {/* Links Column 2: Legal & Info (4 cols) */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h4 className="font-oswald text-base text-white tracking-widest uppercase pb-2 border-b border-zinc-800">
            COMMUNITY STATEMENT
          </h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Google Developer Groups (GDG) are program-supported independent communities. GDG AKGEC operates independently under Ajay Kumar Garg Engineering College, Ghaziabad. Google is a registered trademark of Google LLC.
          </p>

        </div>

      </div>

    </footer>
  );
};
