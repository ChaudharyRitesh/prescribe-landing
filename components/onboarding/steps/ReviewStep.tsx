"use client";

import { useMemo, useState } from "react";
import { useCatalogQuery, useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import { inr, moduleCountLabel, selectionHeaderName, useOrderPricing } from "../pricing";
import { isSoloDoctorOnboarding, orgSubTypeLabel, orgTypeName, ScreenId } from "../onboardingConfig";
import {
  isValidIndianMobile,
  isValidIndianPin,
  normalizeAddressLine,
  normalizeIndianMobile,
  normalizeName,
  normalizePostalCode,
} from "@/lib/validations/normalize";
import type { OnboardingData, ReviewEditTarget } from "../OnboardingWizard";
import { effectiveDoctorsSelected, soloDoctorIntentPatch } from "../reviewEditNavigation";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  onEdit: (target: ReviewEditTarget, screen: ScreenId) => void;
}

export function ReviewStep({ onNext, onBack, updateData, data, onEdit }: Props) {
  const { data: catalog } = useCatalogQuery();
  const { data: orgTypesRes } = useOrgTypesQuery();

  const [terms, setTerms] = useState(!!data.termsAccepted);
  const [touched, setTouched] = useState<{ phone?: boolean; pin?: boolean }>({});

  const address = data.address?.street || "";
  const city = data.address?.city || "";
  const normalizedPhone = normalizeIndianMobile(data.contactPhone || "");
  const normalizedPin = normalizePostalCode(data.address?.postalCode || "");
  // Both remain optional under the existing contract, but restored non-empty values must be valid.
  const contactDetailsValid =
    (normalizedPhone === "" || isValidIndianMobile(normalizedPhone)) &&
    (normalizedPin === "" || isValidIndianPin(normalizedPin));
  const phoneError = touched.phone && normalizedPhone !== "" && !isValidIndianMobile(normalizedPhone);
  const pinError = touched.pin && normalizedPin !== "" && !isValidIndianPin(normalizedPin);

  const updateAddress = (patch: Partial<NonNullable<OnboardingData["address"]>>) => {
    updateData({ address: { ...(data.address || {}), ...patch } });
  };

  const pricing = useOrderPricing(data);

  const modules = catalog?.modules || [];
  const packages = catalog?.packages || [];
  const label = (slug: string) => modules.find((m) => m.slug === slug)?.label || slug;

  const isPackage = data.selectionType === "package";
  const activePackage = isPackage ? packages.find((p) => p._id === data.packageId) : undefined;
  const doctorEntitled = effectiveDoctorsSelected(data, packages) === true;

  const selectionLabels = useMemo(() => {
    if (isPackage) return (activePackage?.modules || []).map((slug) => ({ label: label(slug) }));
    return (data.selectedModules || []).map((slug) => ({ label: label(slug) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPackage, activePackage, data.selectedModules, modules]);

  const headerName = isPackage
    ? (activePackage?.label || "Package")
    : selectionHeaderName(selectionLabels);
  const countLabel = moduleCountLabel(selectionLabels.length, isPackage);

  const orgTypeLine = [
    orgTypeName(orgTypesRes?.data, data.facilityType),
    orgSubTypeLabel(orgTypesRes?.data, data.facilityType, data.specialization),
  ].filter(Boolean).join(" · ");

  const clinicalSetup = orgSubTypeLabel(
    orgTypesRes?.data,
    data.facilityType,
    data.specialization,
  ) || orgTypeName(orgTypesRes?.data, data.facilityType);

  // LOCKED ROUTING RULE — the owner-practitioner question belongs to the standalone Doctor path
  // only; see isSoloDoctorOnboarding. Every other organization purchase reviews as Admin-only.
  const showSoloDoctorControl = isSoloDoctorOnboarding(orgTypesRes?.data, data, packages) === true;
  const soloDoctorDefaultApplies = showSoloDoctorControl && data.ownerPractitionerIntent === undefined;
  const effectivePractitionerIntent = data.ownerPractitionerIntent ?? (soloDoctorDefaultApplies ? true : undefined);
  const effectiveDoctorProfile = data.ownerDoctorProfile || (soloDoctorDefaultApplies ? {
    name: data.contactName,
    specialization: clinicalSetup,
  } : undefined);
  const professionalName = effectiveDoctorProfile?.name || "";
  const professionalNameValid = normalizeName(professionalName).length >= 2;

  const updateDoctorProfile = (patch: Partial<NonNullable<OnboardingData["ownerDoctorProfile"]>>) => {
    updateData({
      ownerDoctorProfile: {
        ...(effectiveDoctorProfile || {}),
        ...patch,
      },
    });
  };

  const setSoloDoctorIntent = (intent: boolean) => {
    updateData(soloDoctorIntentPatch(data, intent, clinicalSetup));
  };

  const practitionerDecisionValid = !showSoloDoctorControl || effectivePractitionerIntent !== undefined;
  const practitionerProfileValid = effectivePractitionerIntent !== true || professionalNameValid;

  const canContinue = terms && contactDetailsValid && practitionerDecisionValid && practitionerProfileValid && (pricing.isCustom || !!pricing.money);

  const continueToPayment = () => {
    if (!terms || !(pricing.isCustom || !!pricing.money)) return;
    if (!contactDetailsValid || !practitionerDecisionValid || !practitionerProfileValid) {
      setTouched({ phone: true, pin: true });
      return;
    }
    updateData({
      address: {
        ...(data.address || {}),
        street: normalizeAddressLine(address),
        city: normalizeAddressLine(city),
        postalCode: normalizedPin,
      },
      contactPhone: normalizedPhone,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
    });
    onNext();
  };

  return (
    <section className="screen">
      <div className="screen__container screen__container--wide">
        <p className="eyebrow">Step 5</p>
        <h1 className="screen__title">Review your setup</h1>
        <p className="screen__subtitle">Confirm the details below before we set up your workspace.</p>

        <div className="review-grid">
          <div className="review-main">
            <div className="review-card">
              <div className="review-card__header">
                <h2 className="review-card__title">Organization</h2>
                <button className="link-btn" type="button" onClick={() => onEdit("organization", "facility")}>Change organization</button>
              </div>
              <p className="review-card__primary">{data.orgName || "—"}</p>
              <p className="review-card__secondary">{orgTypeLine || "—"}</p>
            </div>

            <div className="review-card">
              <div className="review-card__header">
                <h2 className="review-card__title">Administrator</h2>
                <button className="link-btn" type="button" onClick={() => onEdit("administrator", "details")}>Change administrator details</button>
              </div>
              <p className="review-card__primary">{data.contactName || "—"}</p>
              <p className="review-card__secondary">{data.email || "—"}</p>
            </div>

            <div className="review-card">
              <div className="review-card__header">
                <h2 className="review-card__title">Owner &amp; clinical role</h2>
              </div>
              {showSoloDoctorControl ? (
                <>
                  <div className="review-role__toggle-row">
                    <div>
                      <p className="review-card__primary">Practicing as a Doctor</p>
                      <p className="review-card__secondary">
                        {effectivePractitionerIntent
                          ? "You'll receive both Admin and Doctor workspaces."
                          : "You'll remain an Organization Administrator. You can enable your Doctor profile later."}
                      </p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        aria-label="Practicing as a Doctor"
                        checked={effectivePractitionerIntent === true}
                        onChange={(event) => setSoloDoctorIntent(event.target.checked)}
                      />
                      <span className="toggle__track" />
                      <span className="toggle__thumb" />
                    </label>
                  </div>

                  {effectivePractitionerIntent === true && (
                    <div className="form form--grid form--compact review-role__fields">
                      <div className="field">
                        <label className="field__label" htmlFor="reviewDocName">Professional name</label>
                        <input
                          id="reviewDocName"
                          className={`field__input ${!professionalNameValid ? "is-invalid" : ""}`}
                          autoComplete="name"
                          maxLength={80}
                          value={professionalName}
                          aria-invalid={!professionalNameValid}
                          onChange={(event) => updateDoctorProfile({ name: event.target.value })}
                          onBlur={() => updateDoctorProfile({ name: normalizeName(professionalName) })}
                        />
                        {!professionalNameValid && <p className="field__hint field__hint--error">Professional name is required.</p>}
                      </div>
                      <div className="field">
                        <label className="field__label" htmlFor="reviewDocReg">
                          Medical registration number <span className="field__optional">Optional</span>
                        </label>
                        <input
                          id="reviewDocReg"
                          className="field__input"
                          maxLength={40}
                          value={effectiveDoctorProfile?.registrationNumber || ""}
                          onChange={(event) => updateDoctorProfile({ registrationNumber: event.target.value })}
                          onBlur={() => updateDoctorProfile({ registrationNumber: effectiveDoctorProfile?.registrationNumber?.trim() || undefined })}
                        />
                      </div>
                      <div className="field field--span2">
                        <label className="field__label" htmlFor="reviewDocSpec">
                          Specialization <span className="field__optional">Optional</span>
                        </label>
                        <input
                          id="reviewDocSpec"
                          className="field__input"
                          maxLength={80}
                          value={effectiveDoctorProfile?.specialization || ""}
                          onChange={(event) => updateDoctorProfile({ specialization: event.target.value })}
                          onBlur={() => updateDoctorProfile({ specialization: effectiveDoctorProfile?.specialization?.trim() || undefined })}
                        />
                      </div>
                    </div>
                  )}

                  <p className="review-card__secondary">Clinical setup: {clinicalSetup}</p>
                  <p className="review-card__secondary">
                    Workspace outcome: {effectivePractitionerIntent
                      ? "Admin + Doctor workspace requested"
                      : "Admin workspace only"}
                  </p>
                </>
              ) : doctorEntitled && effectivePractitionerIntent === true ? (
                <>
                  <p className="review-card__primary">Role: Practicing Doctor</p>
                  <p className="review-card__secondary">Professional name: {effectiveDoctorProfile?.name || "Not provided"}</p>
                  <p className="review-card__secondary">Specialization: {effectiveDoctorProfile?.specialization || "Not provided"}</p>
                  <p className="review-card__secondary">Medical registration: {effectiveDoctorProfile?.registrationNumber || "Not provided"}</p>
                  <p className="review-card__secondary">Clinical setup: {clinicalSetup}</p>
                  <p className="review-card__secondary">Workspace outcome: Admin + Doctor workspace requested</p>
                </>
              ) : (
                <>
                  <p className="review-card__primary">Role: Organization Administrator only</p>
                  <p className="review-card__secondary">
                    Doctor workspace: {doctorEntitled ? "Not created for the owner" : "Not requested for the owner"}
                  </p>
                </>
              )}
            </div>

            <div className="review-card">
              <div className="review-card__header">
                <h2 className="review-card__title">Modules</h2>
                <button className="link-btn" type="button" onClick={() => onEdit("modules", "modules")}>Change modules</button>
              </div>
              <ul className="review-list">
                {selectionLabels.length
                  ? selectionLabels.map((l, i) => <li key={i}>{l.label}</li>)
                  : <li>No modules selected</li>}
              </ul>
            </div>

            <div className="review-card">
              <h2 className="review-card__title">Contact &amp; address</h2>
              <div className="form form--grid form--compact" style={{ marginTop: 12 }}>
                <div className="field field--span2">
                  <label className="field__label" htmlFor="addr">Address</label>
                  <input
                    id="addr"
                    className="field__input"
                    autoComplete="address-line1"
                    maxLength={120}
                    placeholder="Street, area"
                    value={address}
                    onChange={(event) => updateAddress({ street: event.target.value })}
                    onBlur={() => updateAddress({ street: normalizeAddressLine(address) })}
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="city">City</label>
                  <input
                    id="city"
                    className="field__input"
                    autoComplete="address-level2"
                    maxLength={60}
                    placeholder="Kolkata"
                    value={city}
                    onChange={(event) => updateAddress({ city: event.target.value })}
                    onBlur={() => updateAddress({ city: normalizeAddressLine(city) })}
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="pin">PIN code</label>
                  <input
                    id="pin"
                    className={`field__input ${pinError ? "is-invalid" : ""}`}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={6}
                    placeholder="700001"
                    value={normalizedPin}
                    aria-invalid={!!pinError}
                    aria-describedby={pinError ? "pin-err" : undefined}
                    onChange={(event) => updateAddress({ postalCode: normalizePostalCode(event.target.value) })}
                    onBlur={() => setTouched((current) => ({ ...current, pin: true }))}
                  />
                  {pinError && <p id="pin-err" className="field__hint field__hint--error">PIN code must contain 6 digits.</p>}
                </div>
                <div className="field field--span2">
                  <label className="field__label" htmlFor="phone">Contact phone</label>
                  <input
                    id="phone"
                    className={`field__input ${phoneError ? "is-invalid" : ""}`}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={normalizedPhone}
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? "phone-err" : undefined}
                    onChange={(event) => updateData({ contactPhone: normalizeIndianMobile(event.target.value) })}
                    onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
                  />
                  {phoneError && <p id="phone-err" className="field__hint field__hint--error">Enter a 10-digit mobile number (starts 6–9).</p>}
                </div>
              </div>
            </div>
          </div>

          <aside className="review-side">
            <div className="price-card">
              <h2 className="price-card__title">Order summary</h2>

              <div className="price-card__module-row">
                <div>
                  <p className="price-card__module-name">{headerName}</p>
                  <p className="price-card__module-count">{countLabel}</p>
                </div>
                {!pricing.isCustom && pricing.money && (
                  <p className="price-card__module-price">
                    {inr(pricing.money.subtotal)} <span>/ {pricing.cycle === "yearly" ? "year" : "month"}</span>
                  </p>
                )}
              </div>
              <div className="price-card__divider" />

              {pricing.isCustom ? (
                <p className="price-card__cycle" style={{ margin: 0 }}>
                  This configuration requires a custom quote. Our team will confirm pricing and reach out directly.
                </p>
              ) : pricing.isLoading ? (
                <p className="price-card__loading"><span className="spinner" /> Calculating price…</p>
              ) : pricing.isError || !pricing.money ? (
                <p className="field__hint field__hint--error">Couldn&apos;t calculate pricing. Please go back and try again.</p>
              ) : (
                <>
                  <div className="price-card__row"><span>Subtotal</span><span>{inr(pricing.money.subtotal)}</span></div>
                  <div className="price-card__row"><span>GST ({Math.round(pricing.money.gstRate * 100)}%)</span><span>{inr(pricing.money.gst)}</span></div>
                  <div className="price-card__divider" />
                  <div className="price-card__row price-card__row--total"><span>Total due today</span><span>{inr(pricing.money.total)}</span></div>

                  <div className="price-card__recurring">
                    <div className="price-card__row"><span>Recurring charge</span><span>{inr(pricing.money.total)} / {pricing.cycle === "yearly" ? "year" : "month"}</span></div>
                    <div className="price-card__row"><span>Billing cycle</span><span>{pricing.cycle === "yearly" ? "Yearly" : "Monthly"}</span></div>
                    <div className="price-card__row"><span>First renewal</span><span>{pricing.cycle === "yearly" ? "1 year" : "1 month"} after activation</span></div>
                  </div>
                </>
              )}

              <ul className="price-card__perks">
                <li>Admin workspace included</li>
                {!pricing.isCustom && <li>Secure payment via Razorpay</li>}
              </ul>

              <label className="checkbox">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>

              <button className="btn btn--primary btn--full" type="button" disabled={!canContinue} onClick={continueToPayment}>
                {pricing.isCustom ? "Continue" : "Continue to secure payment"}
              </button>
            </div>
          </aside>
        </div>

        <div className="screen__actions">
          <button className="btn btn--secondary" type="button" onClick={onBack}>Back</button>
        </div>
      </div>
    </section>
  );
}
