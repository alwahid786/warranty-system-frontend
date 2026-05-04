/**
 * Formats a phone number string to US style: (XXX) XXX-XXXX
 * @param {string} value - The raw input value
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (value) => {
  if (!value) return value;

  // Strip all non-digits
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  // Handle formatting based on length
  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
