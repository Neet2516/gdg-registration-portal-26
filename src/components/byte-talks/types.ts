import { useState, useEffect } from 'react';

export const eventDate = new Date(2026, 9, 30);

export const faqs = [
  {
    badge: '01',
    question: 'What is BYTE TALKS 2026?',
    answer: 'BYTE TALKS is the flagship tech conference and speaker forum organised by Google Developer Groups (GDG) on Campus AKGEC. It brings together leading software engineers, AI researchers, and prominent tech alumni for deep-dive technical talks, live architecture breakdowns, and industry career mentorship.',
  },
  {
    badge: '02',
    question: 'Who can attend, and is there any registration fee?',
    answer: 'Registration is 100% free! It is open to all AKGEC students across 1st and 2nd year and all engineering branches (CSE, IT, CS, CS-AIML, CS-DS, ECE, ME, etc.). No prior competitive coding experience is required—curiosity to learn is all you need.',
  },
  {
    badge: '03',
    question: 'What are the event timings and venue?',
    answer: 'The event takes place on 30 October 2026 from 10:00 AM to 12:30 PM at the CSIT Seminar Hall, AKGEC Campus, Ghaziabad. Registered students are requested to report by 9:45 AM for pass verification and check-in.',
  },
  {
    badge: '04',
    question: 'How do I know if my seat reservation is confirmed?',
    answer: 'Due to seminar hall capacity constraints, seats are strictly capped at 200 on a first-come, first-served basis. Once you submit the registration form and verify your email, your digital admission pass (with your QR code and unique ticket number) is generated immediately on screen and sent to your email.',
  },
  {
    badge: '05',
    question: 'I am a 1st-year student with no tech background. Will it be useful?',
    answer: 'Absolutely! The sessions are specifically structured to help beginners demystify modern technology stacks—covering practical roadmaps for AI/ML, Cloud, Web development, open-source programs like GSoC, and preparing for future hackathons and placements.',
  },
];

export const initialForm = {
  fullName: '',
  phone: '',
  studentNumber: '',
  gender: '',
  branch: '',
  residence: '',
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

  const trimmedName = values.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'Enter your full name.';
  } else if (trimmedName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (!/^[a-zA-Z\s.]{2,50}$/.test(trimmedName)) {
    errors.fullName = 'Name can only contain letters and spaces.';
  }

  const trimmedStudentNumber = values.studentNumber.trim();
  if (!trimmedStudentNumber) {
    errors.studentNumber = 'Enter your student number.';
  } else if (!/^(25|26)/.test(trimmedStudentNumber)) {
    errors.studentNumber = 'Only student numbers starting with 25 or 26 are eligible (25***** / 26*****).';
  } else if (!/^(25|26)\d{5,11}$/.test(trimmedStudentNumber)) {
    errors.studentNumber = 'Student number must be 7 to 13 digits starting with 25 or 26.';
  }

  const trimmedPhone = values.phone.trim();
  if (!trimmedPhone) {
    errors.phone = 'Enter your 10-digit mobile number.';
  } else if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
    errors.phone = 'Enter a valid 10-digit mobile number (starts with 6-9).';
  }

  if (!values.gender) errors.gender = 'Choose your gender.';
  if (!values.branch) errors.branch = 'Choose your branch.';
  if (!values.residence) errors.residence = 'Choose Day Scholar or Hosteller.';

  return errors;
}
