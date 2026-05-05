/**
 * Formats a phone number string to US style: (XXX) XXX-XXXX
 * @param {string} value - The raw input value
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (value) => {
  if (!value) return value;

  // Strip all non-digits
  const phoneNumber = value.replace(/[^\d]/g, "");
  const len = phoneNumber.length;

  // If it's 11 digits and starts with 1, format as +1 (XXX) XXX-XXXX
  if (len === 11 && phoneNumber.startsWith("1")) {
    return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7)}`;
  }

  // Fallback to standard US formatting if 10 digits
  if (len === 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  }

  // For other lengths, just return with a + if it looks like an international number
  return len > 10 ? `+${phoneNumber}` : phoneNumber;
};
