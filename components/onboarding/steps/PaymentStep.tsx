"use client";

import { useState } from "react";
import { useRegisterOrgMutation } from "@/hooks/queries/useOnboarding";
import { loadRazorpayScript } from "@/lib/services/razorpay.service";
import { TERMS_VERSION } from "@/lib/legal";
import { FacilityType, RegisterPayload, RegisterResponse } from "@/lib/api/types/onboarding.types";
import { inr, useOrderPricing } from "../pricing";
import { OnboardingData } from "../OnboardingWizard";
import { SAFE_WORKSPACE_SETUP_ERROR } from "../safeErrorMessages";

interface Props {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

interface RzpResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RzpFailure { error?: { description?: string; reason?: string } }
interface RzpInstance {
  open: () => void;
  on: (event: string, cb: (r: RzpFailure) => void) => void;
}
type RzpConstructor = new (options: Record<string, unknown>) => RzpInstance;

export function PaymentStep({ onNext, onBack, updateData, data }: Props) {
  const pricing = useOrderPricing(data);
  const { mutate: registerOrg, isPending: registering } = useRegisterOrgMutation();
  const [rzpLoading, setRzpLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processing = registering || rzpLoading;

  const submit = () => {
    setErrorMsg(null);
    if (!data.verifiedToken || !data.orgName || !data.subdomain || !data.selectionType) {
      setErrorMsg("Missing core details. Please go back and complete the previous steps.");
      return;
    }

    const payload: RegisterPayload = {
      orgName: data.orgName,
      subdomain: data.subdomain,
      contactName: data.contactName || data.orgName,
      contactPhone: data.contactPhone,
      address: data.address,
      gstNumber: data.gstNumber,
      selectionType: data.selectionType,
      packageId: data.packageId,
      selectedModules: data.selectedModules,
      billingCycle: data.billingCycle,
      subscriptionPlan: data.subscriptionPlan,
      referralCode: data.referralCode,
      facilityType: data.facilityType as FacilityType | undefined,
      organizationType: data.facilityType,
      // Canonical subType.id (e.g. 'general-medicine'), omitted when no subtype was chosen.
      organizationSubType: data.specialization || undefined,
      // P5-DOC.ONB-A1 — only request owner-Doctor provisioning when doctors is actually selected.
      ownerPractitionerIntent: data.doctorsSelected ? !!data.ownerPractitionerIntent : undefined,
      ownerDoctorProfile:
        data.doctorsSelected && data.ownerPractitionerIntent ? data.ownerDoctorProfile : undefined,
      multiBranchEnabled: !!data.multiBranchEnabled,
      termsAccepted: !!data.termsAccepted,
      consent: {
        termsAccepted: !!data.termsAccepted,
        termsAcceptedAt: data.termsAcceptedAt || new Date().toISOString(),
        termsVersion: TERMS_VERSION,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
    };

    registerOrg(
      { payload, token: data.verifiedToken },
      {
        onSuccess: async (res: RegisterResponse) => {
          const razorpayOrderId = res.orderId || res.razorpayOrderId;
          if (res.status === "pending_payment" && razorpayOrderId) {
            setRzpLoading(true);
            const loaded = await loadRazorpayScript();
            if (!loaded) {
              setRzpLoading(false);
              setErrorMsg("Payment SDK failed to load. Check your connection and try again.");
              return;
            }
            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
            const sessionId = res.sessionId;

            const options: Record<string, unknown> = {
              key: res.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
              amount: res.amount,
              currency: res.currency,
              name: data.orgName,
              description: "Kaero Prescribe Subscription",
              order_id: razorpayOrderId,
              prefill: { name: data.contactName, email: data.email, contact: data.contactPhone },
              handler: async (response: RzpResponse) => {
                try {
                  const verifyRes = await fetch(`${BACKEND_URL}/onboarding/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature,
                      sessionId: sessionId || data.sessionId,
                    }),
                  });
                  const verifyData = (await verifyRes.json()) as { success?: boolean; sessionId?: string };
                  const finalSessionId = verifyData.sessionId || sessionId || data.sessionId;
                  if (verifyData.success) {
                    if (typeof window !== "undefined" && finalSessionId) {
                      const current = localStorage.getItem("kaero_onboarding_session");
                      const parsed = current ? JSON.parse(current) : {};
                      localStorage.setItem("kaero_onboarding_session", JSON.stringify({ ...parsed, sessionId: finalSessionId }));
                    }
                    updateData({ sessionId: finalSessionId });
                    onNext();
                  } else {
                    setRzpLoading(false);
                    setErrorMsg("Payment succeeded but setup hit an issue. Contact support@kaerogroup.com with txn: " + response.razorpay_payment_id);
                  }
                } catch {
                  updateData({ sessionId });
                  onNext();
                }
              },
              modal: { ondismiss: () => setRzpLoading(false) },
              theme: { color: "#1F5D50" },
            };

            const RazorpayCtor = (window as unknown as { Razorpay: RzpConstructor }).Razorpay;
            const rzp = new RazorpayCtor(options);
            rzp.on("payment.failed", (response: RzpFailure) => {
              setRzpLoading(false);
              setErrorMsg(`Payment unsuccessful: ${response.error?.description || response.error?.reason || "Please try a different payment method."}`);
            });
            rzp.open();
          } else {
            updateData({ sessionId: res.sessionId || data.sessionId });
            onNext();
          }
        },
        onError: () => setErrorMsg(SAFE_WORKSPACE_SETUP_ERROR),
      }
    );
  };

  return (
    <section className="screen">
      <div className="screen__container screen__container--narrow">
        <div className="payment-card">
          <p className="eyebrow">Step 5</p>
          <h1 className="screen__title">{pricing.isCustom ? "Submit your custom request" : "Ready to activate your workspace"}</h1>
          <p className="screen__subtitle">
            {pricing.isCustom
              ? "Our team will review your requirements and send a tailored quote."
              : "Everything's set. Complete payment to start provisioning."}
          </p>

          <div className="payment-card__total">
            <span className="payment-card__total-label">{pricing.isCustom ? "Estimated" : "Total due today"}</span>
            <span className="payment-card__total-amount">
              {pricing.isCustom ? "Custom quote" : pricing.money ? inr(pricing.money.total) : "—"}
            </span>
          </div>

          <button className="btn btn--primary btn--full" type="button" disabled={processing || (!pricing.isCustom && !pricing.money)} onClick={submit}>
            {processing
              ? <><span className="spinner" /> {rzpLoading ? "Finalising…" : "Processing…"}</>
              : pricing.isCustom ? "Submit quote request" : "Continue to secure payment"}
          </button>

          {!pricing.isCustom && <p className="payment-card__note">Your payment will be processed securely by Razorpay.</p>}
          {errorMsg && <p className="payment-card__error">{errorMsg}</p>}

          <div className="screen__actions screen__actions--center" style={{ marginTop: 16 }}>
            <button className="link-btn" type="button" onClick={onBack} disabled={processing}>Back to review</button>
          </div>
        </div>
      </div>
    </section>
  );
}
