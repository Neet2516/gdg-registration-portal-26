import { useEffect, useMemo, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ArrowUpRight, CheckCircle2, ChevronRight, LoaderCircle, Menu, X } from 'lucide-react';
import campusIllustration from '../assets/images/byte-talks/raw-05.png';
import compassIllustration from '../assets/images/byte-talks/compass.svg';
import arrowMarker from '../assets/images/byte-talks/ArrowMarker.png';
import micAsset from '../assets/images/byte-talks/mic-asset.png';
import speakerPhoto from '../assets/images/byte-talks/speaker_portrait.jpg';
import { BRANCHES, DOMAINS } from '../constants/recruitment';
import { useRecaptchaV3 } from '../hooks/useRecaptchaV3';
import { registerStudent, sendOtp, verifyOtp } from '../services/api';
import { generateUniversityEmail } from '../utils/formatters';

const eventDate = new Date(2026, 9, 30);

const faqs = [
  {
    question: 'What is BYTE TALKS?',
    answer: 'A campus event for technology conversations, new ideas, and people who enjoy building and learning together.',
  },
  {
    question: 'When is the event?',
    answer: 'BYTE TALKS is scheduled for 30 October 2026. The start time will be announced by the organizers.',
  },
  {
    question: 'Where will it take place?',
    answer: 'The event is planned for the CSIT Seminar Hall at AKGEC.',
  },
  {
    question: 'Who can attend?',
    answer: 'Eligibility and entry instructions will be shared by the organizers when registration details are confirmed.',
  },
  {
    question: 'Can I register on this page?',
    answer: 'Yes. Submit the form with your AKGEC details, verify the email OTP, and your registration will be sent to the event backend.',
  },
];

const initialForm = {
  fullName: '',
  phone: '',
  studentNumber: '',
  gender: '',
  branch: '',
  residence: '',
  domain: '',
  githubId: '',
  hackerrankId: '',
  unstopId: '',
  consent: false,
};

type FormValues = typeof initialForm;
type FormErrors = Partial<Record<keyof FormValues, string>>;
type RegistrationStep = 'form' | 'otp' | 'success';

function getEventCountdown() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const difference = eventDate.getTime() - today.getTime();

  if (difference < 0) return 'EVENT COMPLETE';
  if (difference === 0) return 'HAPPENING TODAY';

  const days = Math.ceil(difference / 86_400_000);
  return `${String(days).padStart(2, '0')} DAYS TO GO`;
}

function useLiveCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date('2026-10-30T16:00:00+05:30').getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date('2026-10-30T16:00:00+05:30').getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.fullName.trim().length < 2) errors.fullName = 'Enter your full name.';
  if (!/^\d{7,13}$/.test(values.studentNumber.trim())) errors.studentNumber = 'Student number must contain 7 to 13 digits.';
  if (!/^\d{10}$/.test(values.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number.';
  if (!values.gender) errors.gender = 'Choose your gender.';
  if (!values.branch) errors.branch = 'Choose your branch.';
  if (!values.residence) errors.residence = 'Choose Day Scholar or Hosteller.';
  if (!values.domain) errors.domain = 'Choose a domain.';
  if (!values.githubId.trim()) errors.githubId = 'Enter your GitHub username.';
  else if (!/^[a-zA-Z0-9-]+$/.test(values.githubId.trim())) errors.githubId = 'Use only letters, numbers, and hyphens.';
  if (!values.hackerrankId.trim()) errors.hackerrankId = 'Enter your HackerRank username.';
  if (!values.consent) errors.consent = 'Please confirm your consent to continue.';

  return errors;
}

const contentWidth = 'mx-auto w-[min(1128px,calc(100%-48px))] max-sm:w-[min(100%-32px,480px)]';
const buttonStyle =
  'inline-flex min-h-12 items-center justify-center gap-3 border border-[#10131a] bg-byte-coral px-4 py-3 text-center font-mono text-[.72rem] font-bold uppercase text-[#11141b] shadow-[4px_4px_0_#10131a] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#f06b53] hover:shadow-[2px_2px_0_#10131a] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-byte-yellow';

function SectionHeading({ eyebrow, children }: { eyebrow: string; children: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-byte-line pb-4 max-sm:flex-col max-sm:items-start">
      <span className="font-mono text-[.68rem] font-bold uppercase tracking-[.12em] text-byte-teal">{eyebrow}</span>
      <h2 className="m-0 text-right font-display text-[clamp(1.7rem,4vw,3.4rem)] leading-none tracking-[-.055em] text-byte-text max-sm:text-left max-sm:text-[clamp(1.7rem,8vw,2.5rem)]">
        {children}
      </h2>
    </div>
  );
}

function EventHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-30 w-full pt-6 pb-2"
    >
      <div className="mx-auto flex w-[min(1320px,calc(100%-48px))] items-center justify-between max-sm:w-[calc(100%-32px)]">
        {/* Brand */}
        <a 
          className="inline-flex items-center gap-3 no-underline group cursor-pointer" 
          href="#home" 
          onClick={closeMenu} 
          aria-label="BYTE TALKS home"
        >
          <motion.span 
            whileHover={{ scale: 1.15, rotate: 4 }}
            whileTap={{ scale: 0.95 }}
            className="block size-6 shrink-0 border-[1.5px] border-[#1c242b] bg-[#de432c] shadow-[2px_2px_0_#1c242b]" 
            aria-hidden="true" 
          />
          <div className="flex flex-col">
            <span className="font-display text-[1.22rem] font-black leading-none tracking-tight text-[#1c242b]">
              BYTE TALKS
            </span>
            <span className="mt-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#2c373d] leading-none">
              AKGEC CAMPUS
            </span>
          </div>
        </a>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="hidden border-2 border-[#1c242b] bg-white p-2 text-[#1c242b] shadow-[3px_3px_0_#1c242b] focus-visible:outline-2 max-md:inline-flex cursor-pointer"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </motion.button>

        {/* Links */}
        <nav
          className={`${
            menuOpen ? 'max-md:flex' : 'max-md:hidden'
          } flex items-center gap-8 md:gap-10 font-mono text-[0.95rem] font-bold text-[#1c242b] max-md:absolute max-md:left-4 max-md:right-4 max-md:top-full max-md:mt-3 max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:border-2 max-md:border-[#1c242b] max-md:bg-[#B4DDD7] max-md:p-4 max-md:shadow-[5px_5px_0_#1c242b]`}
          aria-label="Main navigation"
        >
          <a 
            className="text-[#1c242b] transition-colors hover:text-[#de432c] max-md:border-b max-md:border-[#1c242b]/20 max-md:py-3" 
            href="#about" 
            onClick={closeMenu}
          >
            About
          </a>
          <a 
            className="text-[#1c242b] transition-colors hover:text-[#de432c] max-md:border-b max-md:border-[#1c242b]/20 max-md:py-3" 
            href="#faq" 
            onClick={closeMenu}
          >
            FAQs
          </a>
          <a 
            className="text-[#1c242b] transition-colors hover:text-[#de432c] max-md:border-b max-md:border-[#1c242b]/20 max-md:py-3" 
            href="#speakers" 
            onClick={closeMenu}
          >
            Mentors
          </a>
          <motion.a 
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ x: 2, y: 2 }}
            className="btn-3d-red inline-flex items-center justify-center px-4 py-1.5 font-mono text-[0.8rem] font-bold uppercase tracking-wider text-white no-underline max-md:mt-3 cursor-pointer" 
            href="#register" 
            onClick={closeMenu}
          >
            REGISTER
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
}

