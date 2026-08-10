import toast from "react-hot-toast";

export const ALLOWED_IMAGE_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/jpg"
];

export const ALLOWED_IMAGE_EXTENSIONS = [".svg", ".png", ".jpg", ".jpeg"];

export const IMAGE_ACCEPT_TYPES =
  ".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg";

/**
 * Validates an image file for supported formats (SVG, JPG, PNG) and file size (default 10MB).
 *
 * @param {File} file - The file object to validate.
 * @param {number} [maxSizeMB=10] - Maximum allowed file size in megabytes.
 * @param {boolean} [showToast=true] - Whether to show a toast alert on validation error.
 * @returns {{ isValid: boolean, error: string | null, previewUrl: string | null }}
 */
export const validateImage = (file, maxSizeMB = 10, showToast = true) => {
  if (!file) {
    return { isValid: false, error: "No file provided", previewUrl: null };
  }

  const extension = file.name
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";

  const isValidType =
    ALLOWED_IMAGE_TYPES.includes(file.type) ||
    ALLOWED_IMAGE_EXTENSIONS.includes(extension);

  if (!isValidType) {
    const errorMsg = "Unsupported file format. Please upload SVG, JPG, or PNG.";

    if (showToast) toast.error(errorMsg);

    return { isValid: false, error: errorMsg, previewUrl: null };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    const errorMsg = `File size exceeds ${maxSizeMB}MB limit.`;

    if (showToast) toast.error(errorMsg);

    return { isValid: false, error: errorMsg, previewUrl: null };
  }

  return {
    isValid: true,
    error: null,
    previewUrl: URL.createObjectURL(file)
  };
};

export default validateImage;
