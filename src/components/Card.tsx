import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  titleIcon?: ReactNode;
  headerExtra?: ReactNode;
  showHeader?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  titleIcon,
  headerExtra,
  showHeader = true,
  className = ''
}) => {
  return (
    <div className={`w-full bg-[#0D0E12] border border-[#71717A] p-6 shadow-2xl relative overflow-hidden transition-snap ${className}`}>
      {/* Scanline & Grid Effect Overlays */}
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none z-0"></div>
      <div className="absolute inset-0 dither-bg opacity-5 pointer-events-none z-0"></div>

      {showHeader && (title || headerExtra) && (
        <div className="flex items-center justify-between border-b border-[#71717A] pb-3 mb-6 font-mono text-xs tracking-widest text-[#71717A] relative z-10">
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
  );
};
