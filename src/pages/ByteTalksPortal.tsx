import { useEffect, useMemo, useState, useRef } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ArrowUpRight, Calendar, Check, ChevronRight, Download, LoaderCircle, Mail, Menu, Share2, ShieldCheck, Users, X } from 'lucide-react';
import campusIllustration from '../assets/images/byte-talks/raw-05.png';
import compassIllustration from '../assets/images/byte-talks/compass.svg';
import arrowMarker from '../assets/images/byte-talks/ArrowMarker.png';
import micAsset from '../assets/images/byte-talks/mic-asset.png';
import byteTalksPoster from '../assets/images/byte-talks/byte_talks_poster.png';
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
              <p className="m-0">Learn · Connect · Inspire</p>
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

function StatsBar() {
  const stats = [
    { value: '04', label: 'hours' },
    { value: '04', label: 'speakers' },
    { value: '65', label: 'seats booked' },
    { value: '200', label: 'seats left' },
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
            whileHover={{ scale: 1.02 }}
            className={`py-6 md:py-8 px-4 text-center transition-all ${
              idx < 3 ? 'md:border-r-2 md:border-[#1c242b]' : ''
            } ${idx % 2 === 0 ? 'max-md:border-r-2 max-md:border-[#1c242b]' : ''} ${
              idx < 2 ? 'max-md:border-b-2 max-md:border-[#1c242b]' : ''
            }`}
          >
            <div className="font-display text-5xl md:text-6xl lg:text-7xl font-black leading-none text-white tracking-tight">
              {s.value}
            </div>
            <div className="mt-2 font-mono text-sm md:text-base font-bold text-white/95">
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
              A short event description, preferably 3 to 5 lines.
              <br /><br />
              BYTE TALKS brings together forward-thinking minds, alumni innovators, and student builders. Join us at AKGEC for an afternoon of insightful conversations, architectural deep dives, and shared technical learning.
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

function SpeakersSection() {
  return (
    <section className="relative w-full bg-[#1B1F27] pt-8 pb-16 md:pb-24 text-white overflow-hidden" id="speakers">
      {/* Floating Sparkle & Diamond Stars as seen in the reference mockup */}
      <span className="sparkle-star absolute left-8 top-12 text-2xl text-[#f2c35b] select-none pointer-events-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute left-24 top-24 text-lg text-[#de432c] select-none pointer-events-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute left-40 top-16 text-sm text-[#55a8a8] select-none pointer-events-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute left-60 top-28 text-xl text-[#f2c35b] select-none pointer-events-none" aria-hidden="true">✦</span>
      <span className="sparkle-star absolute left-80 top-14 text-sm text-[#de432c] select-none pointer-events-none" aria-hidden="true">✦</span>

      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Header Block with Signpost on Right and SPEAKERS on Left */}
        <div className="relative pt-8 pb-4">
          {/* Directional Signpost Artwork floating on the right */}
          <motion.div 
            animate={{ y: [0, -6, 0], rotate: [0, 0.5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="absolute right-0 -top-16 sm:-top-24 md:-top-32 w-[220px] sm:w-[300px] md:w-[380px] lg:w-[420px] pointer-events-none select-none z-10"
          >
            <img
              src={arrowMarker}
              alt="Directional Signpost: Speaker Area, What is Commit Con?, Past Events"
              className="w-full h-auto object-contain drop-shadow-[8px_12px_0_rgba(0,0,0,0.35)]"
              loading="lazy"
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
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight">
              SPEAKERS
            </h2>
            {/* White underline spanning across */}
            <div className="w-full h-[2.5px] bg-white mt-4 mb-12 sm:mb-16" />
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
    <section className="relative w-full bg-[#1B1F27] py-16 md:py-24 text-white overflow-hidden">
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


function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative w-full bg-[#1B1F27] py-16 md:py-24 text-white">
      <div className="mx-auto w-[min(1320px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <span className="badge-3d-red px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white">
            04 / GOOD TO KNOW
          </span>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-black text-white">
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
                className="border-2 border-white/20 bg-[#161c24] shadow-[5px_5px_0_#000000] transition-all overflow-hidden"
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

function TicketQrCode({ code }: { code: string }) {
  return (
    <div className="inline-block rounded-none border-2 border-[#1c242b] bg-white p-3 shadow-[4px_4px_0_#1c242b]">
      <svg className="size-28 sm:size-32 select-none" viewBox="0 0 100 100" fill="currentColor" aria-label={`QR Code for ${code}`}>
        {/* Finder Pattern: Top-Left */}
        <rect x="6" y="6" width="24" height="24" fill="#1c242b" />
        <rect x="10" y="10" width="16" height="16" fill="white" />
        <rect x="14" y="14" width="8" height="8" fill="#1c242b" />

        {/* Finder Pattern: Top-Right */}
        <rect x="70" y="6" width="24" height="24" fill="#1c242b" />
        <rect x="74" y="10" width="16" height="16" fill="white" />
        <rect x="78" y="14" width="8" height="8" fill="#1c242b" />

        {/* Finder Pattern: Bottom-Left */}
        <rect x="6" y="70" width="24" height="24" fill="#1c242b" />
        <rect x="10" y="74" width="16" height="16" fill="white" />
        <rect x="14" y="78" width="8" height="8" fill="#1c242b" />

        {/* Timing Lines */}
        <rect x="34" y="16" width="4" height="4" fill="#1c242b" />
        <rect x="42" y="16" width="4" height="4" fill="#1c242b" />
        <rect x="50" y="16" width="4" height="4" fill="#1c242b" />
        <rect x="58" y="16" width="4" height="4" fill="#1c242b" />

        <rect x="16" y="34" width="4" height="4" fill="#1c242b" />
        <rect x="16" y="42" width="4" height="4" fill="#1c242b" />
        <rect x="16" y="50" width="4" height="4" fill="#1c242b" />
        <rect x="16" y="58" width="4" height="4" fill="#1c242b" />

        {/* Alignment */}
        <rect x="72" y="72" width="12" height="12" fill="#1c242b" />
        <rect x="75" y="75" width="6" height="6" fill="white" />
        <rect x="77" y="77" width="2" height="2" fill="#1c242b" />

        {/* Modules */}
        <rect x="36" y="36" width="5" height="5" fill="#1c242b" />
        <rect x="45" y="36" width="5" height="5" fill="#1c242b" />
        <rect x="54" y="36" width="5" height="5" fill="#1c242b" />
        <rect x="63" y="36" width="5" height="5" fill="#1c242b" />
        <rect x="36" y="45" width="5" height="5" fill="#1c242b" />
        <rect x="45" y="45" width="5" height="5" fill="#1c242b" />
        <rect x="54" y="45" width="5" height="5" fill="#1c242b" />
        <rect x="63" y="45" width="5" height="5" fill="#1c242b" />
        <rect x="72" y="45" width="5" height="5" fill="#1c242b" />
        <rect x="81" y="45" width="5" height="5" fill="#1c242b" />
        <rect x="36" y="54" width="5" height="5" fill="#1c242b" />
        <rect x="45" y="54" width="5" height="5" fill="#1c242b" />
        <rect x="54" y="54" width="5" height="5" fill="#1c242b" />
        <rect x="72" y="36" width="5" height="5" fill="#1c242b" />
        <rect x="81" y="36" width="5" height="5" fill="#1c242b" />
        <rect x="36" y="63" width="5" height="5" fill="#1c242b" />
        <rect x="45" y="63" width="5" height="5" fill="#1c242b" />
        <rect x="54" y="63" width="5" height="5" fill="#1c242b" />
        <rect x="63" y="63" width="5" height="5" fill="#1c242b" />
        <rect x="36" y="72" width="5" height="5" fill="#1c242b" />
        <rect x="45" y="72" width="5" height="5" fill="#1c242b" />
        <rect x="54" y="72" width="5" height="5" fill="#1c242b" />
        <rect x="36" y="81" width="5" height="5" fill="#1c242b" />
        <rect x="45" y="81" width="5" height="5" fill="#1c242b" />
        <rect x="54" y="81" width="5" height="5" fill="#1c242b" />
        <rect x="63" y="81" width="5" height="5" fill="#1c242b" />
      </svg>
    </div>
  );
}

function RegistrationSection() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [notice, setNotice] = useState('');
  const [step, setStep] = useState<RegistrationStep>('form');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
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
      setNotice('Please fix the highlighted fields to continue.');
      return;
    }

    if (!email) {
      setNotice('Enter your full name and student number to generate your college email.');
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
      setNotice(`A verification code was sent to ${email}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setNotice('Enter the 6-digit code sent to your AKGEC email.');
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
      setTimeout(() => {
        const ticketEl = document.getElementById('printable-ticket');
        if (ticketEl) {
          ticketEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Registration failed. Please check the code and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent('BYTE TALKS 2026 | AKGEC');
    const details = encodeURIComponent(
      `BYTE TALKS 2026 Admission Confirmed for ${values.fullName}. Pass ID: BT26-${values.studentNumber.slice(-4) || '2026'}. Venue: CSIT Seminar Hall, AKGEC Campus.`
    );
    const location = encodeURIComponent('CSIT Seminar Hall, AKGEC Campus, Ghaziabad');
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261030T103000Z/20261030T133000Z&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareText = `I just registered for BYTE TALKS 2026 at AKGEC! Catch you on 30 Oct at CSIT Hall.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BYTE TALKS 2026 Registration Pass',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputProps = (field: keyof FormValues) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  });

  const fieldLabel = 'flex min-w-0 flex-col gap-1.5 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white/90';
  const inputStyle = 'w-full border-2 border-white/20 bg-[#0c1017] px-3.5 py-2.5 font-mono text-sm text-white placeholder:text-white/30 focus:border-[#55a8a8] focus:outline-none focus:ring-1 focus:ring-[#55a8a8] shadow-[inset_2px_2px_0_rgba(0,0,0,0.4)] transition-all aria-[invalid=true]:border-[#de432c]';
  const errorStyle = 'font-mono text-[0.62rem] font-bold text-[#ff7965] mt-1';
  const selectStyle = `${inputStyle} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2355a8a8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[right_14px_center] bg-no-repeat pr-8`;

  return (
    <section className="relative w-full bg-[#1B1F27] py-20 md:py-28 text-white overflow-hidden scroll-mt-6">
      {/* Background Graphic: Giant Outlined Vertical Typography on Left */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 hidden 2xl:flex flex-col justify-around select-none opacity-15 pl-4 z-0">
        <div className="font-display text-8xl font-black uppercase tracking-widest text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.25)] [writing-mode:vertical-rl] rotate-180">
          BYTE TALKS
        </div>
        <div className="font-display text-8xl font-black uppercase tracking-widest text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.25)] [writing-mode:vertical-rl] rotate-180">
          BYTETALKS
        </div>
      </div>

      {/* Background Graphic: Compass Peeking on Right */}
      <div className="pointer-events-none absolute -right-28 top-20 hidden lg:block opacity-20 select-none w-[420px] z-0">
        <img src={compassIllustration} alt="" className="w-full h-auto" />
      </div>

      {/* Scattered Floating Sparkle & Diamond Accents */}
      <span className="absolute left-[8%] top-[14%] text-[#f2c35b] text-xl select-none animate-pulse" aria-hidden="true">◆</span>
      <span className="absolute right-[12%] top-[18%] text-[#de432c] text-sm select-none" aria-hidden="true">✦</span>
      <span className="absolute left-[15%] bottom-[22%] text-[#58a4b0] text-lg select-none" aria-hidden="true">◆</span>
      <span className="absolute right-[16%] bottom-[16%] text-[#f2c35b] text-base select-none" aria-hidden="true">✦</span>

      <div className="relative z-10 mx-auto w-[min(1240px,calc(100%-48px))] max-sm:w-[calc(100%-32px)]">
        {/* Top Header with Neo-brutalist horizontal divider lines */}
        <div className="w-full border-t border-b border-white/20 py-4 text-center mb-12">
          <h2 className="m-0 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-black uppercase tracking-tight text-white">
            REGISTER YOURSELF
          </h2>
        </div>

        {step === 'success' ? (
          /* ==================================================================== */
          /* SUCCESS STATE: Panels 3 & 4 (Modal) + Panel 2 (Ticket Pass & Next)   */
          /* ==================================================================== */
          <div className="space-y-16 max-w-4xl mx-auto">
            {/* Panel 3/4: Retro OS Browser Window "REGISTRATION COMPLETE!" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-[560px] border-3 border-[#1c242b] bg-white shadow-[12px_12px_0_#000000] overflow-hidden"
            >
              {/* Retro Window Titlebar */}
              <div className="bg-[#1c242b] px-4 py-2.5 flex items-center justify-between border-b-2 border-[#1c242b]">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#de432c]" />
                  <span className="size-3 rounded-full bg-[#f2c35b]" />
                  <span className="size-3 rounded-full bg-[#387a5b]" />
                </div>
                <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-white/70">
                  BYTE_TALKS // PASS_ISSUED.EXE
                </span>
                <span className="size-3 opacity-0" />
              </div>

              {/* Window Body */}
              <div className="p-8 sm:p-10 text-center text-[#1c242b] bg-[#FAF8F5]">
                {/* Large Green Check Circle Badge */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 15 }}
                  className="mx-auto size-20 sm:size-24 rounded-full bg-[#387a5b] text-white flex items-center justify-center border-3 border-[#1c242b] shadow-[4px_4px_0_#1c242b]"
                >
                  <Check size={48} className="stroke-[3.5]" />
                </motion.div>

                <h3 className="mt-6 mb-2 font-display text-[clamp(2rem,5vw,3.2rem)] font-black uppercase leading-[0.95] tracking-tight text-[#1c242b]">
                  REGISTRATION<br />
                  <span className="text-[#de432c]">COMPLETE!</span>
                </h3>

                <p className="mt-3 font-mono text-[0.82rem] font-bold leading-relaxed text-[#3a4951] max-w-sm mx-auto">
                  Your entry pass has been issued. Show the digital pass or QR code at CSIT Seminar Hall on 30 October 2026.
                </p>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('printable-ticket')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="btn-3d-red px-6 py-3 font-mono text-[0.78rem] font-bold uppercase tracking-wider cursor-pointer"
                  >
                    VIEW YOUR PASS ↓
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Panel 2: "YOU'RE IN, [NAME]." Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="text-center pt-6"
            >
              <span className="badge-3d-blue px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white">
                ADMISSION CONFIRMED
              </span>
              <h3 className="mt-4 mb-2 font-display text-[clamp(2.2rem,5.5vw,4.2rem)] font-black uppercase tracking-tight text-white">
                YOU'RE IN, {values.fullName.split(' ')[0] || 'DEVELOPER'}.
              </h3>
              <p className="font-mono text-xs sm:text-sm text-white/70 max-w-md mx-auto">
                Here is your official BYTE TALKS entry credential. Present this ticket at the check-in desk.
              </p>
            </motion.div>

            {/* Panel 2: Centerpiece Admission Ticket */}
            <motion.div
              id="printable-ticket"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="relative mx-auto max-w-[420px] overflow-hidden border-3 border-white/40 shadow-[12px_12px_0_#000000]"
            >
              {/* Ticket Header (Red) */}
              <div className="relative bg-[#de432c] p-6 text-white border-b-2 border-white/40 bg-dot-pattern-light">
                <div className="flex items-center justify-between border-b border-white/30 pb-3">
                  <span className="font-mono text-[0.66rem] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded">
                    • BYTE TALKS 2026 •
                  </span>
                  <span className="font-mono text-[0.62rem] font-bold uppercase tracking-widest text-white/90">
                    AKGEC CAMPUS
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <span className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white/80 block">
                      OFFICIAL ADMISSION TICKET
                    </span>
                    <span className="font-display text-2xl font-black text-white tracking-tight">
                      OCT 30, 2026
                    </span>
                  </div>
                  <span className="font-mono text-sm font-black bg-[#1c242b] text-white px-2.5 py-1 border border-white/40">
                    4:00 PM
                  </span>
                </div>
              </div>

              {/* Notched Semicircle Cutouts on Left and Right borders */}
              <div className="relative h-0">
                <div className="absolute -left-3.5 -top-3.5 size-7 rounded-full bg-[#131922] border-r-2 border-white/40 z-20" />
                <div className="absolute -right-3.5 -top-3.5 size-7 rounded-full bg-[#131922] border-l-2 border-white/40 z-20" />
              </div>

              {/* Ticket Body (Dark Navy) */}
              <div className="bg-[#1c242b] p-6 sm:p-7 text-white">
                <div className="mb-5">
                  <span className="font-mono text-[0.62rem] font-bold uppercase tracking-wider text-[#55a8a8] block">
                    ATTENDEE NAME
                  </span>
                  <h4 className="mt-1 font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-none">
                    {values.fullName || 'AKSHAT DIXIT'}
                  </h4>
                </div>

                {/* 2x2 Details Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/15 pt-4 text-left">
                  <div>
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/50 block">
                      STUDENT NUMBER
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white">
                      {values.studentNumber || '2300270100000'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/50 block">
                      BRANCH
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-white">
                      {values.branch || 'CSE'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/50 block">
                      VENUE
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#e2a444]">
                      CSIT SEMINAR HALL
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/50 block">
                      PASS ID
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#55a8a8]">
                      BT26-{values.studentNumber.slice(-4) || '8492'}
                    </span>
                  </div>
                </div>

                {/* Dashed Perforation Separator */}
                <div className="my-6 border-t-2 border-dashed border-white/20" />

                {/* Center QR Code Container */}
                <div className="flex flex-col items-center">
                  <TicketQrCode code={values.studentNumber || 'BT2026'} />
                  <span className="mt-3 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white/60">
                    SCAN FOR ENTRY VERIFICATION
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                type="button"
                onClick={handlePrintTicket}
                className="btn-3d-white inline-flex items-center gap-2 px-5 py-3 font-mono text-[0.78rem] font-bold uppercase tracking-wider text-[#1c242b] cursor-pointer"
              >
                <Download size={15} /> DOWNLOAD TICKET
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                type="button"
                onClick={handleAddToCalendar}
                className="btn-3d-white inline-flex items-center gap-2 px-5 py-3 font-mono text-[0.78rem] font-bold uppercase tracking-wider text-[#1c242b] cursor-pointer"
              >
                <Calendar size={15} /> ADD TO CALENDAR
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 1 }}
                type="button"
                onClick={handleShare}
                className="btn-3d-red inline-flex items-center gap-2 px-5 py-3 font-mono text-[0.78rem] font-bold uppercase tracking-wider text-white cursor-pointer"
              >
                <Share2 size={15} /> {copied ? 'LINK COPIED!' : 'SHARE'}
              </motion.button>
            </div>

            {/* Panel 2: WHAT HAPPENS NEXT Section */}
            <div className="pt-16 border-t border-white/15">
              <div className="text-center mb-10">
                <span className="badge-3d-red px-3 py-1 font-mono text-[0.66rem] font-bold uppercase tracking-wider text-white">
                  IMPORTANT NEXT STEPS
                </span>
                <h3 className="mt-3 font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                  WHAT HAPPENS NEXT
                </h3>
              </div>

              {/* 3 Colorful Side-by-side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Teal */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '8px 8px 0px #000' }}
                  className="border-2 border-[#1c242b] bg-[#58A4B0] p-6 text-[#1c242b] shadow-[6px_6px_0_#000] transition-all"
                >
                  <div className="size-10 rounded border-2 border-[#1c242b] bg-white grid place-content-center shadow-[2px_2px_0_#1c242b] mb-4">
                    <Mail size={18} />
                  </div>
                  <h4 className="font-display text-xl font-black uppercase tracking-tight text-[#1c242b]">
                    EMAIL CONFIRMATION
                  </h4>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-[#1c242b]/85 font-semibold">
                    We've sent your entry pass and receipt to <strong className="underline">{email}</strong>. Check your inbox and spam folder.
                  </p>
                </motion.div>

                {/* Card 2: Coral Red */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '8px 8px 0px #000' }}
                  className="border-2 border-[#1c242b] bg-[#de432c] p-6 text-white shadow-[6px_6px_0_#000] transition-all"
                >
                  <div className="size-10 rounded border-2 border-[#1c242b] bg-white text-[#1c242b] grid place-content-center shadow-[2px_2px_0_#1c242b] mb-4">
                    <ShieldCheck size={18} />
                  </div>
                  <h4 className="font-display text-xl font-black uppercase tracking-tight text-white">
                    DAY OF EVENT
                  </h4>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-white/90 font-semibold">
                    Arrive at CSIT Seminar Hall by 3:30 PM on 30 October 2026. Carry your college physical ID card and this digital pass.
                  </p>
                </motion.div>

                {/* Card 3: Forest Green */}
                <motion.div
                  whileHover={{ y: -4, boxShadow: '8px 8px 0px #000' }}
                  className="border-2 border-[#1c242b] bg-[#387A5B] p-6 text-white shadow-[6px_6px_0_#000] transition-all"
                >
                  <div className="size-10 rounded border-2 border-[#1c242b] bg-white text-[#1c242b] grid place-content-center shadow-[2px_2px_0_#1c242b] mb-4">
                    <Users size={18} />
                  </div>
                  <h4 className="font-display text-xl font-black uppercase tracking-tight text-white">
                    COMMUNITY ACCESS
                  </h4>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-white/90 font-semibold">
                    Join GDG AKGEC campus community, participate in pre-talk discussions, and get real-time announcements.
                  </p>
                </motion.div>
              </div>

              {/* Register Another Attendee Button */}
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setValues(initialForm);
                    setOtp('');
                    setNotice('');
                  }}
                  className="font-mono text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  ← Register another student
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================== */
          /* FORM & OTP STATE: Panel 1 (Registration Form & Traffic Light)        */
          /* ==================================================================== */
          <div className="max-w-[620px] mx-auto">
            {/* Tilted Sticker Badges + Horizontal Traffic Light Widget */}
            <div className="flex flex-col items-center justify-center mb-8 relative">
              <div className="flex items-center justify-between w-full px-2 mb-3">
                <motion.span
                  whileHover={{ rotate: -12, scale: 1.05 }}
                  className="inline-block -rotate-6 badge-3d-red px-3 py-1 font-mono text-[0.68rem] font-bold uppercase text-white shadow-[3px_3px_0_#000000]"
                >
                  ● 2026 EDITION
                </motion.span>
                <motion.span
                  whileHover={{ rotate: 12, scale: 1.05 }}
                  className="inline-block rotate-6 badge-3d-blue px-3 py-1 font-mono text-[0.68rem] font-bold uppercase text-white shadow-[3px_3px_0_#000000]"
                >
                  LIMITED SEATS
                </motion.span>
              </div>

              {/* Traffic Light Horizontal Capsule */}
              <div className="flex items-center gap-3.5 rounded-full border-2 border-white/30 bg-[#0a0d13] px-6 py-2.5 shadow-[5px_5px_0_#000000]">
                <span className="size-3.5 rounded-full bg-[#de432c] shadow-[0_0_10px_#de432c] animate-pulse" />
                <span className="size-3.5 rounded-full bg-[#f2c35b] shadow-[0_0_10px_#f2c35b]" />
                <span className="size-3.5 rounded-full bg-[#387a5b] shadow-[0_0_10px_#387a5b]" />
              </div>
            </div>

            {/* Main Form Container Card */}
            <div className="border-2 border-white/30 bg-[#1a222f] p-6 sm:p-9 shadow-[12px_12px_0_#000000]">
              {step === 'otp' ? (
                /* Step 2: OTP Verification */
                <div>
                  <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-4 font-mono text-[0.68rem] font-bold text-[#55a8a8]">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#de432c] animate-ping" />
                      EMAIL VERIFICATION
                    </span>
                    <span>STEP 02 / 02</span>
                  </div>

                  <form className="grid gap-5" onSubmit={handleOtpSubmit} noValidate>
                    <div>
                      <p className="m-0 font-mono text-sm leading-relaxed text-white/90">
                        Enter the 6-digit verification code sent to:
                      </p>
                      <strong className="font-mono text-base text-[#55a8a8] block mt-1 break-all">
                        {email}
                      </strong>
                    </div>

                    <label className={fieldLabel} htmlFor="registrationOtp">
                      <span>VERIFICATION CODE (6 DIGITS) <b className="text-[#de432c]">*</b></span>
                      <input
                        className={`${inputStyle} text-center font-display text-2xl sm:text-3xl font-black tracking-[0.4em] py-3`}
                        id="registrationOtp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </label>

                    {notice && (
                      <p className="m-0 border-l-[3px] border-[#f2c35b] bg-[#f2c35b]/10 p-3 font-mono text-xs text-white" role="status" aria-live="polite">
                        {notice}
                      </p>
                    )}

                    <motion.button
                      whileHover={{ x: -2, y: -2 }}
                      whileTap={{ x: 2, y: 2 }}
                      className="w-full btn-3d-red py-4 font-mono text-[0.88rem] font-bold uppercase tracking-wider disabled:opacity-60 cursor-pointer shadow-[5px_5px_0_#000000]"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle className="animate-spin" size={18} /> VERIFYING CODE...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          VERIFY &amp; ISSUE PASS <ArrowUpRight size={18} />
                        </span>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep('form');
                        setNotice('');
                      }}
                      className="justify-self-center border-0 bg-transparent font-mono text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white underline underline-offset-4 cursor-pointer mt-1"
                    >
                      ← Back to edit details
                    </button>
                  </form>
                </div>
              ) : (
                /* Step 1: Registration Form */
                <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
                  <div className="mb-2 flex items-center justify-between border-b border-white/15 pb-4 font-mono text-[0.68rem] font-bold text-[#55a8a8]">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-[#de432c] animate-pulse" />
                      LIVE REGISTRATION
                    </span>
                    <span>STEP 01 / 02</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 max-sm:grid-cols-1">
                    {/* Full Name */}
                    <label className={`${fieldLabel} col-span-full`} htmlFor="fullName">
                      <span>FULL NAME <b className="text-[#de432c]">*</b></span>
                      <input
                        className={inputStyle}
                        id="fullName"
                        autoComplete="name"
                        placeholder="e.g. Akshat Dixit"
                        value={values.fullName}
                        onChange={(event) => updateField('fullName', event.target.value)}
                        {...inputProps('fullName')}
                      />
                      {errors.fullName && <small className={errorStyle}>{errors.fullName}</small>}
                    </label>

                    {/* Student Number */}
                    <label className={fieldLabel} htmlFor="studentNumber">
                      <span>STUDENT NUMBER <b className="text-[#de432c]">*</b></span>
                      <input
                        className={inputStyle}
                        id="studentNumber"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={13}
                        placeholder="e.g. 2300270100000"
                        value={values.studentNumber}
                        onChange={(event) => updateField('studentNumber', event.target.value.replace(/\D/g, '').slice(0, 13))}
                        {...inputProps('studentNumber')}
                      />
                      {errors.studentNumber && <small className={errorStyle}>{errors.studentNumber}</small>}
                    </label>

                    {/* Phone Number */}
                    <label className={fieldLabel} htmlFor="phone">
                      <span>PHONE NUMBER <b className="text-[#de432c]">*</b></span>
                      <input
                        className={inputStyle}
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={values.phone}
                        onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                        {...inputProps('phone')}
                      />
                      {errors.phone && <small className={errorStyle}>{errors.phone}</small>}
                    </label>

                    {/* College Email */}
                    <label className={`${fieldLabel} col-span-full`} htmlFor="collegeEmail">
                      <span>COLLEGE EMAIL (AUTO-GENERATED) <b className="text-[#de432c]">*</b></span>
                      <input
                        className={`${inputStyle} text-[#55a8a8] font-bold cursor-not-allowed opacity-90`}
                        id="collegeEmail"
                        type="email"
                        autoComplete="email"
                        value={email || 'firstname[studentNumber]@akgec.ac.in'}
                        readOnly
                      />
                      <small className="font-mono text-[0.58rem] font-normal text-white/50">
                        Generated automatically from your first name &amp; student number. Verification code will be sent here.
                      </small>
                    </label>

                    {/* Gender */}
                    <label className={fieldLabel} htmlFor="gender">
                      <span>GENDER <b className="text-[#de432c]">*</b></span>
                      <select
                        className={selectStyle}
                        id="gender"
                        value={values.gender}
                        onChange={(event) => updateField('gender', event.target.value)}
                        {...inputProps('gender')}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <small className={errorStyle}>{errors.gender}</small>}
                    </label>

                    {/* Branch */}
                    <label className={fieldLabel} htmlFor="branch">
                      <span>BRANCH <b className="text-[#de432c]">*</b></span>
                      <select
                        className={selectStyle}
                        id="branch"
                        value={values.branch}
                        onChange={(event) => updateField('branch', event.target.value)}
                        {...inputProps('branch')}
                      >
                        <option value="">Select branch</option>
                        {BRANCHES.map((b) => (
                          <option value={b} key={b} className="bg-[#1c242b] text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                      {errors.branch && <small className={errorStyle}>{errors.branch}</small>}
                    </label>

                    {/* Residence */}
                    <fieldset className="col-span-full m-0 border-0 p-0">
                      <legend className={`${fieldLabel} mb-2`}>
                        RESIDENCE <b className="text-[#de432c]">*</b>
                      </legend>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Day Scholar', 'Hosteller'] as const).map((r) => (
                          <label
                            key={r}
                            className={`flex min-h-11 cursor-pointer items-center gap-3 border-2 px-3 py-2 font-mono text-xs font-bold transition-all ${
                              values.residence === r
                                ? 'border-[#55a8a8] bg-[#55a8a8]/20 text-white shadow-[2px_2px_0_#55a8a8]'
                                : 'border-white/20 bg-[#0c1017] text-white/70 hover:border-white/40'
                            }`}
                          >
                            <input
                              className="size-4 accent-[#55a8a8]"
                              type="radio"
                              name="residence"
                              value={r}
                              checked={values.residence === r}
                              onChange={() => updateField('residence', r)}
                            />
                            {r}
                          </label>
                        ))}
                      </div>
                      {errors.residence && <small className={errorStyle}>{errors.residence}</small>}
                    </fieldset>

                    {/* Domain */}
                    <label className={`${fieldLabel} col-span-full`} htmlFor="domain">
                      <span>PRIMARY DOMAIN OF INTEREST <b className="text-[#de432c]">*</b></span>
                      <select
                        className={selectStyle}
                        id="domain"
                        value={values.domain}
                        onChange={(event) => updateField('domain', event.target.value)}
                        {...inputProps('domain')}
                      >
                        <option value="">Select primary domain</option>
                        {DOMAINS.map((d) => (
                          <option value={d} key={d} className="bg-[#1c242b] text-white">
                            {d}
                          </option>
                        ))}
                      </select>
                      {errors.domain && <small className={errorStyle}>{errors.domain}</small>}
                    </label>

                    {/* GitHub */}
                    <label className={fieldLabel} htmlFor="githubId">
                      <span>GITHUB USERNAME <b className="text-[#de432c]">*</b></span>
                      <input
                        className={inputStyle}
                        id="githubId"
                        autoComplete="off"
                        placeholder="e.g. octocat"
                        value={values.githubId}
                        onChange={(event) => updateField('githubId', event.target.value)}
                        {...inputProps('githubId')}
                      />
                      {errors.githubId && <small className={errorStyle}>{errors.githubId}</small>}
                    </label>

                    {/* HackerRank */}
                    <label className={fieldLabel} htmlFor="hackerrankId">
                      <span>HACKERRANK USERNAME <b className="text-[#de432c]">*</b></span>
                      <input
                        className={inputStyle}
                        id="hackerrankId"
                        autoComplete="off"
                        placeholder="e.g. dev_coder"
                        value={values.hackerrankId}
                        onChange={(event) => updateField('hackerrankId', event.target.value)}
                        {...inputProps('hackerrankId')}
                      />
                      {errors.hackerrankId && <small className={errorStyle}>{errors.hackerrankId}</small>}
                    </label>

                    {/* Unstop */}
                    <label className={`${fieldLabel} col-span-full`} htmlFor="unstopId">
                      <span>UNSTOP USERNAME <span className="font-normal text-white/40">(OPTIONAL)</span></span>
                      <input
                        className={inputStyle}
                        id="unstopId"
                        autoComplete="off"
                        placeholder="e.g. akshat_unstop"
                        value={values.unstopId}
                        onChange={(event) => updateField('unstopId', event.target.value)}
                      />
                    </label>
                  </div>

                  {/* Consent checkbox */}
                  <label
                    className={`flex items-start gap-3 border-2 p-3.5 font-mono text-[0.66rem] font-bold leading-relaxed text-white/90 bg-[#0c1017] transition-all cursor-pointer ${
                      errors.consent ? 'border-[#de432c]' : 'border-white/20'
                    }`}
                  >
                    <input
                      className="mt-0.5 size-4 shrink-0 accent-[#55a8a8]"
                      type="checkbox"
                      checked={values.consent}
                      onChange={(event) => updateField('consent', event.target.checked)}
                      {...inputProps('consent')}
                    />
                    <span>
                      I agree to the student code of conduct and confirm my physical attendance at BYTE TALKS on 30 October 2026. <b className="text-[#de432c]">*</b>
                    </span>
                  </label>
                  {errors.consent && <small className={errorStyle}>{errors.consent}</small>}

                  {notice && (
                    <p className="m-0 border-l-[3px] border-[#f2c35b] bg-[#f2c35b]/10 p-3 font-mono text-xs text-white" role="status" aria-live="polite">
                      {notice}
                    </p>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ x: -2, y: -2 }}
                    whileTap={{ x: 2, y: 2 }}
                    className="w-full btn-3d-red py-4 font-mono text-[0.88rem] font-black uppercase tracking-wider shadow-[6px_6px_0_#000000] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="animate-spin" size={18} /> SENDING VERIFICATION OTP...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        CLAIM YOUR PASS <ArrowUpRight size={18} />
                      </span>
                    )}
                  </motion.button>

                  <p className="m-0 text-center font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/40">
                    * COLLEGE EMAIL OTP VERIFICATION REQUIRED BEFORE PASS ISSUANCE
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventFooter() {
  return (
    <footer className="relative w-full bg-[#1B1F27] text-white pt-16 overflow-hidden border-t border-white/10">
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
    <main className="min-h-screen overflow-hidden bg-[#1B1F27] font-mono text-white selection:bg-[#de432c] selection:text-white">
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
        {/* Crisp Dark Canvas starting right behind the campus sticker */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] md:h-[260px] lg:h-[320px] bg-[#1B1F27] border-t border-white/10" 
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
