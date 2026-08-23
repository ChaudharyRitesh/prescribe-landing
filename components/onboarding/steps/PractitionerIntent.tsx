"use client";

import { useState } from "react";
import { useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import { normalizeName } from "@/lib/validations/normalize";
import { orgSubTypeLabel } from "../onboardingConfig";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

// P5-DOC.ONB-A1 — explicit owner-practitioner intent. Doctors entitlement ≠ the owner is a Doctor;
// only an explicit YES may trigger the frozen P5-C.2 owner-Doctor link at provisioning.
export function PractitionerIntent({ onNext, onBack, updateData, data }: Props) {
  const { data: orgTypesRes } = useOrgTypesQuery();
  const specializationSuggestion = orgSubTypeLabel(orgTypesRes?.data, data.facilityType, data.specialization);

  // Tri-state: undefined until the owner explicitly chooses.
  const [intent, setIntent] = useState<boolean | undefined>(data.ownerPractitionerIntent);
  const [name, setName] = useState(data.ownerDoctorProfile?.name ?? data.contactName ?? "");
  const [registrationNumber, setRegistrationNumber] = useState(data.ownerDoctorProfile?.registrationNumber ?? "");
  const [specialization, setSpecialization] = useState(
    data.ownerDoctorProfile?.specialization ?? specializationSuggestion ?? "",
  );

  const nameValid = normalizeName(name).length >= 2;
  const canContinue = intent === false || (intent === true && nameValid);

  const commit = () => {
    if (intent === undefined) return;
    if (intent) {
      updateData({
        ownerPractitionerIntent: true,
        ownerDoctorProfile: {
          name: normalizeName(name),
          specialization: specialization.trim() || undefined,
          registrationNumber: registrationNumber.trim() || undefined,
          phone: data.contactPhone || undefined, // reuse the already-normalized owner contact phone
        },
      });
    } else {
      updateData({ ownerPractitionerIntent: false, ownerDoctorProfile: undefined });
    }
    onNext();
  };

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 4</p>
        <h1 className="screen__title">Will you personally practice as a Doctor?</h1>
        <p className="screen__subtitle">
          You&apos;ve added the Doctors module. Tell us whether you&apos;ll see patients yourself, or you&apos;re
          setting up the organization and will add Doctors later. You can always change this from your dashboard.
        </p>

        <div className="option-grid option-grid--compact" role="radiogroup" aria-label="Practitioner intent">
          <button
            type="button"
            role="radio"
            aria-checked={intent === true}
            className={`option-card ${intent === true ? "is-selected" : ""}`}
            onClick={() => setIntent(true)}
          >
            <div className="option-card__header">
              <div>
                <div className="option-card__title">Yes — I will personally practice as a Doctor</div>
                <div className="option-card__desc">We&apos;ll set up your Doctor workspace alongside Admin.</div>
              </div>
              <div className="option-card__check">✓</div>
            </div>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={intent === false}
            className={`option-card ${intent === false ? "is-selected" : ""}`}
            onClick={() => setIntent(false)}
          >
            <div className="option-card__header">
              <div>
                <div className="option-card__title">No — I&apos;ll add/manage Doctors later</div>
                <div className="option-card__desc">You&apos;ll stay an Organization Administrator for now.</div>
              </div>
              <div className="option-card__check">✓</div>
            </div>
          </button>
        </div>

        {intent === true && (
          <div className="form form--grid" style={{ marginTop: 24 }}>
            <div className="field">
              <label className="field__label" htmlFor="docName">Your professional name</label>
              <input
                id="docName"
                className={`field__input ${!nameValid && name.length > 0 ? "is-invalid" : ""}`}
                autoComplete="name"
                maxLength={80}
                placeholder="Dr. John Doe"
                value={name}
                aria-invalid={!nameValid && name.length > 0}
                onChange={(e) => setName(e.target.value)}
              />
              {!nameValid && name.length > 0 && (
                <p className="field__hint field__hint--error">Enter your name (at least 2 characters).</p>
              )}
            </div>
            <div className="field">
              <label className="field__label" htmlFor="docReg">
                Medical registration number <span className="field__optional">Optional</span>
              </label>
              <input
                id="docReg"
                className="field__input"
                maxLength={40}
                placeholder="e.g. WBMC-12345"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
            </div>
            <div className="field field--span2">
              <label className="field__label" htmlFor="docSpec">
                Specialization <span className="field__optional">Optional</span>
              </label>
              <input
                id="docSpec"
                className="field__input"
                maxLength={80}
                placeholder={specializationSuggestion || "e.g. General Medicine"}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
              <p className="field__hint">
                {specializationSuggestion
                  ? `Suggested from your clinical setup: ${specializationSuggestion}. Edit if it differs.`
                  : "You can refine this later in your Doctor profile."}
              </p>
            </div>
          </div>
        )}

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
          <button className="btn btn--primary" type="button" disabled={!canContinue} onClick={commit}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