function EventHero() {
  const countdown = useMemo(getEventCountdown, []);
  const timeLeft = useLiveCountdown();

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' as const },
    },
  };

  return (
    <section 
      className="relative isolate overflow-hidden text-[#1c242b]" 
      id="home" 
      aria-labelledby="bt-title"
    >
      <div className="relative mx-auto w-[min(1320px,calc(100%-48px))] pt-5 md:pt-9 max-sm:w-[calc(100%-32px)]">
        {/* Two-column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] items-start gap-8 lg:gap-10">
          {/* Left Column */}
          <motion.div 
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5">
              <span className="badge-3d-red px-2.5 py-0.5 font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-wider text-white inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                REGISTRATION OPEN
              </span>
              <span className="badge-3d-blue px-2.5 py-0.5 font-mono text-[0.62rem] md:text-[0.68rem] font-bold uppercase tracking-wider text-white">
                AKGEC • GHAZIABAD
              </span>
            </motion.div>

            {/* Giant 3D Typography */}
            <h1 id="bt-title" className="mt-4 mb-2 flex flex-col font-display font-black leading-[0.82] uppercase select-none">
              <motion.span 
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="hero-3d-red text-[clamp(4.8rem,11.2vw,9.4rem)] tracking-tight block"
              >
                BYTE
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="hero-3d-yellow text-[clamp(4.8rem,11.2vw,9.4rem)] tracking-tight -mt-2 md:-mt-3 block"
              >
                TALKS
              </motion.span>
              <motion.div 
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.28, type: 'spring', stiffness: 200, damping: 16 }}
                className="hero-2026-box px-6 py-1.5 md:px-7 md:py-2 mt-3 md:mt-4 w-fit"
              >
                <span className="text-white text-[clamp(2.8rem,6.8vw,5.5rem)] font-display font-black leading-none tracking-tight block">
                  2026
                </span>
              </motion.div>
            </h1>

            {/* Tagline */}
            <motion.div variants={itemVariants} className="my-5 font-mono font-bold text-[1.25rem] md:text-[1.4rem] text-[#1c242b] leading-snug">
              <p className="m-0">Connect · Inspire · Grow</p>
              <p className="m-0 mt-0.5 text-xs font-semibold tracking-wider uppercase text-[#1c242b]/70">The premier technical forum at AKGEC Ghaziabad.</p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-1 mb-8">
              <motion.a 
                href="#register" 
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                className="btn-3d-red inline-flex items-center gap-3 px-6 py-3.5 font-mono text-[0.84rem] font-bold uppercase tracking-wider no-underline cursor-pointer"
              >
                <span>REGISTER NOW</span>
                <span className="text-base leading-none" aria-hidden="true">→</span>
              </motion.a>
              <motion.a 
                href="#about" 
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                className="btn-3d-white inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[0.84rem] font-bold uppercase tracking-wider no-underline cursor-pointer"
              >
                SEE DETAILS
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Column: Compass Dial Clock Artwork */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex justify-center lg:justify-end -mt-2 lg:-mt-10"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative w-[min(100%,540px)] max-lg:max-w-[440px] aspect-square"
            >
              <img
                src={compassIllustration}
                alt={`BYTE TALKS countdown clock: ${countdown}`}
                className="w-full h-full object-contain select-none drop-shadow-[8px_8px_0px_rgba(28,36,43,0.18)]"
                loading="eager"
                decoding="async"
              />
              {/* Event Countdown Display inside Compass Dark Center Circle */}
              <div 
                className="absolute top-[48.9%] left-[50.1%] -translate-x-1/2 -translate-y-1/2 flex items-baseline justify-center font-display font-black text-[clamp(1.05rem,2.8vw,1.95rem)] leading-none select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-tight whitespace-nowrap"
                aria-label={`Registration closes in ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes`}
              >
                <span className="text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[#de432c] text-[0.72em] font-black ml-0.5 mr-1.5 sm:mr-2">D</span>
                <span className="text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[#de432c] text-[0.72em] font-black ml-0.5 mr-1.5 sm:mr-2">H</span>
                <span className="text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[#de432c] text-[0.72em] font-black ml-0.5">M</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Campus Sticker Illustration positioned at bottom left-to-center */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 -mt-8 sm:-mt-16 md:-mt-26 lg:-mt-40 w-[min(98%,880px)] lg:w-[68%] -ml-1 sm:-ml-3 lg:-ml-6"
        >
          <img
            src={campusIllustration}
            alt="Illustrated AKGEC Campus Sticker"
            className="w-full h-auto object-contain select-none drop-shadow-[8px_14px_0px_rgba(28,36,43,0.25)]"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </div>
    </section>
  );
}

