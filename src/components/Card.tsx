import type { ReactNode } from 'react';

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
