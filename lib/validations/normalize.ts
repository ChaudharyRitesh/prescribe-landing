// Onboarding input normalization + validation. Three distinct values per field:
//   DISPLAY (what the user sees) ≠ NORMALIZED (canonical, what we store/send) ≠ raw keystrokes.
// India-canonical where the product is India-specific (phone, PIN, GST). The backend remains the
// final authority — these only improve UX and prevent obviously-invalid payloads.
// Phone: FE validates/sends the 10 national digits; the backend (@kaero/platform normalizePhone)
// canonicalizes to E.164 +91XXXXXXXXXX. We never prepend +91 here (avoids a double country code).

/** Collapse internal whitespace runs to a single space and trim the edges. */
export const collapseSpaces = (v: string): string => v.replace(/\s+/g, " ").trim();

/** Strip control characters (keeps normal Unicode letters/punctuation). */
const stripControl = (v: string): string => v.replace(/\p{Cc}/gu, "");

/** Email → trimmed + lowercased canonical. */
export const normalizeEmail = (v: string): string => v.trim().toLowerCase();
export const isValidEmail = (v: string): boolean => {
  const e = normalizeEmail(v);
  return e.length <= 254 && !/\s/.test(e) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
};

/** Keep digits only. */
export const digitsOnly = (v: string): string => v.replace(/\D+/g, "");

/** Indian mobile → 10 national digits. Drops a leading +91/91 or a single leading 0, caps at 10. */
export const normalizeIndianMobile = (v: string): string => {
  let d = digitsOnly(v);
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
};
export const isValidIndianMobile = (v: string): boolean => /^[6-9]\d{9}$/.test(normalizeIndianMobile(v));
/** Visual grouping for a non-editing display: "98765 43210" (never the stored value). */
export const formatIndianMobile = (v: string): string => {
  const d = normalizeIndianMobile(v);
  return d.length > 5 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
};

/** GSTIN → uppercase + trimmed. */
export const GSTIN_RX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const normalizeGSTIN = (v: string): string => v.toUpperCase().replace(/\s+/g, "").slice(0, 15);
export const isValidGSTIN = (v: string): boolean => GSTIN_RX.test(normalizeGSTIN(v));

// Subdomain: lowercase slug. Typing keeps a trailing hyphen (so "my-" → "my-clinic" is possible);
// leading/trailing-hyphen and length are enforced by isValidSubdomain at blur/submit.
export const normalizeSubdomain = (v: string): string =>
  v.toLowerCase().trim().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-").slice(0, 30);
export const RESERVED_SUBDOMAINS = new Set([
  "www", "admin", "api", "app", "mail", "ftp", "test", "staging", "dev",
  "dashboard", "portal", "support", "kaero", "kaeroprescribe",
]);
export const isValidSubdomain = (v: string): boolean =>
  /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(v) && !RESERVED_SUBDOMAINS.has(v);

/** Indian PIN → up to 6 digits. */
export const normalizePostalCode = (v: string): string => digitsOnly(v).slice(0, 6);
export const isValidIndianPin = (v: string): boolean => /^[1-9]\d{5}$/.test(normalizePostalCode(v));

/** Person/org name → control-stripped, whitespace-collapsed. Keeps Unicode letters + punctuation
 *  (hyphens, apostrophes, periods, &). Never re-cases the user's actual name. */
export const normalizeName = (v: string): string => collapseSpaces(stripControl(v));
export const isValidPersonName = (v: string): boolean => {
  const n = normalizeName(v);
  return n.length >= 2 && n.length <= 80;
};
export const isValidOrgName = (v: string): boolean => {
  const n = normalizeName(v);
  return n.length >= 2 && n.length <= 120;
};

/** Referral code → trimmed, inner spaces removed, capped. Case preserved (codes may be sensitive). */
export const normalizeReferral = (v: string): string => v.replace(/\s+/g, "").slice(0, 24);

/** Generic address line → control-stripped, whitespace-collapsed, capped. Keeps / , . - # etc. */
export const normalizeAddressLine = (v: string): string => collapseSpaces(stripControl(v)).slice(0, 120);
