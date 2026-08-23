"use client";

import { useMemo, useState } from "react";
import { useCatalogQuery, useOrgTypesQuery } from "@/hooks/queries/useOnboarding";
import { inr, moduleCountLabel, selectionHeaderName, useOrderPricing } from "../pricing";
import { orgSubTypeLabel, orgTypeName, ScreenId } from "../onboardingConfig";
import {
  isValidIndianMobile,
  isValidIndianPin,
  normalizeAddressLine,
  normalizeIndianMobile,
  normalizePostalCode,
} from "@/lib/validations/normalize";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
  goTo?: (s: ScreenId) => void;
}

export function ReviewStep({ onNext, onBack, updateData, data, goTo }: Props) {
  const { data: catalog } = useCatalogQuery();
  const { data: orgTypesRes } = useOrgTypesQuery();

  const [address, setAddress] = useState(data.address?.street || "");
  const [city, setCity] = useState(data.address?.city || "");
  const [pin, setPin] = useState(normalizePostalCode(data.address?.postalCode || ""));
  const [phone, setPhone] = useState(normalizeIndianMobile(data.contactPhone || ""));
  const [terms, setTerms] = useState(!!data.termsAccepted);
  const [touched, setTouched] = useState<{ phone?: boolean; pin?: boolean }>({});

  // Both optional (backend persists them only when present), but a non-empty value must be canonical.
  const phoneValid = phone === "" || isValidIndianMobile(phone);
  const pinValid = pin === "" || isValidIndianPin(pin);
  const phoneError = touched.phone && !phoneValid;
  const pinError = touched.pin && !pinValid;

  const pricing = useOrderPricing(data);

  const modules = catalog?.modules || [];
  const packages = catalog?.packages || [];
  const label = (slug: string) => modules.find((m) => m.slug === slug)?.label || slug;

  const isPackage = data.selectionType === "package";
  const activePackage = isPackage ? packages.find((p) => p._id === data.packageId) : undefined;

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

  const canContinue = terms && phoneValid && pinValid && (pricing.isCustom || !!pricing.money);

  const continueToPayment = () => {
    if (!terms || !(pricing.isCustom || !!pricing.money)) return;
    if (!phoneValid || !pinValid) { setTouched({ phone: true, pin: true }); return; }
    updateData({
      address: {
        ...(data.address || {}),
        street: normalizeAddressLine(address),
        city: normalizeAddressLine(city),
        postalCode: pin,
      },
      contactPhone: phone, // 10 national digits; backend normalizePhone canonicalizes to E.164
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
                <button className="link-btn" type="button" onClick={() => goTo?.("facility")}>Edit</button>
              </div>
              <p className="review-card__primary">{data.orgName || "—"}</p>
              <p className="review-card__secondary">{orgTypeLine || "—"}</p>
              {data.doctorsSelected && (
                <p className="review-card__secondary">
                  Owner role: <strong>{data.ownerPractitionerIntent ? "Practicing Doctor" : "Organization Administrator only"}</strong>
                </p>
              )}
            </div>

            <div className="review-card">
              <div className="review-card__header">
                <h2 className="review-card__title">Administrator</h2>
                <button className="link-btn" type="button" onClick={() => goTo?.("details")}>Edit</button>
              </div>
              <p className="review-card__primary">{data.contactName || "—"}</p>
              <p className="review-card__secondary">{data.email || "—"}</p>
            </div>

            <div className="review-card">
              <div className="review-card__header">
                <h2 className="review-card__title">Modules</h2>
                <button className="link-btn" type="button" onClick={() => goTo?.("modules")}>Edit</button>
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
                  <input id="addr" className="field__input" autoComplete="address-line1" maxLength={120} placeholder="Street, area" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="city">City</label>
                  <input id="city" className="field__input" autoComplete="address-level2" maxLength={60} placeholder="Kolkata" value={city} onChange={(e) => setCity(e.target.value)} />
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
                    value={pin}
                    aria-invalid={!!pinError}
                    aria-describedby={pinError ? "pin-err" : undefined}
                    onChange={(e) => setPin(normalizePostalCode(e.target.value))}
                    onBlur={() => setTouched((t) => ({ ...t, pin: true }))}
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
                    value={phone}
                    aria-invalid={!!phoneError}
                    aria-describedby={phoneError ? "phone-err" : undefined}
                    onChange={(e) => setPhone(normalizeIndianMobile(e.target.value))}
                    onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
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
                    <div className="price-card__row"><span>Next billing date</span><span>Billing starts after successful payment</span></div>
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
