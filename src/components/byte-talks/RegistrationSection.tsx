import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Check, Download, LoaderCircle, Mail, RotateCw, Share2, ShieldCheck, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { BRANCHES } from '../../constants/recruitment';
import { useRecaptchaV3 } from '../../hooks/useRecaptchaV3';
import { registerStudent, sendOtp, verifyOtp } from '../../services/api';
import { generateUniversityEmail } from '../../utils/formatters';
import { toast } from './Toast';
import { initialForm, validateForm } from './types';
import type { FormValues, FormErrors, RegistrationStep } from './types';

function PrintableTicketCard({ values }: { values: FormValues }) {
  return (
    <div className="w-[380px] bg-[#1c242b] border-2 border-[#1c242b] text-white overflow-hidden font-mono shadow-none m-0">
      {/* Red Header */}
      <div className="bg-[#de432c] p-5 text-white border-b-2 border-white/30">
        <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
          <span className="font-mono text-[0.66rem] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
            • BYTE TALKS 2026 •
          </span>
          <span className="font-mono text-[0.62rem] font-bold uppercase tracking-widest text-white/90">
            AKGEC CAMPUS
          </span>
        </div>
        <div className="mt-3.5 flex items-end justify-between">
          <div>
            <span className="font-mono text-[0.58rem] font-bold uppercase tracking-widest text-white/80 block">
              OFFICIAL ADMISSION TICKET
            </span>
            <span className="font-display text-xl font-black text-white tracking-tight">
              OCT 30, 2026
            </span>
          </div>
          <span className="font-mono text-xs font-black bg-[#1c242b] text-white px-2 py-1 border border-white/40 whitespace-nowrap">
            10:00 AM – 12:30 PM
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 text-white bg-[#1c242b]">
        <div className="mb-4">
          <span className="font-mono text-[0.6rem] font-bold uppercase tracking-wider text-[#55a8a8] block">
            ATTENDEE NAME
          </span>
          <h4 className="mt-1 font-display text-2xl font-black uppercase tracking-tight text-white leading-none">
            {values.fullName || 'AKSHAT DIXIT'}
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3.5 border-t border-white/15 pt-3.5 text-left">
          <div>
            <span className="font-mono text-[0.56rem] font-bold uppercase tracking-wider text-white/50 block">
              STUDENT NUMBER
            </span>
            <span className="font-mono text-xs font-bold text-white">
              {values.studentNumber || '2500270100000'}
            </span>
          </div>
          <div>
            <span className="font-mono text-[0.56rem] font-bold uppercase tracking-wider text-white/50 block">
              BRANCH
            </span>
            <span className="font-mono text-xs font-bold text-white">
              {values.branch || 'CSE'}
            </span>
          </div>
          <div className="col-span-2">
            <span className="font-mono text-[0.56rem] font-bold uppercase tracking-wider text-white/50 block">
              VENUE
            </span>
            <span className="font-mono text-xs font-bold text-[#e2a444]">
              CSIT SEMINAR HALL
            </span>
          </div>
        </div>

        {/* Perforation */}
        <div className="my-5 border-t-2 border-dashed border-white/20" />

        {/* QR Code */}
        <div className="flex flex-col items-center">
          <TicketQrCode code={values.studentNumber || 'BT2026'} />
          <span className="mt-2.5 font-mono text-[0.58rem] font-bold uppercase tracking-widest text-white/60">
            SCAN FOR ENTRY VERIFICATION
          </span>
        </div>

        {/* Verification Footnote */}
        <div className="mt-4 pt-3 border-t border-white/15 text-center">
          <p className="font-mono text-[8.5px] text-white/70 uppercase tracking-wider m-0">
            AKGEC • CSIT SEMINAR HALL • OCT 30, 2026 (10:00 AM – 12:30 PM)
          </p>
          <p className="font-mono text-[7.5px] text-white/50 m-0 mt-0.5">
            Valid for single entry with physical college ID card.
          </p>
        </div>
      </div>
    </div>
  );
}

export function TicketQrCode({ code }: { code: string }) {
  const [svgString, setSvgString] = useState<string>('');

  useEffect(() => {
    const rawValue = code?.trim() || '2500000000000';
    QRCode.toString(rawValue, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#1c242b',
        light: '#ffffff',
      },
    })
      .then((svg) => {
        setSvgString(svg);
      })
      .catch((err) => {
        console.error('Failed to generate dynamic ticket QR code:', err);
      });
  }, [code]);

  return (
    <div className="inline-block rounded-none border-2 border-[#1c242b] bg-white p-2.5 sm:p-3 shadow-[4px_4px_0_#1c242b]">
      {svgString ? (
        <div
          className="size-28 sm:size-32 select-none flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
          dangerouslySetInnerHTML={{ __html: svgString }}
          aria-label={`Official QR Code encoding student number: ${code}`}
        />
      ) : (
        <div className="size-28 sm:size-32 bg-gray-100 flex items-center justify-center font-mono text-[9px] text-[#1c242b] font-bold">
          GENERATING QR...
        </div>
      )}
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
      const firstErrorMessage = Object.values(nextErrors)[0];
      setNotice('Please fix the highlighted fields to continue.');
      toast.error('Form Incomplete', firstErrorMessage || 'Please fill all required fields correctly.');
      return;
    }

    if (!email) {
      setNotice('Enter your full name and student number to generate your college email.');
      toast.warning('Email Missing', 'Enter your full name and student number to generate your college email.');
      return;
    }

    setIsSubmitting(true);
    setNotice('');
    const loadingToastId = toast.loading('Sending Verification Code', `Dispatching 6-digit OTP to ${email}...`);

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
      toast.dismiss(loadingToastId);
      toast.success('Verification Code Sent!', `6-digit code dispatched to ${email}`);
    } catch (error) {
      toast.dismiss(loadingToastId);
      const msg = error instanceof Error ? error.message : 'Could not send verification code. Please try again.';
      setNotice(msg);
      toast.error('Failed to Send Code', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setNotice('Enter the 6-digit code sent to your AKGEC email.');
      toast.warning('Invalid Code', 'Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    setNotice('');
    const loadingToastId = toast.loading('Verifying Pass', 'Confirming credentials and generating your admission ticket...');

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
      });
      setStep('success');
      toast.dismiss(loadingToastId);
      toast.success('Registration Confirmed!', 'Welcome to BYTE TALKS 2026. Your pass has been issued!');
      setTimeout(() => {
        const ticketEl = document.getElementById('printable-ticket');
        if (ticketEl) {
          ticketEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } catch (error) {
      toast.dismiss(loadingToastId);
      const msg = error instanceof Error ? error.message : 'Registration failed. Please check the code and retry.';
      setNotice(msg);
      toast.error('Verification Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const loadingToastId = toast.loading('Resending Code', `Sending fresh OTP to ${email}...`);
    try {
      const captchaToken = await executeRecaptcha('registration');
      await sendOtp({
        name: values.fullName.trim(),
        email,
        studentNumber: values.studentNumber.trim(),
        captchaToken,
      });
      toast.dismiss(loadingToastId);
      toast.success('Code Resent!', `A fresh verification code was sent to ${email}`);
      setNotice(`A fresh verification code was sent to ${email}`);
    } catch (error) {
      toast.dismiss(loadingToastId);
      const msg = error instanceof Error ? error.message : 'Could not resend verification code.';
      setNotice(msg);
      toast.error('Resend Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintTicket = async () => {
    toast.info('Generating Ticket', 'Opening printable single-page pass...');

    try {
      const qrSvg = await QRCode.toString(values.studentNumber?.trim() || '2500000000000', {
        type: 'svg',
        margin: 1,
        color: { dark: '#1c242b', light: '#ffffff' },
      });

      let printFrame = document.getElementById('ticket-hidden-iframe') as HTMLIFrameElement;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'ticket-hidden-iframe';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
      }

      const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
      if (!frameDoc) {
        window.print();
        return;
      }

      frameDoc.open();
      frameDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BYTE_TALKS_2026_PASS_${values.studentNumber || 'TICKET'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", monospace;
      width: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .ticket-card {
      width: 380px;
      border: 3px solid #1c242b;
      background: #1c242b;
      color: #ffffff;
      overflow: hidden;
      margin: 0 auto;
    }
    .ticket-header {
      background-color: #de432c !important;
      padding: 22px 24px;
      border-bottom: 2px solid rgba(255,255,255,0.4);
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      padding-bottom: 10px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .header-tag {
      background: rgba(255,255,255,0.25);
      padding: 3px 8px;
      border-radius: 2px;
    }
    .header-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 14px;
    }
    .event-date-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: rgba(255,255,255,0.85);
      letter-spacing: 0.12em;
    }
    .event-date {
      font-size: 22px;
      font-weight: 900;
      text-transform: uppercase;
      margin-top: 2px;
      letter-spacing: -0.02em;
    }
    .event-time-badge {
      background: #1c242b !important;
      color: #ffffff !important;
      padding: 4px 8px;
      font-size: 11.5px;
      font-weight: 800;
      border: 1px solid rgba(255,255,255,0.4);
      white-space: nowrap;
    }
    .ticket-body {
      padding: 24px 26px;
      background: #1c242b !important;
    }
    .attendee-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      color: #55a8a8;
      letter-spacing: 0.14em;
    }
    .attendee-name {
      font-size: 24px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin-top: 4px;
      margin-bottom: 16px;
      line-height: 1.1;
      word-break: break-word;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      border-top: 1px solid rgba(255,255,255,0.15);
      padding-top: 14px;
    }
    .field-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      color: rgba(255,255,255,0.5);
      letter-spacing: 0.12em;
      display: block;
      margin-bottom: 2px;
    }
    .field-value {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
    }
    .field-value.venue {
      color: #f2c35b;
    }
    .perforation {
      border-top: 2px dashed rgba(255,255,255,0.22);
      margin: 20px 0 18px 0;
    }
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .qr-box {
      background: #ffffff !important;
      padding: 10px;
      border: 2px solid #1c242b;
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-box svg {
      width: 100%;
      height: 100%;
    }
    .qr-caption {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
      margin-top: 9px;
    }
    .ticket-footer {
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.15);
      text-align: center;
      font-size: 8px;
      color: rgba(255,255,255,0.7);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="ticket-card">
    <div class="ticket-header">
      <div class="header-top">
        <span class="header-tag">• BYTE TALKS 2026 •</span>
        <span>AKGEC CAMPUS</span>
      </div>
      <div class="header-bottom">
        <div>
          <div class="event-date-label">OFFICIAL ADMISSION TICKET</div>
          <div class="event-date">OCT 30, 2026</div>
        </div>
        <div class="event-time-badge">10:00 AM – 12:30 PM</div>
      </div>
    </div>
    <div class="ticket-body">
      <div class="attendee-label">ATTENDEE NAME</div>
      <div class="attendee-name">${values.fullName || 'AKSHAT DIXIT'}</div>
      
      <div class="details-grid">
        <div>
          <span class="field-label">STUDENT NUMBER</span>
          <span class="field-value">${values.studentNumber || '2500270100000'}</span>
        </div>
        <div>
          <span class="field-label">BRANCH</span>
          <span class="field-value">${values.branch || 'CSE'}</span>
        </div>
        <div style="grid-column: span 2;">
          <span class="field-label">VENUE</span>
          <span class="field-value venue">CSIT SEMINAR HALL</span>
        </div>
      </div>

      <div class="perforation"></div>

      <div class="qr-section">
        <div class="qr-box">
          ${qrSvg}
        </div>
        <div class="qr-caption">SCAN FOR ENTRY VERIFICATION</div>
      </div>

      <div class="ticket-footer">
        <div>AKGEC • CSIT SEMINAR HALL • OCT 30, 2026 (10:00 AM – 12:30 PM)</div>
        <div style="color: rgba(255,255,255,0.5); font-size: 7.5px; margin-top: 2px;">
          Valid for single entry. Please carry your physical college ID card.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      }, 300);
    } catch (err) {
      console.error('Print generation failed:', err);
      window.print();
    }
  };

  const handleAddToCalendar = () => {
    toast.success('Opening Calendar', 'Redirecting to Google Calendar with session details...');
    const title = encodeURIComponent('BYTE TALKS 2026 | AKGEC');
    const details = encodeURIComponent(
      `BYTE TALKS 2026 Admission Confirmed for ${values.fullName}. Student Number: ${values.studentNumber}. Venue: CSIT Seminar Hall, AKGEC Campus. Timing: 10:00 AM to 12:30 PM.`
    );
    const location = encodeURIComponent('CSIT Seminar Hall, AKGEC Campus, Ghaziabad');
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261030T043000Z/20261030T070000Z&details=${details}&location=${location}`;
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
        toast.success('Pass Shared!', 'Thank you for sharing BYTE TALKS 2026.');
        return;
      } catch {
        // fallback to clipboard
      }
    }
    navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
    setCopied(true);
    toast.success('Copied to Clipboard!', 'Registration portal link and invitation copied.');
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
    <section id="register" className="relative w-full bg-[#1B1F27] py-20 md:py-28 text-white overflow-hidden scroll-mt-6">
      {/* Background Graphic: Left Flank - Exactly 2 Enlarged Rows/Columns of "BYTE TALKS" Typography */}
      <div 
        className="pointer-events-none absolute left-0 top-0 bottom-0 select-none z-0 hidden lg:flex items-start justify-start gap-6 xl:gap-12 pl-2 sm:pl-4 xl:pl-6 w-[clamp(180px,calc((100vw-680px)/2),480px)] overflow-hidden opacity-35 xl:opacity-45 print:hidden"
        aria-hidden="true"
      >
        {/* Row 1 (Outer edge - Giant Bold White Outlined) */}
        <div className="flex flex-col gap-14 font-display text-[clamp(5rem,8.5vw,8.5rem)] font-black uppercase tracking-widest text-transparent [-webkit-text-stroke:2.5px_rgba(255,255,255,0.4)] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
          {['BYTE TALKS', 'BYTETALKS', 'BYTE TALKS', 'BYTETALKS', 'BYTE TALKS', 'BYTETALKS', 'BYTE TALKS', 'BYTETALKS'].map((text, i) => (
            <span key={`left-r1-${i}`}>{text}</span>
          ))}
        </div>

        {/* Row 2 (Inner edge - Enlarged Coral Red Accent Outlined) */}
        <div className="flex flex-col gap-12 font-display text-[clamp(3.8rem,6.5vw,6.5rem)] font-black uppercase tracking-wider text-transparent [-webkit-text-stroke:2px_rgba(222,67,44,0.6)] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
          {['BYTE TALKS 2026', 'AKGEC GHAZIABAD', 'BYTE TALKS 2026', 'GDG ON CAMPUS', 'BYTE TALKS 2026', 'AKGEC GHAZIABAD', 'BYTE TALKS 2026', 'GDG ON CAMPUS'].map((text, i) => (
            <span key={`left-r2-${i}`}>{text}</span>
          ))}
        </div>
      </div>

      {/* Background Graphic: Right Flank - Exactly 2 Enlarged Rows/Columns of "BYTE TALKS" Typography */}
      <div 
        className="pointer-events-none absolute right-0 top-0 bottom-0 select-none z-0 hidden lg:flex items-start justify-end gap-6 xl:gap-12 pr-2 sm:pr-4 xl:pr-6 w-[clamp(180px,calc((100vw-680px)/2),480px)] overflow-hidden opacity-35 xl:opacity-45 print:hidden"
        aria-hidden="true"
      >
        {/* Row 2 (Inner edge - Enlarged Yellow/Gold Accent Outlined) */}
        <div className="flex flex-col gap-12 font-display text-[clamp(3.8rem,6.5vw,6.5rem)] font-black uppercase tracking-wider text-transparent [-webkit-text-stroke:2px_rgba(242,195,91,0.6)] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
          {['BYTE TALKS 2026', 'AKGEC GHAZIABAD', 'BYTE TALKS 2026', 'GDG ON CAMPUS', 'BYTE TALKS 2026', 'AKGEC GHAZIABAD', 'BYTE TALKS 2026', 'GDG ON CAMPUS'].map((text, i) => (
            <span key={`right-r2-${i}`}>{text}</span>
          ))}
        </div>

        {/* Row 1 (Outer edge - Giant Bold White Outlined) */}
        <div className="flex flex-col gap-14 font-display text-[clamp(5rem,8.5vw,8.5rem)] font-black uppercase tracking-widest text-transparent [-webkit-text-stroke:2.5px_rgba(255,255,255,0.4)] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
          {['BYTE TALKS', 'BYTETALKS', 'BYTE TALKS', 'BYTETALKS', 'BYTE TALKS', 'BYTETALKS', 'BYTE TALKS', 'BYTETALKS'].map((text, i) => (
            <span key={`right-r1-${i}`}>{text}</span>
          ))}
        </div>
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
              className="text-center pt-6 print:hidden"
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
              className="relative mx-auto max-w-[420px] overflow-hidden border-3 border-white/40 shadow-[12px_12px_0_#000000] print:border-2 print:border-black print:shadow-none print:max-w-none print:w-[380px] print:my-0"
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
                  <span className="font-mono text-xs sm:text-sm font-black bg-[#1c242b] text-white px-2 sm:px-2.5 py-1 border border-white/40 whitespace-nowrap">
                    10:00 AM – 12:30 PM
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
                      {values.studentNumber || '2500270100000'}
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
                  <div className="col-span-2">
                    <span className="font-mono text-[0.58rem] font-bold uppercase tracking-wider text-white/50 block">
                      VENUE
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#e2a444]">
                      CSIT SEMINAR HALL
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
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
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
            <div className="pt-16 border-t border-white/15 print:hidden">
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
                    Arrive at CSIT Seminar Hall by 9:30 AM on 30 October 2026. Carry your college physical ID card and this digital pass.
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
              <div className="mt-12 text-center print:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setValues(initialForm);
                    setOtp('');
                    setNotice('');
                    toast.info('Form Reset', 'Ready for a new student registration.');
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
            <div id="registration-form" className="border-2 border-white/30 bg-[#1a222f] p-6 sm:p-9 shadow-[12px_12px_0_#000000] scroll-mt-16">
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

                    <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('form');
                          setNotice('');
                          toast.info('Edit Mode', 'Returned to registration form.');
                        }}
                        className="border-0 bg-transparent font-mono text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white underline underline-offset-4 cursor-pointer"
                      >
                        ← Back to edit
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 border-0 bg-transparent font-mono text-xs font-bold uppercase tracking-wider text-[#55a8a8] hover:text-[#76cfcf] cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw size={13} className={isSubmitting ? 'animate-spin' : ''} /> Resend Code
                      </button>
                    </div>
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
                      <div className="flex items-baseline justify-between">
                        <span>STUDENT NUMBER <b className="text-[#de432c]">*</b></span>
                        <span className="font-mono text-[0.56rem] text-white/50 normal-case tracking-normal">
                          Starts with 25 or 26
                        </span>
                      </div>
                      <input
                        className={inputStyle}
                        id="studentNumber"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={13}
                        placeholder="e.g. 2500270100000 or 2600270100000"
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
                  </div>

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

      {step === 'success' && typeof document !== 'undefined' && createPortal(
        <div id="ticket-print-portal" aria-hidden="true" className="hidden">
          <PrintableTicketCard values={values} />
        </div>,
        document.body
      )}
    </section>
  );
}
