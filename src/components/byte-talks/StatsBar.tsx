import { motion } from 'framer-motion';

export function StatsBar() {
  const stats = [
    { value: '2.5', label: 'hours' },
    { value: '02', label: 'speakers' },
    { value: '200', label: 'total seats' },
  ];

  return (
    <div className="relative z-20 w-full border-y-2 border-[#1c242b] bg-[#de432c] text-white">
      <div className="mx-auto grid w-[min(1320px,calc(100%-48px))] grid-cols-3 max-sm:w-[calc(100%-32px)]">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`py-5 sm:py-6 md:py-8 px-2 sm:px-4 text-center transition-all ${
              idx < 2 ? 'border-r-2 border-[#1c242b]' : ''
            }`}
          >
            <div className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none text-white tracking-tight">
              {s.value}
            </div>
            <div className="mt-1.5 sm:mt-2 font-mono text-xs sm:text-sm md:text-base font-bold text-white/95">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
