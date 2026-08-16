"use client";

import { SPECIALIZATIONS, orgTypeName } from "../onboardingConfig";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function SpecializationSelection({ onNext, onBack, updateData, data }: Props) {
  const list = SPECIALIZATIONS[data.facilityType || ""] || [];
  const isDiagnostic = data.facilityType === "diagnostic";
  const selected = data.specialization;

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 1</p>
        <h1 className="screen__title">
          {isDiagnostic ? "Which services do you offer?" : "What's your specialization?"}
        </h1>
        <p className="screen__subtitle">
          This helps us tailor the modules and terminology for your {orgTypeName(data.facilityType).toLowerCase()}.
        </p>

        <div className="option-grid option-grid--compact" role="radiogroup" aria-label="Specialization">
          {list.map((s) => {
            const isSel = selected === s;
            return (
              <button
                type="button"
                key={s}
                role="radio"
                aria-checked={isSel}
                className={`option-card ${isSel ? "is-selected" : ""}`}
                onClick={() => updateData({ specialization: s })}
              >
                <div className="option-card__header">
                  <div className="option-card__title">{s}</div>
                  <div className="option-card__check">✓</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
          <button className="btn btn--primary" type="button" disabled={!selected} onClick={onNext}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
