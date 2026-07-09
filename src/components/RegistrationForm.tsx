import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Terminal, Info } from 'lucide-react';

const branches = ['CSE', 'CS', 'CSE-DS', 'CSE-AIML', 'AIML', 'IT', 'ECE', 'EN', 'ME', 'CE'] as const;

const registrationSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: 'NAME MUST BE AT LEAST 2 CHARACTERS.' })
    .max(50, { message: 'NAME MUST BE AT MOST 50 CHARACTERS.' }),
  studentNumber: z.string()
    .trim()
    .regex(/^[0-9]{7,8}$/, { message: 'STUDENT NUMBER MUST BE 7 TO 8 DIGITS.' }),
  phoneNumber: z.string()
    .trim()
    .regex(/^[6-9]\d{9}$/, { message: 'PHONE NUMBER MUST BE A VALID 10-DIGIT INDIAN NUMBER.' }),
  email: z.string().trim(),
  githubUsername: z.string()
    .trim()
    .min(1, { message: 'GITHUB USERNAME IS REQUIRED.' }),
  hackerrankUsername: z.string()
    .trim()
    .min(1, { message: 'HACKERRANK USERNAME IS REQUIRED.' }),
  branch: z.enum(['CSE', 'CS', 'CSE-DS', 'CSE-AIML', 'AIML', 'IT', 'ECE', 'EN', 'ME', 'CE'], {
    message: 'PLEASE SELECT A BRANCH.'
  }),
  residencyStatus: z.enum(['dayscholar', 'hosteller'], {
    message: 'PLEASE SELECT A RESIDENCY OPTION.'
  }),
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  onSuccess: (data: RegistrationData) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('TRANSMITTING DATA...');

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
      phoneNumber: '',
      email: '',
      githubUsername: '',
      hackerrankUsername: '',
      branch: undefined,
      residencyStatus: undefined
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

  const onSubmit = (data: RegistrationData) => {
    setIsSubmitting(true);
    
    // Simulate data transmission over networks
    const steps = [
      'ESTABLISHING ENCRYPTED CONNECTION...',
      'VERIFYING ACADEMIC IDENTIFIERS...',
      'TRANSMITTING REGISTER DATA PACKAGE...',
      'REGISTRATION RECORD INITIALIZED.'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingText(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSubmitting(false);
        onSuccess(data);
      }
    }, 800);
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
          <div className="font-mono text-xs tracking-widest text-white animate-pulse">
            {loadingText}
          </div>
          <div className="w-48 h-1.5 bg-zinc-900 border border-zinc-700 relative overflow-hidden">
            <div className="h-full bg-white animate-[scan_2s_infinite_linear]" style={{ width: '40%' }}></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* STUDENT & CONTACT NUMBER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * STUDENT NUMBER
              </label>
              <input
                type="text"
                placeholder="e.g. 2310003"
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
                placeholder="10 Digits"
                {...register('phoneNumber')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.phoneNumber && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.phoneNumber.message}</p>
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
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-500 py-3 px-4 font-sans text-sm outline-none cursor-not-allowed select-none"
            />
          </div>

          {/* GITHUB & HACKERRANK USERNAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * GITHUB USERNAME / ID
              </label>
              <input
                type="text"
                placeholder="e.g. dev_username"
                {...register('githubUsername')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.githubUsername && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.githubUsername.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * HACKERRANK USERNAME / ID
              </label>
              <input
                type="text"
                placeholder="e.g. hr_profile"
                {...register('hackerrankUsername')}
                className="w-full bg-black border border-[#71717A] py-3 px-4 font-sans text-white text-sm focus:border-white focus:outline-none transition-snap placeholder-zinc-700"
              />
              {errors.hackerrankUsername && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.hackerrankUsername.message}</p>
              )}
            </div>
          </div>

          {/* SELECTION BRANCH & RESIDENCY STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-1">
              <label className="block font-mono text-xs text-white tracking-widest uppercase">
                * RESIDENCY ALLOCATION
              </label>
              <div className="flex items-center gap-6 h-12 bg-black border border-[#71717A]/40 px-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="dayscholar"
                    {...register('residencyStatus')}
                    className="appearance-none w-3.5 h-3.5 border border-[#71717A] checked:bg-white checked:border-white focus:outline-none transition-snap"
                  />
                  <span className="font-mono text-xs text-[#71717A] group-hover:text-white transition-snap uppercase select-none">
                    Day Scholar
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    value="hosteller"
                    {...register('residencyStatus')}
                    className="appearance-none w-3.5 h-3.5 border border-[#71717A] checked:bg-white checked:border-white focus:outline-none transition-snap"
                  />
                  <span className="font-mono text-xs text-[#71717A] group-hover:text-white transition-snap uppercase select-none">
                    Hosteller
                  </span>
                </label>
              </div>
              {errors.residencyStatus && (
                <p className="font-mono text-xs text-[#EF4444] pt-1">{errors.residencyStatus.message}</p>
              )}
            </div>
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
