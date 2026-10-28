import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Check, Download, LoaderCircle, Mail, Share2, ShieldCheck, Users } from 'lucide-react';
import compassIllustration from '../../assets/images/byte-talks/compass.svg';
import { BRANCHES, DOMAINS } from '../../constants/recruitment';
import { useRecaptchaV3 } from '../../hooks/useRecaptchaV3';
import { registerStudent, sendOtp, verifyOtp } from '../../services/api';
import { generateUniversityEmail } from '../../utils/formatters';
import { initialForm, validateForm } from './types';
import type { FormValues, FormErrors, RegistrationStep } from './types';

export function TicketQrCode({ code }: { code: string }) {
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

export function RegistrationSection() {
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
                <div className="absolute -left-3.5 -top-3.5 size-7 rounded-full bg-[#1B1F27] border-r-2 border-white/40 z-20" />
                <div className="absolute -right-3.5 -top-3.5 size-7 rounded-full bg-[#1B1F27] border-l-2 border-white/40 z-20" />
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
