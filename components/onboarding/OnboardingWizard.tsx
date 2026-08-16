"use client";

import { Fragment, useEffect, useState } from "react";
import { useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import {
  RAIL_STEPS,
  SCREEN_ORDER,
  SCREEN_RAIL,
  ScreenId,
  hasSpecialization,
  isMultiBranchEligible,
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
import { PricingSnapshot } from "@/lib/api/types/onboarding.types";

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
  specialization?: string;
  multiBranchEnabled?: boolean;
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
}

export function OnboardingWizard({ externalData, externalUpdateData }: OnboardingWizardProps) {
  const [localData, setLocalData] = useState<OnboardingData>({});
  const data = externalData || localData;
  const updateData =
    externalUpdateData || ((newData: Partial<OnboardingData>) => setLocalData((p) => ({ ...p, ...newData })));

  const [screen, setScreen] = useState<ScreenId>('facility');
  const { data: orgTypesRes } = useOrgTypesQuery();
  const orgTypes = orgTypesRes?.data;

  // Resume a mid-flight session to the correct screen.
  useEffect(() => {
    if (!data.sessionId) return;
    if (
      data.status === 'provisioned' ||
      data.status === 'provisioning' ||
      data.status === 'quote_pending' ||
      data.status === 'failed'
    ) {
      setScreen('provisioning');
    } else if (data.status === 'pending_payment') {
      setScreen('review');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.sessionId, data.status]);

  const goTo = (s: ScreenId) => {
    setScreen(s);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const step = (dir: 1 | -1) => {
    let idx = SCREEN_ORDER.indexOf(screen);
    while (idx + dir >= 0 && idx + dir < SCREEN_ORDER.length) {
      idx += dir;
      const candidate = SCREEN_ORDER[idx];
      if (candidate === 'specialization' && !hasSpecialization(orgTypes, data.facilityType)) continue;
      if (candidate === 'branchSetup' && !isMultiBranchEligible(orgTypes, data.facilityType)) continue;
      goTo(candidate);
      return;
    }
  };

  const onNext = () => step(1);
  const onBack = () => step(-1);
  const stepProps = { onNext, onBack, updateData, data };

  const currentRail = SCREEN_RAIL[screen];
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
          Step {currentRail} of {RAIL_STEPS.length} — <strong>{currentLabel}</strong>
        </p>
      </nav>

      <main className="onboarding">
        {screen === 'facility' && (
          <FacilityTypeSelection onNext={onNext} updateData={updateData} data={data} />
        )}
        {screen === 'specialization' && <SpecializationSelection {...stepProps} />}
        {screen === 'email' && <EmailInitiation {...stepProps} />}
        {screen === 'otp' && <OtpVerification {...stepProps} />}
        {screen === 'details' && <OrganizationDetails {...stepProps} />}
        {screen === 'branchSetup' && <BranchSetupSelection {...stepProps} />}
        {screen === 'modules' && <ModuleCatalogSelection {...stepProps} />}
        {screen === 'review' && <ReviewStep {...stepProps} goTo={goTo} />}
        {screen === 'payment' && <PaymentStep {...stepProps} />}
        {screen === 'provisioning' && <ProvisioningStatus data={data} updateData={updateData} />}
      </main>
    </div>
  );
}
