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
  const baseStyle = 'font-mono text-xs font-bold tracking-widest py-3 px-6 border cursor-pointer transition-snap flex items-center justify-center gap-2 select-none uppercase';
  
  const variants = {
    primary: 'bg-white text-black border-white hover:bg-black hover:text-white',
    secondary: 'bg-zinc-900 text-white border-zinc-700 hover:bg-white hover:text-black hover:border-white',
    outline: 'bg-transparent text-white border-[#71717A] hover:border-white hover:bg-white/5',
    ghost: 'bg-transparent text-[#71717A] hover:text-white border-transparent hover:bg-zinc-900/50'
  };

  const currentVariant = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyle} ${currentVariant} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
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
};
