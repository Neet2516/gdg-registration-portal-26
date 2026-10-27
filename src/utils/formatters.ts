/**
 * Builds an AKGEC email from the lowercase first name and student number.
 */
export const generateUniversityEmail = (name: string = '', studentNumber: string = ''): string => {
  const firstName = name ? name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '') : '';
  if (!firstName || !studentNumber) return '';
  return `${firstName}${studentNumber}@akgec.ac.in`;
};

/**
 * Automatically cleans leading zeros from phone numbers
 */
export const sanitizePhoneNumber = (phone: string = ''): string => {
  if (phone.startsWith('0')) {
    return phone.replace(/^0+/, '');
  }
  return phone;
};
