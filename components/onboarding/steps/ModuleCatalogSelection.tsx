"use client";

import { useEffect, useMemo, useState } from "react";
import { useCatalogQuery, useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import { ModuleItem, PackageItem } from "@/lib/api/types/onboarding.types";
import { isDoctorProfessionalPractice, isSoloDoctorOnboarding, orgSubTypeLabel, orgTypeName } from "../onboardingConfig";
import { OnboardingData } from "../OnboardingWizard";
import {
  individualModuleSelectionPatch,
  packageModuleSelectionPatch,
  practitionerClearPatch,
  soloDoctorPractitionerDefault,
} from "../reviewEditNavigation";

interface Props {
  onNext: (committedData?: Partial<OnboardingData>) => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

type Mode = "individual" | "package" | "custom";
type Cycle = "monthly" | "yearly";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const isAdmin = (m: ModuleItem) => m.slug === "admin" || m.entitlementKey === "admin";

export function ModuleCatalogSelection({ onNext, onBack, updateData, data }: Props) {
  // Full active catalog — org type never filters "Build your own" (mock rule).
  const { data: catalog, isLoading, error } = useCatalogQuery();
  const { data: orgTypesRes } = useOrgTypesQuery();
  const orgTypes = orgTypesRes?.data;

  const [mode, setMode] = useState<Mode>(data.selectionType === "package" ? "package" : "individual");
  const [selectedModules, setSelectedModules] = useState<string[]>(data.selectedModules || []);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(data.packageId || null);
  const [cycle, setCycle] = useState<Cycle>(data.billingCycle || "monthly");

  const modules = useMemo(
    () => (catalog?.modules || []).filter((m) => !isAdmin(m)),
    [catalog]
  );
  const packages = useMemo(() => (catalog?.packages || []).filter((p) => !p.isCustom), [catalog]);
  const customPackages = useMemo(() => (catalog?.packages || []).filter((p) => p.isCustom), [catalog]);

  const moduleBySlug = useMemo(() => {
    const map: Record<string, ModuleItem> = {};
    modules.forEach((m) => { map[m.slug] = m; });
    return map;
  }, [modules]);

  // selectionType is the configured-state marker: hydrated [] with no type is still uninitialized,
  // while an explicit OFF interaction persists individual + [] and must never be defaulted again.
  useEffect(() => {
    if (
      data.selectionType !== undefined ||
      data.packageId !== undefined ||
      !isDoctorProfessionalPractice(orgTypes, data.facilityType)
    ) return;

    const doctorsModule = moduleBySlug.doctors;
    if (!doctorsModule) return;

    const defaultModules = [doctorsModule.slug];
    setSelectedModules(defaultModules);
    setMode("individual");
    setSelectedPackage(null);
    updateData({
      ...individualModuleSelectionPatch(defaultModules),
      subscriptionPlan: "individual",
    });
  }, [data.facilityType, data.packageId, data.selectionType, moduleBySlug, orgTypes, updateData]);

  const categories = useMemo(() => {
    const groups: Record<string, ModuleItem[]> = {};
    modules.forEach((m) => {
      const cat = m.category?.trim() || "Modules";
      (groups[cat] = groups[cat] || []).push(m);
    });
    return Object.entries(groups);
  }, [modules]);

  const recommended = useMemo(
    () => modules.filter((m) => m.isHero || (data.facilityType && m.recommendedFor?.includes(data.facilityType))),
    [modules, data.facilityType]
  );

  const priceOf = (m?: ModuleItem) => (m ? (cycle === "yearly" ? m.pricing?.yearly || 0 : m.pricing?.monthly || 0) : 0);
  const pkgPrice = (p: PackageItem) => (cycle === "yearly" ? p.pricing?.yearly || 0 : p.pricing?.monthly || 0);

  const toggleModule = (slug: string) => {
    const nextModules = selectedModules.includes(slug)
      ? selectedModules.filter((s) => s !== slug)
      : [...selectedModules, slug];
    setSelectedModules(nextModules);
    setMode("individual");
    setSelectedPackage(null);
    updateData({
      ...individualModuleSelectionPatch(nextModules),
      subscriptionPlan: "individual",
    });
  };

  const applyRecommended = () => {
    const nextModules = recommended.map((m) => m.slug);
    setSelectedModules(nextModules);
    setMode("individual");
    setSelectedPackage(null);
    updateData({
      ...individualModuleSelectionPatch(nextModules),
      subscriptionPlan: "individual",
    });
  };

  const selectIndividualMode = () => {
    setMode("individual");
    setSelectedPackage(null);
    updateData({
      ...individualModuleSelectionPatch(selectedModules),
      subscriptionPlan: "individual",
    });
  };

  const selectPackage = (pkg: PackageItem, nextMode: "package" | "custom") => {
    setMode(nextMode);
    setSelectedPackage(pkg._id);
    updateData({
      ...packageModuleSelectionPatch(pkg),
      subscriptionPlan: pkg.slug,
    });
  };

  const selectCustomMode = () => {
    setMode("custom");
    setSelectedPackage(null);
    updateData({
      ...packageModuleSelectionPatch(undefined),
      subscriptionPlan: undefined,
    });
  };
  const recommendedApplied =
    recommended.length > 0 &&
    recommended.every((m) => selectedModules.includes(m.slug)) &&
    selectedModules.length === recommended.length;

  const individualSubtotal = selectedModules.reduce((sum, slug) => sum + priceOf(moduleBySlug[slug]), 0);
  const activePackage = packages.find((p) => p._id === selectedPackage) || customPackages.find((p) => p._id === selectedPackage);

  let summaryMeta = "No modules selected yet";
  let summaryAmount = inr(0);
  let isCustomSelection = false;
  let canContinue = false;

  if (mode === "individual") {
    summaryMeta = selectedModules.length === 0 ? "No modules selected yet" : `${selectedModules.length} module${selectedModules.length > 1 ? "s" : ""} selected`;
    summaryAmount = inr(individualSubtotal);
    canContinue = selectedModules.length > 0;
  } else if (mode === "package") {
    summaryMeta = activePackage ? activePackage.label : "Select a package";
    summaryAmount = activePackage ? inr(pkgPrice(activePackage)) : inr(0);
    canContinue = !!selectedPackage;
  } else {
    isCustomSelection = true;
    summaryMeta = activePackage ? activePackage.label : "Custom plan";
    summaryAmount = "Custom quote";
    canContinue = !!selectedPackage;
  }

  const handleContinue = () => {
    if (!canContinue) return;
    const selectionPatch = mode === "individual"
      ? individualModuleSelectionPatch(selectedModules)
      : packageModuleSelectionPatch(activePackage);
    const doctorsSelected = selectionPatch.doctorsSelected;
    // D-4: if doctors is no longer selected, drop any previously-captured owner-practitioner state
    // so the payload can't request owner-Doctor provisioning without the entitlement.
    const clearedPractitioner = practitionerClearPatch(doctorsSelected);
    // Only the standalone Doctor path gets a pre-filled practitioner answer; every other
    // organization purchase leaves owner-practitioner state cleared (see isSoloDoctorOnboarding).
    const soloDoctorDefault = isSoloDoctorOnboarding(orgTypes, { ...data, ...selectionPatch }, catalog?.packages) === true
      ? soloDoctorPractitionerDefault(data, orgSubTypeLabel(orgTypes, data.facilityType, data.specialization))
      : {};
    let committedData: Partial<OnboardingData>;
    if (mode === "individual") {
      committedData = { ...selectionPatch, subscriptionPlan: "individual", billingCycle: cycle, ...clearedPractitioner, ...soloDoctorDefault };
    } else {
      const pkg = activePackage;
      committedData = { ...selectionPatch, subscriptionPlan: pkg?.slug, billingCycle: cycle, ...clearedPractitioner, ...soloDoctorDefault };
    }
    updateData(committedData);
    onNext(committedData);
  };

  if (isLoading) {
    return (
      <section className="screen">
        <div className="screen__container screen__container--wide">
          <p className="screen__subtitle"><span className="spinner" /> Loading catalog…</p>
        </div>
      </section>
    );
  }
  if (error || !catalog) {
    return (
      <section className="screen">
        <div className="screen__container screen__container--wide">
          <p className="screen__title">Couldn&apos;t load the catalog</p>
          <p className="screen__subtitle">Please go back and try again.</p>
          <div className="screen__actions"><button className="btn btn--secondary" type="button" onClick={onBack}>Back</button></div>
        </div>
      </section>
    );
  }

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 4</p>
        <h1 className="screen__title">Configure your workspace</h1>
        <p className="screen__subtitle">Start with a recommended setup, pick exactly the tools you need, or choose a package.</p>

        <div className="segmented" role="tablist" aria-label="Selection mode">
          <button type="button" role="tab" aria-selected={mode === "individual"} className={`segmented__option ${mode === "individual" ? "is-active" : ""}`} onClick={selectIndividualMode}>Individual modules</button>
          {packages.length > 0 && (
            <button type="button" role="tab" aria-selected={mode === "package"} className={`segmented__option ${mode === "package" ? "is-active" : ""}`} onClick={() => setMode("package")}>Packages</button>
          )}
          <button type="button" role="tab" aria-selected={mode === "custom"} className={`segmented__option ${mode === "custom" ? "is-active" : ""}`} onClick={selectCustomMode}>Custom plan</button>
        </div>

        {/* Individual: recommended preset + full catalog */}
        {mode === "individual" && (
          <>
            {recommended.length > 0 && (
              <div className="recommend-card">
                <p className="recommend-card__context">Based on: <strong>{[orgTypeName(orgTypes, data.facilityType), orgSubTypeLabel(orgTypes, data.facilityType, data.specialization)].filter(Boolean).join(" · ")}</strong></p>
                <p className="recommend-card__heading">Recommended setup</p>
                <div className="recommend-card__modules">
                  {recommended.map((m) => <div key={m.slug} className="recommend-card__module">{m.label}</div>)}
                </div>
                <div className="recommend-card__footer">
                  <span className="recommend-card__price"><strong>{inr(recommended.reduce((s, m) => s + priceOf(m), 0))}</strong> / {cycle === "yearly" ? "year" : "month"}</span>
                  {recommendedApplied
                    ? <span className="recommend-card__applied">✓ Applied — adjust anything below</span>
                    : <button type="button" className="btn btn--primary" onClick={applyRecommended}>Use this setup</button>}
                </div>
              </div>
            )}

            <div className="module-categories">
              {categories.map(([cat, mods]) => (
                <div className="module-category" key={cat}>
                  <div className="module-category__title">{cat}</div>
                  {mods.map((m) => {
                    const rec = m.isHero || (data.facilityType && m.recommendedFor?.includes(data.facilityType));
                    return (
                      <div className="module-row" key={m.slug}>
                        <div className="module-row__info">
                          <span className="module-row__name">
                            {m.label}
                            {rec && <span className="module-row__rec">Recommended</span>}
                          </span>
                          <span className="module-row__price">{m.isCustom ? "Custom pricing" : `${inr(priceOf(m))} / ${cycle === "yearly" ? "year" : "month"}`}</span>
                        </div>
                        <label className="toggle">
                          <input type="checkbox" checked={selectedModules.includes(m.slug)} onChange={() => toggleModule(m.slug)} aria-label={m.label} />
                          <span className="toggle__track" />
                          <span className="toggle__thumb" />
                        </label>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Packages */}
        {mode === "package" && (
          <div className="package-grid">
            {packages.map((p) => {
              const isSel = selectedPackage === p._id;
              return (
                <button type="button" key={p._id} className={`package-card ${isSel ? "is-selected" : ""}`} onClick={() => selectPackage(p, "package")}>
                  {p.badge && <span className="package-card__badge">{p.badge}</span>}
                  <span className="package-card__name">{p.label}</span>
                  {p.tagline && <span className="package-card__tagline">{p.tagline}</span>}
                  <span className="package-card__price"><strong>{inr(pkgPrice(p))}</strong> <span>/ {cycle === "yearly" ? "yr" : "mo"}</span></span>
                  <span className="package-card__modules">
                    {(p.modules || []).map((s) => moduleBySlug[s]?.label || s).join(" · ") || "—"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Custom plan */}
        {mode === "custom" && (
          <div className="custom-card">
            <p className="custom-card__heading">Enterprise &amp; custom needs</p>
            <p className="custom-card__body">For multi-city or multi-branch operations, large staff counts, or negotiated limits, our team will build a tailored plan and quote for you.</p>
            <ul>
              <li>Multi-branch &amp; multi-city</li>
              <li>Custom staff &amp; storage limits</li>
              <li>Negotiated pricing</li>
              <li>Dedicated onboarding</li>
            </ul>
            {customPackages.length > 0 ? (
              <div className="package-grid">
                {customPackages.map((p) => {
                  const isSel = selectedPackage === p._id;
                  return (
                    <button type="button" key={p._id} className={`package-card ${isSel ? "is-selected" : ""}`} onClick={() => selectPackage(p, "custom")}>
                      {p.badge && <span className="package-card__badge">{p.badge}</span>}
                      <span className="package-card__name">{p.label}</span>
                      {p.tagline && <span className="package-card__tagline">{p.tagline}</span>}
                      <span className="package-card__price"><strong>Custom quote</strong></span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <a className="btn btn--secondary" href="mailto:sales@kaerogroup.com?subject=Custom%20plan%20enquiry">Talk to our team</a>
            )}
          </div>
        )}

        {/* Sticky configuration summary */}
        <div className="modules-layout__summary">
          <div className="config-summary">
            <div className="config-summary__row">
              <div>
                <p className="config-summary__title">Your configuration</p>
                <p className="config-summary__meta">{summaryMeta}</p>
              </div>
              <div className="billing-toggle" role="radiogroup" aria-label="Billing cycle">
                <button type="button" className={`billing-toggle__option ${cycle === "monthly" ? "is-active" : ""}`} onClick={() => setCycle("monthly")}>Monthly</button>
                <button type="button" className={`billing-toggle__option ${cycle === "yearly" ? "is-active" : ""}`} onClick={() => setCycle("yearly")}>Yearly <span className="billing-toggle__badge">2 months free</span></button>
              </div>
            </div>
            <div className="config-summary__price">
              <span className="config-summary__amount">{summaryAmount}</span>
              {!isCustomSelection && <span className="config-summary__period">/ {cycle === "yearly" ? "year" : "month"}</span>}
            </div>
          </div>
        </div>

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
          <button className="btn btn--primary" type="button" disabled={!canContinue} onClick={handleContinue}>
            {isCustomSelection ? "Continue to quote" : "Continue"}
          </button>
        </div>
      </div>
    </section>
  );
}
