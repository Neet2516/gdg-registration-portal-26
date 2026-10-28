import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import arrowMarker from '../../assets/images/byte-talks/ArrowMarker.png';
import speaker1Img from '../../assets/images/speakers/speaker1.png';
import speaker2Img from '../../assets/images/speakers/speaker2.png';

interface Speaker {
  name: string;
  badge: string;
  role: string;
  company: string;
  prevCompany: string;
  education: string;
  image: string;
  linkedin: string;
  description: string;
  quote: string;
  skills: string[];
  theme: {
    accent: string;
    badgeBg: string;
    quoteBorder: string;
  };
}

const SPEAKERS: Speaker[] = [
  {
    name: 'Yash Khare',
    badge: 'ALUMNI KEYNOTE • AKGEC 2020-2024',
    role: 'Software Engineer',
    company: 'TraqCheck',
    prevCompany: 'Ex-Keploy (GSoC Mentor)',
    education: 'Ajay Kumar Garg Engineering College (2020–2024)',
    image: speaker1Img,
    linkedin: 'https://www.linkedin.com/in/khareyash05',
    description:
      'Software Engineer with deep experience in backend systems, software testing, and open-source contributions. Formerly associated with Keploy and now at TraqCheck, focusing on autonomous AI agents, recruitment intelligence technology, and high-performance backend systems.',
    quote: 'From open-source contributor at AKGEC to architecting production AI agent systems.',
    skills: ['Go', 'Backend Architecture', 'AI Agents', 'Open Source', 'API Development', 'Software Testing'],
    theme: {
      accent: '#de432c',
      badgeBg: 'border-[#de432c] text-[#de432c] bg-[#de432c]/10',
      quoteBorder: 'border-[#de432c]',
    },
  },
  {
    name: 'Akaash Tripathee',
    badge: 'AI GUEST OF HONOR • TFUG LEAD',
    role: 'AI/ML Systems Engineer',
    company: 'Headfield Solutions Pvt. Ltd.',
    prevCompany: 'Former SWE Intern @ Paytm',
    education: 'Organizer, TensorFlow User Group Ghaziabad • AWS Community Builder 2026',
    image: speaker2Img,
    linkedin: 'https://www.linkedin.com/in/akaash-t-bb9211212',
    description:
      'AI Systems Engineer focused on real-time conversational AI, autonomous voice agents, multimodal systems, and agentic infrastructure. As Community Manager for TensorFlow User Group (TFUG) Ghaziabad, he leads an active network of over 10,000 developers, hosting technical workshops and AI bootcamps.',
    quote: 'Demystifying real-time voice agents, multimodal LLM pipelines, and the future of agentic AI.',
    skills: ['Generative AI', 'Voice AI', 'Python & FastAPI', 'Gemini APIs', 'RAG & MCP', 'WebSockets', 'Cloud Computing'],
    theme: {
      accent: '#55a8a8',
      badgeBg: 'border-[#55a8a8] text-[#55a8a8] bg-[#55a8a8]/10',
      quoteBorder: 'border-[#55a8a8]',
    },
  },
];

