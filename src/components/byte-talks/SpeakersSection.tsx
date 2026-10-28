import { motion } from 'framer-motion';
import arrowMarker from '../../assets/images/byte-talks/ArrowMarker.png';
import speakerPhoto from '../../assets/images/byte-talks/speaker_portrait.jpg';

export function SpeakersSection() {
  return (
    <section className="relative w-full bg-[#1B1F27] pt-14 sm:pt-18 md:pt-24 pb-16 md:pb-24 text-white overflow-hidden" id="speakers">
      {/* Floating Sparkle & Diamond Stars as seen in the reference mockup */}
      <div className="absolute left-6 sm:left-12 top-6 sm:top-10 flex items-center gap-6 sm:gap-10 pointer-events-none select-none" aria-hidden="true">
        <span className="text-xl sm:text-2xl text-[#f2c35b]/90 drop-shadow-[0_0_8px_rgba(242,195,91,0.5)]">✦</span>
        <span className="text-sm sm:text-base text-[#de432c]/85 drop-shadow-[0_0_8px_rgba(222,67,44,0.5)]">✦</span>
        <span className="text-base sm:text-lg text-[#55a8a8]/90 drop-shadow-[0_0_8px_rgba(85,168,168,0.5)]">✦</span>
        <span className="text-xl sm:text-2xl text-[#f2c35b]/90 drop-shadow-[0_0_8px_rgba(242,195,91,0.5)]">✦</span>
        <span className="text-sm sm:text-base text-[#de432c]/85 drop-shadow-[0_0_8px_rgba(222,67,44,0.5)]">✦</span>
      </div>

      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Header Block with Signpost on Right and SPEAKERS on Left */}
        <div className="relative pt-4 pb-4">
          {/* Directional Signpost Artwork floating on the right */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
            className="absolute right-0 sm:right-2 md:right-4 -top-6 sm:-top-10 md:-top-16 lg:-top-20 w-[200px] sm:w-[280px] md:w-[360px] lg:w-[420px] pointer-events-none select-none z-10"
          >
            <img
              src={arrowMarker}
              alt="Directional Signpost: Speaker Area, What is Commit Con?, Past Events"
              className="w-full h-auto object-contain drop-shadow-[8px_12px_0_rgba(0,0,0,0.35)]"
              loading="eager"
              decoding="async"
            />
          </motion.div>

          {/* SPEAKERS Title & Solid White Underline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative z-0"
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-black uppercase text-white tracking-tight m-0 leading-tight">
              SPEAKERS
            </h2>
            {/* White underline spanning across */}
            <div className="w-full h-[2px] bg-white mt-4 sm:mt-5 mb-12 sm:mb-16" />
          </motion.div>
        </div>

        {/* Featured Speaker: AKAASH TRIPATHEE */}
        <div className="space-y-16 md:space-y-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] items-center gap-8 md:gap-14"
          >
            {/* Speaker Photo with Neo-brutalist white offset backer */}
            <div className="relative w-full max-w-[320px] mx-auto md:mx-0">
              <div 
                className="absolute inset-0 translate-x-3.5 translate-y-3.5 bg-white border-2 border-white" 
                aria-hidden="true" 
              />
              <div className="relative border-2 border-white bg-[#141b27] overflow-hidden aspect-[4/5]">
                <img
                  src={speakerPhoto}
                  alt="Akaash Tripathee - Guest of Honor"
                  className="w-full h-full object-cover object-top select-none transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Speaker Info */}
            <div>
              <span className="inline-block border border-[#55a8a8] bg-[#55a8a8]/15 px-2.5 py-0.5 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-[#55a8a8]">
                GUEST OF HONOR
              </span>
              <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
                AKAASH TRIPATHEE
              </h3>
              <p className="mt-4 font-mono text-sm sm:text-[0.95rem] leading-relaxed text-white/80 max-w-xl">
                Aakash Tripathee is an AI and Automation Engineer specializing in building scalable LLM and RAG applications. Additionally, he serves as the Community Manager for the TensorFlow User Group (TFUG) Ghaziabad, leading a network of over 10,000 developers.
              </p>

              {/* Motivating Tagline Quote with Teal Bar */}
              <div className="mt-6 flex items-start gap-3 pl-3.5 border-l-4 border-[#55a8a8]">
                <p className="font-mono text-sm sm:text-base font-semibold text-white/95 italic">
                  &ldquo;A motivating tag line here&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Speaker Slots / Announcing Soon Teaser Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            {/* Slot 02 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="border-2 border-white/20 bg-[#141b27] p-6 shadow-[6px_6px_0_#000000] flex items-center gap-6"
            >
              <div className="size-20 shrink-0 border-2 border-white/20 bg-[#de432c] flex items-center justify-center font-display font-black text-2xl text-white">
                02
              </div>
              <div>
                <span className="badge-3d-red px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-white">
                  SPEAKER 02
                </span>
                <h4 className="mt-1 font-display text-xl font-black text-white">
                  ANNOUNCING SOON
                </h4>
                <p className="mt-1 font-mono text-xs text-white/70">
                  AI &amp; Product Architect from top tech ecosystem.
                </p>
              </div>
            </motion.div>

            {/* Slot 03 */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="border-2 border-white/20 bg-[#387a5b] px-6 py-6 shadow-[6px_6px_0_#000000] flex items-center gap-6"
            >
              <div className="size-20 shrink-0 border-2 border-white/20 bg-[#387a5b] flex items-center justify-center font-display font-black text-2xl text-white">
                03
              </div>
              <div>
                <span className="border-1.5 border-white/20 bg-[#387a5b] px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-white shadow-[2px_2px_0_#000000]">
                  SPEAKER 03
                </span>
                <h4 className="mt-1 font-display text-xl font-black text-white">
                  ANNOUNCING SOON
                </h4>
                <p className="mt-1 font-mono text-xs text-white/70">
                  Open Source Leader &amp; Distributed Systems Specialist.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
