/**
 * Dynamically auto-populates university email as lowercase first name + student number + @akgec.ac.in
 */
export const generateUniversityEmail = (name: string = '', studentNumber: string = ''): string => {
  if (!studentNumber) return '';
  const firstName = name ? name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '') : '';
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
