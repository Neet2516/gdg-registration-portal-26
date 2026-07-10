import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
}

const WebCorner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`absolute pointer-events-none ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    {/* Radiating strands */}
    <line x1="0" y1="0" x2="100" y2="0" />
    <line x1="0" y1="0" x2="100" y2="100" />
    <line x1="0" y1="0" x2="0" y2="100" />
    <line x1="0" y1="0" x2="70" y2="100" />
    <line x1="0" y1="0" x2="100" y2="70" />
    {/* Web arcs */}
    <path d="M 20,0 Q 20,20 0,20" />
    <path d="M 40,0 Q 40,40 0,40" />
    <path d="M 60,0 Q 60,60 0,60" />
    <path d="M 80,0 Q 80,80 0,80" />
    <path d="M 100,0 Q 100,100 0,100" />
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = ''
}) => {
  const isDisabled = disabled || loading;

  if (variant === 'ghost') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={`font-comic text-xs md:text-sm tracking-wider py-3.5 px-7 cursor-pointer select-none uppercase transition-all duration-200 bg-transparent text-[#71717A] hover:text-white hover:bg-zinc-900/50 flex items-center justify-center gap-2 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          <>
            {children}
            {icon && <span className="shrink-0">{icon}</span>}
          </>
        )}
      </button>
    );
  }

  // Styles for hand-drawn comic buttons
  const variants = {
    primary: {
      text: 'text-black group-hover:text-white',
      shadow: 'fill-[#E11D48] group-hover:fill-white',
      border: 'fill-white stroke-black group-hover:fill-[#E11D48] group-hover:stroke-white'
    },
    secondary: {
      text: 'text-white group-hover:text-black',
      shadow: 'fill-[#2563EB] group-hover:fill-[#E11D48]',
      border: 'fill-zinc-900 stroke-zinc-700 group-hover:fill-white group-hover:stroke-black'
    },
    outline: {
      text: 'text-white group-hover:text-[#E11D48]',
      shadow: 'fill-[#E11D48] group-hover:fill-[#2563EB]',
      border: 'fill-transparent stroke-white group-hover:fill-white/5 group-hover:stroke-[#E11D48]'
    }
  };

  const currentStyles = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`font-comic text-xs md:text-sm tracking-wider py-4 px-8 cursor-pointer select-none uppercase relative flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px] group transition-all duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      style={{ background: 'none', border: 'none' }}
    >
      {/* Hand-drawn block shadow */}
      <svg 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none" 
        className={`absolute inset-0 w-full h-full pointer-events-none translate-x-[4px] translate-y-[4px] transition-all duration-200 group-hover:translate-x-[6px] group-hover:translate-y-[6px]`}
      >
        <path 
          d="M 3,4 L 97,2 L 98.5,96 L 2,98 Z" 
          className={`${currentStyles.shadow} transition-colors duration-200`}
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
          d="M 3,4 L 97,2 L 98.5,96 L 2,98 Z" 
          className={`${currentStyles.border} transition-all duration-200`}
          strokeWidth="3.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Spider Web corners decoration */}
      <WebCorner className="top-[3px] left-[3px] w-7 h-7 text-zinc-500/20 group-hover:text-white/25 transition-colors duration-300 z-10" />
      <WebCorner className="bottom-[3px] right-[3px] w-7 h-7 rotate-180 text-zinc-500/20 group-hover:text-white/25 transition-colors duration-300 z-10" />

      {/* Button content */}
      {loading ? (
        <Loader2 className="animate-spin z-10" size={14} />
      ) : (
        <span className={`relative z-10 flex items-center justify-center gap-2 ${currentStyles.text} transition-colors duration-200`}>
          {children}
          {icon && <span className="shrink-0">{icon}</span>}
        </span>
      )}
    </button>
  );
};
