export const passwordRules = [
  {
    key: "length",
    label: "At least 8 characters",
    shortLabel: "8+ characters",
    test: (password) => password.length >= 8
  },
  {
    key: "uppercase",
    label: "1 uppercase letter",
    shortLabel: "Uppercase",
    test: (password) => /[A-Z]/.test(password)
  },
  {
    key: "lowercase",
    label: "1 lowercase letter",
    shortLabel: "Lowercase",
    test: (password) => /[a-z]/.test(password)
  },
  {
    key: "symbol",
    label: "1 symbol",
    shortLabel: "Symbol",
    test: (password) => /[^A-Za-z0-9]/.test(password)
  },
  {
    key: "number",
    label: "1 number",
    shortLabel: "Number",
    test: (password) => /\d/.test(password)
  }
];

export const isStrongPassword = (password = "") =>
  passwordRules.every((rule) => rule.test(password));

export const getMissingPasswordRequirements = (password = "") =>
  passwordRules
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.label);

export const getPasswordRequirementsMessage = (password = "") => {
  const missingRequirements = getMissingPasswordRequirements(password);

  if (!missingRequirements.length) return "";

  return `Password is missing: ${missingRequirements.join(", ")}.`;
};

export const shouldValidateOptionalPassword = (password = "") =>
  password.trim() !== "";
