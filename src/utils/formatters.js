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

/**
 * Captilizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
export const captilizeFirstLetter = (str) => {
  if (!str) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Character length limits for form fields across the app.
 */
export const FIELD_LIMITS = {
  name: 20,
  clientName: 20,
  email: 30,
  clientEmail: 30,
  companyName: 30,
  storeName: 30,
  dealerId: 20,
  accountOwner: 20,
  businessOwner: 20,
  designation: 20,
  statementNumber: 20,
  reason: 100,
  explanation: 100,
  addressStore: 60,
  addressStreet: 100,
  addressArea: 60,
  addressCity: 20,
  addressState: 20,
  addressCountry: 20,
  addressZip: 10
};

/**
 * Validates object values against maximum character limits.
 * @param {Object} data - The form data object
 * @returns {string|null} - Error message if invalid, or null if valid
 */
export const validateTextLimits = (data) => {
  if (!data || typeof data !== "object") return null;

  const checks = [
    {
      value: data.name || data.clientName,
      label: "Name",
      max: FIELD_LIMITS.name
    },
    {
      value: data.email || data.clientEmail,
      label: "Email",
      max: FIELD_LIMITS.email
    },
    {
      value: data.companyName,
      label: "Company Name",
      max: FIELD_LIMITS.companyName
    },
    { value: data.storeName, label: "Store Name", max: FIELD_LIMITS.storeName },
    { value: data.dealerId, label: "Dealer ID", max: FIELD_LIMITS.dealerId },
    {
      value: data.accountOwner,
      label: "Account Owner",
      max: FIELD_LIMITS.accountOwner
    },
    {
      value: data.businessOwner,
      label: "Business Owner",
      max: FIELD_LIMITS.businessOwner
    },
    {
      value: data.designation,
      label: "Designation",
      max: FIELD_LIMITS.designation
    },
    {
      value: data.statementNumber,
      label: "Statement Number",
      max: FIELD_LIMITS.statementNumber
    }
  ];

  for (const check of checks) {
    if (check.value && String(check.value).trim().length > check.max) {
      return `${check.label} cannot exceed ${check.max} characters`;
    }
  }

  // Address sub-fields check
  if (data.address && typeof data.address === "object") {
    const addressChecks = [
      {
        value: data.address.store,
        label: "Store Name in address",
        max: FIELD_LIMITS.addressStore
      },
      {
        value: data.address.street,
        label: "Street Address",
        max: FIELD_LIMITS.addressStreet
      },
      {
        value: data.address.area,
        label: "Area",
        max: FIELD_LIMITS.addressArea
      },
      {
        value: data.address.city,
        label: "City",
        max: FIELD_LIMITS.addressCity
      },
      {
        value: data.address.state,
        label: "State",
        max: FIELD_LIMITS.addressState
      },
      {
        value: data.address.country,
        label: "Country",
        max: FIELD_LIMITS.addressCountry
      },
      {
        value: data.address.zip,
        label: "Zip Code",
        max: FIELD_LIMITS.addressZip
      }
    ];

    for (const check of addressChecks) {
      if (check.value && String(check.value).trim().length > check.max) {
        return `${check.label} cannot exceed ${check.max} characters`;
      }
    }
  }

  // Check emails array if present
  if (Array.isArray(data.emails)) {
    for (const email of data.emails) {
      if (email && String(email).trim().length > FIELD_LIMITS.email) {
        return `Notification email cannot exceed ${FIELD_LIMITS.email} characters`;
      }
    }
  }

  return null;
};
