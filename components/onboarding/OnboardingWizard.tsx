"use client";

import { Fragment, useEffect, useState } from "react";
import { useCatalogQuery, useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import {
  RAIL_STEPS,
  SCREEN_ORDER,
  SCREEN_RAIL,
  ScreenId,
  guardedScreen,
  hasSpecialization,
  isMultiBranchEligible,
  isSoloDoctorOnboarding,
  normalizeSubType,
  orgSubTypeLabel,
} from "./onboardingConfig";
import { FacilityTypeSelection } from "./steps/FacilityTypeSelection";
import { SpecializationSelection } from "./steps/SpecializationSelection";
import { EmailInitiation } from "./steps/EmailInitiation";
import { OtpVerification } from "./steps/OtpVerification";
import { OrganizationDetails } from "./steps/OrganizationDetails";
import { BranchSetupSelection } from "./steps/BranchSetupSelection";
import { ModuleCatalogSelection } from "./steps/ModuleCatalogSelection";
import { ReviewStep } from "./steps/ReviewStep";
import { PaymentStep } from "./steps/PaymentStep";
import { ProvisioningStatus } from "./steps/ProvisioningStatus";
import { OwnerDoctorProfile, PricingSnapshot } from "@/lib/api/types/onboarding.types";
import { PractitionerIntent } from "./steps/PractitionerIntent";
import { CustomPlanRequirements } from "./steps/CustomPlanRequirements";
import { isCustomPlanSelection, type CustomPlanRequest } from "./customPlanRequest";
import { ReviewDetailsEdit } from "./steps/ReviewDetailsEdit";
import {
  effectiveDoctorsSelected,
  moduleReviewDestination,
  normalizeDoctorsSelected,
  organizationReviewDestination,
  practitionerClearPatch,
  soloDoctorPractitionerDefault,
} from "./reviewEditNavigation";

export type ReviewEditTarget = 'organization' | 'administrator' | 'modules' | 'practitioner';

export type OnboardingData = {
  sessionId?: string;
  verifiedToken?: string;
  email?: string;
  subdomain?: string;
  orgName?: string;
  contactName?: string;
  contactPhone?: string;
  referralCode?: string;
  gstNumber?: string;
  facilityType?: string;
  /** Canonical subType.id (e.g. 'general-medicine'), never the display label — see orgSubTypeLabel. */
  specialization?: string;
  /** Whether the doctors module is in the committed selection — drives the practitioner step gate
   *  (P5-DOC.ONB-A1). Set by ModuleCatalogSelection; clears owner-practitioner state when false. */
  doctorsSelected?: boolean;
  /** Explicit owner intent to personally practice as a Doctor. Tri-state: undefined = not yet
   *  chosen (Continue disabled), true/false = explicit choice. */
  ownerPractitionerIntent?: boolean;
  ownerDoctorProfile?: OwnerDoctorProfile;
  multiBranchEnabled?: boolean;
  /** CUSTOM PLAN requirement intake — what the customer ASKED FOR. Never an entitlement; the Super
   *  Admin composes the actual contract from it. See components/onboarding/customPlanRequest.ts. */
  customPlanRequest?: CustomPlanRequest;
  selectionType?: 'package' | 'individual';
  packageId?: string;
  selectedModules?: string[];
  billingCycle?: 'monthly' | 'yearly';
  subscriptionPlan?: string;
  status?: string;
  quotedPrice?: number;
  /** Already-computed server pricing, present only when resuming a session that has
   *  already called register() once (pending_payment reload, or an approved custom quote). */
  pricingSnapshot?: PricingSnapshot;
  /** The saved session exists, but its session-bound capability must be renewed through OTP. */
  reverificationRequired?: boolean;
  /** A paid unfinished session must use resume-provisioning rather than a new checkout. */
  paidResumeRequired?: boolean;
  /** Safe terminal recovery states; never contains raw server or database details. */
  recoveryIssue?: 'not_resumable' | 'session_not_found';
  termsAccepted?: boolean;
  termsAcceptedAt?: string;
  customLimits?: {
    maxDoctors?: number;
    maxReceptionists?: number;
    maxLabTechs?: number;
    maxPharmacists?: number;
    maxAdmins?: number;
    maxStorageGB?: number;
  };
  address?: {
    building?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
  };
};

interface OnboardingWizardProps {
  externalData?: OnboardingData;
  externalUpdateData?: (newData: Partial<OnboardingData>) => void;
  onSessionReverified?: (verifiedToken: string) => Promise<boolean>;
}

export function OnboardingWizard({ externalData, externalUpdateData, onSessionReverified }: OnboardingWizardProps) {
  const [localData, setLocalData] = useState<OnboardingData>({});
  const data = externalData || localData;
  const updateData =
    externalUpdateData || ((newData: Partial<OnboardingData>) => setLocalData((p) => ({ ...p, ...newData })));

  const [screen, setScreen] = useState<ScreenId>('facility');
  const [reviewEditTarget, setReviewEditTarget] = useState<ReviewEditTarget>();
  const [reviewSnapshot, setReviewSnapshot] = useState<OnboardingData>();
  const { data: orgTypesRes } = useOrgTypesQuery();
  const { data: catalog } = useCatalogQuery();
  const orgTypes = orgTypesRes?.data;
  const packages = catalog?.packages;
  const doctorEntitled = effectiveDoctorsSelected(data, packages);
  // The one gate for the solo-practitioner screen — never doctorEntitled on its own.
  const soloDoctorOnboarding = isSoloDoctorOnboarding(orgTypes, data, packages);
  // Custom plans are quoted, not priced — the requirement step exists only on that path.
  const customPlanOnboarding = isCustomPlanSelection(packages, data);
  const activeScreen = guardedScreen(screen, soloDoctorOnboarding);

  // Resume a mid-flight session to the correct screen.
  useEffect(() => {
    if (!data.sessionId) return;
    if (data.reverificationRequired) {
      setScreen('otp');
    } else if (data.recoveryIssue) {
      setScreen('provisioning');
    } else if (
      data.status === 'provisioned' ||
      data.status === 'provisioning' ||
      data.status === 'practitioner_setup_required' ||
      data.status === 'quote_pending' ||
      data.status === 'failed'
    ) {
      setScreen('provisioning');
    } else if (data.status === 'email_pending_otp') {
      setScreen('otp');
    } else if (data.status === 'otp_verified') {
      setScreen('details');
    } else if (data.status === 'form_submitted') {
      setScreen('review');
    } else if (data.status === 'pending_payment') {
      setScreen('review');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.sessionId, data.status]);

  // Normalize a legacy display-label specialization (from a restored pre-canonical session) to the
  // current canonical subType.id once the live catalog is available. No-op for canonical ids; clears
  // the subtype when there's no unique valid match so the user reselects.
  useEffect(() => {
    if (!orgTypes || orgTypes.length === 0 || !data.specialization) return;
    const normalized = normalizeSubType(orgTypes, data.facilityType, data.specialization);
    if (normalized !== data.specialization) updateData({ specialization: normalized });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgTypes, data.facilityType, data.specialization]);

  // Keep the compatibility boolean synchronized from the canonical commercial selection.
  // Package state waits for the matching catalog entry instead of guessing from stale state.
  useEffect(() => {
    if (
      data.selectionType === undefined ||
      doctorEntitled === undefined ||
      data.doctorsSelected === doctorEntitled
    ) return;
    updateData({
      doctorsSelected: doctorEntitled,
      ...practitionerClearPatch(doctorEntitled),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.selectionType, data.doctorsSelected, doctorEntitled]);

  // Deterministic solo-practice default. Explicit true/false always wins; restored sessions with
  // no decision receive the same default as new sessions and persist it through existing storage.
  useEffect(() => {
    if (soloDoctorOnboarding !== true || data.ownerPractitionerIntent !== undefined) return;
    updateData(soloDoctorPractitionerDefault(
      data,
      orgSubTypeLabel(orgTypes, data.facilityType, data.specialization),
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgTypes, data.facilityType, data.specialization, soloDoctorOnboarding, data.ownerPractitionerIntent]);

  // Route protection: keep wizard state in sync with the guard so Back/Continue from a redirected
  // screen behave as if the ineligible screen was never entered.
  useEffect(() => {
    if (activeScreen === screen) return;
    setReviewEditTarget(undefined);
    setReviewSnapshot(undefined);
    setScreen(activeScreen);
  }, [activeScreen, screen]);

  const goTo = (s: ScreenId) => {
    setScreen(s);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const startReviewEdit = (target: ReviewEditTarget, destination: ScreenId) => {
    setReviewSnapshot(normalizeDoctorsSelected(data, packages));
    setReviewEditTarget(target);
    goTo(destination);
  };

  const finishReviewEdit = () => {
    setReviewEditTarget(undefined);
    setReviewSnapshot(undefined);
    goTo('review');
  };

  const cancelReviewEdit = () => {
    if (reviewSnapshot) {
      const restoredSelection = normalizeDoctorsSelected(reviewSnapshot, packages);
      updateData({
        facilityType: restoredSelection.facilityType,
        specialization: restoredSelection.specialization,
        orgName: restoredSelection.orgName,
        contactName: restoredSelection.contactName,
        selectionType: restoredSelection.selectionType,
        selectedModules: restoredSelection.selectedModules,
        packageId: restoredSelection.packageId,
        subscriptionPlan: restoredSelection.subscriptionPlan,
        billingCycle: restoredSelection.billingCycle,
        doctorsSelected: restoredSelection.doctorsSelected,
        ownerPractitionerIntent: restoredSelection.ownerPractitionerIntent,
        ownerDoctorProfile: restoredSelection.ownerDoctorProfile,
        multiBranchEnabled: restoredSelection.multiBranchEnabled,
        contactPhone: restoredSelection.contactPhone,
        address: restoredSelection.address,
      });
    }
    finishReviewEdit();
  };

  const step = (dir: 1 | -1) => {
    let idx = SCREEN_ORDER.indexOf(screen);
    while (idx + dir >= 0 && idx + dir < SCREEN_ORDER.length) {
      idx += dir;
      const candidate = SCREEN_ORDER[idx];
      if (candidate === 'specialization' && !hasSpecialization(orgTypes, data.facilityType)) continue;
      if (candidate === 'branchSetup' && !isMultiBranchEligible(orgTypes, data.facilityType)) continue;
      if (candidate === 'customPlan' && !customPlanOnboarding) continue;
      if (candidate === 'practitioner' && soloDoctorOnboarding !== true) continue;
      goTo(candidate);
      return;
    }
  };

  const onNext = (committedData?: Partial<OnboardingData>) => {
    if (!reviewEditTarget) {
      if (screen === 'modules' && committedData) {
        const nextData = { ...data, ...committedData };
        goTo(moduleReviewDestination(
          nextData,
          isSoloDoctorOnboarding(orgTypes, nextData, packages) === true,
          isCustomPlanSelection(packages, nextData),
        ));
        return;
      }
      step(1);
      return;
    }

    if (reviewEditTarget === 'organization') {
      const destination = organizationReviewDestination(
        screen as 'facility' | 'specialization' | 'details',
        hasSpecialization(orgTypes, data.facilityType),
      );
      if (destination !== 'review') {
        goTo(destination);
        return;
      }
      if (!isMultiBranchEligible(orgTypes, data.facilityType)) {
        updateData({ multiBranchEnabled: false });
      }
      finishReviewEdit();
      return;
    }

    if (reviewEditTarget === 'modules') {
      const nextData = { ...data, ...committedData };
      if (moduleReviewDestination(
        nextData,
        isSoloDoctorOnboarding(orgTypes, nextData, packages) === true,
      ) === 'practitioner') {
        goTo('practitioner');
        return;
      }
      finishReviewEdit();
      return;
    }

    finishReviewEdit();
  };
  const onBack = () => reviewEditTarget ? cancelReviewEdit() : step(-1);
  const stepProps = { onNext, onBack, updateData, data };

  const currentRail = reviewEditTarget ? SCREEN_RAIL.review : SCREEN_RAIL[activeScreen];
  const currentLabel = RAIL_STEPS.find((s) => s.rail === currentRail)?.label;

  return (
    <div className="obv2">
      <header className="app-header">
        <div className="app-header__inner">
          <a href="/" className="logo">Kaero <span className="logo__product">Prescribe</span></a>
          <a href="mailto:support@kaerogroup.com" className="help-link">Need help?</a>
        </div>
      </header>

      <nav className="step-rail" aria-label="Onboarding progress">
        <div className="step-rail__inner">
          {RAIL_STEPS.map((s, i) => {
            const stateClass = s.rail < currentRail ? 'is-complete' : s.rail === currentRail ? 'is-current' : '';
            const isLast = i === RAIL_STEPS.length - 1;
            return (
              <Fragment key={s.rail}>
                <div className={`rail-step ${stateClass}`}>
                  <div className="rail-step__marker-wrap">
                    <div className="rail-step__marker">{s.rail < currentRail ? '✓' : s.rail}</div>
                    <div className="rail-step__label">{s.label}</div>
                  </div>
                </div>
                {!isLast && <div className="rail-step__line" />}
              </Fragment>
            );
          })}
        </div>
        <p className="step-rail__mobile">
          {reviewEditTarget
            ? <><strong>Editing completed setup</strong> — return to Review after saving</>
            : <>Step {currentRail} of {RAIL_STEPS.length} — <strong>{currentLabel}</strong></>}
        </p>
      </nav>

      <main className="onboarding">
        {activeScreen === 'facility' && (
          <FacilityTypeSelection onNext={onNext} updateData={updateData} data={data} />
        )}
        {activeScreen === 'specialization' && <SpecializationSelection {...stepProps} />}
        {activeScreen === 'email' && <EmailInitiation {...stepProps} />}
        {activeScreen === 'otp' && <OtpVerification {...stepProps} onSessionReverified={onSessionReverified} />}
        {activeScreen === 'details' && reviewEditTarget && (reviewEditTarget === 'organization' || reviewEditTarget === 'administrator')
          ? <ReviewDetailsEdit section={reviewEditTarget} {...stepProps} />
          : activeScreen === 'details' && <OrganizationDetails {...stepProps} />}
        {activeScreen === 'branchSetup' && <BranchSetupSelection {...stepProps} />}
        {activeScreen === 'modules' && <ModuleCatalogSelection {...stepProps} />}
        {activeScreen === 'customPlan' && (
          <CustomPlanRequirements {...stepProps} modules={catalog?.modules ?? []} />
        )}
        {activeScreen === 'practitioner' && <PractitionerIntent {...stepProps} />}
        {activeScreen === 'review' && <ReviewStep {...stepProps} onEdit={startReviewEdit} />}
        {activeScreen === 'payment' && <PaymentStep {...stepProps} />}
        {activeScreen === 'provisioning' && <ProvisioningStatus data={data} updateData={updateData} />}
      </main>
    </div>
  );
}
