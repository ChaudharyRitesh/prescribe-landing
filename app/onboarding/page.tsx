"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingWizard, OnboardingData } from "@/components/onboarding/OnboardingWizard";
import { OnboardingThemeProvider } from "@/components/onboarding/OnboardingThemeProvider";
import { LavaLampBackground } from "@/components/onboarding/LavaLampBackground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Box } from "@mui/material";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kaero_onboarding_session");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [loading, setLoading] = useState(!!sessionId);

  // Sync with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kaero_onboarding_session", JSON.stringify(data));
    }
  }, [data]);

  // Load session from backend if sessionId is present in URL query
  useEffect(() => {
    if (sessionId) {
      const fetchSession = async () => {
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
          const res = await fetch(`${apiBase}/onboarding/session/${sessionId}`);
          const result = await res.json();
          if (result.success && result.data) {
            setData(result.data);
          }
        } catch (err) {
          console.error("Failed to load session:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSession();
    }
  }, [sessionId]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  if (loading) {
    return (
      <OnboardingThemeProvider facilityType={data.facilityType}>
        <LavaLampBackground facilityType={data.facilityType} />
        <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-[24px] p-12 shadow-2xl flex flex-col items-center justify-center max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Loading Custom Proposal</h3>
            <p className="text-sm text-slate-500">Please wait while we retrieve your negotiated pricing and workspace settings...</p>
          </div>
        </Box>
      </OnboardingThemeProvider>
    );
  }

  return (
    <OnboardingThemeProvider facilityType={data.facilityType}>
      <LavaLampBackground facilityType={data.facilityType} />
      
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: { xs: 4, sm: 8 } }}>
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group"
          style={{ zIndex: 10 }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="font-semibold">Back to Home</span>
        </Link>
        
        <div className="w-full max-w-5xl animate-fade-in relative" style={{ zIndex: 5 }}>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Kaero Prescribe Setup
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Welcome aboard. Let's get your healthcare facility's digital workspace up and running in just a few steps.
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100/60 ring-1 ring-slate-900/5">
            <OnboardingWizard externalData={data} externalUpdateData={updateData} />
          </div>
        </div>
      </Box>
    </OnboardingThemeProvider>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
