import { motion } from 'framer-motion';
import byteTalksPoster from '../../assets/images/byte-talks/byte_talks_poster.png';

export function AboutSection() {
  return (
    <section className="relative w-full bg-[#1B1F27] pt-16 pb-12 md:pt-24 md:pb-16 text-white" id="about">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] items-center gap-12 lg:gap-16">
          {/* Left: Vintage Tech Poster Card with Neo-brutalist offset shadow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[420px]">
              {/* White offset shadow card behind */}
              <div 
                className="absolute inset-0 translate-x-3.5 translate-y-3.5 bg-white border-2 border-white" 
                aria-hidden="true" 
              />
              {/* Main poster image card */}
              <div className="relative border-2 border-white bg-[#141b27] overflow-hidden">
                <img
                  src={byteTalksPoster}
                  alt="Byte Talks Alumni Edition Poster"
                  className="w-full h-auto object-cover select-none"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: WHAT IS BYTE TALKS? with underline, description & badges */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-[1.05] tracking-tight">
              WHAT IS<br />BYTE TALKS?
            </h2>

            {/* Solid white underline spanning across */}
            <div className="w-full h-[3px] bg-white mt-4 mb-6" />

            <p className="font-mono text-sm sm:text-base leading-relaxed text-white/80 max-w-xl">
              BYTE TALKS is the premier student-led technical forum at Ajay Kumar Garg Engineering College, designed to bridge the gap between classroom academics and production-grade software engineering. We bring together high-impact industry practitioners, open-source maintainers, and accomplished alumni for unfiltered architectural deep dives, live code breakdowns, and practical career roadmaps. It is built by developers, for developers who want to move beyond syntax and master real-world systems.
            </p>

            {/* Badges matching reference */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="border border-[#55a8a8] bg-[#55a8a8]/10 px-3.5 py-1.5 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[#55a8a8]">
                STUDENT FRIENDLY
              </span>
              <span className="border border-[#55a8a8] bg-[#55a8a8]/10 px-3.5 py-1.5 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-[#55a8a8]">
                MENTORS ON CALL
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
