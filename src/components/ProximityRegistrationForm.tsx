import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Terminal, 
  ArrowRight,
  RefreshCw,
  Loader2,
  Info,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  Mail,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

// ==========================================
// ZOD SCHEMA & TYPES
// ==========================================

const branches = [
  'CSE',
  'CSE(AIML)',
  'CSE(DS)',
  'CSE(H)',
  'CS',
  'IT',
  'CSIT',
  'AIML',
  'ECE',
  'EN',
  'ME',
  'Civil'
] as const;

const domains = [
  'frontend development',
  'backend development',
  'ml',
  'app',
  'designing',
  'managerial'
] as const;

const registrationSchema = z.object({
  name: z.string()
    .trim()
    .min(3, { message: 'NAME MUST BE AT LEAST 3 CHARACTERS.' })
    .max(30, { message: 'NAME MUST BE AT MOST 30 CHARACTERS.' })
    .regex(/^[A-Za-z ]+$/, { message: 'NAME MUST CONTAIN ONLY ALPHABETS AND SPACES.' }),
  studentNumber: z.string()
    .trim()
    .regex(/^25[0-9]{5,6}$/, { message: 'STUDENT ID MUST START WITH 25 AND BE 7-8 DIGITS (1ST YEAR ONLY).' }),
  phone: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: 'PHONE NUMBER MUST BE A VALID 10-DIGIT INDIAN NUMBER.' }),
  email: z.string().trim(),
  gender: z.enum(['Male', 'Female'], {
    message: 'GENDER MUST BE MALE OR FEMALE.'
  }),
  branch: z.enum(branches, {
    message: 'PLEASE SELECT A BRANCH.'
  }),
  residence: z.enum(['Hosteller', 'Day Scholar'], {
    message: 'PLEASE SELECT RESIDENCY STATUS.'
  }),
  domain: z.enum(domains, {
    message: 'PLEASE SELECT A DOMAIN.'
  }),
  githubId: z.string()
    .trim()
    .min(1, { message: 'GITHUB ID/USERNAME IS REQUIRED.' }),
  hackerrankId: z.string()
    .trim()
    .min(1, { message: 'HACKERRANK ID/USERNAME IS REQUIRED.' }),
  unstopId: z.string()
    .trim()
    .optional()
    .or(z.literal(''))
});

type RegistrationData = z.infer<typeof registrationSchema>;

type FormState = 'CAPTCHA_GATE' | 'REGISTRATION_FORM' | 'OTP_VERIFICATION' | 'SUCCESS_SCREEN';

// ==========================================
// 1. CAPTCHA GATE COMPONENT
// ==========================================

interface CaptchaGateProps {
  onSuccess: () => void;
}