function EventInfoBar() {
  const timeLeft = useLiveCountdown();

  return (
    <div className="relative z-20 w-full bg-[#13171e] text-white">
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

function StatsBar() {
  const stats = [
    { value: '04', label: 'DAYS' },
    { value: '04', label: 'SPEAKERS' },
    { value: '65', label: 'MIN PER TALK' },
    { value: '200', label: 'SEATS ONLY' },
  ];

  return (
    <div className="relative z-20 w-full border-y-2 border-[#1c242b] bg-[#de432c] text-white">
      <div className="mx-auto grid w-[min(1320px,calc(100%-48px))] grid-cols-2 md:grid-cols-4 max-sm:w-[calc(100%-32px)]">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className={`py-6 px-4 text-center transition-all ${
              idx % 2 === 0 ? 'border-r-2 border-[#1c242b]' : ''
            } ${idx === 1 ? 'md:border-r-2 md:border-[#1c242b]' : ''} ${
              idx === 0 || idx === 1 ? 'max-sm:border-b-2 max-sm:border-[#1c242b]' : ''
            }`}
          >
            <div className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-none text-white tracking-tight">
              {s.value}
            </div>
            <div className="mt-1 font-mono text-[0.72rem] md:text-[0.78rem] font-bold uppercase tracking-wider text-white/90">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AboutSection() {
  return (
    <section className="relative w-full bg-white py-16 md:py-24 text-[#1c242b]" id="about">
      {/* Decorative sparkle stars with subtle twinkle animation */}
      <motion.span 
        animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] }} 
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="sparkle-star absolute left-8 top-12 text-2xl text-[#1c242b]/40 select-none" 
        aria-hidden="true"
      >
        ✦
      </motion.span>
      <motion.span 
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }} 
        transition={{ repeat: Infinity, duration: 5, delay: 1, ease: 'easeInOut' }}
        className="sparkle-star absolute right-16 top-20 text-3xl text-[#1c242b]/30 select-none" 
        aria-hidden="true"
      >
        ✦
      </motion.span>
      <motion.span 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.85, 0.4] }} 
        transition={{ repeat: Infinity, duration: 3.5, delay: 0.5, ease: 'easeInOut' }}
        className="sparkle-star absolute left-1/4 bottom-10 text-xl text-[#de432c]/50 select-none" 
        aria-hidden="true"
      >
        ✦
      </motion.span>

      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center gap-12 lg:gap-16">
          {/* Left: Vintage Tech Poster Card & Overview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Vintage Tech Poster Card with Neo-brutalist hover lift */}
            <motion.div 
              whileHover={{ y: -4, boxShadow: '12px 12px 0px #1c242b' }}
              className="relative mb-8 max-w-[420px] border-2 border-[#1c242b] bg-[#141b27] p-6 shadow-[8px_8px_0_#1c242b] transition-all cursor-default"
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/20 pb-3 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#55a8a8]">
                <span>SPECIAL EDITION</span>
                <span>AKGEC CAMPUS</span>
              </div>
              <div className="relative flex items-center justify-center py-6">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
                <div className="relative z-10 text-center">
                  <div className="font-display text-3xl font-black text-white leading-none tracking-tight">
                    JOIN US FOR<br /><span className="text-[#e2a444]">TECH TALKS</span>
                  </div>
                  <p className="mt-2 font-mono text-[0.68rem] font-bold uppercase text-white/80">
                    CONVERSATIONS &amp; IDEAS
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3">
                <span className="badge-3d-red px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase text-white">
                  30 OCT 2026
                </span>
                <span className="font-mono text-[0.6rem] font-bold text-white/60">
                  CSIT HALL
                </span>
              </div>
            </motion.div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge-3d-blue px-2.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-white">
                CAMPUS EVENT
              </span>
              <span className="border-1.5 border-[#1c242b] bg-[#387a5b] px-2.5 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0_#1c242b]">
                INNOVATION
              </span>
            </div>

            <h2 className="font-display text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.05] tracking-tight text-[#1c242b] my-4">
              A day for fresh ideas, thoughtful conversations, and the people shaping what comes next.
            </h2>
            <p className="font-mono text-[0.88rem] md:text-[0.94rem] leading-relaxed text-[#35464a] max-w-xl">
              BYTE TALKS brings the campus community together around technology and creativity. Join us at AKGEC for an afternoon of learning, sharing, and connecting with builders and thinkers.
            </p>
          </motion.div>

          {/* Right: Directional Signpost Artwork with floating animation */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div 
              animate={{ y: [0, -8, 0], rotate: [0, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="relative w-[min(100%,460px)]"
            >
              <img
                src={arrowMarker}
                alt="Directional Signpost: Speaker Area, What is Byte Talks, Past Events"
                className="w-full h-auto object-contain select-none drop-shadow-[10px_14px_0_rgba(28,36,43,0.22)]"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section className="relative w-full bg-white py-16 md:py-24 text-[#1c242b]">
      {/* Decorative stars */}
      <span className="sparkle-star absolute right-12 top-10 text-3xl text-[#de432c]/60 select-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute left-14 top-1/2 text-2xl text-[#1c242b]/30 select-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute right-1/4 bottom-12 text-2xl text-[#1c242b]/40 select-none" aria-hidden="true">✦</span>

      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <span className="border-1.5 border-[#1c242b] bg-[#387a5b] px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0_#1c242b]">
            SPEAKERS &amp; MENTORS
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black leading-tight text-[#1c242b]">
            Good conversations start with great people.
          </h2>
          <p className="font-mono text-sm font-bold text-[#35464a]">
            Speaker and mentor details will be announced shortly.
          </p>
        </motion.div>

        {/* Staggered Speaker Cards */}
        <div className="space-y-16 md:space-y-24">
          {/* Speaker 1: Left */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-[320px_1fr] items-center gap-8 md:gap-12"
          >
            <motion.div 
              whileHover={{ y: -4, boxShadow: '12px 12px 0px #1c242b' }}
              className="border-2 border-[#1c242b] bg-white p-3 shadow-[8px_8px_0_#1c242b] transition-all cursor-default"
            >
              <div className="overflow-hidden border border-[#1c242b] aspect-square">
                <img
                  src={speakerPhoto}
                  alt="Guest Speaker Portrait"
                  className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
            <div>
              <span className="badge-3d-blue px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-white">
                SPEAKER 01
              </span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl font-black text-[#1c242b]">
                Industry Leader &amp; Tech Architect
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-[#35464a] max-w-xl">
                Leading engineering initiatives, building resilient distributed systems, and mentoring the next generation of software innovators.
              </p>
            </div>
          </motion.div>

          {/* Speaker 2: Right Staggered */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_320px] items-center gap-8 md:gap-12 md:text-right"
          >
            <div className="order-2 md:order-1">
              <span className="badge-3d-red px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-white">
                SPEAKER 02
              </span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl font-black text-[#1c242b]">
                AI &amp; Product Specialist
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-[#35464a] max-w-xl md:ml-auto">
                Exploring cutting-edge advancements in machine learning, user experiences, and bridging code with real-world human impact.
              </p>
            </div>
            <motion.div 
              whileHover={{ y: -4, boxShadow: '12px 12px 0px #1c242b' }}
              className="order-1 md:order-2 border-2 border-[#1c242b] bg-[#de432c] p-6 shadow-[8px_8px_0_#1c242b] bg-dot-pattern-light transition-all cursor-default"
            >
              <div className="aspect-[3/4] border-2 border-[#1c242b] bg-[#de432c] flex flex-col justify-between p-4 shadow-[4px_4px_0_#1c242b]">
                <span className="font-mono text-xs font-bold text-white uppercase">BT / 02</span>
                <div className="flex flex-col items-center">
                  <div className="size-20 rounded-full border-2 border-[#1c242b] bg-[#1c242b] shadow-[3px_3px_0_#ffffff]" />
                  <div className="w-32 h-16 rounded-t-full border-2 border-[#1c242b] bg-[#1c242b] -mt-1" />
                </div>
                <span className="font-mono text-[0.65rem] font-bold text-white uppercase tracking-widest text-center">ANNOUNCING SOON</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Speaker 3: Left Staggered */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-[320px_1fr] items-center gap-8 md:gap-12"
          >
            <motion.div 
              whileHover={{ y: -4, boxShadow: '12px 12px 0px #1c242b' }}
              className="border-2 border-[#1c242b] bg-[#387a5b] p-6 shadow-[8px_8px_0_#1c242b] bg-dot-pattern-light transition-all cursor-default"
            >
              <div className="aspect-[3/4] border-2 border-[#1c242b] bg-[#387a5b] flex flex-col justify-between p-4 shadow-[4px_4px_0_#1c242b]">
                <span className="font-mono text-xs font-bold text-white uppercase">BT / 03</span>
                <div className="flex flex-col items-center">
                  <div className="size-20 rounded-full border-2 border-[#1c242b] bg-[#1c242b] shadow-[3px_3px_0_#ffffff]" />
                  <div className="w-32 h-16 rounded-t-full border-2 border-[#1c242b] bg-[#1c242b] -mt-1" />
                </div>
                <span className="font-mono text-[0.65rem] font-bold text-white uppercase tracking-widest text-center">ANNOUNCING SOON</span>
              </div>
            </motion.div>
            <div>
              <span className="border-1.5 border-[#1c242b] bg-[#387a5b] px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0_#1c242b]">
                SPEAKER 03
              </span>
              <h3 className="mt-3 font-display text-2xl md:text-3xl font-black text-[#1c242b]">
                Open Source &amp; Systems Builder
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-[#35464a] max-w-xl">
                Passionate about open technologies, community driven software development, and empowering student engineers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VoicesSection() {
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
    <section className="relative w-full bg-white py-16 md:py-24 text-[#1c242b] overflow-hidden">
      {/* Decorative sparkle stars */}
      <span className="sparkle-star absolute right-16 top-10 text-3xl text-[#1c242b]/40 select-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute right-1/3 bottom-12 text-2xl text-[#de432c]/50 select-none" aria-hidden="true">✦</span>

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

function PreviousEventsSection() {
  const previousEvents = [
    {
      edition: 'EDITION 2024',
      name: 'BYTE TALKS 1.0',
      badge: 'BT-24',
      topColor: 'bg-[#387A5B]',
    },
    {
      edition: 'EDITION 2025',
      name: 'BYTE TALKS 2.0',
      badge: 'BT-25',
      topColor: 'bg-[#de432c]',
    },
    {
      edition: 'EDITION 2025.2',
      name: 'BYTE TALKS 2.5',
      badge: 'BT-25.2',
      topColor: 'bg-[#58A4B0]',
    },
  ];

  return (
    <section className="relative w-full bg-white py-16 md:py-24 text-[#1c242b]">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12"
        >
          <span className="badge-3d-blue px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white">
            04 / THE ARCHIVE
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black text-[#1c242b]">
            PREVIOUS EVENTS
          </h2>
        </motion.div>

        {/* 3 Archive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previousEvents.map((event, index) => (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -6, boxShadow: '12px 12px 0px #1c242b' }}
              className="border-2 border-[#1c242b] overflow-hidden shadow-[8px_8px_0_#1c242b] transition-all"
            >
              {/* Top Colorful Header */}
              <div className={`${event.topColor} p-6 border-b-2 border-[#1c242b] bg-dot-pattern-light flex justify-between items-start min-h-[140px]`}>
                <span className="badge-3d-red px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase text-white">
                  {event.badge}
                </span>
              </div>
              {/* Bottom Dark Navy Body */}
              <div className="bg-[#202734] p-6 text-white">
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-[#55a8a8]">
                  {event.edition}
                </span>
                <h3 className="mt-2 font-display text-2xl font-black tracking-tight text-white">
                  {event.name}
                </h3>
                <motion.button
                  whileHover={{ x: -2, y: -2 }}
                  whileTap={{ x: 2, y: 2 }}
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 border border-white/30 bg-[#2a3446] px-4 py-2 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_#000] hover:bg-[#344158] transition-colors cursor-pointer"
                >
                  SEE DETAILS <ArrowUpRight size={14} aria-hidden="true" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative w-full bg-white py-16 md:py-24 text-[#1c242b]">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <span className="badge-3d-red px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white">
            05 / GOOD TO KNOW
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black text-[#1c242b]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </motion.div>

        {/* Accordion List with AnimatePresence */}
        <div className="space-y-4 max-w-4xl">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="border-2 border-[#1c242b] bg-[#202734] shadow-[5px_5px_0_#1c242b] transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between gap-4 font-mono text-[0.88rem] md:text-[0.98rem] font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[0.75rem] font-bold text-[#de432c]">
                      0{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`shrink-0 text-[#de432c] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 pt-1 font-mono text-[0.82rem] leading-relaxed text-white/80 border-t border-white/10">
                        <p className="m-0 pl-8">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10">
          <motion.a
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ x: 2, y: 2 }}
            href="#register"
            className="btn-3d-red inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[0.82rem] font-bold uppercase tracking-wider no-underline cursor-pointer"
          >
            <span>HAVE A QUESTION? REGISTER YOUR INTEREST</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}

function RegistrationSection() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState('');
  const [step, setStep] = useState<RegistrationStep>('form');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = generateUniversityEmail(values.fullName, values.studentNumber);
  const { executeRecaptcha } = useRecaptchaV3();

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setNotice('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setNotice('Check the highlighted fields and try again.');
      return;
    }

    if (!email) {
      setNotice('Enter your name and student number to generate your AKGEC email.');
      return;
    }

    setIsSubmitting(true);
    setNotice('');

    try {
      const captchaToken = await executeRecaptcha('registration');
      await sendOtp({
        name: values.fullName.trim(),
        email,
        studentNumber: values.studentNumber.trim(),
        captchaToken,
      });
      setStep('otp');
      setNotice(`A verification code has been sent to ${email}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not send the verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setNotice('Enter the 6-digit verification code from your college email.');
      return;
    }

    setIsSubmitting(true);
    setNotice('');

    try {
      await verifyOtp({ email, otp });
      await registerStudent({
        name: values.fullName.trim(),
        studentNumber: values.studentNumber.trim(),
        email,
        gender: values.gender,
        branch: values.branch,
        phone: values.phone.trim(),
        residence: values.residence,
        domain: values.domain,
        githubId: values.githubId.trim(),
        hackerrankId: values.hackerrankId.trim(),
        unstopId: values.unstopId.trim() || undefined,
      });
      setStep('success');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputProps = (field: keyof FormValues) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  const fieldLabel = 'flex min-w-0 flex-col gap-2 font-mono text-[.62rem] font-bold tracking-wide text-byte-text';
  const inputStyle = 'bt-input min-h-11 w-full border border-[#a4a6aa] bg-byte-deep px-3 py-2 font-mono text-[.73rem] tracking-normal text-byte-text placeholder:text-[#888c93] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-byte-yellow aria-[invalid=true]:border-byte-coral';
  const errorStyle = 'font-mono text-[.58rem] font-normal tracking-normal text-[#ff8975]';
  const selectStyle = `${inputStyle} appearance-none`;

  return (
    <section className={`${contentWidth} scroll-mt-8 pb-28 pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pb-[4.5rem] max-sm:pt-[4.5rem]`}>
      <SectionHeading eyebrow="06 / YOUR TURN">REGISTER YOURSELF</SectionHeading>
      <div className="grid grid-cols-[.8fr_1.2fr] items-start gap-[clamp(2rem,7vw,6rem)] pt-12 max-[820px]:grid-cols-1 max-[820px]:gap-6 max-[820px]:pt-8">
        <div className="sticky top-8 max-[820px]:static">
          <span className="grid size-[130px] rotate-[-5deg] place-content-center border border-byte-text bg-byte-green text-center font-display text-lg leading-[1.05] text-byte-text shadow-[7px_7px_0_var(--color-byte-coral)] max-[820px]:size-[100px] max-[820px]:text-sm">YOU<br />BELONG<br />HERE</span>
          <h3 className="mb-4 mt-9 max-w-[380px] font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.07] tracking-[-.07em]">Save your spot in the conversation.</h3>
          <p className="max-w-[340px] font-mono text-[.74rem] leading-[1.8] text-byte-muted">Verify your AKGEC email to complete your registration for BYTE TALKS.</p>
          <div className="mt-4 inline-flex items-center gap-3 border border-byte-line/50 px-3 py-2.5 font-mono text-[.53rem] text-byte-muted">
            <span className="size-[7px] rounded-full bg-byte-teal shadow-[0_0_0_4px_#55a8a825]" /> EMAIL OTP VERIFICATION REQUIRED
          </div>
        </div>
        <div className="border border-byte-text bg-byte-surface p-[clamp(1.25rem,4vw,2.25rem)] shadow-[8px_8px_0_#11141b]">
          {step === 'success' ? (
            <div className="flex flex-col items-center py-10 text-center" role="status">
              <CheckCircle2 className="mb-5 text-byte-teal" size={52} aria-hidden="true" />
              <span className="font-mono text-[.62rem] font-bold uppercase tracking-[.12em] text-byte-teal">REGISTRATION COMPLETE</span>
              <h3 className="mb-2 mt-3 font-display text-3xl tracking-tight">You’re in, {values.fullName.split(/\s+/)[0]}.</h3>
              <p className="max-w-md font-mono text-[.68rem] leading-relaxed text-byte-muted">
                Your BYTE TALKS registration was submitted successfully. We sent the verification to {email}.
              </p>
            </div>
          ) : step === 'otp' ? (
            <>
              <div className="mb-7 flex justify-between gap-4 border-b border-byte-line/50 pb-4 font-mono text-[.59rem] font-bold tracking-wide text-byte-teal max-sm:text-[.51rem]">
                <span>VERIFY YOUR EMAIL</span><span>STEP 2 / 2</span>
              </div>
              <form className="grid gap-5" onSubmit={handleOtpSubmit} noValidate>
                <p className="m-0 font-mono text-[.7rem] leading-relaxed text-byte-muted">Enter the 6-digit code sent to <strong className="text-byte-text">{email}</strong>.</p>
                <label className={fieldLabel} htmlFor="registrationOtp">
                  <span>EMAIL VERIFICATION CODE <b className="text-byte-coral">*</b></span>
                  <input
                    className={`${inputStyle} text-center text-xl tracking-[.5em]`}
                    id="registrationOtp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    aria-label="6-digit email verification code"
                  />
                </label>
                {notice && <p className="m-0 border-l-[3px] border-byte-yellow bg-byte-yellow/10 p-3 font-mono text-[.62rem] leading-relaxed text-byte-text" role="status" aria-live="polite">{notice}</p>}
                <button className={`${buttonStyle} w-full disabled:cursor-wait disabled:opacity-60`} type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <><LoaderCircle className="animate-spin" size={16} /> VERIFYING REGISTRATION</> : <>VERIFY &amp; REGISTER <ArrowUpRight size={16} aria-hidden="true" /></>}
                </button>
                <button className="justify-self-center border-0 bg-transparent font-mono text-[.62rem] uppercase text-byte-muted underline underline-offset-4 hover:text-byte-text" type="button" onClick={() => { setStep('form'); setNotice(''); }}>
                  Back to your details
                </button>
              </form>
            </>
          ) : (
            <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
              <div className="mb-2 flex justify-between gap-4 border-b border-byte-line/50 pb-4 font-mono text-[.59rem] font-bold tracking-wide text-byte-teal max-sm:text-[.51rem]">
                <span>YOUR DETAILS</span><span>BYTE TALKS / 2026</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 max-sm:grid-cols-1">
                <label className={`${fieldLabel} col-span-full`} htmlFor="fullName">
                  <span>FULL NAME <b className="text-byte-coral">*</b></span>
                  <input className={inputStyle} id="fullName" autoComplete="name" value={values.fullName} onChange={(event) => updateField('fullName', event.target.value)} {...inputProps('fullName')} />
                  {errors.fullName && <small className={errorStyle} id="fullName-error">{errors.fullName}</small>}
                </label>
                <label className={fieldLabel} htmlFor="studentNumber">
                  <span>STUDENT NUMBER <b className="text-byte-coral">*</b></span>
                  <input className={inputStyle} id="studentNumber" inputMode="numeric" autoComplete="off" maxLength={13} value={values.studentNumber} onChange={(event) => updateField('studentNumber', event.target.value.replace(/\D/g, '').slice(0, 13))} {...inputProps('studentNumber')} />
                  {errors.studentNumber && <small className={errorStyle} id="studentNumber-error">{errors.studentNumber}</small>}
                </label>
                <label className={fieldLabel} htmlFor="phone">
                  <span>PHONE NUMBER <b className="text-byte-coral">*</b></span>
                  <input className={inputStyle} id="phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} value={values.phone} onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} {...inputProps('phone')} />
                  {errors.phone && <small className={errorStyle} id="phone-error">{errors.phone}</small>}
                </label>
                <label className={`${fieldLabel} col-span-full`} htmlFor="collegeEmail">
                  <span>COLLEGE EMAIL <b className="text-byte-coral">*</b></span>
                  <input className={inputStyle} id="collegeEmail" type="email" autoComplete="email" value={email} readOnly aria-describedby="email-help" />
                  <small className="font-mono text-[.56rem] font-normal tracking-normal text-byte-muted" id="email-help">Generated from your first name and student number: firstname{values.studentNumber || '1234567'}@akgec.ac.in</small>
                </label>
                <label className={fieldLabel} htmlFor="gender">
                  <span>GENDER <b className="text-byte-coral">*</b></span>
                  <select className={selectStyle} id="gender" value={values.gender} onChange={(event) => updateField('gender', event.target.value)} {...inputProps('gender')}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <small className={errorStyle} id="gender-error">{errors.gender}</small>}
                </label>
                <label className={fieldLabel} htmlFor="branch">
                  <span>BRANCH <b className="text-byte-coral">*</b></span>
                  <select className={selectStyle} id="branch" value={values.branch} onChange={(event) => updateField('branch', event.target.value)} {...inputProps('branch')}>
                    <option value="">Select branch</option>
                    {BRANCHES.map((branch) => <option value={branch} key={branch}>{branch}</option>)}
                  </select>
                  {errors.branch && <small className={errorStyle} id="branch-error">{errors.branch}</small>}
                </label>
                <fieldset className="col-span-full m-0 border-0 p-0">
                  <legend className={`${fieldLabel} mb-2`}>RESIDENCY <b className="text-byte-coral">*</b></legend>
                  <div className="grid grid-cols-2 gap-3">
                    {(['Day Scholar', 'Hosteller'] as const).map((residence) => (
                      <label className={`flex min-h-11 cursor-pointer items-center gap-3 border px-3 py-2 font-mono text-[.65rem] ${values.residence === residence ? 'border-byte-teal bg-byte-teal/10 text-byte-text' : 'border-byte-line/50 text-byte-muted'}`} key={residence}>
                        <input className="size-4 accent-byte-teal" type="radio" name="residence" value={residence} checked={values.residence === residence} onChange={() => updateField('residence', residence)} />
                        {residence}
                      </label>
                    ))}
                  </div>
                  {errors.residence && <small className={`${errorStyle} mt-2 block`} id="residence-error">{errors.residence}</small>}
                </fieldset>
                <label className={`${fieldLabel} col-span-full`} htmlFor="domain">
                  <span>DOMAIN <b className="text-byte-coral">*</b></span>
                  <select className={selectStyle} id="domain" value={values.domain} onChange={(event) => updateField('domain', event.target.value)} {...inputProps('domain')}>
                    <option value="">Select domain</option>
                    {DOMAINS.map((domain) => <option value={domain} key={domain}>{domain}</option>)}
                  </select>
                  {errors.domain && <small className={errorStyle} id="domain-error">{errors.domain}</small>}
                </label>
                <label className={fieldLabel} htmlFor="githubId">
                  <span>GITHUB USERNAME <b className="text-byte-coral">*</b></span>
                  <input className={inputStyle} id="githubId" autoComplete="off" value={values.githubId} onChange={(event) => updateField('githubId', event.target.value)} {...inputProps('githubId')} />
                  {errors.githubId && <small className={errorStyle} id="githubId-error">{errors.githubId}</small>}
                </label>
                <label className={fieldLabel} htmlFor="hackerrankId">
                  <span>HACKERRANK USERNAME <b className="text-byte-coral">*</b></span>
                  <input className={inputStyle} id="hackerrankId" autoComplete="off" value={values.hackerrankId} onChange={(event) => updateField('hackerrankId', event.target.value)} {...inputProps('hackerrankId')} />
                  {errors.hackerrankId && <small className={errorStyle} id="hackerrankId-error">{errors.hackerrankId}</small>}
                </label>
                <label className={`${fieldLabel} col-span-full`} htmlFor="unstopId">
                  <span>UNSTOP USERNAME <span className="font-normal text-byte-muted">(OPTIONAL)</span></span>
                  <input className={inputStyle} id="unstopId" autoComplete="off" value={values.unstopId} onChange={(event) => updateField('unstopId', event.target.value)} />
                </label>
              </div>
              <label className={`flex items-start gap-3 border p-4 font-mono text-[.62rem] leading-relaxed text-byte-muted ${errors.consent ? 'border-byte-coral' : 'border-byte-line/50'}`}>
                <input className="mt-0.5 size-[18px] shrink-0 accent-byte-teal" type="checkbox" checked={values.consent} onChange={(event) => updateField('consent', event.target.checked)} {...inputProps('consent')} />
                <span>I agree to the code of conduct and to receive event updates. <b className="text-byte-coral">*</b></span>
              </label>
              {errors.consent && <small className={`${errorStyle} -mt-3 block`} id="consent-error">{errors.consent}</small>}
              {notice && <p className="m-0 border-l-[3px] border-byte-yellow bg-byte-yellow/10 p-3 font-mono text-[.62rem] leading-relaxed text-byte-text" role="status" aria-live="polite">{notice}</p>}
              <motion.button 
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                className={`${buttonStyle} w-full disabled:cursor-wait disabled:opacity-60 cursor-pointer`} 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? <><LoaderCircle className="animate-spin" size={16} /> SENDING VERIFICATION CODE</> : <>SEND EMAIL VERIFICATION CODE <ArrowUpRight size={16} aria-hidden="true" /></>}
              </motion.button>
              <p className="m-0 font-mono text-[.52rem] leading-relaxed text-byte-muted">* REQUIRED FIELD · EMAIL VERIFICATION IS REQUIRED TO REGISTER</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function EventFooter() {
  return (
    <footer className="relative w-full bg-[#13171e] text-white pt-16 overflow-hidden border-t-2 border-[#1c242b]">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-16 border-b border-white/10">
          {/* Brand & info */}
          <div>
            <div className="inline-flex items-center gap-3">
              <span 
                className="block size-6 shrink-0 border-[1.5px] border-white/40 bg-[#de432c] shadow-[2px_2px_0_#ffffff]" 
                aria-hidden="true" 
              />
              <span className="font-display text-xl font-black text-white tracking-tight">
                BYTE TALKS
              </span>
            </div>
            <p className="mt-4 font-mono text-[0.8rem] leading-relaxed text-white/70 max-w-sm">
              One campus. Many perspectives.<br />
              Ajay Kumar Garg Engineering College, Ghaziabad.<br />
              See you on 30 October 2026.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8] block mb-4">
              QUICK LINKS
            </span>
            <div className="flex flex-col space-y-2.5 font-mono text-[0.82rem]">
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#about">About The Event</a>
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#speakers">Speakers &amp; Mentors</a>
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#faq">Frequently Asked Questions</a>
              <a className="text-white/80 hover:text-[#de432c] transition-colors" href="#register">Register Now</a>
            </div>
          </div>

          {/* Social */}
          <div>
            <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#55a8a8] block mb-4">
              CONNECT
            </span>
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://www.instagram.com/gdg_akgec/"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://www.linkedin.com/company/google-developer-groups-on-campus-akgec/posts/?feedView=all"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="GitHub"
              >
                <svg className="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </motion.a>
              <motion.a
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="grid size-10 place-content-center border-2 border-white/30 bg-white/5 text-white hover:bg-[#de432c] hover:border-[#de432c] shadow-[3px_3px_0_#000000] transition-all cursor-pointer"
                aria-label="Twitter / X"
              >
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Massive Outlined Retro Typography */}
        <div className="pt-10 pb-6 text-center select-none overflow-hidden">
          <div className="text-stroke-footer font-display text-[clamp(4.2rem,15vw,12.5rem)] font-black leading-none whitespace-nowrap">
            BYTE TALKS
          </div>
        </div>
      </div>

      {/* Red accent bottom bar */}
      <div className="h-3 w-full bg-[#de432c]" />
    </footer>
  );
}

function LazySection({
  id,
  className = '',
  minHeight = '380px',
  children,
}: {
  id?: string;
  className?: string;
  minHeight?: string;
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If URL hash matches this section, render immediately
    if (id && window.location.hash === `#${id}`) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );

    observer.observe(el);

    // Broadcast handler for instant anchor link navigation
    const handleLazyTarget = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (id && (customEvent.detail === `#${id}` || customEvent.detail === id)) {
        setIsVisible(true);
      }
    };
    window.addEventListener('lazy-load-target', handleLazyTarget);

    const handleHashChange = () => {
      if (id && window.location.hash === `#${id}`) {
        setIsVisible(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('lazy-load-target', handleLazyTarget);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [id]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`lazy-section-container ${className}`}
      style={{ minHeight: isVisible ? undefined : minHeight }}
    >
      {isVisible ? (
        children
      ) : (
        <div className="flex items-center justify-center py-24 text-[#1c242b]/30">
          <LoaderCircle className="size-6 animate-spin text-[#de432c]/50" />
        </div>
      )}
    </div>
  );
}

export function ByteTalksPortal() {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        const hash = anchor.hash;
        // Wake up any lazy-loaded section immediately
        window.dispatchEvent(new CustomEvent('lazy-load-target', { detail: hash }));

        const scrollToTarget = () => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement as HTMLElement, { offset: -20 });
          }
        };

        requestAnimationFrame(() => {
          scrollToTarget();
          setTimeout(scrollToTarget, 50);
        });
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  return (
    <main className="min-h-screen overflow-hidden bg-white font-mono text-[#1c242b] selection:bg-[#de432c] selection:text-white">
      <a className="fixed left-3 top-3 z-[100] -translate-y-[160%] bg-[#1c242b] px-4 py-3 text-white focus:translate-y-0" href="#main-content">
        Skip to content
      </a>
      
      {/* Top Hero & Header Container with Mint Teal Grid & Bottom White Divide */}
      <div className="relative overflow-hidden bg-[#B4DDD7]">
        {/* Continuous Graph Grid across the entire upper section */}
        <div 
          className="pointer-events-none absolute inset-x-0 top-0 bottom-[200px] md:bottom-[260px] lg:bottom-[320px] bg-[linear-gradient(#1c242b1a_1px,transparent_1px),linear-gradient(90deg,#1c242b1a_1px,transparent_1px)] bg-[size:38px_38px]" 
          aria-hidden="true" 
        />
        {/* Crisp White Canvas starting right behind the campus sticker */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] md:h-[260px] lg:h-[320px] bg-white border-t border-[#1c242b]/15" 
          aria-hidden="true" 
        />
        
        <EventHeader />
        <EventHero />
      </div>

      {/* Event Info Bar & Stats Strip */}
      <EventInfoBar />
      <StatsBar />

      <div id="main-content">
        <AboutSection />
        <LazySection id="speakers" minHeight="580px">
          <SpeakersSection />
        </LazySection>
        <LazySection id="voices" minHeight="450px">
          <VoicesSection />
        </LazySection>
        <LazySection id="previous-events" minHeight="450px">
          <PreviousEventsSection />
        </LazySection>
        <LazySection id="faq" minHeight="450px">
          <FAQSection />
        </LazySection>
        <LazySection id="register" minHeight="650px">
          <RegistrationSection />
        </LazySection>
      </div>
      <EventFooter />
    </main>
  );
}
