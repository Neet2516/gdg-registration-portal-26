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
      
      {/* Hand-drawn block shadow */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-none translate-x-[5px] translate-y-[5px] transition-all duration-200 group-hover:translate-x-[7px] group-hover:translate-y-[7px]"
      >
        <path 
          d="M 1.5,1.5 L 98.5,0.8 L 99.2,98.5 L 0.8,99.2 Z" 
          fill={shadowColor}
          className="opacity-90 transition-colors duration-200"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Hand-drawn border & fill */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <path 
          d="M 1.5,1.5 L 98.5,0.8 L 99.2,98.5 L 0.8,99.2 Z" 
          fill="#0D0E12" 
          stroke="white" 
          strokeWidth="3"
          className="group-hover:stroke-[#E11D48] transition-colors duration-200"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10">
        {showHeader && (title || headerExtra) && (
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6 font-comic text-base tracking-wide text-white relative z-10">
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
