import type { ReactNode } from 'react';

const WebCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`absolute pointer-events-none ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    {/* Curvy Radiating strands (using Q/C curves to look saggy and organic) */}
    <path d="M 0,0 Q 55,10 100,0" />
    <path d="M 0,0 Q 45,55 100,100" />
    <path d="M 0,0 Q 10,55 0,100" />
    <path d="M 0,0 Q 30,55 70,100" />
    <path d="M 0,0 Q 55,30 100,70" />
    
    {/* Web arcs (sagging curved paths) */}
    <path d="M 25,0 Q 25,25 0,25" />
    <path d="M 45,0 Q 45,45 0,45" />
    <path d="M 65,0 Q 65,65 0,65" />
    <path d="M 85,0 Q 85,85 0,85" />
    <path d="M 100,0 Q 100,100 0,100" />
  </svg>
);

interface CardProps {
  children: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  headerExtra?: ReactNode;
  showHeader?: boolean;
  className?: string;
  shadowColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  titleIcon,
  headerExtra,
  showHeader = true,
  className = '',
  shadowColor = '#E11D48'
}) => {
  return (
    <div className={`w-full relative p-7 select-none group active:translate-x-[1px] active:translate-y-[1px] ${className}`} style={{ background: 'none', border: 'none' }}>
      
      {/* Smooth block shadow */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none translate-x-[5px] translate-y-[5px] transition-all duration-200 group-hover:translate-x-[7px] group-hover:translate-y-[7px] opacity-90"
        style={{ 
          backgroundColor: shadowColor,
          borderRadius: '16px'
        }}
      />

      {/* Smooth border & fill */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none bg-[#0D0E12] border-[3px] border-white group-hover:border-[#E11D48] transition-colors duration-200"
        style={{ 
          borderRadius: '16px'
        }}
      />

      {/* Spider Web corners decoration */}
      <WebCorner className="top-[3px] left-[3px] w-12 h-12 text-zinc-800 group-hover:text-[#E11D48]/35 transition-colors duration-300 z-10" />
      <WebCorner className="top-[3px] right-[3px] w-12 h-12 rotate-90 text-zinc-800 group-hover:text-[#E11D48]/35 transition-colors duration-300 z-10" />
      <WebCorner className="bottom-[3px] right-[3px] w-12 h-12 rotate-180 text-zinc-800 group-hover:text-[#E11D48]/35 transition-colors duration-300 z-10" />
      <WebCorner className="bottom-[3px] left-[3px] w-12 h-12 rotate-270 text-zinc-800 group-hover:text-[#E11D48]/35 transition-colors duration-300 z-10" />

      {/* Content */}
      <div className="relative z-10">
        {showHeader && (title || headerExtra) && (
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6 font-oswald text-base tracking-wide text-white relative z-10">
            <div className="flex items-center gap-2">
              {titleIcon && <span className="shrink-0">{titleIcon}</span>}
              {title && <span>{title.toUpperCase()}</span>}
            </div>
            {headerExtra && <div className="shrink-0">{headerExtra}</div>}
          </div>
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
