"use client";

import { useState } from "react";
import { useCatalogQuery } from "@/hooks/queries/useOnboarding";
import { computePricing, inr } from "../pricing";
import { orgTypeName, ScreenId } from "../onboardingConfig";
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

  const [address, setAddress] = useState(data.address?.street || "");
  const [city, setCity] = useState(data.address?.city || "");
  const [pin, setPin] = useState(data.address?.postalCode || "");
  const [phone, setPhone] = useState(data.contactPhone || "");
  const [terms, setTerms] = useState(!!data.termsAccepted);

  const pricing = computePricing(data, catalog);

  const modules = catalog?.modules || [];
  const label = (slug: string) => modules.find((m) => m.slug === slug)?.label || slug;
  let selectedLabels: string[] = [];
  if (data.selectionType === "package" && data.packageId) {
    const p = (catalog?.packages || []).find((x) => x._id === data.packageId);
    selectedLabels = p?.isCustom ? ["Custom configuration"] : (p?.modules || []).map(label);
  } else {
    selectedLabels = (data.selectedModules || []).map(label);
  }

  const orgTypeLine = [orgTypeName(data.facilityType), data.specialization].filter(Boolean).join(" · ");

  const continueToPayment = () => {
    if (!terms) return;
    updateData({
      address: { ...(data.address || {}), street: address, city, postalCode: pin },
      contactPhone: phone,
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
                {selectedLabels.length ? selectedLabels.map((l, i) => <li key={i}>{l}</li>) : <li>No modules selected</li>}
              </ul>
            </div>

            <div className="review-card">
              <h2 className="review-card__title">Contact &amp; address</h2>
              <div className="form form--grid form--compact" style={{ marginTop: 12 }}>
                <div className="field field--span2">
                  <label className="field__label" htmlFor="addr">Address</label>
                  <input id="addr" className="field__input" placeholder="Street, area" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="city">City</label>
                  <input id="city" className="field__input" placeholder="Kolkata" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="pin">PIN code</label>
                  <input id="pin" className="field__input" placeholder="700001" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} />
                </div>
                <div className="field field--span2">
                  <label className="field__label" htmlFor="phone">Contact phone</label>
                  <input id="phone" className="field__input" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <aside className="review-side">
            <div className="price-card">
              <h2 className="price-card__title">Order summary</h2>
              {pricing.isCustom ? (
                <>
                  <div className="price-card__row"><span>Plan</span><span>Custom</span></div>
                  <div className="price-card__divider" />
                  <div className="price-card__row price-card__row--total"><span>Total</span><span>Custom quote</span></div>
                  <p className="price-card__cycle">Our team will confirm pricing.</p>
                </>
              ) : (
                <>
                  <div className="price-card__row"><span>Subtotal</span><span>{inr(pricing.subtotal)}</span></div>
                  <div className="price-card__row"><span>GST (18%)</span><span>{inr(pricing.gst)}</span></div>
                  {pricing.referralDiscount > 0 && (
                    <div className="price-card__row price-card__row--discount"><span>Referral discount</span><span>−{inr(pricing.referralDiscount)}</span></div>
                  )}
                  <div className="price-card__divider" />
                  <div className="price-card__row price-card__row--total"><span>Total</span><span>{inr(pricing.total)}</span></div>
                  <p className="price-card__cycle">Billed {pricing.cycle === "yearly" ? "yearly" : "monthly"}</p>
                </>
              )}

              <label className="checkbox">
                <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>

              <button className="btn btn--primary btn--full" type="button" disabled={!terms} onClick={continueToPayment}>
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
