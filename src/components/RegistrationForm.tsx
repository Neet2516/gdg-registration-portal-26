import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Terminal, Info, AlertTriangle } from 'lucide-react';

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
  branch: z.enum(['CSE', 'CSE(AIML)', 'CSE(DS)', 'CSE(H)', 'CS', 'IT', 'CSIT', 'AIML', 'ECE', 'EN', 'ME', 'Civil'], {
    message: 'PLEASE SELECT A BRANCH.'
  }),
  residence: z.enum(['Hosteller', 'Day Scholar'], {
    message: 'PLEASE SELECT RESIDENCY STATUS.'
  }),
  domain: z.enum(['frontend development', 'backend development', 'ml', 'app', 'designing', 'managerial'], {
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

export type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess: (data: RegistrationData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('TRANSMITTING DATA...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const studentNumberVal = watch('studentNumber');

  // Real-time listener for Student Number to auto-populate University Email ID
  useEffect(() => {
    if (studentNumberVal) {
      setValue('email', `${studentNumberVal}@akgec.ac.in`);
    } else {
      setValue('email', '');
    }
  }, [studentNumberVal, setValue]);

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
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
          captchaToken: 'bypass_recaptcha_token_proximity_6.0'
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
      {/* Visual background accents */}
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 dither-bg opacity-5 pointer-events-none"></div>

      {/* Header Panel Bar */}
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

          {/* APPLICANT NAME */}
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

          {/* STUDENT ID & CONTACT NUMBER */}
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
                {...register('phone')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.phone && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* UNIVERSITY MAIL ID */}
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

          {/* GENDER & SELECTION BRANCH */}
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

          {/* EVALUATION DOMAIN & RESIDENCY STATUS */}
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

          {/* GITHUB & HACKERRANK ID */}
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

          {/* UNSTOP USERNAME/ID (OPTIONAL) */}
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
