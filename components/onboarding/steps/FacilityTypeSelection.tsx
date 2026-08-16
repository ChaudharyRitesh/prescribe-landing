"use client";

import { useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function FacilityTypeSelection({ onNext, updateData, data }: Props) {
  const { data: orgTypesRes, isLoading } = useOrgTypesQuery();
  const orgTypes = orgTypesRes?.data || [];
  const selected = data.facilityType;

  const select = (slug: string) => {
    if (slug !== selected) {
      // Org type is context only; changing it clears a stale specialization.
      updateData({ facilityType: slug, specialization: undefined });
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

        {isLoading ? (
          <p className="screen__subtitle">Loading organization types…</p>
        ) : (
          <div className="option-grid" role="radiogroup" aria-label="Organization type">
            {orgTypes.map((f) => {
              const isSel = selected === f.slug;
              return (
                <button
                  type="button"
                  key={f.slug}
                  role="radio"
                  aria-checked={isSel}
                  className={`option-card ${isSel ? "is-selected" : ""}`}
                  onClick={() => select(f.slug)}
                >
                  <div className="option-card__header">
                    <div>
                      <div className="option-card__title">{f.label}</div>
                      <div className="option-card__desc">{f.description}</div>
                    </div>
                    <div className="option-card__check">✓</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="screen__actions screen__actions--end">
          <button className="btn btn--primary" type="button" disabled={!selected} onClick={onNext}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
