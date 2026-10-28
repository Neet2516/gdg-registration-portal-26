import { useLiveCountdown } from './types';

export function EventInfoBar() {
  const timeLeft = useLiveCountdown();

  return (
    <div className="relative z-30 w-full bg-[#1B1F27] text-white">
      {/* Retro diagonal striped hazard/accent line matching reference */}
      <div 
        className="h-3 sm:h-3.5 w-full bg-[repeating-linear-gradient(-45deg,#1c242b,#1c242b_8px,#ffffff_8px,#ffffff_16px)] border-y border-[#1c242b]" 
        aria-hidden="true" 
      />
      <div className="mx-auto grid w-[min(1320px,calc(100%-32px))] grid-cols-2 md:grid-cols-4 items-center gap-4 sm:gap-6 py-5 sm:py-6 md:py-8">
        {/* Date */}
        <div className="border-r border-white/15 pr-3 sm:pr-4">
          <span className="block font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
            DATE
          </span>
          <strong className="mt-1 block font-display text-base sm:text-xl md:text-2xl font-black text-white tracking-tight whitespace-nowrap">
            30 OCT 2026
          </strong>
        </div>

        {/* Time */}
        <div className="md:border-r md:border-white/15 pr-3 md:pr-4 pl-1 sm:pl-0">
          <span className="block font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
            TIME
          </span>
          <strong className="mt-1 block font-display text-base sm:text-xl md:text-2xl font-black text-white tracking-tight whitespace-nowrap">
            10:00 AM
          </strong>
        </div>

        {/* Venue */}
        <div className="col-span-2 md:col-span-1 md:border-r md:border-white/15 md:pr-4 max-md:border-t max-md:border-white/15 max-md:pt-3">
          <span className="block font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
            VENUE
          </span>
          <strong className="mt-1 block font-display text-base sm:text-xl md:text-2xl font-black text-white tracking-tight">
            CSIT SEMINAR HALL
          </strong>
        </div>

        {/* Live Countdown */}
        <div className="col-span-2 md:col-span-1 max-md:border-t max-md:border-white/15 max-md:pt-3 max-md:bg-white/[0.03] max-md:p-3 max-md:rounded-lg max-md:border max-md:border-white/10">
          <div className="flex items-center gap-2 mb-1.5 md:mb-2">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#de432c] opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-[#de432c]" />
            </span>
            <span className="font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8] whitespace-nowrap">
              REGISTRATION CLOSES IN
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-8 sm:size-9 md:size-10 bg-white text-[#1c242b] border-2 border-[#1c242b] font-display font-black text-sm sm:text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.52rem] sm:text-[0.55rem] font-bold text-white/60 mt-0.5">DAYS</span>
            </div>
            <span className="font-mono text-xs font-bold text-white/70 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-8 sm:size-9 md:size-10 bg-white text-[#1c242b] border-2 border-[#1c242b] font-display font-black text-sm sm:text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.52rem] sm:text-[0.55rem] font-bold text-white/60 mt-0.5">HRS</span>
            </div>
            <span className="font-mono text-xs font-bold text-white/70 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-8 sm:size-9 md:size-10 bg-white text-[#1c242b] border-2 border-[#1c242b] font-display font-black text-sm sm:text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.52rem] sm:text-[0.55rem] font-bold text-white/60 mt-0.5">MIN</span>
            </div>
            <span className="font-mono text-xs font-bold text-white/70 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-8 sm:size-9 md:size-10 bg-[#de432c] text-white border-2 border-[#1c242b] font-display font-black text-sm sm:text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.52rem] sm:text-[0.55rem] font-bold text-[#de432c] mt-0.5">SEC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
