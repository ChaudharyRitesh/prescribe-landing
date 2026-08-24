// --- Core Enums ---
export type SelectionType = 'package' | 'individual';
export type BillingCycle = 'monthly' | 'yearly';
export type OnboardingStatus =
  | 'email_pending_otp'
  | 'otp_verified'
  | 'form_submitted'
  | 'pending_payment'
  | 'provisioning'
  | 'provisioned'
  | 'practitioner_setup_required'
  | 'quote_pending'
  | 'failed';

/** P5-DOC.ONB-A1 — minimal owner-Doctor professional details captured when the owner explicitly
 *  intends to practice. Consumed server-side as the P5-C.2 LinkedDoctorInput. */
export interface OwnerDoctorProfile {
  name?: string;
  specialization?: string;
  registrationNumber?: string;
  phone?: string;
}


// Free-form org-type slug from the live OrganizationTypeCatalog (super-admin managed) — no
// longer a fixed union, see OrgType/useOrgTypesQuery.
export type FacilityType = string;

// --- Base Response Interface ---
export interface BaseResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// --- Catalog Models ---
export interface ModulePricing {
  monthly: number;
  yearly: number;
}

/** GATE-2 catalog seat/storage limits (all optional). */
export interface CatalogLimits {
  maxDoctors?: number;
  maxReceptionists?: number;
  maxLabTechs?: number;
  maxPharmacists?: number;
  maxAdmins?: number;
  maxStorageGB?: number;
}

export interface ModuleItem {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  pricing: ModulePricing;
  specialties?: string[];
  features?: string[];
  isHero?: boolean;
  isShared?: boolean;
  isActive: boolean;
  order: number;
  isCustom?: boolean;
  // GATE-2 commercial config (live from Super-Admin catalog)
  category?: string;
  recommendedFor?: string[];
  entitlementKey?: string;
  kind?: 'product' | 'addon' | 'hospital_module';
  requires?: string[];
  defaultLimits?: CatalogLimits;
}

export interface PackageItem {
  _id: string;
  slug: string;
  label: string;
  tagline?: string;
  modules: string[]; // slugs
  pricing: ModulePricing;
  specialties?: string[];
  features?: string[];
  savings?: string;
  badge?: string;
  isActive: boolean;
  order: number;
  isCustom?: boolean;
}

export interface CatalogResponse extends BaseResponse {
  modules: ModuleItem[];
  packages: PackageItem[];
}

// --- Price Preview (server-authoritative, non-mutating) ---
export interface PricePreviewPayload {
  organizationType?: string;
  selectionType: SelectionType;
  packageId?: string;
  selectedModules?: string[];
  billingCycle?: BillingCycle;
}

export interface PricePreviewLineItem {
  slug: string;
  label: string;
  unitPrice: number;
}

export interface PricePreviewData {
  isCustom: boolean;
  packageLabel?: string;
  billingCycle?: BillingCycle;
  currency?: string;
  catalogVersion?: number;
  lineItems?: PricePreviewLineItem[];
  subtotal?: number;
  gstRate?: number;
  gst?: number;
  total?: number;
}

export interface PricePreviewResponse extends BaseResponse {
  data: PricePreviewData;
}

/** Already-computed pricing stored on a session at register() time (rupees). */
export interface PricingSnapshot {
  subtotal: number;
  gstRate: number;
  gst: number;
  total: number;
  currency: string;
}

// --- Organization Type Catalog ---
export interface OrgSubType {
  id: string;
  label: string;
}

export interface OrgType {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  subTypes?: OrgSubType[];
  multiBranchEligible: boolean;
  isActive: boolean;
  order: number;
}

export interface OrgTypesResponse extends BaseResponse {
  data: OrgType[];
}

// --- Endpoint Payloads & Responses ---

// 1. POST /initiate
export interface InitiatePayload {
  email: string;
}

export interface InitiateResponse extends BaseResponse {
  onboarded: boolean;
  canResume?: boolean;
  otpPending?: boolean;
  sessionId?: string;
  verifiedToken?: string;
  dashboardUrl?: string;
}

// 2. POST /verify-otp
export interface VerifyOtpPayload {
  sessionId: string;
  otp: string;
}

export interface VerifyOtpResponse extends BaseResponse {
  verified?: boolean;
  verifiedToken?: string;
}

