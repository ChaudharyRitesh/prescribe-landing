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
  | 'failed';

export type FacilityType = 'hospital' | 'clinic' | 'eye' | 'dental' | 'diagnostic';

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

export interface ModuleItem {
  _id: string;
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  pricing: ModulePricing;
  specialties?: string[];
  isHero?: boolean;
  isShared?: boolean;
  isActive: boolean;
  order: number;
}

export interface PackageItem {
  _id: string;
  slug: string;
  label: string;
  tagline?: string;
  modules: string[]; // slugs
  pricing: ModulePricing;
  specialties?: string[];
  savings?: string;
  badge?: string;
  isActive: boolean;
  order: number;
}

export interface CatalogResponse extends BaseResponse {
  modules: ModuleItem[];
  packages: PackageItem[];
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
