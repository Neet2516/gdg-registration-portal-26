import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowDown, ArrowUpRight, CalendarDays, CheckCircle2, Clock3, LoaderCircle, MapPin, Menu, X } from 'lucide-react';
import campusIllustration from '../assets/images/byte-talks/raw-05.png';
import compassIllustration from '../assets/images/byte-talks/compass.svg';
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
    <header className={`${contentWidth} relative z-10 flex min-h-[76px] items-center justify-between border-b border-[#20252a]/25 bg-[#BBDED9] text-[#20252a] before:absolute before:left-1/2 before:top-0 before:z-[-1] before:h-full before:w-screen before:-translate-x-1/2 before:bg-[#BBDED9] before:content-[''] max-sm:min-h-[44px]`}>
      <a className="inline-flex items-center gap-2.5 whitespace-nowrap font-display text-base tracking-[-.04em] max-sm:gap-1.5 max-sm:text-xs" href="#home" onClick={closeMenu} aria-label="BYTE TALKS home">
        <span className="grid size-7 place-items-center border border-byte-text bg-byte-teal text-lg leading-none text-[#10131a] max-sm:size-5 max-sm:text-sm">B</span>
        <span>BYTE TALKS</span>
      </a>
      <button
        className="hidden border border-[#20252a]/40 bg-transparent p-2 text-[#20252a] focus-visible:outline-3 focus-visible:outline-byte-yellow max-sm:inline-flex max-sm:p-1"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>
      <nav
        className={`${menuOpen ? 'max-sm:flex' : 'max-sm:hidden'} flex items-center gap-[clamp(1.25rem,3vw,2.75rem)] font-mono text-[.73rem] uppercase max-sm:absolute max-sm:left-0 max-sm:right-0 max-sm:top-full max-sm:flex-col max-sm:items-stretch max-sm:gap-0 max-sm:border max-sm:border-[#20252a]/25 max-sm:bg-[#BBDED9] max-sm:px-4 max-sm:pb-4`}
        aria-label="Main navigation"
      >
        <a className="text-[#20252a] transition-colors hover:text-[#176d68] max-sm:border-b max-sm:border-[#20252a]/20 max-sm:py-3.5" href="#about" onClick={closeMenu}>About</a>
        <a className="text-[#20252a] transition-colors hover:text-[#176d68] max-sm:border-b max-sm:border-[#20252a]/20 max-sm:py-3.5" href="#faq" onClick={closeMenu}>FAQs</a>
        <a className="text-[#20252a] transition-colors hover:text-[#176d68] max-sm:border-b max-sm:border-[#20252a]/20 max-sm:py-3.5" href="#speakers" onClick={closeMenu}>Mentors</a>
        <a className={`${buttonStyle} min-h-[38px] px-3 py-2 text-[.68rem] max-sm:mt-3`} href="#register" onClick={closeMenu}>
          Register <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

