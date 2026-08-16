"use client";

import { ORG_TYPES } from "../onboardingConfig";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function FacilityTypeSelection({ onNext, updateData, data }: Props) {
  const selected = data.facilityType;

  const select = (id: string) => {
    if (id !== selected) {
      // Org type is context only; changing it clears a stale specialization.
      updateData({ facilityType: id, specialization: undefined });
    }
  };

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 1</p>
        <h1 className="screen__title">What are you setting up?</h1>
        <p className="screen__subtitle">
          Choose what best describes your healthcare organization. This helps us recommend the right
          setup — you can customize your modules later.
        </p>

        <div className="option-grid" role="radiogroup" aria-label="Organization type">
          {ORG_TYPES.map((f) => {
            const isSel = selected === f.id;
            return (
              <button
                type="button"
                key={f.id}
                role="radio"
                aria-checked={isSel}
                className={`option-card ${isSel ? "is-selected" : ""}`}
                onClick={() => select(f.id)}
              >
                <div className="option-card__header">
                  <div>
                    <div className="option-card__title">{f.name}</div>
                    <div className="option-card__desc">{f.desc}</div>
                  </div>
                  <div className="option-card__check">✓</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="screen__actions screen__actions--end">
          <button className="btn btn--primary" type="button" disabled={!selected} onClick={onNext}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
