"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingWizard, OnboardingData } from "@/components/onboarding/OnboardingWizard";
import "@/components/onboarding/onboarding-v2.css";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const packageParam = searchParams.get("package");

  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kaero_onboarding_session");
      const parsed = saved ? JSON.parse(saved) : {};
      if (packageParam && !parsed.sessionId) {
        parsed.subscriptionPlan = packageParam;
        parsed.selectionType = "package";
      }
      return parsed;
    }
    return {};
  });
  const [loading, setLoading] = useState(!!sessionId);

  // Persist to localStorage (never the JWT — kept in memory only, P1-2).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (data.status === "provisioned" || data.status === "quote_pending" || data.status === "failed") {
      localStorage.removeItem("kaero_onboarding_session");
    } else {
      const persistable = { ...data };
      delete persistable.verifiedToken;
      localStorage.setItem("kaero_onboarding_session", JSON.stringify(persistable));
    }
  }, [data]);

  // Resume a session referenced in the URL (e.g. an approved custom quote link).
  useEffect(() => {
    if (!sessionId) return;
    const fetchSession = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiBase}/onboarding/session/${sessionId}`);
        const result = await res.json();
        if (result.success && result.data) setData(result.data);
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

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

  return <OnboardingWizard externalData={data} externalUpdateData={updateData} />;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="obv2" style={{ minHeight: "100vh" }} />}>
      <OnboardingContent />
    </Suspense>
  );
}
