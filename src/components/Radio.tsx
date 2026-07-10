interface RadioOption {
  label: string;
  value: string;
}

interface RadioProps {
  label: string;
  options: RadioOption[];
  register?: any;
  error?: string;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  options,
  register,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block font-mono text-xs text-white tracking-widest uppercase">
        {label}
      </label>
      <div className="flex items-center gap-6 h-12 bg-black border border-[#71717A]/40 px-4">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              value={opt.value}
              {...register}
              className="appearance-none w-3.5 h-3.5 border border-[#71717A] checked:bg-white checked:border-white focus:outline-none transition-snap"
            />
            <span className="font-mono text-xs text-[#71717A] group-hover:text-white transition-snap uppercase select-none">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="font-mono text-xs text-[#EF4444] pt-1 uppercase">{error}</p>
      )}
    </div>
  );
};
