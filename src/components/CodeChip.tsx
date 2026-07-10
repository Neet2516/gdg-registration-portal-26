import type { ReactNode } from 'react';

interface CodeChipProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const CodeChip: React.FC<CodeChipProps> = ({
  children,
  icon,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 border border-zinc-800 p-2 bg-black font-mono text-xs md:text-sm select-none text-zinc-300 hover:border-zinc-500 hover:text-white transition-snap ${className}`}>
      {icon && <span className="shrink-0 text-zinc-500">{icon}</span>}
      <span className="truncate">{children}</span>
    </div>
  );
};
