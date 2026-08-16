// Onboarding v2 — UI flow constants (NOT commercial data).
// Org types + sub-types are super-admin managed (OrganizationTypeCatalog) and fetched live via
// useOrgTypesQuery — see lib/api/types/onboarding.types.ts for the OrgType/OrgSubType shape.

import { OrgType } from '@/lib/api/types/onboarding.types';

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

// Conditional — only org types with multiBranchEligible:true show the branch-setup screen.
export function isMultiBranchEligible(orgTypes: OrgType[] | undefined, slug?: string | null): boolean {
  return !!findOrgType(orgTypes, slug)?.multiBranchEligible;
}

export type ScreenId =
  | 'facility' | 'specialization' | 'email' | 'otp'
  | 'details' | 'branchSetup' | 'modules' | 'review' | 'payment' | 'provisioning';

export const SCREEN_ORDER: ScreenId[] = [
  'facility', 'specialization', 'email', 'otp', 'details', 'branchSetup', 'modules', 'review', 'payment', 'provisioning',
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
  details: 3, branchSetup: 3, modules: 4, review: 5, payment: 5, provisioning: 6,
};
