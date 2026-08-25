/**
 * Utility to convert Cloudinary URLs to transparent background versions on the fly.
 */
export const generateTransparentLogoUrl = (url) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("/upload/")) return url;

  const [baseUrl, rest] = url.split("/upload/");

  if (!rest) return url;

  const cleanPath = rest.replace(
    /^(?:f_png\/e_make_transparent(?::\d+)?\/e_trim\/|f_png,e_make_transparent(?::\d+)?,e_trim\/)/,
    ""
  );

  return `${baseUrl}/upload/f_png/e_make_transparent:30/e_trim/${cleanPath}`;
};

/**
 * Resolves the company logo URL for a user/client or populated owner entity.
 * Handles primary logo, transparent logo variant, and inherited tree logos.
 *
 * @param {Object} entity - User or owner document object from Redux / API.
 * @param {{ transparent?: boolean, fallback?: string }} [options]
 * @returns {string|null} - Resolves the dynamic company logo URL or fallback.
 */
export const getCompanyLogoUrl = (
  entity,
  { transparent = true, fallback = null } = {}
) => {
  if (!entity) return fallback;

  const regularUrl =
    entity.companyLogo?.url || entity.inheritedCompanyLogo || null;

  const storedTransparent =
    entity.companyLogoWithoutBackground?.url ||
    entity.inheritedCompanyLogoWithoutBackground ||
    null;

  // Derive transparent logo on the fly from regular or stored transparent URL
  const transparentUrl =
    (regularUrl ? generateTransparentLogoUrl(regularUrl) : null) ||
    (storedTransparent
      ? generateTransparentLogoUrl(storedTransparent)
      : null) ||
    storedTransparent;

  const logo = transparent
    ? transparentUrl || regularUrl
    : regularUrl || transparentUrl;

  return logo || fallback;
};

export default getCompanyLogoUrl;