function EventHero() {
  const countdown = useMemo(getEventCountdown, []);

  return (
    <section className={`${contentWidth} relative isolate grid min-h-[690px] grid-cols-[.9fr_1.1fr] items-center pt-[4.5rem] text-[#20252a] before:absolute before:left-1/2 before:top-0 before:z-[-1] before:h-full before:w-screen before:-translate-x-1/2 before:bg-[#BBDED9] before:content-[''] max-[820px]:min-h-0 max-[820px]:grid-cols-2 max-[820px]:pb-[120px] max-sm:flex max-sm:min-h-[690px] max-sm:flex-col max-sm:items-stretch max-sm:pt-1 max-sm:pb-0`} id="home" aria-labelledby="bt-title">
      <div
        className="pointer-events-none absolute inset-x-[calc((1128px-100vw)/2)] inset-y-0 bottom-[58px] bg-[linear-gradient(#20252a24_1px,transparent_1px),linear-gradient(90deg,#20252a24_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,#000_0%,#000_70%,transparent_100%)] max-sm:inset-x-[-16px] max-sm:bottom-[125px]"
        aria-hidden="true"
      />
      <div className="relative z-[2] pb-20 max-sm:pb-0">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2.5 font-mono text-[.68rem] font-bold uppercase tracking-[.12em] text-[#176d68] max-sm:bg-[#e75842] max-sm:px-1 max-sm:py-[2px] max-sm:text-[.4rem] max-sm:tracking-normal max-sm:text-white">
            <span className="size-2 rounded-full bg-byte-coral shadow-[0_0_0_4px_#e758422b] max-sm:hidden" />
            <span className="max-sm:hidden">CAMPUS EDITION · AKGEC</span>
            <span className="hidden max-sm:inline">REGISTRATION PREVIEW</span>
          </span>
          <span className="hidden bg-[#315e9e] px-1 py-[2px] font-mono text-[.4rem] font-bold uppercase tracking-normal text-white max-sm:inline">
            AKGEC · GHAZIABAD
          </span>
        </div>
        <h1 id="bt-title" className="my-5 flex flex-col font-display text-[clamp(4.4rem,9vw,8.9rem)] leading-[.78] tracking-[-.08em] uppercase max-[820px]:text-[clamp(4rem,11vw,6.2rem)] max-sm:my-1 max-sm:max-w-[66%] max-sm:text-[clamp(2.4rem,15vw,5.6rem)]">
          <span className="max-sm:text-[#d74a33]">BYTE</span>
          <span className="text-byte-coral max-sm:text-[#e8ae56]">TALKS</span>
          <span className="mt-3 text-[.56em] tracking-[-.045em] text-transparent [-webkit-text-stroke:1px_#20252a] max-sm:mt-2 max-sm:w-fit max-sm:bg-[#183762] max-sm:px-2 max-sm:py-1 max-sm:text-byte-text max-sm:shadow-[5px_5px_0_#3975a4] max-sm:[-webkit-text-stroke:0]">2026</span>
        </h1>
        <p className="my-6 max-w-[410px] font-mono text-[.9rem] uppercase leading-[1.8] text-[#35464a] max-sm:my-1.5 max-sm:max-w-[64%] max-sm:text-[.61rem]">
          Join us live. Learn. Connect. Inspire.
        </p>
        <div className="flex flex-wrap items-center gap-6 max-sm:gap-2.5">
          <a className={`${buttonStyle} max-sm:min-h-9 max-sm:px-2.5 max-sm:py-2 max-sm:text-[.48rem]`} href="#register">
            Register now <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a className="inline-flex items-center gap-2 border border-[#20252a] bg-[#f5f0e7] px-2.5 py-2 font-mono text-[.68rem] uppercase text-[#20252a] shadow-[3px_3px_0_#20252a] transition-colors hover:bg-white max-sm:gap-1.5 max-sm:px-2 max-sm:py-2 max-sm:text-[.46rem]" href="#about">
            See details <ArrowDown size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="relative isolate min-h-[480px] max-[820px]:min-h-[360px] max-sm:absolute max-sm:inset-x-0 max-sm:bottom-[192px] max-sm:top-[40px] max-sm:min-h-0" aria-label="BYTE TALKS compass and AKGEC campus artwork">
        <img
          className="absolute right-0 top-0 z-[2] w-[min(62%,390px)] max-[820px]:w-[min(60%,300px)] max-sm:right-[-22%] max-sm:top-[8%] max-sm:w-[58%]"
          src={compassIllustration}
          alt={`BYTE TALKS event countdown: ${countdown}`}
        />
        <img
          className="absolute bottom-0 left-[-8%] z-[1] w-[105%] max-h-[360px] rotate-[-3deg] object-contain drop-shadow-[11px_13px_0_#0e111a] max-[820px]:w-[115%] max-[820px]:max-h-[270px] max-sm:bottom-[112px] max-sm:left-[-12%] max-sm:w-[124%] max-sm:max-h-none"
          src={campusIllustration}
          alt="Illustrated AKGEC campus"
        />
        <span className="absolute left-[5%] top-[20%] z-[2] text-2xl text-byte-yellow" aria-hidden="true">✳</span>
        <span className="absolute bottom-[15%] right-[8%] z-[2] text-2xl text-byte-teal" aria-hidden="true">✳</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[2] grid min-h-[98px] grid-cols-[1fr_1fr_1.2fr_auto] items-center border-y border-byte-line bg-byte-page max-[820px]:grid-cols-3 max-sm:absolute max-sm:grid-cols-1">
        <div className="flex items-center gap-3 border-r border-byte-line/40 px-4 py-3 text-byte-teal max-sm:min-h-16 max-sm:border-r-0 max-sm:border-b">
          <CalendarDays size={19} aria-hidden="true" />
          <div className="grid gap-1"><span className="font-mono text-[.56rem] tracking-[.13em] text-byte-muted">DATE</span><strong className="font-mono text-[.72rem] text-byte-text max-[820px]:text-[.59rem] max-sm:text-[.66rem]">30 OCT 2026</strong></div>
        </div>
        <div className="flex items-center gap-3 border-r border-byte-line/40 px-4 py-3 text-byte-teal max-sm:min-h-16 max-sm:border-r-0 max-sm:border-b">
          <Clock3 size={19} aria-hidden="true" />
          <div className="grid gap-1"><span className="font-mono text-[.56rem] tracking-[.13em] text-byte-muted">TIME</span><strong className="font-mono text-[.72rem] text-byte-text max-[820px]:text-[.59rem] max-sm:text-[.66rem]">TO BE ANNOUNCED</strong></div>
        </div>
        <div className="flex items-center gap-3 border-r border-byte-line/40 px-4 py-3 text-byte-teal max-sm:min-h-16 max-sm:border-r-0 max-sm:border-b-0">
          <MapPin size={19} aria-hidden="true" />
          <div className="grid gap-1"><span className="font-mono text-[.56rem] tracking-[.13em] text-byte-muted">VENUE</span><strong className="font-mono text-[.72rem] text-byte-text max-[820px]:text-[.59rem] max-sm:text-[.66rem]">CSIT SEMINAR HALL</strong></div>
        </div>
        <a className="inline-flex items-center gap-2 py-4 pl-4 font-mono text-[.62rem] font-bold text-byte-coral max-[820px]:hidden" href="#register">EVENT DETAILS <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className={`${contentWidth} scroll-mt-8 pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pt-[4.5rem]`} id="about">
      <SectionHeading eyebrow="01 / THE EVENT">WHAT IS BYTE TALKS?</SectionHeading>
      <div className="grid grid-cols-[1fr_.8fr] gap-[clamp(2rem,7vw,7rem)] py-14 max-sm:grid-cols-1 max-sm:gap-6 max-sm:py-8">
        <p className="m-0 max-w-[550px] font-display text-[clamp(2rem,4.7vw,4rem)] leading-[1.05] tracking-[-.07em] max-sm:text-[clamp(2.2rem,11vw,3.4rem)]">
          A day for fresh ideas, thoughtful conversations, and the people shaping what comes next.
        </p>
        <div className="pt-1 font-mono text-[.79rem] leading-[1.9] text-byte-muted">
          <p className="mb-6 mt-0">BYTE TALKS brings the campus community together around technology and creativity. Join us at AKGEC for an afternoon of learning, sharing, and connecting.</p>
          <p className="border-l-[3px] border-byte-coral bg-byte-surface p-4 text-[.68rem] text-byte-text"><span className="mb-1 block text-[.58rem] font-bold text-byte-coral">NOTE</span>Speaker announcements and entry information will be shared by the organizers.</p>
        </div>
      </div>
      <div className="grid grid-cols-3 border-y border-byte-line max-sm:grid-cols-1">
        <div className="flex min-h-[78px] items-center gap-4 border-r border-byte-line/40 p-4 max-sm:min-h-16 max-sm:border-r-0 max-sm:border-b"><span className="font-display text-2xl text-byte-coral">01</span><strong className="font-mono text-[.63rem]">ONE CAMPUS</strong></div>
        <div className="flex min-h-[78px] items-center gap-4 border-r border-byte-line/40 p-4 max-sm:min-h-16 max-sm:border-r-0 max-sm:border-b"><span className="font-display text-2xl text-byte-coral">30</span><strong className="font-mono text-[.63rem]">OCTOBER 2026</strong></div>
        <div className="flex min-h-[78px] items-center gap-4 p-4 max-sm:min-h-16"><span className="font-display text-2xl text-byte-coral">∞</span><strong className="font-mono text-[.63rem]">IDEAS TO SHARE</strong></div>
      </div>
    </section>
  );
}

function SpeakersSection() {
  return (
    <section className={`${contentWidth} scroll-mt-8 pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pt-[4.5rem]`} id="speakers">
      <SectionHeading eyebrow="02 / PEOPLE">SPEAKERS &amp; MENTORS</SectionHeading>
      <div className="relative mt-10 grid grid-cols-[180px_1fr_auto] items-center gap-8 border border-byte-text bg-byte-surface p-[clamp(1.25rem,4vw,3rem)] shadow-[8px_8px_0_#11141b] max-sm:grid-cols-[68px_1fr] max-sm:gap-4 max-sm:p-5">
        <div className="grid aspect-square w-[150px] rotate-[-5deg] place-items-center border border-byte-teal bg-[linear-gradient(135deg,#55a8a833,transparent_65%),var(--color-byte-deep)] font-display text-8xl text-byte-teal max-sm:w-[68px] max-sm:text-5xl" aria-hidden="true">?</div>
        <div>
          <span className="font-mono text-[.68rem] font-bold uppercase tracking-[.12em] text-byte-teal max-sm:text-[.57rem]">THE LINEUP IS IN PROGRESS</span>
          <h3 className="my-3 max-w-xl font-display text-[clamp(1.5rem,3vw,2.45rem)] leading-[1.1] tracking-[-.06em] max-sm:text-[1.4rem]">Good conversations start with great people.</h3>
          <p className="m-0 font-mono text-[.73rem] leading-relaxed text-byte-muted max-sm:text-[.65rem]">Speaker and mentor details will be added here once they are confirmed.</p>
        </div>
        <span className="self-start font-mono text-[.68rem] font-bold text-byte-coral max-sm:absolute max-sm:right-5 max-sm:top-5">02—</span>
      </div>
    </section>
  );
}

function VoicesSection() {
  const quotes = [
    { text: 'Stories and reflections from past speakers will appear here.', footer: 'SPEAKER QUOTES COMING SOON', color: 'bg-byte-teal', rotate: '-rotate-1' },
    { text: 'We’re gathering the moments that made previous talks memorable.', footer: 'BYTE TALKS COMMUNITY', color: 'bg-byte-coral', rotate: 'rotate-1 translate-y-2' },
    { text: 'Have a story to share? Join us at the next conversation.', footer: 'SEE YOU ON CAMPUS', color: 'bg-byte-text', rotate: '-rotate-1' },
  ];

  return (
    <section className={`${contentWidth} pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pt-[4.5rem]`}>
      <SectionHeading eyebrow="03 / COMMUNITY">VOICES FROM PAST SPEAKERS</SectionHeading>
      <div className="mt-10 grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:gap-6">
        {quotes.map((quote) => (
          <blockquote className={`flex min-h-[235px] flex-col justify-between border border-[#11141b] p-6 text-[#11141b] shadow-[5px_5px_0_#11141b] ${quote.color} ${quote.rotate} max-sm:min-h-[185px] max-sm:rotate-0`} key={quote.footer}>
            <span className="font-serif text-6xl leading-[.8]" aria-hidden="true">“</span>
            <p className="my-5 font-display text-[1.2rem] leading-snug tracking-[-.04em]">{quote.text}</p>
            <footer className="font-mono text-[.55rem] font-bold tracking-wide">{quote.footer}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function PreviousEventsSection() {
  return (
    <section className={`${contentWidth} pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pt-[4.5rem]`}>
      <SectionHeading eyebrow="04 / THE ARCHIVE">PREVIOUS EVENTS</SectionHeading>
      <div className="relative mt-10 grid min-h-[220px] grid-cols-[120px_1fr_auto] items-center gap-8 overflow-hidden border border-byte-text bg-byte-surface p-[clamp(1.25rem,4vw,3rem)] shadow-[8px_8px_0_#11141b] after:absolute after:bottom-[-90px] after:right-[12%] after:h-[190px] after:w-[250px] after:rounded-[50%] after:border after:border-byte-teal/30 after:content-[''] max-sm:grid-cols-[66px_1fr] max-sm:gap-4 max-sm:p-5">
        <div className="grid size-[105px] rotate-[-12deg] place-content-center rounded-full border-2 border-dashed border-byte-coral text-center font-mono text-[.7rem] font-bold leading-relaxed text-byte-coral max-sm:size-[66px] max-sm:text-[.5rem]">ARCHIVE<br />LOADING</div>
        <div>
          <span className="font-mono text-[.68rem] font-bold uppercase tracking-[.12em] text-byte-teal max-sm:text-[.57rem]">A LOOK BACK</span>
          <h3 className="my-3 max-w-xl font-display text-[clamp(1.5rem,3vw,2.45rem)] leading-[1.1] tracking-[-.06em] max-sm:text-[1.4rem]">More moments. More makers. More to come.</h3>
          <p className="m-0 font-mono text-[.73rem] leading-relaxed text-byte-muted max-sm:text-[.65rem]">Previous-event highlights will be added when the archive is ready.</p>
        </div>
        <span className="relative z-[1] self-start font-mono text-[.68rem] font-bold text-byte-teal max-sm:absolute max-sm:right-5 max-sm:top-5">BT—26</span>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className={`${contentWidth} pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pt-[4.5rem]`} id="faq">
      <SectionHeading eyebrow="05 / GOOD TO KNOW">FREQUENTLY ASKED QUESTIONS</SectionHeading>
      <div className="my-10 border-t border-byte-line">
        {faqs.map((faq, index) => (
          <details className="border-b border-byte-line [&[open]>summary>span:last-child]:rotate-45" key={faq.question}>
            <summary className="grid min-h-[66px] cursor-pointer grid-cols-[50px_1fr_24px] items-center gap-3 font-mono text-[.78rem] font-bold marker:hidden focus-visible:outline-3 focus-visible:outline-byte-yellow max-sm:grid-cols-[32px_1fr_24px] max-sm:text-[.68rem]">
              <span className="font-mono text-[.65rem] text-byte-teal">0{index + 1}</span>
              <span>{faq.question}</span>
              <span className="grid size-6 place-items-center border border-byte-coral text-base text-byte-coral transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="mb-6 ml-[3.1rem] mr-12 mt-0 max-w-[760px] font-mono text-[.72rem] leading-[1.85] text-byte-muted max-sm:mb-5 max-sm:ml-8 max-sm:mr-4 max-sm:text-[.66rem]">{faq.answer}</p>
          </details>
        ))}
      </div>
      <a className={buttonStyle} href="#register">Have a question? Register your interest <ArrowUpRight size={16} aria-hidden="true" /></a>
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
    <section className={`${contentWidth} scroll-mt-8 pb-28 pt-[7.5rem] max-[820px]:pt-[5.5rem] max-sm:pb-[4.5rem] max-sm:pt-[4.5rem]`} id="register">
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
              <button className={`${buttonStyle} w-full disabled:cursor-wait disabled:opacity-60`} type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><LoaderCircle className="animate-spin" size={16} /> SENDING VERIFICATION CODE</> : <>SEND EMAIL VERIFICATION CODE <ArrowUpRight size={16} aria-hidden="true" /></>}
              </button>
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
    <footer className="border-t border-byte-line bg-byte-deep">
      <div className={`${contentWidth} grid grid-cols-[1.2fr_1.4fr_.7fr_1fr] items-start gap-8 py-14 max-[820px]:grid-cols-2 max-sm:gap-x-4 max-sm:gap-y-7 max-sm:py-10`}>
        <a className="inline-flex items-center gap-2.5 whitespace-nowrap font-display text-base tracking-[-.04em]" href="#home">
          <span className="grid size-7 place-items-center border border-byte-text bg-byte-teal text-lg leading-none text-[#10131a]">B</span>
          <span>BYTE TALKS</span>
        </a>
        <p className="m-0 font-mono text-[.65rem] leading-relaxed text-byte-muted max-sm:col-span-full max-sm:row-start-2">One campus. Many perspectives.<br />See you on 30 October 2026.</p>
        <div className="grid gap-3 font-mono text-[.58rem]">
          <a className="transition-colors hover:text-byte-yellow" href="#about">ABOUT</a>
          <a className="transition-colors hover:text-byte-yellow" href="#faq">FAQ</a>
          <a className="transition-colors hover:text-byte-yellow" href="#register">REGISTER</a>
        </div>
        <div className="grid gap-3 font-mono text-[.58rem]">
          <a className="inline-flex items-center gap-1 transition-colors hover:text-byte-yellow" href="https://www.instagram.com/gdg_akgec/" target="_blank" rel="noreferrer">INSTAGRAM <ArrowUpRight size={13} aria-hidden="true" /></a>
          <a className="inline-flex items-center gap-1 transition-colors hover:text-byte-yellow" href="https://www.linkedin.com/company/google-developer-groups-on-campus-akgec/posts/?feedView=all" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={13} aria-hidden="true" /></a>
        </div>
      </div>
      <div className={`${contentWidth} flex justify-between gap-4 border-t border-byte-line/40 py-4 font-mono text-[.55rem] text-byte-muted`}>
        <span>BYTE TALKS · AKGEC</span><a href="#home">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}

export function ByteTalksPortal() {
  return (
    <main className="min-h-screen overflow-hidden bg-byte-page font-mono text-byte-text selection:bg-byte-coral selection:text-[#11141b]">
      <a className="fixed left-3 top-3 z-[100] -translate-y-[160%] bg-byte-text px-4 py-3 text-byte-page focus:translate-y-0" href="#main-content">Skip to content</a>
      <EventHeader />
      <div id="main-content">
        <EventHero />
        <AboutSection />
        <SpeakersSection />
        <VoicesSection />
        <PreviousEventsSection />
        <FAQSection />
        <RegistrationSection />
      </div>
      <EventFooter />
    </main>
  );
}
