import { useState, useEffect } from 'react';

export const eventDate = new Date(2026, 9, 30);

export const faqs = [
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

export const initialForm = {
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

export type FormValues = typeof initialForm;
export type FormErrors = Partial<Record<keyof FormValues, string>>;
export type RegistrationStep = 'form' | 'otp' | 'success';

export function getEventCountdown(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const difference = eventDate.getTime() - today.getTime();

  if (difference < 0) return 'EVENT COMPLETE';
  if (difference === 0) return 'HAPPENING TODAY';

  const days = Math.ceil(difference / 86_400_000);
  return `${String(days).padStart(2, '0')} DAYS TO GO`;
}

export function useLiveCountdown() {
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

export function validateForm(values: FormValues): FormErrors {
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
