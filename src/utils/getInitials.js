/**
 * Generates initials from a full name.
 * Example: "Test User" -> "TU", "John Doe" -> "JD", "Admin" -> "A"
 * @param {string} name - The full name of the user.
 * @returns {string} - The uppercase initials.
 */
export const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
