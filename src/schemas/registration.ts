import { z } from 'zod';

// Zod Enums for Select Fields
export const branches = [
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
  'Civil',
] as const;

export const domains = [
  'frontend development',
  'backend development',
  'ml',
  'app',
  'designing',
  'managerial',
] as const;

export const residencyTypes = ['Day Scholar', 'Hosteller'] as const;
export const genders = ['Male', 'Female', 'Other'] as const;

/**
 * Zod validation schema for the student recruitment registration form.
 * Decoupled from backend API payload structure to follow Senior FE clean architecture.
 */
export const registrationSchema = z.object({
  // 1. Applicant Name: 2-30 chars, alphabets & spaces only.
  applicantName: z
    .string({ error: 'Applicant name is required.' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(30, { message: 'Name cannot exceed 30 characters and must contain only letters.' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name cannot exceed 30 characters and must contain only letters.',
    }),

  // 2. Student Number: ONLY digits, starts with 25 or 26, realistic length range 7-13 digits.
  studentNumber: z
    .string({ error: 'Student number is required.' })
    .trim()
    .regex(/^\d+$/, { message: 'Student number must contain only digits.' })
    .regex(/^(25|26)/, { message: 'Only student numbers starting with 25 or 26 are eligible (25***** / 26*****).' })
    .min(7, { message: 'Student number must be between 7 and 13 digits.' })
    .max(13, { message: 'Student number must be between 7 and 13 digits.' }),

  // 3. Contact Number: Exactly 10 digits, ONLY digits.
  contactNumber: z
    .string({ error: 'Contact number is required.' })
    .trim()
    .regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit mobile number.' }),

  // 4. University Mail ID: Valid email format, strictly ends with @akgec.ac.in.
  universityMailId: z
    .string({ error: 'University email is required.' })
    .trim()
    .email({ message: 'Please use your official AKGEC university email ID.' })
    .refine((email) => email.toLowerCase().endsWith('@akgec.ac.in'), {
      message: 'Please use your official AKGEC university email ID.',
    }),

  // 5. Gender: Zod Enum 'Male' | 'Female' | 'Other'.
  gender: z.enum(genders, {
    error: 'Gender must be Male, Female, or Other.',
  }),

  // 6. Selection Branch: Zod Enum.
  selectionBranch: z.enum(branches, {
    error: 'Please select a valid branch.',
  }),

  // 7. Evaluation Domain: Zod Enum.
  evaluationDomain: z.enum(domains, {
    error: 'Please select a valid evaluation domain.',
  }),

  // 8. Residency Allocation: Zod Enum.
  residencyAllocation: z.enum(residencyTypes, {
    error: 'Residency allocation must be Day Scholar or Hosteller.',
  }),

  // 9. GitHub Username / ID: min 1 char, optional alphanumeric + hyphen regex.
  githubUsername: z
    .string({ error: 'GitHub username is required.' })
    .trim()
    .min(1, { message: 'GitHub username is required.' })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'GitHub username must contain only alphanumeric characters and hyphens.',
    }),

  // 10. HackerRank Username / ID: min 1 char.
  hackerrankUsername: z
    .string({ error: 'HackerRank username is required.' })
    .trim()
    .min(1, { message: 'HackerRank username is required.' }),

  // 11. Unstop Username / ID: Optional string or empty literal.
  unstopUsername: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),
});

// Inferred TypeScript Type
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
