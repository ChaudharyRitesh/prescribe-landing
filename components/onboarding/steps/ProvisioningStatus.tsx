"use client";

import { useEffect, useState } from "react";
import { useProvisioningStatusQuery } from "@/hooks/queries/useOnboarding";
import { OnboardingData } from "../OnboardingWizard";

interface Props {
  data: OnboardingData;
  updateData?: (newData: Partial<OnboardingData>) => void;
}

const STEPS = [
  "Organization created",
  "Administrator account created",
  "Configuring selected modules",
  "Preparing workspace",
  "Finalizing setup",
];

export function ProvisioningStatus({ data, updateData }: Props) {
  const [sessionId, setSessionId] = useState(data.sessionId);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (data.sessionId) {
      setSessionId(data.sessionId);
    } else if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kaero_onboarding_session");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.sessionId) setSessionId(parsed.sessionId);
        } catch {
          /* ignore malformed storage */
        }
      }
    }
  }, [data.sessionId]);

  const { data: statusResp, isError } = useProvisioningStatusQuery(sessionId || "", !!sessionId);
  const status = statusResp?.status;
  const isProvisioned = status === "provisioned";
  const isPractitionerSetup = status === "practitioner_setup_required";
  const isQuote = status === "quote_pending";
  const isFailed = status === "failed" || isError;
  const inProgress = !!sessionId && !isProvisioned && !isPractitionerSetup && !isQuote && !isFailed;

  const clearStorage = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    } catch {
      /* best-effort cleanup */
    }
  };

  useEffect(() => {
    if (isProvisioned || isPractitionerSetup || isQuote) {
      clearStorage();
      updateData?.({ status: isProvisioned ? "provisioned" : isPractitionerSetup ? "practitioner_setup_required" : "quote_pending" });
    } else if (isFailed) {
      if (typeof window !== "undefined") localStorage.removeItem("kaero_onboarding_session");
      updateData?.({ status: "failed" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProvisioned, isPractitionerSetup, isQuote, isFailed]);

  useEffect(() => {
    if (!inProgress) return;
    const t = setInterval(() => setActiveIdx((i) => Math.min(i + 1, STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, [inProgress]);

  const workspaceUrl = `${data.subdomain || "yourworkspace"}.kaeroprescribe.com`;

  return (
    <section className="screen">
      <div className="screen__container screen__container--narrow">
        <div className="provisioning">
          {inProgress && (
            <div className="provisioning__state">
              <p className="eyebrow">Step 6</p>
              <h1 className="screen__title">Setting up your workspace</h1>
              <p className="screen__subtitle">
                We&apos;re preparing everything you selected. Please keep this window open — this can take a couple of minutes.
              </p>
              <ul className="checklist">
                {STEPS.map((s, i) => (
                  <li className="checklist__item" data-status={i < activeIdx ? "done" : i === activeIdx ? "active" : "pending"} key={s}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isProvisioned && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--success" aria-hidden>✓</div>
              <h1 className="screen__title">Your workspace is ready.</h1>
              <p className="screen__subtitle">
                {statusResp?.dashboardUrl ? statusResp.dashboardUrl.replace(/^https?:\/\//, "") : workspaceUrl}
                {statusResp?.adminEmail ? ` · Admin login sent to ${statusResp.adminEmail}` : ""}
              </p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--primary" type="button" onClick={() => { clearStorage(); window.location.href = statusResp?.dashboardUrl || "#"; }}>
                  Open Kaero Prescribe
                </button>
              </div>
            </div>
          )}

          {isPractitionerSetup && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--pending" aria-hidden>●</div>
              <h1 className="screen__title">Your workspace is ready — one more step for your Doctor setup.</h1>
              <p className="screen__subtitle">
                Your organization and Admin account are set up and your login has been emailed. We couldn&apos;t
                finish setting up your personal Doctor workspace automatically. Log in as Admin and use
                <strong> &ldquo;I also practice as a Doctor&rdquo;</strong> in your profile to complete it — nothing was lost.
              </p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--primary" type="button" onClick={() => { clearStorage(); window.location.href = statusResp?.dashboardUrl || "#"; }}>
                  Open Admin dashboard
                </button>
              </div>
            </div>
          )}

          {isQuote && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--pending" aria-hidden>●</div>
              <h1 className="screen__title">Your configuration has been submitted.</h1>
              <p className="screen__subtitle">
                Your selected configuration requires a custom quote. Our team will contact you to confirm pricing and complete setup.
              </p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--secondary" type="button" onClick={() => { clearStorage(); window.location.href = "/"; }}>
                  Back to home
                </button>
              </div>
            </div>
          )}

          {isFailed && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--error" aria-hidden>!</div>
              <h1 className="screen__title">We couldn&apos;t finish setting up your workspace.</h1>
              <p className="screen__subtitle">
                {statusResp?.failureReason ||
                  "Your payment was received, but something interrupted the setup. No charges were duplicated — you can safely try again."}
              </p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--primary" type="button" onClick={() => { if (typeof window !== "undefined") localStorage.removeItem("kaero_onboarding_session"); window.location.href = "/onboarding"; }}>
                  Try again
                </button>
              </div>
            </div>
          )}

          {!sessionId && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--error" aria-hidden>!</div>
              <h1 className="screen__title">Session not found</h1>
              <p className="screen__subtitle">We couldn&apos;t find your active session. Please start over.</p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--secondary" type="button" onClick={() => window.location.reload()}>Restart</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
