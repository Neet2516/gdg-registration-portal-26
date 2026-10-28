import { useLiveCountdown } from './types';

export function EventInfoBar() {
  const timeLeft = useLiveCountdown();

  return (
    <div className="relative z-20 w-full bg-[#1B1F27] text-white">
      {/* Retro diagonal striped hazard/accent line */}
      <div 
        className="h-2.5 w-full bg-[repeating-linear-gradient(45deg,#1c242b,#1c242b_8px,#ffffff_8px,#ffffff_16px)]" 
        aria-hidden="true" 
      />
      <div className="mx-auto grid w-[min(1320px,calc(100%-48px))] grid-cols-2 md:grid-cols-4 items-center gap-6 py-6 md:py-8 max-sm:w-[calc(100%-32px)]">
        {/* Date */}
        <div className="border-r border-white/15 pr-4 max-sm:border-r-0">
          <span className="block font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
            DATE
          </span>
          <strong className="mt-1 block font-display text-lg md:text-2xl font-black text-white tracking-tight">
            30 OCT 2026
          </strong>
        </div>

        {/* Time */}
        <div className="border-r border-white/15 pr-4 max-md:border-r-0">
          <span className="block font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
            TIME
          </span>
          <strong className="mt-1 block font-display text-lg md:text-2xl font-black text-white tracking-tight">
            4:00 PM
          </strong>
        </div>

        {/* Venue */}
        <div className="border-r border-white/15 pr-4 max-sm:border-r-0">
          <span className="block font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8]">
            VENUE
          </span>
          <strong className="mt-1 block font-display text-lg md:text-2xl font-black text-white tracking-tight">
            CSIT SEMINAR HALL
          </strong>
        </div>

        {/* Live Countdown */}
        <div>
          <span className="font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8] mb-1.5 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#de432c] animate-ping" />
            REGISTRATION CLOSES IN
          </span>
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-9 md:size-10 bg-white text-[#1c242b] border-2 border-[#1c242b] font-display font-black text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.55rem] font-bold text-white/60 mt-0.5">DAYS</span>
            </div>
            <span className="font-mono text-xs font-bold text-white/70 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-9 md:size-10 bg-white text-[#1c242b] border-2 border-[#1c242b] font-display font-black text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.55rem] font-bold text-white/60 mt-0.5">HRS</span>
            </div>
            <span className="font-mono text-xs font-bold text-white/70 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-9 md:size-10 bg-white text-[#1c242b] border-2 border-[#1c242b] font-display font-black text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.55rem] font-bold text-white/60 mt-0.5">MIN</span>
            </div>
            <span className="font-mono text-xs font-bold text-white/70 -mt-3">:</span>
            <div className="flex flex-col items-center">
              <div className="grid place-content-center size-9 md:size-10 bg-[#de432c] text-white border-2 border-[#1c242b] font-display font-black text-base md:text-lg shadow-[2px_2px_0_#1c242b]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="font-mono text-[0.55rem] font-bold text-[#de432c] mt-0.5">SEC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
