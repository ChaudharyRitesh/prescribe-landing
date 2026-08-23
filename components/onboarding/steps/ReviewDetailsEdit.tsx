"use client";

import { useState } from "react";
import { normalizeName } from "@/lib/validations/normalize";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  section: "organization" | "administrator";
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export function ReviewDetailsEdit({ section, onNext, onBack, updateData, data }: Props) {
  const [value, setValue] = useState(section === "organization" ? data.orgName || "" : data.contactName || "");
  const normalized = normalizeName(value);
  const valid = normalized.length >= 2;

  const save = () => {
    if (!valid) return;
    updateData(section === "organization" ? { orgName: normalized } : { contactName: normalized });
    onNext();
  };

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Editing completed setup</p>
        <h1 className="screen__title">
          {section === "organization" ? "Change organization" : "Change administrator details"}
        </h1>
        <p className="screen__subtitle">
          {section === "organization"
            ? "Update the organization name for the facility and clinical context you selected."
            : "Update the administrator name. Your verified email stays unchanged."}
        </p>

        <div className="form form--grid">
          <div className="field field--span2">
            <label className="field__label" htmlFor="reviewDetailName">
              {section === "organization" ? "Organization name" : "Administrator name"}
            </label>
            <input
              id="reviewDetailName"
              className={`field__input ${value.length > 0 && !valid ? "is-invalid" : ""}`}
              autoComplete={section === "organization" ? "organization" : "name"}
              maxLength={section === "organization" ? 120 : 80}
              value={value}
              aria-invalid={value.length > 0 && !valid}
              onChange={(event) => setValue(event.target.value)}
            />
            {value.length > 0 && !valid && (
              <p className="field__hint field__hint--error">Enter at least 2 characters.</p>
            )}
          </div>
          {section === "administrator" && (
            <div className="field field--span2">
              <label className="field__label">Verified email</label>
              <input className="field__input" value={data.email || "—"} disabled readOnly />
            </div>
          )}
        </div>

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Cancel</button>
          <button className="btn btn--primary" type="button" disabled={!valid} onClick={save}>Save changes</button>
        </div>
      </div>
    </section>
  );
}
