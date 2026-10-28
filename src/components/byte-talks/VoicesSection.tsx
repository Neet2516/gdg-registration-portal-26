import { motion } from 'framer-motion';
import micAsset from '../../assets/images/byte-talks/mic-asset.png';

export function VoicesSection() {
  const stickyNotes = [
    {
      text: "Stories and reflections from past speakers will appear here.",
      footer: "SPEAKER QUOTES COMING SOON",
      bg: "bg-[#58A4B0]",
      rotate: "-rotate-2",
      textColor: "text-[#1c242b]",
    },
    {
      text: "We’re gathering the moments that made previous talks memorable.",
      footer: "BYTE TALKS COMMUNITY",
      bg: "bg-[#de432c]",
      rotate: "rotate-2",
      textColor: "text-white",
    },
    {
      text: "Have a story to share? Join us at the next conversation.",
      footer: "SEE YOU ON CAMPUS",
      bg: "bg-[#1c242b]",
      rotate: "-rotate-1",
      textColor: "text-white",
    },
    {
      text: "Incredible energy from students and mentors alike across AKGEC.",
      footer: "AKGEC TECH COMMUNITY",
      bg: "bg-[#387A5B]",
      rotate: "rotate-1",
      textColor: "text-white",
    },
    {
      text: "Looking forward to another round of groundbreaking ideas and discussions.",
      footer: "BYTE TALKS 2026",
      bg: "bg-[#E35242]",
      rotate: "-rotate-2",
      textColor: "text-white",
    },
  ];

  return (
    <section className="relative w-full bg-[#1B1F27] py-16 md:py-24 text-white overflow-hidden" id="community">
      {/* Decorative sparkle stars */}
      <span className="sparkle-star absolute right-16 top-10 text-3xl text-white/30 select-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute right-1/3 bottom-12 text-2xl text-[#de432c]/60 select-none" aria-hidden="true">✦</span>

      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-start mb-16">
          {stickyNotes.map((note, index) => (
            <motion.div
              key={note.footer}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
              className={`border-2 border-[#1c242b] p-6 shadow-[6px_6px_0_#1c242b] transition-shadow hover:shadow-[10px_10px_0_#1c242b] cursor-pointer ${note.bg} ${note.rotate} ${note.textColor}`}
            >
              <span className="font-serif text-5xl leading-none opacity-40 select-none block" aria-hidden="true">“</span>
              <p className="my-4 font-display text-[1.18rem] md:text-[1.28rem] font-bold leading-snug">
                {note.text}
              </p>
              <div className="border-t border-current/25 pt-3 mt-4 font-mono text-[0.68rem] font-bold tracking-wider">
                {note.footer}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Microphone with boom arm asset anchored at bottom-left */}
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
          className="relative -ml-6 md:-ml-12 max-w-[280px] md:max-w-[340px]"
        >
          <img
            src={micAsset}
            alt="Microphone asset"
            className="w-full h-auto object-contain select-none drop-shadow-[8px_8px_0_rgba(28,36,43,0.18)]"
            loading="lazy"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  );
}