export function SpeakersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-triggered progress for this section entering viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  // Turn/swing in from right to left like a sign board on scroll
  const targetX = useTransform(scrollYProgress, [0.08, 0.72], [140, 0]);
  const targetRotate = useTransform(scrollYProgress, [0.08, 0.72], [22, 0]);

  const smoothX = useSpring(targetX, { stiffness: 85, damping: 20 });
  const smoothRotate = useSpring(targetRotate, { stiffness: 85, damping: 20 });

  const signX = shouldReduceMotion ? 0 : smoothX;
  const signRotate = shouldReduceMotion ? 0 : smoothRotate;

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-[#1B1F27] pt-16 sm:pt-20 md:pt-28 lg:pt-32 pb-16 md:pb-24 text-white overflow-hidden" 
      id="speakers"
    >
      {/* Floating Sparkle & Diamond Stars as seen in the reference mockup */}
      <div className="absolute left-6 sm:left-12 top-6 sm:top-10 flex items-center gap-6 sm:gap-10 pointer-events-none select-none z-10" aria-hidden="true">
        <span className="text-xl sm:text-2xl text-[#f2c35b]/90 drop-shadow-[0_0_8px_rgba(242,195,91,0.5)]">✦</span>
        <span className="text-sm sm:text-base text-[#de432c]/85 drop-shadow-[0_0_8px_rgba(222,67,44,0.5)]">✦</span>
        <span className="text-base sm:text-lg text-[#55a8a8]/90 drop-shadow-[0_0_8px_rgba(85,168,168,0.5)]">✦</span>
        <span className="text-xl sm:text-2xl text-[#f2c35b]/90 drop-shadow-[0_0_8px_rgba(242,195,91,0.5)]">✦</span>
        <span className="text-sm sm:text-base text-[#de432c]/85 drop-shadow-[0_0_8px_rgba(222,67,44,0.5)]">✦</span>
      </div>

      {/* Directional Signpost Artwork anchored directly to the right edge of the screen */}
      <motion.div 
        style={{
          x: signX,
          rotate: signRotate,
          transformOrigin: '80% 80%',
        }}
        className="absolute -right-6 sm:-right-10 md:-right-14 lg:-right-18 xl:-right-22 top-6 sm:top-8 md:top-10 lg:top-12 w-[240px] sm:w-[320px] md:w-[420px] lg:w-[500px] xl:w-[560px] pointer-events-none select-none z-20"
      >
        <img
          src={arrowMarker}
          alt="Directional Signpost: Speaker Area, What is Commit Con?, Past Events"
          className="w-full h-auto object-contain drop-shadow-[10px_16px_0_rgba(0,0,0,0.4)]"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      <div className="relative z-10 mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Header Block with SPEAKERS on Left */}
        <div className="relative pt-4 pb-4">
          {/* SPEAKERS Title & Solid White Underline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-black uppercase text-white tracking-tight m-0 leading-tight">
              SPEAKERS
            </h2>
            {/* White underline spanning across */}
            <div className="w-full h-[2px] bg-white mt-4 sm:mt-5 mb-12 sm:mb-16" />
          </motion.div>
        </div>

        {/* Keynote Speakers List */}
        <div className="space-y-16 sm:space-y-20">
          {SPEAKERS.map((speaker, idx) => (
            <motion.div 
              key={speaker.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] items-center gap-8 md:gap-12 lg:gap-16 border-b border-white/15 pb-16 last:border-b-0 last:pb-0"
            >
              {/* Speaker Poster Artwork with Neo-brutalist offset backer */}
              <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto lg:mx-0">
                <div 
                  className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 bg-white border-2 border-[#1c242b] shadow-[6px_6px_0_#000000]" 
                  aria-hidden="true" 
                />
                <div className="relative border-2 border-white bg-[#141b27] overflow-hidden aspect-[4/5] shadow-[8px_8px_0_#000000]">
                  <img
                    src={speaker.image}
                    alt={`${speaker.name} - ${speaker.role}`}
                    className="w-full h-full object-cover object-top select-none transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Speaker Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className={`inline-block border px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-wider ${speaker.theme.badgeBg}`}>
                    {speaker.badge}
                  </span>
                  <span className="badge-3d-blue px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-white">
                    KEYNOTE SESSION
                  </span>
                </div>

                <div>
                  <h3 className="m-0 font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
                    {speaker.name}
                  </h3>
                  <p className="mt-1 font-mono text-sm sm:text-base font-bold text-[#f2c35b]">
                    {speaker.role} • <span className="text-white">{speaker.company}</span>{' '}
                    <span className="text-white/60 font-medium">({speaker.prevCompany})</span>
                  </p>
                </div>

                <p className="font-mono text-sm sm:text-[0.92rem] leading-relaxed text-white/80 max-w-2xl m-0">
                  {speaker.description}
                </p>

                {/* Skill & Domain Tags */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {speaker.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[0.68rem] font-bold text-white/90 uppercase tracking-wide shadow-[2px_2px_0_rgba(0,0,0,0.4)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Motivating Tagline Quote with Accent Bar */}
                <div className={`mt-5 flex items-start gap-3 pl-3.5 border-l-4 ${speaker.theme.quoteBorder} bg-white/[0.02] py-2`}>
                  <p className="font-mono text-xs sm:text-sm font-semibold text-white/90 italic m-0">
                    &ldquo;{speaker.quote}&rdquo;
                  </p>
                </div>

                {/* Social Connect Button */}
                <div className="pt-2">
                  <motion.a 
                    whileHover={{ x: -2, y: -2 }}
                    whileTap={{ x: 2, y: 2 }}
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-3d-white inline-flex items-center gap-2.5 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#1c242b] no-underline cursor-pointer"
                  >
                    <svg className="size-4 fill-[#0077b5]" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                    </svg>
                    <span>CONNECT ON LINKEDIN</span>
                    <span className="text-sm font-bold" aria-hidden="true">↗</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
