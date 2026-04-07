"use client";

import { useState, useEffect } from "react";
import { OnboardingWizard, OnboardingData } from "@/components/onboarding/OnboardingWizard";
import { OnboardingThemeProvider } from "@/components/onboarding/OnboardingThemeProvider";
import { LavaLampBackground } from "@/components/onboarding/LavaLampBackground";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Box } from "@mui/material";

export default function OnboardingPage() {
  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kaero_onboarding_session");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // Sync with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kaero_onboarding_session", JSON.stringify(data));
    }
  }, [data]);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

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
