// Onboarding v2 — UI context constants (NOT commercial data).
// Org types + specializations are interaction/context per the mock; real
// modules/packages/prices/recommendations come from the live catalog.

export type OrgTypeId =
  | 'doctor' | 'clinic' | 'hospital' | 'dental' | 'diagnostic' | 'pharmacy' | 'other';

export interface OrgType {
  id: OrgTypeId;
  name: string;
  desc: string;
}

export const ORG_TYPES: OrgType[] = [
  { id: 'doctor', name: 'Doctor / Professional Practice', desc: 'Independent doctor or healthcare professional' },
  { id: 'clinic', name: 'Clinic / Practice', desc: 'Outpatient healthcare practice' },
  { id: 'hospital', name: 'Hospital', desc: 'Multi-specialty healthcare organization' },
  { id: 'dental', name: 'Dental Practice', desc: 'Dental care and orthodontics' },
  { id: 'diagnostic', name: 'Diagnostic / Pathology Lab', desc: 'Pathology, radiology, or imaging services' },
  { id: 'pharmacy', name: 'Pharmacy', desc: 'Pharmacy and medication operations' },
  { id: 'other', name: 'Other Healthcare Organization', desc: 'Anything else in healthcare delivery' },
];

// Conditional — only these org types show a specialization screen.
export const SPECIALIZATIONS: Record<string, string[]> = {
  doctor: ['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Other'],
  clinic: ['General Medicine', 'Pediatrics', 'Dermatology', 'Multi-specialty', 'Other'],
  hospital: ['Multi-specialty', 'General Medicine', 'Other'],
  dental: ['General Dentistry', 'Orthodontics', 'Oral Surgery', 'Other'],
  diagnostic: ['Pathology', 'Radiology', 'Pathology & Radiology'],
};

export function hasSpecialization(orgType?: string | null): boolean {
  return !!orgType && Array.isArray(SPECIALIZATIONS[orgType]);
}

export function orgTypeName(id?: string | null): string {
  return ORG_TYPES.find((o) => o.id === id)?.name || 'Your organization';
}

export type ScreenId =
  | 'facility' | 'specialization' | 'email' | 'otp'
  | 'details' | 'modules' | 'review' | 'payment' | 'provisioning';

export const SCREEN_ORDER: ScreenId[] = [
  'facility', 'specialization', 'email', 'otp', 'details', 'modules', 'review', 'payment', 'provisioning',
];

export const RAIL_STEPS: { rail: number; label: string }[] = [
  { rail: 1, label: 'Setup' },
  { rail: 2, label: 'Verify' },
  { rail: 3, label: 'Organization' },
  { rail: 4, label: 'Configure' },
  { rail: 5, label: 'Review' },
  { rail: 6, label: 'Complete' },
];

export const SCREEN_RAIL: Record<ScreenId, number> = {
  facility: 1, specialization: 1, email: 2, otp: 2,
  details: 3, modules: 4, review: 5, payment: 5, provisioning: 6,
};