// 3. POST /verify-magic-link
export interface VerifyMagicLinkPayload {
  magicToken: string;
}

export interface VerifyMagicLinkResponse extends VerifyOtpResponse {}

// 4. POST /resend-otp
export interface ResendOtpPayload {
  sessionId: string;
}

export interface ResendOtpResponse extends BaseResponse {
  magicLinkSent?: boolean;
  resendsRemaining?: number;
}

// 5. GET /check-subdomain
export interface CheckSubdomainResponse extends BaseResponse {
  available?: boolean;
  subdomain?: string;
}

// 6. POST /reserve-subdomain
export interface ReserveSubdomainPayload {
  subdomain: string;
}

export interface ReserveSubdomainResponse extends BaseResponse {
  available?: boolean;
  subdomain?: string;
  reservedUntil?: string; // ISO date string
}

// 7. POST /register
export interface Address {
  building?: string;
  street?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  pincode?: string;
}

/** HIPAA/DPDP consent capture sent with registration for audit. */
export interface ConsentMeta {
  termsAccepted: boolean;
  /** ISO timestamp captured client-side at the moment the box was ticked */
  termsAcceptedAt?: string;
  /** Version identifier of the Terms shown to the user */
  termsVersion: string;
  /** Browser user-agent at consent time */
  userAgent?: string;
}

export interface RegisterPayload {
  orgName: string;
  subdomain: string;
  logoUrl?: string;
  contactName: string;
  contactPhone?: string;
  address?: Address;
  licenseNumber?: string;
  gstNumber?: string;
  registrationNumber?: string;
  taxId?: string;
  selectionType: SelectionType;
  packageId?: string;
  selectedModules?: string[]; // array of _ids or slugs depending on selectionType
  billingCycle?: BillingCycle;
  subscriptionPlan?: string;
  referralCode?: string;
  facilityType?: FacilityType;
  /** Org context sent to the backend (mirrors facilityType). */
  organizationType?: string;
  /** Canonical subType.id for the chosen org type (e.g. 'general-medicine'), never the display
   *  label. Optional; validated server-side against the live catalog. Absent when no subtype chosen. */
  organizationSubType?: string;
  /** Explicit opt-in, only meaningful when the selected org type's catalog entry has
   *  multiBranchEligible:true. Validated server-side against the live catalog at registration. */
  multiBranchEnabled?: boolean;
  /** Consent audit metadata (HIPAA/DPDP) */
  termsAccepted?: boolean;
  consent?: ConsentMeta;
  /** P5-DOC.ONB-A1 — explicit owner intent to personally practice as a Doctor. Only sent when the
   *  doctors module is in the selection; honored server-side only when doctors is entitled. */
  ownerPractitionerIntent?: boolean;
  /** Minimal owner-Doctor details, sent only when ownerPractitionerIntent is true. */
  ownerDoctorProfile?: OwnerDoctorProfile;
}

export interface RegisterResponse extends BaseResponse {
  status: 'pending_payment' | 'provisioning';
  sessionId: string;
  // If payment needed
  orderId?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  // If provisioning started
  pollUrl?: string;
}

export interface OnboardingSessionResponse extends BaseResponse {
  code?: 'REVERIFICATION_REQUIRED';
  data?: Record<string, unknown> & {
    sessionId: string;
    status: OnboardingStatus;
    verifiedToken?: string;
  };
}

export interface ResumeProvisioningResponse extends BaseResponse {
  status: 'provisioning' | 'provisioned';
  sessionId: string;
  dashboardUrl?: string;
}

// 8. GET /status/:sessionId
export interface StatusResponse extends BaseResponse {
  status: OnboardingStatus;
  orgName?: string;
  dashboardUrl?: string;
  adminEmail?: string;
  tempPassword?: string;
  failureReason?: string;
}

// 9. GET /onboarding/specialties/departments
export interface MasterDept {
  _id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  specialties: string[];
  isActive: boolean;
  defaultTemplate: any[];
}

export interface SpecializedDeptResponse extends BaseResponse {
  data: MasterDept[];
  specialty: string;
}

// 10. GET /onboarding/verify-mr
export interface VerifyMRResponse extends BaseResponse {
  exists: boolean;
  name?: string;
  code?: string;
}

export interface VerifyGstResponse extends BaseResponse {
  exists: boolean;
  legalName?: string;
  taxId?: string;
}
