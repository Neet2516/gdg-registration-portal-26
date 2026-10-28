import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import micAsset from '../../assets/images/byte-talks/mic-asset.png';

interface TestimonialCard {
  quote: string;
  role: string;
  bg: string;
  textColor: string;
  quoteColor: string;
  rotate: string;
  gridSpan: string;
}

const testimonials: TestimonialCard[] = [
  {
    quote: 'I came with an idea and left with a team, a prototype and a trophy.',
    role: 'PAST PARTICIPANT • B.TECH',
    bg: 'bg-[#58A4B0]',
    textColor: 'text-[#1c242b]',
    quoteColor: 'text-[#1c242b]',
    rotate: '-rotate-2',
    gridSpan: 'lg:col-span-2',
  },
  {
    quote: 'I came with an idea and left with a team, a prototype and a trophy.',
    role: 'PAST PARTICIPANT • B.TECH',
    bg: 'bg-[#de432c]',
    textColor: 'text-white',
    quoteColor: 'text-white',
    rotate: 'rotate-1',
    gridSpan: 'lg:col-span-2',
  },
  {
    quote: 'I came with an idea and left with a team, a prototype and a trophy.',
    role: 'PAST PARTICIPANT • B.TECH',
    bg: 'bg-[#1c242b]',
    textColor: 'text-white',
    quoteColor: 'text-white',
    rotate: '-rotate-1',
    gridSpan: 'lg:col-span-2',
  },
  {
    quote: 'I came with an idea and left with a team, a prototype and a trophy.',
    role: 'PAST PARTICIPANT • B.TECH',
    bg: 'bg-[#387A5B]',
    textColor: 'text-white',
    quoteColor: 'text-white',
    rotate: 'rotate-2',
    gridSpan: 'lg:col-span-2 lg:col-start-2',
  },
  {
    quote: 'I came with an idea and left with a team, a prototype and a trophy.',
    role: 'PAST PARTICIPANT • B.TECH',
    bg: 'bg-[#de432c]',
    textColor: 'text-white',
    quoteColor: 'text-white',
    rotate: '-rotate-2',
    gridSpan: 'lg:col-span-2 lg:col-start-4',
  },
];

export function VoicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-triggered progress bound to this section entering/traversing viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smoothly rotate the microphone up to 60 degrees as user scrolls through the section
  const targetRotation = useTransform(scrollYProgress, [0.08, 0.72], [0, 60]);
  const smoothRotation = useSpring(targetRotation, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.001,
  });

  const micRotate = shouldReduceMotion ? 25 : smoothRotation;

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#1B1F27] pt-16 pb-28 md:pt-24 md:pb-36 text-white overflow-hidden" 
      id="community"
    >
      {/* Decorative Sparkle Stars */}
      <span className="sparkle-star absolute right-16 top-10 text-3xl text-white/30 select-none pointer-events-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute right-12 bottom-16 text-2xl text-[#58A4B0]/60 select-none pointer-events-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute right-1/4 bottom-10 text-xl text-[#f2c35b]/60 select-none pointer-events-none" aria-hidden="true">✦</span>

      <div className="relative z-10 mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Section Heading & Solid White Underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-black uppercase tracking-tight text-white m-0 leading-tight">
            VOICES FROM PAST SPEAKERS
          </h2>
          {/* Thin, white horizontal divider directly below the heading */}
          <div className="w-full h-[2px] bg-white mt-4 sm:mt-5" />
        </motion.div>

        {/* 5 Testimonial Cards in Staggered 3-over-2 Layout with Stacked Paper Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-10 lg:gap-y-12 items-start mb-12">
          {testimonials.map((card, index) => (
            <motion.div
              key={`${card.bg}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative group ${card.gridSpan} ${card.rotate} transition-transform`}
            >
              {/* Stacked Paper Effect: Subtle off-white backing layer */}
              <div 
                className="absolute inset-0 translate-x-3 translate-y-3 bg-[#FAF8F5] border-2 border-[#1c242b] shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-transform group-hover:translate-x-4 group-hover:translate-y-4" 
                aria-hidden="true" 
              />

              {/* Main Testimonial Card */}
              <div 
                className={`relative border-2 border-[#1c242b] p-6 sm:p-7 shadow-[4px_4px_0_rgba(0,0,0,0.35)] cursor-default ${card.bg} ${card.textColor}`}
              >
                {/* Double Quotation Mark Icon */}
                <svg 
                  className={`size-8 mb-4 fill-current ${card.quoteColor} opacity-95 select-none`} 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                {/* Quote Text */}
                <p className="my-2 font-display text-[1.12rem] sm:text-[1.22rem] font-bold leading-snug tracking-tight">
                  &ldquo;{card.quote}&rdquo;
                </p>

                {/* Role / Participant Label */}
                <div className="mt-5 border-t border-current/25 pt-3 font-mono text-[0.66rem] sm:text-[0.7rem] font-bold uppercase tracking-wider opacity-90">
                  {card.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Anchored Microphone Illustration at Bottom-Left with Scroll-Triggered ~60° Rotation */}
      <motion.div 
        style={{
          rotate: micRotate,
          transformOrigin: '15% 85%',
        }}
        className="absolute -left-12 sm:-left-16 md:-left-20 -bottom-14 sm:-bottom-16 md:-bottom-24 w-[240px] sm:w-[320px] md:w-[400px] lg:w-[460px] pointer-events-none select-none z-20"
      >
        <img
          src={micAsset}
          alt=""
          className="w-full h-auto object-contain drop-shadow-[10px_14px_0_rgba(0,0,0,0.45)]"
          loading="lazy"
          decoding="async"
        />
      </motion.div>
    </section>
  );
}
