"use client";

import { useEffect, useState } from "react";
import { useProvisioningStatusQuery, useResumeProvisioningMutation } from "@/hooks/queries/useOnboarding";
import { OnboardingData } from "../OnboardingWizard";
import {
  SAFE_NOT_RESUMABLE_ERROR,
  SAFE_SESSION_NOT_FOUND_ERROR,
  SAFE_WORKSPACE_SETUP_ERROR,
} from "../safeErrorMessages";
import { FrontendApiError } from "@/lib/api/axios";
import { ResumeProvisioningResponse } from "@/lib/api/types/onboarding.types";

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
  const [resumeAccepted, setResumeAccepted] = useState(false);
  const [resumeResponse, setResumeResponse] = useState<ResumeProvisioningResponse>();
  const [retryError, setRetryError] = useState<string>();

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

  const awaitingPaidResume = !!data.paidResumeRequired && !resumeAccepted && !resumeResponse;
  const { data: statusResp, isError, refetch } = useProvisioningStatusQuery(
    sessionId || "",
    !!sessionId && !awaitingPaidResume,
  );
  const { mutate: resumeProvisioning, isPending: resuming } = useResumeProvisioningMutation();
  const status = awaitingPaidResume
    ? "failed"
    : resumeResponse?.status === "provisioned"
    ? "provisioned"
    : resumeAccepted && statusResp?.status === "failed"
      ? "provisioning"
      : statusResp?.status || resumeResponse?.status || data.status;
  const isProvisioned = status === "provisioned";
  const isPractitionerSetup = status === "practitioner_setup_required";
  const isQuote = status === "quote_pending";
  const isTerminalRecovery = !!data.recoveryIssue;
  const isFailed = !isTerminalRecovery && (status === "failed" || isError);
  const inProgress = !!sessionId && !isProvisioned && !isPractitionerSetup && !isQuote && !isFailed && !isTerminalRecovery;

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
      updateData?.({ status: "failed" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProvisioned, isPractitionerSetup, isQuote, isFailed]);

  useEffect(() => {
    if (resumeAccepted && statusResp?.status === "provisioning") setResumeAccepted(false);
  }, [resumeAccepted, statusResp?.status]);

  useEffect(() => {
    if (!inProgress) return;
    const t = setInterval(() => setActiveIdx((i) => Math.min(i + 1, STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, [inProgress]);

  const workspaceUrl = `${data.subdomain || "yourworkspace"}.kaeroprescribe.com`;
  const dashboardUrl = resumeResponse?.dashboardUrl || statusResp?.dashboardUrl;

  const retryProvisioning = () => {
    if (!sessionId || resuming) return;
    setRetryError(undefined);
    if (!data.verifiedToken) {
      updateData?.({ reverificationRequired: true, recoveryIssue: undefined });
      return;
    }
    resumeProvisioning(data.verifiedToken, {
      onSuccess: (response) => {
        if (response.sessionId !== sessionId) {
          setRetryError(SAFE_WORKSPACE_SETUP_ERROR);
          return;
        }
        setResumeResponse(response);
        if (response.status === "provisioning") {
          setResumeAccepted(true);
          updateData?.({ status: "provisioning", paidResumeRequired: false, recoveryIssue: undefined });
          void refetch();
        } else {
          updateData?.({ status: "provisioned", paidResumeRequired: false, recoveryIssue: undefined });
        }
      },
      onError: (error) => {
        const apiError = error as FrontendApiError;
        if (apiError.status === 401) {
          updateData?.({
            verifiedToken: undefined,
            reverificationRequired: true,
            recoveryIssue: undefined,
          });
        } else if (apiError.status === 404) {
          updateData?.({ recoveryIssue: "session_not_found" });
        } else if (apiError.status === 409 && apiError.code === "NOT_RESUMABLE") {
          updateData?.({ recoveryIssue: "not_resumable" });
        } else {
          setRetryError(SAFE_WORKSPACE_SETUP_ERROR);
        }
      },
    });
  };

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
                {dashboardUrl ? dashboardUrl.replace(/^https?:\/\//, "") : workspaceUrl}
                {statusResp?.adminEmail ? ` · Admin login sent to ${statusResp.adminEmail}` : ""}
              </p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--primary" type="button" onClick={() => { clearStorage(); window.location.href = dashboardUrl || "#"; }}>
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
                <button className="btn btn--primary" type="button" onClick={() => { clearStorage(); window.location.href = dashboardUrl || "#"; }}>
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
              <p className="screen__subtitle">{retryError || SAFE_WORKSPACE_SETUP_ERROR}</p>
              <div className="screen__actions screen__actions--center">
                <button className="btn btn--primary" type="button" disabled={resuming} onClick={retryProvisioning}>
                  {resuming ? <><span className="spinner" /> Resuming…</> : "Try again"}
                </button>
              </div>
            </div>
          )}

          {data.recoveryIssue === "not_resumable" && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--error" aria-hidden>!</div>
              <h1 className="screen__title">This setup needs support.</h1>
              <p className="screen__subtitle">{SAFE_NOT_RESUMABLE_ERROR}</p>
              <div className="screen__actions screen__actions--center">
                <a className="btn btn--secondary" href="mailto:support@kaerogroup.com">Contact support</a>
              </div>
            </div>
          )}

          {data.recoveryIssue === "session_not_found" && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--error" aria-hidden>!</div>
              <h1 className="screen__title">Session not found</h1>
              <p className="screen__subtitle">{SAFE_SESSION_NOT_FOUND_ERROR}</p>
              <div className="screen__actions screen__actions--center">
                <a className="btn btn--secondary" href="mailto:support@kaerogroup.com">Contact support</a>
              </div>
            </div>
          )}

          {!sessionId && !data.recoveryIssue && (
            <div className="provisioning__state">
              <div className="result-icon result-icon--error" aria-hidden>!</div>
              <h1 className="screen__title">Session not found</h1>
              <p className="screen__subtitle">{SAFE_SESSION_NOT_FOUND_ERROR}</p>
              <div className="screen__actions screen__actions--center">
                <a className="btn btn--secondary" href="mailto:support@kaerogroup.com">Contact support</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
