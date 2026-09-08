"use client";

import { useMemo } from "react";
import { OnboardingData } from "../OnboardingWizard";
import {
  REQUIREMENT_CAPACITY_FIELDS,
  setRequestedLimit,
  toRequestedCount,
} from "../customPlanRequest";

interface CatalogModuleLite {
  _id?: string;
  slug: string;
  label: string;
  requires?: string[];
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  modules: CatalogModuleLite[];
}

/**
 * CUSTOM PLAN — requirement intake.
 *
 * Shown only on the custom-plan path. This captures what the customer NEEDS so the sales team can
 * prepare a quote; it does not define their plan. Nothing entered here becomes an entitlement — the
 * Super Admin composes the actual contract afterwards, and the copy says so plainly rather than
 * implying these numbers are limits.
 *
 * Deliberately free of admin vocabulary: no "quota", "entitlement", "unlimited/none/custom", no
 * contract version, no access states. Staff-count fields appear only for the modules the customer
 * actually asked for, so nobody is asked how many pharmacists they need without Pharmacy.
 */
export function CustomPlanRequirements({ onNext, onBack, updateData, data, modules }: Props) {
  const request = data.customPlanRequest ?? {};
  const requestedModules = request.requestedModules ?? [];
  const limits = request.requestedLimits ?? {};

  const patch = (next: Partial<NonNullable<OnboardingData["customPlanRequest"]>>) =>
    updateData({ customPlanRequest: { ...request, ...next } });

  const toggleModule = (slug: string) => {
    const next = requestedModules.includes(slug)
      ? requestedModules.filter((m) => m !== slug)
      : [...requestedModules, slug].sort();
    patch({ requestedModules: next });
  };

  // Dependency hints mirror the catalog's own `requires`, so the customer is nudged the same way the
  // backend resolver would rule — but this is guidance, not a hard gate on a requirement form.
  const missingDependencies = useMemo(() => {
    const selected = new Set(requestedModules);
    const byslug = new Map(modules.map((m) => [m.slug, m]));
    const out: string[] = [];
    for (const slug of requestedModules) {
      for (const dep of byslug.get(slug)?.requires ?? []) {
        if (!selected.has(dep)) {
          out.push(`${byslug.get(slug)?.label ?? slug} usually needs ${byslug.get(dep)?.label ?? dep}`);
        }
      }
    }
    return out;
  }, [requestedModules, modules]);

  const visibleCapacity = REQUIREMENT_CAPACITY_FIELDS.filter(
    (f) => f.requiresModule === null || requestedModules.includes(f.requiresModule),
  );

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Custom plan</p>
        <h1 className="screen__title">Tell us what you need</h1>
        <p className="screen__subtitle">
          Share your expected setup so our team can prepare a suitable custom quote. You can revise
          the final offer with our team before payment.
        </p>

        <div className="form form--grid">
          <div className="field field--span2">
            <label className="field__label">Areas you expect to use</label>
            <p className="field__hint">Select what you need. Our team will confirm the final list with you.</p>
            <div className="option-grid option-grid--compact" role="group" aria-label="Modules you need">
              {modules.map((m) => {
                const selected = requestedModules.includes(m.slug);
                return (
                  <button
                    type="button"
                    key={m.slug}
                    aria-pressed={selected}
                    className={`option-card ${selected ? "is-selected" : ""}`}
                    onClick={() => toggleModule(m.slug)}
                  >
                    <div className="option-card__header">
                      <div>
                        <div className="option-card__title">{m.label}</div>
                      </div>
                      <div className="option-card__check">✓</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {missingDependencies.length > 0 && (
              <p className="field__hint">{missingDependencies.join(" · ")}</p>
            )}
          </div>

          {visibleCapacity.length > 0 && (
            <div className="field field--span2">
              <label className="field__label">Expected team size</label>
              <p className="field__hint">Approximate numbers are fine.</p>
            </div>
          )}

          {visibleCapacity.map((f) => (
            <div className="field" key={f.key}>
              <label className="field__label" htmlFor={`req-${f.key}`}>
                {f.label} <span className="field__optional">Optional</span>
              </label>
              <input
                id={`req-${f.key}`}
                className="field__input"
                type="number"
                min={0}
                inputMode="numeric"
                placeholder={f.placeholder}
                value={limits[f.key] ?? ""}
                onChange={(e) => patch({ requestedLimits: setRequestedLimit(limits, f.key, e.target.value) })}
              />
            </div>
          ))}

          <div className="field">
            <label className="field__label" htmlFor="req-branches">
              Expected branches / locations <span className="field__optional">Optional</span>
            </label>
            <input
              id="req-branches"
              className="field__input"
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="e.g. 3"
              value={limits.branches ?? ""}
              onChange={(e) => {
                const branches = toRequestedCount(e.target.value);
                patch({
                  requestedLimits: setRequestedLimit(limits, "branches", e.target.value),
                  // Asking for more than one location IS the multi-branch intent. Still only a
                  // request — the final contract capability is the Super Admin's decision.
                  multiBranchRequested: branches === undefined ? request.multiBranchRequested : branches > 1,
                });
              }}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="req-cycle">
              Preferred billing <span className="field__optional">Optional</span>
            </label>
            <select
              id="req-cycle"
              className="field__input"
              value={request.preferredBillingCycle ?? ""}
              onChange={(e) =>
                patch({ preferredBillingCycle: (e.target.value || undefined) as "monthly" | "yearly" | undefined })
              }
            >
              <option value="">No preference</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="field field--span2">
            <label className="field__label" htmlFor="req-note">
              Anything else we should know? <span className="field__optional">Optional</span>
            </label>
            <textarea
              id="req-note"
              className="field__input"
              rows={3}
              maxLength={2000}
              placeholder="Example: We operate 3 clinics and need Doctors, Pharmacy and Pathlab for around 25 doctors."
              value={request.customerRequirementNote ?? ""}
              onChange={(e) => patch({ customerRequirementNote: e.target.value })}
            />
          </div>
        </div>

        <p className="field__hint">
          Our team will review these requirements and send you a custom quote. Final pricing and
          limits may differ from this request.
        </p>

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
          {/* Every field is optional — a customer who prefers to talk it through can simply continue. */}
          <button className="btn btn--primary" type="button" onClick={onNext}>Continue</button>
        </div>
      </div>
    </section>
  );
}
