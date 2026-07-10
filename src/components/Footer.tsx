interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`border-t border-[#71717A]/20 py-8 bg-black relative z-10 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          © {new Date().getFullYear()} GDG AKGEC. ALL RIGHTS RESERVED.
        </div>
        <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          ENGINEERED FOR COSMIC SCALE // STYLING BY Brutalist_6.0
        </div>
      </div>
    </footer>
  );
};
