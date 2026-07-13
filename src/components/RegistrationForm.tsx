import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Info, AlertTriangle } from 'lucide-react';
import { useRecaptchaV3 } from '../hooks/useRecaptchaV3';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Radio } from './Radio';
import { BRANCHES, DOMAINS } from '../constants/recruitment';
import { generateUniversityEmail } from '../utils/formatters';
import { sendOtp } from '../services/api';
import spidermanSideLook from '../assets/images/spiderman-side-look.png';

const registrationSchema = z.object({
  name: z.string({ error: 'Applicant name is required.' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(30, { message: 'Name cannot exceed 30 characters and must contain only letters.' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name cannot exceed 30 characters and must contain only letters.' }),
  studentNumber: z.string({ error: 'Student number is required.' })
    .trim()
    .regex(/^\d+$/, { message: 'Student number must contain only digits.' })
    .min(7, { message: 'Student number must be between 7 and 13 digits.' })
    .max(13, { message: 'Student number must be between 7 and 13 digits.' }),
  phone: z.string({ error: 'Contact number is required.' })
    .trim()
    .regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  email: z.string({ error: 'University email is required.' })
    .trim()
    .email({ message: 'Please use your official AKGEC university email ID.' })
    .refine((email) => email.toLowerCase().endsWith('@akgec.ac.in'), {
      message: 'Please use your official AKGEC university email ID.',
    }),
  gender: z.enum(['Male', 'Female', 'Other'], {
    error: 'Gender must be Male, Female, or Other.',
  }),
  branch: z.enum(BRANCHES, {
    error: 'Please select a valid branch.',
  }),
  residence: z.enum(['Day Scholar', 'Hosteller'], {
    error: 'Residency allocation must be Day Scholar or Hosteller.',
  }),
  domain: z.enum(DOMAINS, {
    error: 'Please select a valid evaluation domain.',
  }),
  githubId: z.string({ error: 'GitHub username is required.' })
    .trim()
    .min(1, { message: 'GitHub username is required.' })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'GitHub username must contain only alphanumeric characters and hyphens.',
    }),
  hackerrankId: z.string({ error: 'HackerRank username is required.' })
    .trim()
    .min(1, { message: 'HackerRank username is required.' }),
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
  const { executeRecaptcha, hasRecaptcha } = useRecaptchaV3();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
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
  const emailVal = watch('email');

  
  useEffect(() => {
    const email = generateUniversityEmail(nameVal, studentNumberVal);
    if (email !== emailVal) {
      setValue('email', email, { shouldValidate: true });
    }
  }, [nameVal, studentNumberVal, emailVal, setValue]);

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setLoadingText('SOLVING ANTIBOT CHALLENGE...');

    try {
      let token = 'bypass_token';

      if (hasRecaptcha) {
        setLoadingText('GENERATING CAPTCHA TOKEN...');
        try {
          token = await executeRecaptcha('registration');
        } catch (captchaErr: any) {
          console.error(captchaErr);
          throw new Error(captchaErr.message || 'SECURITY TOKEN INITIALIZATION FAILED. PLEASE REFRESH.');
        }
      }

      setLoadingText('ESTABLISHING ENCRYPTED CONNECTION...');
      await new Promise(r => setTimeout(r, 600));

      setLoadingText('TRANSMITTING OTP SECURE KEY...');
      await sendOtp({
        name: data.name,
        email: data.email,
        studentNumber: data.studentNumber,
        captchaToken: token
      });

      setIsSubmitting(false);
      onSuccess(data);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'COMMUNICATION ERROR: BACKEND OFFLINE.');
    }
  };

  return (
    <Card
      showHeader={false}
      className="max-w-2xl"
    >
      {isSubmitting ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-6 bg-black border border-[#71717A]/40 p-6 relative rounded-xl">
          <Loader2 className="animate-spin text-white w-12 h-12" />
          <div className="font-mono text-xs tracking-widest text-white animate-pulse text-center">
            {loadingText}
          </div>
          <div className="w-48 h-1.5 bg-zinc-900 border border-zinc-700 rounded-full relative overflow-hidden">
            <div className="h-full bg-white rounded-full animate-[scan_2s_infinite_linear]" style={{ width: '40%' }}></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative overflow-hidden">
          {/* Mobile/Tablet Background Watermark */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none md:hidden z-0 overflow-hidden opacity-25">
            <img 
              src={spidermanSideLook} 
              alt="Spider-Man Watermark" 
              className="w-full max-w-xs h-auto object-contain filter drop-shadow-[0_0_15px_rgba(225,29,72,0.25)]"
            />
          </div>

          <div className="relative z-10 space-y-6">
            {errorMsg && (
              <div className="font-mono text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-3 flex items-center gap-2 animate-pulse rounded-xl">
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* APPLICANT NAME */}
            <Input
              id="name"
              label="* APPLICANT NAME"
              placeholder="e.g. Rahul Sharma"
              error={errors.name?.message}
              register={register('name')}
            />

            {/* STUDENT ID & CONTACT NUMBER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="studentNumber"
                label="* STUDENT NUMBER"
                placeholder="e.g. 2510003"
                error={errors.studentNumber?.message}
                register={register('studentNumber')}
              />

              <Input
                id="phone"
                label="* CONTACT NUMBER"
                placeholder="e.g. 9876543210"
                error={errors.phone?.message}
                register={register('phone', {
                  onChange: (e: any) => {
                    const val = e.target.value;
                    if (val.startsWith('0')) {
                      e.target.value = val.replace(/^0+/, '');
                    }
                  }
                })}
              />
            </div>

            {/* UNIVERSITY MAIL ID */}
            <Input
              id="email"
              label="* UNIVERSITY MAIL ID"
              readOnly={true}
              placeholder="[studentNumber]@akgec.ac.in"
              register={register('email')}
              labelExtra={
                <span className="text-[10px] text-zinc-500 font-mono tracking-normal flex items-center gap-1 normal-case font-normal select-none">
                  <Info size={11} /> Auto-generated based on student number
                </span>
              }
            />

            {/* GENDER & SELECTION BRANCH */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="gender"
                label="* GENDER"
                type="select"
                placeholder="SELECT GENDER"
                error={errors.gender?.message}
                register={register('gender')}
                options={['Male', 'Female', 'Other']}
              />

              <Input
                id="branch"
                label="* SELECTION BRANCH"
                type="select"
                placeholder="SELECT YOUR BRANCH"
                error={errors.branch?.message}
                register={register('branch')}
                options={BRANCHES}
              />
            </div>

            {/* EVALUATION DOMAIN & RESIDENCY STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="domain"
                label="* EVALUATION DOMAIN"
                type="select"
                placeholder="SELECT DOMAIN"
                error={errors.domain?.message}
                register={register('domain')}
                options={DOMAINS}
              />

              <Radio
                label="* RESIDENCY ALLOCATION"
                options={[
                  { label: 'Day Scholar', value: 'Day Scholar' },
                  { label: 'Hosteller', value: 'Hosteller' }
                ]}
                register={register('residence')}
                error={errors.residence?.message}
              />
            </div>

            {/* GITHUB & HACKERRANK ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="githubId"
                label="* GITHUB USERNAME / ID"
                placeholder="e.g. dev_username"
                error={errors.githubId?.message}
                register={register('githubId')}
              />

              <Input
                id="hackerrankId"
                label="* HACKERRANK USERNAME / ID"
                placeholder="e.g. hr_profile"
                error={errors.hackerrankId?.message}
                register={register('hackerrankId')}
              />
            </div>

            {/* UNSTOP USERNAME/ID (OPTIONAL) */}
            <Input
              id="unstopId"
              label="UNSTOP USERNAME / ID (OPTIONAL)"
              placeholder="e.g. unstop_coder"
              error={errors.unstopId?.message}
              register={register('unstopId')}
            />

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 text-sm"
              >
                <span className='text-2xl'>INITIALIZE RECRUITMENT GATEWAY</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </Card>
  );
};
