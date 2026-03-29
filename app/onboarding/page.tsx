import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { OnboardingThemeProvider } from "@/components/onboarding/OnboardingThemeProvider";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OnboardingPage() {
  return (
    <OnboardingThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative" style={{ backgroundColor: '#F9FAFB' }}>
        <Link 
          href="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium text-sm group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Home
        </Link>
        
        <div className="w-full max-w-5xl animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Kaero Prescribe Setup
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Welcome aboard. Let's get your healthcare facility's digital workspace up and running in just a few steps.
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100/60 ring-1 ring-slate-900/5">
            <OnboardingWizard />
          </div>
        </div>
      </div>
    </OnboardingThemeProvider>
  );
}
