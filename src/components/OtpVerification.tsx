import { useRef, useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight, KeyRound, Loader2 } from 'lucide-react';
import type { RegistrationData } from './RegistrationForm';

interface OtpVerificationProps {
  email: string;
  formData: RegistrationData | null;
  onSuccess: () => void;
  onBack: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ email, formData, onSuccess, onBack }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // 6-digit OTP from backend
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
    if (isNaN(Number(val))) return; // only allow numbers

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1); // keep only last character
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input box
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

      // 1. Verify the OTP
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

      // 2. Register the candidate
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
      setError(err.message || 'COMMUNICATION FAILURE: RECORD FAILED TO COMMENCE.');
      setAttempts(prev => prev + 1);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0D0E12] border border-[#71717A] p-6 shadow-2xl relative overflow-hidden transition-snap">
      {/* Visual background overlays */}
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 dither-bg opacity-10 pointer-events-none"></div>

      {/* Terminal Title Bar */}
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
