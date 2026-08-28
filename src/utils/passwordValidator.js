export const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, and 1 symbol.";

export const isStrongPassword = (password = "") =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);

export const shouldValidateOptionalPassword = (password = "") =>
  password.trim() !== "";