const CaptchaGateSub: React.FC<CaptchaGateProps> = ({ onSuccess }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 12) + 4;
    const n2 = Math.floor(Math.random() * 12) + 2;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setError(null);
  };

  useEffect(() => {
    generateCaptcha();
    setTerminalLogs([
      'SYSTEM INITIALIZATION: SECURE CONNECTION DETECTED...',
      'ENCRYPTING LOCAL ENDPOINTS...',
      'CRITICAL AUTHENTICATION GATEWAY LOADED.',
      'AWAITING HUMAN METRICS EVALUATION...'
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctAnswer = num1 + num2;
    const parsedAnswer = parseInt(userAnswer.trim(), 10);

    if (isNaN(parsedAnswer)) {
      setError('ERROR: VALUE MUST BE AN INTEGER.');
      setTerminalLogs(prev => [...prev, '>> AUTHENTICATION TRIAL: FAILED. INPUT INVALID.']);
      return;
    }

    if (parsedAnswer === correctAnswer) {
      setError(null);
      setTerminalLogs(prev => [
        ...prev,
        `>> AUTHENTICATION TRIAL: SUCCESS. EVALUATED ${num1} + ${num2} = ${parsedAnswer}.`,
        'BYPASS GRANTED. TRANSMITTING TERMINAL RIGHTS...'
      ]);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setError('ACCESS DENIED: INVALID EVALUATION.');
      setTerminalLogs(prev => [
        ...prev,
        `>> AUTHENTICATION TRIAL: DENIED. TARGET: ${correctAnswer}, RECEIVED: ${parsedAnswer}.`
      ]);
      generateCaptcha();
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#0D0E12] border border-[#71717A] p-6 shadow-2xl relative overflow-hidden transition-snap">
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 dither-bg opacity-10 pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-[#71717A] pb-3 mb-6 font-mono text-xs tracking-widest text-[#71717A]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-white animate-pulse" />
          <span>PROXIMITY_GATEWAY_V6.0.EXE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 opacity-70"></span>
          <span className="w-2.5 h-2.5 bg-yellow-500 opacity-70"></span>
          <span className="w-2.5 h-2.5 bg-green-500 opacity-70"></span>
        </div>
      </div>

      <div className="font-mono text-[11px] text-[#71717A] bg-black p-4 border border-[#71717A]/40 mb-6 h-36 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {terminalLogs.map((log, index) => (
          <div key={index} className={log.includes('SUCCESS') ? 'text-green-400' : log.includes('DENIED') || log.includes('FAILED') ? 'text-red-500' : ''}>
            {log}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-mono text-xs text-white tracking-widest uppercase">
            HUMAN CAPTCHA VERIFICATION
          </label>
          <div className="flex items-center justify-between bg-black border border-[#71717A] p-4">
            <span className="font-mono text-sm tracking-wider text-white">
              EVALUATE: <span className="text-white underline font-bold">{num1} + {num2}</span> = ?
            </span>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-[#71717A] hover:text-white transition-snap p-1 cursor-pointer"
              title="Refresh Captcha"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="captcha-input-sub" className="block font-mono text-xs text-[#71717A] tracking-wider uppercase">
            ENTER COMPUTED METRIC
          </label>
          <input
            id="captcha-input-sub"
            type="text"
            required
            autoComplete="off"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="TYPE AN ANSWER"
            className="w-full bg-black border border-[#71717A] py-3 px-4 font-mono text-white text-sm focus:border-white focus:outline-none transition-snap uppercase placeholder-[#71717A]/50"
          />
        </div>

        {error && (
          <div className="font-mono text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-2 animate-pulse">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-white hover:bg-black hover:text-white text-black font-mono text-xs font-bold tracking-widest py-3 border border-white flex items-center justify-center gap-2 cursor-pointer transition-snap"
        >
          <span>EXECUTE BYPASS</span>
          <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 2. REGISTRATION FORM COMPONENT
// ==========================================

interface RegistrationFormProps {
  onSuccess: (data: RegistrationData) => void;
}

const RegistrationFormSub: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('TRANSMITTING DATA...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      studentNumber: '',
      phone: '',
      email: '',
      gender: undefined,
      branch: undefined,
      residence: undefined,
      domain: undefined,
      githubId: '',
      hackerrankId: '',
      unstopId: ''
    }
  });

  const nameVal = watch('name');
  const studentNumberVal = watch('studentNumber');

  // Real-time listener for Name and Student Number to auto-populate University Email ID (e.g. name2510003@akgec.ac.in)
  useEffect(() => {
    if (studentNumberVal) {
      const firstName = nameVal ? nameVal.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '') : '';
      setValue('email', `${firstName}${studentNumberVal}@akgec.ac.in`);
    } else {
      setValue('email', '');
    }
  }, [nameVal, studentNumberVal, setValue]);

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    if (!recaptchaToken) {
      setErrorMsg('PLEASE COMPLETE THE RECAPTCHA CHALLENGE.');
      setIsSubmitting(false);
      return;
    }

    setLoadingText('ESTABLISHING ENCRYPTED CONNECTION...');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://proximety-7nt5.vercel.app/api/v1';
      
      setLoadingText('VERIFYING REQUEST HEADERS...');
      await new Promise(r => setTimeout(r, 600));

      setLoadingText('TRANSMITTING OTP SECURE KEY...');
      const response = await fetch(`${backendUrl}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          studentNumber: data.studentNumber,
          captchaToken: recaptchaToken
        })
      });

      const resBody = await response.json();

      if (!response.ok || !resBody.success) {
        throw new Error(resBody.message || 'AUTHENTICATION INIT FAILED. RETRY.');
      }

      setIsSubmitting(false);
      onSuccess(data);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'COMMUNICATION ERROR: BACKEND OFFLINE.');
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#0D0E12] border border-[#71717A] p-6 md:p-8 shadow-2xl relative overflow-hidden transition-snap">
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 dither-bg opacity-5 pointer-events-none"></div>

      <div className="border border-[#71717A] bg-black p-3 mb-8 flex items-center justify-between font-mono text-xs tracking-widest text-white">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-white" />
          <span>[GDG AKGEC RECRUITMENT REPO GATES: PROXIMITY 6.0]</span>
        </div>
        <span className="text-green-500 animate-pulse text-[10px] hidden sm:inline">● SECURE_CHANNEL_ACTIVE</span>
      </div>

      {isSubmitting ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-black border border-[#71717A] p-6 relative">
          <Loader2 className="animate-spin text-white w-12 h-12" />
          <div className="font-mono text-xs tracking-widest text-white animate-pulse text-center">
            {loadingText}
          </div>
          <div className="w-48 h-1.5 bg-zinc-900 border border-zinc-700 relative overflow-hidden">
            <div className="h-full bg-white animate-[scan_2s_infinite_linear]" style={{ width: '40%' }}></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMsg && (
            <div className="font-mono text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-3 flex items-center gap-2 animate-pulse">
              <AlertTriangle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block font-mono text-xs text-white tracking-widest uppercase">
              * APPLICANT NAME
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register('name')}
              className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
            />
            {errors.name && (
              <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * STUDENT NUMBER
              </label>
              <input
                type="text"
                placeholder="e.g. 2510003"
                {...register('studentNumber')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.studentNumber && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.studentNumber.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * CONTACT NUMBER
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                {...register('phone', {
                  onChange: (e) => {
                    const val = e.target.value;
                    if (val.startsWith('0')) {
                      e.target.value = val.replace(/^0+/, '');
                    }
                  }
                })}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.phone && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="block font-mono text-xs text-white tracking-widest uppercase flex items-center justify-between">
              <span>* UNIVERSITY MAIL ID</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-normal flex items-center gap-1 normal-case font-normal">
                <Info size={11} /> Auto-generated based on student number
              </span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="[studentNumber]@akgec.ac.in"
              {...register('email')}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-500 py-3 px-4 font-sans text-sm outline-none cursor-not-allowed select-none animate-pulse"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * GENDER
              </label>
              <div className="relative">
                <select
                  {...register('gender')}
                  className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled hidden>SELECT GENDER</option>
                  <option value="Male" className="bg-black text-white">Male</option>
                  <option value="Female" className="bg-black text-white">Female</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.gender && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.gender.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * SELECTION BRANCH
              </label>
              <div className="relative">
                <select
                  {...register('branch')}
                  className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled hidden>SELECT YOUR BRANCH</option>
                  {branches.map(b => (
                    <option key={b} value={b} className="bg-black text-white">{b}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.branch && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.branch.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * EVALUATION DOMAIN
              </label>
              <div className="relative">
                <select
                  {...register('domain')}
                  className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled hidden>SELECT DOMAIN</option>
                  {domains.map(d => (
                    <option key={d} value={d} className="bg-black text-white uppercase">{d}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
              {errors.domain && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.domain.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * RESIDENCY ALLOCATION
              </label>
              <div className="flex items-center gap-6 h-12 bg-black border border-[#71717A]/40 px-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="Day Scholar"
                    {...register('residence')}
                    className="appearance-none w-3.5 h-3.5 border border-[#71717A] checked:bg-white checked:border-white focus:outline-none transition-snap"
                  />
                  <span className="font-mono text-xs text-[#71717A] group-hover:text-white transition-snap uppercase select-none">
                    Day Scholar
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="Hosteller"
                    {...register('residence')}
                    className="appearance-none w-3.5 h-3.5 border border-[#71717A] checked:bg-white checked:border-white focus:outline-none transition-snap"
                  />
                  <span className="font-mono text-xs text-[#71717A] group-hover:text-white transition-snap uppercase select-none">
                    Hosteller
                  </span>
                </label>
              </div>
              {errors.residence && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.residence.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * GITHUB USERNAME / ID
              </label>
              <input
                type="text"
                placeholder="e.g. dev_username"
                {...register('githubId')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.githubId && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.githubId.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * HACKERRANK USERNAME / ID
              </label>
              <input
                type="text"
                placeholder="e.g. hr_profile"
                {...register('hackerrankId')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.hackerrankId && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.hackerrankId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block font-mono text-xs text-white tracking-widest uppercase">
              UNSTOP USERNAME / ID (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. unstop_coder"
              {...register('unstopId')}
              className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
            />
            {errors.unstopId && (
              <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.unstopId.message}</p>
            )}
          </div>

          {/* RECAPTCHA CHALLENGE */}
          <div className="flex justify-center border border-[#71717A]/40 p-4 bg-black">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() || ''}
              onChange={(token) => setRecaptchaToken(token)}
              theme="dark"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-white hover:bg-black hover:text-white text-black font-mono text-xs font-bold tracking-widest py-4 border border-white cursor-pointer transition-snap"
            >
              INITIALIZE RECRUITMENT GATEWAY
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ==========================================
// 3. OTP VERIFICATION COMPONENT
// ==========================================

interface OtpVerificationProps {
  email: string;
  formData: RegistrationData | null;
  onSuccess: () => void;
  onBack: () => void;
}

const OtpVerificationSub: React.FC<OtpVerificationProps> = ({ email, formData, onSuccess, onBack }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 6 digits
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState('VALIDATING ACCESS CODE...');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    setError(null);

    if (val !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
      setError(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && /^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');

    if (enteredCode.length < 6) {
      setError('ERROR: PLEASE ENTER ALL 6 DIGITS.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    setStatusText('VALIDATING ACCESS CODE...');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://proximety-7nt5.vercel.app/api/v1';

      const verifyResponse = await fetch(`${backendUrl}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: enteredCode,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'INVALID VERIFICATION KEY. ACCESS DENIED.');
      }

      setStatusText('OTP VERIFIED. WRITING RECORD TO DATABASE...');
      await new Promise(r => setTimeout(r, 600));

      const registerResponse = await fetch(`${backendUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData?.name,
          studentNumber: formData?.studentNumber,
          email: formData?.email,
          gender: formData?.gender,
          branch: formData?.branch,
          phone: formData?.phone,
          unstopId: formData?.unstopId || undefined,
          residence: formData?.residence,
          domain: formData?.domain,
          githubId: formData?.githubId,
          hackerrankId: formData?.hackerrankId,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok || !registerData.success) {
        throw new Error(registerData.message || 'REGISTRATION FAILED. TRY RESENDING OTP.');
      }

      setIsVerifying(false);
      onSuccess();
    } catch (err: any) {
      setIsVerifying(false);
      setError(err.message || 'COMMUNICATION FAILURE: RECORD FAILED.');
      setAttempts(prev => prev + 1);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0D0E12] border border-[#71717A] p-6 shadow-2xl relative overflow-hidden transition-snap">
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 dither-bg opacity-10 pointer-events-none"></div>

      <div className="flex items-center justify-between border-b border-[#71717A] pb-3 mb-6 font-mono text-xs tracking-widest text-[#71717A]">
        <div className="flex items-center gap-2">
          <KeyRound size={14} className="text-white animate-pulse" />
          <span>OTP_VALIDATOR.SH</span>
        </div>
        <span>ATTEMPTS: {attempts}</span>
      </div>

      {isVerifying ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-black border border-[#71717A]/40 p-6">
          <Loader2 className="animate-spin text-white w-10 h-10" />
          <div className="font-mono text-[10px] tracking-widest text-white animate-pulse text-center uppercase">
            {statusText}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/40 p-4 mb-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="text-[#EF4444] shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <span className="block font-mono text-xs text-white tracking-wider uppercase font-bold">
                  IDENTITY VERIFICATION REQUIRED
                </span>
                <span className="block font-mono text-[10px] text-[#71717A] tracking-wider leading-relaxed">
                  SECURE IDENTITY VERIFICATION KEY SENT TO:<br />
                  <span className="text-white font-bold underline select-all">{email || 'APPLICANT@akgec.ac.in'}</span>
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block font-mono text-xs text-white tracking-widest uppercase text-center">
                ENTER 6-DIGIT VERIFICATION KEY
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-10 h-12 bg-black border border-[#71717A] focus:border-white text-center text-lg font-mono text-white focus:outline-none transition-snap"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <span className="block font-mono text-[9px] text-center text-zinc-600 tracking-wider uppercase leading-normal">
                (Note: First years use college email. Check spam folder if code is delayed.<br />
                Use bypass email <span className="text-zinc-500 underline font-bold">razortest2515312@akgec.ac.in</span> and any OTP code to test frontend.)
              </span>
            </div>

            {error && (
              <div className="font-mono text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-2 text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-white hover:bg-black hover:text-white text-black font-mono text-xs font-bold tracking-widest py-3 border border-white flex items-center justify-center gap-2 cursor-pointer transition-snap"
              >
                <span>CONFIRM CODE ENTRY & VERIFY</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full bg-transparent hover:bg-zinc-900 text-[#71717A] hover:text-white font-mono text-[10px] tracking-wider py-2 border border-transparent hover:border-[#71717A]/40 cursor-pointer transition-snap uppercase"
              >
                Go Back To Form
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

// ==========================================
// 4. SUCCESS SCREEN COMPONENT
// ==========================================

interface SuccessScreenProps {
  formData: RegistrationData | null;
}

const SuccessScreenSub: React.FC<SuccessScreenProps> = ({ formData }) => {
  const regTimestamp = new Date().toLocaleString();
  const applicationHash = `PROX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${formData?.studentNumber || '0000000'}`;

  return (
    <div className="w-full max-w-xl bg-[#0D0E12] border border-[#71717A] p-6 md:p-8 shadow-2xl relative overflow-hidden transition-snap">
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 dither-bg opacity-10 pointer-events-none"></div>

      <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 mb-6"></div>

      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 border border-green-500/40 text-green-500 animate-pulse">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-1">
          <h1 className="font-mono text-base md:text-lg text-white font-bold tracking-widest uppercase">
            REGISTRATION SECURED // APPLICATION STATE: ACTIVE
          </h1>
          <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            TRANSMISSION RECORD ID: <span className="text-white select-all">{applicationHash}</span>
          </p>
        </div>
      </div>

      <div className="bg-black border border-[#71717A]/40 p-5 font-mono text-xs text-white space-y-4 relative mb-6">
        <div className="absolute top-0 right-0 p-2 bg-[#71717A]/10 border-l border-b border-[#71717A]/40 text-[9px] uppercase tracking-widest text-[#71717A]">
          Official Entry pass
        </div>
        
        <h2 className="text-[#71717A] text-[10px] tracking-widest uppercase border-b border-[#71717A]/20 pb-2">
          CRUCIBLE CANDIDATE FILE
        </h2>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">APPLICANT</span>
            <span className="text-white font-bold uppercase">{formData?.name || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">STUDENT ID</span>
            <span className="text-white font-bold">{formData?.studentNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">SELECTION BRANCH</span>
            <span className="text-white font-bold">{formData?.branch || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">RESIDENCY</span>
            <span className="text-white font-bold uppercase">{formData?.residence || 'N/A'}</span>
          </div>
          <div className="col-span-2">
            <span className="block text-[#71717A] text-[9px] uppercase tracking-wider">INSTITUTIONAL EMAIL</span>
            <span className="text-white font-bold select-all">{formData?.email || 'N/A'}</span>
          </div>
        </div>

        <div className="border-t border-[#71717A]/20 pt-3 text-[10px] text-zinc-500 flex justify-between items-center">
          <span>COMPILED ON: {regTimestamp}</span>
          <span className="text-green-500 font-bold">VERIFIED_SECURE</span>
        </div>
      </div>

      <div className="space-y-4 font-sans text-sm text-[#71717A] border-t border-[#71717A]/20 pt-6">
        <p className="leading-relaxed font-sans text-white/90">
          Welcome to the crucible. Keep monitoring your institutional mail inbox for Phase 01 MCQ entry coordinates.
        </p>
        <p className="text-xs leading-relaxed font-mono text-[#71717A]">
          Your credentials have been successfully written to the secure recruitment datastore. You are now queued to undergo evaluation. Maintain operational readiness.
        </p>
      </div>

      <div className="mt-8 pt-4 border-t border-[#71717A]/20 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 p-3 bg-zinc-950 border border-zinc-800 flex items-center gap-3">
          <Mail size={16} className="text-[#71717A]" />
          <div className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
            EMAIL SENT TO:<br />
            <span className="text-white font-bold">{formData?.email || 'N/A'}</span>
          </div>
        </div>
        <div className="flex-1 p-3 bg-zinc-950 border border-zinc-800 flex items-center gap-3">
          <Calendar size={16} className="text-[#71717A]" />
          <div className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">
            PHASE 1 MCQ SCREENING:<br />
            <span className="text-white font-bold">TBA (CHECK MAIL)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMBINED EXPORT CONTROLLER
// ==========================================

export default function ProximityRegistrationForm() {
  const [currentState, setCurrentState] = useState<FormState>('CAPTCHA_GATE');
  const [formData, setFormData] = useState<RegistrationData | null>(null);

  const handleCaptchaSuccess = () => {
    setCurrentState('REGISTRATION_FORM');
  };

  const handleRegistrationSuccess = (data: RegistrationData) => {
    setFormData(data);
    setCurrentState('OTP_VERIFICATION');
  };

  const handleOtpSuccess = () => {
    setCurrentState('SUCCESS_SCREEN');
  };

  const handleOtpBack = () => {
    setCurrentState('REGISTRATION_FORM');
  };

  return (
    <div className="w-full flex justify-center py-4">
      {currentState === 'CAPTCHA_GATE' && (
        <CaptchaGateSub onSuccess={handleCaptchaSuccess} />
      )}

      {currentState === 'REGISTRATION_FORM' && (
        <RegistrationFormSub onSuccess={handleRegistrationSuccess} />
      )}

      {currentState === 'OTP_VERIFICATION' && (
        <OtpVerificationSub 
          email={formData?.email || ''} 
          formData={formData}
          onSuccess={handleOtpSuccess} 
          onBack={handleOtpBack}
        />
      )}

      {currentState === 'SUCCESS_SCREEN' && (
        <SuccessScreenSub formData={formData} />
      )}
    </div>
  );
}
