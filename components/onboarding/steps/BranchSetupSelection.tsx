"use client";

import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function BranchSetupSelection({ onNext, onBack, updateData, data }: Props) {
  const selected = data.multiBranchEnabled;

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 3</p>
        <h1 className="screen__title">Single location or multiple linked locations?</h1>
        <p className="screen__subtitle">
          You can add more branches later from your dashboard if you're not sure yet.
        </p>

        <div className="option-grid option-grid--compact" role="radiogroup" aria-label="Branch setup">
          <button
            type="button"
            role="radio"
            aria-checked={selected === false}
            className={`option-card ${selected === false ? "is-selected" : ""}`}
            onClick={() => updateData({ multiBranchEnabled: false })}
          >
            <div className="option-card__header">
              <div>
                <div className="option-card__title">Single location</div>
                <div className="option-card__desc">One facility, one workspace</div>
              </div>
              <div className="option-card__check">✓</div>
            </div>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selected === true}
            className={`option-card ${selected === true ? "is-selected" : ""}`}
            onClick={() => updateData({ multiBranchEnabled: true })}
          >
            <div className="option-card__header">
              <div>
                <div className="option-card__title">Multiple linked locations</div>
                <div className="option-card__desc">Manage several branches from one account</div>
              </div>
              <div className="option-card__check">✓</div>
            </div>
          </button>
        </div>

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
          <button className="btn btn--primary" type="button" disabled={selected === undefined} onClick={onNext}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}
