"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingWizard, OnboardingData } from "@/components/onboarding/OnboardingWizard";
import { normalizeDoctorsSelected } from "@/components/onboarding/reviewEditNavigation";
import {
  clearOnboardingCapability,
  ONBOARDING_SESSION_KEY,
  persistOnboardingCapability,
  persistOnboardingSession,
  readStoredOnboardingCapability,
  readStoredOnboardingSession,
} from "@/components/onboarding/onboardingSessionStorage";
import { OnboardingService } from "@/lib/api/services/onboarding.service";
import { FrontendApiError } from "@/lib/api/axios";
import "@/components/onboarding/onboarding-v2.css";

export function OnboardingContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("sessionId");
  const packageParam = searchParams.get("package");

  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = readStoredOnboardingSession<OnboardingData>() || {};
      const parsed = urlSessionId && saved.sessionId !== urlSessionId
        ? { sessionId: urlSessionId }
        : { ...saved };
      const capability = readStoredOnboardingCapability(parsed.sessionId);
      if (capability) parsed.verifiedToken = capability.verifiedToken;
      if (packageParam && !parsed.sessionId) {
        parsed.subscriptionPlan = packageParam;
        parsed.selectionType = "package";
      }
      return normalizeDoctorsSelected(parsed);
    }
    return {};
  });
  const restoreSessionId = useRef(urlSessionId || data.sessionId).current;
  const restoreStarted = useRef(false);
  const [loading, setLoading] = useState(!!restoreSessionId);

  // Keep resumable state in localStorage, but keep the session-bound capability in sessionStorage.
  // This survives a same-tab reload without putting the token in a URL or long-lived storage.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (
      data.status === "provisioned" ||
      data.status === "practitioner_setup_required" ||
      data.status === "quote_pending"
    ) {
      localStorage.removeItem(ONBOARDING_SESSION_KEY);
      clearOnboardingCapability(data.sessionId);
    } else {
      persistOnboardingSession(data);
      if (data.sessionId && data.verifiedToken && !data.reverificationRequired) {
        persistOnboardingCapability(data.sessionId, data.verifiedToken);
      } else if (data.reverificationRequired) {
        clearOnboardingCapability(data.sessionId);
      }
    }
  }, [data]);

  const restoreSession = useCallback(async (sessionId: string, verifiedToken?: string) => {
    try {
      const result = await OnboardingService.fetchSession(sessionId, verifiedToken);
      if (result.code === "REVERIFICATION_REQUIRED") {
        setData((previous) => normalizeDoctorsSelected({
          ...previous,
          sessionId,
          status: result.data?.status || previous.status,
          verifiedToken: undefined,
          reverificationRequired: true,
          recoveryIssue: undefined,
        }));
        return false;
      }
      if (result.success && result.data) {
        const restored = result.data as OnboardingData;
        setData(normalizeDoctorsSelected({
          ...restored,
          sessionId,
          verifiedToken: restored.verifiedToken || verifiedToken,
          reverificationRequired: false,
          recoveryIssue: undefined,
        }));
        return true;
      }
      return false;
    } catch (error) {
      const apiError = error as FrontendApiError;
      if (apiError.status === 401) {
        setData((previous) => ({
          ...previous,
          sessionId,
          verifiedToken: undefined,
          reverificationRequired: true,
          recoveryIssue: undefined,
        }));
      } else if (apiError.status === 404) {
        setData((previous) => ({
          ...previous,
          sessionId,
          status: "failed",
          reverificationRequired: false,
          recoveryIssue: "session_not_found",
        }));
      }
      return false;
    }
  }, []);

  // Restore either an explicitly linked session or the same session saved by this browser.
  useEffect(() => {
    if (!restoreSessionId || restoreStarted.current) return;
    restoreStarted.current = true;
    const fetchSession = async () => {
      try {
        await restoreSession(restoreSessionId, data.verifiedToken);
      } finally {
        setLoading(false);
      }
    };
    void fetchSession();
  }, [data.verifiedToken, restoreSession, restoreSessionId]);

  const reverifySession = useCallback(async (verifiedToken: string) => {
    if (!data.sessionId) return false;
    persistOnboardingCapability(data.sessionId, verifiedToken);
    return restoreSession(data.sessionId, verifiedToken);
  }, [data.sessionId, restoreSession]);

  const updateData = (newData: Partial<OnboardingData>) => setData((prev) => ({ ...prev, ...newData }));

  if (loading) {
    return (
      <div className="obv2" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p className="screen__subtitle" style={{ margin: 0 }}>
          <span className="spinner" /> Loading your session…
        </p>
      </div>
    );
  }

  return (
    <OnboardingWizard
      externalData={data}
      externalUpdateData={updateData}
      onSessionReverified={reverifySession}
    />
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="obv2" style={{ minHeight: "100vh" }} />}>
      <OnboardingContent />
    </Suspense>
  );
}
