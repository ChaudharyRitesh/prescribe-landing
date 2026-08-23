export type ModuleReviewState = {
  doctorsSelected?: boolean;
  ownerPractitionerIntent?: boolean;
  ownerDoctorProfile?: { name?: string };
};

export type SoloDoctorDefaultState = Omit<ModuleReviewState, 'ownerDoctorProfile'> & {
  contactName?: string;
  contactPhone?: string;
  ownerDoctorProfile?: {
    name?: string;
    specialization?: string;
    registrationNumber?: string;
    phone?: string;
  };
};

export function practitionerStateIsValid(data: ModuleReviewState): boolean {
  return data.ownerPractitionerIntent === false ||
    (data.ownerPractitionerIntent === true && (data.ownerDoctorProfile?.name?.trim().length || 0) >= 2);
}

export function moduleReviewDestination(
  previous: ModuleReviewState,
  next: ModuleReviewState,
  deterministicSoloDoctor = false,
): 'practitioner' | 'review' {
  const doctorsNewlyAdded = previous.doctorsSelected !== true && next.doctorsSelected === true;
  return next.doctorsSelected && ((!deterministicSoloDoctor && doctorsNewlyAdded) || !practitionerStateIsValid(next))
    ? 'practitioner'
    : 'review';
}

export function soloDoctorPractitionerDefault(
  data: SoloDoctorDefaultState,
  specializationSuggestion?: string,
) {
  if (data.ownerPractitionerIntent !== undefined) return {};
  return soloDoctorIntentPatch(data, true, specializationSuggestion);
}

export function soloDoctorIntentPatch(
  data: SoloDoctorDefaultState,
  intent: boolean,
  specializationSuggestion?: string,
) {
  // OFF intentionally leaves ownerDoctorProfile untouched in OnboardingData so toggling back ON
  // restores local values. Payment/register already omits the profile whenever intent is false.
  if (!intent) return { ownerPractitionerIntent: false as const };
  const ownerDoctorProfile: NonNullable<SoloDoctorDefaultState['ownerDoctorProfile']> = {
    ...(data.ownerDoctorProfile || {}),
  };
  if (!ownerDoctorProfile.name && data.contactName) ownerDoctorProfile.name = data.contactName;
  if (!ownerDoctorProfile.specialization && specializationSuggestion) {
    ownerDoctorProfile.specialization = specializationSuggestion;
  }
  if (!ownerDoctorProfile.phone && data.contactPhone) ownerDoctorProfile.phone = data.contactPhone;
  return {
    ownerPractitionerIntent: true as const,
    ownerDoctorProfile,
  };
}

export function practitionerClearPatch(doctorsSelected: boolean) {
  return doctorsSelected
    ? {}
    : { ownerPractitionerIntent: undefined, ownerDoctorProfile: undefined };
}

export function organizationReviewDestination(
  screen: 'facility' | 'specialization' | 'details',
  specializationRequired: boolean,
): 'specialization' | 'details' | 'review' {
  if (screen === 'facility') return specializationRequired ? 'specialization' : 'details';
  if (screen === 'specialization') return 'details';
  return 'review';
}
