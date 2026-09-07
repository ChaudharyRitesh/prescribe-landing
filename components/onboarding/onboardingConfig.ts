// Onboarding v2 — UI flow constants (NOT commercial data).
// Org types + sub-types are super-admin managed (OrganizationTypeCatalog) and fetched live via
// useOrgTypesQuery — see lib/api/types/onboarding.types.ts for the OrgType/OrgSubType shape.

import { OrgType } from '@/lib/api/types/onboarding.types';
import {
  CanonicalModuleSelectionState,
  CatalogPackageState,
  effectiveDoctorsSelected,
} from './reviewEditNavigation';

export function findOrgType(orgTypes: OrgType[] | undefined, slug?: string | null): OrgType | undefined {
  return orgTypes?.find((o) => o.slug === slug);
}

// Conditional — only org types with subTypes show a specialization screen.
export function hasSpecialization(orgTypes: OrgType[] | undefined, slug?: string | null): boolean {
  const orgType = findOrgType(orgTypes, slug);
  return !!orgType?.subTypes && orgType.subTypes.length > 0;
}

export function orgTypeName(orgTypes: OrgType[] | undefined, slug?: string | null): string {
  return findOrgType(orgTypes, slug)?.label || 'Your organization';
}

// data.specialization stores the canonical subType.id (e.g. 'general-medicine'), never the display
// label — that id is what the backend contract validates and persists as Client.organizationSubType.
// This resolves the human label for display; falls back to the raw stored value if the catalog
// hasn't loaded (so display never blanks).
export function orgSubTypeLabel(
  orgTypes: OrgType[] | undefined,
  slug: string | null | undefined,
  subTypeId: string | null | undefined,
): string | undefined {
  if (!subTypeId) return undefined;
  return findOrgType(orgTypes, slug)?.subTypes?.find((s) => s.id === subTypeId)?.label ?? subTypeId;
}

// Restore-time compatibility: a pre-canonical session may have stored the display label instead of
// the subType.id. Map it back to the canonical id using the live catalog for the selected org type.
// Returns the id when the value is already canonical or an exact unique label match; undefined when
// there's no unique valid match (caller clears it so the user reselects).
export function normalizeSubType(
  orgTypes: OrgType[] | undefined,
  slug: string | null | undefined,
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  const subTypes = findOrgType(orgTypes, slug)?.subTypes;
  if (!subTypes || subTypes.length === 0) return undefined;
  if (subTypes.some((s) => s.id === value)) return value; // already canonical id
  const byLabel = subTypes.filter((s) => s.label === value);
  return byLabel.length === 1 ? byLabel[0].id : undefined; // exact unique label match, else clear
}

// Conditional — only org types with multiBranchEligible:true show the branch-setup screen.
export function isMultiBranchEligible(orgTypes: OrgType[] | undefined, slug?: string | null): boolean {
  return !!findOrgType(orgTypes, slug)?.multiBranchEligible;
}

// Canonical deterministic owner-practitioner case. Keep this exact: clinic/hospital ownership is
// ambiguous even when Doctors is selected, so those organization types must still ask explicitly.
export function isDoctorProfessionalPractice(orgTypes: OrgType[] | undefined, slug?: string | null): boolean {
  const orgType = findOrgType(orgTypes, slug);
  const isCanonicalDoctor = slug === 'doctor' || orgType?.label.trim().toLowerCase() === 'doctor / professional practice';
  return isCanonicalDoctor && orgType?.multiBranchEligible !== true;
}

export type SoloDoctorOnboardingContext = CanonicalModuleSelectionState & {
  facilityType?: string | null;
};

// LOCKED ROUTING RULE — the single canonical eligibility predicate for the solo-practitioner
// ("Will you personally practice as a Doctor?") step. TRUE only on the explicit standalone Doctor
// onboarding path: the organization type IS Doctor / Professional Practice AND the Doctors module
// is actually part of the committed purchase. Doctors bought as one module inside a hospital,
// clinic/polyclinic, pharmacy, pathology-lab or any multi-module organization purchase is NOT
// eligible — those owners link a Doctor profile after provisioning, never mid-onboarding.
// Returns undefined while the org-type catalog or a selected package's module list is still
// unresolved, so no caller routes — or redirects — on unknown state.
export function isSoloDoctorOnboarding(
  orgTypes: OrgType[] | undefined,
  context: SoloDoctorOnboardingContext,
  packages?: CatalogPackageState[],
): boolean | undefined {
  if (!orgTypes || orgTypes.length === 0) return undefined;
  const doctorsEntitled = effectiveDoctorsSelected(context, packages);
  if (doctorsEntitled === undefined) return undefined;
  return doctorsEntitled && isDoctorProfessionalPractice(orgTypes, context.facilityType);
}

export type ScreenId =
  | 'facility' | 'specialization' | 'email' | 'otp'
  | 'details' | 'branchSetup' | 'modules' | 'practitioner' | 'review' | 'payment' | 'provisioning';

export const SCREEN_ORDER: ScreenId[] = [
  'facility', 'specialization', 'email', 'otp', 'details', 'branchSetup', 'modules', 'practitioner', 'review', 'payment', 'provisioning',
];

// Route protection for the solo-practitioner screen. A session that lands there any other way than
// the standalone Doctor path (restored state, a selection changed after the fact, a hand-forced
// screen) is sent to its real next step — Review — instead of rendering the page. Only a PROVEN
// non-eligible session (false, never undefined) is redirected, so a solo Doctor is never bounced
// while the catalog is still loading.
export function guardedScreen(screen: ScreenId, soloDoctorOnboarding: boolean | undefined): ScreenId {
  return screen === 'practitioner' && soloDoctorOnboarding === false ? 'review' : screen;
}

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
  details: 3, branchSetup: 3, modules: 4, practitioner: 4, review: 5, payment: 5, provisioning: 6,
};
